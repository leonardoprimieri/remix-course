import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import styles from "./styles/main.css";
import MainNavigation from "~/components/MainNavigation";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
    <html>
      <head>
        <Meta />
        <Links />
        <title>{caughtResponse?.statusText}</title>
      </head>
      <body>
        <main className="error">
          <h1>Something went wrong!</h1>
          <pre>{caughtResponse?.data?.message}</pre>
          <Link to="/">Go back to home</Link>
        </main>
        <Scripts />
      </body>
    </html>
  );
}

export function links() {
  return [
    { rel: "stylesheet", href: cssBundleHref },
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}
