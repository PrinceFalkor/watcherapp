import React, { useEffect, useState } from 'react';
import { useSignal } from "@preact/signals-react";
import { Skeleton } from "./skeleton";
import clsx from "clsx";
import { pNFT } from "@/types";
import axios from "axios";
import styles from './NFT.module.css'; // Ensure the import path is correct

export default function NFT({ token }: { token: pNFT }) {
  const imageLoaded = useSignal(false);
  const [floorPrice, setFloorPrice] = useState<number | string | null>(null);
  const [nftCost, setNftCost] = useState<number | string | null>(null);
  const [tradeOutcome, setTradeOutcome] = useState('');
  const [tradeOutcomeClass, setTradeOutcomeClass] = useState('');

  const handleImageLoad = () => {
    imageLoaded.value = true;
  };

  useEffect(() => {
    const fetchFloorPrice = async () => {
      try {
        const response = await axios.get(`https://api.prod.pallet.exchange/api/v2/nfts/${token.collection.contract_address}`);
        setFloorPrice(parseFloat(response.data.floor));
      } catch (error) {
        console.error("Error fetching floor price:", error);
        setFloorPrice('n/a');
      }
    };

    fetchFloorPrice();

    // Adjusted to handle cost of 0 as a normal calculation
    const cost = token.last_sale && token.last_sale.amount
        ? parseInt(token.last_sale.amount, 10) / 1000000
        : 0;
    setNftCost(cost);

    // Calculate trade outcome, including handling cost of 0
    if (typeof nftCost === 'number' && typeof floorPrice === 'number') {
      const profit = floorPrice - nftCost;
      const percentageChange = (profit / (nftCost || 1)) * 100; // Avoid division by zero

      if (profit > 0) {
        setTradeOutcome(`Chad +${profit.toFixed(2)} SEI (+${Math.abs(percentageChange).toFixed(2)}%)`);
        setTradeOutcomeClass(styles.chad);
      } else if (profit < 0) {
        setTradeOutcome(`Chump ${profit.toFixed(2)} SEI (-${Math.abs(percentageChange).toFixed(2)}%)`);
        setTradeOutcomeClass(styles.chump);
      } else {
        // Handles the case when cost is 0 and floorPrice is 0 as "Even"
        setTradeOutcome(`Even 0 SEI (0%)`);
        setTradeOutcomeClass(styles.even);
      }
    }
  }, [token.collection.contract_address, token.last_sale, nftCost, floorPrice]);

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
            <p className="text-sm text-left w-full">Floor Price: {floorPrice ? `${floorPrice} SEI` : 'Loading...'}</p>
            <p className="text-sm text-left w-full">Cost: {typeof nftCost === 'number' ? `${nftCost} SEI` : 'n/a'}</p>
            <p className={`${styles.tradeOutcome} ${tradeOutcomeClass}`}>{tradeOutcome}</p>
          </div>
        </div>
      </div>
  );
}
