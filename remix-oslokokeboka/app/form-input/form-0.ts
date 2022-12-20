import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_0: RecipeFormField[] = [
    {
      index: "01",
      name: "name-of-dish",
      title: "What do you call this dish?",
      required: true,
      input: {
        type: "text",
        placeholder: "Name of the recipe...",
      },
    },
    {
      index: "02",
      name: "the-story",
      title: "What's the story?",
      required: true,
      input: {
        type: "textarea",
        placeholder:
          "What memories does this dish remind you of when you are cooking or eating this? \
\n\nFor ex. When do you cook or eat this? How did you learn this dish? Do you think of some place, a person or time in you life?",
      },
    },
];
  
export default form_0;