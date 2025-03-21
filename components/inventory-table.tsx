"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Edit,
  MoreHorizontal,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  ChevronRight,
  ShirtIcon,
  CreditCard,
} from "lucide-react"
import type { Shirt } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deleteShirt } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Card, CardContent } from "@/components/ui/card"

interface InventoryTableProps {
  shirts: Shirt[]
  onEdit: (shirt: Shirt) => void
  onDelete: (id: string) => void
  onSort: (field: string) => void
  sortField: string
  sortDirection: "asc" | "desc"
}

export default function InventoryTable({
  shirts,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortDirection,
}: InventoryTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [shirtToDelete, setShirtToDelete] = useState<Shirt | null>(null)
  const [detailsShirt, setDetailsShirt] = useState<Shirt | Shirt[] | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Verificar se é dispositivo móvel
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleDeleteClick = (shirt: Shirt) => {
    setShirtToDelete(shirt)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (shirtToDelete) {
      try {
        await deleteShirt(shirtToDelete.id)
        onDelete(shirtToDelete.id)
      } catch (error) {
        console.error("Erro ao excluir camiseta:", error)
        alert("Erro ao excluir camiseta. Verifique o console para mais detalhes.")
      } finally {
        setDeleteDialogOpen(false)
        setShirtToDelete(null)
      }
    }
  }

  const handleDetailsClick = (shirt: Shirt | Shirt[]) => {
    setDetailsShirt(shirt)
    setDetailsDialogOpen(true)
  }

  const getSortIndicator = (field: string) => {
    if (field === sortField) {
      return sortDirection === "asc" ? " ↑" : " ↓"
    }
    return ""
  }

  const getQuantityColor = (quantity: number) => {
    if (quantity <= 0) return "bg-red-100 text-red-800"
    if (quantity <= 5) return "bg-amber-100 text-amber-800"
    return "bg-green-100 text-green-800"
  }

  // Atualizar a função getModelName para incluir os novos modelos

  // Atualizar a função getModelName para usar os nomes específicos das camisetas
  const getModelName = (modelNumber: number | undefined) => {
    if (!modelNumber) return "Não especificado"
    switch (modelNumber) {
      case 1:
        return "Camisa Polo Azul PSICOLOGIA"
      case 2:
        return "Camisa Polo Preta PSICOLOGIA"
      case 3:
        return "Camiseta Azul PSICOLOGIA UNAMA"
      case 4:
        return "Camiseta Preta PSICOLOGIA UNAMA"
      default:
        return "Modelo " + modelNumber
    }
  }

  // Adicionar exibição do método de pagamento e comprovante na visualização de detalhes
  const getPaymentMethodName = (method: string | undefined) => {
    if (!method) return "Não especificado"
    return method === "pix" ? "PIX" : method
  }

  const renderPaymentProofLink = (paymentProofUrl: string | undefined) => {
    if (!paymentProofUrl) return null

    return (
      <a
        href={paymentProofUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm flex items-center"
      >
        <CreditCard className="h-3 w-3 mr-1" />
        Ver comprovante
      </a>
    )
  }

  // Dentro da função InventoryTable, antes do return
  // Agrupar camisetas pelo order_group
  const groupedShirts = shirts.reduce(
    (groups, shirt) => {
      if (shirt.order_group) {
        if (!groups[shirt.order_group]) {
          groups[shirt.order_group] = []
        }
        groups[shirt.order_group].push(shirt)
      } else {
        // Para camisetas sem order_group, usar o ID como chave
        groups[shirt.id] = [shirt]
      }
      return groups
    },
    {} as Record<string, Shirt[]>,
  )

  // Ordenar os grupos para que os pedidos com múltiplos modelos apareçam primeiro
  const sortedGroups = Object.values(groupedShirts).sort((a, b) => {
    // Pedidos com mais modelos primeiro
    if (a.length !== b.length) {
      return b.length - a.length
    }
    // Depois por data de criação (mais recentes primeiro)
    return new Date(b[0].created_at || "").getTime() - new Date(a[0].created_at || "").getTime()
  })

  // Renderização para dispositivos móveis
  if (isMobile) {
    return (
      <>
        <div className="space-y-4 animate-slide-in">
          {shirts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-center bg-white rounded-lg border p-4">
              <Package className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-muted-foreground">Nenhuma camiseta encontrada.</p>
            </div>
          ) : (
            sortedGroups.map((group) => (
              <Card key={group[0].order_group || group[0].id} className="overflow-hidden hover-scale shadow-sm">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-medium text-sm sm:text-base">{group[0].name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {group.length > 1 && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                            {group.length} modelos
                          </Badge>
                        )}
                        <Badge variant="outline" className="font-semibold text-xs">
                          {group[0].size}
                          {group.length > 1 ? "+" : ""}
                        </Badge>
                        <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200 text-xs">
                          <ShirtIcon className="h-3 w-3 mr-1" />
                          {getModelName(group[0].model_number)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto">
                      <span className="font-medium text-sm sm:text-base">
                        R$ {group.reduce((sum, shirt) => sum + shirt.price * shirt.quantity, 0).toFixed(2)}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${getQuantityColor(
                          group.reduce((sum, shirt) => sum + shirt.quantity, 0),
                        )}`}
                      >
                        {group.reduce((sum, shirt) => sum + shirt.quantity, 0)} un.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <div>
                      {group[0].paid !== undefined ? (
                        group[0].paid ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" /> Pago
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" /> Não Pago
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          N/A
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDetailsClick(group)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(group[0])}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleDeleteClick(group[0])}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Diálogo de detalhes para visualização em dispositivos móveis */}
        <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <AlertDialogContent className="max-w-md w-[95vw] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalhes do Pedido</AlertDialogTitle>
            </AlertDialogHeader>
            {detailsShirt && (
              <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Cliente</p>
                  <p className="font-medium">
                    {Array.isArray(detailsShirt) ? detailsShirt[0].name : detailsShirt.name}
                  </p>
                </div>

                {/* Se for um array (grupo de modelos), mostrar cada modelo */}
                {Array.isArray(detailsShirt) ? (
                  detailsShirt.map((shirt, index) => (
                    <div key={shirt.id} className="border rounded-lg p-3 bg-gray-50">
                      <h4 className="font-medium mb-2 flex items-center">
                        <ShirtIcon className="h-4 w-4 mr-2 text-pink-500" />
                        {getModelName(shirt.model_number)} (Modelo {shirt.model_number || index + 1})
                      </h4>

                      {/* Exibir a imagem do modelo */}
                      {shirt.image_url && (
                        <div className="mb-3">
                          <img
                            src={shirt.image_url || "/placeholder.svg"}
                            alt={`Modelo ${shirt.model_number || index + 1}`}
                            className="w-full h-48 object-contain border rounded-md"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Tamanho</p>
                          <Badge variant="outline" className="font-semibold">
                            {shirt.size}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cor</p>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border shadow-sm"
                              style={{ backgroundColor: shirt.color.toLowerCase() }}
                            />
                            {shirt.color}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Material</p>
                          <p>{shirt.material}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quantidade</p>
                          <span
                            className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getQuantityColor(
                              shirt.quantity,
                            )}`}
                          >
                            {shirt.quantity}
                          </span>
                        </div>
                      </div>

                      {shirt.description && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Descrição</p>
                          <p className="text-sm">{shirt.description}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Mostrar um único modelo (compatibilidade com versão anterior)
                  <>
                    {/* Adicionar informação do modelo */}
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Modelo</p>
                      <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
                        <ShirtIcon className="h-3 w-3 mr-1" />
                        {getModelName(detailsShirt.model_number)}
                      </Badge>
                    </div>

                    {/* Exibir a imagem do modelo */}
                    {detailsShirt.image_url && (
                      <div className="mb-3">
                        <img
                          src={detailsShirt.image_url || "/poloa_preta.jpeg"}
                          alt="Modelo da camiseta"
                          className="w-full h-48 object-contain border rounded-md"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Tamanho</p>
                        <Badge variant="outline" className="font-semibold">
                          {detailsShirt.size}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cor</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border shadow-sm"
                            style={{ backgroundColor: detailsShirt.color.toLowerCase() }}
                          />
                          {detailsShirt.color}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Material</p>
                        <p>{detailsShirt.material}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantidade</p>
                        <span
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getQuantityColor(
                            detailsShirt.quantity,
                          )}`}
                        >
                          {detailsShirt.quantity}
                        </span>
                      </div>
                    </div>

                    {detailsShirt.description && (
                      <div>
                        <p className="text-sm text-muted-foreground">Descrição</p>
                        <p className="text-sm">{detailsShirt.description}</p>
                      </div>
                    )}
                  </>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Preço Total</p>
                    <p className="font-medium">
                      R${" "}
                      {Array.isArray(detailsShirt)
                        ? detailsShirt.reduce((sum, shirt) => sum + shirt.price * shirt.quantity, 0).toFixed(2)
                        : (detailsShirt.price * detailsShirt.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status de Pagamento</p>
                    {(Array.isArray(detailsShirt) ? detailsShirt[0].paid : detailsShirt.paid) !== undefined ? (
                      (Array.isArray(detailsShirt) ? detailsShirt[0].paid : detailsShirt.paid) ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" /> Pago
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                        >
                          <XCircle className="h-3 w-3" /> Não Pago
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                        N/A
                      </Badge>
                    )}
                  </div>
                </div>
                {Array.isArray(detailsShirt)
                  ? detailsShirt[0].payment_method && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          {getPaymentMethodName(detailsShirt[0].payment_method)}
                        </Badge>
                        {Array.isArray(detailsShirt)
                          ? detailsShirt[0].payment_proof_url && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                                  Comprovante de Pagamento
                                </h4>
                                <div className="flex flex-col gap-2">
                                  <a
                                    href={detailsShirt[0].payment_proof_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm flex items-center"
                                  >
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    Ver comprovante em tela cheia
                                  </a>
                                  <div className="border rounded-md overflow-hidden mt-1">
                                    <img
                                      src={detailsShirt[0].payment_proof_url || "/placeholder.svg"}
                                      alt="Comprovante de pagamento"
                                      className="max-h-48 w-full object-contain"
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          : detailsShirt.payment_proof_url && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                                  Comprovante de Pagamento
                                </h4>
                                <div className="flex flex-col gap-2">
                                  <a
                                    href={detailsShirt.payment_proof_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm flex items-center"
                                  >
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    Ver comprovante em tela cheia
                                  </a>
                                  <div className="border rounded-md overflow-hidden mt-1">
                                    <img
                                      src={detailsShirt.payment_proof_url || "/placeholder.svg"}
                                      alt="Comprovante de pagamento"
                                      className="max-h-48 w-full object-contain"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                      </div>
                    )
                  : detailsShirt.payment_method && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          {getPaymentMethodName(detailsShirt.payment_method)}
                        </Badge>

                        {detailsShirt.payment_proof_url && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">Comprovante</p>
                            <div className="flex flex-col gap-2">
                              <a
                                href={detailsShirt.payment_proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:underline text-sm flex items-center"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                Ver comprovante
                              </a>
                              <div className="border rounded-md overflow-hidden mt-1">
                                <img
                                  src={detailsShirt.payment_proof_url || "/placeholder.svg"}
                                  alt="Comprovante de pagamento"
                                  className="max-h-32 w-full object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Fechar</AlertDialogCancel>
              <Button
                onClick={() => {
                  setDetailsDialogOpen(false)
                  if (detailsShirt) {
                    onEdit(Array.isArray(detailsShirt) ? detailsShirt[0] : detailsShirt)
                  }
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Diálogo de confirmação de exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a camiseta
                {shirtToDelete && <strong> "{shirtToDelete.name}"</strong>} do seu estoque.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // Renderização para desktop
  return (
    <>
      <div className="rounded-lg border shadow-sm overflow-hidden animate-slide-in">
        <Table className="inventory-table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("name")}>
                Nome da Pessoa{getSortIndicator("name")}
              </TableHead>
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("size")}>
                Tamanho{getSortIndicator("size")}
              </TableHead>
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("color")}>
                Cor{getSortIndicator("color")}
              </TableHead>
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("material")}>
                Material{getSortIndicator("material")}
              </TableHead>
              {/* Nova coluna para o modelo */}
              <TableHead className="cursor-pointer font-semibold" onClick={() => onSort("model_number")}>
                Modelo{getSortIndicator("model_number")}
              </TableHead>
              <TableHead className="cursor-pointer text-right font-semibold" onClick={() => onSort("quantity")}>
                Quantidade{getSortIndicator("quantity")}
              </TableHead>
              <TableHead className="cursor-pointer text-right font-semibold" onClick={() => onSort("price")}>
                Preço{getSortIndicator("price")}
              </TableHead>
              <TableHead className="cursor-pointer text-center font-semibold" onClick={() => onSort("paid")}>
                Pagamento{getSortIndicator("paid")}
              </TableHead>
              <TableHead className="text-center font-semibold">Comprovante</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shirts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-10 w-10 mb-2 opacity-20" />
                    <p>Nenhuma camiseta encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              shirts.map((shirt) => (
                <TableRow key={shirt.id} className="hover-scale">
                  <TableCell className="font-medium">{shirt.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">
                      {shirt.size}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border shadow-sm"
                        style={{ backgroundColor: shirt.color.toLowerCase() }}
                      />
                      {shirt.color}
                    </div>
                  </TableCell>
                  <TableCell>{shirt.material}</TableCell>
                  {/* Célula para o modelo */}
                  <TableCell>
                    <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
                      <ShirtIcon className="h-3 w-3 mr-1" />
                      {getModelName(shirt.model_number)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getQuantityColor(
                        shirt.quantity,
                      )}`}
                    >
                      {shirt.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">R$ {shirt.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {shirt.paid !== undefined ? (
                      shirt.paid ? (
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" /> Pago
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" /> Não Pago
                          </Badge>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          N/A
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {shirt.payment_proof_url && renderPaymentProofLink(shirt.payment_proof_url)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => onEdit(shirt)} className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2 text-blue-500" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(shirt)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a camiseta
              {shirtToDelete && <strong> "{shirtToDelete.name}"</strong>} do seu estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

