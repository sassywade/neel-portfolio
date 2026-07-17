import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader, Caveat } from "next/font/google";
import "./globals.css";
import { BikeProvider } from "@/components/bike/BikeContext";
import { CustomizerModal } from "@/components/bike/CustomizerModal";
import { ScrollBike } from "@/components/bike/ScrollBike";
import { Nav } from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neel Saswade — Senior Product Designer",
  description:
    "Portfolio of Neel Saswade: product design, play, photography, and a peloton of visitor bikes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <BikeProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <ScrollBike />
          <CustomizerModal />
        </BikeProvider>
      </body>
    </html>
  );
}
