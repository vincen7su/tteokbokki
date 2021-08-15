import { useState, useEffect, useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { formatEther, formatUnits, parseEther, parseUnits } from '@ethersproject/units'
import Balance from './Balance'
import Token from './Token'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { ABI, CUSTOM_TOKEN, TOKEN_LIST, TOKEN_MAP } from '../constants/tokens'
import { ERROR_CHAIN_ID, NETWORK_LABEL_MAP } from '../constants/chains'
import './TransferForm.css'

export default function TransferForm() {
  const { account, library, chainId = ERROR_CHAIN_ID } = useActiveWeb3React()
  const [ contract, setContract ] = useState<Contract | undefined>()
  const [ balance, setBalance ] = useState('')
  const [ forceUpdateBalance, setForceUpdateBalance ] = useState(false)
  const [ symbol, setSymbol ] = useState(TOKEN_LIST[0])
  const [ tokenDecimals, setTokenDecimals ] = useState(18)
  const [ amount, setAmount ] = useState('')
  const [ address, setAddress ] = useState('')
  const [ tokenAddress, setTokenAddress ] = useState('')
  const [ isWaitingConfirmation, setIsWaitingConfirmation ] = useState(false)

  useEffect((): any => {
    if (!!account && !!library && !!chainId) {
      let stale = false

      if (symbol === 'ETH') {
        library
          .getBalance(account)
          .then((balance: any) => {
            !stale && setBalance(formatEther(balance))
          }).catch(() => !stale && setBalance(''))
      } else {
        const contract = new Contract(
          tokenAddress,
          ABI,
          library,
        )
        Promise.all([
          contract.symbol(),
          contract.balanceOf(account),
          contract.decimals(),
        ]).then(([tokenSymbol, balance, decimals]) => {
          setSymbol(tokenSymbol)
          setContract(contract)
          setTokenDecimals(decimals)
          !stale && setBalance(formatUnits(balance, decimals))
        }).catch(() => {
          if (!stale) {
            setBalance('')
            setSymbol(CUSTOM_TOKEN)
          }
        })
      }

      return () => {
        stale = true
        setBalance('')
      }
    }
  }, [account, library, chainId, symbol, tokenAddress, forceUpdateBalance])

  const changeToken = () => {
    const index = TOKEN_LIST.findIndex(key => key === symbol)
    const maxIndex = TOKEN_LIST.length - 1
    const newSymbol = TOKEN_LIST[index === maxIndex ? 0 : index + 1]
    setSymbol(newSymbol)
    if (chainId && !['ETH', CUSTOM_TOKEN].includes(newSymbol)) {
      const token = TOKEN_MAP[newSymbol]
      const tokenAddress = token[chainId]
      setTokenAddress(tokenAddress)
    } else {
      setTokenAddress('')
    }
  }

  const handleBalanceOnClick = () => {
    setAmount(balance)
  }

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '')
    !isNaN(Number(value)) && setAmount(value)
  }

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '')
    setAddress(value)
  }

  const handleTokenAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '')
    if (isAddress(value)) {
      const contract = new Contract(
        value,
        ABI,
        library
      )
      Promise.all([
        contract.symbol(),
        contract.balanceOf(account),
        contract.decimals(),
      ]).then(([tokenSymbol, balance, decimals]) => {
        setTokenAddress(value)
        setContract(contract)
        setSymbol(tokenSymbol)
        setTokenDecimals(decimals)
        setBalance(formatUnits(balance, decimals))
      }).catch(() => setBalance(''))
    }
  }

  const sendTransaction = useCallback(data => {
    return library ? library.send('eth_sendTransaction', [data]) : Promise.resolve()
  }, [library])

  const transferEth = useCallback(() => {
    return library && account ? Promise.all([
      library.getBalance(account),
      library.getGasPrice(),
      library.estimateGas({
        to: account,
        data: '0x'
      }),
    ]).then(([ balance, gasPrice, gasLimit ]) => {
      const gasFee = gasPrice.mul(gasLimit)
      const total = BigNumber.from(parseEther(amount))
      const netAmount = balance.gte(total.add(gasFee)) ? total : balance.sub(gasFee)
      return sendTransaction({
        from: account,
        to: address,
        value: netAmount.toHexString()
      })
    }) : Promise.resolve()
  }, [library, account, address, amount, sendTransaction])

  const transferToken = useCallback(() => {
    const total = parseUnits(amount, tokenDecimals)
    return contract ? contract.populateTransaction.transfer(
      address,
      total,
    ).then(data => sendTransaction({
      ...data,
      from: account,
    })) : Promise.resolve()
  }, [contract, account, address, amount, tokenDecimals, sendTransaction])

  const isWrongNetwork = !NETWORK_LABEL_MAP[chainId]
  const amountValid = amount && balance && Number(amount) <= Number(balance)
  const isValid = !isWrongNetwork && !isWaitingConfirmation && amountValid && address
  const validClass = isValid ? 'valid' : ''
  const sendButtonText = isWaitingConfirmation
    ? 'Waiting For Confirmation'
    : Number(amount) <= Number(balance)
      ? 'Send'
      : 'Insufficient Balance'

  const transfer = () => {
    if (!isValid || isWaitingConfirmation) {
      return
    }
    setIsWaitingConfirmation(true)
    const action = symbol === 'ETH' ? transferEth : transferToken
    return action().then(tx => {
      library && library.once(tx, () => setForceUpdateBalance(!forceUpdateBalance))
      setAmount('')
      setAddress('')
    }).finally(() => {
      setIsWaitingConfirmation(false)
    })
  }

  const pendingClass = isWaitingConfirmation ? 'pending' : ''

  return (
    <div className={ `transfer-form ${pendingClass}` }>
      <Balance symbol={ symbol } balance={ balance } onClick={ handleBalanceOnClick } />
      <div className="row-wrap">
        <Token symbol={ symbol } onClick={ changeToken } />
        <input
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0.0"
          name="amount"
          className="form-input"
          value={ amount }
          onChange={ handleAmountInput }
          inputMode="decimal"
          title="Token Amount"
          autoComplete="off"
          autoCorrect="off"
          min={ 0 }
          minLength={ 1 }
          maxLength={ 79 }
          spellCheck="false"
        />
      </div>
      { symbol === CUSTOM_TOKEN &&
        <div className="row-wrap">
          <input
            type="text"
            name="tokenAddress"
            className="form-input"
            placeholder="Token Address"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            pattern="^(0x[a-fA-F0-9]{40})$"
            onChange={ handleTokenAddressInput }
          />
        </div>
      }
      <div className="row-wrap">
        <input
          type="text"
          name="address"
          className="form-input"
          placeholder="Wallet Address"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          pattern="^(0x[a-fA-F0-9]{40})$"
          onChange={ handleAddressInput }
          value={ address }
        />
      </div>
      <div className={ `send-button no-select ${validClass}` } onClick={ transfer }>{ sendButtonText }</div>
    </div>
  )
}
