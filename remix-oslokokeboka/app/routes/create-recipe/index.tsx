import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  return redirect("/create-recipe/0");
};

export const meta: MetaFunction = () => ({
  robots: "noindex",
});
