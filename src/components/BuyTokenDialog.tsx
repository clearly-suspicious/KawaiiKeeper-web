import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import Button from "./base/Button";
import { Dialog } from "./base/Dialog";
import Sparkles from "./svgs/Sparkles";
import { fetchPostJSON } from "../utils/api-helpers";
import getStripe from "../utils/get-stripejs";

const BuyTokenDialog = ({
  title = "Support Kawaii Keeper",
  subtitle = "Thank you for considering buying tokens to support the project. 25 tokens = $1. You can use 1 token to generate a random prompt.",
  trigger = (
    <Button
      className="border-[#A38A4C] hover:border-[#443C26] hover:bg-[#443C26]"
      type="button"
    >
      <div className="flex items-center space-x-1 text-[#F8CD7B]">
        <div>Buy tokens</div>
        <Sparkles className="w-5" />
      </div>
    </Button>
  ),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    if (!data) return;
    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout_sessions", {
      cart: [
        {
          name: "Support Kawaii Keeper",
          price: data.customAmount ? data.customAmount : data.amount,
        },
      ],
      currentUrl: window.location.pathname,
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
  };

  type RadioTextCardProps = {
    text: string;
    value: number | string;
    name: string;
  };
  const RadioTextCard = ({ text, value, name }: RadioTextCardProps) => {
    return (
      <div className="min-w-[42px] ">
        <input
          type="radio"
          id={"RadioTextCard-" + value}
          value={value}
          className="peer hidden"
          {...register(name)}
        />
        <label
          htmlFor={"RadioTextCard-" + value}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-600 bg-black p-2 text-gray-200 hover:bg-gray-900 hover:text-gray-300 peer-checked:border-[#A38A4C] peer-checked:text-[#A38A4C]"
        >
          <div className="block">{text}</div>
        </label>
      </div>
    );
  };

  return (
    <Dialog
      title={title}
      subtitle={subtitle}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={trigger}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex  flex-col text-gray-200"
      >
        <div className="mb-8 mt-4 flex flex-col items-center space-x-2 space-y-2 sm:flex-row sm:space-y-0">
          <div className="flex items-center space-x-2">
            <RadioTextCard name="amount" text="$2" value={2} />
            <RadioTextCard name="amount" text="$5" value={5} />
            <RadioTextCard name="amount" text="$10" value={10} />
          </div>

          <div className="relative h-full w-full min-w-[200px]">
            <input
              {...register("customAmount")}
              type="number"
              className="font-sans text-blue-gray-700 disabled:bg-blue-gray-50 placeholder-shown::border-t-gray-200 peer h-full min-h-[42px] w-full rounded-[7px] border border-gray-200 border-t-transparent bg-transparent  px-3 py-2.5 text-sm font-normal outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-600 focus:border-2 focus:border-[#F8CD7B] focus:border-t-transparent focus:outline-0 disabled:border-0"
              placeholder=" "
            />
            <label className="before:content[' '] after:content[' '] text-blue-gray-400 peer-placeholder-shown:text-blue-gray-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500 pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-gray-600 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-gray-600 peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-[#F8CD7B] peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-[#F8CD7B] peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-[#F8CD7B] peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent">
              Custom amount
            </label>
          </div>
        </div>
        <div className="flex space-x-2 self-end">
          <Button
            onClick={() => setIsOpen(false)}
            className="border-red-800 text-red-500 hover:border-red-600 hover:bg-red-900 hover:text-gray-100"
          >
            Cancel
          </Button>
          <Button type="submit">Take my money</Button>
        </div>
      </form>
    </Dialog>
  );
};

export default BuyTokenDialog;
