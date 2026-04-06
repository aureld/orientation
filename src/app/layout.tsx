import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

// Inline script to apply dark mode before first paint, preventing flash-of-wrong-theme.
// Content is a static string constant — no user input, no XSS risk.
const themeScript = `
(function(){
  try {
    if(localStorage.getItem("darkMode")==="true"){
      document.documentElement.setAttribute("data-theme","dark");
    }
  } catch(e){}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
