import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectOptions } from "@/types/filter";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

interface ChartFilterDropDownProps {
  options: Array<SelectOptions>;
  filter?: Array<string>;
  handleChange: (key: string, value: boolean) => void;
  filterType: "gender" | "age";
}

export default function ChartFilterDropDown({ filterType, filter, options, handleChange }: ChartFilterDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <p className="capitalize">{filterType}</p>
          {filter && filter?.length > 0 && (
            <>
              <Separator orientation="vertical" />
              <p className="text-muted-foreground">{filter.length}</p>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={filter?.includes(item.value)}
            onCheckedChange={(args) => handleChange(item.value, args)}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
