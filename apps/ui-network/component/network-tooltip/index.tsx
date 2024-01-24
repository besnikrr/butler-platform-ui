import { Icon, Tooltip, Typography } from "@butlerhospitality/ui-sdk";

interface NetworkTooltipProps {
  label: string;
  text: string;
}

const NetworkTooltip: React.FC<NetworkTooltipProps> = ({
  label,
  text,
}): JSX.Element => {
  const content = (
    <div className="w-100">
      <div className="mb-10 ui-border-bottom pb-10 pt-10">
        <Typography>{label}</Typography>
      </div>
      <div className="mt-5">
        <Typography p muted>
          {text}
        </Typography>
      </div>
    </div>
  );

  return (
    <Tooltip
      className="network-type-tooltip"
      content={content}
      placement="right"
    >
      <Icon className="ml-10" type="Infoi" size={18} />
    </Tooltip>
  );
};

export default NetworkTooltip;
