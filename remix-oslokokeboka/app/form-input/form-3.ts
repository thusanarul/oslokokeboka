import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_3: RecipeFormField[] = [
    {
      index: "09",
      name: "ingredients",
      title: "Ingredients",
      input: {
        type: "adder",
        placeholder: "Add ingredient",
        choices: [
          { value: "pcs", text: "pcs" },
          { value: "tbsp", text: "tbsp" },
        ],
      },
    },
    {
        index: "10",
        name: "how-to",
        title: "How to put the dish together?",
        input: {
          type: "textarea",
          placeholder:
            "Enter the instructions to prepare the dish...",
        },
    },
    {
        index: "11",
        name: "additional-notes",
        title: "Additional notes",
        input: {
          type: "text",
          placeholder: "Your name is...",
        },
      },
];
  
export default form_3;