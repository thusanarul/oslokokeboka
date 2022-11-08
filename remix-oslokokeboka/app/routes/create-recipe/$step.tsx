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
import { useCallback, useEffect, useRef, useState } from "react";
import { Chevron } from "~/components/chevron";
import { Pencil } from "~/components/pencil";
import invariant from "tiny-invariant";
import { Ellipse } from "~/components/ellipse";
import { Prisma, InputType, RecipeSubmission } from "@prisma/client";

import { db } from "~/utils/db.server";
import { commitSession, getSession } from "~/session";
import form_0 from "~/form-input/form-0";
import form_1 from "~/form-input/form-1";
import form_2 from "~/form-input/form-2";
import form_3 from "~/form-input/form-3";
import form_4 from "~/form-input/form-4";

export type RecipeFormField = {
  index: string;
  name: string;
  title: string;
  errorText?: string;
  required?: boolean;
  infoText?: string[];
  input: {
    type: "text" | "textarea" | "dropdown" | "adder" | "consent";
    placeholder: string;
    defaultValue?: string;
    choices?: {
      value: string | number;
      text: string;
    }[];
  };
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

// 08.09
// Able to save to database, and it upserts.
// Redirecting to the next step is not fully implemented yet. Missing creating the actual form heh.
// Next step: task 1 or 2

// TODO
// task: Make the rest of the form, and make sure redirecting and saving the form works.
// task: fieldinfocus as a hook? would help refactoring? make it cleaner
// task: Create admin panel to view submitted recipes. Can be pretty simple.
// task: Create image upload and consent input
// task: edit ingredients submission.
// task: Make opacity depended on scroll also. Have only implemented lazy version

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.step, `form step is required`);
  const currentStep: number = parseInt(params.step);

  if (currentStep < 0 || currentStep > steps.length) {
    return redirect("/");
  }

  console.log(`loader: ${currentStep}`);

  // NICE TO HAVE: as of 08.09 not implemented?
  //       Check if form has already been partially submitted
  //       If so, populate defaultValue in RecipeFormField
  //       see if gthere

  // Also, actually return the correct form hehe
  // This pattern of defining of what the current form is, could give me complications

  return json<{ step: number; form: RecipeFormField[] }>({
    step: currentStep,
    form: steps[currentStep].form,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  console.log(`På route: ${params.step}`);

  invariant(params.step, `form step is required`);
  const currentStep: number = parseInt(params.step);
  // Do this better by actually returning the correct form
  // This pattern of defining of what the current form is, could give me complications
  // yes michael jackson dangerous

  if (currentStep < 0 || currentStep > steps.length) {
    return redirect("/");
  }

  const currentForm: RecipeFormField[] = steps[currentStep].form;

  const formData = await request.formData();

  /*
    Validate form
  */
  let hasError: boolean = false;

  formData.forEach((val, key, _) => {
    const s = currentForm.find((field) => field.name === key);

    if (s?.required && val.toString().trim() === "") {
      s.errorText = "This field can not be left blank";
    }

    // Flip hasError boolean if errorText has been added
    if (s?.errorText && !hasError) {
      hasError = true;
    }
  });

  if (hasError) {
    console.log("Form has error");
    return json<{ step: number; form: RecipeFormField[] }>({
      step: currentStep,
      form: currentForm,
    });
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
    submission = await db.recipeSubmission.findUniqueOrThrow({
      where: {
        id: session.get("formId"),
      },
    });
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
  const loaderData: { step: number; form: RecipeFormField[] } = useLoaderData();
  const actionData: { step: number; form: RecipeFormField[] } | undefined =
    useActionData();
  const navigate = useNavigate();

  let currentForm: RecipeFormField[];
  let currentStep: number;

  // Lærdom: loaderData er aldri undefined
  //         Kan skrive dette på en bedre måte
  if (actionData !== undefined) {
    currentForm = actionData.form;
    currentStep = actionData.step;
  } else if (loaderData !== undefined) {
    currentForm = loaderData.form;
    currentStep = loaderData.step;
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
                      {field.infoText ? (
                        <span className="flex flex-col gap-[16px]">
                          {field.infoText.map((val, _) => (
                            <p>{val}</p>
                          ))}
                        </span>
                      ) : null}
                      <InputField
                        field={field}
                        onFocus={() => setFieldInFocus(field.index)}
                        onHover={() => setFieldInFocus(field.index)}
                      />
                    </label>
                    {field.errorText ? (
                      <span className="flex mt-[8px] gap-[8px]">
                        <Ellipse className={"self-center w-[10px] h-[10px]"} />
                        <p className="text-ochre">{field.errorText}</p>
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
                      console.log("hei");
                      navigate(`/create-recipe/${currentStep - 1}`);
                    }
                  }
                }}
              >
                {steps[currentStep].previousStep === "cancel"
                  ? "Cancel"
                  : "Previous"}
              </button>
              <button className="p-[16px] red-button w-[68px] flex-auto justify-center">
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

type InputHTMLElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLDivElement;

const InputField = ({
  field,
  onFocus,
  onHover,
}: {
  field: RecipeFormField;
  onFocus: React.FocusEventHandler<InputHTMLElement> | undefined;
  onHover: React.MouseEventHandler<InputHTMLElement> | undefined;
}) => {
  switch (field.input.type) {
    case "text":
      return <TextInput field={field} onFocus={onFocus} onHover={onHover} />;
    case "textarea":
      return (
        <textarea
          name={field.name}
          placeholder={field.input.placeholder}
          form="recipe-form"
          rows={8}
          onFocus={onFocus}
          onMouseOver={onHover}
        ></textarea>
      );
    case "dropdown":
      return (
        <select name={field.name} onFocus={onFocus} onMouseOver={onHover}>
          {field.input.choices?.map((choice, index) => (
            <option key={`option_${field.name}_${index}`} value={choice.value}>
              {choice.text}
            </option>
          ))}
        </select>
      );
    case "consent":
      return (
        <div className={"flex gap-[16px] items-center mt-[8px]"}>
          <input
            name={field.name}
            id={field.name}
            type={"checkbox"}
            onFocus={onFocus}
            onMouseOver={onHover}
          />
          <label className="text-salmon">{field.input.placeholder}</label>
        </div>
      );
    case "adder":
      // TODO: Refactor and move into own file probably
      // TODO: Implement edit-button, and discuss with Shub what this is supposed to look like

      // Rendering with Browser only apis: https://remix.run/docs/en/v1/guides/constraints#rendering-with-browser-only-apis
      const [items, setItems] = useState<
        {
          name: string;
          amount: string;
          unit_type: string;
        }[]
      >([]);

      useEffect(() => {
        const saved = localStorage.getItem(`adder-${field.name}`);
        if (!saved) {
          return;
        }

        setItems(JSON.parse(saved));
      }, []);

      const nameEl = useRef<HTMLInputElement | null>(null);
      const amountEl = useRef<HTMLInputElement | null>(null);
      const unitTypeEl = useRef<HTMLSelectElement | null>(null);

      const submittedItems = items
        .map((item) => `${item.name}:${item.amount}:${item.unit_type}`)
        .join(";");

      return (
        <div
          className="flex flex-col gap-[16px]"
          onFocus={onFocus}
          onMouseOver={onHover}
        >
          <input type="hidden" name={field.name} value={submittedItems} />
          <div className={items.length > 0 ? "flex flex-col" : "hidden"}>
            {items.map((item, index) => (
              <span
                key={`submitted_item_${index}`}
                className="w-full h-full flex justify-between border-b-[0.5px] border-b-paper py-[20px] "
              >
                <p className="text-paper w-[208px] whitespace-normal">
                  {item.name}
                </p>
                <p className="text-paper">
                  {item.amount} {item.unit_type}
                </p>
                <button type="button" className="flex-none w-[18px]">
                  <Pencil className="w-full h-[20px]" />
                </button>
              </span>
            ))}
          </div>
          <input
            name={`ignore-name_${field.name}`}
            type={"text"}
            className="w-full"
            ref={nameEl}
          />
          <div className="flex w-full gap-[12px]">
            <input
              name={`ignore-amount_${field.name}`}
              type={"number"}
              className="flex-auto w-[92px]"
              ref={amountEl}
            />
            <select
              name={`ignore-unit_${field.name}`}
              className="flex-auto w-[145px]"
              ref={unitTypeEl}
            >
              {field.input.choices?.map((choice, index) => (
                <option
                  key={`option_unit_${field.name}_${index}`}
                  value={choice.value}
                >
                  {choice.text}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="flex-auto w-[55px] red-button"
              onClick={() => {
                // TODO: Create UI that displays error message
                if (
                  !nameEl.current?.value ||
                  !amountEl.current?.value ||
                  !unitTypeEl.current?.value
                ) {
                  return;
                }
                const i = [
                  ...items,
                  {
                    name: nameEl.current.value,
                    amount: amountEl.current.value,
                    unit_type: unitTypeEl.current.value,
                  },
                ];

                setItems(i);
                localStorage.setItem(`adder-${field.name}`, JSON.stringify(i));
              }}
            >
              +
            </button>
          </div>
        </div>
      );
  }
  return null;
};

const TextInput = ({
  field,
  onFocus,
  onHover,
}: {
  field: RecipeFormField;
  onFocus: React.FocusEventHandler<InputHTMLElement> | undefined;
  onHover: React.MouseEventHandler<InputHTMLElement> | undefined;
}) => {
  const [prepopulate, setPrepopulate] = useState<string | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem(`input-${field.name}`);
    if (!saved) {
      return;
    }

    setPrepopulate(saved);
  }, []);

  return (
    <input
      name={field.name}
      type={"text"}
      placeholder={field.input.placeholder}
      onFocus={onFocus}
      onMouseOver={onHover}
      onChange={(node) => {
        localStorage.setItem(`input-${field.name}`, node.currentTarget.value);
      }}
      value={prepopulate}
    />
  );
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
