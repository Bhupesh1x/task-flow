import { differenceInDays, format } from "date-fns";

type Props = {
  dueDate: string;
  className?: string;
};

export function TaskDate({ dueDate, className }: Props) {
  const todayDate = new Date();
  const taskDate = new Date(dueDate);
  const diffDays = differenceInDays(taskDate, todayDate);

  let textColor = "text-muted-foreground";

  if (diffDays <= 3) {
    textColor = "text-red-500";
  } else if (diffDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={textColor}>
      <span className={`truncate ${className}`}>{format(dueDate, "PPP")}</span>
    </div>
  );
}
