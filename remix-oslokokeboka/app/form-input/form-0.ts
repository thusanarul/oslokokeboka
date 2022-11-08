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
      name: "who-are-you",
      title: "Who are you?",
      input: {
        type: "text",
        placeholder: "Your name is...",
      },
    },
    {
      index: "03",
      name: "association",
      title: "Association (optional)",
      input: {
        type: "text",
        placeholder: "You represent...",
      },
    },
    {
      index: "04",
      name: "your-neighbourhood",
      title: "What's your neighbourhood?",
      input: {
        type: "dropdown",
        placeholder: "Select your bydel",
        choices: [
          { value: "gamle-oslo", text: "Gamle Oslo" },
          { value: "grünerløkka", text: "Grünerløkka" },
          { value: "sentrum", text: "Sentrum" },
          { value: "frogner", text: "Frogner" },
          { value: "stovner", text: "Stovner" },
          { value: "sagene", text: "Sagene" },
        ],
      },
    },
    {
      index: "05",
      name: "whats-your-email",
      title: "What's your email?",
      input: {
        type: "text",
        placeholder: "Your email...",
      },
    },
];
  
export default form_0;