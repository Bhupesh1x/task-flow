import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  value: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
};

export function EventToolbar({ onNavigate, value }: Props) {
  return (
    <div className="flex items-center justify-between md:justify-start w-full lg:w-auto gap-x-1.5 mb-4">
      <Button
        size="icon"
        variant="secondary"
        onClick={() => onNavigate("PREV")}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input w-full lg:w-auto px-3 py-2 rounded-md justify-center h-8">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(value, "MMMM yyyy")}</p>
      </div>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => onNavigate("NEXT")}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
