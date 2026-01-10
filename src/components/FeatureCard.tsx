import { Card } from "./Card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <Card variant="flat" className={cn("group hover:border-primary/30 p-4 transition-colors", className)}>
      <div className="mb-2.5 inline-flex p-2 rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="font-display text-sm font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </Card>
  );
}
