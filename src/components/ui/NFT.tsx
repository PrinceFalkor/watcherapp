import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSignal } from "@preact/signals-react";
import { Skeleton } from "./skeleton";
import clsx from "clsx";
import { pNFT } from "@/types";
import axios from "axios";
import styles from './NFT.module.css';
import { PortfolioValueContext } from '@/components/organisms/PortfolioValueContext';

export default function NFT({ token }: { token: pNFT }) {
  const imageLoaded = useSignal(false);
  const [floorPrice, setFloorPrice] = useState<number | string | null>(null);
  const hasAddedToTotal = useRef(false); // useRef to track if floor price is added to total
  const [nftCost, setNftCost] = useState<number | string | null>(null);
  const [tradeOutcome, setTradeOutcome] = useState('');
  const [tradeOutcomeClass, setTradeOutcomeClass] = useState('');
  const [isAddedToTotal, setIsAddedToTotal] = useState(false); // State to track if added to total
  const { addToTotalValue } = useContext(PortfolioValueContext);

  const handleImageLoad = () => {
    imageLoaded.value = true;
  };

  useEffect(() => {
    const fetchFloorPrice = async () => {
      try {
        const response = await axios.get(`https://api.prod.pallet.exchange/api/v2/nfts/${token.collection.contract_address}`);
        const floor = parseFloat(response.data.floor);
        setFloorPrice(floor);
        if (!isNaN(floor) && !hasAddedToTotal.current) {
          addToTotalValue(floor);
          hasAddedToTotal.current = true; // Mark as added
        }
      } catch (error) {
        console.error("Error fetching floor price:", error);
        setFloorPrice('n/a');
      }
    };

    fetchFloorPrice();
  }, [token.collection.contract_address]); // Removed addToTotalValue from dependencies

  useEffect(() => {
    if (token.last_sale && token.last_sale.amount) {
      const cost = parseInt(token.last_sale.amount, 10) / 1000000;
      setNftCost(cost);
    } else {
      setNftCost(0);
    }
  }, [token.last_sale]);

  useEffect(() => {
    if (typeof nftCost === 'number' && typeof floorPrice === 'number') {
      const profit = floorPrice - nftCost;
      const percentageChange = (profit / (nftCost || 1)) * 100;

      if (profit > 0) {
        setTradeOutcome(`Chad +${profit.toFixed(2)} SEI (+${Math.abs(percentageChange).toFixed(2)}%)`);
        setTradeOutcomeClass(styles.chad);
      } else if (profit < 0) {
        setTradeOutcome(`Chump ${profit.toFixed(2)} SEI (-${Math.abs(percentageChange).toFixed(2)}%)`);
        setTradeOutcomeClass(styles.chump);
      } else {
        setTradeOutcome(`Even 0 SEI (0%)`);
        setTradeOutcomeClass(styles.even);
      }
    }
  }, [nftCost, floorPrice]); // Calculate trade outcome based on nftCost and floorPrice

  return (
      <div className="h-full w-full flex flex-col items-center gap-2">
        <div className="w-full aspect-square relative">
          <Skeleton className={clsx(imageLoaded.value && `hidden`, `absolute top-0 w-full h-full z-10 rounded-md`)} />
          <img src={token.image} alt={token.name} className={clsx(!imageLoaded.value && `opacity-0`, `h-full w-full rounded-md`)} onLoad={handleImageLoad} />
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