"use client"

import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export default function StatusPage() {
  const [status, setStatus] = useState<{
    supabaseConfigured: boolean
    supabaseUrl: string | null
    supabaseKeyLength: number
    connectionTest: "pending" | "success" | "error"
    error: string | null
  }>({
    supabaseConfigured: false,
    supabaseUrl: null,
    supabaseKeyLength: 0,
    connectionTest: "pending",
    error: null,
  })

  useEffect(() => {
    const checkStatus = async () => {
      const supabaseConfigured = isSupabaseConfigured()
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null
      const supabaseKeyLength = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0

      setStatus((prev) => ({
        ...prev,
        supabaseConfigured,
        supabaseUrl,
        supabaseKeyLength,
      }))

      if (!supabaseConfigured) {
        setStatus((prev) => ({
          ...prev,
          connectionTest: "error",
          error: "Supabase não está configurado",
        }))
        return
      }

      try {
        const { data, error } = await supabase.from("_tables").select("*").limit(1)

        if (error && !error.message.includes("does not exist")) {
          setStatus((prev) => ({
            ...prev,
            connectionTest: "error",
            error: error.message,
          }))
        } else {
          setStatus((prev) => ({
            ...prev,
            connectionTest: "success",
            error: null,
          }))
        }
      } catch (err) {
        setStatus((prev) => ({
          ...prev,
          connectionTest: "error",
          error: err instanceof Error ? err.message : String(err),
        }))
      }
    }

    checkStatus()
  }, [])

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>Status da Aplicação</h1>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px" }}>Configuração do Supabase</h2>
        <p>
          <strong>Configurado:</strong> {status.supabaseConfigured ? "✅ Sim" : "❌ Não"}
        </p>
        <p>
          <strong>URL:</strong> {status.supabaseUrl || "Não definido"}
        </p>
        <p>
          <strong>Chave anônima:</strong>{" "}
          {status.supabaseKeyLength > 0 ? `Definida (${status.supabaseKeyLength} caracteres)` : "Não definida"}
        </p>
      </div>

      <div
        style={{
          backgroundColor:
            status.connectionTest === "success" ? "#e6ffe6" : status.connectionTest === "error" ? "#ffe6e6" : "#f0f0f0",
          padding: "15px",
          borderRadius: "8px",
          border: `1px solid ${status.connectionTest === "success" ? "#b3ffb3" : status.connectionTest === "error" ? "#ffb3b3" : "#ddd"}`,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px" }}>Teste de Conexão</h2>
        <p>
          <strong>Status:</strong>{" "}
          {status.connectionTest === "pending"
            ? "⏳ Testando..."
            : status.connectionTest === "success"
              ? "✅ Conectado"
              : "❌ Falha na conexão"}
        </p>
        {status.error && (
          <p>
            <strong>Erro:</strong> {status.error}
          </p>
        )}
      </div>
    </div>
  )
}

