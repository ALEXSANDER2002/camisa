"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { SlidersHorizontal, Ruler, ShirtIcon, DollarSign, Package, X, CreditCard, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: {
    size: string
    minPrice: string
    maxPrice: string
    minQuantity: string
    maxQuantity: string
    paid: string
    ticketType: string
  }
  onApply: (filters: FilterDialogProps["filters"]) => void
  onReset: () => void
}

const sizeOptions = ["PP", "P", "M", "G", "GG", "XGG"]
const ticketOptions = [
  { id: "inteira", name: "Entrada Inteira" },
  { id: "meia", name: "Meia Entrada" }
]

export default function FilterDialog({ open, onOpenChange, filters, onApply, onReset }: FilterDialogProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (open) {
      setLocalFilters(filters)
    }
  }, [filters, open])

  const handleChange = (field: keyof typeof filters, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApply = () => {
    onApply(localFilters)
  }

  // Contar filtros ativos
  const activeFiltersCount = Object.values(localFilters).filter((value) => value !== "").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? "w-[95%] max-w-[95%] p-4" : "sm:max-w-[550px]"}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
            Filtrar Estoque
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary/10">
                {activeFiltersCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>Defina filtros para restringir seu estoque de camisetas.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="filter-size" className="flex items-center">
              <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
              Tamanho
            </Label>
            <Select value={localFilters.size} onValueChange={(value) => handleChange("size", value)}>
              <SelectTrigger id="filter-size">
                <SelectValue placeholder="Qualquer tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Qualquer tamanho</SelectItem>
                {sizeOptions.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filter-ticket-type" className="flex items-center">
              <Ticket className="h-4 w-4 mr-1 text-muted-foreground" />
              Tipo de Entrada
            </Label>
            <Select value={localFilters.ticketType} onValueChange={(value) => handleChange("ticketType", value)}>
              <SelectTrigger id="filter-ticket-type">
                <SelectValue placeholder="Qualquer tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Qualquer tipo</SelectItem>
                {ticketOptions.map((ticket) => (
                  <SelectItem key={ticket.id} value={ticket.id}>
                    {ticket.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-5"}`}>
            <div className="grid gap-2">
              <Label htmlFor="filter-min-price" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                Preço Mínimo (R$)
              </Label>
              <div className="relative">
                <Input
                  id="filter-min-price"
                  type="number"
                  value={localFilters.minPrice}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Mínimo"
                />
                {localFilters.minPrice && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-0"
                    onClick={() => handleChange("minPrice", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="filter-max-price" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                Preço Máximo (R$)
              </Label>
              <div className="relative">
                <Input
                  id="filter-max-price"
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Máximo"
                />
                {localFilters.maxPrice && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-0"
                    onClick={() => handleChange("maxPrice", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-5"}`}>
            <div className="grid gap-2">
              <Label htmlFor="filter-min-quantity" className="flex items-center">
                <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                Quantidade Mínima
              </Label>
              <div className="relative">
                <Input
                  id="filter-min-quantity"
                  type="number"
                  value={localFilters.minQuantity}
                  onChange={(e) => handleChange("minQuantity", e.target.value)}
                  min="0"
                  placeholder="Mínimo"
                />
                {localFilters.minQuantity && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-0"
                    onClick={() => handleChange("minQuantity", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="filter-max-quantity" className="flex items-center">
                <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                Quantidade Máxima
              </Label>
              <div className="relative">
                <Input
                  id="filter-max-quantity"
                  type="number"
                  value={localFilters.maxQuantity}
                  onChange={(e) => handleChange("maxQuantity", e.target.value)}
                  min="0"
                  placeholder="Máximo"
                />
                {localFilters.maxQuantity && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-0"
                    onClick={() => handleChange("maxQuantity", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filter-paid" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
              Status de Pagamento
            </Label>
            <Select value={localFilters.paid} onValueChange={(value) => handleChange("paid", value)}>
              <SelectTrigger id="filter-paid">
                <SelectValue placeholder="Qualquer status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer status</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="unpaid">Não Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className={isMobile ? "flex-col space-y-2" : "flex justify-between sm:justify-between"}>
          <Button
            variant="outline"
            onClick={onReset}
            type="button"
            className={`${activeFiltersCount === 0 ? "opacity-50" : ""} ${isMobile ? "w-full" : ""}`}
            disabled={activeFiltersCount === 0}
          >
            Limpar Filtros
          </Button>
          <Button onClick={handleApply} className={`${isMobile ? "w-full" : ""} bg-pink-500 hover:bg-pink-600`}>
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

