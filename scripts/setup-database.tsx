"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, ArrowLeft, ExternalLink, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { checkTableExists } from "@/lib/actions"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function SetupDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Verificar se o Supabase está configurado
  const supabaseConfigured = isSupabaseConfigured()

  const checkDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Verificar se o Supabase está configurado
      if (!supabaseConfigured) {
        setResult({
          success: false,
          message: "O Supabase não está configurado. Configure as variáveis de ambiente primeiro.",
        })
        return
      }

      // Verificar se a tabela existe
      const exists = await checkTableExists()

      if (exists) {
        setResult({
          success: true,
          message: "A tabela já existe e está pronta para uso!",
        })
      } else {
        setResult({
          success: false,
          message: "A tabela ainda não existe. Por favor, siga as instruções abaixo para criá-la manualmente.",
        })
      }
    } catch (error) {
      console.error("Erro ao verificar banco de dados:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao verificar banco de dados",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!supabaseConfigured) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-pink-100 feminine-shadow">
        <CardHeader className="bg-pink-50 border-b border-pink-100">
          <CardTitle className="flex items-center text-pink-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Configuração do Supabase ausente
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4">
            As variáveis de ambiente do Supabase não estão configuradas. Você precisa configurar as seguintes variáveis
            de ambiente:
          </p>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <code className="block mb-2">NEXT_PUBLIC_SUPABASE_URL</code>
            <code className="block">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </div>

          <div className="mt-6 p-4 bg-pink-50 rounded-md">
            <h4 className="font-medium text-pink-800">Como configurar:</h4>
            <ol className="mt-2 space-y-2 list-decimal pl-5">
              <li>
                Crie um projeto no{" "}
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  Supabase
                </a>
              </li>
              <li>Obtenha a URL e a chave anônima nas configurações do projeto</li>
              <li>Adicione essas variáveis ao seu arquivo .env.local na raiz do projeto:</li>
            </ol>
            <pre className="mt-4 p-3 bg-white rounded-md border border-pink-100 text-sm">
              {`NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase`}
            </pre>
            <p className="mt-4 text-sm">
              Depois de configurar essas variáveis, reinicie o servidor de desenvolvimento.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-pink-50/50 border-t border-pink-100 flex justify-between">
          <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-pink-200">
              <ExternalLink className="h-4 w-4 mr-2" />
              Acessar Supabase
            </Button>
          </a>
          <Link href="/">
            <Button className="bg-pink-500 hover:bg-pink-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Início
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Configuração do Banco de Dados</CardTitle>
        <CardDescription>Siga as instruções abaixo para configurar a tabela de camisetas no Supabase.</CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <div
            className={`p-4 mb-4 rounded-md flex items-start gap-2 ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{result.success ? "Sucesso!" : "Atenção!"}</p>
              <p className="text-sm">{result.message}</p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-medium">Instruções para criar a tabela manualmente:</h3>
          <ol className="mt-2 space-y-2 list-decimal pl-4">
            <li>
              Acesse o{" "}
              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline inline-flex items-center"
              >
                painel do Supabase <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
            </li>
            <li>Selecione seu projeto</li>
            <li>Vá para a seção "SQL Editor" no menu lateral</li>
            <li>Clique em "New Query"</li>
            <li>Cole o seguinte SQL e execute:</li>
          </ol>
          <pre className="mt-4 p-4 bg-pink-50/50 rounded-lg text-xs overflow-auto border border-pink-100">
            {`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE shirts (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
size TEXT NOT NULL,
color TEXT NOT NULL,
material TEXT NOT NULL,
quantity INTEGER NOT NULL,
price DECIMAL(10, 2) NOT NULL,
description TEXT,
paid BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
model_number INTEGER,
order_group UUID,
image_url TEXT,
payment_proof_url TEXT,
payment_method TEXT,
ticket_type TEXT,
ticket_price DECIMAL(10, 2)
);

-- Inserir um exemplo inicial
INSERT INTO shirts (name, size, color, material, quantity, price, description, paid, model_number, order_group)
VALUES (
'Ana Silva',
'M',
'Rosa',
'100% Algodão',
1,
39.90,
'Camiseta básica rosa.',
false,
1,
uuid_generate_v4()
);`}
          </pre>

          <div className="mt-6 p-4 bg-pink-50 rounded-md">
            <h4 className="font-medium text-pink-800">Importante:</h4>
            <p className="text-sm text-pink-700 mt-1">
              Note que adicionamos a linha <code>CREATE EXTENSION IF NOT EXISTS "uuid-ossp";</code> no início do script.
              Isso é necessário para habilitar a função <code>uuid_generate_v4()</code> que é usada para gerar IDs
              únicos.
            </p>
            <p className="text-sm text-pink-700 mt-2">
              Também adicionamos as colunas <code>payment_proof_url</code> e <code>payment_method</code> para suportar o
              pagamento via PIX.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={checkDatabase} disabled={isLoading} className="w-full bg-pink-500 hover:bg-pink-600">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar se a tabela existe"
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
  )
}

