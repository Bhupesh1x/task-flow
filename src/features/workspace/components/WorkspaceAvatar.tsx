import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  name: string;
  image?: string;
  className?: string;
};

export const WorkspaceAvatar = ({ name, image, className }: Props) => {
  if (image) {
    return (
      <div
        className={`relative size-10 rounded-md overflow-hidden ${className}`}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  } else {
    return (
      <Avatar className={`rounded-md size-10 ${className}`}>
        <AvatarFallback className="bg-blue-500 font-semibold text-lg text-white uppercase rounded-md">
          {name?.[0] || "W"}
        </AvatarFallback>
      </Avatar>
    );
  }
};
