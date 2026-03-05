import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

const CartCard = ({ item, handleDelete, handleUpdateQuantity }) => {
  
  const onDeletePress = () => {
    console.log('1. Delete button pressed for item:', item);
    console.log('2. Item ID to delete:', item.id);
    console.log('3. handleDelete function exists:', !!handleDelete);
    handleDelete?.(item.id);
  };

  const onQuantityDecrease = () => {
    console.log('Decrease quantity for item:', item.id, 'current quantity:', item.quantity);
    handleUpdateQuantity?.(item.id, item.quantity - 1);
  };

  const onQuantityIncrease = () => {
    console.log('Increase quantity for item:', item.id, 'current quantity:', item.quantity);
    handleUpdateQuantity?.(item.id, item.quantity + 1);
  };

  return (
    <View style={styles.Container}>
      <Image source={{ uri: item?.image }} style={styles.Coverimage} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item?.title}</Text>
        <Text style={styles.price}>Rs {item?.price}</Text>
        
        {/* Color and Size Container */}
        <View style={styles.textCircleContainer}>
          <View
            style={[styles.circle, { backgroundColor: item?.color || "#B11D1D" }]}
          />
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeText}>{item?.size || "M"}</Text>
          </View>
          
          {/* Quantity Controls */}
          {handleUpdateQuantity && (
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                onPress={onQuantityDecrease}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={18} color="#E55858" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity 
                onPress={onQuantityIncrease}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={18} color="#E55858" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      {/* Delete Icon */}
      <TouchableOpacity onPress={onDeletePress} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
};

export default CartCard;

// Styles remain the same
const styles = StyleSheet.create({
  Container: {
    marginVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  Coverimage: {
    height: 100,
    width: "25%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444444",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "#797979",
    fontWeight: "600",
    marginBottom: 8,
  },
  textCircleContainer: {
    flexDirection: "row",
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  circle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sizeContainer: {
    backgroundColor: "#F5F5F5",
    height: 28,
    width: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444444",
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    paddingHorizontal: 8,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});