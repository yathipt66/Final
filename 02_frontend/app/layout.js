// layout.js
import "./globals.css";

export const metadata = {
  title: "Message Board",
  description: "Simple Message Board App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
