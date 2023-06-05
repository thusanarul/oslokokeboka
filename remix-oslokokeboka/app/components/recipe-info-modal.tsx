import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

const RenderInfoOverlay = ({}) => {
  const location = useLocation();

  const renderInfoOverlay = location.pathname === "/create-recipe/0";

  if (!renderInfoOverlay) {
    return <></>;
  }

  const [scrollY, setScrollY] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

  const handleScroll = () => {
    const y = window.scrollY;
    setScrollY(y);
  };

  const handleResize = () => {
    const h = window.innerHeight;
    setInnerHeight(h);
  };

  useEffect(() => {
    if (typeof window == undefined) {
      return;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setScrollY]);

  useEffect(() => {
    if (typeof window == undefined) {
      return;
    }
    setInnerHeight(window.innerHeight);
    window.addEventListener("resize", handleResize, { passive: true });
    () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setInnerHeight]);

  const middle = `${(scrollY + innerHeight) / 2}px`;

  const style = {
    "--middle": middle,
  } as React.CSSProperties;

  return (
    <div
      id="recipe-info"
      style={style}
      className="text-white absolute z-30 left-[25%] w-[50%] bg-ochre rounded-lg flex flex-col items-center px-2"
    >
      <h3>Your cookbook contribution (approx. 17min)</h3>
    </div>
  );
};

export default RenderInfoOverlay;
