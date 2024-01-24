import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  Card,
  Chip,
  DropdownBase,
  Icon,
  List,
  ListItem,
  Tooltip
} from '@butlerhospitality/ui-sdk';
import { useForkRef } from 'libs/ui-sdk/util';

import './index.scss';

interface OptionProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value?: number | string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
}

const Option: React.FC<OptionProps> = ({ children, ...props }) => {
  return (
    <ListItem {...props}>
      {children}
    </ListItem>
  );
};

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  disabled?: boolean;
  children: React.ReactElement<OptionProps>[];
  selectProps?: React.HTMLAttributes<HTMLSelectElement>;
  value?: number | string;
  name?: string;
  error?: string;
  placeholder?: string;
}

const MultiSelect: React.FC<SelectProps> = React.forwardRef<HTMLSelectElement, SelectProps>(({ disabled, placeholder, children, selectProps, value, name, error, ...props }, ref) => {
  // useForkRef
  const dropRef = useRef<any>(null);
  const rawSelectRef = useRef<HTMLSelectElement>(null);
  // @ts-ignore
  const selectRef = useForkRef<HTMLSelectElement>(selectProps?.ref as any, rawSelectRef);
  const [vals, setVals]: any = useState([]);

  const handleOptionClick = (e: any) => {
    if (!rawSelectRef.current) return;

    const selectedOption = e.target.innerHTML
    for (let i = 0; i < rawSelectRef.current?.options.length; i++) {
      const option = rawSelectRef.current.options[i]
      if (option.innerHTML === selectedOption) {
        option.selected = !option.selected
      }
    }

    rawSelectRef.current.dispatchEvent(new Event('change'));
    if (props && props.onChange) {
      props?.onChange(e)
    }
    dropRef.current.closeDropdown();
  };

  useEffect(() => {
    if (!rawSelectRef.current) return;
    const handleChange = (e: any) => {
      const newVals = [];
      for (let i = 0; i < e.target.options.length; i++) {
        const option = e.target.options[i];
        if (option.selected) {
          newVals.push(option.value)
        }
      }
      e.target.defaultValue = newVals;
      selectProps?.onChange?.(e);
      setVals(newVals);
    };
    const checkSelected = () => {
      const newVals = [];
      // @ts-ignore
      for (let i = 0; i < rawSelectRef?.current?.options?.length; i++) {
        const option = rawSelectRef?.current?.options[i];
        if (option?.selected) {
          newVals.push(option.value)
        }
      }
      setVals(newVals);
    }
    checkSelected();
    rawSelectRef.current.addEventListener('change', handleChange);
    return () => {
      if (!rawSelectRef.current) return;
      rawSelectRef.current.removeEventListener('change', handleChange);
    };
  }, [rawSelectRef, selectProps]);

  const removeCategory = (categoryToRemove: any, index: any) => {
    if (rawSelectRef) {
      const refOption = rawSelectRef?.current?.options[index]
      if (refOption) {
        refOption.selected = false
        rawSelectRef?.current?.dispatchEvent(new Event('change'));
      }
    }
  }

  return (
    <>
      <select
        {...selectProps}
        multiple
        ref={selectRef}
        className='selectselect'
      >
        {
          React.Children.map(children, (child, index) => {
            if (!React.isValidElement<OptionProps>(child)) return null;
            return React.createElement('option', {
              ...child.props,
              key: index,
              onClick: handleOptionClick,
            })
          })
        }
      </select>
      <DropdownBase
        ref={dropRef as any}
        attachment={`top center`}
        targetAttachment={`bottom center`}
        offset={'1px 0'}
        dropdownComponent={Card}
        dropdownComponentStyle={{
          maxHeight: 170,
          overflowY: 'auto',
          borderRadius: 0,
        }}
        renderTrigger={(openDropdown, triggerRef, open) => (
          <div {...props} className={classNames('ui-select-trigger', { 'ui-select-trigger-multiple': true, 'ui-select-open': open, 'ui-disabled': disabled, 'ui-select-error': !!error })} onClick={!disabled ? openDropdown : undefined} ref={triggerRef}>
            {
              rawSelectRef?.current?.selectedIndex !== -1
                ? <div className='ui-select-multi-wrapper'>
                  {
                    React.Children.map(children, (child, index) => {
                      const option = rawSelectRef?.current?.options[index]
                      if (!React.isValidElement<OptionProps>(child)) return null;
                      return option?.selected ? (
                        <Chip
                          size='medium'
                          onClose={(e: any) => {
                            e.stopPropagation();
                            removeCategory(child.props?.children, index);
                            return false;
                          }}
                        >
                          {child.props?.children}
                        </Chip>
                      ) : null;
                    })
                  }
                </div>
                : <span className='ui-placeholder'>{placeholder}</span>}
            <div className='ui-select-suffix'>
              <Icon type='ArrowDown' size={12} />
              {
                !!error &&
                <Tooltip offset={[0, 25]} content={error} placement='right'>
                  <Icon type='Infoi' size={18} />
                </Tooltip>
              }
            </div>
          </div>
        )}
        className={classNames('ui-select', props.className)}
        matchTriggerWidth
      >
        <List>
          {/* {React.cloneElement(children, { })} */}
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement<OptionProps>(child)) return null;
            return React.cloneElement(child, {
              key: index,
              value: index,
              selected: vals.includes(child.props.value),
              onClick: handleOptionClick,
            })
          })}
        </List>
      </DropdownBase>
    </>
  );
});

export { MultiSelect, Option, SelectProps, OptionProps };
