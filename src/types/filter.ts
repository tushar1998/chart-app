import { DateRange } from "react-day-picker";

export interface Filters {
  day?: DateRange;
  gender?: Array<string>;
  age?: Array<string>;
}

export interface SelectOptions {
  label: string | null;
  value: string;
}
