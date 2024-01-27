import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Document, Page } from "react-pdf";

interface PdfRendererProps {
  PdfUrl: string;
}

const PdfFullScreen = ({ PdfUrl }: PdfRendererProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>();

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[calc(100vw-10px)]">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() =>
                toast({
                  title: "Error loading pdf",
                  description: " Please try again later",
                  variant: "destructive",
                })
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={PdfUrl}
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width ? width : 1}
                  pageNumber={i + 1}
                ></Page>
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
