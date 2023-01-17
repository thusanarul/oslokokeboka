import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_3: RecipeFormField[] = [
  {
    index: "08",
    name: "name",
    title: { en: "What's your name?", no: "Hva er navnet ditt?" },
    input: {
      type: "text",
      placeholder: { en: "Your name is...", no: "Ditt navn er..." },
    },
  },
  {
    index: "09",
    name: "email",
    title: { en: "What's your email?", no: "Hva er e-postadressen din?" },
    input: {
      type: "text",
      placeholder: { en: "Your email...", no: "Din e-postadresse..." },
    },
  },
  {
    index: "10",
    name: "neighbourhood",
    title: { en: "What's your neighbourhood?", no: "Hvor bor du?" }, // TODO: talk to shub about the "'"
    input: {
      type: "dropdown",
      placeholder: { en: "Select your neighbourhood", no: "Velg ditt nabolag" },
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
    title: { en: "Tags (optional)", no: "Tags (frivillig)" },
    input: {
      type: "text",
      placeholder: {
        en: "Add a tag to group in a custom collection",
        no: "Legg til en tag for å kunne gruppere i en samling",
      },
    },
  },
  {
    index: "12",
    name: "consent",
    title: { en: "Sharing your recipe", no: "Deling av din oppskrift" },
    required: true,
    input: {
      type: "consent",
      placeholder: {
        en: "Check this box to give consent.",
        no: "Huk av på boksen for å gi samtykke",
      },
    },
  },
];

export default form_3;
