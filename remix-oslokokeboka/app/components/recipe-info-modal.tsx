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
    <section
      id="recipe-info"
      style={style}
      className="text-white absolute z-30 w-full bg-ochre rounded-lg flex flex-col gap-4 px-5 py-4"
    >
      <h4 className="whitespace-nowrap w-fit">
        Your cookbook contribution (approx. 17min)
      </h4>
      <ul className="w-fit">
        <li>
          <article className="flex flex-col w-[200px] h-[200px] rounded-lg bg-darkestwine">
            <div className="w-full flex gap-2 pl-5 pt-5 overflow-visible">
              <span className="form-indicator w-[70%] bg-salmon" />
              <span className="form-indicator w-[30%]" />
            </div>
            <h3 className="pl-5 fuzzy mt-3 text-[22px] text-salmon">
              The story
            </h3>
          </article>
        </li>
      </ul>
    </section>
  );
};

export default RenderInfoOverlay;
