import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext, ButtonBase, Link, Typography, useTranslation } from "@butlerhospitality/ui-sdk"
import { PERMISSION } from "@butlerhospitality/shared";

export default (title: string, path: string): JSX.Element => {
	const { can } = useContext(AppContext);
  const { t } = useTranslation();
	const history = useHistory();
	const canEditItem = can(PERMISSION.MENU.CAN_UPDATE_ITEM);

	return (
		<>
			<Typography h2>{title}</Typography>
			{
				canEditItem &&
				<Link component={ButtonBase} onClick={() => history.push(path)}>{t('edit')}</Link>
			}
		</>
	)
}