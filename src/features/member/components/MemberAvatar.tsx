import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  name: string;
  className?: string;
  fallbackClassName?: string;
};

export const MemberAvatar = ({ name, className, fallbackClassName }: Props) => {
  return (
    <Avatar className={`rounded-md size-10 ${className}`}>
      <AvatarFallback
        className={`bg-neutral-300 font-semibold text-lg text-white uppercase rounded-full ${fallbackClassName}`}
      >
        {name?.[0] || "M"}
      </AvatarFallback>
    </Avatar>
  );
};
