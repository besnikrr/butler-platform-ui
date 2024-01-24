import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ButtonBase, Icon } from '@butlerhospitality/ui-sdk';

interface SortableSubcategoryListProps {
  className?: string;
  subcategories: any;
  onTabClick: any;
  activeTab: string;
  onReorder: any;
  sortedSubcategoriesInput: string[];
}

const SortableSubcategoryList = ({ subcategories, onTabClick, activeTab, onReorder, sortedSubcategoriesInput }: SortableSubcategoryListProps): JSX.Element => {
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [sortedSubcategories, setSortedSubcategories] = useState<string[]>(sortedSubcategoriesInput);

  useEffect(() => {
    setSortedSubcategories(sortedSubcategoriesInput);
  }, [sortedSubcategoriesInput]);

  const onDragEnter = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData('text/plain', e.currentTarget.id);
    const attr = e.currentTarget.getAttribute('data-order')
    setTimeout(() => {
      setDragActive(attr);
    }, 0);
  };

  const onDragOver = (event: React.DragEvent<any>) => {
    if (event.currentTarget.getAttribute('data-order')) {
      setDragOver(event.currentTarget.getAttribute('data-order'));
    }
    event.preventDefault()
    event.stopPropagation()
  };

  const onDragEnd = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOver(null);
    setDragActive(null);
  };

  const onDropFirst = () => {
    if (dragActive) {
      const currentPos = parseInt(dragActive) - 1;
      const subCategoryData = [...sortedSubcategoriesInput];
      const temp = subCategoryData.splice(currentPos, 1);
      subCategoryData.splice(0, 0, temp[0]);
      setSortedSubcategories(subCategoryData);
      onReorder(subCategoryData);
    }
    setDragOver(null);
    setDragActive(null);
  }

  const onDrop = () => {
    if (dragActive && dragOver) {
      let currentPos = parseInt(dragActive);
      let dropPos = parseInt(dragOver);
      if (currentPos > dropPos) {
        currentPos = currentPos - 1;
      } else {
        currentPos = currentPos - 1;
        dropPos = dropPos - 1;
      }
      const subCategoryData = [...sortedSubcategoriesInput];
      const temp = subCategoryData.splice(currentPos, 1);
      subCategoryData.splice(dropPos, 0, temp[0]);
      setSortedSubcategories(subCategoryData);
      onReorder(subCategoryData);
    }
    setDragOver(null);
    setDragActive(null);
  };

  return (
    <div className='menu-ordered-list ui-border-right p-10'>
      {
        sortedSubcategories.length &&
        sortedSubcategories.map((subKey: string, index: number) => {
          const subCategory = { ...subcategories[subKey] };
          subCategory.sort_order = index + 1;
          return (
            <React.Fragment key={subKey}>
              {
                index === 0 &&
                <div
                  onDragOverCapture={onDragOver}
                  onDrop={onDropFirst}
                  className={classNames('w-100 menu-drop-indicator ui-rounded', { 'active': (!!dragActive && `${subCategory.sort_order}` === dragOver && `${subCategory.sort_order}` !== dragActive) })} />
              }
              <ButtonBase
                className={classNames('ui-flex w-100 px-10 menu-sub-order-item ui-rounded', { 'drag-active': (!!dragOver && dragOver !== `${subCategory.sort_order}` && dragActive === `${subCategory.sort_order}`), 'active': activeTab === subKey })}
                draggable
                onDragStartCapture={onDragEnter}
                onDragOverCapture={onDragOver}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                data-order={subCategory.sort_order}
                data-id={subKey}
                onClick={onTabClick}
              >
                <Icon type='Drag' size={30} className='mr-10' />
                {subCategory.name}
              </ButtonBase>
              <div
                onDragOverCapture={onDragOver}
                onDrop={onDrop}
                className={classNames('w-100 menu-drop-indicator ui-rounded', { 'active': (!!dragActive && `${subCategory.sort_order}` === dragOver && `${subCategory.sort_order}` !== dragActive) })} />
            </React.Fragment>
          )
        })
      }
    </div>
  );
}

export default SortableSubcategoryList;
