import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_4: RecipeFormField[] = [
    {
        index: "13",
        name: "consent",
        title: "Sharing your recipe",
        infoText: [
            "On this we require to store information that you provide us to create recipe entries that are then visualised on the Oslo Recipes page.",
            "Before we can publish your recipe, we need your consent to use it on our website. You can contact us to take it down at any point in the future if you change your mind."
        ],
        input: {
          type: "consent",
          placeholder:
            "Check this box to give consent.",
        },
    },
];

export default form_4;
  