"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UpdateSchema() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const updateSchema = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Verificar se a tabela existe
      const { data: tableExists, error: tableError } = await supabase
        .from("shirts")
        .select("*")
        .limit(1)

      if (tableError) {
        setResult({
          success: false,
          message: `Erro ao verificar a tabela: ${tableError.message}`,
        })
        return
      }

      // Adicionar campo ticket_type
      const { error: typeError } = await supabase.rpc(
        "execute_sql",
        { query: "ALTER TABLE shirts ADD COLUMN IF NOT EXISTS ticket_type TEXT" }
      )

      if (typeError) {
        setResult({
          success: false,
          message: `Erro ao adicionar campo ticket_type: ${typeError.message}`,
        })
        return
      }

      // Adicionar campo ticket_price
      const { error: priceError } = await supabase.rpc(
        "execute_sql",
        { query: "ALTER TABLE shirts ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10, 2)" }
      )

      if (priceError) {
        setResult({
          success: false,
          message: `Erro ao adicionar campo ticket_price: ${priceError.message}`,
        })
        return
      }

      setResult({
        success: true,
        message: "Campos adicionados com sucesso!",
      })
    } catch (error) {
      setResult({
        success: false,
        message: `Erro inesperado: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Card className="border-pink-100 shadow-md">
        <CardHeader className="bg-pink-50 border-b border-pink-100">
          <CardTitle className="text-center text-lg text-pink-800">Atualizar Schema do Banco de Dados</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Este script irá adicionar novos campos à tabela &quot;shirts&quot; no Supabase:
            </p>
            <ul className="list-disc ml-5 text-sm text-slate-600 space-y-1">
              <li><code className="text-pink-600">ticket_type</code> - Tipo de ingresso (inteira ou meia)</li>
              <li><code className="text-pink-600">ticket_price</code> - Preço do ingresso</li>
            </ul>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-slate-500 mt-4">
              Nota: Este script tenta usar a função RPC <code>execute_sql</code>. Se você encontrar erros relacionados a permissões,
              talvez precise executar o SQL manualmente no painel do Supabase.
            </p>

            <div className="p-3 bg-pink-50 rounded-md">
              <p className="text-sm font-medium text-pink-700 mb-2">Executar manualmente:</p>
              <pre className="text-xs bg-white p-2 rounded border border-pink-100 overflow-auto">
                ALTER TABLE shirts ADD COLUMN IF NOT EXISTS ticket_type TEXT;
                ALTER TABLE shirts ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10, 2);
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={updateSchema} disabled={isLoading} className="w-full bg-pink-500 hover:bg-pink-600">
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar Schema"
            )}
          </Button>

          {result?.success && (
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full border-pink-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Inventário
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
} 