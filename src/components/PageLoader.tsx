import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
    </div>
  );
}
