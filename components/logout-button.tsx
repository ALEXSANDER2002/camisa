"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      console.log("Iniciando logout...")

      // Limpar qualquer estado local
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_creation_attempted")
        console.log("Estado local limpo")
      }

      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Erro ao fazer logout no Supabase:", error)
        throw error
      }

      console.log("Logout no Supabase concluído com sucesso")

      // Redirecionar para a página de login
      console.log("Redirecionando para a página de login...")
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      alert("Erro ao fazer logout. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? "Saindo..." : "Sair"}
    </Button>
  )
}

