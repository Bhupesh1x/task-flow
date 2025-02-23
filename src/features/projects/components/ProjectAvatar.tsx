import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
};

export const ProjectAvatar = ({
  name,
  image,
  className,
  fallbackClassName,
}: Props) => {
  if (image) {
    return (
      <div
        className={`relative size-5 rounded-md overflow-hidden flex-shrink-0 ${className}`}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  } else {
    return (
      <Avatar className={`rounded-md size-5 ${className}`}>
        <AvatarFallback
          className={`bg-blue-500 font-semibold text-sm text-white uppercase rounded-md flex ${fallbackClassName}`}
        >
          {name?.[0] || "P"}
        </AvatarFallback>
      </Avatar>
    );
  }
};
