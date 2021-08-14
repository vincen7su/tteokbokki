import { CUSTOM_TOKEN, TOKEN_MAP } from '../constants/tokens'
import './Token.css'

export default function Token({
  symbol,
  onClick = () => {},
}: {
  symbol: string,
  onClick?: (() => void),
}) {
  const tokenImage = `${process.env.PUBLIC_URL}/images/tokens/${symbol}.png`
  const notCustomToken = symbol !== CUSTOM_TOKEN
  const hasTokenIcon = TOKEN_MAP[symbol] || symbol === 'ETH'
  return (
    <div className="token block clickable no-select" onClick={ onClick }>
      { hasTokenIcon
        ? <img className="icon" src={ tokenImage } alt={ symbol } />
        : <div className="custom">?</div>
      }
      { notCustomToken ? symbol : '- - -' }
    </div>
  )
}