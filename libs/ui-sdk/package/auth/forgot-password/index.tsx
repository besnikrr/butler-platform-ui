/* eslint-disable import/no-cycle */
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as yup from "yup";
import {
  Button,
  Card,
  ErrorMessage,
  Input,
  pushNotification,
  Typography,
} from "../../../component";
import { EMAIL_REGEX } from "../../../../shared/utils/constants";
import { FormControl } from "../../../smart-component";
import { AppEnum } from "../../../../shared/utils";
import ButlerLogo from "../../../assets/ButlerLogo";
import { Grid, Row, Column } from "../../../grid";
import { getUrl } from "../../api";
import { AppContext } from "../../context";
import "./index.scss";

type FormData = {
  email: string;
};

const forgotPasswordValidator = yup.object().shape({
  email: yup
    .string()
    .matches(EMAIL_REGEX, "Only emails are allowed for this field!")
    .required("Email is a required field!"),
});

const ForgotPasswordView: () => JSX.Element = () => {
  const { tenant } = useContext(AppContext);
  const history = useHistory();
  const { t } = useTranslation();
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
    resolver: yupResolver(forgotPasswordValidator),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      setIsSubmitting(true);
      await iamServiceApi.post("/users/init/reset/password", {
        clientId: tenant.cognito.clientId,
        email: data.email,
        poolId: tenant.cognito.poolId,
      });
      pushNotification(t(`Password reset request sent to ${data.email}`), {
        type: "success",
      });
      history.push("/sign-in");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid gutter={30}>
      <div className="forgot-password-page-wrapper">
        <Row>
          <Row>
            <div className="butler-logo">
              <ButlerLogo />
            </div>
          </Row>
          <Column size={12}>
            <Card className="form-wrapper">
              <Row>
                <div className="ui-flex center v-center mb-30 px-30">
                  <Typography as="h2">Forgot password</Typography>
                </div>
              </Row>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </FormControl>
                <Row>
                  <div className="form-button-wrapper mt-10">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Log in
                    </Button>
                  </div>
                  <div>
                    {error && (
                      <ErrorMessage error={error} className="text-medium" />
                    )}
                  </div>
                </Row>
              </form>
            </Card>
          </Column>
        </Row>
      </div>
    </Grid>
  );
};

export { ForgotPasswordView };
