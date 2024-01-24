import React, { useEffect, useState } from "react";
import { Input, Option, Select } from "@butlerhospitality/ui-sdk";
import { CompensationTypes } from "../../../util/constants";
import { TabButton } from "../../../component/tab-button";
import { useOrderContext } from "../store/order-context";
import { SET_TIP } from "../store/constants";

// import "./index.scss";

const OrderTip: React.FC = () => {
  const { dispatch, state } = useOrderContext();
  const [activeTipTab, setActiveTipTab] = useState<string | null>(null);
  const [tipValue, setTipValue] = useState<number>(state.tip?.value || 0);
  const [tipType, setTipType] = useState<CompensationTypes>(state.tip?.type || CompensationTypes.AMOUNT);

  useEffect(() => {
    setActiveTipTab("10%");
  }, []);

  useEffect(() => {
    if (activeTipTab && activeTipTab !== "Custom") {
      dispatch({
        type: SET_TIP,
        payload: {
          tip: {
            value: parseFloat(activeTipTab),
            type: CompensationTypes.PERCENTAGE,
          },
        },
      });
    }
  }, [activeTipTab]);

  const handleTipTabClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event.currentTarget.id === "Custom") {
      dispatch({
        type: SET_TIP,
        payload: {
          tip: {
            type: CompensationTypes.AMOUNT,
            value: 0,
          },
        },
      });
      setActiveTipTab(event.currentTarget.id);
    }
    setActiveTipTab(event.currentTarget.id);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setTipValue(value);
    dispatch({
      type: SET_TIP,
      payload: {
        tip: {
          type: tipType,
          value,
        },
      },
    });
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value as CompensationTypes;
    setTipType(type);
    dispatch({
      type: SET_TIP,
      payload: {
        tip: {
          value: tipValue,
          type,
        },
      },
    });
  };

  return (
    <>
      <div className="orders-app-tab-container mt-10">
        <TabButton size="small" outline onClick={handleTipTabClick} id="10%" active={activeTipTab}>
          10%
        </TabButton>
        <TabButton size="small" outline onClick={handleTipTabClick} id="20%" active={activeTipTab}>
          20%
        </TabButton>
        <TabButton size="small" outline onClick={handleTipTabClick} id="30%" active={activeTipTab}>
          30%
        </TabButton>
        <TabButton size="small" outline onClick={handleTipTabClick} id="Custom" active={activeTipTab}>
          Custom
        </TabButton>
      </div>
      {activeTipTab && activeTipTab === "Custom" && (
        <div className="ui-flex v-center mt-10" style={{ width: 210 }}>
          <Input
            type="number"
            placeholder="Enter tip"
            className="mr-5"
            value={tipValue}
            min={0}
            onChange={handleValueChange}
          />
          <Select
            selectProps={{
              onChange: handleTypeChange,
            }}
            value={tipType}
            className="mx-10"
          >
            <Option value={CompensationTypes.AMOUNT}>USD</Option>
            <Option value={CompensationTypes.PERCENTAGE}>%</Option>
          </Select>
        </div>
      )}
    </>
  );
};

export default OrderTip;
