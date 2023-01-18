import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
} from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import styles from "./app.css";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const loader: LoaderFunction = async ({ request }) => {
  let locale = await i18next.getLocale(request);
  return json({ locale });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Oslo Kokeboka",
  viewport: "width=device-width,initial-scale=1",
});

// useChangeLanguage from react-i18next ^v12.0.0 does not work: https://github.com/sergiodxa/remix-i18next/issues/107
export function useChangeLanguage(locale: string) {
  let { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export default function App() {
  // Get the locale from the loader
  let { locale } = useLoaderData<typeof loader>();

  let { i18n } = useTranslation();

  let location = useLocation();

  const ignoreRoutes = ["_admin"];

  const dontRenderHeaderAndFooter = ignoreRoutes.some((val) =>
    location.pathname.startsWith(`/${val}`)
  );

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  //useChangeLanguage(locale);
  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-screen">
        {!dontRenderHeaderAndFooter && <Header />}
        <main>
          <Outlet />
        </main>
        {!dontRenderHeaderAndFooter && <Footer />}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
