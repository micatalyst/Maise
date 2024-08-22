import "@/styles/Global.scss"; // Scss Global

//import fontAwesomeConfig from "@/lib/fontawesome";
import "@/lib/fontawesome";

import Header from "@/components/Header";

export const metadata = {
  title: "MAISE",
  description: "Projeto Final do Mestrado MCTW",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
