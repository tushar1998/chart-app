import { Filters } from "@/types/filter";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { SelectRangeEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RangePickerProps {
  date: Filters["day"];
  range: { from: number; to: number };
  handleDate: SelectRangeEventHandler;
}

export function DatePickerWithRange({
  className,
  date,
  handleDate,
  range,
}: React.HTMLAttributes<HTMLDivElement> & RangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon size={18} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDate}
            numberOfMonths={2}
            disabled={(date) => date < new Date(range.from) || date > new Date(range.to)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
