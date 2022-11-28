import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { Prisma, InputType, RecipeSubmission } from "@prisma/client";

import { db } from "~/utils/db.server";
import { commitSession, getSession } from "~/session";
import form_0 from "~/form-input/form-0";
import form_1 from "~/form-input/form-1";
import form_2 from "~/form-input/form-2";
import form_3 from "~/form-input/form-3";
import form_4 from "~/form-input/form-4";
import AdderInput from "~/components/input-fields/adder";
import TextInput from "~/components/input-fields/text-input";
import { InputHTMLElement } from "~/components/input-fields/shared";
import Chevron from "~/components/chevron";
import Ellipse from "~/components/ellipse";

/*
required trenger ikke å være nullable?
*/
export type RecipeFormField = {
  index: string;
  name: string;
  title: string;
  required?: boolean;
  input: BasicInputField | ChoicesInputField;
};

export type RecipeFormFieldError = {
  index: string;
  name: string;
  errorText: string;
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
  placeholder: string;
};

type ChoicesInputField = {
  type: "dropdown" | "adder";
  placeholder: string;
  choices: {
    value: string | number;
    text: string;
  }[];
};

type step = "next" | "previous" | "cancel" | "submit";

type FormStep = {
  name: string;
  timeInPercentage: string;
  form: RecipeFormField[];
  nextStep: step;
  previousStep: step;
};

