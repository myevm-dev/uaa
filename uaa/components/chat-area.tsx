"use client"

import {
  Settings,
  Upload,
  Sparkles,
  FileText,
  Bot,
  Mic,
  ArrowUp,
  Paperclip,
  X,
  Check,
  SlidersHorizontal,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ParticleOrb } from "@/components/particle-orb"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { AppMode } from "@/app/page"

type ChatAreaProps = {
  mode: AppMode
}

export function ChatArea({ mode }: ChatAreaProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [configDropdownOpen, setConfigDropdownOpen] = useState(false)
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  const isCreateMode = mode === "create"
  const isChatMode = mode === "chat"
  const isManageMode = mode === "manage"

  const handleSend = () => {
    const text = input.trim()
    if (!text || isStreaming) return

    const modePrefix = isCreateMode
      ? "Platform AI metadata builder request:"
      : isChatMode
        ? "Character chat request:"
        : "Manager request:"

    sendMessage({ text: `${modePrefix}\n${text}` })
    setInput("")
  }

  if (isManageMode) {
    return (
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
        <div className="absolute inset-0 opacity-[0.12] grid-background" />

        <div className="relative z-10 flex flex-1 items-center justify-center p-8">
          <div className="card-3d max-w-2xl rounded-3xl border border-border/70 bg-card/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Layers className="h-7 w-7" />
            </div>

            <h1 className="mb-3 font-[var(--font-heading)] text-4xl font-semibold text-foreground">
              Manage Identities
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              This will become the control center for drafts, minted identities, metadata versions, contract settings, and NFT bindings.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="shader-orb shader-orb-1" />
        <div className="shader-orb shader-orb-2" />
        <div className="shader-orb shader-orb-3" />
      </div>

      <div className="absolute inset-0 opacity-[0.12] grid-background" />


      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-6">
        {messages.length === 0 ? (
          <>
            <div className="relative mb-7">
              <ParticleOrb />
            </div>

            <div className="mb-8 max-w-3xl text-center">
              <h1 className="mb-3 font-[var(--font-heading)] text-4xl font-semibold tracking-tight text-foreground">
                {isCreateMode
                  ? "Create a Universal Autonomous Account"
                  : "Chat with an Autonomous Identity"}
              </h1>

              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {isCreateMode
                  ? "Talk to the platform AI to generate structured personality metadata, behavior rules, and system prompts for a new identity NFT."
                  : "Select one of your AI characters from the sidebar and chat with its generated personality."}
              </p>
            </div>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="secondary"
                className="btn-3d btn-glow gap-2 border border-border/50 bg-secondary/80 text-foreground shadow-lg backdrop-blur-sm hover:bg-secondary"
                onClick={() =>
                  sendMessage({
                    text: isCreateMode
                      ? "Generate a full Universal Autonomous Account personality metadata profile."
                      : "Start a chat as the selected autonomous identity.",
                  })
                }
              >
                <Sparkles className="h-4 w-4" />
                {isCreateMode ? "Generate Metadata" : "Start Chat"}
              </Button>

              <Button
                variant="secondary"
                className="btn-3d btn-glow gap-2 border border-border/50 bg-secondary/80 text-foreground shadow-lg backdrop-blur-sm hover:bg-secondary"
                onClick={() =>
                  sendMessage({
                    text: isCreateMode
                      ? "Help me refine the traits, boundaries, and speaking style for this identity."
                      : "Explain this character's personality and how it should respond.",
                  })
                }
              >
                <Bot className="h-4 w-4" />
                {isCreateMode ? "Refine Traits" : "Identity Info"}
              </Button>

              <Button
                variant="secondary"
                className="btn-3d btn-glow gap-2 border border-border/50 bg-secondary/80 text-foreground shadow-lg backdrop-blur-sm hover:bg-secondary"
                onClick={() =>
                  sendMessage({
                    text: "Create a clean NFT metadata JSON structure for this AI identity.",
                  })
                }
              >
                <FileText className="h-4 w-4" />
                Export Metadata
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-4xl flex-1 space-y-6 overflow-y-auto py-6">
            {messages.map((message) => {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/60 bg-card/80 text-card-foreground backdrop-blur-sm"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              )
            })}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full max-w-4xl">
          {isRecording && (
            <div className="input-3d mb-3 rounded-full border border-border/60 bg-card/90 px-6 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="flex items-center justify-between gap-6">
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                  <p className="text-sm font-medium text-foreground">Recording...</p>
                </div>

                <div className="flex h-10 flex-1 items-center justify-center gap-[2px] overflow-hidden">
                  {[...Array(60)].map((_, i) => (
                    <div
                      key={i}
                      className="voice-wave-bar-horizontal shrink-0 rounded-full bg-foreground/70"
                      style={{
                        width: "2px",
                        animationDelay: `${-i * 0.03}s`,
                        animationDirection: "reverse",
                      }}
                    />
                  ))}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="btn-3d h-8 w-8 rounded-full bg-secondary/60 text-foreground hover:bg-destructive/20 hover:text-destructive"
                    onClick={() => setIsRecording(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    className="btn-3d btn-glow h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-xl"
                    onClick={() => setIsRecording(false)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="input-3d rounded-2xl border border-border/70 bg-card/85 p-4 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder={
                    isCreateMode
                      ? "Ask the platform AI to build or refine this identity..."
                      : "Ask this identity anything..."
                  }
                  className="min-h-[80px] flex-1 resize-none border-none bg-transparent text-lg font-normal text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                    Attach
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {isCreateMode ? "Metadata" : "Traits"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="btn-3d h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsRecording(true)}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    className="btn-3d btn-glow h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-xl disabled:opacity-50"
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}