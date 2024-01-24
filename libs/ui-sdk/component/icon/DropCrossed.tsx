import React from 'react';

const DropCrossed = (
  <>
    <mask height='40' id='maskdrc' width='40' x='0' y='0' maskUnits='userSpaceOnUse'>
      <path d='M35.8387 35.8333L0.00541925 0L0 40H40V0H9.49686V5.95921L37.7417 34.2055L35.8387 35.8333Z' fill='white' />
    </mask>
    <g mask='url(#maskdrc)'>
      <path d='M4.16675 4.99988L35.0001 35.8332' stroke='currentColor' strokeWidth='2.50338' />
      <path
        d='M31.6668 24.9999C31.6668 31.4432 26.4435 36.6665 20.0002 36.6665C13.5568 36.6665 8.3335 31.4432 8.3335 24.9999C8.3335 18.5566 20.0002 4.99988 20.0002 4.99988C20.0002 4.99988 31.6668 18.5566 31.6668 24.9999Z'
        stroke='currentColor'
        strokeWidth='2.3'
      />
    </g>
  </>
);

export default DropCrossed;
