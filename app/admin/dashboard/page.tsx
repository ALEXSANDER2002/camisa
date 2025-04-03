"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import InventoryDashboard from "@/components/inventory-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Cpu, Users, AlertTriangle, Server, Database } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Verificando autenticação...")

        // Verificar sessão atual
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          throw new Error(sessionError.message)
        }

        if (!session) {
          console.log("Nenhuma sessão encontrada, redirecionando para login")
          router.push("/admin/login")
          return
        }

        console.log("Sessão encontrada:", session)

        // Obter informações do usuário
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(userError.message)
        }

        if (!user) {
          console.log("Nenhum usuário encontrado, redirecionando para login")
          router.push("/admin/login")
          return
        }

        console.log("Usuário encontrado:", user)
        setUser(user)
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err)
        setError(err instanceof Error ? err.message : "Erro ao verificar autenticação")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-800 to-violet-900 p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error || "Você precisa estar autenticado para acessar esta página"}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/admin/login")} className="w-full">
            Voltar para Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-violet-700 py-6 px-4 mb-8 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center text-white mb-4 sm:mb-0 text-center sm:text-left">
            <Cpu className="h-8 w-8 mr-3" />
            Bits Jr Admin
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full text-white flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {user.email}
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 animate-fade-in">
        <InventoryDashboard />
      </div>
    </main>
  )
}

