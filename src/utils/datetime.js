const pad2 = (n) => String(n).padStart(2, '0')

// Format JS Date to backend LocalDateTime (no timezone, e.g. 2026-01-26T16:30:00)
export const toLocalDateTimeString = (d) => {
  if (!(d instanceof Date)) return undefined
  if (Number.isNaN(d.getTime())) return undefined
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const mi = pad2(d.getMinutes())
  const ss = pad2(d.getSeconds())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`
}

export const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

