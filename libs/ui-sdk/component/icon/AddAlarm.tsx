import React from 'react';

const AddAlarm = (
  <>
    <path
      d='M34.4138 21.8237C34.4138 29.6158 28.0971 35.9325 20.305 35.9325C12.513 35.9325 6.19629 29.6158 6.19629 21.8237C6.19629 14.0317 12.513 7.715 20.305 7.715C28.0971 7.715 34.4138 14.0317 34.4138 21.8237Z'
      stroke='currentColor'
      strokeWidth='2'
    />
    <path
      d='M20.3049 21.8238V13.43M20.3049 21.8238V30.2175M20.3049 21.8238H28.6986M20.3049 21.8238H11.9111'
      stroke='currentColor'
      strokeWidth='2'
    />
    <mask id='maskaddalrm' mask-type='alpha' maskUnits='userSpaceOnUse' x='0' y='1' width='41' height='21'>
      <path
        d='M20.3052 3.3575C10.1065 3.3575 1.83891 11.6251 1.83891 21.8237H0.160156V1.67875H40.4502V21.8237H38.7714C38.7714 11.6251 30.5038 3.3575 20.3052 3.3575Z'
        fill='white'
      />
    </mask>
    <g mask='url(#maskaddalrm)'>
      <path
        d='M14.2689 10.0725C14.2689 13.2288 11.7102 15.7875 8.55387 15.7875C5.39756 15.7875 2.83887 13.2288 2.83887 10.0725C2.83887 6.91619 5.39756 4.3575 8.55387 4.3575C11.7102 4.3575 14.2689 6.91619 14.2689 10.0725ZM37.7714 10.0725C37.7714 13.2288 35.2127 15.7875 32.0564 15.7875C28.9001 15.7875 26.3414 13.2288 26.3414 10.0725C26.3414 6.91619 28.9001 4.3575 32.0564 4.3575C35.2127 4.3575 37.7714 6.91619 37.7714 10.0725Z'
        stroke='currentColor'
        strokeWidth='2'
      />
    </g>
  </>
);

export default AddAlarm;
