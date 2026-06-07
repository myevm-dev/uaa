"use client"

import { useCallback, useState } from "react"
import { Wallet, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrowserProvider } from "ethers"
import { ThemeToggle } from "@/components/theme-toggle"

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function Navbar() {
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("No wallet found. Please install MetaMask or another EVM wallet.")
      return
    }

    try {
      setIsConnecting(true)

      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts?.[0]) {
        setWalletAddress(accounts[0])
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <h1 className="font-[var(--font-heading)] text-lg font-semibold tracking-tight text-foreground">
            Universal Autonomous Accounts
          </h1>
          <p className="text-xs text-muted-foreground">
            AI identity NFTs connected to owned NFTs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <ThemeToggle />
        <Button
          type="button"
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn-3d btn-glow gap-2 rounded-full bg-gradient-to-br from-primary via-gray-900 to-black px-4 text-white shadow-xl"
        >
          <Wallet className="h-4 w-4" />
          {walletAddress
            ? shortenAddress(walletAddress)
            : isConnecting
              ? "Connecting..."
              : "Connect Wallet"}
        </Button>
      </div>
    </header>
  )
}