import { Inter } from "next/font/google";
import "@/styles/Global.scss";

import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MAISE",
  description: "Projeto Final do Mestrado MCTW",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
