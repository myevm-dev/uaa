// app/landing/page.tsx
import Link from "next/link"
import { ArrowRight, Bot, Brain, Fingerprint, Sparkles, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="shader-orb shader-orb-1" />
        <div className="shader-orb shader-orb-2" />
        <div className="shader-orb shader-orb-3" />
      </div>

      <div className="absolute inset-0 opacity-[0.12] grid-background" />

      <div className="relative z-10">
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/70 px-6 backdrop-blur-xl">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h1 className="font-[var(--font-heading)] text-lg font-semibold tracking-tight">
                Universal Autonomous Accounts
              </h1>
              <p className="text-xs text-muted-foreground">
                AI identity NFTs connected to owned NFTs
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button className="btn-3d btn-glow rounded-full bg-primary px-5 text-primary-foreground">
                Open App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
            <Fingerprint className="h-4 w-4 text-primary" />
            Create, preview, and mint autonomous AI identities
          </div>

          <h2 className="max-w-5xl font-[var(--font-heading)] text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Give every NFT an autonomous personality.
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Universal Autonomous Accounts lets users connect a wallet, select an NFT they own,
            generate an AI personality from it, preview the identity in chat, and prepare it for
            minting as an AI identity NFT.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <Button className="btn-3d btn-glow h-12 rounded-full bg-primary px-7 text-primary-foreground">
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="#how-it-works">
              <Button
                variant="secondary"
                className="btn-3d btn-glow h-12 rounded-full border border-border/70 bg-secondary/80 px-7 text-foreground"
              >
                How It Works
              </Button>
            </Link>
          </div>

          <div id="how-it-works" className="mt-20 grid w-full max-w-5xl gap-4 md:grid-cols-3">
            <div className="card-3d rounded-2xl border border-border/70 bg-card/75 p-6 text-left backdrop-blur-xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-[var(--font-heading)] text-lg font-semibold">
                Connect Wallet
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Users connect an EVM wallet and choose an NFT they own as the source identity.
              </p>
            </div>

            <div className="card-3d rounded-2xl border border-border/70 bg-card/75 p-6 text-left backdrop-blur-xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-[var(--font-heading)] text-lg font-semibold">
                Generate Personality
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Claude helps generate structured personality data, behavior rules, tone, and identity metadata.
              </p>
            </div>

            <div className="card-3d rounded-2xl border border-border/70 bg-card/75 p-6 text-left backdrop-blur-xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-[var(--font-heading)] text-lg font-semibold">
                Preview Identity
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Users chat with the generated identity, adjust settings, and save or mint when ready.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}