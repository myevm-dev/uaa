"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"

export type AppMode = "chat" | "manage" | "create"

export default function Home() {
  const [mode, setMode] = useState<AppMode>("create")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Navbar
        mode={mode}
        setMode={setMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar mode={mode} setMode={setMode} />}

        <ChatArea mode={mode} />
      </div>
    </div>
  )
}