'use strict';

const axios = require('./axios');
const _ = require('lodash/fp');
const fs = require('fs');
const { ppBlockSize, ppBlockMapCount, DEBUG, modes } = require('./constants');
const {
  uniq,
  truncateFloat,
  delay,
  files,
  simplifyMods,
  parallelRun,
  writeJson,
  readJson,
  writeFileSync,
} = require('./utils');

const apikey = JSON.parse(fs.readFileSync('./config.json')).apikey;

const getUrl = (userId, modeId, limit) =>
  `https://osu.ppy.sh/api/get_user_best?k=${apikey}&u=${userId}&limit=${limit}&type=id&m=${modeId}`;
const getUniqueMapModId = (score) => `${score.beatmap_id}_${score.enabled_mods}`;
const getMagnitudeByIndex = (x) => Math.pow(Math.pow(x - 100, 2) / 10000, 20); // ((x-100)^2/10000)^20

let maps = {};
let usersMaps = {};
let usersMapsDate = {};
let peoplePerPpBlocks = [];
let ppByAccByMap = new Map();

const calculatePp99 = (mapModId) => {
  const ppByAcc = ppByAccByMap.get(mapModId);
  if (!ppByAcc) return 0;

  const ppByAccAsArray = Array.from(ppByAcc);
  if (ppByAccAsArray.length === 0) return 0;

  ppByAccAsArray.sort((a, b) => {
    // higher combo first
    if (a[1].maxcombo < b[1].maxcombo) return 1;
    if (a[1].maxcombo > b[1].maxcombo) return -1;
    // closer accuracy to 99% second
    return Math.abs(a[0] - 99) - Math.abs(b[0] - 99);
  });

  // If we already have a 99% score with 0 misses, just use the pp value from there
  const [acc0, score0] = ppByAccAsArray[0];
  if (acc0 === '99' && score0.countmiss === 0) {
    return score0.pp;
  }

  // Only take the best 7 scores to calculate
  const subArray = ppByAccAsArray.slice(0, 7);
  const ppPerAccSum = subArray.reduce((sum, [acc, score]) => {
    return sum + score.pp * acc;
  }, 0);

  // Average pp for 99% accuracy
  return truncateFloat(ppPerAccSum / subArray.length / 99);
};

const trimScoreForStats = _.pick([
  'maxcombo',
  'count50',
  'count100',
  'count300',
  'countmiss',
  'user_id',
  'score_id',
  'rank',
  'pp',
]);

const writeMapPpStats = (mapModId, mode) => {
  const ppByAcc = ppByAccByMap.get(mapModId);
  writeFileSync(files.beatmapScores(mode, mapModId), JSON.stringify(Object.fromEntries(ppByAcc)));
};

const recordData = (data, modeId) => {
  const topMapsPpSum = data.slice(0, ppBlockMapCount).reduce((sum, score) => {
    return sum + parseFloat(score.pp);
  }, 0);
  const ppBlockValue = Math.floor(Math.round(topMapsPpSum / ppBlockMapCount) / ppBlockSize);
  peoplePerPpBlocks[ppBlockValue] = (peoplePerPpBlocks[ppBlockValue] || 0) + 1;

  data.forEach((score, index) => {
    Object.keys(score).forEach((key) => {
      const parsed = Number(score[key]);
      score[key] = isNaN(parsed) ? score[key] : parsed;
    });
    score.enabled_mods = simplifyMods(score.enabled_mods, modeId);
    const mapModId = getUniqueMapModId(score);
    const acc =
      (100 * (score.count300 + score.count100 / 3 + score.count50 / 6)) /
      (score.countmiss + score.count50 + score.count100 + score.count300);
    if (!maps[mapModId]) {
      maps[mapModId] = {
        m: score.enabled_mods,
        b: score.beatmap_id,
        x: getMagnitudeByIndex(index),
      };
    } else {
      const currentMap = maps[mapModId];
      currentMap.x += getMagnitudeByIndex(index);
    }

    // Recording pp for different accuracies for every map (separate files)
    const shortAcc = truncateFloat(acc, 1); // Truncate to XX.X % format
    const trimmedScore = trimScoreForStats(score);
    if (!ppByAccByMap.has(mapModId)) {
      ppByAccByMap.set(mapModId, new Map([[shortAcc, trimmedScore]]));
    } else {
      const ppByAcc = ppByAccByMap.get(mapModId);
      // Recording highest combo score for every accuracy
      if (!ppByAcc.has(shortAcc) || ppByAcc.get(shortAcc).maxcombo < trimmedScore.maxcombo) {
        ppByAcc.set(shortAcc, trimmedScore);
      }
    }
  });
};

