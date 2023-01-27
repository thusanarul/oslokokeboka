import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Prisma, InputType, RecipeSubmission } from "@prisma/client";

import { db } from "~/utils/db.server";
import { commitSession, getSession } from "~/session.server";
import form_0 from "~/form-input/form-0";
import form_1 from "~/form-input/form-1";
import form_2 from "~/form-input/form-2";
import form_3 from "~/form-input/form-3";
import AdderInput from "~/components/input-fields/adder";
import TextInput from "~/components/input-fields/text-input";
import { InputHTMLElement } from "~/components/input-fields/shared";
import Ellipse from "~/components/ellipse";
import { TFunction, useTranslation } from "react-i18next";

/*
required trenger ikke å være nullable?
*/

export type RecipeFormField = {
  index: string;
  name: string;
  title: i18nString;
  required?: boolean;
  input: BasicInputField | ChoicesInputField;
};

export type RecipeFormFieldError = {
  index: string;
  name: string;
  errorText: i18nString;
};

export type RecipeFormFieldValue = {
  index: string;
  name: string;
  value: string;
};

export type RecipeErrors = Record<string, RecipeFormFieldError>;

export type RecipeFilled = Record<string, RecipeFormFieldValue>;

type BasicInputField = {
  type: "text" | "textarea" | "consent";
  placeholder: i18nString;
};

type ChoicesInputField = {
  type: "dropdown" | "adder";
  placeholder: i18nString;
  choices: {
    value: string | number;
    text: string | i18nString;
  }[];
};

type step = "next" | "previous" | "cancel" | "preview";

type i18nString = {
  en: string;
  no: string;
};

export type i18nKey = keyof i18nString;

type FormStep = {
  name: i18nString;
  timeInPercentage: string;
  form: RecipeFormField[];
  nextStep: step;
  previousStep: step;
  tooltipInfo: i18nString;
};

const inputTypeMap = {
  text: InputType.TEXT,
  number: InputType.TEXT,
  textarea: InputType.TEXTAREA,
  dropdown: InputType.DROPDOWN,
  adder: InputType.ADDER,
  consent: InputType.CONSENT,
};

// Next step: task 1 or 2

