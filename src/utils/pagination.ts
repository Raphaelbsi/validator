import { InvalidResult, ValidResult } from "../types";

export const paginate = (array: (ValidResult | InvalidResult)[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  return array.slice(start, end);
};