import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemeContext } from './ThemeContext';

const SafeScreen = ({children}) => {
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);
    const insets= useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
      {children}
    </View>
  )
}

export default SafeScreen

const createStyles = (theme) => StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:theme.background,
    }
})