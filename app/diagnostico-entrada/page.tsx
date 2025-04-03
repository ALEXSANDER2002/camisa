"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getShirts } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DiagnosticoEntradas() {
  const [shirts, setShirts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadShirts()
  }, [])

  const loadShirts = async () => {
    setLoading(true)
    try {
      const data = await getShirts()
      setShirts(data)
    } catch (error) {
      console.error("Erro ao carregar camisetas:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <Card className="shadow-md border-pink-100">
        <CardHeader className="bg-pink-50 border-b border-pink-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Diagnóstico de Entradas</CardTitle>
              <CardDescription>Visualização dos valores de entradas no banco de dados</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadShirts} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Atualizar
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>ticket_type</TableHead>
                  <TableHead>ticket_price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shirts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      {loading ? "Carregando dados..." : "Nenhum dado encontrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  shirts.map((shirt) => (
                    <TableRow key={shirt.id}>
                      <TableCell>{shirt.name}</TableCell>
                      <TableCell>
                        {shirt.ticket_type || <span className="text-muted-foreground">Não definido</span>}
                      </TableCell>
                      <TableCell>
                        {shirt.ticket_price !== undefined 
                          ? `R$ ${shirt.ticket_price.toFixed(2)}`
                          : <span className="text-muted-foreground">R$ 0.00</span>
                        }
                      </TableCell>
                      <TableCell>
                        R$ {((shirt.price * shirt.quantity) + (shirt.ticket_price || 0)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 