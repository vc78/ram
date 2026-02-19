"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/i18n/translations"

const languages = [
  { code: "en" as Language, name: "English", nativeName: "English" },
  { code: "te" as Language, name: "Telugu", nativeName: "తెలుగు" },
  { code: "hi" as Language, name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta" as Language, name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn" as Language, name: "Kannada", nativeName: "ಕನ್ನಡ" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
            {languages.find((l) => l.code === language)?.nativeName || "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="font-medium">{lang.nativeName}</div>
              <div className="text-xs text-muted-foreground">{lang.name}</div>
            </div>
            {language === lang.code && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
