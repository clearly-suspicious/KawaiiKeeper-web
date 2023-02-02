import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

import Button from "../components/base/Button";
import Header from "../components/Header";
import Seo from "../components/Seo";
import { shuffle } from "../utils/helpers";

const Home = () => {
  const TOTAL_PHOTOS = 25;
  const { data: sessionData } = useSession();

  const router = useRouter();

  const ImageColumn = ({
    offset = false,
    start,
    end,
  }: {
    start: number;
    end: number;
    offset?: boolean;
  }) => {
    function range(start = 0, end = 1) {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push(i);
      }
      return list;
    }

    return (
      <div
        className={`${
          offset
            ? "translate-y-[-80px] md:translate-y-[-120px] xl:translate-y-[-256px]"
            : ""
        } flex flex-col space-y-4 xl:space-y-8`}
      >
        {shuffle(range(start + 1, end + 1)).map((index, i) => (
          <div
            key={i}
            className="relative aspect-square w-full overflow-hidden"
          >
            <Image
              src={`/images/landing-page/image (${index}).png`}
              fill
              alt="Popular background image"
              sizes="512px"
            />
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <Seo />
      <Header
        sessionData={sessionData}
        rightButtons={[
          sessionData ? (
            <Button key={1} onClick={() => router.push("/app")}>
              <> Go to App </>
            </Button>
          ) : (
            <></>
          ),
        ]}
      />
      <main className=" relative grid w-full place-items-center overflow-hidden ">
        <div className="container flex w-full flex-col items-center justify-end gap-12 px-4 py-8 lg:py-20 ">
          <h1 className="max-w-[640px] bg-gradient-to-b from-[#FFFFFFFF] to-[#ececec69] bg-clip-text text-center text-[48px] font-[500] capitalize leading-[105.52%] tracking-[-0.025em] [text-fill-color:transparent] [-webkit-text-fill-color:transparent] [-webkit-background-clip:_text] lg:max-w-[1024px] lg:text-[84px]">
            Generate your favorite anime characters
          </h1>

          <a href="https://discord.com/api/oauth2/authorize?client_id=1054881371472015370&permissions=8&scope=bot%20applications.commands">
            <Button className=" border-gray-200 px-6 text-[18px] lg:px-12 lg:py-4 lg:text-[20px]">
              Invite to discord
            </Button>
          </a>

          {/* <div className="flex flex-col items-center gap-2">
              <AuthShowcase />
            </div> */}
        </div>
      </main>
      <div className="absolute inset-0 -z-[5] min-h-screen [background:linear-gradient(180deg,#000000_38%,rgba(0,0,0,0)_128%)] " />

      <div
        className="perps absolute inset-0 -z-10 h-screen max-h-screen overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        <div
          className="absolute right-[50%] top-[50%] w-[240vw] columns-5 gap-4 md:w-[180vw] lg:w-[120vw] xl:gap-8" //the gap here should be same as space-y-[] in ImageColumn
          style={{
            transform: "translateX(50%) translateY(-50%) rotateX(36deg)",
          }}
        >
          <ImageColumn offset start={0} end={TOTAL_PHOTOS / 5} />
          <ImageColumn start={TOTAL_PHOTOS / 5} end={(2 * TOTAL_PHOTOS) / 5} />
          <ImageColumn
            offset
            start={(2 * TOTAL_PHOTOS) / 5}
            end={(3 * TOTAL_PHOTOS) / 5}
          />
          <ImageColumn
            start={(3 * TOTAL_PHOTOS) / 5}
            end={(4 * TOTAL_PHOTOS) / 5}
          />
          <ImageColumn
            offset
            start={(4 * TOTAL_PHOTOS) / 5}
            end={(5 * TOTAL_PHOTOS) / 5}
          />
        </div>
      </div>
    </>
  );
};

Home.auth = false;

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
