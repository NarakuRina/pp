import React, { Component } from 'react';
import toBe from 'prop-types';
import classNames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './top-bar.scss';

import { routes } from 'constants/routes';

import ParamLink from 'components/ParamLink/ParamLink';

const mapStateToProps = (state, props) => {
  const mode = props.match.params.mode;
  return {
    lastUpdated: state.metadata[mode].lastUpdated,
    lastUpdatedTime: state.metadata[mode].lastUpdatedTime,
    isLoading: state.metadata[mode].isLoading,
    isLoadingData: state.mapsData[mode].isLoading,
    itemsCount: state.mapsData[mode].data.length,
  };
};

class TopBar extends Component {
  static propTypes = {
    lastUpdated: toBe.string,
    lastUpdatedTime: toBe.string,
    isLoading: toBe.bool.isRequired,
    isLoadingData: toBe.bool.isRequired,
    itemsCount: toBe.number.isRequired,
    match: toBe.object,
    location: toBe.object,
  };

  render() {
    const {
      isLoading,
      isLoadingData,
      lastUpdated,
      lastUpdatedTime,
      itemsCount,
      match,
      location,
    } = this.props;
    return (
      <header className="top-bar">
        <div className="vertical-menus">
          <nav>
            <ul>
              <div className="pp-word">pp</div>
              <li>
                <NavLink to={routes.maps.path(match.params)}>maps</NavLink>
              </li>
              <li>
                <NavLink to={routes.mappers.path(match.params)}>mappers</NavLink>
              </li>
              <li>
                <NavLink to={routes.rankings.path(match.params)}>rankings</NavLink>
              </li>
            </ul>
          </nav>
          <nav>
            <ul>
              <li>
                <ParamLink match={match} location={location} params={{ mode: 'osu' }}>
                  osu
                </ParamLink>
              </li>
              <li>
                <ParamLink match={match} location={location} params={{ mode: 'mania' }}>
                  mania
                </ParamLink>
              </li>
              <li>
                <ParamLink match={match} location={location} params={{ mode: 'taiko' }}>
                  taiko
                </ParamLink>
              </li>
              <li>
                <ParamLink match={match} location={location} params={{ mode: 'fruits' }}>
                  fruits
                </ParamLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="spacer" />
        <div className={classNames('loader-text', { loading: isLoadingData })}>
          {itemsCount > 0 ? `loaded ${itemsCount} maps` : 'loading...'}
        </div>
        <div className="last-update-block">
          <div id="last-update" title={lastUpdatedTime || ''}>
            {isLoading ? 'loading...' : `last updated: ${lastUpdated}`}
          </div>
          <div className="author">
            <span>contact:</span>
            <a
              href="https://www.reddit.com/message/compose/?to=grumd"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={process.env.PUBLIC_URL + '/reddit.svg'} alt="reddit" className="icon" />
            </a>
            <a href="https://twitter.com/grumd_osu" target="_blank" rel="noreferrer noopener">
              <img src={process.env.PUBLIC_URL + '/twitter.svg'} alt="twitter" className="icon" />
            </a>
            <a href="https://osu.ppy.sh/users/530913" target="_blank" rel="noreferrer noopener">
              <img
                src="https://osu.ppy.sh/images/layout/osu-logo-white.svg"
                alt="osu!"
                className="icon"
              />
            </a>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(mapStateToProps)(withRouter(TopBar));
