import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormGroup,
  Select,
  Option,
  Icon,
  useTranslation,
  Typography,
  ErrorMessage,
  Divider,
} from "@butlerhospitality/ui-sdk";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { prefixeConfigValidatorV2, Program, ProgramCategory, ProgramRules } from "@butlerhospitality/shared";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { programDetails } from "../../../routes";
import { useUpdateProgram } from "../../../store/program";
import { useFetchCategories } from "../../../store/categories";
import { useFetchMenu } from "../../../store/menu";

export default ({ voucherProgram }: { voucherProgram: Program }): JSX.Element => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
    control,
    getValues,
  } = useForm<any>({
    resolver: yupResolver(prefixeConfigValidatorV2),
    defaultValues: {
      amount: voucherProgram.amount,
    },
  });

  const {
    mutateAsync: updateProgram,
    isLoading: isUpdateProgramLoading,
    isError: isUpdateProgramError,
  } = useUpdateProgram(params.id);

  const { data: categoriesData } = useFetchCategories({});
  const { data: menuData } = useFetchMenu({
    enabled: !!voucherProgram?.hotels?.[0]?.id,
    id: `${voucherProgram?.hotels?.[0]?.menu_id}`,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  useEffect(() => {
    const selectedCategoryId = voucherProgram?.rules?.[0]?.categories?.[0].parent_category?.id;

    const formattedCategories = Object.entries(menuData?.payload?.categories || {}).map((key) => {
      const categoryItem = {
        id: key[0],
        name: key[1].name,
        subcategories: Object.entries(key[1].subcategories || {}).map((subKey) => {
          return {
            id: subKey[0],
            name: subKey[1].name,
          };
        }),
      };

      return categoryItem;
    });

    setCategories(formattedCategories);
    const selected = formattedCategories?.find((item: any) => `${item.id}` === `${selectedCategoryId}`);

    const parsedProgramRules = voucherProgram?.rules?.map((item: ProgramRules) => {
      return {
        ...item,
        itemId: item.id,
        categories: item?.categories.map((element: ProgramCategory) => `${element.id}`),
      };
    });

    if (selected) {
      setSelectedCategory(selected);
      reset({
        category_id: selected?.id,
        rules: parsedProgramRules,
      });
    }
  }, [reset, categoriesData, menuData]);

  const onSubmit = async (data: Program) => {
    const parsedRules = (getValues("rules") || []).map((item: any) => {
      const parsedRuleData: any = {
        quantity: item.quantity && +item.quantity,
        max_price: item.max_price && +item.max_price,
        categories: item.categories,
      };

      if (item.id) {
        parsedRuleData.id = item.id;
      }

      return parsedRuleData;
    });

    const parsedData = {
      ...data,
      name: voucherProgram.name,
      amount: data.amount && +data.amount,
      rules: parsedRules,
      type: voucherProgram.type,
    };

    const { category_id, ...other } = parsedData;

    try {
      setError("");
      await updateProgram(other);
      history.push(`${programDetails.path}/${encodeURIComponent(params.id)}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    resetField("rules");
    const selected = categoriesData?.payload?.find((item) => `${item.id}` === categoryId);

    if (selected) {
      return setSelectedCategory(selected);
    }

    return setSelectedCategory(null);
  };

  const renderParentCategories = (): any => {
    return (categories || []).map((item: any) => (
      <Option value={item?.id} key={item?.id}>
        {item.name}
      </Option>
    ));
  };

  const renderConditions = () => {
    return (
      <div>
        {(fields || []).map((item, index) => (
          <div key={item.id}>
            <div className="ui-flex between mt-30 mb-10">
              <Typography p>Condition {index + 1}</Typography>
              {fields.length !== 1 && (
                <Button
                  type="button"
                  variant="danger-ghost"
                  size="small"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <Icon type="Delete" size={16} />
                </Button>
              )}
            </div>
            <FormControl label={`${t("CATEGORIES")}*`} className="w-100 my-10">
              <Select
                multiple
                selectProps={register(`rules[${index}].categories`)}
                placeholder="Select Categories"
                error={errors?.rules?.[index]?.categories?.message}
              >
                {(selectedCategory.subcategories || []).map((element: any) => (
                  <Option value={element.id}>{element.name}</Option>
                ))}
              </Select>
            </FormControl>
            <FormGroup className="ui-flex between my-10">
              <FormControl label={`${t("QUANTITY")}*`}>
                <Input
                  type="number"
                  {...register(`rules[${index}].quantity`)}
                  placeholder="0"
                  error={errors?.rules?.[index]?.quantity?.message}
                  min={0}
                />
              </FormControl>
              <FormControl label={`${t("PRICE_LIMIT")}*`}>
                <Input
                  prefixNode="$"
                  placeholder="0.00"
                  type="number"
                  {...register(`rules[${index}].max_price`)}
                  error={errors?.rules?.[index]?.max_price?.message}
                />
              </FormControl>
            </FormGroup>
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="small"
          onClick={() =>
            append({
              quantity: "",
              max_price: "",
              categories: [],
            })
          }
          leftIcon={<Icon type="Plus" size={20} />}
          className="mt-20"
        >
          Add Another Condition
        </Button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup className=" my-10">
        <FormControl label={t("MEAL_PERIOD")} className="category-wrapper">
          <Select
            disabled
            value=""
            selectProps={{
              ...register("category_id"),
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                handleCategoryChange(e.target.value);
              },
            }}
          >
            <Option value="" hidden disabled>
              {t("SELECT_CATEGORY")}
            </Option>
            {renderParentCategories()}
          </Select>
        </FormControl>
        <FormControl label={t("PRICE")}>
          <Input type="number" step="any" {...register("amount")} error={errors.amount?.message} className="w-100" />
        </FormControl>
      </FormGroup>
      {selectedCategory && renderConditions()}
      <Divider vertical={30} />
      <div className="mb-30">{isUpdateProgramError && <ErrorMessage error={error} />}</div>
      <div className="form-bottom-action mt-30">
        <Button
          variant="ghost"
          onClick={() => {
            history.push(`${programDetails.path}/${encodeURIComponent(params.id)}`);
          }}
        >
          {t("CANCEL")}
        </Button>
        <Button type="submit" variant="primary" disabled={isUpdateProgramLoading}>
          {t("SAVE")}
        </Button>
      </div>
    </form>
  );
};
