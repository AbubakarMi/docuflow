"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, X } from "lucide-react"
import { ChatBox } from "./ChatBox"

interface Conversation {
  business: {
    id: string
    name: string
  }
  lastMessage: {
    message: string
    createdAt: string
    sender: {
      firstName: string
      lastName: string
      isSuperAdmin: boolean
    }
  }
  unreadCount: number
}

interface ChatSidebarProps {
  currentUserId: string
  currentUserBusinessId?: string
  currentUserBusinessName?: string
  isSuperAdmin: boolean
}

export function ChatSidebar({ currentUserId, currentUserBusinessId, currentUserBusinessName, isSuperAdmin }: ChatSidebarProps) {
  const [open, setOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; name: string } | null>(null)
  const [totalUnread, setTotalUnread] = useState(0)

  useEffect(() => {
    if (open) {
      if (isSuperAdmin) {
        fetchConversations()
      } else if (currentUserBusinessId && currentUserBusinessName) {
        // For business users, directly set their business
        setSelectedBusiness({ id: currentUserBusinessId, name: currentUserBusinessName })
      }
    }

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      if (isSuperAdmin) {
        fetchConversations()
      } else {
        fetchUnreadCount()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [open, isSuperAdmin, currentUserBusinessId])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()

      if (data.success && data.conversations) {
        setConversations(data.conversations)
        const unread = data.conversations.reduce((sum: number, conv: Conversation) => sum + conv.unreadCount, 0)
        setTotalUnread(unread)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const fetchUnreadCount = async () => {
    if (!currentUserBusinessId) return

    try {
      const response = await fetch(`/api/chat?businessId=${currentUserBusinessId}`)
      const data = await response.json()

      if (data.success && data.messages) {
        const unread = data.messages.filter((msg: any) =>
          !msg.isRead && msg.sender.isSuperAdmin
        ).length
        setTotalUnread(unread)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`
    return date.toLocaleDateString()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {totalUnread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnread > 9 ? '9+' : totalUnread}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[500px] p-0">
        {!selectedBusiness ? (
          <>
            <SheetHeader className="p-6 border-b">
              <SheetTitle>Messages</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <button
                      key={conv.business.id}
                      onClick={() => setSelectedBusiness(conv.business)}
                      className="w-full p-4 hover:bg-accent transition-colors text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{conv.business.name}</h4>
                        <div className="flex items-center gap-2">
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-2 text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {conv.lastMessage.sender.isSuperAdmin ? 'You: ' : `${conv.lastMessage.sender.firstName}: `}
                        {conv.lastMessage.message}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBusiness(null)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Back
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatBox
                businessId={selectedBusiness.id}
                businessName={selectedBusiness.name}
                currentUserId={currentUserId}
                isSuperAdmin={isSuperAdmin}
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
