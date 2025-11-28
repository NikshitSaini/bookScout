import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet ,Text,ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useContext } from 'react'
import { useRouter } from 'expo-router';
import createStyles from '../../assets/styles/create.styles';
import { Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import COLORS from '../../constants/colors';
import { ThemeContext } from '../../components/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '../../store/authStore';
import { API_URL } from '../../constants/api';

const create = () => {
  const { theme } = useContext(ThemeContext);
  const COLORS = theme;
  const styles = createStyles(theme);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);  
  const [image, setImage] = useState(null);
  const [imagebase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const {token}=useAuthStore();
  const router = useRouter();

  const renderRatingStars = (rating, setRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons
            key={i}
            name={i <= rating ? "star" : "star-outline"}
            size={30}
            color={COLORS.primary}
            onPress={() => setRating(i)}
            style={{ marginHorizontal: 5 }}
          />
        </TouchableOpacity>
        
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  }
  

  const pickImage = async () => {
    try {
      if(Platform.OS !== 'web'){
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setImageBase64(result.assets[0].base64);
      }
    } catch (error) {
      
    }
  }

const handleSubmit = async () => {
    if(!title || !caption || !imagebase64){
      Alert.alert("Please fill in all fields and select an image.");
      return;
    }
    
    try {
      setLoading(true);

      // Prepare Image Data
      const uriParts = image.split('.');
      const fileExtension = uriParts[uriParts.length - 1];
      const imageType = fileExtension ? `image/${fileExtension.toLowerCase()}` : 'image/jpeg';      
      const imageDataUrl = `data:${imageType};base64,${imagebase64}`;

      const response = await fetch(`${API_URL}/api/books`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          caption,
          rating: Number(rating),
          image: imageDataUrl,
        }),
      });

      // READ THE SERVER RESPONSE
      const data = await response.json(); 

      if (response.ok) {
        setLoading(false);
        Alert.alert("Success", "Book recommendation shared successfully!");
        router.push('/(tabs)');
      } else {
        setLoading(false);
        // This will tell you EXACTLY what is wrong (e.g., "Payload Too Large" or "Invalid Token")
        console.error("Server Error Response:", data); 
        Alert.alert("Submission Failed", data.message || data.error || "Unknown server error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      Alert.alert("Network Error", error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex:1}}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        styles={styles.ScrollView}
      >
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>Share your favorite books with the community!</Text>
          </View>
          {/* FORM */}
          <View style={styles.form}>
            {/* Book Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="book-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  value={title}
                  placeholderTextColor={COLORS.placeholderText}
                  onChangeText={setTitle}
                >

                </TextInput>
              </View>
            </View>
            {/* Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating (1-5)</Text>
              {renderRatingStars(rating, setRating)}
            </View>

            {/* Image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Cover Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                    <Text style={styles.placeholderText}>Tap to select an image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
                <TextInput
                  style={[styles.textArea]}
                  placeholder="Write a brief caption about the book..."
                  value={caption}
                  placeholderTextColor={COLORS.placeholderText}
                  multiline
                  onChangeText={setCaption}
                >
                </TextInput>
            </View>
            {/* Button Submit */}
            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Share</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

          </View> 


        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default create