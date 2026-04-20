"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { exportAsBeautifulPDF } from "@/lib/document-template"

interface BeautifulExportButtonProps {
    filename: string
    title: string
    data: any
    subtitle?: string
    columns?: string[]
    sections?: Array<{ heading: string; content: string | string[] }>
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
    size?: "default" | "sm" | "lg"
    className?: string
}

/**
 * Button component for downloading beautifully formatted documents
 * with company branding and professional template
 */
export function BeautifulExportButton({
    filename,
    title,
    data,
    subtitle,
    columns,
    sections,
    variant = "outline",
    size = "sm",
    className,
}: BeautifulExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)
    const { toast } = useToast()

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await exportAsBeautifulPDF(filename, title, data, {
                subtitle,
                columns,
                sections,
            })

            toast({
                title: "Success",
                description: `${filename} has been downloaded with professional formatting.`,
            })
        } catch (error) {
            console.error("Export failed:", error)
            toast({
                title: "Export Failed",
                description: "Unable to generate the document. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            variant={variant}
            size={size}
            className={className}
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </>
            )}
        </Button>
    )
}
