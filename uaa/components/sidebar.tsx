"use client"

import {
  BadgeCheck,
  Bot,
  CirclePlus,
  GalleryVerticalEnd,
  ImageIcon,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type MockNft = {
  id: string
  name: string
  collection: string
  tokenId: string
  imageGradient: string
  traits: string[]
}

const mockNfts: MockNft[] = [
  {
    id: "1",
    name: "Neon Seeker",
    collection: "Genesis Avatars",
    tokenId: "102",
    imageGradient: "from-fuchsia-500 via-purple-500 to-cyan-400",
    traits: ["Curious", "Analytical", "Electric"],
  },
  {
    id: "2",
    name: "Archive Ghost",
    collection: "Memory Relics",
    tokenId: "44",
    imageGradient: "from-slate-300 via-blue-500 to-indigo-700",
    traits: ["Quiet", "Strategic", "Historical"],
  },
  {
    id: "3",
    name: "Solar Warden",
    collection: "Autonomous Keys",
    tokenId: "777",
    imageGradient: "from-amber-300 via-orange-500 to-red-600",
    traits: ["Bold", "Protective", "Creative"],
  },
]

export function Sidebar() {
  const [selectedNftId, setSelectedNftId] = useState(mockNfts[0]?.id ?? "")

  const selectedNft = mockNfts.find((nft) => nft.id === selectedNftId)

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-accent">
            <Bot className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="font-[var(--font-heading)] text-base font-semibold text-sidebar-foreground">
              Identity Source
            </h2>
            <p className="text-xs text-muted-foreground">
              Select an NFT to shape the AI
            </p>
          </div>
        </div>
      </div>

      {/* Create Identity Button */}
      <div className="p-3">
        <Button
          variant="secondary"
          className="btn-3d btn-glow w-full justify-start gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
        >
          <CirclePlus className="h-4 w-4" />
          Create New Identity
        </Button>
      </div>

      {/* Selected NFT */}
      {selectedNft && (
        <div className="px-3 pb-3">
          <div className="card-3d rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
            <div
              className={`mb-3 flex h-36 w-full items-center justify-center rounded-xl bg-gradient-to-br ${selectedNft.imageGradient}`}
            >
              <Sparkles className="h-10 w-10 text-white drop-shadow-lg" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-sidebar-foreground">
                  {selectedNft.name}
                </h3>
                <BadgeCheck className="h-4 w-4 text-primary" />
              </div>

              <p className="text-xs text-muted-foreground">
                {selectedNft.collection} #{selectedNft.tokenId}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedNft.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-sidebar-border bg-background/30 px-2 py-1 text-[11px] text-muted-foreground"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NFT List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <div className="mb-4">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Owned NFTs
          </h3>

          <div className="space-y-2">
            {mockNfts.map((nft) => {
              const isSelected = nft.id === selectedNftId

              return (
                <button
                  key={nft.id}
                  type="button"
                  onClick={() => setSelectedNftId(nft.id)}
                  className={`btn-3d flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-primary/60 bg-sidebar-accent text-sidebar-foreground"
                      : "border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/70"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${nft.imageGradient}`}
                  >
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{nft.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {nft.collection} #{nft.tokenId}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Draft Identities
          </h3>

          <Button
            variant="ghost"
            className="btn-3d w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <GalleryVerticalEnd className="h-4 w-4" />
            No saved drafts yet
          </Button>
        </div>
      </div>

      {/* Footer Card */}
      <div className="p-3">
        <div className="card-3d rounded-xl bg-sidebar-accent p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-sidebar-foreground">
              Preview before minting
            </h4>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Generate a personality, test it in chat, then save or mint the final identity NFT.
          </p>
        </div>
      </div>
    </aside>
  )
}