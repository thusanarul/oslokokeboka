import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_0: RecipeFormField[] = [
    {
      index: "01",
      name: "name-of-dish",
      title: {en: "What do you call this dish?", no: "Hva kaller du retten?"},
      required: true,
      input: {
        type: "text",
        placeholder: {en: "Name of the recipe...", no: "Navnet på retten..."},
      },
    },
    {
      index: "02",
      name: "the-story",
      title: {en: "What's the story?", no: "Hva er historien?"},
      required: true,
      input: {
        type: "textarea",
        placeholder:
          {en: "What memories does this dish remind you of when you are cooking or eating this? \
\n\nFor ex. When do you cook or eat this? How did you learn this dish? Do you think of some place, a person or time in you life?", 
no: "Hvilke minner assosierer du med denne retten? \
\n\nFor ex. Når lager du eller spiser du retten? Hvordan lærte du å lage den? Tenker du på et spesielt sted, person, eller tid i livet ditt?"},
      },
    },
];
  
export default form_0;