import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  PropsWithChildren,
} from "react";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi";

import type {
  Cart,
} from "../types/cart";

import { useAuth } from "./AuthContext";

interface CartContextValue {
  cart: Cart | null;

  loading: boolean;

  itemCount: number;

  refreshCart: () => Promise<void>;

  addItem: (
    productId: string,
    quantity: number
  ) => Promise<void>;

  updateItem: (
    productId: string,
    quantity: number
  ) => Promise<void>;

  removeItem: (
    productId: string
  ) => Promise<void>;

  clear: () => Promise<void>;
}

const CartContext =
  createContext<
    CartContextValue | undefined
  >(undefined);

export const CartProvider = ({
  children,
}: PropsWithChildren) => {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [cart, setCart] =
    useState<Cart | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const isBuyer =
    user?.role === "BUYER";

  const refreshCart =
    async () => {
      if (
        !isAuthenticated ||
        !isBuyer
      ) {
        setCart(null);
        return;
      }

      try {
        setLoading(true);

        const result =
          await getCart();

        setCart(
          result.data
        );
      } catch (error) {
        console.error(
          "Cart loading error:",
          error
        );

        setCart(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void refreshCart();
  }, [
    isAuthenticated,
    isBuyer,
  ]);

  const addItem =
    async (
      productId: string,
      quantity: number
    ) => {
      const result =
        await addToCart({
          productId,
          quantity,
        });

      setCart(
        result.data
      );
    };

  const updateItem =
    async (
      productId: string,
      quantity: number
    ) => {
      const result =
        await updateCartItem({
          productId,
          quantity,
        });

      setCart(
        result.data
      );
    };

  const removeItem =
    async (
      productId: string
    ) => {
      const result =
        await removeCartItem(
          productId
        );

      setCart(
        result.data
      );
    };

  const clear =
    async () => {
      const result =
        await clearCart();

      setCart(
        result.data
      );
    };

  const itemCount =
    useMemo(() => {
      return (
        cart?.items.reduce(
          (
            total,
            item
          ) =>
            total +
            item.quantity,
          0
        ) ?? 0
      );
    }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,

        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};