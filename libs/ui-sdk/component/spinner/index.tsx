function Spinner({ width, height }: { width?: number; height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: "auto", width, height }}
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <rect
        width="3"
        height="3"
        x="48.5"
        y="42.5"
        fill="#004438"
        rx="0.27"
        ry="0.27"
      >
        <animate
          attributeName="opacity"
          begin="-0.8s"
          dur="1s"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="1;0"
        />
      </rect>
      <rect
        width="3"
        height="3"
        x="48.5"
        y="42.5"
        fill="#004438"
        rx="0.27"
        ry="0.27"
        transform="rotate(72 50 50)"
      >
        <animate
          attributeName="opacity"
          begin="-0.6s"
          dur="1s"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="1;0"
        />
      </rect>
      <rect
        width="3"
        height="3"
        x="48.5"
        y="42.5"
        fill="#004438"
        rx="0.27"
        ry="0.27"
        transform="rotate(144 50 50)"
      >
        <animate
          attributeName="opacity"
          begin="-0.4s"
          dur="1s"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="1;0"
        />
      </rect>
      <rect
        width="3"
        height="3"
        x="48.5"
        y="42.5"
        fill="#004438"
        rx="0.27"
        ry="0.27"
        transform="rotate(216 50 50)"
      >
        <animate
          attributeName="opacity"
          begin="-0.2s"
          dur="1s"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="1;0"
        />
      </rect>
      <rect
        width="3"
        height="3"
        x="48.5"
        y="42.5"
        fill="#004438"
        rx="0.27"
        ry="0.27"
        transform="rotate(288 50 50)"
      >
        <animate
          attributeName="opacity"
          begin="0s"
          dur="1s"
          keyTimes="0;1"
          repeatCount="indefinite"
          values="1;0"
        />
      </rect>
    </svg>
  );
}

Spinner.defaultProps = {
  width: 150,
  height: 150,
};

export { Spinner };
