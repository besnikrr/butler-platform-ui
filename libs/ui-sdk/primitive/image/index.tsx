import React from 'react';
import classNames from 'classnames';

type ImgBaseProps = React.ImgHTMLAttributes<HTMLImageElement>;

const ImgBase = React.forwardRef<HTMLImageElement, ImgBaseProps>((props, ref) => {
  return (
    <img
      {...props}
      alt={props.alt || ''}
      ref={ref}
      className={classNames('ui-img', props.className)}
    />
  );
});

export { ImgBase, ImgBaseProps };
