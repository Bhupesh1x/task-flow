import { Loader2 } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
};

export default DashboardLoading;
