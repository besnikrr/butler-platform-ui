import React from 'react';

const FastFood = (
  <>
    <mask height='41' id='maskff0' width='26' x='15' y='0' maskUnits='userSpaceOnUse'>
      <path d='M15.6953 13.9737V0H40.8782V40.2927H30.8051V13.9737H15.6953Z' fill='white' />
    </mask>
    <mask height='28' id='maskff1' width='30' x='0' y='13' maskUnits='userSpaceOnUse'>
      <path
        d='M29.1261 13.4309H0.585449V40.2927H29.1261V35.9385H1.42488V31.2326H29.1261V29.2159H1.42488V24.5086H29.1261V13.4309Z'
        fill='white'
      />
    </mask>
    <g mask='url(#maskff0)'>
      <path
        d='M29.1262 1.67896V10.0733M29.1262 10.0733H37.5206L34.2723 36.0591C34.2098 36.5595 33.7844 36.9351 33.28 36.9351H24.9724C24.4681 36.9351 24.0427 36.5595 23.9802 36.0591L20.7319 10.0733H29.1262Z'
        stroke='currentColor'
        strokeWidth='2'
      />
    </g>
    <g mask='url(#maskff1)'>
      <path
        d='M3.94336 23.504C3.94336 20.1463 8.97994 16.7886 14.856 16.7886C20.732 16.7886 25.7686 20.1463 25.7686 23.504M3.94336 23.504H25.7686M3.94336 23.504V30.2195M25.7686 23.504V30.2195M3.94336 30.2195V36.8349C3.94336 36.8901 3.98813 36.9349 4.04336 36.9349H25.6686C25.7238 36.9349 25.7686 36.8901 25.7686 36.8349V30.2195M3.94336 30.2195H25.7686'
        stroke='currentColor'
        strokeWidth='2'
      />
    </g>
  </>
);

export default FastFood;
