"use client"

import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, XCircle, AlertTriangle, Database, Table, RefreshCw } from "lucide-react"

export default function DiagnosticPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [diagnostics, setDiagnostics] = useState<{
    connection: { status: "success" | "error" | "pending"; message: string }
    tableExists: { status: "success" | "error" | "pending"; message: string }
    tableStructure: { status: "success" | "error" | "pending"; message: string; details?: any }
    tableData: { status: "success" | "error" | "pending"; message: string; count?: number }
  }>({
    connection: { status: "pending", message: "Aguardando verificação" },
    tableExists: { status: "pending", message: "Aguardando verificação" },
    tableStructure: { status: "pending", message: "Aguardando verificação" },
    tableData: { status: "pending", message: "Aguardando verificação" },
  })

  const supabaseConfigured = isSupabaseConfigured()

  const runDiagnostics = async () => {
    setIsLoading(true)

    // Reset diagnostics
    setDiagnostics({
      connection: { status: "pending", message: "Verificando conexão..." },
      tableExists: { status: "pending", message: "Aguardando..." },
      tableStructure: { status: "pending", message: "Aguardando..." },
      tableData: { status: "pending", message: "Aguardando..." },
    })

    // 1. Verificar conexão com o Supabase
    if (!supabaseConfigured) {
      setDiagnostics((prev) => ({
        ...prev,
        connection: {
          status: "error",
          message: "O Supabase não está configurado. Verifique as variáveis de ambiente.",
        },
      }))
      setIsLoading(false)
      return
    }

    try {
      // Testar conexão básica
      const { data: connectionData, error: connectionError } = await supabase.from("_tables").select("*").limit(1)

      if (connectionError && connectionError.message.includes("does not exist")) {
        // Este erro específico é esperado, pois a tabela _tables pode não existir ou não ser acessível
        // Mas indica que a conexão está funcionando
        setDiagnostics((prev) => ({
          ...prev,
          connection: {
            status: "success",
            message: "Conexão com o Supabase estabelecida com sucesso!",
          },
        }))
      } else if (connectionError) {
        setDiagnostics((prev) => ({
          ...prev,
          connection: {
            status: "error",
            message: `Erro ao conectar com o Supabase: ${connectionError.message}`,
          },
        }))
        setIsLoading(false)
        return
      } else {
        setDiagnostics((prev) => ({
          ...prev,
          connection: {
            status: "success",
            message: "Conexão com o Supabase estabelecida com sucesso!",
          },
        }))
      }

      // 2. Verificar se a tabela shirts existe
      setDiagnostics((prev) => ({
        ...prev,
        tableExists: { status: "pending", message: "Verificando tabela shirts..." },
      }))

      const { data: tableData, error: tableError } = await supabase.from("shirts").select("id").limit(1)

      if (tableError && tableError.message.includes("does not exist")) {
        setDiagnostics((prev) => ({
          ...prev,
          tableExists: {
            status: "error",
            message: "A tabela shirts não existe. É necessário criá-la.",
          },
          tableStructure: {
            status: "error",
            message: "Tabela não existe, impossível verificar estrutura.",
          },
          tableData: {
            status: "error",
            message: "Tabela não existe, impossível verificar dados.",
          },
        }))
        setIsLoading(false)
        return
      } else if (tableError) {
        setDiagnostics((prev) => ({
          ...prev,
          tableExists: {
            status: "error",
            message: `Erro ao verificar tabela: ${tableError.message}`,
          },
        }))
        setIsLoading(false)
        return
      } else {
        setDiagnostics((prev) => ({
          ...prev,
          tableExists: {
            status: "success",
            message: "A tabela shirts existe!",
          },
        }))
      }

      // 3. Verificar estrutura da tabela
      setDiagnostics((prev) => ({
        ...prev,
        tableStructure: { status: "pending", message: "Verificando estrutura da tabela..." },
      }))

      // Verificar se todos os campos necessários existem
      const requiredFields = [
        "id",
        "name",
        "size",
        "color",
        "material",
        "quantity",
        "price",
        "description",
        "paid",
        "created_at",
      ]
      const { data: sampleData, error: sampleError } = await supabase.from("shirts").select("*").limit(1)

      if (sampleError) {
        setDiagnostics((prev) => ({
          ...prev,
          tableStructure: {
            status: "error",
            message: `Erro ao verificar estrutura: ${sampleError.message}`,
          },
        }))
      } else if (!sampleData || sampleData.length === 0) {
        // Não há dados, mas a tabela existe
        setDiagnostics((prev) => ({
          ...prev,
          tableStructure: {
            status: "pending",
            message: "Tabela existe, mas não há dados para verificar a estrutura. Assumindo que está correta.",
          },
        }))
      } else {
        // Verificar campos
        const missingFields = requiredFields.filter((field) => !(field in sampleData[0]))

        if (missingFields.length > 0) {
          setDiagnostics((prev) => ({
            ...prev,
            tableStructure: {
              status: "error",
              message: `Campos ausentes na tabela: ${missingFields.join(", ")}`,
              details: {
                existingFields: Object.keys(sampleData[0]),
                missingFields,
              },
            },
          }))
        } else {
          setDiagnostics((prev) => ({
            ...prev,
            tableStructure: {
              status: "success",
              message: "Estrutura da tabela está correta!",
            },
          }))
        }
      }

      // 4. Verificar dados na tabela
      setDiagnostics((prev) => ({
        ...prev,
        tableData: { status: "pending", message: "Verificando dados na tabela..." },
      }))

      const { data: countData, error: countError } = await supabase
        .from("shirts")
        .select("*", { count: "exact", head: true })

      const count = countData?.length || 0

      if (countError) {
        setDiagnostics((prev) => ({
          ...prev,
          tableData: {
            status: "error",
            message: `Erro ao contar registros: ${countError.message}`,
          },
        }))
      } else {
        setDiagnostics((prev) => ({
          ...prev,
          tableData: {
            status: count > 0 ? "success" : "pending",
            message: count > 0 ? `A tabela contém ${count} registro(s)!` : "A tabela existe, mas não contém registros.",
            count,
          },
        }))
      }
    } catch (error) {
      console.error("Erro durante diagnóstico:", error)
      setDiagnostics((prev) => ({
        ...prev,
        connection: {
          status: "error",
          message: `Erro inesperado: ${error instanceof Error ? error.message : String(error)}`,
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Executar diagnóstico automaticamente ao carregar a página
  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: "success" | "error" | "pending") => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
  }

  const createTable = async () => {
    setIsLoading(true)

    try {
      // SQL para criar a tabela
      const sql = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Inserir um exemplo inicial
        INSERT INTO shirts (name, size, color, material, quantity, price, description, paid)
        VALUES (
          'Ana Silva',
          'M',
          'Rosa',
          '100% Algodão',
          1,
          39.90,
          'Camiseta básica rosa.',
          false
        );
      `

      // Executar o SQL
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        alert(
          `Erro ao criar tabela: ${error.message}. Tente criar manualmente seguindo as instruções na página de configuração.`,
        )
      } else {
        alert("Tabela criada com sucesso!")
        // Executar diagnóstico novamente
        runDiagnostics()
      }
    } catch (error) {
      console.error("Erro ao criar tabela:", error)
      alert(`Erro ao criar tabela: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-pink-50 border-b border-pink-100">
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-pink-700" />
            Diagnóstico do Banco de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Informações de configuração */}
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

            {/* Resultados do diagnóstico */}
            <div className="space-y-4">
              <h3 className="font-medium">Resultados do Diagnóstico:</h3>

              {/* Conexão */}
              <div className="p-4 rounded-lg border flex items-start gap-3">
                {getStatusIcon(diagnostics.connection.status)}
                <div>
                  <h4 className="font-medium">Conexão com o Supabase</h4>
                  <p className="text-sm text-gray-600">{diagnostics.connection.message}</p>
                </div>
              </div>

              {/* Tabela */}
              <div className="p-4 rounded-lg border flex items-start gap-3">
                {getStatusIcon(diagnostics.tableExists.status)}
                <div>
                  <h4 className="font-medium">Tabela "shirts"</h4>
                  <p className="text-sm text-gray-600">{diagnostics.tableExists.message}</p>
                </div>
              </div>

              {/* Estrutura */}
              <div className="p-4 rounded-lg border flex items-start gap-3">
                {getStatusIcon(diagnostics.tableStructure.status)}
                <div>
                  <h4 className="font-medium">Estrutura da Tabela</h4>
                  <p className="text-sm text-gray-600">{diagnostics.tableStructure.message}</p>
                  {diagnostics.tableStructure.details && (
                    <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                      {JSON.stringify(diagnostics.tableStructure.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>

              {/* Dados */}
              <div className="p-4 rounded-lg border flex items-start gap-3">
                {getStatusIcon(diagnostics.tableData.status)}
                <div>
                  <h4 className="font-medium">Dados na Tabela</h4>
                  <p className="text-sm text-gray-600">{diagnostics.tableData.message}</p>
                </div>
              </div>
            </div>

            {/* Ações recomendadas */}
            {(diagnostics.tableExists.status === "error" || diagnostics.tableStructure.status === "error") && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                <h3 className="font-medium text-pink-800 mb-2">Ação Recomendada:</h3>
                <p className="text-sm text-pink-700 mb-4">
                  A tabela "shirts" não existe ou está com estrutura incorreta. Você precisa criar a tabela para usar o
                  sistema.
                </p>
                <Button
                  onClick={createTable}
                  disabled={isLoading || !supabaseConfigured}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Criando tabela...
                    </>
                  ) : (
                    <>
                      <Table className="h-4 w-4 mr-2" />
                      Tentar Criar Tabela Automaticamente
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Nota: Se o botão acima não funcionar, você precisará criar a tabela manualmente seguindo as instruções
                  na página de configuração.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-50 border-t">
          <Link href="/">
            <Button variant="outline" className="border-pink-200">
              Voltar para o Início
            </Button>
          </Link>
          <Button onClick={runDiagnostics} disabled={isLoading} className="bg-pink-500 hover:bg-pink-600">
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Verificar Novamente
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

