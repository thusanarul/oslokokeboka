import { useEffect, useRef, useState } from "react";
import { RecipeFormField } from "~/routes/create-recipe/$step";
import Pencil from "../pencil";
import { InputHTMLElement } from "./shared";

const AdderInput = ({
  field,
  onFocus,
  onHover,
}: {
  field: RecipeFormField;
  onFocus: React.FocusEventHandler<InputHTMLElement> | undefined;
  onHover: React.MouseEventHandler<InputHTMLElement> | undefined;
}) => {
  // TODO: Change according to figma. as discussed with shub: https://www.figma.com/file/ruRfvIPnTgLVUCmNpj6yqG/Oslo-Kokeboka?node-id=324%3A219&t=tGrVk7ULLcPiEXm4-0

  // Rendering with Browser only apis: https://remix.run/docs/en/v1/guides/constraints#rendering-with-browser-only-apis

  if (field.input.type !== "adder") {
    return null;
  }

  const [inputAmount, setInputAmount] = useState<number>(0);

  const [items, setItems] = useState<
    {
      name: string;
      amount: string;
      unit_type: string;
    }[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem(`adder-${field.name}`);
    if (!saved) {
      return;
    }

    setItems(JSON.parse(saved));
  }, []);

  const nameEl = useRef<HTMLInputElement | null>(null);
  const amountEl = useRef<HTMLInputElement | null>(null);
  const unitTypeEl = useRef<HTMLSelectElement | null>(null);

  const submittedItems = items
    .map((item) => `${item.name}:${item.amount}:${item.unit_type}`)
    .join(";");

  return (
    <div
      className="flex flex-col gap-[24px] w-full"
      onFocus={onFocus}
      onMouseOver={onHover}
    >
      <span className="flex gap-[22px]">
        <input
          name={field.name}
          type={"text"}
          placeholder={field.input.placeholder}
          onFocus={onFocus}
          onMouseOver={onHover}
          className="basis-2/3"
          //defaultValue={defaultValue ?? undefined}
        />
        <input
          name={`amount_${field.name}`}
          type={"text"}
          className="basis-1/3"
        />
      </span>
      <button
        type="button"
        className="flex-initial px-[16px] py-[16px] w-fit inverted-red-button"
      >
        + Add new ingredient
      </button>
    </div>
  );
};

// const legacyAdder = () => {
//   <div
//     className="flex flex-col gap-[16px]"
//     onFocus={onFocus}
//     onMouseOver={onHover}
//   >
//     <input type="hidden" name={field.name} value={submittedItems} />
//     <div className={items.length > 0 ? "flex flex-col" : "hidden"}>
//       {items.map((item, index) => (
//         <span
//           key={`submitted_item_${index}`}
//           className="w-full h-full flex justify-between border-b-[0.5px] border-b-paper py-[20px] "
//         >
//           <p className="text-paper w-[208px] whitespace-normal">{item.name}</p>
//           <p className="text-paper">
//             {item.amount} {item.unit_type}
//           </p>
//           <button type="button" className="flex-none w-[18px]">
//             <Pencil className="w-full h-[20px]" />
//           </button>
//         </span>
//       ))}
//     </div>
//     <input
//       name={`ignore-name_${field.name}`}
//       type={"text"}
//       className="w-full"
//       ref={nameEl}
//     />
//     <div className="flex w-full gap-[12px]">
//       <input
//         name={`ignore-amount_${field.name}`}
//         type={"number"}
//         className="flex-auto w-[92px]"
//         ref={amountEl}
//       />
//       <select
//         name={`ignore-unit_${field.name}`}
//         className="flex-auto w-[145px]"
//         ref={unitTypeEl}
//       >
//         {field.input.choices?.map((choice, index) => (
//           <option
//             key={`option_unit_${field.name}_${index}`}
//             value={choice.value}
//           >
//             {choice.text}
//           </option>
//         ))}
//       </select>
//       <button
//         type="button"
//         className="flex-auto w-[55px] red-button"
//         onClick={() => {
//           TODO: Create UI that displays error message
//           if (
//             !nameEl.current?.value ||
//             !amountEl.current?.value ||
//             !unitTypeEl.current?.value
//           ) {
//             return;
//           }
//           const i = [
//             ...items,
//             {
//               name: nameEl.current.value,
//               amount: amountEl.current.value,
//               unit_type: unitTypeEl.current.value,
//             },
//           ];

//           setItems(i);
//           localStorage.setItem(`adder-${field.name}`, JSON.stringify(i));
//         }}
//       >
//         +
//       </button>
//     </div>
//   </div>;
// };

export default AdderInput;
