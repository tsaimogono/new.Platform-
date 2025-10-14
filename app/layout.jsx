import "./globals.css";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import AuthProvider from "../components/AuthProvider";
import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export const metadata = {
  title: "Real Estate Platform",
  description: "Find your dream home with our real estate platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 👇 This line suppresses harmless hydration mismatches (like Grammarly or password manager attributes) */}
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Navbar />
            {children}
            <Footer />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
