const REPLY_WINDOW_MS = 24 * 60 * 60 * 1_000;

export function isWhatsAppReplyWindowOpen(
  receivedAt: Date,
  currentTime = new Date(),
) {
  const elapsedTime = currentTime.getTime() - receivedAt.getTime();
  return elapsedTime >= 0 && elapsedTime < REPLY_WINDOW_MS;
}
