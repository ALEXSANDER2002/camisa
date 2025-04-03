"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, AlertCircle, RefreshCw, ArrowLeft, Code, Cpu, ChevronRight, Server, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@boutique.com")
  const [password, setPassword] = useState("Admin@123")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  // Verificar se já está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        console.log("Usuário já autenticado, redirecionando para dashboard")
        router.push("/admin/dashboard")
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Tentando fazer login com:", email)

      // Fazer login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        console.error("Erro ao fazer login:", loginError)
        throw loginError
      }

      console.log("Login bem-sucedido:", data)

      // Verificar se a sessão foi criada
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Erro ao obter sessão:", sessionError)
        throw sessionError
      }

      if (!session) {
        console.error("Sessão não foi criada após login")
        throw new Error("Sessão não foi criada após login")
      }

      console.log("Sessão criada com sucesso:", session)

      // Redirecionar para o dashboard
      console.log("Redirecionando para o dashboard...")
      router.push("/admin/dashboard")
    } catch (err) {
      console.error("Erro completo:", err)
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const createAdminUser = async () => {
    setIsCreatingAdmin(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Tentar criar o usuário administrador
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "admin",
          },
        },
      })

      if (error) {
        if (error.message.includes("already registered")) {
          // Se o usuário já existe, tentar redefinir a senha
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)

          if (resetError) {
            throw resetError
          }

          setSuccessMessage("O usuário já existe. Um email de redefinição de senha foi enviado.")
        } else {
          throw error
        }
      } else {
        setSuccessMessage("Usuário administrador criado com sucesso! Verifique seu email para confirmar a conta.")
      }
    } catch (err) {
      console.error("Erro ao criar administrador:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar administrador")
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-800 to-violet-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full opacity-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full" 
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: `0 0 ${Math.random() * 30 + 10}px rgba(100, 255, 255, 0.4)`,
              }}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-violet-900 to-transparent opacity-80"></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-blue-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-violet-500"></div>
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-violet-500 via-indigo-500 to-blue-500"></div>
        
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-5">
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-4 rounded-xl shadow-lg">
              <Cpu className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            Bits Jr Admin
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Acesse o painel administrativo da Bits Jr
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-gray-700">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center text-gray-700">
                <Lock className="h-4 w-4 mr-2 text-blue-600" />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Início
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
        
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>
      </Card>
    </div>
  )
}

