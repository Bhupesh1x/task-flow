import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { Card, CardHeader } from "@/components/ui/card";

type Props = {
  title: string;
  variant: "up" | "down";
  value: number;
  increaseValue: number;
};

export function AnalyticsCard({ title, variant, value, increaseValue }: Props) {
  const textColor = variant === "up" ? "text-emerald-500" : "text-red-500";

  return (
    <Card className="flex-1 min-w-[200px]">
      <CardHeader>
        <div className="flex items-center gap-x-2">
          <p className="text-base text-muted-foreground truncate" title={title}>
            {title}
          </p>
          <div className="flex items-center">
            {increaseValue > 0 ? (
              <FaCaretUp className={textColor} />
            ) : (
              <FaCaretDown className={textColor} />
            )}
            <p className={textColor}>{increaseValue}</p>
          </div>
        </div>
        <p>{value}</p>
      </CardHeader>
    </Card>
  );
}
