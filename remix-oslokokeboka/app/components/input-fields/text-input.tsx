import { i18nKey, RecipeFormField } from "~/routes/create-recipe/$step";
import { InputHTMLElement } from "./shared";

const TextInput = ({
  field,
  lang,
  onFocus,
  onHover,
  defaultValue,
}: {
  field: RecipeFormField;
  lang: i18nKey;
  onFocus: React.FocusEventHandler<InputHTMLElement> | undefined;
  onHover: React.MouseEventHandler<InputHTMLElement> | undefined;
  defaultValue: string | null;
}) => {
  return (
    <input
      name={field.name}
      type={field.input.type}
      placeholder={field.input.placeholder[lang]}
      onFocus={onFocus}
      onMouseOver={onHover}
      defaultValue={defaultValue ?? undefined}
    />
  );
};

export default TextInput;
