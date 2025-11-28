import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react'; 
import { ThemeContext } from './ThemeContext';

const Loader = ({ size = "large" }) => {
  const { theme } = useContext(ThemeContext);
  const COLORS = theme;

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.background,
    }}>
      <ActivityIndicator size={size} color={COLORS.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
