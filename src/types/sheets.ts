export interface Sheets {
  day: number;
  age: string;
  gender: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  [key: string]: any;
}

export interface SheetsResponse {
  data: Array<Sheets>;
  sheets: {
    seeded: boolean;
    count: number;
    availableFrom: number;
    availableTo: number;
  };
}
