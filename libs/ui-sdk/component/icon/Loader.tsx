import React from 'react';

const Loader = (
  <>
    <mask height='40' id='maskl' width='40' x='0' y='0' maskUnits='userSpaceOnUse'>
      <path
        d='M20 28.3333C24.6024 28.3333 28.3333 24.6024 28.3333 20C28.3333 15.3976 24.6024 11.6667 20 11.6667C19.129 11.6667 18.2892 11.8003 17.5 12.0482L13.3333 0H40V40H0V0H5L16.3632 12.5C13.5831 13.8506 11.6667 16.7015 11.6667 20C11.6667 24.6024 15.3976 28.3333 20 28.3333Z'
        fill='white'
      />
    </mask>
    <g mask='url(#maskl)'>
      <path
        d='M19.9998 1.66663V38.3333M32.9635 7.0363L7.0362 32.9635M38.3332 20L1.6665 20M32.9635 32.9636L7.0362 7.03637'
        stroke='currentColor'
        strokeWidth='2.3'
      />
    </g>
  </>
);

export default Loader;
