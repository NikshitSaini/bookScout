import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import createStyles from '../../assets/styles/signup.styles'
import React, { useState, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
// import COLORS from '../../constants/colors';
import { ThemeContext } from '../../components/ThemeContext';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/authStore';
const signup = () => {
  const { theme } = useContext(ThemeContext);
  const COLORS = theme;
  const styles = createStyles(theme);
  const [username,setusername]=useState("");
  const [email,setemail]=useState("");
  const [pass,setpass]=useState("");
  const [ShowPass,setShowPass]=useState(false);
  const router = useRouter();
  const{user,isLoading,register}=useAuthStore();


  const handleRegister = async () => {
    const result = await register(username, email, pass);

    if (!result.success) {
      Alert.alert("Registration Failed", result.error);
      return;
    }
    Alert.alert("Registration Successful", "You have been registered successfully!");
  };

  return (
    <KeyboardAvoidingView
    style={{flex:1}} behavior={
      Platform.OS === 'ios' ? 'padding' : 'height'
    }>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Book Worm </Text>
            <Text style={styles.subtitle}>Share Your Fav. Reads</Text>
          </View>
          <View style={styles.formContainer}>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput 
                style={styles.input}
                placeholder="Enter Your Username"
                placeholderTextColor={COLORS.placeholderText}
                value={username}
                onChangeText={setusername} 
                autoCapitalize='none'
                />
              </View>
              
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput 
                  style={styles.input}
                  placeholder="Enter Your Email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setemail} 
                  autoCapitalize='none'
                  />
                </View>
              </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput 
                style={styles.input} 
                placeholder="Enter Your Password"
                placeholderTextColor={COLORS.placeholderText}
                value={pass} 
                onChangeText={setpass}
                secureTextEntry={!ShowPass}
                autoCapitalize='none'
                />
                <TouchableOpacity onPress={()=>setShowPass(!ShowPass)}>
                  <Ionicons 
                  name={!ShowPass ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.primary} 
                  style={styles.inputIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
              <Text style={styles.buttonText}>{isLoading ? "Signing Up..." : "Sign Up"}</Text>
            </TouchableOpacity>  
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={()=>{router.back()}}>
                <Text style={styles.footerLink}> Login</Text>
              </TouchableOpacity>
              </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default signup