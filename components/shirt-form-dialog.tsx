"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Shirt } from "@/lib/types"
import { addShirt, updateShirt } from "@/lib/actions"
import { ShirtIcon, User, Palette, Ruler, Package, DollarSign, FileText, CreditCard } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ShirtFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (shirt: Shirt) => void
  onUpdate: (shirt: Shirt) => void
  editingShirt: Shirt | null
}

const defaultShirt: Shirt = {
  id: "",
  name: "",
  size: "M",
  color: "Azul",
  material: "100% Algodão", // Valor padrão para o material
  quantity: 0,
  price: 0,
  description: "",
  paid: false,
}

const sizeOptions = ["P", "M", "G", "GG", "XGG", "P BL", "M BL", "G BL", "GG BL", "XGG BL"]
const colorOptions = ["Azul", "Preto"]
const modelOptions = [
  { value: "1", label: "Camisa Polo Azul" },
  { value: "2", label: "Camisa Polo Preta" },
]

export default function ShirtFormDialog({ open, onOpenChange, onAdd, onUpdate, editingShirt }: ShirtFormDialogProps) {
  const [formData, setFormData] = useState<Shirt>(defaultShirt)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (editingShirt) {
      setFormData({
        ...editingShirt,
        // Se o campo paid não existir no editingShirt, defina como false
        paid: editingShirt.paid !== undefined ? editingShirt.paid : false,
      })
    } else {
      setFormData(defaultShirt)
    }
    setErrors({})
  }, [editingShirt, open])

  // Atualizar a cor com base no modelo selecionado
  useEffect(() => {
    if (formData.model_number === 1) {
      handleChange("color", "Azul")
    } else if (formData.model_number === 2) {
      handleChange("color", "Preto")
    }
  }, [formData.model_number])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.color) {
      newErrors.color = "Cor é obrigatória"
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantidade não pode ser negativa"
    }

    if (formData.price < 0) {
      newErrors.price = "Preço não pode ser negativo"
    }

    if (!formData.model_number) {
      newErrors.model_number = "Modelo é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof Shirt, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpar erro quando o campo é editado
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (editingShirt) {
        // Atualizar camiseta existente
        const updatedShirt = await updateShirt(formData)
        onUpdate(updatedShirt)
      } else {
        // Adicionar nova camiseta
        const newShirt = await addShirt(formData)
        onAdd(newShirt)
      }
    } catch (error) {
      console.error("Erro ao salvar camiseta:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? "w-[95%] max-w-[95%] p-4" : "sm:max-w-[550px]"}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <ShirtIcon className="h-5 w-5 mr-2 text-primary" />
            {editingShirt ? "Editar Camiseta" : "Adicionar Nova Camiseta"}
          </DialogTitle>
          <DialogDescription>
            {editingShirt
              ? "Atualize os detalhes desta camiseta no seu estoque."
              : "Preencha os detalhes da pessoa e da camiseta para adicionar ao estoque."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="name" className="required flex items-center">
              <User className="h-4 w-4 mr-1 text-muted-foreground" />
              Nome da Pessoa
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nome da Pessoa"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="model_number" className="required flex items-center">
              <ShirtIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              Modelo
            </Label>
            <Select
              value={formData.model_number?.toString()}
              onValueChange={(value) => handleChange("model_number", Number.parseInt(value))}
            >
              <SelectTrigger id="model_number" className={errors.model_number ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.model_number && <p className="text-sm text-destructive">{errors.model_number}</p>}
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-5"}`}>
            <div className="grid gap-2">
              <Label htmlFor="size" className="required flex items-center">
                <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
                Tamanho
              </Label>
              <Select value={formData.size} onValueChange={(value) => handleChange("size", value)}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Selecione o tamanho" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color" className="required flex items-center">
                <Palette className="h-4 w-4 mr-1 text-muted-foreground" />
                Cor
              </Label>
              <Input id="color" value={formData.color} readOnly disabled className="bg-gray-100" />
              <p className="text-xs text-muted-foreground">A cor é determinada pelo modelo selecionado</p>
            </div>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-5"}`}>
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="required flex items-center">
                <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value) || 0)}
                min="0"
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price" className="required flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                Preço (R$)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex h-10 items-center space-x-2 rounded-md border px-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="paid" className="flex items-center cursor-pointer">
                Status de Pagamento
              </Label>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Switch id="paid" checked={formData.paid} onCheckedChange={(checked) => handleChange("paid", checked)} />
              <Label
                htmlFor="paid"
                className={formData.paid ? "text-green-600 font-medium" : "text-red-600 font-medium"}
              >
                {formData.paid ? "Pago" : "Não Pago"}
              </Label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="flex items-center">
              <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Adicione notas ou detalhes sobre esta camiseta"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className={isMobile ? "w-full" : ""}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`relative ${isMobile ? "w-full" : ""} bg-pink-500 hover:bg-pink-600`}
          >
            {isSubmitting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
            <span className={isSubmitting ? "opacity-0" : ""}>{editingShirt ? "Atualizar" : "Adicionar"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

