import React from 'react';
import {
  Icon,
  Typography
} from '@butlerhospitality/ui-sdk';

const NoResult = () => {
  return (
    <div className="ui-flex center py-40">
      <div className="ui-flex column v-center center">
        <Icon type='Grid02' size={24} className="mb-10"/>
        <Typography h2>No Results!</Typography>
        <Typography p muted className="mt-20">No results found!</Typography>
      </div>
    </div>
  );
};

export default NoResult;
