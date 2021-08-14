export default function shortenAddress(s: string, suffix: boolean = true): string {
  return `${s.slice(0, 6)}${s && suffix ? `...${s.slice(-4)}` : ''}`
}
