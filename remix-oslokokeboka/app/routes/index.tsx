import { useNavigate } from "@remix-run/react";
import { images } from "~/utils/title-images";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="h-full justify-center flex flex-col gap-[52px] w-[816px] mx-auto">
      <div className="flex mx-auto justify-end w-full">
        <button
          onClick={() => {
            navigate("/create-recipe/0");
          }}
          className="orange-button"
        >
          Enter Oslo Kokeboka
        </button>
      </div>
      <div className="grid grid-cols-2 gap-[2px] mx-auto">
        {images.map((image, _) => (
          <div
            key={`img_${image.index}`}
            className={`${image.bg_color} w-[408px] h-[85px] rounded-[6px] flex`}
          >
            <img
              src={`images/titles/${image.index}.png`}
              className={`mx-auto self-center mix-blend-multiply`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
