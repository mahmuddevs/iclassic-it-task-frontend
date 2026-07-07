import { useState, useEffect, useRef } from "react"
import { useAppSelector } from "../../store/store"
import { io, type Socket } from "socket.io-client"
import { getFetch } from "../../utils/getFetch"
import {
  ChatCircleDotsIcon,
  XIcon,
  PaperPlaneRightIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"

interface Message {
  id: string;
  sender: "me" | "other";
  senderName?: string;
  senderRole?: string;
  text: string;
  timestamp: Date;
}

interface BackendMessage {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  createdAt: string;
}

interface SocketBroadcastMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  createdAt: string;
}

export default function Chat() {
  const user = useAppSelector((state) => state.auth.user)
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [inputVal, setInputVal] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

  const chatEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const isOpenRef = useRef(isOpen)

  // Maintain isOpen value inside a ref to keep WebSocket listeners stable
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  // Fetch initial chat history
  useEffect(() => {
    if (!user) return

    getFetch<{ data: BackendMessage[] }>("/chat/messages", { private: true })
      .then((res) => {
        if (res && res.data) {
          const mapped: Message[] = res.data.map((msg: BackendMessage) => ({
            id: msg._id,
            sender: msg.senderId === user?._id ? "me" : "other",
            senderName: msg.senderName,
            senderRole: msg.senderRole,
            text: msg.text,
            timestamp: new Date(msg.createdAt),
          }))
          setMessages(mapped)

          // Calculate unread count for messages arrived while offline
          const lastRead = localStorage.getItem(`chat_last_read_${user?._id}`)
          if (lastRead && !isOpenRef.current) {
            const lastReadTime = new Date(lastRead).getTime()
            const unread = mapped.filter((msg) =>
              msg.sender === "other" && new Date(msg.timestamp).getTime() > lastReadTime
            ).length
            setUnreadCount(unread)
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load chat history", err)
      })
  }, [user])

  // Configure Socket.io connection and real-time event listeners
  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    const socket = io(import.meta.env.VITE_API_BACKEND_URL as string, {
      withCredentials: true,
    })
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Connected to Chat WebSocket server")
    })

    socket.on("new_message", (message: SocketBroadcastMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev
        return [
          ...prev,
          {
            id: message.id,
            sender: message.senderId === user?._id ? "me" : "other",
            senderName: message.senderName,
            senderRole: message.senderRole,
            text: message.text,
            timestamp: new Date(message.createdAt),
          },
        ]
      })

      // Increment badge count if panel is closed and message belongs to another user
      if (!isOpenRef.current && message.senderId !== user?._id) {
        setUnreadCount((count) => count + 1)
      }
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Update last read timestamp in localStorage when chat is open
  useEffect(() => {
    const updateLastRead = () => {
      if (isOpen && user) {
        localStorage.setItem(`chat_last_read_${user._id}`, new Date().toISOString())
        setUnreadCount(0)
      }
    }
    updateLastRead()
  }, [isOpen, messages, user])

  const handleSend = (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!inputVal.trim()) return

    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", { text: inputVal.trim() })
      setInputVal("")
    }
  }

  // Generate initials for active user avatar
  const userInitials = user
    ? `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase()
    : "ME"

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase()
  }

  return (
    <div className="fixed bottom-6 inset-e-4 xs:inset-e-6 z-50 select-none font-sans">
      {/* Floating Circle Launcher Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-none duration-300"
        >
          <ChatCircleDotsIcon size={28} />

          {/* Unread dot notification bubble */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -inset-e-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white text-[10px] font-extrabold text-white flex items-center justify-center shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window popup dashboard */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-125 max-h-[calc(100vh-8rem)] bg-background-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header section matching group chat specs */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-background-card">
            <div className="flex items-center gap-3">
              {/* Group Chat Avatar */}
              <div className="relative w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
                <UsersThreeIcon size={22} />
                {/* Active Green Online Dot */}
                <span className="absolute bottom-0 inset-e-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-foreground text-xs leading-none">Global Workspace Chat</h4>
                <span className="text-[10px] text-secondary font-semibold mt-1 block">Active team discussion channel</span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-secondary hover:text-foreground p-1.5 rounded-lg hover:bg-background transition-all cursor-pointer border-none bg-transparent"
            >
              <XIcon size={18} />
            </button>
          </div>

          {/* Body: Scrollable message log flow */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/20 scrollbar-thin">
            {messages.map((msg) => {
              const isMe = msg.sender === "me"
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {/* Left Avatar (for group participants) */}
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-2xs">
                      {getInitials(msg.senderName)}
                    </div>
                  )}

                  {/* Message Bubble text container */}
                  <div className="max-w-[72%] text-left">
                    {!isMe && (
                      <span className="text-[10px] text-secondary font-bold block mb-1 ms-1">
                        {msg.senderName} • <span className="font-normal opacity-85">{msg.senderRole}</span>
                      </span>
                    )}
                    <div
                      className={`text-xs p-3 rounded-2xl leading-relaxed ${isMe
                        ? "bg-primary text-white rounded-tr-xs shadow-xs"
                        : "bg-background-card border border-border text-foreground rounded-tl-xs shadow-2xs"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Right Avatar (for active user) */}
                  {isMe && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
                      {userInitials}
                    </div>
                  )}
                </div>
              )
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Footer input form area */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-border bg-background-card flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Post a message to team..."
              className="flex-1 bg-background border border-border px-4 h-11 text-xs rounded-xl outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-secondary"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed shadow-xs cursor-pointer border-none"
            >
              <PaperPlaneRightIcon size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
