import classNames from "classnames";
import { type NextPage } from "next";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import Seo from "../components/Seo";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};
const Button = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <button
      className={classNames(
        "relative rounded-[36px] bg-gradient-to-b from-[#BDBDBD] to-transparent text-[18px] font-[300] text-[#D8D8D8]",
        className
      )}
      {...rest}
    >
      <div className="m-[1px] h-full w-full rounded-[36px] bg-[#070707] py-4 px-12">
        {children}
      </div>
    </button>
  );
};

const Header = () => {
  return (
    <div className="fixed top-0 my-12 flex w-full items-center justify-between px-14 text-white">
      <div className="text-[24px]">KawaiiKeeper</div>
      <div>
        <Button onClick={() => signIn("discord")}>
          <>Log In</>
        </Button>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Seo />

      <main className=" relative grid h-screen w-full place-items-center overflow-hidden bg-[#070707]">
        <Header />
        <Image
          width={1640}
          height={1024}
          src="/images/light.png"
          alt="background"
          className="pointer-events-none absolute top-36"
        />
        <div className="pointer-events-auto z-10">
          <div className="container flex min-h-screen w-full flex-col items-center justify-end gap-12 px-4 py-24 ">
            <h1 className="max-w-[728px] bg-gradient-to-b from-[#FFFFFFD9] to-[#ECECEC3D] bg-clip-text text-center text-[64px] font-[500] leading-[105.52%] tracking-[-0.025em] [text-fill-color:transparent] [-webkit-text-fill-color:transparent] [-webkit-background-clip:_text]">
              Generate your favorite anime characters
            </h1>
            <Button className="text-[26px]">Invite to discord</Button>
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
