import { type NextPage } from "next";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import Seo from "../components/Seo";

const Home: NextPage = () => {
  return (
    <>
      <Seo />

      <main className=" relative grid h-screen w-full place-items-center overflow-hidden bg-[#070707]">
        <Image
          src="/images/light.png"
          fill
          alt="background"
          className="pointer-events-none mt-36 "
        />
        <div className="pointer-events-auto z-10">
          <div className="container flex min-h-screen w-full flex-col items-center justify-end gap-12 px-4 py-32 ">
            <h1 className="max-w-[728px] bg-gradient-to-b from-[#FFFFFFD9] to-[#ECECEC3D] bg-clip-text text-center text-[64px] font-[500] leading-[105.52%] tracking-[-0.025em] [text-fill-color:transparent] [-webkit-text-fill-color:transparent] [-webkit-background-clip:_text]">
              Generate your favorite anime characters
            </h1>

            {/* <div className="flex flex-col items-center gap-2">
              <AuthShowcase />
            </div> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {/* {secretMessage && <span> - {secretMessage}</span>} */}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
