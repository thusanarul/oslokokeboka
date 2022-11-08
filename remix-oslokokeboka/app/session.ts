import { createCookieSessionStorage } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { getDomainByEnv } from "./utils/functions";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      domain: getDomainByEnv(),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };