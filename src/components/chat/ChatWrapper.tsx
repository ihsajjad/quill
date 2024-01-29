"use client";
import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface LoadingContentProps {
  title: string;
  desc: string;
}

const LoadingContent = ({ title, desc }: LoadingContentProps) => {
  return (
    <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
      <div className="flex-1 flex flex-col items-center justify-center mb-28">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <h2 className="font-semibold text-xl">{title}</h2>
          <p className="text-zinc-500 text-sm">{desc}</p>
        </div>
      </div>

      <ChatInput isDisabled />
    </div>
  );
};

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: ({ state }) => {
        return state.data?.status === "SUCCESS" ||
          state.data?.status === "FAILED"
          ? false
          : 500;
      },
    },
  );

  // data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
  if (isLoading) {
    return (
      <LoadingContent title="Loading..." desc="We're preparing your PDF" />
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <LoadingContent title="Processing PDF..." desc="This won't take long." />
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex flex-col items-center justify-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h2 className="font-semibold text-xl">Too many pages in PDF</h2>
            <p className="text-zinc-500 text-sm">
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF.
            </p>

            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="h-3 w-3 mr-1.5" /> Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between divide-y divide-zinc-200 gap-2">
      <div className="flex-1 flex flex-col justify-between mb-28">
        <Messages />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatWrapper;
