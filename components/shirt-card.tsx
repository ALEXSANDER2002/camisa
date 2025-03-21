"use client"

import { Check } from "lucide-react"
import Image from "next/image"

interface ShirtCardProps {
  id: string
  name: string
  image: string
  description: string
  isSelected: boolean
  onSelect: (id: string) => void
}

export function ShirtCard({ id, name, image, description, isSelected, onSelect }: ShirtCardProps) {
  return (
    <div
      className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-600 border-blue-600" : "border-gray-200 hover:border-slate-200"
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="p-2">
        <div className="flex flex-col items-center">
          <div className="w-full flex-shrink-0 mb-3 flex justify-center">
            <Image 
              src={image} 
              alt={name} 
              width={200}
              height={200}
              className="object-contain"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="p-2 text-center w-full">
            <h3 className="font-medium text-sm sm:text-base mb-1">{name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

