"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axios from 'axios';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ExclamationTriangleIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Separator } from "@/components/ui/separator";

import { signal, useSignal } from "@preact/signals-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import clsx from "clsx";
import { apiError, apiResponse } from "@/signals";

const formSchema = z.object({
  address: z.string().min(1).startsWith("sei")
})

export function WalletForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        address: "",
      },
    });
  
    // 2. Define a submit handler. 
    const onSubmit = async (values: any) => {
      // ✅ This will be type-safe and validated.
      console.log(values)
  
      const userAddress = values.address;
  
      const url = `https://api.prod.pallet.exchange/api/v1/user/${userAddress}?network=mainnet&include_tokens=true&include_bids=true`;
  
      try {
        const response = await axios.get(url);
        console.log(response.data);
  
        apiResponse.value = response.data;
        apiError.value = null;
      } catch (error) {
        console.error(error);
        apiError.value = true;
        apiResponse.value = null;
      }
    }
  
    return (
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 w-full">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>SEI Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="sei1ekrw0v9xvt48rx6ehgxgjhluheag2x3szcdjh0" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="gap-1 mt-8" type="submit">
              <MagnifyingGlassIcon />
              Find
            </Button>
          </form>
        </Form>
      </div>
    )
  }