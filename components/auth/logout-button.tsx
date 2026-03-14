"use client"

import { Button } from "@/components/ui/button"
import { logout as localLogout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
    const router = useRouter()
    const handleClick = () => {
        localLogout()
        router.push("/")
    }

    return (
        <Button size="sm" variant="outline" onClick={handleClick}>
            Logout
        </Button>
    )
}
