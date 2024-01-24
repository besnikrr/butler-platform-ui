import React from 'react';
import { Icon, Typography } from '@butlerhospitality/ui-sdk';
const NoResult = (): JSX.Element => {
  return (
    <div className="ui-flex center py-40">
      <div className="ui-flex column v-center center ">
        <Icon type='Search' size={30} className="mb-10"/>
        <Typography size="large">No Results</Typography>
        <Typography size="small" muted className="mt-20">No results found. Please check your filters.</Typography>
      </div>
    </div>
  );
};

export default NoResult;
