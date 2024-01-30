import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { pNFT } from "@/types";
import axios from "axios";

export default function NFTPalletLink({ token }: { token: pNFT }) {
    async function redir() {
        if (typeof window !== "undefined") {
            const contractAddress = token.collection.contract_address;

            const url = `https://api.prod.pallet.exchange/api/v1/nfts/${contractAddress}?get_tokens=false`;

            const response = await axios.get(url);
            console.log(response.data);

            const collectionName: string = response.data.name;
            const collectionSlug = collectionName.replace(" ", "-").toLowerCase();

            const link: string = `https://pallet.exchange/collection/${collectionSlug}/${token.id}`;
            
            const w = window.open(link, '_blank');
            if (w) {
                w.focus(); // okay now
            }
        }
    }

    return (
        <Button onClick={redir} variant={"ghost"} className="p-3">
            <OpenInNewWindowIcon className="w-4 h-4" />
        </Button>
    )
}