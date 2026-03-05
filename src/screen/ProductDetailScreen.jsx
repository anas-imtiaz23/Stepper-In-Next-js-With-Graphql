// import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
// import React, { useContext, useState } from 'react'
// import { LinearGradient } from 'expo-linear-gradient';
// import Header from '../Components/Header';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { CartContext } from '../context/CartContext';

// const sizes = ["S", "M", "L", "XL"];
// const colorsArray = [
//   "#91A1B0",
//   "#B11D1D",
//   "#1F44A3",
//   "#9F632A",
//   "#1D752B",
//   "#000000",
// ];

// const ProductDetailScreen = () => {
//     const [selectedSize, setSelectedSize] = useState("M");
//     const [selectedColor, setSelectedColor] = useState("#B11D1D");
//     const route = useRoute();
//     const navigation = useNavigation();
//     const { addToCartItem } = useContext(CartContext);
//     const product = route.params.product;
    
//     const handleAddToCart = () => {
//       // Add size and color to product object
//       product.color = selectedColor;
//       product.size = selectedSize;
      
//       // Add to cart using context
//       addToCartItem(product);
      
//       // Navigate to cart in the tab navigator
//       navigation.navigate('MAIN_TABS', {
//         screen: 'CART'
//       });
//     };
    
//   return (
//     <LinearGradient
//       colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradient}
//     >
//       <Header />
//       <View style={styles.imageContainer}>
//         <Image source={{uri: product.image}} style={styles.image} />
//       </View>
//       <View style={styles.contentContainer}>
//         <Text style={styles.title}>{product.title}</Text>
//         <Text style={[styles.title, styles.price]}>RS{product.price}</Text>
//       </View>
      
//       {/* Size Container */}
//       <View>
//         <Text style={[styles.title, styles.TextSize]}>Size</Text>
//       </View>
//       <View style={styles.sizeContainer}>
//         {sizes.map((size) => {
//           return (
//             <TouchableOpacity 
//               key={size}
//               style={styles.sizeValueContainer} 
//               onPress={() => setSelectedSize(size)}
//             >
//               <Text style={[styles.sizeValue, selectedSize === size && {color: "#E55858"}]}>{size}</Text>
//             </TouchableOpacity>
//           )
//         })}
//       </View>
      
//       {/* Colors Container */}
//       <Text style={[styles.title, styles.ColorText]}>Colors</Text>
//       <View style={styles.ColorContainer}>
//         {colorsArray.map((color) => {
//           return (
//             <TouchableOpacity 
//               key={color}
//               style={[
//                 styles.circleBorder, 
//                 {borderColor: color},
//                 selectedColor === color && styles.selectedColorBorder
//               ]} 
//               onPress={() => setSelectedColor(color)}
//             >
//               <View style={[styles.circle, {backgroundColor: color}]} />
//             </TouchableOpacity>
//           );
//         })}
//       </View>
      
//       {/* Add to Cart Button with navigation */}
//       <TouchableOpacity 
//         style={styles.button}
//         onPress={handleAddToCart}
//       >
//         <Text style={styles.buttonText}>Add TO Cart</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   )
// }

