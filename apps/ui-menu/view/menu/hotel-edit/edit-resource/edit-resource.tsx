import React, { useState } from "react";
import {
  Button,
  Divider,
  Link,
  Modal,
  Typography,
  useApi,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { AppEnum } from "@butlerhospitality/shared";
import { useParams, useHistory } from "react-router-dom";

export interface EditResourceMeta {
  resource: string;
  hotels: any[] | undefined;
  newAssign: any[] | undefined;
  overrideMenuHotel: any[] | undefined;
  removeMenuHotel: any[] | undefined;
}

interface EditResourceProps {
  onClose: () => void;
  meta: EditResourceMeta;
}

const EditResource: React.FC<EditResourceProps> = ({
  meta: { hotels, newAssign, overrideMenuHotel, removeMenuHotel },
  onClose,
}): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const params = useParams<{ name: string; id: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const editButtonOnClick = async () => {
    setIsEditing(true);
    await menuServiceApi.post(`/${params.id}/hotels`, {
      hotel_ids: hotels,
    });
    history.push(`/menu/menu/view/${params.id}`);
    return onClose();
  };

  return (
    <Modal
      visible
      onClose={onClose}
      style={{
        minWidth: 360,
        maxWidth: 580,
      }}
    >
      <Typography h2>{t("override_confirmation")}</Typography>
      <Divider vertical={30} />
      <Typography p muted>
        {t("menu_hotel_override_warning", { menu_name: params.name })}
      </Typography>
      <div
        className="ui-flex column start mt-30"
        style={{
          overflowY: "auto",
          maxHeight: 300,
        }}
      >
        {newAssign?.map((item) => (
          <div key={item.id} className="ui-flex v-center mt-10">
            <Typography span>{item.hotel_name}</Typography>
            <Link
              variant="primary"
              component="button"
              onClick={() => null}
              className="ml-10"
            >
              {params.name}
            </Link>
          </div>
        ))}
        {overrideMenuHotel?.map((item) => (
          <div key={item.id} className="ui-flex v-center mt-10">
            <Typography span>{item.hotel_name}</Typography>
            <Link
              variant="primary"
              component="button"
              onClick={() => null}
              className="ml-10"
            >
              <s>{item?.menus[0]?.name}</s>
            </Link>
            <Link
              variant="primary"
              component="button"
              onClick={() => null}
              className="ml-10"
            >
              {params.name}
            </Link>
          </div>
        ))}
        {removeMenuHotel?.map((item) => (
          <div key={item.id} className="ui-flex v-center mt-10">
            <Typography span>{item.hotel_name}</Typography>
            <Link
              variant="primary"
              component="button"
              onClick={() => null}
              className="ml-10"
            >
              <s>{item?.menus[0]?.name}</s>
            </Link>
            <Typography className="ml-10 text-danger" size="large" span>
              {t("no_menu_assigned")}
            </Typography>
          </div>
        ))}
      </div>
      <Divider vertical={30} />
      <div className="ui-flex end mt-30">
        <Button size="large" variant="ghost" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={isEditing}
          size="large"
          variant="primary"
          className="ml-20"
          onClick={editButtonOnClick}
        >
          {t("confirm")}
        </Button>
      </div>
    </Modal>
  );
};

export default EditResource;
