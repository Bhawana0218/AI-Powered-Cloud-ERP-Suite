interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover ${className}`} />;
  }

  return (
    <div className={`${sizeMap[size]} rounded-full bg-primary-light flex items-center justify-center font-semibold text-primary shrink-0 ${className}`}>
      {initials}
    </div>
  );
}
