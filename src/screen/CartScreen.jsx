import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import CartCard from '../Components/CartCard';
import ConfirmationModal from '../Components/ConfirmationModal';

const CartScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    
    const { 
        cartItems, 
        loading, 
        removeFromCart, 
        updateQuantity,
        getCartTotal,
        getItemCount,
        clearCart 
    } = useContext(CartContext);

    const handleDelete = (id) => {
        console.log('🛒 Delete icon clicked for ID:', id);
        setSelectedItemId(id);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        console.log('✅ User confirmed delete for ID:', selectedItemId);
        setModalVisible(false);
        // Small delay to ensure modal closes properly
        setTimeout(() => {
            removeFromCart(selectedItemId);
            setSelectedItemId(null);
        }, 300);
    };

    const cancelDelete = () => {
        console.log('❌ User cancelled delete');
        setModalVisible(false);
        setSelectedItemId(null);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert('Cart Empty', 'Add some items to your cart first');
            return;
        }
        
        const total = getCartTotal();
        navigation.navigate('PAYMENT', { 
            totalAmount: total,
            cartItems: cartItems
        });
    };

    const handleClearCart = () => {
        if (cartItems.length === 0) return;
        
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to remove all items?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    onPress: () => clearCart(),
                    style: 'destructive'
                }
            ]
        );
    };

    if (loading) {
        return (
            <LinearGradient
                colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E55858" />
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#444" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Shopping Cart ({getItemCount()})</Text>
                    {cartItems.length > 0 && (
                        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
                            <Ionicons name="trash-outline" size={24} color="#E55858" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    visible={modalVisible}
                    title="Remove Item"
                    message="Are you sure you want to remove this item from your cart?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />

                {cartItems.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={80} color="#E55858" />
                        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                        <Text style={styles.emptySubtitle}>
                            Looks like you haven't added anything to your cart yet
                        </Text>
                        <TouchableOpacity
                            style={styles.shopButton}
                            onPress={() => navigation.navigate('HOME')}
                        >
                            <Text style={styles.shopButtonText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {cartItems.map((item) => (
                                <CartCard
                                    key={item.id}
                                    item={item}
                                    handleDelete={handleDelete}
                                    handleUpdateQuantity={updateQuantity}
                                />
                            ))}
                        </ScrollView>

                        <View style={styles.footer}>
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalAmount}>Rs {getCartTotal().toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.checkoutButton}
                                onPress={handleCheckout}
                            >
                                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    },
    backButton: {
        backgroundColor: '#fff',
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#444',
    },
    clearButton: {
        backgroundColor: '#fff',
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#444',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    shopButton: {
        backgroundColor: '#E55858',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E55858',
    },
    checkoutButton: {
        backgroundColor: '#E55858',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default CartScreen;