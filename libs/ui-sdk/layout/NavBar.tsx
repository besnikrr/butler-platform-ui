import React from 'react';

// interface NavBarProps {}

const NavBar: React.FC = (props) => {
  return (
    <div className='ui-header'>
      {/* nav */}
      <div className='ui-header-nav'>
        {props.children}
      </div>
      {/* sub-nav: TBD */}
      {/* <div className='ui-header-subnav'></div> */}
    </div>
  )
}

export default NavBar;
