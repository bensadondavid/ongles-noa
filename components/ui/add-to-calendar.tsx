"use client"

import { CalendarPlus } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

type AddToCalendarProps = {
  title: string
  description?: string
  location?: string
  start: Date
  end: Date
  className?: string
}

function toCompactUTC(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

function escapeICSText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

function buildICSContent({ title, description, location, start, end }: AddToCalendarProps) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ongles Noa//RDV//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@ongles-noa`,
    `DTSTAMP:${toCompactUTC(new Date())}`,
    `DTSTART:${toCompactUTC(start)}`,
    `DTEND:${toCompactUTC(end)}`,
    `SUMMARY:${escapeICSText(title)}`,
  ]

  if (description) lines.push(`DESCRIPTION:${escapeICSText(description)}`)
  if (location) lines.push(`LOCATION:${escapeICSText(location)}`)

  lines.push("END:VEVENT", "END:VCALENDAR")

  return lines.join("\r\n")
}

function downloadICS(event: AddToCalendarProps) {
  const blob = new Blob([buildICSContent(event)], {
    type: "text/calendar;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function AddToCalendar({ className, ...event }: AddToCalendarProps) {
  const t = useTranslations("addToCalendar")

  return (
    <button
      type="button"
      onClick={() => downloadICS(event)}
      aria-label={t("button")}
      title={t("button")}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-[#b89f93]/40 bg-white/40 text-[#7d6258] transition hover:bg-white/70 hover:text-[#5f4941]",
        className
      )}
    >
      <CalendarPlus size={18} aria-hidden />
    </button>
  )
}
