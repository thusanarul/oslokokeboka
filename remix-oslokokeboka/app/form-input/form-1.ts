import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_1: RecipeFormField[] = [
    {
      index: "03",
      name: "ingredients",
      title: "Ingredients",
      input: {
        type: "textarea",
        placeholder:
          "Add ingredients and amount seperated by a newline.\n\n \
For example:\n \
2 onions\n \
1 tablespoon sugar\n \
3 teaspoons of honey",
      },
    },
    {
      index: "04",
      name: "how-to",
      title: "How do you make the dish?",
      input: {
        type: "textarea",
        placeholder:
          "Enter the instructions to prepare the dish...",
      },
    },
    {
      index: "05",
      name: "additional-notes",
      title: "Any bonus thoughts or notes?",
      input: {
        type: "text",
        placeholder: "Here you can share some tips and tricks!",
      },
    },
];

export default form_1;
  
  
  