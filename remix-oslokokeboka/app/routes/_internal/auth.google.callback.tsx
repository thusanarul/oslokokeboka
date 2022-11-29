import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  console.log(request);

  return authenticator.authenticate("google", request, {
    successRedirect: "/_internal/admin",
    failureRedirect: "/_internal",
  });
};
