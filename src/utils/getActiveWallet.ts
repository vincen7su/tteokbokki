import { AbstractConnector } from '@web3-react/abstract-connector'
import { SUPPORTED_WALLETS, WalletInfo } from '../constants/wallets'

export default function getActiveWallet(connector: AbstractConnector | undefined): WalletInfo | undefined {
  const key = Object.keys(SUPPORTED_WALLETS).find((key) => connector === SUPPORTED_WALLETS[key].connector)
  return key ? SUPPORTED_WALLETS[key] : undefined
}
