/* eslint-disable import/no-cycle */
import React, { useState, useContext } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { AppEnum } from "@butlerhospitality/shared";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Button,
  InputPassword,
  Card,
  ErrorMessage,
  pushNotification,
} from "../../../component";
import { Grid, Row, Column } from "../../../grid";
import { Footer } from "../../../layout";
import { FormControl } from "../../../smart-component";
import ButlerLogo from "../../../assets/ButlerLogo";
import ButlerLogoFooter from "../../../assets/ButlerLogoFooter";
import { AppContext } from "../../context";
import { getUrl } from "../../api";

type PropsType = { foo?: string };
type FormData = {
  verify_password: string;
  password: string;
};
const signInValidator = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters!")
    .required("Password is a required field!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must have 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character!"
    ),
  verify_password: yup
    .string()
    .typeError("Verify Password is a required field!")
    .oneOf([yup.ref("password"), null], "Passwords must match!"),
});
const ResetPasswordView: (props: PropsType) => JSX.Element = (
  props: PropsType
) => {
  const { tenant } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const urlParams = new URLSearchParams(window.location.search);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const iamServiceApi = axios.create({
    baseURL: getUrl(AppEnum.IAM),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signInValidator),
  });
  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      setIsSubmitting(true);
      await iamServiceApi.post("/users/reset/password", {
        clientId: tenant.cognito.clientId,
        email: urlParams.get("email"),
        password: data.password,
        code: urlParams.get("code"),
        poolId: tenant.cognito.poolId,
      });

      pushNotification(t("Your password has been reset successfully!"), {
        type: "success",
      });
      history.push("/sign-in");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!(urlParams.get("email") && urlParams.get("code"))) {
    return <Redirect to="/sign-in" />;
  }
  return (
    <Grid gutter={30}>
      <div className="sign-in-page-wrapper">
        <Row>
          <Row>
            <div className="butler-logo">
              <ButlerLogo />
            </div>
          </Row>
          <Column size={12}>
            <Card className="form-wrapper" size="medium">
              <Row>
                <Column size={12}>
                  <Row>
                    <div className="ui-flex center v-center mb-20 px-30">
                      <Typography h2>Reset password</Typography>
                    </div>
                  </Row>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                      <InputPassword
                        placeholder="Password"
                        {...register("password")}
                        error={errors.password?.message}
                      />
                    </FormControl>
                    <FormControl className="mt-10">
                      <InputPassword
                        placeholder="Verify Password"
                        {...register("verify_password")}
                        error={errors.verify_password?.message}
                      />
                    </FormControl>
                    <Row>
                      <div className="form-button-wrapper mt-20">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Reset
                        </Button>
                      </div>
                      {error && (
                        <ErrorMessage
                          error={error}
                          className="ui-sign-in-error-message"
                        />
                      )}
                    </Row>
                  </form>
                </Column>
              </Row>
            </Card>
          </Column>
        </Row>
        <Row>
          <Footer>
            <ButlerLogoFooter />
          </Footer>
        </Row>
      </div>
    </Grid>
  );
};

export { ResetPasswordView };
