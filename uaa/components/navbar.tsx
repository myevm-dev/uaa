"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import {
  Bot,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  Sparkles,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrowserProvider } from "ethers"
import { ThemeToggle } from "@/components/theme-toggle"
import type { AppMode } from "@/app/page"

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

type NavbarProps = {
  mode: AppMode
  setMode: (mode: AppMode) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function modeButtonClass(active: boolean) {
  return active
    ? "btn-3d btn-glow gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-xl"
    : "btn-3d gap-2 rounded-full border border-border/60 bg-secondary/70 px-4 text-foreground hover:bg-secondary"
}

export function Navbar({
  mode,
  setMode,
  sidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-3d h-9 w-9 rounded-full border border-border/60 bg-secondary/70 text-foreground hover:bg-secondary"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        <Link
          href="/landing"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
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
        </Link>
      </div>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
        <Button
          type="button"
          onClick={() => setMode("chat")}
          className={modeButtonClass(mode === "chat")}
        >
          <Bot className="h-4 w-4" />
          Chat
        </Button>

        <Button
          type="button"
          onClick={() => setMode("manage")}
          className={modeButtonClass(mode === "manage")}
        >
          <Layers className="h-4 w-4" />
          Manage
        </Button>

        <Button
          type="button"
          onClick={() => setMode("create")}
          className={modeButtonClass(mode === "create")}
        >
          <PenLine className="h-4 w-4" />
          Create
        </Button>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Button
          type="button"
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn-3d btn-glow gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-xl"
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