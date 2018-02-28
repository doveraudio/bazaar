import * as actionTypes from './actionTypes';
import { sharedActionTypes } from 'app/shared';

function mapReducer(state, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CURRENT_LOCATION:
    case actionTypes.RECEIVE_CURRENT_LOCATION:
      return Object.assign({}, state, {
        location: action.location,
      });
      break;

    case actionTypes.REQUEST_NODES:
    case actionTypes.RECEIVE_NODES:
      return Object.assign({}, state, {
        nodes: action.nodes,
        loading: action.loading,
      });
      break;

    default:
      return Object.assign({}, state, {});
      break;
  }
}

export default mapReducer;
