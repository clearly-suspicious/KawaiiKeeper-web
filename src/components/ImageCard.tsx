import { Interaction, Photo } from "@prisma/client";
import Image from "next/image";
import React from "react";

export type ImageCardType = {
  loading: boolean;
  photo?: Photo & { interactions: Interaction[] };
};

const ImageCard = ({ loading, photo }: ImageCardType) => {
  const isIlikedByCurrentUser = photo?.interactions.length !== 0;
  const [liked, setLiked] = React.useState(isIlikedByCurrentUser);
  if (loading || !photo) {
    return (
      <div
        role="status"
        className="animate-pulse space-y-8 md:flex md:items-center md:space-y-0 md:space-x-8"
      >
        <div className="flex h-48 w-full items-center justify-center rounded bg-gray-300 dark:bg-gray-700 sm:w-96">
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
    <div className="flex w-full flex-col" key={photo.id}>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image src={photo.url as string} fill alt={photo.prompt} />
      </div>
      <div className="flex w-full justify-between">
        <div
          onClick={() => {
            setLiked(!liked);
          }}
          className={`group flex cursor-pointer items-center `}
        >
          <div
            className={`${liked && ""}  ${
              liked
                ? "animate-heart-burst [background-position:right]"
                : "[background-position:left]"
            } ml-[-16px] mt-[1px] h-12 w-12 bg-no-repeat [background-image:url('https://abs.twimg.com/a/1446542199/img/t1/web_heart_animation.png')]  [background-size:2900%] group-hover:[background-position:right]`}
          />
          <p className="ml-[-10px] text-[14px] text-gray-400 group-hover:text-red-400">
            {photo.likes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
