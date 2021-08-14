import { useWeb3React } from '@web3-react/core'

import useEagerConnect from '../hooks/useEagerConnect'
import useInactiveListener from '../hooks/useInactiveListener'
import { NetworkContextName } from '../constants/config'


export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React()
  const { error: networkError } = useWeb3React(NetworkContextName)
  // const { active: networkActive, error: networkError } = useWeb3React(NetworkContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  // const [showLoader, setShowLoader] = useState(false)
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setShowLoader(true)
  //   }, 600)

  //   return () => {
  //     clearTimeout(timeout)
  //   }
  // }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <div>
        <div>
          Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.
        </div>
      </div>
    )
  }

  // if neither context is active, spin
  // if (!active && !networkActive) {
  //   return showLoader ? (
  //     <div>
  //       <div>Loading...</div>
  //     </div>
  //   ) : null
  // }

  return children
}
