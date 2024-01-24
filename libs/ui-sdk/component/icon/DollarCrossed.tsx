import React from 'react';

const DollarCrossed = (
  <>
    <g clipPath='url(#clipdc)'>
      <mask height='41' id='maskdc' width='41' x='0' y='0' maskUnits='userSpaceOnUse'>
        <path
          d='M37.228 36.9325L0.290039 2.01874e-05V40.29H40.58V2.01874e-05L3.54349 0L38.2404 34.6969L37.228 36.9325Z'
          fill='white'
        />
      </mask>
      <g mask='url(#maskdc)'>
        <path d='M7.16455 8.29559L33.1852 34.3162' stroke='currentColor' strokeWidth='2' />
        <path
          d='M27.1502 14.8569C27.1502 11.9364 24.1438 9.56888 20.4352 9.56888M13.7202 14.8569C13.7202 11.9364 16.7266 9.56888 20.4352 9.56888M20.4352 9.56888V5.03625M27.1502 25.4331C27.1502 28.3536 24.1438 30.7211 20.4352 30.7211M20.4352 30.7211C16.7266 30.7211 13.7202 28.3536 13.7202 25.4331M20.4352 30.7211V35.2538'
          stroke='currentColor'
          strokeWidth='2'
        />
      </g>
    </g>
    <defs>
      <clipPath id='clipdc'>
        <rect height='40.29' width='40.29' fill='white' transform='translate(0.290039)' />
      </clipPath>
    </defs>
  </>
);

export default DollarCrossed;
