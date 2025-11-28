import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { Image } from 'expo-image'
import useAuthStore from '../store/authStore'
import createStyles from '../assets/styles/profile.styles'
import { formatMemberSince } from '../lib/utils'
import { ThemeContext } from './ThemeContext'
import ThemeToggleButton from './ThemeToggleButton'
const ProfileHeader = () => {
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);
  const{user}=useAuthStore();
  if(!user){
    return null;
  }

  return (
    <View style={styles.profileHeader}>
      <Image source={{uri:user.profileImage}} style={styles.profileImage}/>
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>Joined {formatMemberSince(user.createdAt)}</Text>
      </View>
      <ThemeToggleButton compact={true} />
    </View>
  )
}

export default ProfileHeader