const inputTypeMap = {
  text: InputType.TEXT,
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

  if (currentStep < 0 || currentStep > steps.length) {
    return redirect("/");
  }

  // session or localstorage?
  const session = await getSession(request.headers.get("Cookie"));
  let submission: RecipeSubmission | null = null;
  const filled: RecipeFilled = {};

  if (session.has("formId")) {
    console.log("Found formId");
    submission = await db.recipeSubmission.findUnique({
      where: {
        id: session.get("formId"),
      },
    });
  }

  if (submission) {
    const f = await db.recipeField.findMany({
      where: {
        recipeSubmissionId: submission.id,
        step: currentStep,
      },
    });

    f.forEach((val, i) => {
      filled[val.index] = {
        index: val.index,
        name: val.name,
        value: val.inputValue,
      };
    });
  }

  return json<{ step: number; form: RecipeFormField[]; filled: RecipeFilled }>({
    step: currentStep,
    form: steps[currentStep].form,
    filled: filled,
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

    // more types of validation?
    if (s?.required) {
      if (val.toString().trim() === "") {
      errors[s.index] = {
        index: s.index,
        name: s.name,
        errorText: "This field can not be left blank",
      };
    }
    }

    // Flip hasError boolean if errorText has been added
    if (!hasError && Object.keys(errors).length > 0) {
      hasError = true;
    }
  });

  if (hasError) {
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
      return;
    }

    submission = s;
  }

  formData.forEach(async (val, key, _) => {
    const s = currentForm.find((field) => field.name === key);

    if (!s) {
      return;
    }

    // Grab previous input if it exists
    // should be unique enough to check step, name, and submissionId
    const prevInput: Prisma.RecipeFieldScalarWhereInput = {
      step: currentStep,
      name: s.name,
      recipeSubmissionId: submission.id,
    };

    const prev = await db.recipeField.findFirst({
      where: {
        ...prevInput,
      },
    });

    // Create upsert arguments
    const input: Prisma.RecipeFieldUpsertArgs = {
      where: {
        id: prev?.id ?? -1,
      },
      create: {
        step: currentStep,
        name: s.name,
        index: s.index,
        inputType: inputTypeMap[s.input.type],
        inputValue: val.toString(),
        recipeSubmissionId: submission.id,
      },
      update: {
        inputValue: val.toString(),
      },
    };

    const f = await db.recipeField.upsert({
      ...input,
    });
  });

  const nextStep = `create-recipe/${currentStep + 1}`;

  return redirect(nextStep, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function RecipeIndex() {
  const loaderData: {
    step: number;
    form: RecipeFormField[];
    filled: RecipeFilled;
  } = useLoaderData();
  const actionData:
    | { step: number; form: RecipeFormField[]; errors: RecipeErrors }
    | undefined = useActionData();
  const navigate = useNavigate();

  let currentForm: RecipeFormField[];
  let currentStep: number;
  let errors: RecipeErrors;
  let filled: RecipeFilled;

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

  return (
    <div className="h-full flex justify-center">
      <main className="h-[85vh] w-[85vw] flex flex-col self-center">
        {/* Either fetch from localstorage, associate with form value or render the default text */}
        <h2 className="">Your Recipe*</h2>
        <div className="w-full flex justify-between mt-[18px]">
          {steps.map((step, index) => {
            const stepColor = currentStep === index ? "bg-salmon" : "";
            return (
              <button
                type="button"
                key={`step_${index}`}
                aria-label={step.name}
                disabled={currentStep !== index}
                className={`form-indicator ${step.timeInPercentage} ${stepColor}`}
                onClick={() => {
                  navigate(`/create-recipe/${index}`);
                }}
              />
            );
          })}
        </div>
        <p className="mt-[12px]">{steps[currentStep].name}</p>
        {/* Dropdown button that shows hint for form as text */}
        {/* TODO: implement text view and make this it's own component */}
        <button
          type="button"
          className="mt-[18px] h-[51px] bg-blue rounded-[4px] text-white py-[16px] pl-[16px] pr-[20px] body-text inline-flex justify-between"
        >
          Form assistance
          {/* animate chevron onclick? */}
          <Chevron className={"self-center h-[8px] w-[12px]"} />
        </button>
        {/* The form associated with the current step*/}
        <div className="mt-[32px]">
          <Form method="post" className="h-full mb-[24px]" id="recipe-form">
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
                      <h2 className="mb-[8px]">{field.title}</h2>
                      <InputField
                        field={field}
                        onFocus={() => setFieldInFocus(field.index)}
                        onHover={() => setFieldInFocus(field.index)}
                        defaultValue={defaultValue}
                      />
                    </label>
                    {errors && errors[field.index] !== undefined ? (
                      <span className="flex mt-[8px] gap-[8px]">
                        <Ellipse className={"self-center w-[10px] h-[10px]"} />
                        <p className="text-ochre">
                          {errors[field.index].errorText}
                        </p>
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="w-1/2 flex mt-[42px] gap-[16px] justify-start">
              <button
                type="button"
                className="flex-auto inverted-red-button"
                onClick={() => {
                  if (steps[currentStep].previousStep === "cancel") {
                    navigate("/");
                  } else {
                    if (currentStep > 0 && currentStep < steps.length) {
                      navigate(`/create-recipe/${currentStep - 1}`);
                    }
                  }
                }}
              >
                {steps[currentStep].previousStep === "cancel"
                  ? "Cancel"
                  : "Previous"}
              </button>
              <button
                type="submit"
                className="p-[16px] red-button w-[68px] flex-auto justify-center"
              >
                {steps[currentStep].previousStep === "submit"
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}

const InputField = ({
  field,
  onFocus,
  onHover,
  defaultValue,
}: {
  field: RecipeFormField;
  onFocus: React.FocusEventHandler<InputHTMLElement> | undefined;
  onHover: React.MouseEventHandler<InputHTMLElement> | undefined;
  defaultValue: string | null;
}) => {
  switch (field.input.type) {
    case "text":
      return (
        <TextInput
          field={field}
          onFocus={onFocus}
          onHover={onHover}
          defaultValue={defaultValue}
        />
      );
    case "textarea":
      return (
        <textarea
          name={field.name}
          placeholder={field.input.placeholder}
          form="recipe-form"
          rows={8}
          onFocus={onFocus}
          onMouseOver={onHover}
          defaultValue={defaultValue ?? undefined}
        ></textarea>
      );
    case "dropdown":
      return (
        <select
          name={field.name}
          onFocus={onFocus}
          onMouseOver={onHover}
          defaultValue={defaultValue ?? undefined}
        >
          {field.input.choices?.map((choice, index) => (
            <option key={`option_${field.name}_${index}`} value={choice.value}>
              {choice.text}
            </option>
          ))}
        </select>
      );
    case "consent":
      return (
        <>
          <div className="flex flex-col gap-[16px]">
            <p>
              On this we require to store information that you provide us to
              create recipe entries that are then visualised on the Oslo Recipes
              page.
            </p>
            <p>
              Before we can publish your recipe, we need your consent to use it
              on our website. You can contact us to take it down at any point in
              the future if you change your mind.
            </p>
            <span className={"flex gap-[16px] items-center mt-[8px]"}>
          <input
            name={field.name}
            id={field.name}
            type={"checkbox"}
            onFocus={onFocus}
            onMouseOver={onHover}
            defaultValue={defaultValue ?? undefined}
                value={"yes"}
                required
          />
              <label htmlFor="consent" className="text-salmon">
                {field.input.placeholder}
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
    name: "Personal Info",
    timeInPercentage: "w-[18%]",
    form: form_0,
    nextStep: "next",
    previousStep: "cancel",
  },
  {
    name: "Why this dish",
    timeInPercentage: "w-[28%]",
    form: form_1,
    nextStep: "next",
    previousStep: "previous",
  },
  {
    name: "Preparation Information",
    timeInPercentage: "w-[28%]",
    form: form_2,
    nextStep: "next",
    previousStep: "previous",
  },
  {
    name: "Ingredients and instructions",
    timeInPercentage: "w-[8%]",
    form: form_3,
    nextStep: "next",
    previousStep: "previous",
  },
  {
    name: "Consent",
    timeInPercentage: "w-[8%]",
    form: form_4, // change this when required components are ready
    nextStep: "submit",
    previousStep: "previous",
  },
];
