import { Icon, Typography } from "@butlerhospitality/ui-sdk";

const NoPermissions = ({ entity = "" }: { entity?: string }): JSX.Element => {
  return (
    <div
      className="menu-no-permissions ui-flex center py-40"
      data-testid="menu-no-permission"
    >
      <div className="ui-flex column v-center center ">
        <Icon type="WarningTriangle" size={30} className="mb-10" />
        <Typography h2>No Permissions!</Typography>
        <Typography size="small" muted className="mt-10">
          You have no permissions to view {entity}. Please contact you
          administrator!
        </Typography>
      </div>
    </div>
  );
};

export default NoPermissions;
