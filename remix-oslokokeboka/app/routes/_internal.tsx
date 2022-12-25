// self-host prisma studio? https://github.com/prisma/studio-vercel-guide
// need login. can try remix-auth: https://github.com/sergiodxa/remix-auth

import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  return json(session.get("user") !== undefined);
};

export default function Internal() {
  const isLoggedIn = useLoaderData();
  return (
    <div className="h-screen w-auto">
      {isLoggedIn ? (
        <Outlet />
      ) : (
        <Form
          action="/_internal/auth/google"
          method="post"
          className="my-[64px] mx-auto w-full flex justify-center"
        >
          <button className="text-white border-white border-2 p-4">
            Login with Google
          </button>
        </Form>
      )}
    </div>
  );
}
