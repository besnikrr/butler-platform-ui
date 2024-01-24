import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  ErrorMessage,
  FormControl,
  Input,
  InputSearch,
  Pagination,
  Typography,
  useApi,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  City,
  HTTPResourceResponse,
  Item,
  ResourceResponse,
  getTotalPages,
} from "@butlerhospitality/shared";
import { useForm } from "react-hook-form";
import useDebounce from "../../../util/useDebounce";
import timeDifference from "../../../util/timeDifference";
import NoResult from "../../../component/NoResult";

export interface ItemOOS {
  resource: string;
  id: string;
  name: string;
}

interface Item86Props {
  onClose: () => void;
  meta: ItemOOS;
  onSubmitSuccess?: () => void;
}

const ITEM_86_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

const Item86: React.FC<Item86Props> = (props): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const [hubs, setHubs] = useState<HTTPResourceResponse<City[]>>();
  const [selectedCityId, setSelectedCityId] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [selectedHubs, setSelectedHubs] = useState<any[]>([]);
  const [selectedCityHubs, setSelectedCityHubs] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [action, setAction] = useState<string>(ITEM_86_ACTIONS.CREATE);
  const [searchInput, setSearchInput] = useState<string>("");
  const [error, setError] = useState("");
  const debouncedValue = useDebounce<string>(searchInput);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {},
  });

  const getCities = async (page: number = 1) => {
    const result = await menuServiceApi.get<HTTPResourceResponse<City[]>>(
      debouncedValue
        ? `/external/relation/hubs?name=${debouncedValue}&page=${page}&limit=5`
        : `/external/relation/hubs?page=${page}&limit=5`
    );
    setPage(page);
    setHubs(result.data);
  };

  useEffect(() => {
    const getItem86 = async () => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Item>>(
        `/products/${props.meta.id}`
      );
      const productDetails = result.data.payload;
      const newHubsArray: any = [];
      (productDetails?.out_of_stock || []).map((item: any, index: any) => {
        const [days, hours] = timeDifference(
          new Date(item.available_at).getTime(),
          new Date().getTime()
        );
        const hubItem = {
          id: item.hub.id,
          name: item.hub.name,
          days,
          hours,
        };
        newHubsArray.push(hubItem);
      });

      setSelectedHubs(newHubsArray);
    };

    getCities();
    getItem86();
  }, []);

  useEffect(() => {
    getCities();
  }, [debouncedValue]);

  const handleHubClick = (hub: any, checked: boolean) => {
    if (!hub.id) return;

    if (checked) {
      const selectedItem = selectedHubs.find((item: any) => item.id === hub.id);
      if (!selectedItem) {
        setSelectedHubs([...selectedHubs, hub]);
      }

      return;
    }

    return setSelectedHubs(
      selectedHubs.filter((item: any) => item.id !== hub.id)
    );
  };

  const handleOnChipClick = (hubID: string) => {
    setSelectedHubs(selectedHubs.filter((item: any) => item.id !== hubID));
  };

  const handleTimeChange = (hub: any, value: string, option: string) => {
    const isHubSelected = selectedHubs.some(
      (element: any) => element.id === hub.id
    );
    if (isHubSelected) {
      hub[option] = Number(value);

      const currentHubIndex = selectedHubs.findIndex(
        (item: any) => item.id === hub.id
      );
      const newHubs = [
        ...selectedHubs.slice(0, currentHubIndex),
        hub,
        ...selectedHubs.slice(currentHubIndex + 1),
      ];
      setSelectedHubs(newHubs);
    }
  };

  const renderHubs = () => {
    return (
      <>
        <Typography size="large" p className="mt-20 mb-20">
          {t("hubs_list")}
        </Typography>
        <InputSearch
          value={searchInput}
          placeholder={t("search")}
          className="mb-20"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className="ui-flex v-center end">
          <Typography p className="mb-10 mr-10" style={{ minWidth: 100 }}>
            Days
          </Typography>
          <Typography p className="mb-10" style={{ minWidth: 100 }}>
            Hours
          </Typography>
        </div>
        <div className="ui-flex even column mb-10">
          {(hubs?.payload || []).map((item: any) => {
            const selectedHub = selectedHubs.find(
              (element: any) => element.id === item.id
            );
            return (
              <>
                <div
                  className="ui-flex between v-center"
                  style={{ minHeight: 30 }}
                >
                  <FormControl>
                    <Checkbox
                      key={item.id}
                      name={`hubs[${item.id}].${item.name}`}
                      label={item.name}
                      onChange={(e) =>
                        handleHubClick(item, e.currentTarget.checked)
                      }
                      checked={selectedHubs.some(
                        (element: any) => element.id === item.id
                      )}
                    />
                  </FormControl>
                  {!!selectedHub && (
                    <div className="ui-flex">
                      <FormControl className="mr-10">
                        <Input
                          key={item.id}
                          type="number"
                          placeholder="0"
                          min="0"
                          value={selectedHub.days || ""}
                          style={{ width: 100, height: 30 }}
                          onChange={(e) =>
                            handleTimeChange(
                              selectedHub,
                              e.currentTarget.value,
                              "days"
                            )
                          }
                          error={errors?.days?.message}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          key={item.id}
                          type="number"
                          style={{ width: 100, height: 30 }}
                          max="23"
                          min="0"
                          placeholder="0"
                          value={selectedHub.hours || ""}
                          error={errors?.hours?.message}
                          onChange={(e) =>
                            handleTimeChange(
                              selectedHub,
                              e.currentTarget.value,
                              "hours"
                            )
                          }
                        />
                      </FormControl>
                    </div>
                  )}
                </div>
                <Divider vertical={10} />
              </>
            );
          })}
          {!hubs || (hubs.payload || []).length < 1 ? (
            <div>
              <NoResult />
            </div>
          ) : (
            <Pagination
              className="ui-flex end mt-20"
              pages={getTotalPages(Number(hubs?.total), 5)}
              current={page}
              onPageChange={getCities}
            />
          )}
        </div>
      </>
    );
  };

  const renderSelectedHubs = () => {
    return (
      <>
        <Typography p size="large" className="mb-20 mt-20">
          {t("selected_hubs")}
        </Typography>
        <FormControl>
          <div className="ui-flex wrap">
            {Object.values(selectedHubs).map((item: any) => (
              <Chip
                className="mb-5 mr-5"
                size="medium"
                onClose={(e) => {
                  handleOnChipClick(item.id);
                }}
              >
                {item.name}
              </Chip>
            ))}
          </div>
        </FormControl>
      </>
    );
  };

  const onSubmit = async () => {
    const data: any = {
      hubs: selectedHubs
        .filter((item: any) => item.days || item.hours)
        .map((item: any) => ({
          hub_id: item.id,
          days: item.days,
          hours: item.hours,
        })),
    };

    try {
      setIsSubmitting(true);
      await menuServiceApi.post<ResourceResponse<any>>(
        `/products/${props.meta.id}/out-of-stock`,
        data
      );
      props.onSubmitSuccess?.();
    } catch (error: any) {
      setError(error.response.data.error);
    } finally {
      setIsSubmitting(false);
    }
    props.onClose();
  };

  return (
    <>
      <Typography h2>
        {t("item_name")}: {props.meta.name}
      </Typography>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderSelectedHubs()}
        {renderHubs()}
        {error && (
          <div className="mt-20 mb-20">
            <ErrorMessage error={error} />
          </div>
        )}
        <div className="ui-flex v-center end">
          <Button size="large" variant="ghost" onClick={props.onClose}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-10"
            size="large"
            variant="primary"
          >
            {t("save")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Item86;
