"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  // todo: fix the trpc onsuccess and onerror

  // trpc.authCallback.useQuery(undefined, {
  //   // onSuccess: ({ success }: { success: Boolean }) => {
  //   //   console.log(success);
  //   //   if (success) {
  //   //     router.push(origin ? `/${origin}` : "/dashboard");
  //   //   }
  //   // },
  //   onError: (err: any) => {
  //     console.log(err);
  //     if (err.data?.code === "UNAUTHORIZED") {
  //       console.log(err);
  //       router.push("/sign-in");
  //     }
  //   },
  //   retry: true,
  //   retryDelay: 500,
  // });

  const { data, failureReason } = trpc.authCallback.useQuery(undefined, {});
  
  if (data?.success) {
   return  router.push(origin ? `/${origin}` : "/dashboard");
  }
  if (failureReason?.data?.code === "UNAUTHORIZED") {
   return router.push("/sign-in");
  }

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
