import { SupportedChainId } from './chains'

export const ABI: string[] = [
  // Read-Only Functions
  'function symbol() view returns (string)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (boolean)',
]

export const CUSTOM_TOKEN = 'CUSTOM_TOKEN'

export const TOKEN_LIST: string[] = [
  'ETH', 'UNI', CUSTOM_TOKEN
]

export const TOKEN_MAP: { [symbol: string]: { [chainId: string]: string } } = {
  UNI: {
    [SupportedChainId.MAINNET]: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    [SupportedChainId.ROPSTEN]: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  },
}