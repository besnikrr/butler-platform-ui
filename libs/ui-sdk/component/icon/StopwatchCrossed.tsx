import React from 'react';

const StopwatchCrossed = (
  <>
    <mask id='maskstpwtchcrossed' mask-type='alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='41' height='41'>
      <path
        d='M36.6787 36.0931L0.585537 0L0.580078 40.29H40.8701V0H10.1458V6.00241L38.5954 34.4535L36.6787 36.0931Z'
        fill='white'
      />
    </mask>
    <g mask='url(#maskstpwtchcrossed)'>
      <path d='M6.45557 6.715L34.1549 34.4144' stroke='currentColor' strokeWidth='2' />
      <path
        d='M20.725 5.03625C12.3806 5.03625 5.61621 11.8007 5.61621 20.145C5.61621 28.4893 12.3806 35.2537 20.725 35.2537C29.0693 35.2537 35.8337 28.4893 35.8337 20.145C35.8337 16.4001 34.4713 12.9735 32.215 10.3337M20.725 5.03625C25.3244 5.03625 29.4439 7.09149 32.215 10.3337M20.725 5.03625V3.3575M35.8337 6.715L32.215 10.3337M20.725 3.3575H17.3675M20.725 3.3575H24.0825'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path d='M21 11C21 11 21 15.8758 21 19' stroke='currentColor' strokeWidth='2' />
    </g>
  </>
);

export default StopwatchCrossed;
