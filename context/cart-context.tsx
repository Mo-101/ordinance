"use client"

import { createContext, useContext, type ReactNode, useState } from "react"

interface CartItem {
  id: number
  name: string
  description: string
  price: string
  category: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity
        return updatedCart
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, item]
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
