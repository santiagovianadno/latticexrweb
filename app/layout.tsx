import type { Metadata, Viewport } from "next";
import { Aldrich, IBM_Plex_Sans, Syne } from "next/font/google";
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
    "Herramienta VR para prototipado de montajes expositivos sobre Gaussian Splats — Proyecto de Título de Diseño UC, Santiago Viana.",
  openGraph: {
    title: "LatticeXR",
    description:
      "Prototipa montajes expositivos en VR y explora espacios reconstruidos con Gaussian Splatting desde el navegador.",
    type: "website",
    locale: "es_CL",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${syne.variable} ${aldrich.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <link
        rel="preconnect"
        href="https://s3-eu-west-1.amazonaws.com"
        crossOrigin="anonymous"
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
