
import React from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  breadcrumbs?: {
    label: string;
    to?: string;
  }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon: Icon, description, breadcrumbs }) => {
  return (
    <div className="mb-8 mt-2">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, idx) =>
              <React.Fragment key={item.label}>
                <BreadcrumbItem>
                  {item.to ? (
                    <BreadcrumbLink href={item.to}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex items-center gap-3 mt-3">
        {Icon && (
          <Icon className="w-8 h-8 text-primary rounded-lg bg-primary/10 p-1.5" />
        )}
        <h1 className="text-3xl font-bold text-slate-50">{title}</h1>
      </div>
      {description && (
        <div className="text-slate-300 mt-2 text-base">{description}</div>
      )}
    </div>
  );
};

export default PageHeader;
