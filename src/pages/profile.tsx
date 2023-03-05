import { Collection, Photo } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import BuyTokenDialog from "../components/BuyTokenDialog";
import Header from "../components/Header";
import ImageCard from "../components/ImageCard";
import Tabs from "../components/Tabs";
import { api } from "../utils/api";

function generateLightColorHex() {
  let color = "#";
  for (let i = 0; i < 3; i++)
    color += (
      "0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)
    ).slice(-2);
  return color;
}

const CollectionCard = ({
  collection,
}: {
  collection: Collection & { photos: Photo[] };
}) => {
  const randomLightColor = useMemo(
    () => generateLightColorHex(),
    [collection.id]
  );
  return (
    <div className='relative flex h-full w-full max-w-[512px] flex-col space-y-4'>
      <div className='relative aspect-square w-full overflow-hidden rounded-xl'>
        {collection.photos[0] ? (
          <Image
            src={collection.photos[0].url as string}
            fill
            alt={collection.photos[0].prompt + " image"}
          />
        ) : (
          <div className='h-full w-full rounded-xl border' />
        )}
      </div>
      <div className='grid w-full grid-cols-3 gap-4'>
        {collection.photos[1] ? (
          <div className='relative aspect-square w-full overflow-hidden rounded-xl'>
            <Image
              src={collection.photos[1].url as string}
              fill
              alt={collection.photos[1].prompt + " image"}
            />{" "}
          </div>
        ) : (
          <div className='aspect-square w-full rounded-xl border' />
        )}
        {collection.photos[2] ? (
          <div className='relative aspect-square w-full overflow-hidden rounded-xl'>
            <Image
              src={collection.photos[2].url as string}
              fill
              alt={collection.photos[2].prompt + " image"}
            />{" "}
          </div>
        ) : (
          <div className='aspect-square w-full rounded-xl border' />
        )}
        {collection.photos.length > 3 ? (
          <div
            style={{
              backgroundColor: `${randomLightColor}`,
            }}
            className='grid place-items-center rounded-xl text-[20px] font-semibold text-gray-800'
          >
            +{collection.photos.length - 3}
          </div>
        ) : collection.photos[3] ? (
          <div className='relative aspect-square w-full overflow-hidden rounded-xl'>
            <Image
              src={collection.photos[3].url as string}
              fill
              alt={collection.photos[3].prompt + " image"}
            />{" "}
          </div>
        ) : (
          <div className='aspect-square w-full rounded-xl border' />
        )}
      </div>
      <div className='font-semibold text-gray-200'>{collection.name}</div>
    </div>
  );
};

const Profile = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();
  const userPhotos = api.photos.getPhotosByUser.useInfiniteQuery(
    { limit: 16 },
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
    }
  );
  const userCollections = api.collections.getCollectionsByUser.useQuery({});
  const createCollection = api.collections.insertNewCollection.useMutation();
  const getTokens = api.payments.checkEligibility.useQuery({
    transactionType: "TXT2IMG",
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && userPhotos.hasNextPage) {
      userPhotos.fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <Header
        sessionData={sessionData}
        rightButtons={[
          sessionData
            ? { children: <> Go to App </>, onClick: () => router.push("/app") }
            : undefined,
        ]}
      />

      <main className='relative grid w-full place-items-center overflow-hidden bg-[#070707] px-5'>
        <section className='container mx-auto flex min-h-screen w-full flex-col py-12 '>
          <div className='mb-12 w-full'>
            <div className='mb-8 flex flex-col justify-between space-x-4  sm:flex-row sm:items-center'>
              <h1 className='max-w-[85vw] overflow-hidden overflow-ellipsis whitespace-nowrap text-[42px] font-bold text-gray-200 sm:max-w-[70vw] sm:text-[56px]'>
                {sessionData?.user?.name}
              </h1>
              <div className=' flex items-center '>
                <p className='mr-4 text-gray-300'>
                  {getTokens.data ? getTokens.data.tokens : 0}
                </p>
                <BuyTokenDialog discordId={sessionData?.user?.discordId} />
              </div>
            </div>
            <Tabs
              tabs={[
                {
                  title: (
                    <>
                      <div className='flex items-center space-x-2'>
                        <span>Generations</span>
                        <span className='min-w-[24px] rounded-lg bg-pink-300 py-0.5 px-1 text-black'>
                          {userPhotos.data
                            ? userPhotos.data.pages[0]?.pagination.totalCount
                            : 0}
                        </span>
                      </div>
                    </>
                  ),
                  content: (
                    <>
                      <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {userPhotos.data && (
                          <>
                            {userPhotos.data.pages.map((group, i) =>
                              group.data.map((photo: any) => (
                                <ImageCard
                                  key={photo.id}
                                  loading={userPhotos.isLoading}
                                  photo={photo}
                                  collections={userCollections.data?.data}
                                />
                              ))
                            )}
                          </>
                        )}
                      </div>
                    </>
                  ),
                },
                {
                  title: (
                    <>
                      <div className='flex items-center space-x-2'>
                        <span>Collections</span>
                        <span className='min-w-[24px] rounded-lg bg-blue-300 py-0.5 px-1 text-black'>
                          {userCollections.data
                            ? userCollections.data.data.length
                            : 0}
                        </span>
                      </div>
                    </>
                  ),
                  value: "tab2",
                  content: (
                    <>
                      <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {userCollections.data &&
                          userCollections.data.data.map((collection) => (
                            <CollectionCard
                              key={collection.id}
                              collection={
                                collection as Collection & { photos: Photo[] }
                              }
                            />
                          ))}
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </div>
          {/* Load more when this gets seen */}
          <div ref={ref} />
        </section>
      </main>
    </>
  );
};

Profile.auth = true;

export default Profile;
