import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  weight: '900',
  subsets: ['latin'],
  display: "swap",
})

export const metadata = {
  title: "Drawiii",
  description: "A simple real-time collaborative drawing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "d6ffa59403cb49f0ae4dc5ad5c1547f4"}'></script>
      </head>
      <body className={`${inter.className}`}>
        <a href="https://github.com/nishindudu/Drawiii" target="_blank" className="github"><img src="github-mark-white.svg"></img></a>
        {children}
      </body>
    </html>
  );
}
