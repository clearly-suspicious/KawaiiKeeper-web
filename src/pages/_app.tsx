import { Inter } from "@next/font/google";
import { NextComponentType } from "next";
import { type AppType, AppProps } from "next/app";
import { useRouter } from "next/router";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";

import "../styles/globals.css";

import { api } from "../utils/api";

const inter = Inter({ subsets: ["latin"] });

export type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean }; // add auth type
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
        body {
          background-color: #070707;
        }
      `}</style>
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  );
};

type Props = {
  children: React.ReactNode;
};
const Auth = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children as JSX.Element;
};

export default api.withTRPC(MyApp);
