import { NextPage } from "next";
import { useSession } from "next-auth/react";

import Header from "../components/Header";
import CheckoutForm from "../components/stripe/CheckoutForm";

const Donate: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Header sessionData={sessionData} />
      <main className="bg-[#070707] px-5 text-white">
        <section className="container mx-auto flex min-h-screen w-full flex-col py-12 ">
          <div className=" w-full">
            <div className="mb-12">
              <h1 className=" text-[56px] font-bold">
                Donate to our project 💖
              </h1>
              <p className="text-[18px] font-semibold text-gray-500">
                Your support for us through donations allows Kawaii Keeper to
                continue to improve and enhance our bot for everyone to enjoy.
                Your contribution is greatly appreciated and helps keep the bot
                running. Thank you for considering a donation.
              </p>
              <CheckoutForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Donate;
