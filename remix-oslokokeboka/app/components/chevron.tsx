const Chevron = ({ className }: { className: string }) => {
  return (
    // <svg
    //   className="self-end h-5 w-5"
    //   xmlns="http://www.w3.org/2000/svg"
    //   viewBox="0 0 20 20"
    //   fill="currentColor"
    //   aria-hidden="true"
    // >
    //   <path
    //     fillRule="evenodd"
    //     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
    //     clipRule="evenodd"
    //   />
    // </svg>

    <svg
      className={className}
      viewBox="0 0 14 9"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 8.18182L0 0H14L7 8.18182Z" fill="currentColor" />
    </svg>
  );
};

export default Chevron;
