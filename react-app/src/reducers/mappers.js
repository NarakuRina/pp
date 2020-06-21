import { combineReducers } from 'redux';
import { fetchJson } from 'utils/fetch';
import { API_PREFIX } from 'constants/common';

const getTypes = mode => ({
  LOADING: `${mode}/MAPPERS/LOADING`,
  SUCCESS: `${mode}/MAPPERS/SUCCESS`,
  ERROR: `${mode}/MAPPERS/ERROR`,
});

const initialState = {
  isLoading: false,
  data: null,
};

const getReducer = mode => {
  const { LOADING, SUCCESS, ERROR } = getTypes(mode);
  return function mappersDataReducer(state = initialState, action) {
    switch (action.type) {
      case LOADING:
        return {
          ...state,
          isLoading: true,
        };
      case SUCCESS:
        return {
          ...state,
          isLoading: false,
          data: action.data,
        };
      case ERROR:
        return {
          ...state,
          isLoading: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
};
export default combineReducers({
  osu: getReducer('osu'),
  taiko: getReducer('taiko'),
  mania: getReducer('mania'),
  fruits: getReducer('fruits'),
});

export const fetchMappersData = mode => {
  const { LOADING, SUCCESS, ERROR } = getTypes(mode);
  return async dispatch => {
    dispatch({ type: LOADING });
    try {
      const data = await fetchJson({
        url: `${API_PREFIX}/data/mappers/${mode}/pp-mappers.json`,
      });
      dispatch({ type: SUCCESS, data });
      return data;
    } catch (error) {
      dispatch({ type: ERROR, error });
    }
  };
};
