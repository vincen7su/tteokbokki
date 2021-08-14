import { utils } from 'ethers'

export default function formatDigits(s: string = '', maxDecimalDigits: number = 2): string {
  if (s.includes('.')) {
    const parts = s.split('.')
    return utils.commify(parts[0] + '.' + parts[1].slice(0, maxDecimalDigits))
  }
  return s
}
