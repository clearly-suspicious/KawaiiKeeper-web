import { useState } from "react";

type Item = {
  id?: string;
  label: string;
};

type Props = {
  trigger: React.ReactNode;
  items?: Array<Item>;
};
const Dropdown = ({
  trigger = <div>Click me</div>,
  items = [{ label: "Example" }],
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  //if no id just use the index as id
  items = items.map((item, i) => ({
    ...item,
    id: item.id ? item.id : String(i),
  }));

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="cursor-pointer">{trigger}</div>
      <div
        className={`absolute translate-x-[-100%] text-white ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="cursor-pointer bg-[rgba(0,0,0,0.4)] hover:bg-black"
            onClick={() => handleSelect(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
