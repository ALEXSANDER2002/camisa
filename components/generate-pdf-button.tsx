"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useState } from "react"
import type { Shirt } from "@/lib/types"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface GeneratePdfButtonProps {
  shirts: Shirt[]
}

export function GeneratePdfButton({ shirts }: GeneratePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // Criar uma nova instância do jsPDF
      const doc = new jsPDF()

      // Adicionar título
      doc.setFontSize(18)
      doc.text("Relatório de Pedidos - Sistema De Camisas", 14, 22)

      // Adicionar data do relatório
      doc.setFontSize(11)
      doc.text(`Data do relatório: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30)

      // Adicionar estatísticas
      const totalShirts = shirts.reduce((sum, shirt) => sum + shirt.quantity, 0)
      const totalValue = shirts.reduce((sum, shirt) => {
        // Incluir o valor do ingresso (ticket_price) se existir
        const shirtTotal = shirt.price * shirt.quantity
        const ticketTotal = shirt.ticket_price || 0
        return sum + shirtTotal + ticketTotal
      }, 0)
      const paidShirts = shirts.filter((shirt) => shirt.paid).length
      const unpaidShirts = shirts.filter((shirt) => !shirt.paid).length

      doc.setFontSize(12)
      doc.text("Resumo:", 14, 40)
      doc.setFontSize(10)
      doc.text(`Total de pedidos: ${shirts.length}`, 14, 48)
      doc.text(`Total de camisetas: ${totalShirts}`, 14, 54)
      doc.text(`Valor total: R$ ${totalValue.toFixed(2)}`, 14, 60)
      doc.text(`Pedidos pagos: ${paidShirts}`, 14, 66)
      doc.text(`Pedidos não pagos: ${unpaidShirts}`, 14, 72)

      // Preparar dados para a tabela
      const tableData = shirts.map((shirt) => {
        // Calcular o valor total incluindo o ingresso, se existir
        const totalPrice = ((shirt.price * shirt.quantity) + (shirt.ticket_price || 0)).toFixed(2)
        
        // Obter informação do tipo de ingresso
        const ticketInfo = getTicketTypeName(shirt.ticket_type)
        
        return [
          shirt.name,
          shirt.size,
          shirt.color,
          getModelName(shirt.model_number),
          shirt.quantity.toString(),
          ticketInfo,
          `R$ ${totalPrice}`,
          shirt.paid ? "Sim" : "Não",
        ]
      })

      // Adicionar tabela
      autoTable(doc, {
        head: [["Cliente", "Tamanho", "Cor", "Modelo", "Qtd", "Ingresso", "Valor Total", "Pago"]],
        body: tableData,
        startY: 80,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }, // Azul
        alternateRowStyles: { fillColor: [240, 245, 255] }, // Azul claro
      })

      // Adicionar rodapé
      const pageCount = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
          `Sistema De Camisas - Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" },
        )
      }

      // Salvar o PDF
      doc.save("relatorio-pedidos.pdf")
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar o PDF. Por favor, tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Função para obter o nome do modelo
  const getModelName = (modelNumber: number | undefined) => {
    if (!modelNumber) return "Não especificado"
    return modelNumber === 1 ? "Camisa Bits - Edição Especial" : "Modelo " + modelNumber
  }

  // Função para obter o nome do tipo de ingresso
  const getTicketTypeName = (ticketType: string | undefined) => {
    if (!ticketType) return "Sem ingresso"
    switch (ticketType) {
      case "inteira":
        return "Inteira"
      case "meia":
        return "Meia"
      default:
        return ticketType
    }
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating || shirts.length === 0}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <FileText className="h-4 w-4 mr-2" />
      {isGenerating ? "Gerando PDF..." : "Gerar Relatório PDF"}
    </Button>
  )
}

