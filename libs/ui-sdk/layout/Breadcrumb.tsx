import classNames from 'classnames';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '../component/typography';
import { Link } from '../primitive/link';
import { BreadcrumbContext } from './Wrapper';

interface BreadcrumbProps {
  className?: string;
}

const Breadcrumb = (props: BreadcrumbProps): JSX.Element => {
  const { breadcrumbs } = useContext(BreadcrumbContext);

  return (
    <div className={classNames('ui-breadcrumb', props.className)}>
      {
        (breadcrumbs || []).map((item: any, index: number) => {
          if (!item.path) {
            return (
              <div className='ui-breadcrumb-item' key={index}>
                <Typography>{item.title}</Typography>
              </div>
            );
          }
          return (
            <React.Fragment key={index}>
              <Link size='medium' component={RouterLink} to={item.path} className='ui-breadcrumb-item' muted key={index}>
                {item.title}
              </Link>
              <span className='ui-breadcrumb-slash ui-muted'>/</span>
            </React.Fragment>
          )
        })
      }
    </div>
  );
}

export default Breadcrumb;
