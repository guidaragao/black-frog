import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blackfrog.io"),
  title: {
    default: "Black Frog. Design & Digital Solutions",
    template: "%s | Black Frog",
  },
  description:
    "Black Frog builds brands, products and campaigns that leap ahead. Sites, apps, CRM, SEO, film and brand systems, in one house.",
  keywords: [
    "creative agency",
    "brand strategy",
    "web development",
    "product design",
    "SEO",
    "CRM",
    "video production",
  ],
  openGraph: {
    title: "Black Frog. Design & Digital Solutions",
    description:
      "Brands, products and campaigns that leap ahead. Sites, apps, CRM, SEO, film and brand systems, in one house.",
    url: "https://blackfrog.io",
    siteName: "Black Frog",
    images: [{ url: "/brand/logo-stacked.png", width: 786, height: 503 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Frog. Design & Digital Solutions",
    description: "Brands, products and campaigns that leap ahead.",
    images: ["/brand/logo-stacked.png"],
  },
  icons: {
    icon: [
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* .grain poe o grao de filme por cima da pagina inteira */}
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
