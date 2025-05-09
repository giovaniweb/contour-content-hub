
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
      <DayPicker
        ref={ref}
        className={cn(
          "p-3",
          className
        )}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "hidden sm:flex relative overflow-hidden flex-none w-[24px] h-[24px] p-0.5 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-secondary focus:text-secondary-foreground disabled:opacity-50 disabled:pointer-events-none",
            "data-[month]:[&>svg]:rotate-90 data-[orientation=vertical]:rotate-0"
          ),
          nav_icon: "absolute h-3 w-3",
          day: cn(
            "relative p-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-center cursor-pointer transition-colors ease-in-out duration-200 select-none rounded-md border-0",
            "h-9 w-9",
            "hover:bg-accent hover:text-accent-foreground",
            "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:focus:ring-primary",
            "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
            "data-[today]:font-semibold",
          ),
          ...classNames,
        }}
        showOutsideDays={showOutsideDays}
        {...props}
      />
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
