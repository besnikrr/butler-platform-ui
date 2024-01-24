import React from "react";
import {
  Modal,
  Typography,
  Divider,
  Button,
  Row,
  Radio,
  Checkbox,
  Grid,
  Column,
  Textarea,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { Modifier, ModifierOption } from "@butlerhospitality/shared";
import { useForm } from "react-hook-form";
import { ItemOnMenu, StoreItemTypes } from "../../../util/constants";
import { useOrderContext } from "../store/order-context";
import { ADD_CUSTOMIZED_ITEM, ADD_CUSTOMIZED_VOUCHER_ITEM } from "../store/constants";

interface AddCustomizeItemProps {
  onClose: () => void;
  item: ItemOnMenu;
  type: StoreItemTypes;
}

const AddCustomizeItem: React.FC<AddCustomizeItemProps> = ({ onClose, item, type }) => {
  const { t } = useTranslation();
  const { dispatch } = useOrderContext();
  const { register, handleSubmit, reset } = useForm<any>();

  const onSubmit = (data: any) => {
    const mutatableData = { ...data };
    const comment = mutatableData.comment.trim();
    delete mutatableData.comment;
    const selectedOptions: ModifierOption[] = [];
    const selectedIds: string[] = [].concat(...(Object.values(mutatableData) as any));
    Object.keys(mutatableData).forEach((key) => {
      const options: ModifierOption[] = [];
      item.modifiers
        .find((modifier: Modifier) => modifier.id === +key)
        ?.options.forEach((option: ModifierOption) => {
          if (selectedIds.includes(`${option.id}`)) {
            options.push({
              id: option.id,
              name: option.name,
              price: option.price,
              modifier: option.modifier,
            });
          }
        });
      selectedOptions.push(...(options || []));
    });

    dispatch({
      type: type === "items" ? ADD_CUSTOMIZED_ITEM : ADD_CUSTOMIZED_VOUCHER_ITEM,
      payload: {
        item: {
          ...item,
          options: selectedOptions,
          comment,
        },
      },
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible onClose={handleClose} style={{ width: 620 }}>
      <form>
        <Typography h2>{item.name}</Typography>
        <Divider />
        <Grid className="mb-20">
          <Row>
            {item.modifiers.map((modifier: Modifier) => {
              return (
                <Column key={modifier.id}>
                  <Typography className="ui-block mb-10">{modifier.name}</Typography>
                  {modifier.options.map((option: any) => {
                    if (modifier.multiselect) {
                      return (
                        <div key={option.id} className="ui-flex v-center between pr-20 mt-5">
                          <Checkbox label={option.name} value={option.id} {...register(`${modifier.id}`)} />
                          <Typography>${option.price}</Typography>
                        </div>
                      );
                    }
                    return (
                      <div key={option.id} className="ui-flex v-center between pr-20 mt-5">
                        <Radio
                          key={option.id}
                          label={modifier.name}
                          value={option.id}
                          {...register(`${modifier.id}`)}
                        />
                        <Typography>${option.price}</Typography>
                      </div>
                    );
                  })}
                </Column>
              );
            })}
          </Row>
        </Grid>
        <div>
          <Typography className="ui-block mb-10">{t("special_extras")}</Typography>
          <Textarea placeholder={t("add_your_comment")} className="w-100" {...register("comment")} />
        </div>
        <Divider />
        <div className="ui-flex v-center end">
          <Button size="large" variant="ghost" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button className="ml-10" onClick={handleSubmit(onSubmit)}>
            {t("Add")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomizeItem;
