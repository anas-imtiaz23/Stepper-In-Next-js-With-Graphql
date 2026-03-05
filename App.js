// import React, { useContext, useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Text, View, SafeAreaView, StyleSheet, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import HomeScreen from './src/screen/HomeScreen';
// import CartScreen from './src/screen/CartScreen';
// import ProductDetailsScreen from './src/screen/ProductDetailScreen';
// import PaymentScreen from './src/screen/PaymentScreen';
// import LoginScreen from './src/screen/LoginScreen';
// import SignupScreen from './src/screen/SignupScreen';
// import ReorderScreen from './src/screen/ReorderScreen';
// import AccountScreen from './src/screen/AccountScreen';
// import { CartContext, CartProvider } from './src/context/CartContext';
// import { AuthProvider } from './src/context/AuthContext';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// // Create a Tab Navigator component with cart context
// function TabNavigator() {
//   const { cartItems } = useContext(CartContext);
  
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'HOME') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'REORDER') {
//             iconName = focused ? 'repeat' : 'repeat-outline';
//           } else if (route.name === 'CART') {
//             iconName = focused ? 'cart' : 'cart-outline';
//           } else if (route.name === 'ACCOUNT') {
//             iconName = focused ? 'person' : 'person-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#FFC0CB',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: {
//           paddingBottom: 5,
//           paddingTop: 5,
//           height: 60,
//           backgroundColor: '#ffffff',
//           borderTopWidth: 1,
//           borderTopColor: '#e0e0e0',
//         },
//       })}
//     >
//       <Tab.Screen 
//         name="HOME" 
//         component={HomeScreen} 
//         options={{
//           title: 'Home',
//         }}
//       />
//       <Tab.Screen 
//         name="REORDER" 
//         component={ReorderScreen} 
//         options={{
//           title: 'Reorder',
//         }}
//       />
//       <Tab.Screen 
//         name="CART" 
//         component={CartScreen}
//         options={{
//           title: 'Cart',
//           tabBarBadge: cartItems?.length > 0 ? cartItems.length : undefined,
//         }}
//       />
//       <Tab.Screen 
//         name="ACCOUNT" 
//         component={AccountScreen} 
//         options={{
//           title: 'Account',
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Dynamic StripeProvider component
// function DynamicStripeProvider({ children }) {
//   const [StripeProvider, setStripeProvider] = useState(null);

//   useEffect(() => {
//     async function loadStripe() {
//       if (Platform.OS === 'web') {
//         // For web, use mock
//         const mock = await import('./src/utils/stripeMock.web');
//         setStripeProvider(() => mock.StripeProvider);
//       } else {
//         // For native, dynamically import the actual StripeProvider
//         try {
//           const stripe = await import('@stripe/stripe-react-native');
//           setStripeProvider(() => stripe.StripeProvider);
//         } catch (error) {
//           console.log('Stripe not available on this platform');
//           // Fallback to a dummy provider
//           setStripeProvider(() => ({ children }) => children);
//         }
//       }
//     }
//     loadStripe();
//   }, []);

//   if (!StripeProvider) {
//     // Return children directly while loading
//     return <>{children}</>;
//   }

//   return (
//     <StripeProvider
//       publishableKey="pk_test_51T4n4pF3mbxtWI52jJbN3r8EmkcuQF9HH5Lk2uxO4bL3yy019wyz9B62TOmWtLu5Iijs7hF9c69XsgrBsJ8tKvBv0065o3lsXB"
//       urlScheme="yourapp"
//     >
//       {children}
//     </StripeProvider>
//   );
// }

// // Main App with Stack Navigator wrapped in both providers
// export default function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <DynamicStripeProvider>
//           <NavigationContainer>
//             <Stack.Navigator
//               screenOptions={{
//                 headerShown: false,
//               }}
//             >
//               <Stack.Screen name="LOGIN" component={LoginScreen} />
//               <Stack.Screen name="SIGNUP" component={SignupScreen} />
//               <Stack.Screen name="MAIN_TABS" component={TabNavigator} />
//               <Stack.Screen name="PRODUCT_DETAILS" component={ProductDetailsScreen} />
//               <Stack.Screen name="PAYMENT" component={PaymentScreen} />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </DynamicStripeProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//   },
// });
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screen/HomeScreen';
import CartScreen from './src/screen/CartScreen';
import ProductDetailsScreen from './src/screen/ProductDetailScreen';
import PaymentScreen from './src/screen/PaymentScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/SignupScreen';
import ReorderScreen from './src/screen/ReorderScreen';
import AccountScreen from './src/screen/AccountScreen';
import LandingScreen from './src/screen/LandingScreen'; // Make sure this import is correct
import { CartContext, CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create a Tab Navigator component with cart context
function TabNavigator() {
  const { cartItems } = useContext(CartContext);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HOME') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'REORDER') {
            iconName = focused ? 'repeat' : 'repeat-outline';
          } else if (route.name === 'CART') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ACCOUNT') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFC0CB',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      })}
    >
      <Tab.Screen 
        name="HOME" 
        component={HomeScreen} 
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="REORDER" 
        component={ReorderScreen} 
        options={{
          title: 'Reorder',
        }}
      />
      <Tab.Screen 
        name="CART" 
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: cartItems?.length > 0 ? cartItems.length : undefined,
        }}
      />
      <Tab.Screen 
        name="ACCOUNT" 
        component={AccountScreen} 
        options={{
          title: 'Account',
        }}
      />
    </Tab.Navigator>
  );
}

// Dynamic StripeProvider component
function DynamicStripeProvider({ children }) {
  const [StripeProvider, setStripeProvider] = useState(null);

  useEffect(() => {
    async function loadStripe() {
      if (Platform.OS === 'web') {
        // For web, use mock
        const mock = await import('./src/utils/stripeMock.web');
        setStripeProvider(() => mock.StripeProvider);
      } else {
        // For native, dynamically import the actual StripeProvider
        try {
          const stripe = await import('@stripe/stripe-react-native');
          setStripeProvider(() => stripe.StripeProvider);
        } catch (error) {
          console.log('Stripe not available on this platform');
          // Fallback to a dummy provider
          setStripeProvider(() => ({ children }) => children);
        }
      }
    }
    loadStripe();
  }, []);

  if (!StripeProvider) {
    // Return children directly while loading
    return <>{children}</>;
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51T4n4pF3mbxtWI52jJbN3r8EmkcuQF9HH5Lk2uxO4bL3yy019wyz9B62TOmWtLu5Iijs7hF9c69XsgrBsJ8tKvBv0065o3lsXB"
      urlScheme="yourapp"
    >
      {children}
    </StripeProvider>
  );
}

// Main App with Stack Navigator wrapped in both providers
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <DynamicStripeProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="LANDING"
            >
              {/* Public/Landing Screens */}
              <Stack.Screen name="LANDING" component={LandingScreen} />
              <Stack.Screen name="LOGIN" component={LoginScreen} />
              <Stack.Screen name="SIGNUP" component={SignupScreen} />
              
              {/* Main App Screens */}
              <Stack.Screen name="MAIN_TABS" component={TabNavigator} />
              <Stack.Screen name="PRODUCT_DETAILS" component={ProductDetailsScreen} />
              <Stack.Screen name="PAYMENT" component={PaymentScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </DynamicStripeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});