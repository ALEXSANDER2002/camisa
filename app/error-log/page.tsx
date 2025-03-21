"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorLogPage() {
  const [error, setError] = useState<string | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true)
      try {
        // Coletar informações do dispositivo
        setDeviceInfo({
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "não definido",
          supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length
            : 0,
        })

        // Testar conexão com o Supabase
        const { data, error } = await supabase.from("shirts").select("count").limit(1)

        if (error) {
          setError(`Erro ao conectar com o Supabase: ${error.message}`)
          console.error("Erro detalhado:", error)
        } else {
          setError(null)
        }
      } catch (err) {
        setError(`Erro inesperado: ${err instanceof Error ? err.message : String(err)}`)
        console.error("Erro detalhado:", err)
      } finally {
        setIsLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="bg-pink-50 border-b border-pink-100">
          <CardTitle>Diagnóstico de Erro em Dispositivo Móvel</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2">Informações do Dispositivo:</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(deviceInfo, null, 2)}</pre>
            </div>

            {isLoading ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p>Testando conexão com o Supabase...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <h3 className="font-medium text-red-700 mb-2">Erro Detectado:</h3>
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-700 mb-2">Conexão Bem-sucedida!</h3>
                <p className="text-green-600">A conexão com o Supabase está funcionando corretamente.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

