function LoadingSkeleton({ className = "h-8 w-full" }) {
  return <div className={`animate-pulse bg-zinc-200 ${className}`} />;
}

export default LoadingSkeleton;
