import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "The Listener — Your Emotional Safe Space",
  description:
    "A private, warm chat companion that's always here to listen. Speak freely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: "!bg-charcoal-mid !text-cream !border !border-white/10 !text-sm",
              duration: 3000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
