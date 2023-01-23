import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { twMerge } from "tailwind-merge";

import Button from "./Button";
import { api } from "../utils/api";

type Props = {
  sessionData?: Session | null;
  rightButtons?: React.ReactElement[];
};

const Sparkles = ({ className }: { className?: string }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 1000 1000"
      enable-background="new 0 0 1000 1000"
      xmlSpace="preserve"
      className={twMerge("h-6 w-6 fill-[#F8CD7B]", className)}
    >
      <g>
        <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
          <path d="M4942.8,4992.4c-18.4-10.2-51-198-98-555.3c-136.8-1051.5-247-1619-408.3-2098.8C4185.4,1593,3817.9,1150,3195.2,843.7C2692.9,594.7,2013,439.5,673.7,265.9C136.7,194.5,100,186.3,100,110.8C100,37.3,136.7,25,520.6-24C2521.4-277.1,3278.9-516,3826-1063.2c534.9-534.9,771.7-1269.9,1018.8-3152.3c71.5-537,79.6-573.7,155.2-573.7s85.8,36.7,145,502.2c249.1,1943.7,483.9,2680.7,1029,3223.8C6721.1-514,7476.5-277.1,9479.4-24C9863.3,25,9900,37.3,9900,110.8c0,75.5-36.7,83.7-573.7,155.2c-1039.2,134.8-1596.6,243-2060,396.1c-767.7,251.1-1216.8,614.5-1525.1,1235.2C5477.8,2426,5328.7,3079.4,5145,4508.5c-40.8,310.3-69.4,473.7-87.8,483.9C5022.5,5014.9,4977.5,5014.9,4942.8,4992.4z" />
        </g>
      </g>
    </svg>
  );
};

const DiscordLoogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      className={twMerge("h-6 w-6 fill-[#FFF]", className)}
    >
      <path d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z" />
    </svg>
  );
};

type ProgressBarProps = {
  progress: number;
  totalProgress: number;
  title?: string;
};
const ProgressBar = ({
  progress,
  totalProgress,
  title = "Monthly Goal",
}: ProgressBarProps) => {
  return (
    <div className="mt-[-2px] flex flex-col">
      <div className="flex justify-between space-x-8 text-[12px] font-light text-[#F8CD7B]">
        <span>{title}</span>
        <span>
          ${progress}/{totalProgress}
        </span>
      </div>
      <div className="relative h-[4px] w-full overflow-hidden rounded-full border border-[#F8CD7B] bg-transparent">
        <div
          className="h-full rounded-full bg-[#F8CD7B] transition-[width] duration-500 ease-in-out"
          style={{ width: `${(progress / totalProgress) * 100}%` }}
        />
      </div>
    </div>
  );
};

const Header = ({ sessionData, rightButtons = [] }: Props) => {
  const router = useRouter();
  const totalDonated = api.payments.aggregateDonations.useQuery();

  return (
    <div className="w-full px-5 lg:px-12">
      <div className="mt-2 flex items-center  justify-between py-6 text-white lg:py-6">
        <Link href="/">
          <div className="text-[18px] lg:text-[24px]">KawaiiKeeper</div>
        </Link>
        <div className="flex items-center">
          <div className="mr-8 hidden items-center space-x-4 sm:flex">
            {rightButtons
              ?.filter((button) => button.type === Button)
              .map((button) => (
                <>{button}</>
              ))}
            <Button
              className="border-[#A38A4C] hover:border-[#443C26] hover:bg-[#443C26]"
              type="button"
              onClick={() => router.push("/donate")}
            >
              <div className="mr-4 flex items-center space-x-1 text-[#F8CD7B]">
                <div>Donate</div>
                <Sparkles className="-5 w-5" />
              </div>
              <ProgressBar
                progress={totalDonated.data ?? 0}
                totalProgress={5000}
                title="3 Month Goal"
              />
            </Button>
          </div>
          {sessionData ? (
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="relative aspect-square w-[32px] overflow-hidden rounded-full md:w-[38px] lg:w-[46px]"
            >
              <Image
                width={1200}
                height={800}
                src={sessionData.user?.image as string}
                alt="avatar"
                className=""
              />
            </button>
          ) : (
            <Button
              className="space-x-2"
              key={1}
              onClick={() => signIn("discord")}
            >
              <DiscordLoogo />
              <span> Log in </span>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-[-1px] h-[1px] w-full bg-[#868686]" />
    </div>
  );
};

export default Header;
