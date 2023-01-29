import { NextPage } from "next";
import { useSession } from "next-auth/react";

import Header from "../components/Header";

const Donate: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Header sessionData={sessionData} />
      <main className="bg-[#070707] px-5 text-white">
        <section className="container mx-auto flex w-full flex-col py-12 ">
          <div className=" mb-12 w-full">
            <h1 className=" text-[56px] font-bold">Donate to our project 💖</h1>
            <p className="text-[18px] font-semibold text-gray-500">
              Your support for us through donations allows Kawaii Keeper to keep
              running. We haven't decided on the rewards yet but for now we will
              add an equivalent amount of tokens to your account in return for
              your support! Thank you for considering a donation.
            </p>
            {/* <CheckoutForm /> */}
          </div>
        </section>
      </main>
    </>
  );
};

export default Donate;