// export default ProductDetailScreen

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   imageContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   image: {    
//     width: '100%',
//     height: 420,
//     marginTop: 10,
//   },
//   contentContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 20,
//     marginVertical: 15,
//   },
//   title: {
//     fontSize: 22,
//     color: '#444444',
//     fontWeight: '500',
//   },
//   price: {
//     color: '#4D4D44',
//   },
//   TextSize: {
//     marginHorizontal: 20,
//   },
//   sizeContainer: {  
//     flexDirection: 'row',
//     marginHorizontal: 20,
//   },
//   sizeValue: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   sizeValueContainer: {
//     height: 36,
//     width: 36,
//     borderRadius: 18,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   ColorText: {
//     marginHorizontal: 20,
//     marginTop: 10,
//   },
//   circle: {
//     height: 36,
//     width: 36,
//     borderRadius: 18,
//   },
//   ColorContainer: {
//     flexDirection: 'row',
//     marginHorizontal: 20,
//     marginTop: 10,
//     flexWrap: 'wrap',
//   },
//   circleBorder: {   
//     borderWidth: 1,
//     height: 48,
//     width: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   selectedColorBorder: {
//     borderWidth: 3,
//     borderColor: '#E55858',
//   },
//   button: {
//     backgroundColor: '#E55858',
//     padding:10,
//     margin:10,
//     borderRadius: 20,
//   },
//   buttonText: {
//     fontSize: 24,
//     fontWeight: '600',
//     color:"white",
//     textAlign: 'center',
//   },
// })

// this is the product details screen that is working properly before the supabase 
import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailScreen = ({ navigation, route }) => {
    const { product } = route.params || {};
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('#B11D1D');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    
    const { addToCart } = useContext(CartContext);
    const { user } = useAuth();

    // Mock data - replace with actual product data
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['#B11D1D', '#000000', '#4A90E2', '#7ED321', '#F5A623', '#9C27B0'];

    const handleAddToCart = async () => {
        if (!user) {
            Alert.alert(
                'Login Required',
                'Please login to add items to cart',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => navigation.navigate('LOGIN') }
                ]
            );
            return;
        }

        setAddingToCart(true);
        try {
            // Prepare cart item with proper structure
            const cartItem = {
                id: product?.id || `product_${Date.now()}`,
                product_id: product?.id || `product_${Date.now()}`,
                title: product?.title || 'Product Name',
                price: product?.price || 99.99,
                image: product?.image || 'https://via.placeholder.com/150',
                color: selectedColor,
                size: selectedSize,
                quantity: quantity
            };

            // Add to cart using context
            const success = await addToCart(cartItem);
            
            if (success) {
                // Optional: Show options after successful add
                Alert.alert(
                    'Added to Cart',
                    'Item has been added to your cart',
                    [
                        { 
                            text: 'Continue Shopping', 
                            style: 'cancel',
                            onPress: () => console.log('Continue shopping')
                        },
                        { 
                            text: 'View Cart', 
                            onPress: () => navigation.navigate('CART') 
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error in handleAddToCart:', error);
            Alert.alert('Error', 'Failed to add item to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            Alert.alert(
                'Login Required',
                'Please login to proceed to checkout',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => navigation.navigate('LOGIN') }
                ]
            );
            return;
        }

        setBuyingNow(true);
        try {
            // Prepare cart item
            const cartItem = {
                id: product?.id || `product_${Date.now()}`,
                product_id: product?.id || `product_${Date.now()}`,
                title: product?.title || 'Product Name',
                price: product?.price || 99.99,
                image: product?.image || 'https://via.placeholder.com/150',
                color: selectedColor,
                size: selectedSize,
                quantity: quantity
            };

            // Add to cart first
            const success = await addToCart(cartItem);
            
            if (success) {
                // Navigate to payment with product details
                navigation.navigate('PAYMENT', { 
                    items: [cartItem],
                    total: cartItem.price * cartItem.quantity,
                    fromBuyNow: true 
                });
            }
        } catch (error) {
            console.error('Error in handleBuyNow:', error);
            Alert.alert('Error', 'Failed to process your order. Please try again.');
        } finally {
            setBuyingNow(false);
        }
    };

    if (!product) {
        return (
            <LinearGradient
                colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color="#E55858" />
                    <Text style={styles.errorTitle}>Product Not Found</Text>
                    <Text style={styles.errorMessage}>The product you're looking for doesn't exist.</Text>
                    <TouchableOpacity
                        style={styles.goBackButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.goBackButtonText}>Go Back</Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color="#444" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Product Details</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CART')} style={styles.iconButton}>
                        <Ionicons name="cart-outline" size={24} color="#444" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: product.image || 'https://via.placeholder.com/400' }} 
                            style={styles.productImage} 
                        />
                    </View>

                    {/* Product Info */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.productTitle}>{product.title || 'Product Name'}</Text>
                        <Text style={styles.productPrice}>Rs {product.price?.toFixed(2) || '99.99'}</Text>
                        
                        {/* Description */}
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            {product.description || 'This is a great product that you will love wearing. Made with high quality materials for maximum comfort and style.'}
                        </Text>

                        {/* Size Selection */}
                        <Text style={styles.sectionTitle}>Select Size</Text>
                        <View style={styles.sizeContainer}>
                            {sizes.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.sizeButton,
                                        selectedSize === size && styles.selectedSizeButton
                                    ]}
                                    onPress={() => setSelectedSize(size)}
                                >
                                    <Text style={[
                                        styles.sizeButtonText,
                                        selectedSize === size && styles.selectedSizeButtonText
                                    ]}>{size}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Color Selection */}
                        <Text style={styles.sectionTitle}>Select Color</Text>
                        <View style={styles.colorContainer}>
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorButton,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColorButton
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>

                        {/* Quantity */}
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={addingToCart || buyingNow}
                            >
                                <Ionicons name="remove" size={20} color="#E55858" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                                disabled={addingToCart || buyingNow}
                            >
                                <Ionicons name="add" size={20} color="#E55858" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Buttons */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={[styles.addToCartButton, (addingToCart || buyingNow) && styles.disabledButton]}
                        onPress={handleAddToCart}
                        disabled={addingToCart || buyingNow}
                    >
                        {addingToCart ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Ionicons name="cart-outline" size={20} color="#fff" />
                                <Text style={styles.addToCartText}>Add to Cart</Text>
                            </>
                        )}
                    </TouchableOpacity>
                     </View>
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
    iconButton: {
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
        fontSize: 18,
        fontWeight: '700',
        color: '#444',
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
    goBackButton: {
        backgroundColor: '#E55858',
        paddingHorizontal: 30,
        paddingVertical: 12,
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
    goBackButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imageContainer: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 20,
        padding: 20,
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
    productImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
    infoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    productTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#444',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: '600',
        color: '#E55858',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginTop: 15,
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sizeButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedSizeButton: {
        backgroundColor: '#E55858',
        borderColor: '#E55858',
    },
    sizeButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    selectedSizeButtonText: {
        color: '#fff',
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColorButton: {
        borderColor: '#E55858',
        borderWidth: 3,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginHorizontal: 20,
    },
    bottomContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
    addToCartButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#E55858',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buyNowButton: {
        flex: 0.5,
        backgroundColor: '#4A90E2',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
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
    disabledButton: {
        opacity: 0.7,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    buyNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProductDetailScreen;