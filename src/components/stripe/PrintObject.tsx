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
      <div className="block max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          We appreciate your donation of&nbsp;{" "}
          <span className="text-yellow-400">
            {content.amount_total / 100} ${" "}
          </span>
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
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
      <h1> OUR GOAL: </h1>
      <div className="relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="rounded-full bg-blue-600 p-0.5 text-center text-xs font-medium leading-none text-blue-100"
          style={{
            width: `${((totalDonated.data ?? 0) / GOAL_AMOUNT) * 100}%`,
          }}
        >
          {Math.round(((totalDonated.data ?? 0) / GOAL_AMOUNT) * 100)} % (
          {totalDonated.data}$/{GOAL_AMOUNT}$)
        </div>
      </div>
      {/* <pre>{formattedContent}</pre> */}
    </>
  );
};

export default PrintObject;
