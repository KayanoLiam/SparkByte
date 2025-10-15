import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // 主按钮更活泼：使用强调色，提升视觉活力
        default:
          "bg-[var(--accent-2)] text-[var(--dark)] shadow hover:bg-[var(--accent-2)]/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // 轮廓按钮：浅色背景、深色文字，悬停用柔和强调色
        outline:
          "border border-[var(--border)] bg-[var(--light)] text-[var(--dark)] shadow-sm hover:bg-[var(--accent-1)]",
        // 次按钮更活泼：使用另一强调色
        secondary:
          "bg-[var(--accent-3)] text-[var(--dark)] shadow-sm hover:bg-[var(--accent-3)]/90",
        // 幽灵按钮：悬停以强调色微亮
        ghost: "hover:bg-[var(--accent-2)] hover:text-[var(--dark)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
