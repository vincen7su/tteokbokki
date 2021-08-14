import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected, walletconnect } from '../connectors'
import METAMASK_ICON_URL from '../assets/images/metamask.svg'
import WALLETCONNECT_ICON_URL from '../assets/images/walletconnect.svg'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconUrl: string
  description: string
  href: string | null
  color: string
  // primary?: true
  mobile?: true
  // mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconUrl: METAMASK_ICON_URL,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconUrl: WALLETCONNECT_ICON_URL,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
}
