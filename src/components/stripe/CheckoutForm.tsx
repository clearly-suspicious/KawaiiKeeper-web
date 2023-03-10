import React, { useState } from "react";

import * as config from "../../stripe-config";
import { fetchPostJSON } from "../../utils/api-helpers";
import getStripe from "../../utils/get-stripejs";

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
  });

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout_sessions", {
      cart: [
        {
          name: "Support Kawaii Keeper",
          price: input.customDonation,
        },
      ],
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
    setLoading(false);
  };

  return (
    <>
      <main className="bg-[#070707] px-5 text-white">
        <section className="container mx-auto flex min-h-screen w-full flex-col py-12 ">
          <div className=" w-full">
            <form onSubmit={handleSubmit}>
              {/* <CustomDonationInput
                className="checkout-style block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-black text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                name="customDonation"
                value={input.customDonation}
                min={config.MIN_AMOUNT}
                max={config.MAX_AMOUNT}
                step={config.AMOUNT_STEP}
                currency={config.CURRENCY}
                onChange={handleInputChange}
              /> */}
              {/* <StripeTestCards /> */}
              <button
                className="checkout-style-background"
                type="submit"
                disabled={loading}
              >
                {/* Donate{" "}
                {formatAmountForDisplay(input.customDonation, config.CURRENCY)} */}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default CheckoutForm;
