import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  ErrorMessage,
  FormControl,
  Input,
  InputSearch,
  Option,
  Select,
  Typography,
  useApi,
  useTranslation
} from '@butlerhospitality/ui-sdk';
import useDebounce from '../../../util/useDebounce';
import timeDifference from '../../../util/timeDifference';
import {
  AppEnum,
  City,
  ResourceResponse
} from '@butlerhospitality/shared';
import { useForm } from 'react-hook-form';

export interface Item86Meta {
  resource: string;
  id: string;
  name: string;
}

interface Item86Props {
  onClose: () => void;
  meta: Item86Meta;
}

const ITEM_86_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE'
}

const Item86: React.FC<Item86Props> = (props): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU)
  const [cities, setCities] = useState<ResourceResponse<City[]>>()
  const [selectedCityId, setSelectedCityId] = useState<any>(null);
  const [selectedHubs, setSelectedHubs] = useState<any[]>([]);
  const [selectedCityHubs, setSelectedCityHubs] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [action, setAction] = useState<string>(ITEM_86_ACTIONS.CREATE);
  const [searchInput, setSearchInput] = useState<string>('');
  const [error, setError] = useState('');
  const debouncedValue = useDebounce<string>(searchInput);
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: {},
  });

  useEffect(() => {
    const getCities = async () => {
      const result = await menuServiceApi.get('/hotel/relations/cities');
      setCities(result.data)
    }
    
    const getItem86 = async () => {
      const result = await menuServiceApi.get(`/items/item86/${props.meta.id.split("#")[1]}`);
      const hubsResult = result.data.hubs;

      if (hubsResult.length) {
        setAction(ITEM_86_ACTIONS.UPDATE)
      }

      const newHubsArray: any = [];

      (hubsResult || []).map((item: any, index: any) => {
        const [days, hours] = timeDifference(item.end_time, new Date().getTime())
        
        const hubItem = {
          ...item,
          days: days,
          hours: hours
        } 

        newHubsArray.push(hubItem)
      })

      setSelectedHubs(newHubsArray)

    }

    getCities();
    getItem86();
  }, []);

  const mapCityHubs = (data: any) => {
    if (!data.length) return [];

    const cityHubs = (data || []).map((item: any) => {
      if (!item.days) item.days = 0
      if (!item.hours) item.hours = 0

      const cityHubRelation = selectedHubs?.map((element: any) => element.id).includes(item.id);
      if (selectedHubs.length > 0 && cityHubRelation) {
        let hub = selectedHubs.find((element: any) => element.id === item.id)

        item.days = Number(hub.days);
        item.hours = Number(hub.hours);
      }
      return item
    })

    return cityHubs;
  }

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const result = await menuServiceApi.get(debouncedValue ? `/hotel/relations/hubs/${selectedCityId}?name=${debouncedValue}` : `/hotel/relations/hubs/${selectedCityId}`);
      const cityHubs = mapCityHubs(result.data.result);

      setSelectedCityHubs(cityHubs);
    };

    if (selectedCityId) getData();
  }, [debouncedValue]);

  const onSelectCity = async (cityID: string) => {
    setSearchInput('');
    const getHubs = async () => {
      const result = await menuServiceApi.get(`/hotel/relations/hubs/${cityID}`);
      const cityHubs = mapCityHubs(result.data.result);

      setSelectedCityHubs(cityHubs);
    }
    setSelectedCityId(cityID);
    await getHubs();
  }

  const renderSelectCities = (cities: any) => {
    if (cities.length) {
      return (cities || []).map((item: City) => <Option key={item.id} value={item.id}>{item.name}</Option>)
    }
    return null;
  }

  const handleHubClick = (hub: any, checked: boolean) => {
    if (!hub.id) return;

    if (checked) {
      const selectedItem = selectedHubs.find((item: any) => item.id === hub.id);
      if (!selectedItem) {
        setSelectedHubs([...selectedHubs, hub]);
      }

      return;
    }

    return setSelectedHubs(selectedHubs.filter((item: any) => item.id !== hub.id));
  }

  const handleOnChipClick = (hubID: string) => {
    setSelectedHubs(selectedHubs.filter((item: any) => item.id !== hubID));
  }

  const handleTimeChange = (hub: any, value: string, option: string) => {
    const isHubSelected = selectedHubs.some((element: any) => element.id === hub.id)
    if (isHubSelected) {
      hub[option] = Number(value);

      const currentHubIndex = selectedHubs.findIndex((item: any) => item.id === hub.id);
      const newHubs = [
        ...selectedHubs.slice(0, currentHubIndex),
        hub,
        ...selectedHubs.slice(currentHubIndex + 1)
      ]
      setSelectedHubs(newHubs);
    }
  }

  const renderHubs = () => {
    return (
      <>
        <Typography p className='mb-20'>{t("hubs_list")}</Typography>
        <InputSearch
          value={searchInput}
          placeholder={t("search")}
          className='mb-20'
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className='ui-flex v-center end'>
          <Typography p className='mb-10 mr-10' style={{ minWidth: 100 }}>Days</Typography>
          <Typography p className='mb-10' style={{ minWidth: 100 }}>Hours</Typography>
        </div>
        {
          <div className='ui-flex even column mb-10'>
            {(selectedCityHubs || []).map((item: any) =>
              <>
                <div className='ui-flex between v-center'>
                  <FormControl>
                    <Checkbox
                      key={item.id}
                      name={`hubs[${item.id}].${item.name}`}
                      label={item.name}
                      onChange={(e) => handleHubClick(item, e.currentTarget.checked)}
                      checked={selectedHubs.some((element: any) => element.id === item.id)}
                    />
                  </FormControl>
                  {
                    (selectedHubs || []).some((element: any) => element.id === item.id) &&
                    <div className='ui-flex'>
                      <FormControl className='mr-10'>
                        <Input
                          key={item.id}
                          type="number"
                          min="0"
                          value={item.days || ""}
                          style={{ width: 100, height: 30 }}
                          onChange={(e) => handleTimeChange(item, e.currentTarget.value, "days")}
                          error={errors?.days?.message}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          key={item.id}
                          type='number'
                          style={{ width: 100, height: 30 }}
                          max="23"
                          min="0"
                          value={item.hours || ""}
                          error={errors?.hours?.message}
                          onChange={(e) => handleTimeChange(item, e.currentTarget.value, "hours")}
                        />
                      </FormControl>
                    </div>
                  }
                </div>
                <Divider vertical={10} />
              </>
            )}
          </div>
        }
      </>
    )
  }

  const renderSelectedHubs = () => {
    return (
      <>
        <Typography p className='mb-20 mt-20'>{t("selected_hubs")}</Typography>
        <FormControl>
          <div className='ui-flex even'>
            {Object.values(selectedHubs).map((item: any) =>
              <Chip
                className='mb-20 mr-5'
                size='medium'
                onClose={(e) => {
                  handleOnChipClick(item.id);
                }}
              >
                {item.name}
              </Chip>
            )}
          </div>
        </FormControl>
      </>
    )
  }

  const onSubmit = async () => {
    const item86: any = {
      itemID: props.meta.id.split("#")[1],
      hubs: selectedHubs.filter((item: any) => item.days || item.hours),
    };

    try {
      setIsSubmitting(true);
      if (action === ITEM_86_ACTIONS.CREATE) {
        await menuServiceApi.post<ResourceResponse<any>>('/items/item86', item86);
      }

      if (action === ITEM_86_ACTIONS.UPDATE) {
        await menuServiceApi.patch<ResourceResponse<any>>('/items/item86/edit', item86);
      }
    } catch (error: any) {
      setError(error.response.data.error);
    } finally {
      setIsSubmitting(false);
    }
    props.onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography h2 className='mb-20 mt-20'>{t("item_name")}: {props.meta.name}</Typography>
      <Divider vertical={30} />
      <Typography p className='mb-20'>{t("select_cities_that_apply")}:</Typography>
      <Select
        value={""}
        selectProps={
          {
            onChange: (e) => { onSelectCity(e.currentTarget.value) }
          }
        }
        error={errors.id?.message}
      >
        <Option value="" disabled hidden>{t("select_city")}</Option>
        {renderSelectCities(cities?.result || [])}
      </Select>
      <Divider vertical={20} />
      {selectedCityId &&
        <>
          {renderSelectedHubs()}
          {renderHubs()}
        </>
      }
      {
        error &&
        <div className='mt-20 mb-20'>
          <ErrorMessage error={error} />
        </div>
      }
      <div className='ui-flex v-center end'>
        <Button size="large" variant="ghost" onClick={props.onClose}>{t("cancel")}</Button>
        <Button type='submit' disabled={isSubmitting} className='ml-10' size="large" variant="primary">{t("save")}</Button>
      </div>
    </form>
  )
}

export default Item86;
