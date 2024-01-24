import {
  Grid,
  Row,
  Column,
  AppState,
  Spinner,
} from "@butlerhospitality/ui-sdk";

const appStateInfo: { [key in AppState]: string } = {
  [AppState.Initializing]: "Loading",
  [AppState.Authenticating]: "Loading",
  [AppState.GettingTenant]: "Loading",
  [AppState.GettingUserProfile]: "Loading",
  [AppState.Initialized]: "Loading",
  [AppState.ErrorsPreventedInitializing]: "Loading",
};

function AppStateInfo({ state }: { state: AppState }) {
  return (
    <Grid gutter={30}>
      <div className="sign-in-page-wrapper">
        <Row>
          <Column size={12}>
            <div className="ui-flex column center v-center justify-items-center align-items-center app-card center ui-rounded">
              <Spinner />
              {appStateInfo[state]}
            </div>
          </Column>
        </Row>
      </div>
    </Grid>
  );
}

export default AppStateInfo;


