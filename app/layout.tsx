import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { ConditionalLayout } from "@/components/layout/conditional-layout";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Erovoutika - Robotics & Automation Solutions",
  description: "Leading provider of robotics, automation, and STEM education in the Philippines",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
  <head>
    <title>Erovoutika - Robotics & Automation Solutions</title>
    <meta name="description" content="Leading provider of robotics, automation, and STEM education in the Philippines" />

    {/* Favicons */}
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  </head>
  <body className={poppins.className}>
    <Providers>
      <ConditionalLayout>{children}</ConditionalLayout>
    </Providers>
  </body>
</html>
  );
}