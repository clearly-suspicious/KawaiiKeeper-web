import { Collection, Interaction, Photo } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

import Button from "./base/Button";
import Dropdown from "./HoverDropdown";
import { api } from "../utils/api";

export type ImageCardType = {
  loading: boolean;
  photo?: Photo & { interactions: Interaction[] };
  collections?: Collection[];
};

const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={clsx("h-5 w-5 stroke-gray-400", className)}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
    />
  </svg>
);

const EliipsesVerticalIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={clsx("h-5 w-5 stroke-gray-400", className)}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
    />
  </svg>
);

const ImageCard = ({ loading, photo, collections }: ImageCardType) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const isIlikedByCurrentUser =
    photo?.interactions.filter((interaction) => interaction.type === "LIKE")
      .length !== 0;
  const isSavedByCurrentUser =
    photo?.interactions.filter((interaction) => interaction.type === "SAVE")
      .length !== 0;
  const [liked, setLiked] = React.useState(isIlikedByCurrentUser);
  const [saved, setSaved] = React.useState(isSavedByCurrentUser);

  React.useEffect(() => {
    if (saved !== isSavedByCurrentUser) setSaved(isSavedByCurrentUser);
  }, [isSavedByCurrentUser]);

  React.useEffect(() => {
    if (liked !== isIlikedByCurrentUser) setLiked(isIlikedByCurrentUser);
  }, [isIlikedByCurrentUser]);

  const utils = api.useContext();
  const savePhotoMutation = api.collections.insertPhotoToCollection.useMutation(
    {
      onSuccess: (input) => {
        utils.collections.invalidate();
        utils.photos.invalidate();
      },
    }
  );
  const removePhotoMutation =
    api.collections.removePhotoFromCollection.useMutation({
      onSuccess: (input) => {
        utils.collections.invalidate();

        utils.photos.invalidate();
      },
    });

  const likeMutation = api.photos.likePhoto.useMutation({
    onSuccess: (input) => {
      utils.photos.invalidate();
    },
  });

  if (loading || !photo) {
    return (
      <div
        role="status"
        className="animate-pulse space-y-8 md:flex md:items-center md:space-y-0 md:space-x-8"
      >
        <div className="flex aspect-square w-full items-center justify-center rounded bg-gray-300 dark:bg-gray-700 sm:w-96">
          <svg
            className="h-12 w-12 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  return (
    <div
      className="flex w-full break-inside-avoid-column flex-col"
      key={photo.id}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute inset-0 z-[1] flex flex-col justify-between p-2  ${
            isHovered ? "" : "hidden"
          }`}
        >
          <Button className="aspect-square min-h-0 self-end rounded-full border-0 bg-[rgba(0,0,0,0.6)] px-1 lg:px-1">
            <EliipsesVerticalIcon className="w-6 stroke-white" />
          </Button>
          {photo.prompt && (
            <div className="w-full rounded-xl bg-[rgba(0,0,0,0.6)] p-2 text-[14px] font-[300] text-white backdrop-blur-xl line-clamp-3">
              {photo.prompt}
            </div>
          )}
        </div>
        <Image
          src={photo.url as string}
          fill
          alt={photo.prompt}
          sizes="512px"
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <div
          onClick={() => {
            if (!liked) {
              likeMutation.mutate({
                id: photo.id,
                interaction: "LIKE",
              });
            } else {
              likeMutation.mutate({
                id: photo.id,
                interaction: "UNLIKE",
              });
            }

            setLiked(!liked);
          }}
          className="group  flex cursor-pointer items-center"
        >
          <div
            className={`${liked && ""}  ${
              liked
                ? "animate-heart-burst [background-position:right]"
                : "[background-position:32px_50%]"
            } relative ml-[-16px] mt-[1px] h-12 w-12 bg-no-repeat [background-image:url('https://abs.twimg.com/a/1446542199/img/t1/web_heart_animation.png')]  [background-size:2900%] `}
          >
            <div className="absolute inset-0 grid place-items-center">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`h-5 w-5  group-hover:fill-red-600 ${
                  liked ? "fill-transparent" : "fill-gray-500"
                }`}
              >
                <g>
                  <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                </g>
              </svg>
            </div>
          </div>

          <p className="ml-[-10px] text-[14px] text-gray-400 group-hover:text-red-400">
            {photo.likes}
          </p>
        </div>

        {collections && (
          <Dropdown
            trigger={
              <button
                className="group"
                onClick={() => {
                  if (collections[0]) {
                    if (saved) {
                      removePhotoMutation.mutate({
                        photoId: photo.id,
                        collectionId: collections[0].id,
                      });
                    } else {
                      savePhotoMutation.mutate({
                        photoId: photo.id,
                        collectionId: collections[0].id,
                      });
                    }

                    setSaved((saved) => !saved);
                  }
                }}
              >
                <BookmarkIcon
                  className={`transition-all duration-200 group-hover:stroke-white ${
                    saved ? "fill-white stroke-transparent" : ""
                  }`}
                />
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ImageCard;
