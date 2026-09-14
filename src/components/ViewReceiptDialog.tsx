import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import config from "@/config";
interface Props {
  billId: string;
}
export const ViewReceiptDialog = ({ billId }: Props) => {
  const [open, setOpen] = useState(false);
  const receiptUrl = `${config.baseUrl}/bills/${billId}/receipt`;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          {open && (
            <iframe
              src={receiptUrl}
              title="Receipt"
              className="w-full h-full rounded-md border"
            />
          )}
        </div>
        <Button asChild variant="outline" className="w-full">
          <a
            href={`${receiptUrl}?download=true`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
