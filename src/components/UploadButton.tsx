"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

      <DialogContent>hellow</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
