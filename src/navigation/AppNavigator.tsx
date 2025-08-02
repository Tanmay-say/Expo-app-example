import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';
import { View } from 'react-native';

import { RootStackParamList, MainTabsParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/SearchScreen';
import { cartService } from '../services/cartService';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function CartTabIcon({ color, size }: { color: string; size: number }) {
  const [itemCount, setItemCount] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = cartService.subscribe((cart) => {
      setItemCount(cartService.getItemCount());
    });

    // Initial load
    setItemCount(cartService.getItemCount());

    return unsubscribe;
  }, []);

  return (
    <View style={{ position: 'relative' }}>
      <MaterialIcons name="shopping-cart" size={size} color={color} />
      {itemCount > 0 && (
        <Badge
          size={16}
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: '#e53935',
          }}
        >
          {itemCount > 99 ? '99+' : itemCount.toString()}
        </Badge>
      )}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: CartTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            title: 'Product Details',
            headerStyle: { backgroundColor: '#1976d2' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Search Products',
            headerStyle: { backgroundColor: '#1976d2' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            title: 'Checkout',
            headerStyle: { backgroundColor: '#1976d2' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}