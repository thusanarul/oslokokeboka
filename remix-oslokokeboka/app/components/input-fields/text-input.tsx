import { RecipeFormField } from "~/routes/create-recipe/$step";
import { InputHTMLElement } from "./shared";

const TextInput = ({
  field,
  onFocus,
  onHover,
  defaultValue,
}: {
  field: RecipeFormField;
  onFocus: React.FocusEventHandler<InputHTMLElement> | undefined;
  onHover: React.MouseEventHandler<InputHTMLElement> | undefined;
  defaultValue: string | null;
}) => {
  return (
    <input
      name={field.name}
      type={"text"}
      placeholder={field.input.placeholder}
      onFocus={onFocus}
      onMouseOver={onHover}
      defaultValue={defaultValue ?? undefined}
    />
  );
};

export default TextInput;
