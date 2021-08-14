import { ReactComponent as CopyIcon } from '../assets/images/copy.svg'
import copyToClipboard from '../utils/copyToClipboard'
import shortenAddress from '../utils/shortenAddress'
import './Wallet.css'

export default function Wallet({
  name,
  iconUrl,
  address,
  onClick = () => {},
}: {
  name: string,
  iconUrl: string,
  address: string | null | undefined,
  onClick?: (() => void),
}) {
  return (
    <div className="wallet no-select">
      <div className="block clickable" onClick={ onClick }>
        <img className="icon" src={ iconUrl } alt={ `${name} Icon` } />
        { address && <div className="label">{ shortenAddress(address) }</div> }
      </div>
      { address && <CopyIcon className="icon-copy" onClick={ () => copyToClipboard(address) } /> }
    </div>
  )
}
