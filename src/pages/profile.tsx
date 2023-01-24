import { NextPage } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";

import Header from "../components/Header";
import ImageCard from "../components/ImageCard";
import Tabs from "../components/Tabs";
import { api } from "../utils/api";

const Profile: NextPage = () => {
  const { data: sessionData } = useSession();
  const userPhotos = api.photos.getPhotosByUser.useQuery({ limit: 12 });
  const userCollections = api.collections.getCollectionsByUser.useQuery();
  const createCollection = api.collections.insertNewCollection.useMutation();

  return (
    <>
      <Header sessionData={sessionData} />
      <main className="relative grid w-full place-items-center overflow-hidden bg-[#070707] px-5">
        <section className="container mx-auto flex min-h-screen w-full flex-col py-12 ">
          <div className=" w-full">
            <div className="mb-12">
              <h1 className="text-[56px] font-bold text-gray-200">
                {sessionData?.user?.name}
              </h1>
              <Tabs
                tabs={[
                  {
                    title: (
                      <>
                        <div className="flex items-center space-x-2">
                          <span>Generations</span>
                          <span className="rounded-lg bg-pink-300 py-0.5 px-1 text-black ">
                            {userPhotos.data ? userPhotos.data.data.length : 0}
                          </span>
                        </div>
                      </>
                    ),
                    content: (
                      <>
                        <div className="w-full columns-1 gap-10 space-y-6 sm:columns-2 md:columns-3 lg:columns-4">
                          {userPhotos.data &&
                            userPhotos.data.data.map((photo: any) => (
                              <ImageCard
                                key={photo.id}
                                loading={userPhotos.isLoading}
                                photo={photo}
                              />
                            ))}
                        </div>
                      </>
                    ),
                  },
                  {
                    title: "Collections",
                    value: "tab2",
                    content: (
                      <>
                        <div className="mb-12"></div>
                        <div className="w-full columns-1 gap-10 space-y-6 text-white sm:columns-2 md:columns-3 lg:columns-4">
                          <Image
                            className="cursor-pointer text-white"
                            onClick={() => {
                              // TODO: Vinay write css/ui to take input somewhere and create a new collection pls
                              createCollection.mutate({
                                name: "Favs Collection",
                              });
                            }}
                            width={120}
                            height={120}
                            src="\images\create-collection.svg"
                            alt="Create Collection"
                          />
                          {userCollections.data &&
                            userCollections.data.map((collection) => (
                              // TODO: Vinay display this in card or someshit
                              <li key={collection.id}>{collection.name}</li>
                            ))}
                        </div>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Profile;
