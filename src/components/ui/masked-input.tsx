
"use client";

import * as React from "react";
import { IMaskInput, IMaskMixin } from "react-imask";
import type { IMaskInputProps } from "react-imask";

import { cn } from "@/lib/utils";

const MaskedInputComponent = IMaskMixin(({ inputRef, ...props }: any) => (
    <input
        {...props}
        ref={inputRef}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          props.className
        )}
      />
));


const MaskedInput = React.forwardRef<HTMLInputElement, IMaskInputProps<any>>(
  ({ unmaskedValue, onAccept, ...props }, ref) => {
    return (
        <MaskedInputComponent
            {...props}
            onAccept={(value: any, mask: any) => onAccept && onAccept(mask.unmaskedValue, mask)}
            inputRef={ref}
            defaultValue={unmaskedValue} // Use defaultValue to avoid controlled/uncontrolled issues with masking
        />
    );
  }
);
MaskedInput.displayName = "MaskedInput";

export { MaskedInput };

    