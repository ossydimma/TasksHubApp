import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SideBar from "./components/sideBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TasksHub",
  description: "Apllication to manage your tasks and help you document",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased font-serif bg-[#dadde2] w-screen h-auto md:h-screen pr-0 md:pr-[-20px] sm:pr-1 flex gap-0 sm:gap-1 md:gap-3" `}
      >
        <SideBar />
        <div className="relative bg-[#f6f5f5] h-[98Vh] ) overflow-x-hidden overflow-y-scroll md:overflow-hidden my-0 sm:my-[1vh]  w-screen sm:rounded-[2rem]">
          {children}
        </div>
      </body>
    </html>
  );
}
