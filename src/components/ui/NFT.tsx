import { useSignal } from "@preact/signals-react";
import { Skeleton } from "./skeleton";
import clsx from "clsx";
import { pNFT } from "@/types";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "./button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NFTPalletLink from "../organisms/NFTPalletLink";

export default function NFT({ token }: { token: pNFT }) {
  const router = useRouter();

  const imageLoaded = useSignal(false);

  const handleImageLoad = () => {
    imageLoaded.value = true;
    console.log("loaded")
  };

  return (
    <div className="h-full w-full flex flex-col items-center gap-2">
      <div className="w-full aspect-square relative">
        <Skeleton className={clsx(imageLoaded.value && `hidden`, `absolute top-0 w-full h-full z-10 rounded-md`)} />
        <img
          src={token.image}
          alt={token.name}
          className={clsx(!imageLoaded.value && `opacity-0`, `h-full w-full rounded-md`)}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex items-center justify-between gap-0 w-full">
        <div className="flex flex-col items-start gap-0 w-full">
          <p className="text-lg text-left w-full font-semibold">{token.name}</p>
          <p className="text-sm text-left w-full font-medium text-gray-700">{token.rarity && token.rarity.rank ? `Rank #${token.rarity.rank}` : `Unranked`}</p>
        </div>
        <NFTPalletLink token={token} />
      </div>
    </div>
  )
}