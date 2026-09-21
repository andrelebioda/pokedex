//CSS
import "./globals.css";

//Components
import Navigation from "@/components/layout/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen min-[1200px]:grid min-[1200px]:grid-cols-[240px_1fr]">
          <Navigation />

          <main className="p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
