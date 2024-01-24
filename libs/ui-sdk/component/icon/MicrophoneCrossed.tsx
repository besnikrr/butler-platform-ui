import React from 'react';

const MicrophoneCrossed = (
  <>
    <mask height='40' id='maskmic' width='40' x='0' y='0' maskUnits='userSpaceOnUse'>
      <path d='M35.8387 35.8333L0.00541925 0L0 40H40V0H9.49686V5.95921L37.7417 34.2055L35.8387 35.8333Z' fill='white' />
    </mask>
    <g mask='url(#maskmic)'>
      <path d='M4.1665 4.99988L34.9998 35.8332' stroke='currentColor' strokeWidth='2.50338' />
      <path
        d='M20.0002 38.3333V32.5757M20.0002 32.5757C13.5568 32.5757 8.3335 27.6916 8.3335 21.6666M20.0002 32.5757C26.4435 32.5757 31.6668 27.6916 31.6668 21.6666'
        stroke='currentColor'
        strokeWidth='2.3'
      />
      <path
        d='M14.3348 9.99992C14.3348 6.87105 16.8713 4.3346 20.0002 4.3346C23.129 4.3346 25.6655 6.87105 25.6655 9.99992V19.9999C25.6655 23.1288 23.129 25.6652 20.0002 25.6652C16.8713 25.6652 14.3348 23.1288 14.3348 19.9999V9.99992Z'
        stroke='currentColor'
        strokeWidth='2.3'
      />
    </g>
  </>
);

export default MicrophoneCrossed;
