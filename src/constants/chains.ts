export const ERROR_CHAIN_ID = 0

export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
}

export const METAMASK_DEFAULT_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
]

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
]

export const NETWORK_LABEL_MAP: { [chainId: number]: string } = {
  0: 'Wrong Network',
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.ROPSTEN]: 'Ropsten',
}

export const SUPPORTED_NETWORKS: {
  [chainId in SupportedChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [SupportedChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [SupportedChainId.ROPSTEN]: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'Ropsten Ether',
      symbol: 'ROP',
      decimals: 18,
    },
    rpcUrls: ['https://ropsten.infura.io/v3'],
    blockExplorerUrls: ['https://ropsten.etherscan.io'],
  },
}
