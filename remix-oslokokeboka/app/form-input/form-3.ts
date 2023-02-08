import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_3: RecipeFormField[] = [
  {
    index: "09",
    name: "name",
    title: { en: "What's your name?", no: "Hva er navnet ditt?" },
    required: true,
    input: {
      type: "text",
      placeholder: { en: "Your name is...", no: "Ditt navn er..." },
    },
  },
  {
    index: "10",
    name: "email",
    title: { en: "What's your email?", no: "Hva er e-postadressen din?" },
    required: true,
    input: {
      type: "text",
      placeholder: { en: "Your email...", no: "Din e-postadresse..." },
    },
  },
  {
    index: "11",
    name: "neighbourhood",
    title: { en: "What's your neighbourhood?", no: "Hvor bor du?" }, // TODO: talk to shub about the "'"
    required: true,
    input: {
      type: "dropdown",
      placeholder: { en: "Select your neighbourhood", no: "Velg ditt nabolag" },
      choices: [
        { value: "alna", text: "Alna" },
        { value: "bjerke", text: "Bjerke" },
        { value: "frogner", text: "Frogner" },
        { value: "gamle-oslo", text: "Gamle Oslo" },
        { value: "grorud", text: "Grorud" },
        { value: "grunerlokka", text: "Grünerløkka" },
        { value: "nordre-aker", text: "Nordre Aker" },
        { value: "nordstrand", text: "Nordstrand" },
        { value: "sagene", text: "Sagene" },
        { value: "sentrum", text: "Sentrum" },
        { value: "st-hanshaugen", text: "St. Hanshaugen" },
        { value: "stovner", text: "Stovner" },
        { value: "sondre-nordstrand", text: "Søndre Nordstrand" },
        { value: "ullern", text: "Ullern" },
        { value: "vestre-aker", text: "Vestre Aker" },
        { value: "ostensjo", text: "Østensjø" },
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
