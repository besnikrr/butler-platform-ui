import * as yup from "yup";
import { BaseEntity } from "../base";
import { EMAIL_REGEX } from "../utils/constants";
import { Role } from "./role";

interface User extends BaseEntity {
  readonly id?: string;
  email: string;
  name: string;
  phone_number?: string;
  roles: Role[];
}

const baseUserValidator = yup.object().shape({
  name: yup.string().trim().required("Name is a required field!"),
  email: yup
    .string()
    .matches(EMAIL_REGEX, "Only emails are allowed for this field!")
    .required("Email is a required field!"),
  phone_number: yup.string().optional(),
  roles: yup.array().of(yup.number()).optional(),
});

export { User, baseUserValidator };
