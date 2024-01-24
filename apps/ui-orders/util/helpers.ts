import { CognitoUser } from "@butlerhospitality/ui-sdk";
import { ORDER_STATUS, WebSocketsActionTypes } from "./constants";

const getToken = async (tenant: any) => {
  return (await CognitoUser(tenant.cognito)).getAccessToken().getJwtToken();
};

const buildOrderStatus = (action: string): ORDER_STATUS => {
  switch (action) {
    case WebSocketsActionTypes.ORDER_CONFIRMED:
      return ORDER_STATUS.CONFIRMATION;
    case WebSocketsActionTypes.ORDER_PICKUP:
      return ORDER_STATUS.IN_DELIVERY;
    case WebSocketsActionTypes.ORDER_REMOVED_FOOD_CARRIER:
      return ORDER_STATUS.PREPARATION;
    case WebSocketsActionTypes.ORDER_CANCELLED:
      return ORDER_STATUS.CANCELLED;
    case WebSocketsActionTypes.ORDER_REJECTED:
      return ORDER_STATUS.REJECTED;
    default:
      return ORDER_STATUS.PENDING;
  }
};

const firstLetterUppercase = (str: string): string => {
  return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
};

export { getToken, buildOrderStatus, firstLetterUppercase };
