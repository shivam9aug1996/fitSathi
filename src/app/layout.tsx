import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { getCookies } from "./actions";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Providers from "./components/Providers";
import "./globals.css";

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
        <Providers getCookies={getCookies}>
          <Header />
          <div className="h-lvh overflow-hidden">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
