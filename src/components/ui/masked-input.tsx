

"use client";

import * as React from "react";
import { IMaskMixin } from "react-imask";
import type { IMaskInputProps } from "react-imask";

import { cn } from "@/lib/utils";

// This component integrates react-imask with a standard input
// and handles the `inputRef` prop correctly to avoid React warnings.
const MaskedInputComponent = IMaskMixin(
  ({ inputRef, ...props }: { inputRef: React.Ref<HTMLInputElement> }) => (
    <input {...props} ref={inputRef} />
  )
);
MaskedInputComponent.displayName = 'MaskedInputComponent';


const MaskedInput = React.forwardRef<HTMLInputElement, IMaskInputProps<any>>(
  ({ onAccept, className, ...props }, ref) => {
    return (
        <MaskedInputComponent
            {...props}
            onAccept={(value: any, mask: any) => onAccept && onAccept(value, mask)}
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
