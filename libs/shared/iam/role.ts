import * as yup from "yup";
import { BaseEntity } from "../base";

interface PermissionGroup {
  readonly id?: string;
  name: string;
  permissions?: string[] | number[];
}

interface Role extends BaseEntity {
  readonly id?: string;
  name: string;
  description: string;
  permissiongroups: PermissionGroup[];
}

const baseRoleValidator = yup.object().shape({
  name: yup.string().required("Name is a required field!"),
  description: yup.string().optional(),
  permissiongroups: yup.array().of(yup.number()).optional(),
});

export { Role, PermissionGroup, baseRoleValidator };
