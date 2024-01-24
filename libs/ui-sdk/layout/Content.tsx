import React from 'react';

const Content: React.FC = (props) => {
  return (
    <div className='ui-main-content'>
      {props.children}
    </div>
  )
}

export default Content;
