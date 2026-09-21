"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">> => {
//   const [isShow, setIsShow] = React.useState(false);

//   return (
//     <div>
//       <Input type="password" />
//       <div>{isShow ? <Eye /> : <EyeClosed />}</div>
//     </div>
//   );
// };
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [isShow, setIsShow] = React.useState(false);
  return (
    <div className="relative">
      <input
        type={isShow ? "text" : "password"}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
      <button
        tabIndex={-1}
        type="button"
        className="absolute bottom-1/2 right-3 translate-y-1/2"
        onClick={() => setIsShow((prev) => !prev)}
      >
        {isShow ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
      </button>
    </div>
  );
});
Input.displayName = "PasswordInput";

export { Input, PasswordInput };
