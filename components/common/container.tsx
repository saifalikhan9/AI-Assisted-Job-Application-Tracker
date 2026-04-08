import { cn } from "@/lib/utils";
import React from "react";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(className, "max-w-6xl mx-auto p-2 px-4")}>
      {children}
    </div>
  );
};
