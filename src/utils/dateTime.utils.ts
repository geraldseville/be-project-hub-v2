export const isValidTimezone = (timezone: string) => {
  try {
    Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
    });

    return true;
  } catch {
    return false;
  }
};
