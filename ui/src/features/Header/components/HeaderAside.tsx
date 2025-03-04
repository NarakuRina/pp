import { FiTwitter } from 'react-icons/fi';
import { SiOsu } from 'react-icons/si';
import { TbBrandReddit } from 'react-icons/tb';

import { useMetadata } from '@/hooks/useMetadata';
import { useMode } from '@/hooks/useMode';
import { colors, space, styled } from '@/styles';
import { getUserUrl } from '@/utils/externalLinks';

import { Settings } from './Settings';
import { SupportButton } from './SupportButton';

const IconOsu = styled(SiOsu, {
  width: '1.25em',
  height: '1.25em',
  color: colors.textPrimary,
});
const IconTwitter = styled(FiTwitter, {
  width: '1.4em',
  height: '1.4em',
  color: colors.textPrimary,
  strokeWidth: '1.3px',
});
const IconReddit = styled(TbBrandReddit, {
  width: '1.4em',
  height: '1.4em',
  color: colors.textPrimary,
  strokeWidth: '1.3px',
});

const RowBlock = styled('div', {
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',

  '> svg': {
    marginLeft: space.sm,
  },

  '> a': {
    lineHeight: 1,
  },

  '> * + *': {
    paddingLeft: space.sm,
  },
});

const Aside = styled('aside', {
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  marginLeft: 'auto',
  gap: space.md,
  '@wrappedHeader': {
    marginRight: 'auto',
  },
});

const AsideInfoBlock = styled('div', {
  columnGap: space.lg,
  '@wrappedHeader': {
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
  },
});

function LastUpdatedMessage() {
  const mode = useMode();
  const { isLoading, error, data: metadata } = useMetadata();

  let message = 'unknown error';

  if (!mode) {
    return null;
  } else if (isLoading) {
    message = 'loading...';
  } else if (metadata) {
    message = `updated: ${new Date(metadata.lastUpdated).toLocaleDateString()}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return <div>{message}</div>;
}

export function HeaderAside({ themeToggle }: { themeToggle: React.ReactNode }) {
  return (
    <Aside>
      <Settings themeToggle={themeToggle} />
      <AsideInfoBlock>
        <LastUpdatedMessage />
        <RowBlock>
          <span>contact</span>
          <a
            href="https://www.reddit.com/message/compose/?to=grumd"
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconReddit title="reddit" aria-label="reddit" />
          </a>
          <a href="https://twitter.com/grumd_osu" target="_blank" rel="noreferrer noopener">
            <IconTwitter title="twitter" aria-label="twitter" />
          </a>
          <a href={getUserUrl(530913)} target="_blank" rel="noreferrer noopener">
            <IconOsu title="osu" aria-label="osu" />
          </a>
        </RowBlock>
        <RowBlock>
          <SupportButton />
        </RowBlock>
      </AsideInfoBlock>
    </Aside>
  );
}
