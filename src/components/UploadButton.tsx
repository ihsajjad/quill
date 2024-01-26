"use client";
import { trpc } from "@/app/_trpc/client";
import { storage } from "@/lib/firebase/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Cloud, File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DropZone from "react-dropzone";
import { v4 as uuid } from "uuid";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { useToast } from "./ui/use-toast";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const UploadDropZone = () => {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState<boolean>(true);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const { toast } = useToast();
    const utils = trpc.useUtils();

    const startSimulatedProgress = () => {
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((previousProgress) => {
          if (previousProgress >= 95) {
            clearInterval(interval);
            return previousProgress;
          }

          return previousProgress + 5;
        });
      }, 500);

      return interval;
    };

    const { mutate: uploadFile } = trpc.uploadFile.useMutation({
      onSuccess: (file) => {
        if (file) {
          // utils.uploadFile.invalidate();
          return router.push(`/dashboard/${file.id}`);
        }
      },
    });

    // todo: make the modal bg blur
    return (
      <DropZone
        multiple={false}
        onDrop={async (acceptedFile) => {
          const key = uuid();
          const fileType = acceptedFile[0].type.split("/")[1];
          const name = acceptedFile[0].name.split(" ").join("_");

          if (fileType !== "pdf") {
            return toast({
              title: "Wrong file extention",
              description: "The file should be in pdf format",
              variant: "destructive",
            });
          }

          setIsUploading(true);
          const progressInterval = startSimulatedProgress();

          const fileRef = ref(storage, `${key}-file`); // firebase storage to store license img
          // Uploading the file image to storage
          const fileTask = await uploadBytesResumable(fileRef, acceptedFile[0]);
          const url = await getDownloadURL(fileTask.ref);

          if (url) {
            clearInterval(progressInterval);
            setUploadProgress(100);
            uploadFile({ key, name, url });
          }
        }}
      >
        {({ getInputProps, getRootProps, acceptedFiles }) => (
          <div
            {...getRootProps()}
            className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
          >
            <div className="flex items-center justify-center w-full h-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                  <p className="mb-2 text-sm text-zinc-700">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
                </div>

                {acceptedFiles && acceptedFiles[0] ? (
                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 ">
                    <div className="px-3 py-2 h-full grid place-items-center">
                      <File className="h-4 w-4 text-blue-500" />
                    </div>

                    <div className="px-3 py-2 h-full text-sm truncate">
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                ) : null}

                {/* loading elements */}

                {isUploading ? (
                  <div className="w-full mt-4 max-w-xs mx-auto">
                    <Progress
                      value={uploadProgress}
                      className="h-1 w-full bg-zinc-200"
                    />
                  </div>
                ) : null}

                {/* <input
                  {...getInputProps()}
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                /> */}
              </label>
            </div>
          </div>
        )}
      </DropZone>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(p: boolean) => {
        if (!p) setIsOpen(p);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropZone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
