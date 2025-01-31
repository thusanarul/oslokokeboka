import {
  ErrorBoundaryComponent,
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
} from "@remix-run/react";
import { CatchBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import styles from "./app.css";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18next.getLocale(request);

  const production = process.env.HOPS_DOMAIN === "oslokokeboka.no";

  return json<{ locale: string; production: boolean }>({ locale, production });
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
  title: "Oslo Kokeboka | Byens historier gjennom oppskrifter",
  "og:title": "Oslo Kokeboka | Byens historier gjennom oppskrifter",
  viewport: "width=device-width,initial-scale=1",
  description:
    "Vi samler historier gjennom oppskrifter til Oslos første kokebok, laget av Oslo. Vår drøm er å samle en oppskrift fra alle som bor i Oslo.",
  "og:description":
    "Vi samler historier gjennom oppskrifter til Oslos første kokebok, laget av Oslo",
  keywords:
    "Oslo Kokeboka, Oslo, Kokeboka, oslo, kokebok, historier, mat, oppskrifter",
  "og:image": "https://oslokokeboka.no/images/food/ok-mango.png",
  "og:image:type": "image/png",
  "og:image:width": "2480",
  "og:image:height": "1754",
  "og:image:alt": "Mango | Oslo Kokeboka",
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
  let { locale, production } = useLoaderData<{
    locale: string;
    production: boolean;
  }>();

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
        {production && (
          <script
            async
            defer
            data-website-id="4e911a1f-be71-4571-b29d-1214a4211b78"
            src="https://headless-analytics.app.iterate.no/umami.js"
          />
        )}
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

export const CatchBoundary: CatchBoundaryComponent = () => {
  let { t } = useTranslation("");

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main className="flex flex-col w-full gap-12 py-[100px] md:py-[40px] mx-auto">
          <img
            className="self-center"
            src="/images/food/pumpkin-transparent.png"
          />
          <div className="flex flex-col gap-8">
            <h1 className="fuzzy text-ochre">{t("page-not-found")}</h1>
            <p className="text-ochre text-center">{t("pnf-text")}</p>
          </div>
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  let { t } = useTranslation("");

  console.error(error);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main className="flex flex-col w-full gap-12 py-[100px] md:py-[40px] mx-auto">
          <img
            className="self-center"
            src="/images/food/pumpkin-transparent.png"
          />
          <div className="flex flex-col gap-8">
            <h1 className="fuzzy text-ochre">{t("something-went-wrong")}</h1>
          </div>
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
};
