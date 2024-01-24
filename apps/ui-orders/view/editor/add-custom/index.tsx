import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Typography,
  Divider,
  FormControl,
  Input,
  Button,
  Icon,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface AddCustomItemProps {
  onAddItem: (item: { name: string; price: number }) => void;
}

const AddCustomItem: React.FC<AddCustomItemProps> = (props) => {
  const { t } = useTranslation();
  const [isAddCustomItemModalOpen, setIsAddCustomItemModalOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    name: string;
    price: number;
  }>({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required(t("name_required")),
        price: yup
          .number()
          .transform((value, originalValue) => {
            return originalValue === "" ? undefined : value;
          })
          .min(0.01)
          .required(t("price_required"))
          .typeError(t("price_type_error")),
      })
    ),
    defaultValues: {
      price: undefined,
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    props.onAddItem({
      name: data.name.trim(),
      price: Number(data.price),
    });
    setIsAddCustomItemModalOpen(false);
    reset();
  };

  const close = () => {
    setIsAddCustomItemModalOpen(false);
    reset();
  };

  return (
    <>
      <Modal visible={isAddCustomItemModalOpen} style={{ minWidth: 400 }} onClose={close}>
        <Typography h2>{t("add_custom_item")}</Typography>
        <Divider vertical={20} />
        <form>
          <FormControl label={t("name")} vertical>
            <Input
              autoComplete="off"
              placeholder={t("enter_item_name")}
              {...register("name")}
              error={errors.name?.message}
            />
          </FormControl>
          <FormControl className="mt-10" label={t("price")} vertical>
            <Input
              type="number"
              placeholder={t("enter_item_price")}
              {...register("price")}
              min={0}
              step=".01"
              error={errors.price?.message}
            />
          </FormControl>
          <div className="w-100 ui-flex end mt-30">
            <Button variant="ghost" onClick={close}>
              {t("cancel")}
            </Button>
            <Button className="ml-10" onClick={handleSubmit(onSubmit)} variant="primary">
              {t("add")}
            </Button>
          </div>
        </form>
      </Modal>
      <Button
        onClick={() => setIsAddCustomItemModalOpen(true)}
        size="small"
        variant="ghost"
        rightIcon={<Icon type="Plus" size={14} />}
      >
        {t("add_special_item")}
      </Button>
    </>
  );
};

export { AddCustomItem };
