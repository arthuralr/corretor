

"use client";

import * as React from "react";
import { IMaskMixin } from "react-imask";
import type { IMaskInputProps } from "react-imask";

import { cn } from "@/lib/utils";

// This is a workaround to make the IMaskMixin work with forwardRef
const MaskedInputComponent = IMaskMixin(
    React.forwardRef<HTMLInputElement, any>((props, ref) => (
        <input {...props} ref={ref} />
    ))
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
