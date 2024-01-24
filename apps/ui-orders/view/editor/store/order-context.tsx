import * as React from "react";
import reducer, { CreateOrderContextInterface } from "./order-reducer";

const initState: CreateOrderContextInterface = {
  items: [],
  customItems: {},
  cutlery: 1,
  vouchers: [],
  voucherSelection: null,
  voucherItems: [],
  menu: null,
  compensation: null,
  discount: null,
  tip: null,
  activeCategoryTab: null,
};

const CreateOrderContext = React.createContext<{
  state: CreateOrderContextInterface;
  dispatch: React.Dispatch<any>;
}>({
  state: initState,
  dispatch: () => {},
});

function OrderProvider({ children }: any) {
  const [state, dispatch] = React.useReducer(reducer, initState);
  return <CreateOrderContext.Provider value={{ state, dispatch }}>{children}</CreateOrderContext.Provider>;
}

function useOrderContext() {
  const context = React.useContext(CreateOrderContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a OrderProvider");
  }
  return context;
}

export { OrderProvider, useOrderContext };
