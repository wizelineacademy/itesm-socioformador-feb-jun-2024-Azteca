import { DateObject } from "@/types/types";

const months: { [key: string]: string } = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

const days: { [key: string]: string } = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export const parseDate = (unformattedDate: Date): DateObject => {
  const [date, time] = unformattedDate.toISOString().split("T");
  const [year, month, day] = date.split("-");
  const [hour, minute, second] = time.split(":");
  const dayOfWeek = unformattedDate.toDateString().split(" ")[0];
  const dateAsText = `${days[dayOfWeek]}, ${day} ${months[month]} ${year}`;

  return {
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minute}:${second}`,
    dateAsText: dateAsText,
  };
};
