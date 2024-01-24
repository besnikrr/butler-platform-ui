import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  Checkbox,
  Column,
  Divider,
  ErrorMessage,
  FormControl,
  Grid,
  Image,
  Input,
  Link,
  Row,
  Typography,
  useApi,
  useTranslation,
  LeavePageAlert,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  CreateUpdateItemInput,
  generalInformationValidator,
  Item,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFile from "../../../component/InputFile";

export default ({ item }: any): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pickedNewImage, setPickedNewImage] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateUpdateItemInput>({
    defaultValues: {
      name: item.name,
      price: item.price,
      description: item.description,
      needs_cutlery: item.needs_cutlery,
      guest_view: item.guest_view,
      raw_food: item.raw_food,
      image: item.image,
    },
    resolver: yupResolver(generalInformationValidator),
  });
  const [presignedUrl, setPresignedUrl] = useState<null | any>(null);
  const initialImage = React.useMemo(() => item.image, [item]);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const onLeavePage = (url: string) => {
    if (isFormChanged) {
      setLeaveModal(true);
    } else {
      history.push(url);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const getPresignedUrl = async (): Promise<void> => {
      const presignedUrlReq = await menuServiceApi.get(`/products/upload/presign-url?imagekey=${item.image}`);
      setPresignedUrl(presignedUrlReq.data);
    };
    getPresignedUrl();
  }, []);

  const onSubmit = async (data: CreateUpdateItemInput) => {
    setError("");
    setIsSubmitting(true);
    try {
      const dataToSend = {
        name: data.name,
        price: Number(data.price),
        description: data.description,
        needs_cutlery: data.needs_cutlery,
        guest_view: data.guest_view,
        raw_food: data.raw_food,
        image: initialImage,
        // labels: [], TODO; add labels
      };
      if (pickedNewImage && data.image) {
        await axios({
          method: "PUT",
          url: presignedUrl.url,
          data: data.image,
        });
      }
      await menuServiceApi.put<HTTPResourceResponse<Item>>(`/products/type/general/${item.id}`, dataToSend);
      pushNotification(t("Item updated successfully"), {
        type: "success",
      });
      history.push(`/menu/item/view/${item.id}`);
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="menu-content"
            page
            header={
              <div>
                <Typography h2>{item.name}</Typography>
              </div>
            }
          >
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl label={`${t("item_name")}*`}>
                    <Input
                      data-testid="input-item-name"
                      placeholder={t("enter_item_name")}
                      {...register("name")}
                      error={errors.name?.message}
                    />
                  </FormControl>
                  <FormControl label={`${t("item_price")}*`}>
                    <Input
                      type="number"
                      step=".01"
                      prefixNode="$"
                      placeholder="0.00"
                      {...register("price")}
                      error={errors.price?.message}
                    />
                  </FormControl>
                  <FormControl label={t("item_description")}>
                    <Input
                      placeholder={t("enter_item_description")}
                      {...register("description")}
                      error={errors.description?.message}
                    />
                  </FormControl>
                  <FormControl>
                    <Checkbox {...register("needs_cutlery")} label={t("needs_cutlery")} />
                  </FormControl>
                  <FormControl label="">
                    <Checkbox {...register("guest_view")} label={t("guest_view")} />
                  </FormControl>
                  <FormControl>
                    <Checkbox {...register("raw_food")} label={t("raw_food")} />
                  </FormControl>
                  <FormControl label={`${t("image")}*`}>
                    {/* TODO: use env. base img url */}
                    {!pickedNewImage && (
                      <Link target="_blank" href={`${item?.image_base_url}/image/400x400/${item?.image}`}>
                        <Image
                          src={`${item?.image_base_url}/image/400x400/${item?.image}`}
                          alt={item?.image}
                          width={100}
                          height={100}
                        />
                      </Link>
                    )}
                    <InputFile
                      {...register("image")}
                      onChange={(e: any) => {
                        register("image").onChange(e);
                        setPickedNewImage(!!e.target.value);
                      }}
                      error={errors.image?.message}
                    />
                  </FormControl>
                  {error && (
                    <div className="mt-20">
                      <ErrorMessage error={error} />
                    </div>
                  )}
                  <Divider vertical={30} />
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onLeavePage(`/menu/item/view/${item.id}`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button data-testid="item-submit" variant="primary" type="submit" disabled={isSubmitting}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`/menu/item/list`)}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};
