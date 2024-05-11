import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Lato } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { getCookies } from "./actions";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Providers from "./components/Providers";
import "./globals.css";
const InternetStatus = dynamic(() => import("./components/InternetStatus"), {
  ssr: false,
});

const inter = Lato({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Fit Sathi",
  description: "Streamline Your Fitness Business, Effortlessly.",
  icons: {
    icon: "/logo3.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <link rel="icon" href="/logo3.svg" sizes="any" />
        <NextTopLoader height={5} color="rgb(175 121 149)" />
        <Providers getCookies={getCookies}>
          <InternetStatus />
          <Header />
          <div>{children}</div>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
