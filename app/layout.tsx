import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIRECTIVES",
  description: "Pending tasks to execute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
