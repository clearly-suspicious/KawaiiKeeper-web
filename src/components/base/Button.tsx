import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};
const Button = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <>
      <button
        type="button"
        className={twMerge(
          "relative flex min-h-[46px] items-center justify-center rounded-full border border-gray-500 bg-[transparent] py-2.5 px-4 text-sm font-medium text-gray-100 hover:border-gray-400 hover:bg-[rgba(0,0,0,0.8)] lg:px-6",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
