import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const Header = ({ isCart }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {isCart ? (
        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ) : (
        <View style={styles.appIconContainer}>
          <Image 
            source={require('../../assets/appicon.png')} 
            style={styles.appIcon} 
          />
        </View>
      )}

      {isCart && <Text style={styles.titleText}>My Cart</Text>}
      
      <View>
        <Image 
          source={require('../../assets/girldpicon.png')} 
          style={styles.profileImage} 
        />
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
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
  },
  appIconContainer: {
    backgroundColor: '#fff',
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  appIcon: {
    width: 28,
    height: 28,
  },
  profileImage: {
    width: 44,
    height: 44, 
    borderRadius: 22,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
})