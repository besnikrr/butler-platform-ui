import { Typography } from "@butlerhospitality/ui-sdk";
import { AddressV2 } from "@butlerhospitality/shared";

export default function Address(props: AddressV2) {
  const { address_town, address_street, address_number, address_zip_code } =
    props;

  return (
    <div>
      <Typography>
        {address_town}, {address_street},{" "}
        {address_number && `${address_number}, `} {address_zip_code}
      </Typography>
    </div>
  );
}
