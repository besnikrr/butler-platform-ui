import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ButtonBase } from '../../primitive/button';
import { Icon } from '../icon';

import './index.scss';
import getRange from './getRange';

export interface PaginationProps {
  pages: number;
  current: number;
  onPageChange: (page: number) => void;
  pageBufferSize?: number;
  className?: string;
}

export interface PaginationItemType {
  type: 'page' | 'dots';
  direction?: 'left' | 'right';
  page: number;
}

const Pagination: React.FC<PaginationProps> = ({ pages, current, pageBufferSize = 2, onPageChange, className }) => {
  const [pagination, setPagination] = useState<PaginationItemType[]>(getRange(current, pages));
  const [tempPage, setTempPage] = useState<number>(current);
  const [currentPage, setCurrentPage] = useState<number>(current);

  useEffect(() => {
    setCurrentPage(current || 1);
    setPagination(getRange(current || 1, pages));
  }, [current]);

  useEffect(() => {
    setPagination(getRange(current, pages));
  }, [pages]);

  const onDotsClick = (page: PaginationItemType) => {
    let visibleTempPage =
      page.direction === 'left' ? tempPage - (pageBufferSize * 2 + 1) : tempPage + (pageBufferSize * 2 + 1);
    if (visibleTempPage < 1) visibleTempPage = 1;
    if (visibleTempPage > pages) visibleTempPage = pages;
    setTempPage(visibleTempPage);
    setPagination(getRange(visibleTempPage, pages, pageBufferSize));
  };

  const changePage = (page: number) => {
    if (page === currentPage) return;
    setTempPage(page);
    setPagination(getRange(page, pages, pageBufferSize));
    setCurrentPage(page);
    onPageChange(page);
  };

  const prev = () => {
    changePage(currentPage - 1);
  };

  const next = () => {
    changePage(currentPage + 1);
  };

  return (
    <div className={classNames('ui-pagination-wrapper', className)}>
      <ButtonBase
        type='button'
        disabled={currentPage === 1}
        onClick={prev}
        className={classNames('ui-pagination-page-wrapper', { 'ui-disabled': currentPage === 1 })}
      >
        <Icon type={'ArrowLeft'} size={12} />
      </ButtonBase>
      {pagination.map((page) =>
        page.type === 'dots' ? (
          <div key={page.page} className='ui-pagination-dots' data-testid='pagination-dots'>
            <ButtonBase className='ui-pagination-dots-button' type='button' onClick={() => onDotsClick(page)}>
              <span>...</span>
              <Icon type={page.direction === 'right' ? 'DoubleArrowsRight' : 'DoubleArrowsLeft'} size={18} />
            </ButtonBase>
          </div>
        ) : (
          <ButtonBase
            key={page.page}
            type='button'
            onClick={() => changePage(page.page)}
            className={classNames('ui-pagination-page-wrapper', { 'ui-pagination-page-active': page.page === currentPage, 'ui-muted': page.page !== currentPage })}
          >
            {page.page}
          </ButtonBase>
        ),
      )}
      <ButtonBase
        type='button'
        disabled={currentPage === pages}
        onClick={next}
        className={classNames('ui-pagination-page-wrapper', { 'ui-disabled': currentPage === pages })}
      >
        <Icon type={'ArrowRight'} size={12} />
      </ButtonBase>
    </div>
  );
};

export { Pagination };
