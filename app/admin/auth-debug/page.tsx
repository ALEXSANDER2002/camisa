"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthDebugPage() {
  const [authState, setAuthState] = useState<{
    session: any | null
    user: any | null
    cookies: any
    error: string | null
  }>({
    session: null,
    user: null,
    cookies: {},
    error: null,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar sessão
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        // Verificar usuário
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        // Obter cookies (apenas os nomes)
        const cookieNames = document.cookie.split(";").map((cookie) => cookie.trim().split("=")[0])

        setAuthState({
          session,
          user,
          cookies: cookieNames,
          error: sessionError?.message || userError?.message || null,
        })
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        }))
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Diagnóstico de Autenticação</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando informações de autenticação...</p>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium mb-2">Estado da Sessão:</h3>
                <pre className="text-xs overflow-auto bg-white p-2 rounded border">
                  {JSON.stringify(authState.session, null, 2) || "Nenhuma sessão encontrada"}
                </pre>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium mb-2">Usuário:</h3>
                <pre className="text-xs overflow-auto bg-white p-2 rounded border">
                  {JSON.stringify(authState.user, null, 2) || "Nenhum usuário encontrado"}
                </pre>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium mb-2">Cookies:</h3>
                <pre className="text-xs overflow-auto bg-white p-2 rounded border">
                  {JSON.stringify(authState.cookies, null, 2) || "Nenhum cookie encontrado"}
                </pre>
              </div>

              {authState.error && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-700 mb-2">Erro:</h3>
                  <p className="text-red-600">{authState.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/login">
            <Button variant="outline">Voltar para Login</Button>
          </Link>
          <Button onClick={() => window.location.reload()}>Atualizar Informações</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

