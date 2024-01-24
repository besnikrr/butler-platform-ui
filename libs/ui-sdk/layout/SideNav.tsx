import React from 'react';

// interface SideNavProps {}

const SideNav: React.FC = (props) => {
  return (
    <div className='ui-side-nav'>
      <div className='ui-sidebar'>
        {props.children}
      </div>
    </div>
  )
}

export default SideNav;
