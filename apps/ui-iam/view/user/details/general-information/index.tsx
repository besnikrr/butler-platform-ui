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
import { PERMISSION, User } from "@butlerhospitality/shared";

const GeneralInformation: React.FC<{ user: User }> = ({ user }): JSX.Element => {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const canPatchUser = can && can(PERMISSION.IAM.CAN_UPDATE_USER);

  return (
    <Row>
      <Column>
        <Card
          className="iam-content"
          page
          header={
            <>
              <Typography h2>{t("General Information")}</Typography>
              {canPatchUser && (
                <Link component={ButtonBase} onClick={() => history.push(`/iam/users/edit/${user.id}`)}>
                  {t("edit")}
                </Link>
              )}
            </>
          }
        >
          <Row cols={1}>
            <Column className="mt-10">
              <Typography size="small" p muted className="mb-5">
                {t("id")}
              </Typography>
              <Typography>{user.id}</Typography>
            </Column>
            <Column>
              <Typography size="small" p muted className="mb-5">
                {t("full_name")}
              </Typography>
              <Typography>{user.name}</Typography>
            </Column>
            <Column>
              <Typography size="small" p muted className="mb-5">
                {t("email")}
              </Typography>
              <Typography>{user.email}</Typography>
            </Column>
            {user?.phone_number && (
              <Column>
                <Typography size="small" p muted className="mb-5">
                  {t("phone_number")}
                </Typography>
                <Typography>{user.phone_number}</Typography>
              </Column>
            )}
            {user.roles && user.roles.length > 0 && (
              <Column>
                <Typography size="small" p muted className="mb-5">
                  {t("roles")}
                </Typography>
                <div className="ui-flex wrap">
                  {user.roles.map((role: any) => {
                    return (
                      <Chip className="mr-5 mb-5" key={role.id}>
                        {role.name}
                      </Chip>
                    );
                  })}
                </div>
              </Column>
            )}
          </Row>
        </Card>
      </Column>
    </Row>
  );
};

export default GeneralInformation;
