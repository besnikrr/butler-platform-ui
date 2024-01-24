import React, { useContext } from "react";
import {
  Card,
  Column,
  Row,
  Typography,
  AppContext,
  useTranslation,
  Link,
  ButtonBase,
  Chip,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import { PERMISSION, Role } from "@butlerhospitality/shared";

const GeneralInformation: React.FC<{ role?: Role }> = ({
  role,
}): JSX.Element => {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const canEditRole = can && can(PERMISSION.IAM.CAN_UPDATE_ROLE);

  return (
    <Row>
      <Column>
        <Card
          className="iam-content"
          page
          header={
            <>
              <Typography h2>{t("general_information")}</Typography>
              {canEditRole && (
                <Link
                  component={ButtonBase}
                  onClick={() => history.push(`/iam/roles/edit/${role?.id}`)}
                >
                  {t("edit")}
                </Link>
              )}
            </>
          }
        >
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("name")}
              </Typography>
              <Typography>{role?.name}</Typography>
            </div>
          </Row>
          <Row>
            <div className="ui-flex column">
              <Typography size="small" muted className="pb-10">
                {t("description")}
              </Typography>
              <Typography>{role?.description}</Typography>
            </div>
          </Row>
          {role && role.permissiongroups?.length > 0 && (
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("permission_groups")}
                </Typography>
                <div className="ui-flex wrap">
                  {role.permissiongroups.map((permission) => {
                    return (
                      <Chip className="mr-5 mb-5" key={permission.id}>
                        {permission.name}
                      </Chip>
                    );
                  })}
                </div>
              </div>
            </Row>
          )}
        </Card>
      </Column>
    </Row>
  );
};

GeneralInformation.defaultProps = {
  role: {
    name: "",
    description: "",
    permissiongroups: [],
  },
};

export default GeneralInformation;
