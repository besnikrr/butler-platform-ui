import React from 'react';

// interface MainProps {}

const Body: React.FC = (props) => {
  return (
    <div className='ui-main'>
      {props.children}
    </div>
  )
}

export default Body;
