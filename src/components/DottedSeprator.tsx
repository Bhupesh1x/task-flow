type Props = {
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  className?: string;
  direction?: "horizontal" | "vertical";
};

export function DottedSeprator({
  className = "",
  color = "#d4d4d8",
  height = "2px",
  gapSize = "6px",
  dotSize = "2px",
  direction = "horizontal",
}: Props) {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={`${
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center"
      } ${className}`}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
            : `${height} ${parseInt(gapSize)}px ${height}`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
