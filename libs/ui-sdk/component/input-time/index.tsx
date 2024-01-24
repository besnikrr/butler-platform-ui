import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { DropdownBase } from '../../primitive/dropdown';
import { useForkRef } from '../../util/index';
import { Card } from '../card';
import { Icon } from '../icon';
import { Input } from '../input';
import { List, ListItem } from '../list';
import InputAddon from '../input-addon';

import './index.scss';

interface InputTimeProps extends React.HTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
  error?: string;
  inputClassName?: string;
}

const dateNow = new Date();
const hoursNow = dateNow.getHours();
const minutesNow = dateNow.getMinutes();
const timeNow = hoursNow > 12 ? 'PM' : 'AM';

const InputTime: React.FC<InputTimeProps> = React.forwardRef<HTMLInputElement, InputTimeProps>(({ className, inputClassName, error, ...props }, ref) => {
  const inputRawRef = useRef<HTMLInputElement>(null);
  // @ts-ignore
  const inputRef = useForkRef<HTMLInputElement>(ref as any, inputRawRef);
  const [time, setTime] = useState({
    hours: hoursNow < 10 ? `0${hoursNow}` : `${hoursNow}`,
    minutes: minutesNow < 10 ? `0${minutesNow}` : `${minutesNow}`,
    time: timeNow,
  });

  const setTimeValue = (value: string) => {
    let [tempHours, tempMinutes] = value.split(':');
    let tempTime = 'AM';
    if (Number(tempHours) >= 12) {
      const hr = Number(tempHours) - 12;
      tempHours = `${hr < 10 ? '0' : ''}${hr}`;
      tempTime = 'PM';
    }
    setTime({
      hours: tempHours,
      minutes: tempMinutes,
      time: tempTime,
    });
  }

  useEffect(() => {
    if (!inputRawRef.current) return;
    const handleChange = (e: any) => {
      setTimeValue(e.target.value);
      props.onChange?.(e);
    };
    setTimeValue(inputRawRef.current.value);
    inputRawRef.current.addEventListener('change', handleChange);
    return () => {
      if (!inputRawRef.current) return;
      inputRawRef.current.removeEventListener('change', handleChange);
    };
  }, [inputRawRef]);

  const onHourClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (inputRawRef.current) {
      const [tempHours, tempMinutes] = inputRawRef.current.value.split(':');
      if (Number(tempHours) >= 12) {
        const hr = Number(e.currentTarget.textContent);
        if (hr === 12) {
          inputRawRef.current.value = `${hr}:${time.minutes}`;
        } else {
          inputRawRef.current.value = `${hr + 12}:${time.minutes}`;
        }
      } else {
        inputRawRef.current.value = `${e.currentTarget.textContent || '00'}:${time.minutes}`;
      }
      inputRawRef.current.dispatchEvent(new Event('change'));
    }
  }

  const onMinuteClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (inputRawRef.current) {
      const [tempHours] = inputRawRef.current.value.split(':');
      inputRawRef.current.value = `${tempHours}:${e.currentTarget.textContent || '00'}`;
      inputRawRef.current.dispatchEvent(new Event('change'));
    }
  }

  const onClickTime = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const tempTime = e.currentTarget.textContent;
    if (inputRawRef.current) {
      if (tempTime === 'AM') {
        inputRawRef.current.value = `${time.hours}:${time.minutes}`;
      } else if (tempTime === 'PM') {
        if (Number(time.hours) < 12) {
          inputRawRef.current.value = `${Number(time.hours) + 12}:${time.minutes}`;
        } else {
          inputRawRef.current.value = `00:${time.minutes}`;
        }
      }
      inputRawRef.current.dispatchEvent(new Event('change'));
    }
  }

  return (
    <DropdownBase
      attachment={`top left`}
      targetAttachment={`bottom left`}
      offset={'-10px 0'}
      dropdownComponent={Card}
      dropdownComponentStyle={{
        maxHeight: 170,
        overflowY: 'auto',
      }}
      renderTrigger={(openDropdown, triggerRef, open) => (
        <Input
          {...props}
          ref={inputRef}
          rightAddon={
            <InputAddon onClick={openDropdown}>
              <Icon type='Clock' size={18} />
            </InputAddon>
          }
          defaultValue={props.defaultValue || `${time.hours}:${time.minutes}`}
          error={error}
          type='time'
          className={classNames('ui-input-time-trigger', { 'ui-select-open': open, 'ui-disabled': props.disabled }, inputClassName)}
          onFocus={!props.disabled ? openDropdown : undefined}
          wrapperProps={{
            // @ts-ignore
            ref: triggerRef
          }}
        />
      )}
      className={classNames('ui-input-time', className)}
    >
      <div className='ui-time-list-wrapper'>
        <List>
          {/* render ListItem with count until 12  with format 00 */}
          {
            Array.from(Array(12).keys()).map(i => (
              <ListItem onClick={onHourClick} selected={`${(i + 1 < 10 ? `0${i + 1}` : `${i + 1}`)}` === time.hours || ((Number(time.hours) === 0) && (i + 1 == 12))} key={i}>{i + 1 < 10 ? `0${i + 1}` : i + 1}</ListItem>
            ))
          }
        </List>
        <List>
          {/* render ListItem with count until 60 with format 00 */}
          {
            Array.from(Array(60).keys()).map(i => <ListItem onClick={onMinuteClick} selected={`${(i < 10 ? `0${i}` : i)}` === time.minutes} key={i}>{i < 10 ? `0${i}` : i}</ListItem>)
          }
        </List>
        <List>
          <ListItem selected={time.time === 'AM'} onClick={onClickTime}>AM</ListItem>
          <ListItem selected={time.time === 'PM'} onClick={onClickTime}>PM</ListItem>
        </List>
      </div>
    </DropdownBase>
  );
});

export { InputTime };
