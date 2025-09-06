import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "medium", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  const textSizes = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl"
  };

  return (
    <Link href="/" className={`flex items-center space-x-3 space-x-reverse hover:opacity-80 transition-opacity ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src="/logo.png"
          alt="Water Guard Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent ${textSizes[size]}`}>
            Water Guard
          </span>
          <span className="text-xs text-secondary -mt-1">المحلة الكبرى</span>
        </div>
      )}
    </Link>
  );
}
