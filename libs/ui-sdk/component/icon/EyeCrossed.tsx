import React from 'react';

const EyeCrossed = (
  <>
    <mask height='40' id='maskeyc' width='40' x='0' y='0' maskUnits='userSpaceOnUse'>
      <path d='M35.8387 35.8333L0.00541925 0L0 40H40V0H9.49686V5.95921L37.7417 34.2055L35.8387 35.8333Z' fill='white' />
    </mask>
    <g mask='url(#maskeyc)'>
      <path d='M4.1665 5L34.9998 35.8333' stroke='currentColor' strokeWidth='2.50338' />
      <path
        d='M20.0271 30.7081C12.08 30.7081 5.37121 26.2262 2.75021 20.027C5.37121 13.8279 12.08 9.34596 20.0271 9.34596C27.9741 9.34596 34.6829 13.8279 37.3039 20.027C34.6829 26.2262 27.9741 30.7081 20.0271 30.7081Z'
        stroke='currentColor'
        strokeWidth='2.3'
      />
      <circle cx='20.0268' cy='20.027' r='5.67432' stroke='currentColor' strokeWidth='2.3' />
    </g>
  </>
);

export default EyeCrossed;
