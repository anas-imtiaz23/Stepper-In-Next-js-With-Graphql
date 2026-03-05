import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../Components/Header';
import Category from '../Components/Category';
import ProductCard from '../Components/ProductCard';
import data from '../data/data.json';

const categoriesData = ["Trending Now", "All", "New", "Men", "Women"]

// Sample product data - in real app, this would come from API
const HomeScreen = () => {
    const [products, setProducts] = useState(data.products);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Render each product card
    const renderProductCard = ({ item }) => (
        <View style={styles.productCardContainer}>
            <ProductCard product={item} />
        </View>
    );

    return (
        <LinearGradient
            colors={['#FFB6C1', '#FFC0CB', '#FFD1DC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <Header />
            
            {/* Fixed header content */}
            <View style={styles.fixedHeader}>
                {/* Match Text */}
                <View style={styles.matchTextContainer}>
                    <Text style={styles.matchText}>Match Your Own Style</Text>
                    <View style={styles.matchUnderline} />
                </View>

                {/* Search Section */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search products..."
                            placeholderTextColor="#999"
                            value={searchText}
                            onChangeText={setSearchText}
                            selectionColor="#FF69B4"
                        />
                    </View>
                </View>

                {/* Categories - Horizontal List */}
                <View style={styles.categoriesContainer}>
                    <FlatList 
                        data={categoriesData} 
                        renderItem={({item})=>(
                            <Category 
                                item={item} 
                                selectedCategory={selectedCategory} 
                                setSelectedCategory={setSelectedCategory}
                            />
                        )} 
                        keyExtractor={(item)=>item} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>

            {/* Products Grid - Scrollable FlatList with 2 columns */}
            <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={styles.productsRow}
                ListHeaderComponent={
                    <Text style={styles.sectionTitle}>Recommended for You</Text>
                }
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>End of Products</Text>
                    </View>
                }
            />
        </LinearGradient>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    fixedHeader: {
        backgroundColor: 'transparent',
        paddingBottom: 5,
    },
    matchTextContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
    },
    matchText: {
        fontSize: 28,
        fontWeight: 'bold', 
        color: '#000000',
        letterSpacing: 0.5,
    },
    matchUnderline: {
        width: 60,
        height: 3,
        backgroundColor: '#FF69B4',
        marginTop: 5,
        borderRadius: 2,
    },
    searchSection: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
        color: '#FF69B4',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        padding: 0,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#8B4C5E',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    productsGrid: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    productsRow: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    productCardContainer: {
        width: '48%', // Slightly less than 50% for spacing between columns
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#999',
    },
})