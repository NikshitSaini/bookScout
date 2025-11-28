import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      // ❌ old code threw error incorrectly
      if (!response.ok) {
        return { success: false, error: data.message || "Registration failed" };
      }

      // Save to store
      set({ user: data.user, token: data.token });

      // Save to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("authToken", data.token);

      return { success: true, user: data.user };

    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: "Server error. Try again later." };
    } finally {
      set({ isLoading: false });
    }
  },
  checkAuth: async()=>{
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userJson=await AsyncStorage.getItem("user");
      const user=userJson?JSON.parse(userJson):null;
      set ( {token,user});
    } catch (error) {
      console.log("Error retrieving auth data:", error);
    }
  },
  login: async(email,password)=>{
    set({isLoading:true});
    try {
      const response=await fetch(`${API_URL}/api/auth/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password}),
      });
      const data=await response.json();
      if(!response.ok){
        return {success:false,error:data.message || "Login failed"};
      }
      set({user:data.user,token:data.token});
      await AsyncStorage.setItem("authToken",data.token);
      await AsyncStorage.setItem("user",JSON.stringify(data.user));
      set ({isLoading:false});
      return {success:true,user:data.user};
    } catch (error) {
      set ({isLoading:false});
      console.log("Login Error:",error);
      return {success:false,error:"Server error. Try again later."};
    }
  },
  logout:async()=>{
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      set({user:null,token:null});
    } catch (error) {
      console.log("Error during logout:", error);
    }
  },
}));



export default useAuthStore;
