
"use client";

import * as React from "react";
import { IMaskInput } from "react-imask";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

const MaskedInput = React.forwardRef<HTMLInputElement, InputProps & any>(
  ({ className, type, ...props }, ref) => {
    return (
      <IMaskInput
        {...props}
        inputRef={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    );
  }
);
MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
