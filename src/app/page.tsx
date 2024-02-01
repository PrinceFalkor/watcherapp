"use client";

import React from 'react';
import { PortfolioValueProvider, usePortfolioValue } from '@/components/organisms/PortfolioValueContext'; // Ensure the import path is correct
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DiscordLogoIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { Separator } from "@/components/ui/separator";
import { signal, useSignal } from "@preact/signals-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { WalletForm } from "@/components/organisms/WalletForm";
import NFT from "@/components/ui/NFT"; // Adjust the import path as needed
import { getWalletHoldingsApiResponse } from "@/types";
import { apiError, apiResponse } from "../signals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons'
import Link from "next/link";

// Child component to display the total estimated portfolio value
const PortfolioValueDisplay = () => {
    const { totalValue } = usePortfolioValue(); // Using the hook inside a child component

    return (
        <div className="mb-4 text-lg font-bold">Total Estimated Portfolio Value: {totalValue.toFixed(2)} SEI</div>
    );
};

export default function Home() {
    return (
        <PortfolioValueProvider> {/* Wrap your component content with the provider */}
            <main className="flex min-h-screen w-full flex-col items-center">
                <div className="w-full px-8 py-24 flex flex-col items-center gap-16 ">
                    <div className={"flex flex-col gap-3 w-full items-center"}>
                        <h1 className="text-6xl font-bold tracking-wider text-center w-full text-primary">pocket 👀 watcher</h1>
                        <p className="text-lg text-gray-500 text-center w-full">built by sei dragons, version 1.0</p>
                        <div className="flex items-center gap-4">
                            <Link href="https://twitter.com/sei_dragons" target="__blank">
                                <FontAwesomeIcon className="h-5 w-5 fill-black hover:text-primary" icon={faXTwitter} />
                            </Link>
                            <Link href="https://discord.gg/seidragons" target="__blank">
                                <FontAwesomeIcon className="h-6 w-6 fill-black hover:text-primary" icon={faDiscord} />
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[600px]">
                        <WalletForm />
                    </div>
                </div>
                <Separator />
                <div className="p-8 w-full flex flex-col items-center justify-center">
                    {apiError.value && (
                        <Alert variant="destructive">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                An error occurred while trying to get this wallet's holdings. Please try again.
                            </AlertDescription>
                        </Alert>
                    )}
                    {apiResponse.value && (
                        <React.Fragment>
                            <PortfolioValueDisplay /> {/* Display the total portfolio value */}
                            <div className={clsx("grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-3 gap-y-5 w-full")}>
                                {apiResponse.value.nfts &&
                                    apiResponse.value.nfts.map((nft) => (
                                        <NFT key={nft.id} token={nft} />
                                    ))}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </main>
        </PortfolioValueProvider>
    );
}
