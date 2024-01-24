import React, { useState, useEffect } from "react";
import {
  Button,
  Link,
  Column,
  Grid,
  Row,
  Typography,
  Modal,
  Divider,
  ErrorMessage,
  useTranslation,
  LookupField,
  useApi,
} from "@butlerhospitality/ui-sdk";
import produce, { original } from "immer";
import { AppEnum, HubV2 } from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { HubGeneralInformationProp } from "../index.types";
import { useFetchHubs, useHubReassignHotels, useDeleteHub } from "../../../../store/hub";

import "./index.scss";

type FormStateT = { hotel_id?: string; hub_id: string; hub_name: string };

function ReassignHotels({ hub, modal, setModal, onChange, submitTxt, isDeleteAction }: HubGeneralInformationProp) {
  const { t } = useTranslation();
  const history = useHistory();
  const serviceApi = useApi(AppEnum.NETWORK);

  const [formState, setFormState] = useState<FormStateT[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [bulkReassign, setBulkReassign] = useState<boolean>(false);

  const { data: hubData, isLoading: hubsLoading } = useFetchHubs({
    filters: "statuses[0]=true",
    enabled: !!modal,
  });
  const { mutateAsync: reassignHotels } = useHubReassignHotels(`${hub?.id}`);
  const { mutate: deleteHub } = useDeleteHub(`${hub?.id}`);

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      setError("");
      await reassignHotels(formState);
      if (isDeleteAction) {
        await deleteHub();
        history.push("/network/hub/list");
      } else {
        onChange?.();
      }
      setModal?.(false);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const renderBulkReassign = () => (
    <Column sm={12}>
      <LookupField<HubV2>
        value=""
        selectProps={{
          onChange: (e: any) => {
            const selectedHubId = JSON.parse((e.target as HTMLSelectElement).value);
            const nextState = produce([], (draft: any) => {
              hub?.hotels?.forEach((hotel) => {
                draft.push({ hubId: selectedHubId, hotelId: hotel.id });
              });
            });
            setFormState(nextState);
          },
        }}
        initData={hubData}
        excludeIds={[+(hub?.id || "")]}
        placeholder={t("Select hub")}
        onQuery={(queryParams) => {
          return serviceApi.get(
            `/hubs?statuses[0]=true&page=${queryParams.page}&name=${queryParams.filter}&statuses[0]=true`
          );
        }}
      />
    </Column>
  );

  const renderAssignIndividually = () =>
    hub?.hotels?.map((hotel) => {
      return (
        <Row cols={2}>
          <Column className="ui-flex v-center">
            <Typography label>{hotel?.name}</Typography>
          </Column>
          <Column>
            <LookupField<HubV2>
              value=""
              selectProps={{
                onChange: (e: any) => {
                  const selectedHubId = JSON.parse((e.target as HTMLSelectElement).value);
                  const nextState = produce(formState, (draft: any) => {
                    const index = original(draft).findIndex((updateValue: any) => {
                      return updateValue.hotelId === +selectedHubId.hotelId;
                    });
                    if (index !== -1) {
                      draft[index] = {
                        hubId: selectedHubId,
                        hotelId: hotel.id,
                      };
                    } else {
                      const newValue = {
                        hubId: selectedHubId,
                        hotelId: hotel.id,
                      };
                      draft.push(newValue);
                    }
                  });
                  setFormState(nextState);
                },
              }}
              initData={hubData}
              excludeIds={[+(hub?.id || "")]}
              placeholder={t("Select hub")}
              onQuery={(queryParams) => {
                return serviceApi.get(
                  `/hubs?statuses[0]=true&page=${queryParams.page}&name=${queryParams.filter}&statuses[0]=true`
                );
              }}
            />
          </Column>
        </Row>
      );
    });

  useEffect(() => {
    if (hub?.hotels?.length === formState.length) {
      setHasChanges(true);
    }
  }, [formState]);

  return (
    <Modal visible={modal || false} onClose={() => undefined} style={{ minWidth: 900 }}>
      <Typography h2>
        {!isDeleteAction
          ? t("hub_manage.reassign_hotels.message", { hub_name: hub?.name })
          : t("hub_manage.reassign_hotels.delete.message", {
              hub_name: hub?.name,
            })}
      </Typography>
      <Divider vertical={30} />
      <Grid>
        {hubsLoading && (
          <Column className="ui-flex center">
            <Typography h2>{t("Loading...")}</Typography>
          </Column>
        )}
        {!hubsLoading && (
          <form>
            <Link
              component="button"
              variant="primary-light"
              size="medium"
              onClick={async (e: any) => {
                e.preventDefault();
                setBulkReassign(!bulkReassign);
                setFormState([]);
                setHasChanges(false);
              }}
            >
              {bulkReassign ? t("Bulk Reassign") : t("Assign Individually")}
            </Link>
            {hubData?.payload?.length ? (
              <>
                <Typography p className="desc-label" muted>
                  {t("associated_hotels", {
                    this_hub: hub?.hotels?.length,
                    this_hub_name: hub?.name,
                  })}
                </Typography>
                {bulkReassign && renderAssignIndividually()}
                {!bulkReassign && renderBulkReassign()}
              </>
            ) : (
              <Typography p size="large" className="desc-label" muted>
                {t("There are no hubs")}
              </Typography>
            )}
            <Divider vertical={30} />
            <div className="ui-flex end">
              <Button
                size="large"
                variant="ghost"
                onClick={() => {
                  setModal?.(false);
                  setHasChanges(false);
                  setBulkReassign(false);
                  setError("");
                  setFormState([]);
                }}
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                size="large"
                variant="primary"
                style={{ marginLeft: 20 }}
                disabled={!hasChanges}
                onClick={(e) => onSubmit(e)}
              >
                {submitTxt}
              </Button>
            </div>
            {error && (
              <div className="mt-20">
                <ErrorMessage error={error} />
              </div>
            )}
          </form>
        )}
      </Grid>
    </Modal>
  );
}

export default ReassignHotels;
