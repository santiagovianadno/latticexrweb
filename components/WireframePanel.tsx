import type { HTMLAttributes, ReactNode } from "react";

type WireframePanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  dense?: boolean;
};

export function WireframePanel({
  children,
  className = "",
  dense = false,
  ...props
}: WireframePanelProps) {
  return (
    <div
      className={`wireframe-panel ${dense ? "lattice-bg-dense" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
