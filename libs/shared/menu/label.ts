import * as yup from "yup";
import { BaseEntity } from "../base";

interface Label extends BaseEntity {
  id: number;
  readonly oms_id?: number;
  name: string;
}

const baseLabelValidator = yup
  .object()
  .noUnknown(true)
  .required()
  .shape({
    name: yup.string().required("Label Name is a required field!"),
  });

export { Label, baseLabelValidator };
