
import React from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  breadcrumbs: {
    label: string;
    href?: string;
    isCurrent?: boolean;
  }[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}) => (
  <header className={cn("mb-8", className)}>
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((bc, idx) => (
          <React.Fragment key={bc.label}>
            <BreadcrumbItem>
              {bc.href && !bc.isCurrent ? (
                <BreadcrumbLink asChild>
                  <a href={bc.href}>{bc.label}</a>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{bc.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
    <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
      <div className="flex items-center gap-3">
        <span className="rounded-md p-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md flex items-center justify-center">
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </div>
  </header>
);

export default PageHeader;
