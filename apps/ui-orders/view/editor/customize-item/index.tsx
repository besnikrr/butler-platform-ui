import React, { useEffect } from "react";
import {
  Modal,
  Typography,
  Divider,
  Button,
  Checkbox,
  Column,
  Grid,
  Radio,
  Row,
  Textarea,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { ModifierOption } from "@butlerhospitality/shared";
import { useOrderContext } from "../store/order-context";
import { OrderItem, StoreItemTypes } from "../../../util/constants";
import { CUSTOMIZE_ITEM } from "../store/constants";

interface CustomizeItemProps {
  onClose: () => void;
  item: OrderItem;
  index: number;
  itemType: StoreItemTypes;
}

const CustomizeItem: React.FC<CustomizeItemProps> = ({ onClose, item, index, itemType }) => {
  const { t } = useTranslation();
  const { dispatch } = useOrderContext();
  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => {
    const data: any = {};
    item.options?.forEach((option) => {
      const modifier = item.modifiers.find((m) => m.id === option.modifier);
      if (modifier) {
        if (modifier.multiselect) {
          data[modifier.id] = [...(data[modifier.id] || []), `${option.id}`];
        } else {
          data[modifier.id] = `${option.id}`;
        }
      }
    });
    reset({
      comment: item.comment || "",
      ...data,
    });
  }, [item]);

  const onSubmit = (data: any) => {
    const mutatableData = { ...data };
    const comment: string = mutatableData.comment.trim();
    delete mutatableData.comment;
    const selectedOptions: ModifierOption[] = [];
    let totalModifierPrice = 0;
    const selectedIds: string[] = [].concat(...(Object.values(mutatableData) as any));
    Object.keys(mutatableData).forEach((key) => {
      const options: ModifierOption[] = [];
      item.modifiers
        .find((modifier) => modifier.id === +key)
        ?.options.forEach((option) => {
          if (selectedIds.includes(`${option.id}`)) {
            totalModifierPrice += option.price;
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
      type: CUSTOMIZE_ITEM,
      payload: {
        type: itemType,
        index,
        options: selectedOptions,
        totalModifierPrice,
        comment,
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
            {item.modifiers?.map((modifier) => {
              return (
                <Column key={modifier.id}>
                  <Typography className="ui-block mb-10">{modifier.name}</Typography>
                  {modifier.options.map((option) => {
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
            {t("add")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomizeItem;
