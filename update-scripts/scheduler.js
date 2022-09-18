const cron = require('node-schedule');
const { runScript } = require('./utils');
const { modes, DEBUG } = require('./constants');

const fetchUsersList = require('./fetch-users-list');
const fetchMapsForUsers = require('./fetch-beatmaps-for-users');
const fetchMapInfo = require('./fetch-map-info');
const calculateTopMappers = require('./top-mappers');
const calculateRankings = require('./rankings');
const organizeData = require('./organize-data');

let jobIsRunning = false;

const updateModeData = (mode = modes.osu) => {
  return Promise.resolve()
    .then(() => fetchUsersList(mode))
    .then(() => fetchMapsForUsers(mode))
    .then(() => fetchMapInfo(mode))
    .then(() => calculateRankings(mode))
    .then(() => calculateTopMappers(mode))
    .then(() => organizeData(mode))
    .then(() => {
      if (!DEBUG) {
        console.log('Saved all info, updating origin');
        return runScript('push-safe.sh');
      } else {
        console.log('Saved all info, debug is on - not updating origin');
      }
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};

const job = () => {
  if (jobIsRunning) {
    console.log('Updater is already running');
    return;
  }

  jobIsRunning = true;
  return Promise.resolve()
    .then(() => updateModeData(modes.osu))
    .then(() => updateModeData(modes.mania))
    .then(() => updateModeData(modes.taiko))
    .then(() => updateModeData(modes.fruits))
    .then(() => {
      console.log('Finished an updater cron job');
      jobIsRunning = false;
    });
};

console.log('Starting scheduler', { DEBUG });
cron.scheduleJob('0 3 * * *', job);
job();
