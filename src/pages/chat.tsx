import { useSession } from "next-auth/react";
import { useState } from "react";

import Header from "../components/Header";

const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [personality, setPersonality] = useState("");
  const [result, setResult] = useState("");
  const { data: sessionData } = useSession();

  async function handleClick(e: any) {
    e.preventDefault();
    console.log(prompt, personality);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        personality,
      }),
    });
    const data = await res.json();
    setResult(data.result);
  }

  return (
    <>
      <Header sessionData={sessionData} />
      <main className="bg-[#070707] px-5 text-white">
        <section className="container mx-auto flex min-h-screen w-full flex-col py-12 ">
          <div className=" w-full">
            <div className="mb-12">
              <h1 className=" text-[56px] font-bold">Chat now</h1>
              <button
                type="button"
                onClick={() => {
                  setPersonality(
                    "Extremely Angry, Egotistic, Impertinent, Rude"
                  );
                }}
                className="mr-2 mb-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Angry
              </button>
              <button
                type="button"
                onClick={() => {
                  setPersonality("Extremely Caring, Loving, Friendly, Kind");
                }}
                className="mr-2 mb-2 rounded-full bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Caring
              </button>
              <button
                type="button"
                onClick={() => {
                  setPersonality(
                    "extremely cold, conceited, impatient, rude, unfriendly, unwelcoming, haughty and nitpicky character"
                  );
                }}
                className="mr-2 mb-2 rounded-full bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Tsundere
              </button>
              <div className="mb-6">
                <label className="mb-2 block pt-4 text-sm font-medium text-gray-900 dark:text-white">
                  Enter your prompt
                </label>
                <input
                  type="text"
                  id="repeat-password"
                  onChange={(e) => setPrompt(e.target.value)}
                  className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
              <button
                onClick={handleClick}
                className="mr-2 mb-2 rounded-full bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Submit
              </button>
              <div className="prose prose-invert">Result: {result}</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

Chat.auth = true;
export default Chat;
