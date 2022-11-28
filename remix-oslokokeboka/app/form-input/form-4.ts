import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_4: RecipeFormField[] = [
    {
        index: "13",
        name: "consent",
        title: "Sharing your recipe",
        required: true,
        input: {
          type: "consent",
          placeholder:
            "Check this box to give consent.",
        },
    },
];

export default form_4;
  