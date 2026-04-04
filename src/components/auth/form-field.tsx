import * as React from "react";

import { Input } from "@/components/ui/input";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, trailing, className, ...props }, ref) => {
    return (
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="relative">
          <Input ref={ref} className={className} {...props} />
          {trailing ? (
            <div className="absolute inset-y-0 right-4 flex items-center">{trailing}</div>
          ) : null}
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </label>
    );
  },
);

FormField.displayName = "FormField";
