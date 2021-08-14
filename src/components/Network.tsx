import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import {
  ERROR_CHAIN_ID,
  METAMASK_DEFAULT_CHAIN_IDS,
  ALL_SUPPORTED_CHAIN_IDS,
  NETWORK_LABEL_MAP,
  SUPPORTED_NETWORKS
} from '../constants/chains'
import './Network.css'

export default function Network() {
  const { chainId = ERROR_CHAIN_ID, library, account } = useActiveWeb3React()
  const changeNetwork = () => {
    const key = ALL_SUPPORTED_CHAIN_IDS.filter(key => key !== chainId)[0]
    const network = SUPPORTED_NETWORKS[key]
    if (network && METAMASK_DEFAULT_CHAIN_IDS.includes(key)) {
      library?.send('wallet_switchEthereumChain', [{ chainId: network.chainId }, account])
    } else {
      library?.send('wallet_addEthereumChain', [network, account])
    }
  }
  const errorClass = NETWORK_LABEL_MAP[chainId] ? '' : 'error'
  return (
    <div className="network">
      <div
        className={ `block clickable no-select network-label ${errorClass}` }
        onClick={ changeNetwork }
      >{ NETWORK_LABEL_MAP[chainId] || NETWORK_LABEL_MAP[ERROR_CHAIN_ID] }</div>
    </div>
  )
}
