
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className,
  message 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "rounded-full border-2 border-t-transparent animate-spin", 
          sizeClasses[size],
          "border-fluida-blue"
        )} 
      />
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6 text-center", className)}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-6 text-center border border-red-200 bg-red-50 rounded-lg",
      className
    )}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-700">{title}</h3>
      {description && <p className="mt-1 text-sm text-red-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
  );
};
