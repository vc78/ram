"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Mail, MessageCircle, LinkIcon } from "lucide-react"
import { share, shareViaGmail, shareViaWhatsApp, createSecureLink, type ShareData } from "@/lib/share-utils"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  data: ShareData
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
}

export function ShareButton({ data, variant = "outline", size = "sm", showText = true, className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleShare = async (method: "auto" | "gmail" | "whatsapp" | "link") => {
    try {
      if (method === "link") {
        // Create and copy secure link
        const link = createSecureLink(data.url || window.location.href, "general")
        try {
          await navigator.clipboard.writeText(link)
          toast({
            title: "Link Copied",
            description: "Secure share link copied to clipboard",
          })
        } catch (clipboardError) {
          // Fallback for clipboard API
          console.warn("Clipboard API not supported, using fallback", clipboardError)
          const textarea = document.createElement("textarea")
          textarea.value = link
          textarea.style.position = "fixed"
          textarea.style.left = "-9999px"
          document.body.appendChild(textarea)
          textarea.select()
          try {
            document.execCommand("copy")
            toast({
              title: "Link Copied",
              description: "Secure share link copied to clipboard",
            })
          } catch {
            toast({
              title: "Copy Failed",
              description: "Could not copy link. Please try again.",
              variant: "destructive",
            })
          }
          document.body.removeChild(textarea)
        }
      } else if (method === "gmail") {
        shareViaGmail(data)
        toast({
          title: "Opening Gmail",
          description: "Gmail compose window opened",
        })
      } else if (method === "whatsapp") {
        shareViaWhatsApp(data)
        toast({
          title: "Opening WhatsApp",
          description: "WhatsApp opened for sharing",
        })
      } else {
        const success = await share(data, { method })
        if (success) {
          toast({
            title: "Shared Successfully",
            description: "Content shared successfully",
          })
        }
      }
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share content. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4" />
          {showText && <span className="ml-2">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={() => handleShare("auto")}>
            <Share2 className="w-4 h-4 mr-2" />
            Share...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleShare("gmail")}>
          <Mail className="w-4 h-4 mr-2" />
          Gmail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("link")}>
          <LinkIcon className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
