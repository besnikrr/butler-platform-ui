import React, { useState } from 'react';
import * as yup from 'yup';
import {
  Typography,
  Button,
  InputPassword,
  Card,
  ErrorMessage
} from '../../../component';
import {
  Grid,
  Row,
  Column,
} from '../../../grid';
import {
  Footer,
} from '../../../layout';
import { FormControl } from '../../../smart-component';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import ButlerLogo from '../../../assets/ButlerLogo';
import ButlerLogoFooter from '../../../assets/ButlerLogoFooter';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { AppEnum, ResourceResponse } from '@butlerhospitality/shared';
import { getUrl } from '../../api';
import { useApi } from '@butlerhospitality/ui-sdk';
type PropsType = { foo?: string };
type FormData = {
  temporary_password: string;
  verify_password: string;
  password: string;
};
const signInValidator = yup.object().shape({
	temporary_password: yup
		.string()
		.typeError("Temporary Password is a required field!")
		.required("Temporary Password is a required field!"),
	password: yup
		.string()
		.typeError("Password is a required field!")
		.min(8, "New password must be at least 8 characters!")
		.required("New password is a required field!")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
			"Must have 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character!"
		),
	verify_password: yup
		.string()
		.typeError("Verify Password is a required field!")
		.oneOf([yup.ref("password"), null], "Passwords must match!"),
});
const ChangePasswordView: (props: PropsType) => JSX.Element = (props: PropsType) => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const iamServiceApi = useApi(AppEnum.IAM)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(signInValidator),
  });
  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      setIsSubmitting(true);
      const changePasswordResponse = await iamServiceApi.post<ResourceResponse<any>>('/users/change/password', {
        temporaryPassword: data.temporary_password,
        password: data.password,
        verifyPassword: data.verify_password
      })

      console.log('verifyUserResponse: ', changePasswordResponse)
      history.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid gutter={30}>
      <div className='sign-in-page-wrapper'>
        <Row>
          <Row>
            <div className='butler-logo'><ButlerLogo /></div>
          </Row>
          <Column size={12}>
            <Card
              className='form-wrapper'
              size='medium'
            >
              <Row>
                <Column size={12}>
                  <Row>
                    <div className='ui-flex center v-center mb-20 px-30'>
                      <Typography h2>Change password</Typography>
                    </div>
                  </Row>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                      <InputPassword placeholder='Temporary Password' {...register('temporary_password')} error={errors.temporary_password?.message} />
                    </FormControl>
                    <FormControl className='mt-10'>
                      <InputPassword placeholder='Password' {...register('password')} error={errors.password?.message} />
                    </FormControl>
                    <FormControl className='mt-10'>
                      <InputPassword placeholder='Verify Password' {...register('verify_password')} error={errors.verify_password?.message} />
                    </FormControl>
                    <Row>
                      <div className="form-button-wrapper mt-20">
                        <Button variant='primary' type='submit' disabled={isSubmitting}>
                          Change
                        </Button>
                      </div>
                      {error && <ErrorMessage error={error} className="ui-sign-in-error-message" />}
                    </Row>
                  </form>
                </Column>
              </Row>
            </Card>
          </Column>
        </Row>
        <Row>
          <Footer><ButlerLogoFooter /> </Footer>
        </Row>
      </div>
    </Grid>
  );
};

export { ChangePasswordView };
