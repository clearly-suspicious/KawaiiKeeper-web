import React from "react";

import { api } from "../../utils/api";

type Props = {
  content: any;
};

const PrintObject = ({ content }: Props) => {
  // const formattedContent: string = JSON.stringify(content, null, 2);
  const GOAL_AMOUNT = 5000;
  const totalDonated = api.payments.aggregateDonations.useQuery();

  return (
    <>
      <div className="block max-w-lg rounded-lg border border-gray-700 bg-black p-6  shadow backdrop-blur-sm ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          We appreciate your donation of&nbsp;{" "}
          <span className="text-yellow-400">
            {content.amount_total / 100} ${" "}
          </span>
        </h5>
        <p className="font-normal text-gray-400">
          Thank you for your valuable contribution{" "}
          <span className="text-red-400">
            {content.customer_details?.name}.
          </span>{" "}
          Your donation is an investment in our community's passion for anime.
          Your support helps KawaiiKeeper to continue to bring new and
          innovative features, making it the best it can be. We can't thank you
          enough for your generosity.
        </p>
      </div>

      {/* <pre>{formattedContent}</pre> */}
    </>
  );
};

export default PrintObject;
