import React from 'react';

const PenCrossed = (
  <>
    <mask height='40' id='maskpec' width='40' x='0' y='0' maskUnits='userSpaceOnUse'>
      <path d='M35.8387 35.8333L0.00541925 0L0 40H40V0H9.49686V5.95921L37.7417 34.2055L35.8387 35.8333Z' fill='white' />
    </mask>
    <g mask='url(#maskpec)'>
      <path d='M5.8335 6.66663L33.3335 34.1666' stroke='currentColor' strokeWidth='2.50338' />
      <path
        d='M6.00135 33.9985V29.1647L28.278 6.88804C28.5387 6.62734 28.9613 6.62734 29.222 6.88804L33.1118 10.7778C33.3725 11.0385 33.3725 11.4612 33.1118 11.7219L10.8352 33.9985H6.00135Z'
        stroke='currentColor'
        strokeWidth='2.3'
      />
    </g>
  </>
);

export default PenCrossed;
