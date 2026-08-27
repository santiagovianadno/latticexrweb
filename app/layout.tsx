import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Aldrich, IBM_Plex_Sans, Syne } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import { LOCALE_COOKIE, parseLocale } from "@/lib/locale";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const aldrich = Aldrich({
  variable: "--font-aldrich",
  subsets: ["latin"],
  weight: "400",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
  title: {
    default: "LatticeXR",
    template: "%s · LatticeXR",
  },
  description:
    "VR tool for prototyping exhibition layouts on Gaussian Splats — UC Design Graduation Project, Santiago Viana.",
  openGraph: {
    title: "LatticeXR",
    description:
      "Prototype exhibition layouts in VR and explore spaces reconstructed with Gaussian Splatting in the browser.",
    type: "website",
    locale: "en_US",
    siteName: "LatticeXR",
  },
  icons: {
    icon: "/logo-hero.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c0d0f",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      className={`${syne.variable} ${aldrich.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <link
        rel="preload"
        href="/latticexr-hero-poster.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/latticexr-hero.web.mp4"
        as="video"
        type="video/mp4"
      />
      <link
        rel="preconnect"
        href="https://s3-eu-west-1.amazonaws.com"
        crossOrigin="anonymous"
      />
      <body className="min-h-full flex flex-col">
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
