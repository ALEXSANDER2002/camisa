"use client"

import { useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export default function TestConnection() {
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const supabaseConfigured = isSupabaseConfigured()

  const testConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Verificar se o Supabase está configurado
      if (!supabaseConfigured) {
        setResult({
          success: false,
          message: "O Supabase não está configurado. Verifique as variáveis de ambiente.",
          details: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 0,
          },
        })
        return
      }

      // Testar a conexão com o Supabase
      const { data, error } = await supabase.from("shirts").select("count").limit(1)

      if (error) {
        setResult({
          success: false,
          message: "Erro ao conectar com o Supabase",
          details: error,
        })
      } else {
        setResult({
          success: true,
          message: "Conexão com o Supabase estabelecida com sucesso!",
          details: data,
        })
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error)
      setResult({
        success: false,
        message: "Erro ao testar conexão",
        details: error instanceof Error ? error.message : error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Teste de Conexão com o Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2">Informações de Configuração:</h3>
              <p>
                <strong>Supabase configurado:</strong> {supabaseConfigured ? "Sim" : "Não"}
              </p>
              <p>
                <strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || "Não definida"}
              </p>
              <p>
                <strong>Chave anônima:</strong>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? `Definida (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length} caracteres)`
                  : "Não definida"}
              </p>
            </div>

            {result && (
              <div className={`p-4 rounded-lg ${result.success ? "bg-green-50" : "bg-red-50"}`}>
                <h3 className={`font-medium ${result.success ? "text-green-700" : "text-red-700"}`}>
                  {result.success ? "Sucesso!" : "Erro!"}
                </h3>
                <p className="mt-1">{result.message}</p>
                {result.details && (
                  <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/">
            <Button variant="outline">Voltar</Button>
          </Link>
          <Button onClick={testConnection} disabled={isLoading} className="bg-pink-500 hover:bg-pink-600">
            {isLoading ? "Testando..." : "Testar Conexão"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

