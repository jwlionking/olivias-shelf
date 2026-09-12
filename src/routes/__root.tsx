import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "../styles.css?url";
import fontsCss from "../styles/storylight/fonts.css?url";

const APP_NAME = "Olivia's Shelf";

function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6 text-center text-ink">
      <div>
        <p className="font-display text-sm tracking-[0.16em] text-muted uppercase">
          Olivia's Shelf
        </p>
        <h1 className="mt-2 text-3xl font-semibold">This page flew off</h1>
        <p className="mt-2 text-ink-soft">Try the library instead.</p>
        <a href="/" className="mt-6 inline-block text-comet">
          Back to stories
        </a>
      </div>
    </main>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Pop-up picture books painted for Olivia — they read themselves aloud, light up every word, and jump out of the page.",
      },
      { name: "theme-color", content: "#141a33" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: fontsCss },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  errorComponent: AppErrorComponent,
  notFoundComponent: NotFound,
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
