import clsx from "clsx";

function Button({ children, className, variant = "primary", ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center px-4 py-2 text-sm uppercase tracking-[0.2em] transition duration-300 ease-out hover:-translate-y-[1px] active:translate-y-0",
        variant === "primary" && "bg-black text-white hover:bg-zinc-800",
        variant === "outline" && "border border-black bg-transparent text-black hover:bg-black hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
