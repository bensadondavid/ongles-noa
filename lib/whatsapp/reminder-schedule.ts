import { fromZonedTime, toZonedTime } from "date-fns-tz";

const TIME_ZONE = "Asia/Jerusalem";
const REMINDER_HOUR = 20;

export function getAppointmentReminderAt(startsAt: Date) {
  const localAppointment = toZonedTime(startsAt, TIME_ZONE);
  const localReminder = new Date(localAppointment);

  localReminder.setDate(localReminder.getDate() - 1);
  localReminder.setHours(REMINDER_HOUR, 0, 0, 0);

  return fromZonedTime(localReminder, TIME_ZONE);
}

export function getTomorrowBounds(reference: Date) {
  const localReference = toZonedTime(reference, TIME_ZONE);
  const localStart = new Date(localReference);

  localStart.setDate(localStart.getDate() + 1);
  localStart.setHours(0, 0, 0, 0);

  const localEnd = new Date(localStart);
  localEnd.setDate(localEnd.getDate() + 1);

  return {
    start: fromZonedTime(localStart, TIME_ZONE),
    end: fromZonedTime(localEnd, TIME_ZONE),
  };
}
