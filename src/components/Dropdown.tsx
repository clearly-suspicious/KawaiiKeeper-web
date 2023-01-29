import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";
import React, { ReactNode } from "react";

import Button from "./Button";

interface RadixMenuItem {
  label: string;
  shortcut?: string;
  icon?: ReactNode;
}

const regionToolMenuItems: RadixMenuItem[] = [
  {
    label: "Frame",
    // icon: <FrameIcon className="mr-2 h-3.5 w-3.5" />,
    shortcut: "⌘+F",
  },
  {
    label: "Crop",
    // icon: <CropIcon className="mr-2 h-3.5 w-3.5" />,
    shortcut: "⌘+S",
  },
];

const DropdownMenu = ({ trigger = <Button>Click me</Button> }: any) => {
  return (
    <div className="relative z-10 inline-block text-left">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger>{trigger}</DropdownMenuPrimitive.Trigger>

        {/* <DropdownMenuPrimitive.Portal> */}
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={5}
          className={clsx(
            "radix-side-bottom:animate-slide-down radix-side-top:animate-slide-up",
            "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56",
            "bg-gray-800"
          )}
        >
          <DropdownMenuPrimitive.Label className="select-none px-2 py-2 text-xs text-gray-700 dark:text-gray-200">
            Region Tools
          </DropdownMenuPrimitive.Label>

          {regionToolMenuItems.map(({ label, icon, shortcut }, i) => (
            <DropdownMenuPrimitive.Item
              key={`${label}-${i}`}
              className={clsx(
                "flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                "text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900"
              )}
            >
              {icon}
              <span className="flex-grow text-gray-700 dark:text-gray-300">
                {label}
              </span>
              {shortcut && <span className="text-xs">{shortcut}</span>}
            </DropdownMenuPrimitive.Item>
          ))}

          {/* <DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" /> */}
        </DropdownMenuPrimitive.Content>
        {/* </DropdownMenuPrimitive.Portal> */}
      </DropdownMenuPrimitive.Root>
    </div>
  );
};

export default DropdownMenu;
