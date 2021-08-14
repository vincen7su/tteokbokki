import formatDigits from '../utils/formatDigits'
import { CUSTOM_TOKEN } from '../constants/tokens'
import './Balance.css'

export default function Balance({
  symbol,
  balance,
  onClick = () => {},
}: {
  symbol: string,
  balance: string,
  onClick?: (() => void),
}) {
  return (
    <div className="balance">
      { balance && symbol !== CUSTOM_TOKEN &&
        <>
          Balance:<div className="text" onClick={ onClick }>{ formatDigits(balance, 6) }</div> { symbol }
        </>
      }
    </div>
  )
}
