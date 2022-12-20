import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_3: RecipeFormField[] = [
  {
    index: "08",
    name: "name",
    title: "What's your name?",
    input: {
      type: "text",
      placeholder: "Your name is...",
    },
  },
  {
    index: "09",
    name: "email",
    title: "What's your email?",
    input: {
      type: "text",
      placeholder: "Your email...",
    },
  },
  {
    index: "10",
    name: "neighbourhood",
    title: "What's your neighbourhood?", // TODO: talk to shub about the "'"
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
    index: "11",
    name: "tags",
    title: "Tags (optional)",
    input: {
      type: "text",
      placeholder: "Add a tag to group in a custom collection",
    },
  },
  {
    index: "12",
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
  
export default form_3;