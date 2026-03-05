import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const ProductCard = ({ product }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("PRODUCT_DETAILS", { product });
  }

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{uri: product.image}} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.productName}>{product.title}</Text>
          <Text style={styles.productPrice}>Rs {product.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  details: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
})