// TODO
// task: Make the rest of the form, and make sure redirecting and saving the form works.
// task: save highest form step filled to localstorage or something
// task: Create admin panel to view submitted recipes. Can be pretty simple.
// task: Create image upload and consent input
// task: edit ingredients submission.
// task: Make opacity depended on scroll also. Have only implemented lazy version

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.step, `form step is required`);
  const currentStep: number = parseInt(params.step);
  const session = await getSession(request.headers.get("Cookie"));

  if (currentStep < 0 || currentStep > steps.length - 1) {
    return redirect("/");
  }

  let submission: RecipeSubmission | null = null;
  const filled: RecipeFilled = {};
  let recipeTitle: string | null = null;

  if (session.has("formId")) {
    console.log("Found formId");
    submission =
      await db.recipeSubmission.findUnique<Prisma.RecipeSubmissionFindUniqueArgs>(
        {
          where: {
            id: session.get("formId"),
          },
        }
      );
  }

  if (submission) {
    const f = await db.recipeField.findMany({
      where: {
        recipeSubmissionId: submission.id,
        step: currentStep,
      },
    });

    const title =
      await db.recipeField.findFirst<Prisma.RecipeFieldFindFirstArgs>({
        where: {
          recipeSubmissionId: submission.id,
          name: "name-of-dish",
          step: 0,
        },
      });

    if (title) {
      recipeTitle = title.inputValue;
    }

    f.forEach((val, i) => {
      filled[val.index] = {
        index: val.index,
        name: val.name,
        value: val.inputValue,
      };
    });
  }

  return json<{
    step: number;
    form: RecipeFormField[];
    filled: RecipeFilled;
    recipeTitle: string | null;
  }>({
    step: currentStep,
    form: steps[currentStep].form,
    filled: filled,
    recipeTitle: recipeTitle,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  console.log(`På route: ${params.step}`);

  invariant(params.step, `form step is required`);
  const currentStep: number = parseInt(params.step);

  if (currentStep < 0 || currentStep > steps.length) {
    return redirect("/");
  }

  const currentForm: RecipeFormField[] = steps[currentStep].form;
  const errors: RecipeErrors = {};

  const formData = await request.formData();

  /*
    Validate form
  */
  let hasError: boolean = false;

  formData.forEach((val, key, _) => {
    const s = currentForm.find((field) => field.name === key);

    // This check is necessary because of custom handling of placeholders in textarea input field
    // Ideally this would happen client-side, but could not find a solution
    if (s?.input.type === "textarea") {
      if (
        val.toString().trim() === s.input.placeholder.en ||
        val.toString().trim() === s.input.placeholder.no
      ) {
        val = "";
      }
    }

    // more types of validation?
    if (s?.required) {
      if (val.toString().trim() === "") {
        errors[s.index] = {
          index: s.index,
          name: s.name,
          errorText: {
            en: "This field can not be left blank",
            no: "Dette feltet kan ikke være tomt",
          },
        };
      }
    }

    // Flip hasError boolean if errorText has been added
    if (!hasError && Object.keys(errors).length > 0) {
      hasError = true;
    }
  });

  if (hasError && process.env.OVERRIDE_FORM_VALIDATION !== "true") {
    console.log("Form has error");
    return json<{
      step: number;
      form: RecipeFormField[];
      errors: RecipeErrors;
    }>(
      {
        step: currentStep,
        form: currentForm,
        errors,
      },
      {
        status: 400,
        statusText: "Error when validating form",
      }
    );
  }

  /*
    Save form
  */

  const session = await getSession(request.headers.get("Cookie"));
  let submission: RecipeSubmission;

  if (!session.has("formId")) {
    console.log("Does not have formId");

    submission = await db.recipeSubmission.create({
      data: {},
    });

    session.set("formId", submission.id);
  } else {
    let s = await db.recipeSubmission.findUnique({
      where: {
        id: session.get("formId"),
      },
    });

    if (!s) {
      console.log("Could not fetch formId stored in Session Cookie");
      return null;
    }

    submission = s;
  }

  formData.forEach(async (val, key, _) => {
    const field = currentForm.find((field) => field.name === key);

    if (!field) {
      return null;
    }

    // Grab previous input if it exists
    // should be unique enough to check step, name, and submissionId
    const prevInput: Prisma.RecipeFieldScalarWhereInput = {
      step: currentStep,
      name: field.name,
      recipeSubmissionId: submission.id,
    };

    const prev = await db.recipeField.findFirst({
      where: {
        ...prevInput,
      },
    });

    const inputValue = val.toString();

    // Create upsert arguments
    const input: Prisma.RecipeFieldUpsertArgs = {
      where: {
        id: prev?.id ?? -1,
      },
      create: {
        step: currentStep,
        name: field.name,
        index: field.index,
        inputType: inputTypeMap[field.input.type],
        inputValue: inputValue,
        recipeSubmissionId: submission.id,
      },
      update: {
        inputValue: inputValue,
      },
    };

    await db.recipeField.upsert({
      ...input,
    });
  });

  let nextStep = `create-recipe/${currentStep + 1}`;
  if (steps[currentStep].nextStep === "preview") {
    nextStep = `create-recipe/preview`;
  }

  return redirect(nextStep, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export let handle = {
  i18n: "create-recipe",
};

export default function RecipeStep() {
  const loaderData: {
    step: number;
    form: RecipeFormField[];
    filled: RecipeFilled;
    recipeTitle: string | null;
  } = useLoaderData();
  const actionData:
    | { step: number; form: RecipeFormField[]; errors: RecipeErrors }
    | undefined = useActionData();
  const { t, i18n } = useTranslation(["create-recipe", "common"]);
  const lang = i18n.language as i18nKey; // Nothing gets rendered if this fails. Maybe a type cast?

  let currentForm: RecipeFormField[];
  let currentStep: number;
  let errors: RecipeErrors;
  let filled: RecipeFilled | null = null;

  // Lærdom: loaderData er aldri undefined
  //         Kan skrive dette på en bedre måte
  if (actionData !== undefined) {
    currentForm = actionData.form;
    currentStep = actionData.step;
    errors = actionData.errors;
  } else if (loaderData !== undefined) {
    currentForm = loaderData.form;
    currentStep = loaderData.step;
    filled = loaderData.filled;
  } else {
    // Show error page?
    return null;
  }
  const [fieldInFocus, setFieldInFocus] = useState(currentForm[0].index);
  const [tooltipStep, setTooltipStep] = useState<FormStep | false>(false);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const titleHeader = loaderData.recipeTitle
    ? loaderData.recipeTitle
    : t("your-recipe");

  return (
    <div className="w-[85%] max-w-[550px] flex flex-col mx-auto self-start">
      {/* Either fetch from localstorage, associate with form value or render the default text */}

      <h1 className="fuzzy text-paper">{titleHeader}</h1>
      <div className="w-full flex justify-between mt-[18px] relative">
        {steps.map((step, index) => {
          let stepColor = currentStep === index ? "bg-salmon" : "";
          if (tooltipStep != false) {
            stepColor = step === tooltipStep ? "bg-ochre" : stepColor;
          }

          return (
            <button
              type="button"
              key={`step_${index}`}
              aria-label={step.name[lang]}
              className={`form-indicator ${step.timeInPercentage} ${stepColor}`}
              onClick={() => {
                setTooltipStep(step);
                if (tooltipTimeout.current) {
                  clearTimeout(tooltipTimeout.current);
                }
                tooltipTimeout.current = setTimeout(() => {
                  setTooltipStep(false);
                }, 1250);
              }}
            ></button>
          );
        })}
        <span
          className={`absolute left-[25%] top-[24px] z-10 tooltip transition ease-in-out ${
            !tooltipStep ? "invisible" : ""
          }`}
        >
          <p className="text-darkestwine font-bold mb-[12px]">
            {tooltipStep && tooltipStep.name[lang]}
          </p>
          {tooltipStep && tooltipStep.tooltipInfo[lang]}
        </span>
      </div>
      <p className="mt-[12px]">{steps[currentStep].name[lang]}</p>
      {/* The form associated with the current step*/}
      <div className="mt-[32px]">
        <Form
          method="post"
          className="h-full mb-[24px]"
          id="recipe-form"
          action={`/create-recipe/${currentStep}`}
        >
          <div className="flex flex-col gap-[48px]">
            {currentForm.map((field) => {
              const defaultValue =
                filled && filled[field.index] !== undefined
                  ? filled[field.index].value
                  : null;

              return (
                <div className="flex flex-col" key={`outer_${field.name}`}>
                  <label
                    className={`flex flex-col gap-[8px] ${
                      field.index !== fieldInFocus ? "opacity-70" : ""
                    }`}
                    htmlFor={field.name}
                  >
                    <p>{field.index}</p>
                    <h2 className="fuzzy mb-[8px]">{field.title[lang]}</h2>
                    <InputField
                      field={field}
                      t={t}
                      lang={lang}
                      onFocus={() => setFieldInFocus(field.index)}
                      onHover={() => setFieldInFocus(field.index)}
                      defaultValue={defaultValue}
                    />
                  </label>
                  {errors && errors[field.index] !== undefined ? (
                    <span className="flex mt-[8px] gap-[8px]">
                      <Ellipse className={"self-center w-[10px] h-[10px]"} />
                      <p className="text-ochre">
                        {errors[field.index].errorText[lang]}
                      </p>
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="flex w-fit mt-[42px] gap-[16px] justify-start">
            {steps[currentStep].previousStep === "cancel" && (
              <Link
                to={"/"}
                className="flex-auto text-center py-[16px] min-w-[120px] px-[28px] inverted-red-button fuzzy"
              >
                {t("cancel", { ns: "common" })}
              </Link>
            )}
            {currentStep > 0 && currentStep < steps.length && (
              <Link
                to={`/create-recipe/${currentStep - 1}`}
                className="flex-auto text-center py-[16px] min-w-[120px] px-[28px] inverted-red-button fuzzy"
              >
                {t("previous", { ns: "common" })}
              </Link>
            )}
            <button
              type="submit"
              className="flex-auto min-w-[120px] px-[28px] red-button fuzzy"
            >
              {steps[currentStep].nextStep === "preview"
                ? t("preview", { ns: "common" })
                : t("next", { ns: "common" })}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

const InputField = ({
  field,
  t,
  lang,
  onFocus,
  onHover,
  defaultValue,
}: {
  field: RecipeFormField;
  t: TFunction<("create-recipe" | "common")[]>;
  lang: i18nKey;
  onFocus: React.FocusEventHandler<InputHTMLElement> | undefined;
  onHover: React.MouseEventHandler<InputHTMLElement> | undefined;
  defaultValue: string | null;
}) => {
  switch (field.input.type) {
    case "text":
      return (
        <TextInput
          field={field}
          lang={lang}
          onFocus={onFocus}
          onHover={onHover}
          defaultValue={defaultValue}
        />
      );
    case "textarea":
      const renderInitValue = defaultValue ?? field.input.placeholder[lang];
      const placeholder = field.input.placeholder[lang];

      // The only reason this component became big is because the default placeholder would not render new-line breaks in mobile
      // Listens to a couple of events to mimic default placeholder behaviour

      function isPlaceholder(
        currentTarget: EventTarget & HTMLTextAreaElement,
        placeholder: string
      ) {
        return (
          (currentTarget.defaultValue === placeholder &&
            currentTarget.value === placeholder) ||
          currentTarget.value === placeholder
        );
      }

      return (
        <textarea
          name={field.name}
          data-placeholder={defaultValue == null}
          className={
            "data-[placeholder=true]:text-salmon data-[placeholder=false]:text-paper"
          }
          //placeholder={field.input.placeholder[lang]}
          form="recipe-form"
          rows={8}
          onBeforeInputCapture={(ev) => {
            if (ev.currentTarget.value === placeholder) {
              ev.currentTarget.dataset["placeholder"] = "false";
              ev.currentTarget.value = "";
            }
          }}
          onBlur={(ev) => {
            if (
              ev.currentTarget.defaultValue === "" ||
              ev.currentTarget.value === ""
            ) {
              // Render placeholder if value in textarea is empty
              ev.currentTarget.dataset["placeholder"] = "true";
              ev.currentTarget.value = placeholder;
            } else if (ev.currentTarget.value !== placeholder) {
              // set placeholder to false if placeholder is not empty
              ev.currentTarget.dataset["placeholder"] = "false";
            }
          }}
          onFocus={(ev) => {
            if (isPlaceholder(ev.currentTarget, placeholder)) {
              ev.currentTarget.dataset["placeholder"] = "true";
              ev.currentTarget.selectionEnd = 0;
            }
            onFocus ? onFocus(ev) : null;
          }}
          onPaste={(ev) => {
            if (ev.currentTarget.dataset["placeholder"] === "true") {
              ev.currentTarget.value = "";
              ev.currentTarget.dataset["placeholder"] = "false";
            }
          }}
          onClick={(ev) => {
            if (ev.currentTarget.dataset["placeholder"] === "true") {
              ev.currentTarget.selectionEnd = 0;
            }
          }}
          onMouseOver={onHover}
          defaultValue={renderInitValue}
        ></textarea>
      );
    case "dropdown":
      return (
        <select
          name={field.name}
          onFocus={onFocus}
          onMouseOver={onHover}
          defaultValue={defaultValue ?? undefined}
          placeholder={field.input.placeholder[lang]}
        >
          {field.input.choices?.map((choice, index) => {
            const text: string =
              typeof choice.text === "string" ? choice.text : choice.text[lang];
            return (
              <option
                key={`option_${field.name}_${index}`}
                value={choice.value}
              >
                {text}
              </option>
            );
          })}
        </select>
      );
    case "consent":
      return (
        <>
          <div className="flex flex-col gap-[16px]">
            <p>{t("consent-1")}</p>
            <p>{t("consent-2")}</p>
            <p>{t("consent-3")}</p>
            <span className={"flex gap-[16px] items-center mt-[8px]"}>
              <input
                name={field.name}
                id={field.name}
                type={"checkbox"}
                onFocus={onFocus}
                onMouseOver={onHover}
                //defaultValue={defaultValue ?? undefined}
                value={"agreed"}
                required
              />
              <label htmlFor="consent" className="text-salmon">
                {field.input.placeholder[lang]}
              </label>
            </span>
          </div>
        </>
      );
    case "adder":
      return <AdderInput field={field} onFocus={onFocus} onHover={onHover} />;
  }
};

const steps: FormStep[] = [
  {
    name: {
      en: "The Story",
      no: "Historien",
    },
    timeInPercentage: "w-[18%]",
    form: form_0,
    nextStep: "next",
    previousStep: "cancel",
    tooltipInfo: {
      en: "Tell us the story behind the dish",
      no: "Fortell oss om historien bak retten",
    },
  },
  {
    name: { en: "The Recipe", no: "Oppskriften" },
    timeInPercentage: "w-[28%]",
    form: form_1,
    nextStep: "next",
    previousStep: "previous",
    tooltipInfo: {
      en: "Tell us what ingredients we need, and how we make this dish",
      no: "Fortell oss om ingrediensene vi trenger, og hvordan vi lager retten",
    },
  },
  {
    name: { en: "The Recipe II", no: "Oppskriften II" },
    timeInPercentage: "w-[28%]",
    form: form_2,
    nextStep: "next",
    previousStep: "previous",
    tooltipInfo: {
      en: "Tell us a bit more about this dish",
      no: "Fortell oss litt mer om retten",
    },
  },
  {
    name: { en: "The Chef", no: "Kokken" },
    timeInPercentage: "w-[16%]",
    form: form_3,
    nextStep: "preview",
    previousStep: "previous",
    tooltipInfo: {
      en: "Tell us a bit about yourself",
      no: "Fortell oss litt om deg selv",
    },
  },
  // {
  //   name: { en: "Sharing your recipe", no: "Deling av din oppskrift" },
  //   timeInPercentage: "w-[8%]",
  //   form: form_4,
  //   nextStep: "preview",
  //   previousStep: "previous",
  //   tooltipInfo: {
  //     en: "Information about sharing your recipe, and asking for consent",
  //     no: "Informasjon om deling av din oppskrift, og forespørsel om tillatelse",
  //   },
  // },
];
