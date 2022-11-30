import { createCookieSessionStorage } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { getDomainByEnv } from "./utils/functions";

export let sessionStorage =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      domain: getDomainByEnv(),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
      secrets: ["48b31595acaeca6b0e9612e914ffdb60ed6e334d9dc92decffcb648ec2dd3159b0fb4dd542e9b11c89b6adc563e63802934f52a49c5068d1a7f30361978438066e66c193cb7fc69a2278b384583b0d0c492c98be6c3ab90f3137271f53a3488d4e9db9fd49f6db3b3c3eb167beca9ae329acf2412a505ecd0fcb2ad1e09a4d7f"],
      secure: true,
    },
  });

export let { getSession, commitSession, destroySession } = sessionStorage;