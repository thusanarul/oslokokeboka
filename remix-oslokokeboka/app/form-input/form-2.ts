import { RecipeFormField } from "~/routes/create-recipe/$step";



const form_2: RecipeFormField[] = [
    {
        index: "06",
        name: "how-many-servings",
        title: "How many servings does this dish make?",
        input: {
            type: "dropdown",
            placeholder: "Select amount",
            choices: [
              { value: 1, text: "1" },
              { value: 2, text: "2" },
              { value: 3, text: "3" },
              { value: 4, text: "4" },
              { value: 5, text: "5" },
              { value: 6, text: "6" },
              { value: 7, text: "7" },
              { value: 8, text: "8" },
              { value: 9, text: "9" },
              { value: "10+", text: "10+" },
            ],
          },
    },
    {
        index: "07",
        name: "what-kind-of-dish",
        title: "What kind of dish is this?",
        input: {
            type: "dropdown",
            placeholder: "Select amount",
            choices: [
              { value: "hm", text: "This would be a category" },
            ],
          },
    },
];

export default form_2;