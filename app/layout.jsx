import "./globals.css";

export const metadata = {
  title: "RP360 — Submission Gap Tracker",
  description: "Track regulatory submission gaps across jurisdictions for medical devices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body>{children}</body>
    </html>
  );
}
