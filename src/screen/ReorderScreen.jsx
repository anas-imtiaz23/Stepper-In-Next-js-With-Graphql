import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const ReorderScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    // Fetch orders when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('ReorderScreen focused - fetching orders');
            fetchOrders();
        }, [])
    );

    // Also fetch on initial mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderTotal = (order) => {
        if (order.amount) {
            return order.amount;
        }
        if (order.items && Array.isArray(order.items)) {
            return order.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        }
        return 0;
    };

    const getItemCount = (order) => {
        if (order.items && Array.isArray(order.items)) {
            return order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
        return 1;
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
                    <Text style={styles.headerTitle}>Order History</Text>
                    <TouchableOpacity onPress={fetchOrders} style={styles.refreshButton}>
                        <Ionicons name="refresh-outline" size={24} color="#E55858" />
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#E55858']}
                            tintColor="#E55858"
                        />
                    }
                >
                    {orders.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={80} color="#E55858" />
                            <Text style={styles.emptyTitle}>No Orders Yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Your order history will appear here
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
                            {/* Summary Card */}
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Total Orders</Text>
                                    <Text style={styles.summaryValue}>{orders.length}</Text>
                                </View>
                                <View style={styles.summaryDivider} />
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Total Spent</Text>
                                    <Text style={styles.summaryValue}>
                                        Rs {orders.reduce((sum, order) => sum + getOrderTotal(order), 0).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* Orders List */}
                            {orders.map((order) => (
                                <View key={order.id} style={styles.orderCard}>
                                    <View style={styles.orderHeader}>
                                        <View style={styles.orderHeaderLeft}>
                                            <Ionicons name="calendar-outline" size={14} color="#666" />
                                            <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
                                        </View>
                                        <View style={styles.orderStatusBadge}>
                                            <Text style={styles.orderStatus}>{order.status || 'PAID'}</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.orderContent}>
                                        {/* Order Items */}
                                        <View style={styles.orderItems}>
                                            {order.items && Array.isArray(order.items) ? (
                                                order.items.slice(0, 2).map((item, index) => (
                                                    <View key={index} style={styles.orderItem}>
                                                        {item.image ? (
                                                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                                                        ) : (
                                                            <View style={[styles.itemImage, styles.placeholderImage]}>
                                                                <Ionicons name="image-outline" size={20} color="#999" />
                                                            </View>
                                                        )}
                                                        <View style={styles.itemDetails}>
                                                            <Text style={styles.itemName} numberOfLines={1}>
                                                                {item.title || item.name || 'Product'}
                                                            </Text>
                                                            <View style={styles.itemMeta}>
                                                                <Text style={styles.itemQuantity}>Qty: {item.quantity || 1}</Text>
                                                                {item.price && (
                                                                    <Text style={styles.itemPrice}>
                                                                        Rs {(item.price * (item.quantity || 1)).toFixed(2)}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                            ) : (
                                                <View style={styles.orderItem}>
                                                    <View style={[styles.itemImage, styles.placeholderImage]}>
                                                        <Ionicons name="cube-outline" size={20} color="#999" />
                                                    </View>
                                                    <View style={styles.itemDetails}>
                                                        <Text style={styles.itemName}>Order #{order.id.substring(0, 8)}</Text>
                                                        <Text style={styles.itemQuantity}>Items: {getItemCount(order)}</Text>
                                                    </View>
                                                </View>
                                            )}
                                            
                                            {order.items && Array.isArray(order.items) && order.items.length > 2 && (
                                                <Text style={styles.moreItems}>
                                                    +{order.items.length - 2} more items
                                                </Text>
                                            )}
                                        </View>

                                        {/* Order Footer */}
                                        <View style={styles.orderFooter}>
                                            <View>
                                                <Text style={styles.orderIdLabel}>Order ID</Text>
                                                <Text style={styles.orderId}>{order.id.substring(0, 12)}...</Text>
                                            </View>
                                            <View style={styles.orderAmountContainer}>
                                                <Text style={styles.orderAmountLabel}>Total</Text>
                                                <Text style={styles.orderAmount}>
                                                    Rs {getOrderTotal(order).toFixed(2)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}
                </ScrollView>
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
    refreshButton: {
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
        alignItems: 'center',
        paddingTop: 100,
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
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E55858',
    },
    summaryDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginHorizontal: 15,
    },
    orderCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    orderHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderDate: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    orderStatusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    orderStatus: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    orderContent: {
        padding: 15,
    },
    orderItems: {
        marginBottom: 15,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 10,
    },
    placeholderImage: {
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 13,
        color: '#444',
        fontWeight: '500',
        marginBottom: 2,
    },
    itemMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemQuantity: {
        fontSize: 11,
        color: '#999',
    },
    itemPrice: {
        fontSize: 12,
        color: '#E55858',
        fontWeight: '600',
    },
    moreItems: {
        fontSize: 11,
        color: '#E55858',
        marginTop: 5,
        marginLeft: 50,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    orderIdLabel: {
        fontSize: 10,
        color: '#999',
        marginBottom: 2,
    },
    orderId: {
        fontSize: 11,
        color: '#666',
    },
    orderAmountContainer: {
        alignItems: 'flex-end',
    },
    orderAmountLabel: {
        fontSize: 10,
        color: '#999',
        marginBottom: 2,
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E55858',
    },
});

export default ReorderScreen;