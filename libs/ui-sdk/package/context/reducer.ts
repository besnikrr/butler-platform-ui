import * as types from './types';
import produce from 'immer';
import actions from './actions';

const reducer = (state: types.AppContextType, action: types.ActionType) => {
  switch (action.type) {
    case actions.SET_USER_AUTHENTICATED: {
      return produce(state, (draftState) => {
        if (draftState.user) {
          draftState.user.authenticated = action.value as boolean;
        }
      });
    }
    case actions.SET_USER_DETAILS: {
      return produce(state, (draftState) => {
        if (draftState.user) {
          draftState.user.details = action.value as types.UserDetails;
        }
      });
    }
    case actions.SET_TENANT: {
      return produce(state, (draftState) => {
        if (draftState.user) {
          draftState.tenant = action.value as types.Tenant;
        }
      });
    }
    case actions.SET_NAVIGATION: {
      return produce(state, (draftState) => {
        if (draftState.user) {
          const { app, navigation } = action.value as types.SetNavInput;
          console.log ({ app, navigation });
          // @ts-ignore
          draftState.navigation[app] = navigation as types.SideNavListItemType[];
        }
      });
    }
    default:
      return state;
  }
};
export default reducer;
