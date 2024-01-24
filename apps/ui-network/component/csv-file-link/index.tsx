import React, { useState, useRef, useEffect } from "react";
import { ChangeHandler, RefCallBack } from "react-hook-form";
import {
  Link,
  ButtonBase,
  Icon,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import Papa from "papaparse";

interface FileLinkInterface {
  onChange: ChangeHandler;
  onBlur: ChangeHandler;
  ref: RefCallBack;
  name: string;
  error?: string;
}

const CsvFileLink: React.FC<FileLinkInterface> = (props) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        complete: (parsedData: any) => {
          props.onChange({
            target: { name: props.name, value: parsedData.data[0] },
          });
        },
      });
    }
  }, [file]);

  const fileInputOnChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const removeFile = (event: any) => {
    event.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    props.onChange({ target: { name: props.name, value: null } });
  };

  return (
    <>
      {!file?.name ? (
        <div>
          <Link
            component={ButtonBase}
            type="file"
            onClick={(e: any) => {
              e.preventDefault();
              fileInputRef?.current?.click();
            }}
          >
            {t("Upload Attachment")}
          </Link>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={fileInputOnChange}
          />
        </div>
      ) : (
        <div className="ui-flex v-center">
          {file?.name}{" "}
          <Link component={ButtonBase} onClick={removeFile} className="ml-5">
            <Icon type="Close" size={20} />
          </Link>
        </div>
      )}
    </>
  );
};

export default CsvFileLink;
