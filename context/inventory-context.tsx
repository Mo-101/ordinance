"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import inventoryData from "@/data/inventory.json"
import { getRealItemImage } from "@/lib/real-images"

interface InventoryContextType {
  inventory: any[]
  categories: string[]
  isLoading: boolean
  progress: number
}

const InventoryContext = createContext<InventoryContextType>({
  inventory: [],
  categories: [],
  isLoading: false,
  progress: 100,
})

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start loading process
    setIsLoading(true)
    setProgress(0)

    // Extract unique categories from the inventory data
    const uniqueCategories = Array.from(new Set(inventoryData.map((item) => item.category))).sort() as string[]
    setCategories(uniqueCategories)

    // Process all items at once
    const processAllItems = () => {
      // Use the inventory data exactly as is, only adding image paths
      const processedItems = inventoryData.map((item) => {
        // Get real image for this item if available
        const realImage = getRealItemImage(item)

        return {
          ...item, // Keep all original data intact
          image:
            realImage || item.image || `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(item.name)}`,
        }
      })

      // Update state with all processed items - no additions, just the original data
      setInventory(processedItems)
      setProgress(100)
      setIsLoading(false)
    }

    // Use setTimeout to allow the UI to render before processing
    setTimeout(processAllItems, 100)
  }, [])

  return (
    <InventoryContext.Provider value={{ inventory, categories, isLoading, progress }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  return useContext(InventoryContext)
}
