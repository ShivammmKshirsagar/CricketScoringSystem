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
    <div className={cn("flex items-center gap-1", className)}>
      
      <img 
        src="/CricMitra.png"
        alt="Cricket Score Logo"
        className={cn(
          "object-contain flex-shrink-0 -my-1",
          size === "sm" && "h-12 w-12",
          size === "md" && "h-16 w-16",
          size === "lg" && "h-24 w-24"
        )}
      />
      
      
      <span className={cn(
        "font-display font-black tracking-tight",
        sizes[size]
      )}>
        <span className="text-foreground">Cric</span>
        <span className="text-primary">Mitra</span>
      </span>
    </div>
  );
}