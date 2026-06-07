import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Navbar />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  )
}