import {
  GoHome,
  GoHomeFill,
  GoCheckCircle,
  GoCheckCircleFill,
} from "react-icons/go";
import Link from "next/link";
import { SettingsIcon, UsersIcon } from "lucide-react";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  return (
    <ul className="flex flex-col">
      {routes.map((route) => {
        const isActive = false;
        const Icon = isActive ? route.activeIcon : route.icon;
        return (
          <Link key={route.href} href={route.href}>
            <li
              className={`flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500 ${
                isActive
                  ? "text-primary bg-white shadow-sm hover:opacity-100"
                  : ""
              }`}
            >
              <Icon className="h-5 w-5 text-neutral-500" />
              {route.label}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};
