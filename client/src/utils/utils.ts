import { CommentDto } from '../types';

export const getTime = (createdAt: string) => {
  const date = new Date(createdAt);
  const createdAtLocalTime = new Date(toLocalTimestamp(createdAt));
  const localTimeNow = new Date(toLocalTimestamp(new Date().toUTCString()));

  let fromNow = Math.floor((localTimeNow.getTime() - createdAtLocalTime.getTime()) / 1000);
  const timeArray: [number, string][] = [
    [60, "min"],
    [24, "hr"],
    [30, "day"],
  ];
  if (fromNow < 60) return "Now";
  fromNow = Math.ceil(fromNow / (60 as number));
  for (const time of timeArray) {
    if (fromNow < time[0])
      return `${fromNow} ${time[1]}${fromNow > 1 ? "s" : ""}`;
    fromNow = Math.ceil(fromNow / (time[0] as number));
  }

  const time = date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return time;
};

export function toLocalTimestamp(utcString: string): string {
  const date = new Date(utcString);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}
