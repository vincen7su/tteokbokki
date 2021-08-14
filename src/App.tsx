import { useState } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import Network from './components/Network'
import Wallet from './components/Wallet'
import WalletOption from './components/WalletOption'
import TransferForm from './components/TransferForm'
import { SUPPORTED_WALLETS } from './constants/wallets'
import getActiveWallet from './utils/getActiveWallet'

import './App.css'

function App() {
  const { active, account, connector, activate, error } = useWeb3React()
  const isMetaMaskEnable = window.ethereum && window.ethereum.isMetaMask
  const [ showWalletList, setShowWalletList ] = useState(false)

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        }
      })
  }

  const activeWallet = getActiveWallet(connector)

  const WalletList = Object.keys(SUPPORTED_WALLETS).map((key) => {
    const wallet = SUPPORTED_WALLETS[key]
    const isMetaMask = key === 'METAMASK'
    return (
      <WalletOption
        key={ key }
        onClick={() => {
          if (isMetaMask && !isMetaMaskEnable) {
            window.open('https://metamask.io/', '_blank')
            return
          }

          wallet.connector === connector
            ? setShowWalletList(false)
            : !wallet.href && tryActivation(wallet.connector)
        }}
        name={ wallet.name }
        iconUrl={ wallet.iconUrl }
      />
    )
  })

  const isWrongNetwork = error instanceof UnsupportedChainIdError

  return (
    <div className="app">
      <div className="wallet-card">
        { !showWalletList && (active || isWrongNetwork)
          ? <>
              <div className="wallet-status">
                <Network />
                <Wallet
                  name={ activeWallet?.name || '' }
                  iconUrl={ activeWallet?.iconUrl || '' }
                  address={ account }
                  onClick={ () => setShowWalletList(true) }
                />
              </div>
              <TransferForm isWrongNetwork={ isWrongNetwork } />
            </>
          : <div className="wallet-list">
              <div className="title">Select a Wallet</div>
              <div className="wallet-wrap">{ WalletList }</div>
            </div>
        }
      </div>
    </div>
  )
}

export default App
