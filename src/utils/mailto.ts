export interface ContactValues {
  name: string
  email: string
  message: string
}

export function createMailtoUrl(recipient: string, values: ContactValues): string {
  const subject = `作品集網站聯絡｜${values.name}`
  const body = `姓名：${values.name}\nEmail：${values.email}\n\n留言：\n${values.message}`

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
