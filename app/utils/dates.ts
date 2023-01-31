import dayjs from 'dayjs';

export const compareDesc = (
  a?: Date | number | string,
  b?: Date | number | string
): number => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const aDate = dayjs(a);
  const bDate = dayjs(b);
  if (dayjs(aDate).isSame(dayjs(bDate))) return 0;
  if (dayjs(aDate).isAfter(dayjs(bDate))) return -1;
  if (dayjs(aDate).isBefore(dayjs(bDate))) return 1;
  return 0;
};
