import React, { useState, useEffect } from "react";
import {
  AppEnum,
  ErrorObjectType,
  ResourceResponse,
} from "@butlerhospitality/shared";
import {
  useApi,
  Typography,
  Link,
  Icon,
  Input,
} from "@butlerhospitality/ui-sdk";
import { AxiosInstance } from "axios";
import { useTranslation } from "../../package/localization";
import { Button, Divider, Modal } from "../../component";

interface DeleteResourceMeta {
  label?: string;
  resource: string;
  id: string;
  relations?: { id: string; name: string; path: string }[];
}

interface DeleteResourceProps {
  onClose: () => void;
  onDelete: () => void;
  meta: DeleteResourceMeta;
  api?: AxiosInstance;
  customDelete?: boolean;
}

export const useDeleteResource = () => {
  const [deleteResourceMeta, setDeleteResourceMeta] =
    useState<DeleteResourceMeta>();
  return { deleteResourceMeta, setDeleteResourceMeta };
};

const DeleteResource: React.FC<DeleteResourceProps> = (props): JSX.Element => {
  const [deleteText, setDeleteText] = useState<string>();
  const [isDisabled, setIsDisabled] = useState(true);

  const { t } = useTranslation();
  const networkServiceApi = useApi(AppEnum.NETWORK);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<ErrorObjectType>();

  const deleteButtonOnClick = () => {
    setError(undefined);
    const deleteAction = async () => {
      try {
        setIsDeleting(true);

        if (!props.customDelete) {
          const apiUrl = props.api ? props.api : networkServiceApi;
          await apiUrl.delete<ResourceResponse<boolean>>(
            `/${props.meta.resource}/${props.meta.id}`
          );
        }

        props.onDelete();
      } catch (err: any) {
        setError(err.response.data);
      }
    };
    deleteAction();
  };

  useEffect(() => {
    if (deleteText === validation) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [deleteText]);

  const toUpperCaseLabel = (label: string = "") => {
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
  };
  const validation = "DELETE_HOTEL";

  const generateLink = (id: string, type: string) => {
    switch (type) {
      case "city":
        return `network/city/view/${id}`;
      case "hub":
        return `network/hub/view/${id}`;
      case "hotel":
        return `/network/hotel/view/${id}`;
      default:
        return "";
    }
  };

  return (
    <Modal visible onClose={props.onClose} style={{ width: 360 }}>
      {!error ? (
        <div>
          <Typography h2>
            {t("Delete")}{" "}
            {toUpperCaseLabel(props.meta.label) ||
              toUpperCaseLabel(props.meta.resource)}
            ?
          </Typography>
          <Divider />
          {console.log("props1", props)}
          <Typography size="large">
            {t("Are you sure you want to delete this")}{" "}
            {toUpperCaseLabel(props.meta.label) ||
              toUpperCaseLabel(props.meta.resource)}
            ?
          </Typography>

          <div className="mt-30">
            {props.meta.relations?.[0].id && (
              <Typography>
                {`This ${props.meta.label?.toLowerCase()} is currently used on`}{" "}
                :
              </Typography>
            )}
            <Typography size="large" className="text-capitalize" p>
              {props.meta.relations?.[0].path}
            </Typography>
            <ul className="mt-10">
              {props.meta.relations?.map((item: any) => (
                <li key={item.id} className="my-5">
                  <Link
                    size="medium"
                    href={generateLink(item.id, item.path)}
                    target="_blank"
                    className="ui-flex v-center between ui-border p-5 ui-rounded"
                  >
                    {item.name}
                    <Icon type="Link" size={14} className="ml-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {props.meta.relations?.[0].id && (
            <div className="ui-flex mt-30 column end">
              <Typography className="mb-5">
                Type: "{validation}" to continue
              </Typography>
              <Input
                placeholder={validation}
                onChange={(event) => setDeleteText(event.target.value)}
              />
            </div>
          )}
          <Divider vertical={30} />
          {props.meta.relations?.[0].id && (
            <div className="ui-flex v-center end">
              <Button size="large" variant="ghost" onClick={props.onClose}>
                Cancel
              </Button>
              <Button
                disabled={isDisabled}
                size="large"
                variant="danger"
                className="ml-10"
                onClick={deleteButtonOnClick}
              >
                Continue
              </Button>
            </div>
          )}
          {!props.meta.relations?.[0].id && (
            <div className="ui-flex end mt-30">
              <Button size="large" variant="ghost" onClick={props.onClose}>
                {t("Cancel")}
              </Button>
              <Button
                disabled={isDeleting}
                size="large"
                variant="danger"
                className="ml-20"
                onClick={deleteButtonOnClick}
              >
                {t("Delete")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Typography h2 className="ui-link-danger">
            Error
          </Typography>
          <Divider />
          <Typography size="large">{error.message}</Typography>
          <div className="ui-flex end mt-30">
            <Button size="large" variant="ghost" onClick={props.onClose}>
              {t("Cancel")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export { DeleteResource, DeleteResourceMeta };
