type Props = {
  label: string;
  children: React.ReactNode;
};

export function OverviewProperty({ label, children }: Props) {
  return (
    <div className="flex items-center gap-8">
      <p className="min-w-[100px] text-sm text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}
