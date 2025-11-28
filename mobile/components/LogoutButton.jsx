import { Alert, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import useAuthStore from '../store/authStore';
import createStyles from '../assets/styles/profile.styles';
import { ThemeContext } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const LogoutButton = () => {
  const { logout, user } = useAuthStore();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  if (!user) return null;

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: logout, style: "destructive" }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={theme.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
