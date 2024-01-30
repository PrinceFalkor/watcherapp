import { getWalletHoldingsApiResponse } from "@/types";
import { signal } from "@preact/signals-react";

export const apiResponse = signal<null | getWalletHoldingsApiResponse>(null);
export const apiError = signal<any>(false);