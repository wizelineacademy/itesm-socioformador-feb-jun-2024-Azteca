import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Feedback Flow",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if the current route is login or register, we don't want to show the nav bar

  return (
    <html lang="en">
      <body className={poppins.className + " h-dvh w-dvw bg-bone"}>
        {children}
      </body>
    </html>
  );
}
