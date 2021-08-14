import './WalletOption.css'

export default function WalletOption({
  onClick = () => {},
  name,
  iconUrl,
}: {
  onClick?: (() => void)
  name: string,
  iconUrl: string,
}) {
  return (
    <div className="wallet-option" onClick={ onClick }>
      <img className="wallet-icon" src={ iconUrl } alt={ `${name} Icon` } />
    </div>
  )
}
