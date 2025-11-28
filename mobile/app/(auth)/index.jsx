import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import loginstyles from '../../assets/styles/login.styles'
import React, { useContext, useState } from 'react'
import { useEffect, } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import useAuthStore from '../../store/authStore';
import { Alert } from 'react-native';
import { ThemeContext } from '../../components/ThemeContext';


const login = () => {
  const [email,setemail]=useState("");
  const [pass,setpass]=useState("");
  const [ShowPass,setShowPass]=useState(false);
  const {login,isLoading}=useAuthStore();
  const { theme } = useContext(ThemeContext);
  const COLORS = theme;
  const styles = loginstyles(theme);

  const handleLogin=async ()=>{
    const result=await login(email,pass);
    if(!result.success){
      Alert.alert("Login Failed",result.error);
      return;
    }
    Alert.alert("Login Successful","You have been logged in successfully!");
  }
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={
      Platform.OS === 'ios' ? 'padding' : 'height'
    }>

    <View style={[styles.container]}>
      <View style={styles.topIllustration}>
        <Image source={require("../../assets/images/i2.png")} style={styles.illustrationImage}/>
      </View>
      <View style={styles.card}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput 
              style={styles.input} 
              placeholder="Enter Your Email" 
              placeholderTextColor={COLORS.placeholderText}
              value={email} 
              onChangeText={(text)=>setemail(text)} 
              keyboardType='email-address' 
              autoCapitalize='none'/>
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
              keyboardType='password' 
              autoCapitalize='none'/>
              <TouchableOpacity onPress={()=>setShowPass(!ShowPass)}>
                <Ionicons 
                name={!ShowPass ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={COLORS.primary} 
                style={styles.inputIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? "Logging In..." : "Login"}</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/(auth)/signup">
              <Text style={styles.footerLink}> Sign Up</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default login
