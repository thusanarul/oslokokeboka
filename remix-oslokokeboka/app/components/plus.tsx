const Plus = ({ className }: { className: string }) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.75 0.5V15.5" stroke="#FF7880" strokeWidth="2" />
      <path d="M15.25 8L0.25 8" stroke="#FF7880" strokeWidth="2" />
    </svg>
  );
};

export default Plus;
