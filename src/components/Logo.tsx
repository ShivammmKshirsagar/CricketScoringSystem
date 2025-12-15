import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Cricket ball icon */}
      <div className={cn(
        "relative rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center shadow-lg",
        size === "sm" && "h-7 w-7",
        size === "md" && "h-9 w-9",
        size === "lg" && "h-12 w-12"
      )}>
        {/* Seam lines */}
        <div className="absolute inset-1 rounded-full border border-foreground/20" />
        <div className={cn(
          "absolute rounded-full border-t border-foreground/30",
          size === "sm" && "w-4 top-1.5",
          size === "md" && "w-5 top-2",
          size === "lg" && "w-7 top-2.5"
        )} 
        style={{ transform: 'rotate(-30deg)' }}
        />
        <div className={cn(
          "absolute rounded-full border-b border-foreground/30",
          size === "sm" && "w-4 bottom-1.5",
          size === "md" && "w-5 bottom-2",
          size === "lg" && "w-7 bottom-2.5"
        )}
        style={{ transform: 'rotate(30deg)' }}
        />
      </div>
      
      {/* Text */}
      <span className={cn(
        "font-display font-black tracking-tight",
        sizes[size]
      )}>
        <span className="text-foreground">Cricket</span>
        <span className="text-primary">Score</span>
      </span>
    </div>
  );
}