const fetchUserBeatmaps = (userId, modeId, scoresCount, retryCount = 0) => {
  if (retryCount > 3) {
    return Promise.reject(new Error('Too many retries'));
  }
  retryCount && console.log(`Retry #${retryCount}`);
  return axios.get(getUrl(userId, modeId, scoresCount)).catch((err) => {
    console.log('Error:', err.message);
    return delay(5000).then(() => fetchUserBeatmaps(userId, modeId, scoresCount, retryCount + 1));
  });
};

const fetchUser = ({ userId, modeId, shouldRecordScores }) => {
  return fetchUserBeatmaps(userId, modeId, shouldRecordScores ? 100 : 20)
    .then(({ data }) => {
      if (shouldRecordScores) {
        // Recording as one string for compression sake
        usersMaps[userId] = data && data.map((d) => `${d.beatmap_id}_${d.enabled_mods}_${d.pp}`);
        usersMapsDate[userId] = Math.floor(Date.now() / 1000 / 60); // unix minutes
      }
      recordData(data, modeId);
    })
    .catch((error) => {
      console.log('\x1b[33m%s\x1b[0m', error.message);
    });
};

module.exports = async (mode) => {
  console.log(`1. FETCHING MAPS LIST - ${mode.text}`);
  maps = {};
  usersMaps = {};
  usersMapsDate = {};
  peoplePerPpBlocks = [];
  ppByAccByMap = new Map();

  let fullUsersList = [];
  try {
    fullUsersList = (await readJson(files.userIdsList(mode))).sort((a, b) => b.pp - a.pp);
  } catch (e) {
    console.log('Error parsing ' + files.userIdsList(mode));
  }
  const uniqueUsersList = uniq(fullUsersList, (user) => user.id);
  // const fetchPromises = [];
  const items = uniqueUsersList.slice(...(DEBUG ? [0, 100] : []));
  console.log('Fetching scores of all users to find the list of popular maps...');
  await parallelRun({
    items,
    minRequestTime: 100,
    job: (user) => {
      const index = items.indexOf(user);
      const shouldRecordScores = index < 11000;
      return fetchUser({
        userId: user.id,
        modeId: mode.id,
        shouldRecordScores,
      });
    },
  });

  console.log(`${Object.keys(maps).length} unique maps found! Saving.`);
  Object.keys(maps).forEach((mapModId) => {
    maps[mapModId].pp99 = calculatePp99(mapModId);
    writeMapPpStats(mapModId, mode);
    maps[mapModId].x = truncateFloat(maps[mapModId].x);
    const ppBlockValue = Math.floor(Math.round(maps[mapModId].pp99) / ppBlockSize);
    maps[mapModId].adj = peoplePerPpBlocks[ppBlockValue] || 1;
  });
  const arrayMaps = Object.keys(maps).map((mapModId) => maps[mapModId]);
  await writeJson(files.mapsList(mode), arrayMaps);
  console.log('Saving info about PP blocks too');
  await writeJson(files.ppBlocks(mode), peoplePerPpBlocks);
  console.log('Saving users maps list');
  await writeJson(files.userMapsList(mode), usersMaps);
  await writeJson(files.userMapsDates(mode), usersMapsDate);
  console.log(`Done fetching list of beatmaps! (${mode.text})`);

  // Clear for garbage collection?
  maps = undefined;
  ppByAccByMap = undefined;
  usersMaps = undefined;
  usersMapsDate = undefined;
  peoplePerPpBlocks = undefined;
};

// module.exports(modes.osu);
