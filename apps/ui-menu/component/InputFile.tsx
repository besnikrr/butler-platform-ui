import React, { useState, useRef } from 'react';
import { ChangeHandler, RefCallBack } from 'react-hook-form';
import { Link, ButtonBase, Icon, Tooltip, useTranslation } from "@butlerhospitality/ui-sdk";
import { useForkRef } from 'libs/ui-sdk/util';
import classNames from 'classnames';

import './input-file.scss';
interface InputFileProps extends React.HTMLAttributes<HTMLInputElement> {
  onChange: any;
  onBlur: ChangeHandler;
  ref: RefCallBack;
  name: string;
  error?: string;
}

const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(({  onChange, error, name, ...props}, ref) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<any>(null);
  const rawRef = useRef<any>(null);
  const fileInputRef = useForkRef(ref, rawRef);

  const fileInputOnChange = (event: any) => {
    setFile(event.target.files[0]);
    onChange({ target: { name, value: event.target.files[0] } });
  }

  const removeFile = (event: any) => {
    event.preventDefault();
    if (rawRef.current) {
      rawRef.current.value = "";
    }
    setFile(null);
    onChange({ target: { name, value: null } });
  }

  return (
    <div style={{ height: 20 }} className={classNames('ui-input-file', { 'ui-input-error': error })}>
      {!file ?
        <div>
          <Link size='medium' variant={error ? 'danger' : 'primary'} component={ButtonBase} type="file"
            onClick={(e: any) => {
              e.preventDefault();
              rawRef?.current?.click();
            }}>{t('upload_attachment')}</Link>
          <input {...props} ref={fileInputRef} accept="image/*" type="file" onChange={fileInputOnChange} hidden style={{ display: "none" }} />
        </div>
        :
        <div className='ui-flex v-center'>
          <span>{file.name}</span>
          <Link component={ButtonBase} onClick={removeFile} className='ml-5'>
            <Icon type="Close" size={20} />
          </Link>
        </div>
      }
      {error &&
        <Tooltip offset={[0, 15]} content={error} placement='right'>
          <Icon className='ml-5' type='Infoi' size={18} />
        </Tooltip>}
    </div>
  );
});

export default InputFile;
