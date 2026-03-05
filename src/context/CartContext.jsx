import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load cart items from Supabase when user logs in
    useEffect(() => {
        if (user) {
            fetchCartItems();
        } else {
            setCartItems([]);
            setLoading(false);
        }
    }, [user]);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            console.log('Fetched cart items:', data);
            setCartItems(data || []);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            Alert.alert('Error', 'Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (item) => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add items to cart');
            return false;
        }

        try {
            // Check if item already exists in cart with same product_id, color, and size
            const existingItem = cartItems.find(
                cartItem => 
                    cartItem.product_id === item.id && 
                    cartItem.color === item.color && 
                    cartItem.size === item.size
            );

            if (existingItem) {
                // Update quantity of existing item
                console.log('Item exists, updating quantity');
                const { error } = await supabase
                    .from('cart_items')
                    .update({ 
                        quantity: existingItem.quantity + (item.quantity || 1),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingItem.id);

                if (error) throw error;

                // Update local state
                setCartItems(prevItems =>
                    prevItems.map(cartItem =>
                        cartItem.id === existingItem.id
                            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                            : cartItem
                    )
                );

                Alert.alert('Success', 'Item quantity updated in cart');
                return true;
            } else {
                // Insert new item
                console.log('New item, inserting');
                const { data, error } = await supabase
                    .from('cart_items')
                    .insert([
                        {
                            user_id: user.id,
                            product_id: item.id || item.product_id || Math.random().toString(),
                            title: item.title || 'Product',
                            price: item.price || 0,
                            image: item.image || null,
                            color: item.color || '#B11D1D',
                            size: item.size || 'M',
                            quantity: item.quantity || 1
                        }
                    ])
                    .select()
                    .single();

                if (error) {
                    // If it's a unique constraint violation, try to update instead
                    if (error.code === '23505') {
                        console.log('Unique constraint violation, fetching existing item');
                        
                        // Fetch the existing item
                        const { data: existingData, error: fetchError } = await supabase
                            .from('cart_items')
                            .select('*')
                            .eq('user_id', user.id)
                            .eq('product_id', item.id || item.product_id)
                            .eq('color', item.color || '#B11D1D')
                            .eq('size', item.size || 'M')
                            .single();

                        if (fetchError) throw fetchError;

                        if (existingData) {
                            // Update quantity
                            const { error: updateError } = await supabase
                                .from('cart_items')
                                .update({ 
                                    quantity: existingData.quantity + (item.quantity || 1),
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', existingData.id);

                            if (updateError) throw updateError;

                            // Update local state
                            setCartItems(prevItems =>
                                prevItems.map(cartItem =>
                                    cartItem.id === existingData.id
                                        ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                                        : cartItem
                                )
                            );
                        }
                    } else {
                        throw error;
                    }
                } else {
                    // Update local state with new item
                    setCartItems(prevItems => [data, ...prevItems]);
                }

                Alert.alert('Success', 'Item added to cart');
                return true;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            
            // Handle specific error messages
            if (error.code === '23505') {
                Alert.alert('Info', 'This item is already in your cart. Quantity will be updated.');
                // Refresh cart to show updated items
                await fetchCartItems();
            } else {
                Alert.alert('Error', 'Failed to add item to cart');
            }
            return false;
        }
    };

    // 🔥 UPDATED REMOVE FROM CART WITH DETAILED LOGGING
    const removeFromCart = async (itemId) => {
        console.log('========== REMOVE FROM CART START ==========');
        console.log('1. Function called with itemId:', itemId);
        console.log('2. User exists?', user ? `Yes (${user.id})` : 'No');
        console.log('3. Current cartItems count:', cartItems.length);
        console.log('4. Current cartItems IDs:', cartItems.map(i => i.id));
        
        if (!user) {
            console.log('❌ No user logged in');
            Alert.alert('Error', 'Please login to remove items');
            return false;
        }

        try {
            // First check if item exists in local state
            const itemToDelete = cartItems.find(item => item.id === itemId);
            
            console.log('5. Item found in local state?', itemToDelete ? 'Yes' : 'No');
            
            if (!itemToDelete) {
                console.log('❌ Item not found in local state with ID:', itemId);
                console.log('Available IDs:', cartItems.map(i => i.id));
                Alert.alert('Error', 'Item not found in cart');
                return false;
            }

            console.log('6. Item to delete details:', {
                id: itemToDelete.id,
                title: itemToDelete.title,
                user_id: itemToDelete.user_id,
                price: itemToDelete.price
            });

            // Delete from Supabase
            console.log('7. Attempting Supabase delete...');
            console.log('7a. Supabase query:', {
                table: 'cart_items',
                operation: 'delete',
                condition: { id: itemId }
            });

            const { error, data } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', itemId)
                .select(); // This returns the deleted item

            if (error) {
                console.error('❌ Supabase delete error:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                throw error;
            }

            console.log('8. ✅ Supabase delete successful!');
            console.log('9. Deleted data:', data);

            // Update local state (remove from UI)
            console.log('10. Updating local state...');
            setCartItems(prevItems => {
                const newItems = prevItems.filter(item => item.id !== itemId);
                console.log('11. Previous items count:', prevItems.length);
                console.log('12. New items count:', newItems.length);
                console.log('13. Remaining item IDs:', newItems.map(i => i.id));
                return newItems;
            });

            console.log('14. ✅ Item successfully removed from cart!');
            console.log('========== REMOVE FROM CART END ==========');
            
            Alert.alert('Success', 'Item removed from cart');
            return true;
        } catch (error) {
            console.error('❌ Error in removeFromCart catch block:', error);
            console.log('========== REMOVE FROM CART ERROR ==========');
            Alert.alert('Error', 'Failed to remove item from cart. Please try again.');
            return false;
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (!user) return false;

        try {
            if (newQuantity <= 0) {
                return removeFromCart(itemId);
            }

            const { error } = await supabase
                .from('cart_items')
                .update({ 
                    quantity: newQuantity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', itemId);

            if (error) throw error;

            // Update local state
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
            return true;
        } catch (error) {
            console.error('Error updating quantity:', error);
            Alert.alert('Error', 'Failed to update quantity');
            return false;
        }
    };

    const clearCart = async () => {
        if (!user) return false;

        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;

            setCartItems([]);
            Alert.alert('Success', 'Cart cleared');
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            Alert.alert('Error', 'Failed to clear cart');
            return false;
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getItemCount,
            refreshCart: fetchCartItems
        }}>
            {children}
        </CartContext.Provider>
    );
};