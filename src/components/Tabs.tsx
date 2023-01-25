import * as TabsPrimitive from "@radix-ui/react-tabs";
import { clsx } from "clsx";

interface Tab {
  title: React.ReactNode;
  /**
   * If not provided, will be set to the title if the title is a string or to the index of the tab.
   */
  value?: string;
  content: React.ReactNode;
}
type TabsProps = {
  tabs: Tab[];
};

const Tabs = ({ tabs }: TabsProps) => {
  const internalTabs = tabs.map((tab, i) => {
    if (typeof tab.value === "undefined") {
      if (typeof tab.title === "string") {
        return { ...tab, value: tab.title };
      }
      return { ...tab, value: String(i) };
    }
    return tab;
  });
  return (
    <TabsPrimitive.Root defaultValue={internalTabs[0]?.value ?? "0"}>
      <TabsPrimitive.List className={clsx("flex w-full")}>
        {internalTabs.map(({ title, value }, i) => {
          return (
            <TabsPrimitive.Trigger
              key={`tab-trigger-${value}`}
              value={value ?? String(i)}
              className={clsx(
                "group",
                "border-b ",
                "border-gray-600",
                "radix-state-active:border-b-gray-700 focus-visible:radix-state-active:border-b-transparent  dark:radix-state-active:border-b-gray-100  focus-visible:dark:radix-state-active:border-b-transparent ",
                "flex flex-1 items-center justify-center px-3 py-5 xl:min-w-[380px] xl:flex-initial",
                "focus:radix-state-active:border-b-red",
                "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                "radix-state-active:text-[#DADADA] radix-state-inactive:text-neutral-400"
              )}
            >
              <span className={clsx("font-semibold")}>{title}</span>
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
      {internalTabs.map((tab, i) => {
        return (
          <TabsPrimitive.Content
            key={`tab-content-${tab.value}`}
            value={tab.value ?? String(i)}
            className={clsx("py-8 ")}
          >
            <span className="">{tab.content}</span>
          </TabsPrimitive.Content>
        );
      })}
    </TabsPrimitive.Root>
  );
};

export default Tabs;
