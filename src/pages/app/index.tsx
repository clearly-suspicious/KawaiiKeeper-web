import { useSession } from "next-auth/react";
import React from "react";

import Header from "../../components/Header";
import ImageCard from "../../components/ImageCard";
import { api } from "../../utils/api";
import { shuffle } from "../../utils/helpers";

const App = () => {
  const { data: sessionData } = useSession();
  const getPopularPhotos = api.photos.getMostLikedPhotos.useQuery({
    limit: 16,
  });

  return (
    <>
      <Header sessionData={sessionData} />
      <main className="bg-[#070707] px-5 text-white">
        <section className="container mx-auto flex min-h-screen w-full flex-col py-12 ">
          <div className=" w-full">
            <div className="mb-12">
              <h1 className=" text-[56px] font-bold">Spotlight</h1>
              <p className="text-[18px] font-semibold text-gray-500">
                Most liked generations
              </p>
            </div>
            <div className="w-full columns-1 gap-10 space-y-6 sm:columns-2 md:columns-3 lg:columns-4">
              {getPopularPhotos.data &&
                shuffle(getPopularPhotos.data.data.slice(0, 12)).map(
                  (photo) => (
                    <ImageCard
                      key={photo.id}
                      loading={getPopularPhotos.isLoading}
                      photo={photo}
                    />
                  )
                )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

App.auth = true;

export default App;
