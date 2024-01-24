import React from "react";
import {
  Grid,
  Row,
  Typography,
  Column,
  useTranslation,
  Skeleton,
} from "@butlerhospitality/ui-sdk";
import { App } from "@butlerhospitality/shared";
import AppCard from "./component/app-card";

import "./component/styles.scss";
import { useFetchApps } from "../../store/app";

const AppDashboardListView = (): JSX.Element => {
  const { t } = useTranslation();

  const { data: apps, isLoading: appsLoading } = useFetchApps({});

  return (
    <div className="m-auto dashboard-wrapper">
      <Grid gutter={10} type="fluid">
        <Row>
          <Typography h2 className="ui-flex center py-20">
            {t("Butler Platform")}
          </Typography>
        </Row>
        <Column>
          <Row className="mt-10">
            <Typography size="large">All Apps</Typography>
            {appsLoading ? (
              <Skeleton parts={["appCard"]} />
            ) : (
              <Row colsLg={4} colsMd={3} colsSm={3} cols={2} gutter={10}>
                {(apps || []).map((app: App) => {
                  const hasDashboardSettings =
                    Object.keys(app.dashboard_settings).length !== 0;

                  return (
                    hasDashboardSettings && (
                      <React.Fragment key={app.id}>
                        <AppCard {...app} />
                      </React.Fragment>
                    )
                  );
                })}
              </Row>
            )}
          </Row>
        </Column>
      </Grid>
    </div>
  );
};

export default AppDashboardListView;
