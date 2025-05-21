import type * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../lib/utils"
import { buttonVariants } from "./Button"
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "py-1 w-full justify-center items-center",
        month_grid: "w-full mt-8",
        month_caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-sm font-medium text-black",
        nav: "space-x-1 flex items-center w-full justify-between absolute",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 flex items-center justify-center rounded-md border border-gray-200 text-black hover:bg-gray-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: "text-black rounded-md w-9 font-medium text-[0.8rem] text-center flex-1",
        row: "flex w-full mt-2",
        cell: "text-center text-sm relative p-0 flex-1 flex items-center justify-center [&:has([aria-selected])]:bg-primary/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-8 font-normal text-black aria-selected:opacity-100 rounded-full transition-colors",
          "hover:bg-gray-100 text-center",
        ),
        day_button: "w-8",
        weekday: "text-secondary",
        chevron: "fill-primary",
        selected: "bg-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
        today: "bg-gray-300 text-black font-bold",
        outside: "text-gray-400 opacity-50",
        disabled: "text-gray-900 opacity-30 hover:bg-transparent",
        day_range_middle: "aria-selected:bg-primary/10 aria-selected:text-black",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }