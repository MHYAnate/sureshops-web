import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text = "Loading...", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className
      )}
    >
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}