import React, { useState, useContext } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "../../../primitive/link";
import {
  Typography,
  Input,
  Button,
  InputPassword,
  Card,
  ErrorMessage,
} from "../../../component";
import { Grid, Row, Column } from "../../../grid";
import { Footer } from "../../../layout";
import { FormControl } from "../../../smart-component";
import { Authenticate } from "../authenticate";
import "./index.scss";
import ButlerLogo from "../../../assets/ButlerLogo";
import ButlerLogoFooter from "../../../assets/ButlerLogoFooter";
import { AppContext } from "../../context";

type PropsType = { foo?: string };
type FormData = {
  email: string;
  password: string;
};
const signInValidator = yup.object().shape({
  email: yup.string().email().required("Email is a required field!"),
  password: yup.string().required("Password is a required field!"),
});
const SignInPage: (props: PropsType) => JSX.Element = (props: PropsType) => {
  const history = useHistory();
  const { tenant, setIsUserAuthenticated } = useContext(AppContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      await Authenticate(tenant.cognito, {
        Username: data.email,
        Password: data.password,
      });
      setIsUserAuthenticated && setIsUserAuthenticated(true);
      history.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
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
            <Card className="form-wrapper">
              <Row>
                <Column size={12}>
                  <Row>
                    <div className="ui-flex center v-center mb-30 px-30">
                      <Typography as="h2">
                        Login in to Butler Platform
                      </Typography>
                    </div>
                  </Row>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                      <Input
                        placeholder="Email address"
                        {...register("email")}
                        error={errors?.email?.message}
                      />
                    </FormControl>
                    <br />
                    <FormControl>
                      <InputPassword
                        placeholder="Password"
                        {...register("password")}
                      />
                    </FormControl>
                    <Link
                      className="forgot-password-link text-medium"
                      size="medium"
                      href="/forgot-password"
                    >
                      Forgot Password
                    </Link>
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
                          <ErrorMessage
                            error={error}
                            className="ui-sign-in-error-message text-medium"
                          />
                        )}
                      </div>
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

export { SignInPage };
