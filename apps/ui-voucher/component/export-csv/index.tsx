import Papa from 'papaparse';
import {Link, ButtonBase, Button} from "@butlerhospitality/ui-sdk";
import React from 'react';

interface FileLinkInterface {
    label: string
    data: any;
    fields: string[] ;
    fileName: string;
    onClose: () => void
  }

const ExportCsv: React.FC<FileLinkInterface> = (props) => {
    const generateCsv = (data: any, fields: any) => {
        const csv = Papa.unparse({
            data,
            fields
        });
    
        const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        const csvURL = window.URL.createObjectURL(csvData);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', props.fileName);
        tempLink.click();
        props.onClose();
    }
    
    return (
        <Link 
            component={Button}  
            variant="ghost"
            size='medium' 
            className="voucher-dropdown-link mt-5" 
            type="file" 
            onClick={() => generateCsv(props.data, props.fields)}
        >
            {props.label}
        </Link>
    );
}
  

export default ExportCsv;
