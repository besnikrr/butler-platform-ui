import React, { createContext, useReducer } from 'react';
import classNames from 'classnames';

interface WrapperProps {
  withBreadcrumb?: boolean;
  compact?: boolean;
}

export const Context = {
  breadcrumbs: null,
  setBreadcrumbs: (breadcrumbs: any) => {
    return breadcrumbs;
  }
};

const BreadcrumbContext = createContext<any>(Context);

const actions = {
  SET_BREADCRUMBS: 'SET_BREADCRUMBS',
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.SET_BREADCRUMBS: {
      return { breadcrumbs: action.value };
    }
    default:
      return state;
  }
};

const BreadcrumbProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, { ...Context, ...props.theme });

  const contextValue = {
    ...state,
    setBreadcrumbs: (value: any) => {
      dispatch({ type: actions.SET_BREADCRUMBS, value });
    },
  };

  return <BreadcrumbContext.Provider value={contextValue}>{props.children}</BreadcrumbContext.Provider>;
};

const Wrapper: React.FC<WrapperProps> = (props) => {
  if (props.withBreadcrumb) {
    return (
      <BreadcrumbProvider>
        <div className={classNames('ui-wrapper', { 'ui-with-breadcrumb': props.withBreadcrumb })}>
          {props.children}
        </div>
      </BreadcrumbProvider>
    )
  }
  return (
    <div className={classNames('ui-wrapper', { 'ui-wrapper-compact': props.compact })}>
      {props.children}
    </div>
  )
}

export { BreadcrumbContext };
export default Wrapper;
