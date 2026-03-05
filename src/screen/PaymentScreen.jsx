import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../Components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '../utils/stripe';
import { supabase } from '../lib/supabase';

const EDGE_FUNCTION_URL = 'https://fhewspcyglozpriowlga.supabase.co/functions/v1/create-payment-intent';

const PaymentScreen = ({ route, navigation }) => {
    const { totalAmount = 0, cartItems = [] } = route.params || {};
    
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentSheetReady, setPaymentSheetReady] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    useEffect(() => {
        if (totalAmount > 0) {
            initializePayment();
        }
    }, [totalAmount]);

    const initializePayment = async () => {
        setLoading(true);
        
        try {
            console.log('🔄 Initializing payment for amount:', totalAmount);
            
            const response = await fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalAmount }),
            });

            const data = await response.json();
            console.log('📡 Response:', data);

            if (data.error) {
                Alert.alert('Error', data.error);
                return;
            }

            if (!data.clientSecret) {
                Alert.alert('Error', 'Invalid response from payment server');
                return;
            }

            setClientSecret(data.clientSecret);
            
            // Initialize the payment sheet
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: data.clientSecret,
                merchantDisplayName: 'My Ecommerce Store',
                returnURL: 'yourapp://stripe-redirect',
                defaultBillingDetails: {
                    name: 'Customer',
                },
                style: 'automatic',
                allowsDelayedPaymentMethods: true,
            });

            if (initError) {
                console.log('❌ Init error:', initError);
                Alert.alert('Error', initError.message);
            } else {
                console.log('✅ Payment sheet ready');
                setPaymentSheetReady(true);
            }
            
        } catch (error) {
            console.log('❌ Error:', error);
            Alert.alert('Error', 'Failed to initialize payment: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (totalAmount <= 0) {
            Alert.alert('Error', 'Invalid total amount');
            return;
        }

        if (!paymentSheetReady) {
            Alert.alert('Error', 'Payment not ready yet');
            return;
        }

        console.log('💳 Opening payment sheet...');
        
        try {
            const { error } = await presentPaymentSheet();

            if (error) {
                console.log('❌ Payment error:', error);
                Alert.alert('Payment Failed', error.message);
            } else {
                console.log('✅ Payment successful!');
                
                // Show success popup
                Alert.alert(
                    '🎉 Order Submitted Successfully!',
                    'Your payment has been processed and your order has been confirmed.',
                    [
                        { 
                            text: 'View Orders', 
                            onPress: () => navigation.navigate('REORDER') 
                        },
                        { 
                            text: 'Continue Shopping', 
                            onPress: () => navigation.navigate('HOME'),
                            style: 'cancel'
                        }
                    ]
                );
                
                // Save order to Supabase (background process)
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    
                    // Save order
                    await supabase
                        .from('orders')
                        .insert({
                            user_id: user?.id,
                            amount: totalAmount,
                            items: cartItems,
                            status: 'paid',
                            created_at: new Date().toISOString(),
                        });
                    
                    // Clear cart
                    if (user) {
                        await supabase
                            .from('cart_items')
                            .delete()
                            .eq('user_id', user.id);
                    }
                    
                } catch (orderError) {
                    console.error('Order save error:', orderError);
                }
            }
        } catch (error) {
            console.log('💥 Exception:', error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <LinearGradient
            colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={goBack} style={styles.iconContainer}>
                        <Ionicons name="arrow-back" size={24} color="#444444" />
                    </TouchableOpacity>
                    <Header />
                </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Amount to Pay */}
                <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Total Amount</Text>
                    <Text style={styles.amountValue}>
                        Rs {totalAmount ? totalAmount.toFixed(2) : '0.00'}
                    </Text>
                </View>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                        {cartItems.map((item, index) => (
                            <View key={index} style={styles.summaryRow}>
                                <Text style={styles.summaryItem} numberOfLines={1}>
                                    {item.title} x{item.quantity}
                                </Text>
                                <Text style={styles.summaryPrice}>
                                    Rs {(item.price * item.quantity).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalAmountText}>Rs {totalAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                )}

                {/* Stripe Payment Info */}
                <View style={styles.infoContainer}>
                    <Ionicons name="lock-closed" size={40} color="#E55858" />
                    <Text style={styles.infoTitle}>Secure Checkout</Text>
                    <Text style={styles.infoText}>
                        Your payment information is encrypted and secure
                    </Text>
                    <View style={styles.cardIcons}>
                        <Ionicons name="logo-visa" size={30} color="#1A1F71" />
                        <Ionicons name="card" size={30} color="#0079AD" />
                        <Ionicons name="logo-amex" size={30} color="#006FCF" />
                    </View>
                </View>

                {/* Pay Button - This triggers the bottom sheet */}
                <TouchableOpacity 
                    style={[styles.payButton, (!paymentSheetReady || loading) && styles.disabledButton]} 
                    onPress={handlePayment}
                    disabled={!paymentSheetReady || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text style={styles.payButtonText}>
                                Pay Rs {totalAmount.toFixed(2)}
                            </Text>
                            <Text style={styles.payButtonSubText}>
                                {paymentSheetReady ? 'Tap to open secure payment' : 'Initializing...'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Security Note */}
                <Text style={styles.securityNote}>
                    <Ionicons name="shield-checkmark" size={14} color="#666" /> Powered by Stripe
                </Text>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    headerContainer: {
        padding: 15,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#fff',
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginRight: 10,
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 30,
    },
    amountContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    amountLabel: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 5,
    },
    amountValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#E55858',
    },
    summaryContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryItem: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    summaryPrice: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#444',
    },
    totalAmountText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#E55858',
    },
    infoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginTop: 10,
        marginBottom: 5,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
    },
    cardIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    payButton: {
        backgroundColor: '#E55858',
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#FFB6C1',
        opacity: 0.7,
    },
    payButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
    },
    payButtonSubText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    securityNote: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 15,
    },
});

export default PaymentScreen;
