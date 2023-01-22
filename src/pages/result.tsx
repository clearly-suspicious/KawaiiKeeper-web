import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

import PrintObject from "../components/stripe/PrintObject";
import { fetchGetJSON } from "../utils/api-helpers";

const ResultPage: NextPage = () => {
  const router = useRouter();

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  if (error) return <div>failed to load</div>;

  return (
    <div className="container mx-auto text-white">
      <div className="prose prose-invert">
        <h1 className="pt-4 text-emerald-300">Checkout Payment Result</h1>
        <h2 className="text-emerald-300">
          Status: {data?.payment_intent?.status ?? "loading..."}
        </h2>
      </div>
      {data && <PrintObject content={data} />}
    </div>
  );
};

export default ResultPage;
