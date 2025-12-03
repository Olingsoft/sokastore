"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
    id: number;
    productId: number;
    product?: {
        id: number;
        name: string;
        price: number;
        categoryId?: number;
        images?: { url: string; isPrimary: boolean }[];
    };
    quantity: number;
    price: number;
    size?: string;
    type?: string;
    customization?: {
        playerName?: string;
        playerNumber?: string;
        selectedBadge?: string;
    };
    customizationFee?: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    isLoading: boolean;
    addToCart: (product: any, quantity: number, options: any) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    fetchCart: () => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // Remove trailing slash if present
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const fetchCart = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log('No token found, clearing cart');
                setCartItems([]);
                setIsLoading(false);
                return;
            }

            console.log('Fetching cart from backend...');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log('Cart fetch response status:', res.status);

            if (!res.ok) {
                console.error('Failed to fetch cart, status:', res.status);
                if (res.status === 401) {
                    setCartItems([]);
                }
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            console.log('Cart data received:', data);

            setCartItems(data.items || []); // store items
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCartItems([]);
        }

        setIsLoading(false);
    };

    // Load cart on mount
    useEffect(() => {
        console.log('CartContext mounted, fetching cart...');
        fetchCart();
    }, []);

    const addToCart = async (product: any, quantity: number, options: any) => {
        const token = getToken();
        if (!token) {
            toast.error("Please login to add items to cart");
            if (typeof window !== 'undefined') {
                // Optional: redirect to login
                // window.location.href = '/login';
            }
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Adding to cart...");

        try {
            const payload = {
                productId: product.id || product._id,
                quantity,
                size: options.size,
                type: options.type,
                customization: options.customization,
                customizationFee: options.customizationFee
            };

            const res = await fetch(`${apiUrl}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to add to cart');
            }

            toast.success("Added to cart successfully!", { id: toastId });
            await fetchCart();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to add item to cart", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        const token = getToken();
        if (!token) return;

        const toastId = toast.loading("Removing item...");
        try {
            const res = await fetch(`${apiUrl}/cart/item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to remove item');

            toast.success("Item removed", { id: toastId });
            await fetchCart();
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove item", { id: toastId });
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        const token = getToken();
        if (!token) return;

        try {
            // Optimistic update could be done here
            const res = await fetch(`${apiUrl}/cart/item/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            if (!res.ok) throw new Error('Failed to update quantity');

            await fetchCart();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update quantity");
        }
    };

    const clearCart = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/cart`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setCartItems([]);
                toast.success("Cart cleared");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, isLoading, addToCart, removeFromCart, updateQuantity, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
