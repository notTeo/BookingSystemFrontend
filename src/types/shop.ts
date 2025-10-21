export type Day =
  | "MONDAY" | "TUESDAY" | "WEDNESDAY"
  | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type HourRow = {
  dayOfWeek: Day;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};