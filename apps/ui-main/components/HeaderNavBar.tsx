import React, { useContext } from "react";
import {
  Icon,
  Typography,
  Dropdown,
  Button,
  ActionButton,
  SignOut,
  AppContext,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import ButlerLogo from "../assets/ButlerLogo";
import ProfilePlaceholder from "../assets/ProfilePlaceholder";

const NavBar: React.FC = () => {
  const {
    tenant: { cognito },
    setIsUserAuthenticated,
  } = useContext(AppContext);
  const history = useHistory();

  const logOutOnClick = async () => {
    await SignOut(cognito);
    setIsUserAuthenticated?.(false);
    history.push("/sign-in");
  };

  return (
    <div className="ui-flex between pt-10 pl-20">
      <div className="network-navbar-header ui-flex v-center">
        <div className="mr-40">
          <ActionButton onClick={() => history.push("/")} className="p-0">
            <ButlerLogo />
          </ActionButton>
        </div>
      </div>
      <div className="ui-flex v-center mr-20">
        <Dropdown
          renderTrigger={(openDropdown, triggerRef) => (
            <Button
              ref={triggerRef}
              onClick={openDropdown}
              iconOnly
              style={{ background: "none", padding: 0 }}
            >
              <ProfilePlaceholder />
            </Button>
          )}
          placement="right"
          hasArrow
        >
          <Button
            variant="ghost"
            className="main-user-settings"
            onClick={logOutOnClick}
            leftIcon={<Icon type="Lock" size={20} />}
          >
            <Typography size="large" onClick={logOutOnClick}>
              Log out
            </Typography>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavBar;
