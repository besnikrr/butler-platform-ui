import * as yup from "yup";

const basePermissionGroupValidator = yup.object().shape({
  name: yup.string().required("Name is a required field!"),
});

export { basePermissionGroupValidator };
