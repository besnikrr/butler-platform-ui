import React from 'react';
import ReactDOM, { Container } from 'react-dom';
import { ImgBase, ImgBaseProps } from '../../primitive';

import './index.scss';

interface ImageProps extends ImgBaseProps {
  size?: 'small' | 'medium' | 'large';
  src: string;
}

// TODO: move to icons?
const ErrorImage: React.FC<{ size: number | string }> = (props) => {
  return (
    <div id="blank-image" style={{ minWidth: props.size, minHeight: props.size, maxWidth: props.size, maxHeight: props.size }} {...props}>
      <svg width={props.size} height={props.size} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.64844 18.5135L8.12539 15.1455L10.4434 17.3909L16.8178 11.2162L24.3511 18.5135" stroke="#D4D4D4"
          strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="1" y="1" width="27" height="27" stroke="#D4D4D4" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Image: React.FC<ImageProps> = (props) => {
  const ref = React.useRef<HTMLImageElement>(null);
  return (
    <ImgBase
      {...props}
      // onError={(e) => {
      //   const temp: HTMLDivElement = document.querySelector('#blank-image')?.cloneNode(true) as HTMLDivElement;
      //   if (!temp) ReactDOM.render(<ErrorImage size={props.width || 40} {...props} />, e.currentTarget.parentElement);
      //   else {
      //     // add width/height attribute to temp
      //     temp.setAttribute('width', `${props.width || 40}`);
      //     temp.setAttribute('height', `${props.height || 40}`);
      //     e.currentTarget.replaceWith(temp || '');
      //   }
      // }}
    />
  );
}

export { Image };
