import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const AccountScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOrders, setShowOrders] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { user, signOut } = useAuth();

    // Fetch orders when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('AccountScreen focused - fetching orders');
            if (user) {
                fetchOrders();
            }
        }, [user])
    );

    useEffect(() => {
        console.log('AccountScreen mounted, user:', user);
        if (user) {
            fetchProfile();
            fetchOrders();
            
            // Set up real-time subscription for orders
            const ordersSubscription = supabase
                .channel('orders_channel')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'orders',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        console.log('Real-time order update:', payload);
                        fetchOrders(); // Refresh orders when changes occur
                        
                        // Show notification for new order
                        if (payload.eventType === 'INSERT') {
                            Alert.alert(
                                '🎉 New Order Placed!',
                                'Your order has been successfully placed.',
                                [{ text: 'View Orders', onPress: () => setShowOrders(true) }]
                            );
                        }
                    }
                )
                .subscribe();

            return () => {
                ordersSubscription.unsubscribe();
            };
        } else {
            console.log('No user found, waiting for auth...');
            setTimeout(() => {
                if (!user) {
                    setError('No user logged in');
                    setLoading(false);
                    setOrdersLoading(false);
                }
            }, 3000);
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            console.log('Fetching profile for user ID:', user?.id);
            
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                setError(profileError.message);
                setLoading(false);
                return;
            }

            if (profileData) {
                console.log('Profile found:', profileData);
                setProfile(profileData);
            } else {
                console.log('No profile found for user:', user.id);
                await createProfile();
            }
        } catch (error) {
            console.error('Exception in fetchProfile:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            console.log('Fetching orders for user:', user?.id);
            
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (ordersError) {
                console.error('Error fetching orders:', ordersError);
            } else {
                console.log(`Found ${ordersData?.length || 0} orders`);
                setOrders(ordersData || []);
            }
        } catch (error) {
            console.error('Exception in fetchOrders:', error);
        } finally {
            setOrdersLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, []);

    const createProfile = async () => {
        try {
            console.log('Creating new profile for user:', user.id);
            
            const fullName = user.user_metadata?.full_name || 
                           user.email?.split('@')[0] || 
                           'User';

            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: user.id,
                        full_name: fullName,
                        email: user.email,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }
                ])
                .select()
                .single();

            if (insertError) {
                console.error('Error creating profile:', insertError);
                setProfile({
                    id: user.id,
                    full_name: fullName,
                    email: user.email,
                });
            } else {
                console.log('Profile created successfully:', newProfile);
                setProfile(newProfile);
            }
        } catch (error) {
            console.error('Exception in createProfile:', error);
            setProfile({
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                email: user.email,
            });
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    onPress: async () => {
                        await signOut();
                        navigation.replace('LOGIN');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

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

    const getOrderItemCount = (items) => {
        try {
            if (Array.isArray(items)) {
                return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            } else if (typeof items === 'object' && items !== null) {
                return 1;
            }
            return 1;
        } catch (e) {
            return 1;
        }
    };

    const getCartItemCount = () => {
        // You can implement this based on your cart context
        return 0;
    };

    // Simplified menu items - only Sign Out
    const menuItems = [
        {
            icon: 'log-out-outline',
            title: 'Sign Out',
            subtitle: '',
            onPress: handleSignOut,
            isDestructive: true,
        },
    ];

    if (loading && ordersLoading) {
        return (
            <LinearGradient
                colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E55858" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient
                colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color="#E55858" />
                    <Text style={styles.errorTitle}>Error Loading Profile</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setLoading(true);
                            setError(null);
                            fetchProfile();
                            fetchOrders();
                        }}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (!user) {
        return (
            <LinearGradient
                colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.errorContainer}>
                    <Ionicons name="log-in-outline" size={60} color="#E55858" />
                    <Text style={styles.errorTitle}>Not Logged In</Text>
                    <Text style={styles.errorMessage}>Please log in to view your account</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => navigation.replace('LOGIN')}
                    >
                        <Text style={styles.retryButtonText}>Go to Login</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    const displayName = profile?.full_name || 
                       user?.user_metadata?.full_name || 
                       user?.email?.split('@')[0] || 
                       'User';
    
    const displayEmail = profile?.email || user?.email || '';

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
                    <Text style={styles.headerTitle}>My Account</Text>
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
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person-circle" size={70} color="#E55858" />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{displayName}</Text>
                            <Text style={styles.userEmail}>{displayEmail}</Text>
                        </View>
                    </View>

                    {/* Stats Section */}
                    <TouchableOpacity 
                        style={styles.statsContainer}
                        onPress={() => setShowOrders(!showOrders)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{orders.length}</Text>
                            <Text style={styles.statLabel}>Total Orders</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                Rs {orders.reduce((sum, order) => sum + (order.amount || 0), 0).toFixed(2)}
                            </Text>
                            <Text style={styles.statLabel}>Total Spent</Text>
                        </View>
                        <Ionicons 
                            name={showOrders ? 'chevron-up' : 'chevron-down'} 
                            size={24} 
                            color="#E55858" 
                            style={styles.statChevron}
                        />
                    </TouchableOpacity>

                    {/* Cart Summary (optional) */}
                    <TouchableOpacity 
                        style={styles.cartSummary}
                        onPress={() => navigation.navigate('CART')}
                    >
                        <View style={styles.cartSummaryLeft}>
                            <Ionicons name="cart-outline" size={24} color="#E55858" />
                            <Text style={styles.cartSummaryText}>View My Cart</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    {/* Orders History Section */}
                    {showOrders && (
                        <View style={styles.ordersContainer}>
                            <View style={styles.ordersHeader}>
                                <Text style={styles.ordersTitle}>Order History</Text>
                                {orders.length > 0 && (
                                    <TouchableOpacity onPress={() => navigation.navigate('REORDER')}>
                                        <Text style={styles.viewAllText}>View All</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            {ordersLoading ? (
                                <ActivityIndicator size="small" color="#E55858" style={styles.ordersLoader} />
                            ) : orders.length === 0 ? (
                                <View style={styles.noOrdersContainer}>
                                    <Ionicons name="receipt-outline" size={50} color="#999" />
                                    <Text style={styles.noOrdersText}>No orders yet</Text>
                                    <TouchableOpacity
                                        style={styles.shopNowButton}
                                        onPress={() => navigation.navigate('HOME')}
                                    >
                                        <Text style={styles.shopNowText}>Start Shopping</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                orders.slice(0, 3).map((order) => (
                                    <View key={order.id} style={styles.orderCard}>
                                        <View style={styles.orderHeader}>
                                            <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
                                            <View style={styles.orderStatusBadge}>
                                                <Text style={styles.orderStatus}>{order.status || 'PAID'}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={styles.orderDetails}>
                                            <View style={styles.orderDetailRow}>
                                                <Ionicons name="cart-outline" size={16} color="#666" />
                                                <Text style={styles.orderDetailText}>
                                                    {getOrderItemCount(order.items)} items
                                                </Text>
                                            </View>
                                            
                                            <View style={styles.orderDetailRow}>
                                                <Ionicons name="pricetag-outline" size={16} color="#666" />
                                                <Text style={styles.orderDetailText}>
                                                    Order: {order.id.substring(0, 8)}...
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        <View style={styles.orderFooter}>
                                            <Text style={styles.orderAmount}>Rs {order.amount?.toFixed(2)}</Text>
                                            <TouchableOpacity 
                                                style={styles.viewDetailsButton}
                                                onPress={() => navigation.navigate('REORDER', { orderId: order.id })}
                                            >
                                                <Text style={styles.viewDetailsText}>View</Text>
                                                <Ionicons name="arrow-forward" size={12} color="#E55858" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    )}

                    {/* Sign Out Button */}
                    <TouchableOpacity 
                        style={styles.signOutButton}
                        onPress={handleSignOut}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#E55858" />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    {/* App Version */}
                    <Text style={styles.versionText}>Version 1.0.0</Text>
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
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#444',
        marginTop: 20,
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#E55858',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    headerTitle: {
        fontSize: 24,
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
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 20,
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
    avatarContainer: {
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#444',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 15,
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: '#E55858',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginHorizontal: 10,
    },
    statChevron: {
        marginLeft: 10,
    },
    cartSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 15,
        padding: 15,
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
    cartSummaryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartSummaryText: {
        fontSize: 16,
        color: '#444',
        marginLeft: 10,
        fontWeight: '500',
    },
    ordersContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 15,
        padding: 15,
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
    ordersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    ordersTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
    viewAllText: {
        fontSize: 14,
        color: '#E55858',
        fontWeight: '600',
    },
    ordersLoader: {
        marginVertical: 20,
    },
    noOrdersContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    noOrdersText: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
        marginBottom: 15,
    },
    shopNowButton: {
        backgroundColor: '#E55858',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    shopNowText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderDate: {
        fontSize: 12,
        color: '#666',
    },
    orderStatusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    orderStatus: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    orderDetails: {
        marginBottom: 8,
    },
    orderDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    orderDetailText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E55858',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    viewDetailsText: {
        fontSize: 12,
        color: '#E55858',
        marginRight: 4,
        fontWeight: '500',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        padding: 15,
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
    signOutText: {
        fontSize: 16,
        color: '#E55858',
        marginLeft: 10,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 12,
        marginBottom: 30,
        marginTop: 10,
    },
});

export default AccountScreen;