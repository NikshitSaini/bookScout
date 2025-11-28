import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
// import COLORS from '../../constants/colors';
import { ThemeContext } from '../../components/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const COLORS = theme;
  const insets = useSafeAreaInsets();
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: COLORS.primary,
            headerTitleStyle:{
              COLORS:COLORS.primary,
              fontSize:20,
              fontWeight:600,
            },
            headerShadowVisible:false,
            tabBarStyle:{
              backgroundColor:COLORS.cardBackground,
              borderTopWidth:1,
              elevation:0,
              height:60+insets.bottom,
              paddingBottom:insets.bottom,
              paddingTop:5,
              borderTopColor:COLORS.border,
            }
        }}
    >
            <Tabs.Screen name="index" options={{
              headerShown:false,tabBarLabel:"Home",
              title:"Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
              }} />
            <Tabs.Screen name="create" options={{
              headerShown:false,tabBarLabel:"Create",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add-circle-outline" size={size} color={color} />
              ),
              }} />
            <Tabs.Screen name="profile" options={{
              headerShown:false,tabBarLabel:"Profile",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
              }} />
        </Tabs>
  )
}

export default TabNavigator

const styles = StyleSheet.create({})