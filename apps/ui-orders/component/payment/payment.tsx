import { Button, pushNotification, Row } from "@butlerhospitality/ui-sdk";
import * as square from "@square/web-sdk";
import { useEffect, useState } from "react";
import { Card, Payments } from "@square/web-sdk";
import { useTranslation } from "react-i18next";

import "./style.scss";

const appId = process.env.NX_SQUARE_APPLICATION_ID || "";
const locationId = process.env.NX_SQUARE_LOCATION_ID || "";

const initializePayments = async (): Promise<Payments | null> => {
  try {
    return await square.payments(appId, locationId);
  } catch (error) {
    return null;
  }
};

const initializeCard = async (payments: Payments): Promise<Card | null> => {
  try {
    return await payments.card({
      style: {
        ".input-container": {
          borderColor: "#D9D9D9",
          borderRadius: "5px",
        },
        ".input-container.is-focus": {
          borderWidth: "1px",
          borderColor: "rgba(0, 68, 56, 0.5)",
        },
      },
    });
  } catch (error) {
    return null;
  }
};

const tokenize = async (paymentMethod: Card): Promise<string | null> => {
  try {
    const tokenResult = await paymentMethod.tokenize();
    return tokenResult.status === "OK" && tokenResult?.token
      ? tokenResult.token
      : null;
  } catch {
    return null;
  }
};

enum Modes {
  BROWSE = "browse",
  FETCHING = "fetching",
  WITH_ERROR = "with_error",
  INITIALISING = "initialising",
}

type Token = {
  token: string;
  locationId: string;
};

type Props = {
  visible: boolean;
  onTokenize?: (token: Token) => void;
};

export const Payment = ({ visible, onTokenize }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string>("");
  const [card, setCard] = useState<Card | null>(null);
  const [mode, setMode] = useState<Modes>(Modes.INITIALISING);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const submitPayment = async (): Promise<void> => {
    setMode(Modes.FETCHING);
    if (!card) {
      pushNotification(t("cannot_charge_card"), { type: "error" });
      return;
    }
    const result = await tokenize(card);
    if (!result) {
      setMode(Modes.WITH_ERROR);
      setErrorMessage(t("failed_to_create_payment_token"));
      return;
    }
    setToken(result);
    setMode(Modes.BROWSE);
    onTokenize?.({ token: result, locationId });
  };

  const initialize = async (): Promise<void> => {
    const paymentResult = await initializePayments();
    if (!paymentResult) {
      setMode(Modes.WITH_ERROR);
      setErrorMessage(t("failed_initialize_payment"));
      return;
    }
    const cardResult = await initializeCard(paymentResult);
    if (!cardResult) {
      setMode(Modes.WITH_ERROR);
      setErrorMessage(t("failed_initialize_card"));
      return;
    }
    await cardResult.attach("#card-container");
    cardResult?.addEventListener("submit", submitPayment);
    setCard(cardResult);
    setMode(Modes.BROWSE);
    await cardResult.focus("cardNumber");
  };

  const resetPayment = async (): Promise<void> => {
    card?.removeEventListener("submit", submitPayment);
    setMode(Modes.INITIALISING);
    setToken("");
    await initialize();
  };

  useEffect(() => {
    (async () => {
      await initialize();
    })();
  }, []);

  if (token) {
    return (
      <>
        <Row className="mt-0 mb-10">
          <div>{t("payment_initialized_successfully")}</div>
          <Row className="mx-0 flex">
            <Button className="center ui-flex" onClick={resetPayment}>
              {t("reset_payment")}
            </Button>
          </Row>
        </Row>
      </>
    );
  }

  return (
    <div style={{ display: !visible ? "none" : "block" }}>
      {Modes.INITIALISING === mode && (
        <Row className="mt-0 mb-0">
          <p>{t("initializing_card")}</p>
        </Row>
      )}
      {Modes.WITH_ERROR === mode && (
        <Row className="mt-0 mb-10">
          <p>{errorMessage}</p>
        </Row>
      )}
      <Row className="mt-0 mb-0">
        <div id="card-container" />
      </Row>
      <Row className="mx-0 flex">
        <Button
          className="center ui-flex"
          onClick={submitPayment}
          disabled={[Modes.FETCHING, Modes.INITIALISING].includes(mode)}
        >
          {t("charge_card")}
        </Button>
      </Row>
    </div>
  );
};
