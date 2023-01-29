import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import Button from "../components/base/Button";
import Header from "../components/Header";
import PrintObject from "../components/stripe/PrintObject";
import { fetchGetJSON } from "../utils/api-helpers";

const ResultPage: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

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
    <>
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

      <main className="relative grid w-full place-items-center overflow-hidden bg-[#070707] px-5">
        <section className="container mx-auto flex min-h-screen w-full flex-col py-12 ">
          <div className="container mx-auto text-white">
            <div className="prose prose-invert">
              <h1 className="pt-4 text-gray-200">Payment Result</h1>
              <h2 className="mb-4 text-emerald-300">
                Status: {data?.payment_intent?.status ?? "loading..."}
              </h2>
            </div>
            {data && <PrintObject content={data} />}
          </div>
        </section>
      </main>
    </>
  );
};

export default ResultPage;
