import Analytics from "@/components/Analytics/Analytics";
import AuthProvider from "@/context/authContext";
import UserProvider from "@/context/userContext";
import Footer from "@/lib/components/structures/Footer/Footer";
import "@/theme/theme.scss";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { dir } from "i18next";
import Script from "next/script";

import { theme } from "@/theme/mantine";
import styles from "./page.module.css";

export const metadata = {
  title: {
    default: "Meeple Party",
    template: "%s 🎲 Meeple Party",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" dir={dir("de")}>
      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>
        <body>
        <MantineProvider forceColorScheme="light" theme={theme}>
          <Script src="/bootstrap.bundle.min.js" />
          <AuthProvider>
            <UserProvider>
              <div className={styles.container}>{children}</div>
              <Analytics />
            </UserProvider>
          </AuthProvider>
          <Footer />
        </MantineProvider>
        </body>
      <Script src="/bootstrap.bundle.min.js" />
    </html>
  );
}
