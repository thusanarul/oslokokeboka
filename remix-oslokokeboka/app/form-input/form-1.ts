import { RecipeFormField } from "~/routes/create-recipe/$step";

const form_1: RecipeFormField[] = [
  {
    index: "03",
    name: "ingredients",
    title: { en: "Ingredients", no: "Ingredienser" },
    required: true,
    input: {
      type: "textarea",
      placeholder: {
        en: "Add ingredients and amount separated by a new line.\n\n \
For example:\n \
2 onions\n \
1 tablespoon of sugar\n \
3 teaspoons of honey",
        no: "Legg til ingredienser og mengde separert med en ny linje.\n\n \
For eksempel:\n \
2 løk\n \
1 spiseskje sukker\n \
3 teskje med honning",
      },
    },
  },
  {
    index: "04",
    name: "how-to",
    title: { en: "How do you make the dish?", no: "Hvordan lager man retten?" },
    required: true,
    input: {
      type: "textarea",
      placeholder: {
        en: "The instructions on how to put this dish together. The steps can either be listed, separated by spaces or free form. \
          \n\nRemember: the more descriptive and organized the instructions are, the easier it is for someone else to make the dish!",
        no: "Instruksjonene for å lage retten. Stegene kan enten listes ut, være delt i mellomrom eller være fritekst. \
        \n\nHusk: jo mer deskriptiv og organisert instruksjonene er, desto lettere vil det være for noen andre å lage retten!",
      },
    },
  },
  {
    index: "05",
    name: "additional-notes",
    title: {
      en: "Any bonus thoughts or notes?",
      no: "Noen ekstra tanker eller notater?",
    },
    input: {
      type: "textarea",
      placeholder: {
        en: "Here you can share tips and tricks about how to this dish, where to find special ingredients around Oslo, or just a fun fact!",
        no: "Her kan du dele tips og triks om hvordan man lager retten, hvor man kan finne de beste ingrediensene i Oslo, eller bare en morsom fakta!",
      },
    },
  },
];

export default form_1;
