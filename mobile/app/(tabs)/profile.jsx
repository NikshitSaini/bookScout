import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'

import useAuthStore from '../../store/authStore';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/api';
import createStyles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { ThemeContext } from '../../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Loader from '@/components/Loader';
export default function profile() {
    const { theme } = useContext(ThemeContext);
    const COLORS = theme;
    const styles = createStyles(theme);
    const {logout,token}=useAuthStore();
    const [books, setBooks] = useState([]);
    const[isLoading,setIsLoading]=useState(false);
    const[refreshing,setRefreshing]=useState(false);
    const [deleteBookid,setDeleteBookid]=useState(null);
    const router=useRouter();

    useEffect(()=>{
        fetchdata();
    },[]);
    if(isLoading && !refreshing) return <Loader size="large"/>

    const fetchdata=async()=>{
        setIsLoading(true);
        try {
            const response=await fetch(`${API_URL}/api/books/user`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            });
            const data=await response.json();
            if(!response.ok){
                throw new Error('Failed to fetch books'|| response.message);
            }
            setBooks(data);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }
    const renderStars=(rating)=>{
        const stars=[];
        for(let i=1;i<=5;i++){
            stars.push(
                <Ionicons key={i} name={i<=rating ? 'star' : 'star-outline'} size={16} color={i<=rating ? "#f4bf00" : COLORS.textSecondary} style={{marginRight:2}}/>
            )
        }
        return stars;
    }
    const deleteBook=async(id)=>{
        try {
            setDeleteBookid(id);
            const response=await fetch(`${API_URL}/api/books/${id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            });
            const data=await response.json();
            if(!response.ok){
                throw new Error('Failed to delete book'|| response.message);
            }
            setBooks(books.filter(book=>book._id!==id));
            Alert.alert("Success","Book deleted successfully");
        } catch (error) {
            console.log(error);
        }
        finally{
            setDeleteBookid(null);
        }
    }
    const confirmDelete=(id)=>{
        Alert.alert(
            "Delete",
            "Are you sure you want to delete this book?",
            [
                {
                    text:"Cancel",
                    onPress:()=>console.log("Cancel Pressed"),
                    style:"cancel"
                },
                {
                    text:"Delete",
                    onPress:()=>deleteBook(id),
                    style:"destructive"
                }
            ]
            )
    }

    const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteBookid === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}> 
      < ProfileHeader/>
      < LogoutButton theme={theme}/>
      <View style={styles.booksHeader}>  
        <Text style={styles.booksTitle}>Your Recommendations </Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item)=>item._id}
        contentContainerStyle={styles.booksList}

        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>fetchdata()}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No Recommendations Yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={()=>router.push('/create')}>
              <Text style={styles.addButtonText}>Share a Book</Text> 
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}