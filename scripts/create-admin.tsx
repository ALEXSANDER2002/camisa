"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export default function CreateAdmin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      // Criar um novo usuário administrador
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      setResult({
        success: true,
        message: `Usuário administrador criado com sucesso! Um email de confirmação foi enviado para ${email}.`,
      })

      // Limpar o formulário
      setEmail("")
      setPassword("")
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao criar usuário administrador",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Criar Administrador</CardTitle>
        <CardDescription>Use este formulário para criar um novo usuário administrador para o sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert className={`mb-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email do Administrador</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemplo.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Senha</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha forte"
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">A senha deve ter pelo menos 6 caracteres.</p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateAdmin} disabled={isLoading} className="w-full bg-pink-500 hover:bg-pink-600">
          {isLoading ? "Criando..." : "Criar Administrador"}
        </Button>
      </CardFooter>
    </Card>
  )
}

