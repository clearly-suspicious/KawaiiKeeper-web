import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};
const Button = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <>
      <button
        type="button"
        className={clsx(
          "relative flex min-h-[46px] items-center justify-center rounded-full border border-gray-600 bg-[transparent] py-2.5 px-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:bg-[rgba(0,0,0,0.8)] dark:text-white  lg:px-6",
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
