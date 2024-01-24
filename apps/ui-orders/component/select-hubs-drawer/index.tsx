/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import { Divider, Typography, Button, Checkbox, Skeleton, useApi, useTranslation } from "@butlerhospitality/ui-sdk";

import qs from "qs";
import { AppEnum, CityV2, HTTPResourceResponse, Hub } from "@butlerhospitality/shared";
import { get as _get } from "lodash";
import { CityHubQueryParams } from "../../util/constants";
import { AsyncSelect, OnQueryParams } from "../async-select";
import { useFetch } from "../../hooks/use-fetch";
import "./index.scss";

interface SelectHubsDrawerProps {
  onApplyFilters: (city: any, filters: any) => void;
  closeDrawer: () => void;
}

const SelectHubsDrawer: React.FC<SelectHubsDrawerProps> = ({ onApplyFilters, closeDrawer }) => {
  const { t } = useTranslation();
  const [selectedCities, setSelectedCities] = useState<CityV2[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [cities, setCities] = useState<HTTPResourceResponse<CityV2[]>>();
  const [selectedHubs, setSelectedHubs] = useState<number[]>([]);
  const [allHubsChecked, setAllHubsChecked] = useState(false);
  const [filteredHubs, setFilteredHubs] = useState<Hub[]>([]);
  const [filters, setFilters] = useState<CityHubQueryParams | null>(null);
  const networkService = useApi(AppEnum.NETWORK);

  const { data: hubsData, isLoading: hubsLoading } = useFetch(AppEnum.NETWORK)<Hub[], CityHubQueryParams>({
    path: "/hubs",
    query: { paginated: false, statuses: ["true"] },
  });
  const { data: citiesData, isLoading: loading } = useFetch(AppEnum.NETWORK)<CityV2[], CityHubQueryParams>({
    path: "/cities",
    query: filters || {},
  });

  const queryParams = React.useMemo(
    () =>
      qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      }),
    [window.location.search]
  );

  const filterHubs = async (ids?: string[], init?: Hub[]) => {
    if (ids && ids.length > 0) {
      const filtered = hubs.filter((hub) => ids.includes(`${hub.city.id}`));
      setFilteredHubs(filtered);
    } else {
      setFilteredHubs(hubs.length === 0 && init ? init : hubs);
    }
  };

  const setValues = () => {
    if (queryParams.cities) {
      const cityIds = (queryParams.cities as string).split(",");
      if (cities) {
        setSelectedCities(cities.payload?.filter((city) => cityIds.includes(`${city.id}`)) || []);
      }
    } else {
      setSelectedCities([]);
    }

    if (queryParams.hubs) {
      if (queryParams.hubs === "all") {
        setAllHubsChecked(true);
      } else {
        const hubIds = (queryParams.hubs as string).split(",");
        setSelectedHubs(hubIds.map((hubId) => Number(hubId)));
      }
    } else {
      setSelectedHubs([]);
      setAllHubsChecked(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      setCities(citiesData);
    }
  }, [citiesData]);

  useEffect(() => {
    if (!hubsLoading) {
      setHubs(_get(hubsData, "payload", []));
      const cityIds = queryParams.cities ? (queryParams.cities as string).split(",") : [];
      filterHubs(cityIds, _get(hubsData, "payload", []));
    }
  }, [hubsData]);

  useEffect(() => {
    if (cities?.payload?.length) setValues();
  }, [cities, window.location.search]);

  const applyFilters = () => {
    let hubIds: string[] | number[] = selectedHubs;
    if (allHubsChecked) {
      if (!selectedCities.length) {
        hubIds = ["all"];
      } else {
        hubIds = hubs.filter((hub) => selectedCities.find((city) => city.id === hub.city.id)).map((hub) => hub.id);
      }
    }
    onApplyFilters(selectedCities.length ? selectedCities.map((city) => city.id) : null, hubIds);
    closeDrawer();
  };

  const searchCities = async (query: OnQueryParams) => {
    const { filter, page } = query;
    const params = qs.stringify({
      name: filter,
      page,
    });
    setFilters({
      page,
      name: filter,
    });
    const result = await networkService.get<HTTPResourceResponse<CityV2[]>>(`/cities?${params}`);
    return result.data;
  };

  const handleCitySelect = (values: CityV2[]) => {
    setSelectedCities(values);
    if (values.length) {
      filterHubs(values.map((city) => `${city.id}`));
    } else {
      setFilteredHubs(hubs);
    }
  };

  if (loading) {
    return <Skeleton parts={["field", "divider", "block"]} />;
  }
  return (
    <div className="pt-10 h-100 ui-flex column">
      <div>
        <AsyncSelect
          value={selectedCities || []}
          multiple
          placeholder={t("filter_by_cities")}
          onChange={handleCitySelect}
          data={cities?.payload || []}
          total={cities?.total || cities?.payload?.length || 0}
          onQuery={searchCities}
          labelKey="name"
          valueKey="id"
        />
      </div>
      <Divider vertical={30} />
      {hubs && (
        <Checkbox
          value="all"
          label={t("all")}
          className="mb-5"
          checked={allHubsChecked}
          onChange={(e) => {
            setAllHubsChecked(e.target.checked);
          }}
        />
      )}
      {hubs.length && (
        <div className="orders-hubs-list">
          {filteredHubs?.length ? (
            filteredHubs?.map((hub: Hub) => {
              {
                return (
                  <Checkbox
                    className="mt-10 w-100"
                    key={hub.id}
                    label={hub.name}
                    checked={allHubsChecked || selectedHubs.includes(hub.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedHubs([...selectedHubs, hub.id]);
                      } else {
                        setSelectedHubs(selectedHubs.filter((id) => id !== hub.id));
                      }
                    }}
                  />
                );
              }
            })
          ) : (
            <Typography>{t("no_hubs_data")}</Typography>
          )}
        </div>
      )}
      <div className="ui-flex column">
        <Divider />
        <div className="ui-flex w-100 end">
          <Button disabled={!allHubsChecked && !selectedHubs.length} onClick={applyFilters}>
            {t("apply")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SelectHubsDrawer };
