import {
  Card,
  Icon,
  IconType,
  Typography,
  Column,
} from "@butlerhospitality/ui-sdk";
import { App } from "@butlerhospitality/shared";
import { Link } from "react-router-dom";
import "./styles.scss";

function AppCard({ dashboard_settings, description }: App) {
  return (
    <Column>
      <Link to={dashboard_settings?.path} style={{ textDecoration: "none" }}>
        <Card className="dashboard-card-content mt-10" size="medium">
          <div
            className="ui-flex v-center justify-items-center app-card center ui-rounded"
            style={{ backgroundColor: dashboard_settings?.color }}
          >
            <Icon
              type={dashboard_settings?.icon as IconType}
              size={30}
              style={{ color: dashboard_settings?.iconColor }}
            />
          </div>
          <div className="pt-20">
            <Typography size="large">
              <strong>{dashboard_settings?.title}</strong>
            </Typography>
            <Typography p size="large" muted className="pt-10">
              {description}
            </Typography>
          </div>
        </Card>
      </Link>
    </Column>
  );
}

export default AppCard;
