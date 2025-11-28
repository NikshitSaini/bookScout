import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'expo-image'
import useAuthStore from '../../store/authStore'
import createStyles from '../../assets/styles/home.styles'
import { API_URL } from '../../constants/api'
import { Ionicons } from '@expo/vector-icons'
// import COLORS from '../../constants/colors'
import {formatMemberSince,formatPublishdate} from '../../lib/utils'
import Loader from '@/components/Loader'
import { ThemeContext } from '../../components/ThemeContext'


const HomePage = () => {
  const {token}=useAuthStore();
  const [books,setBooks]=useState([]);
  const [loading,setLoading]=useState(false);
  const [refreshing,setRefreshing]=useState(false);
  const [page,setPage]=useState(1);
  const [hasMore,setHasMore]=useState(true);
  const { theme } = useContext(ThemeContext);
  const COLORS=theme;
  const styles = createStyles(theme);

  const fetchBooks=async(pageNum=1,refresh=false)=>{
    if(!token) return;
    try {
      if(refresh) setLoading(true);
      else if (pageNum===1) setRefreshing(true);
      const response=await fetch(`${API_URL}/api/books?page=${pageNum}&limit=10`,{
        headers:{
          Authorization:`Bearer ${token}`
        },
      })
      const data=await response.json();
      if(!response.ok) throw new Error(data.message || 'Failed to fetch books');
      
      const newBooks = refresh || pageNum === 1 ? data.books : [...books, ...data.books];
      const uniqueBooks = Array.from(new Map(newBooks.map(book => [book._id, book])).values());

      setBooks(uniqueBooks); 

      setHasMore(pageNum < data.totalBooksPages);
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching books:',error);
    }
    finally{
      setLoading(false);
      setRefreshing(false);
    }
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

  useEffect(()=>{
    fetchBooks();
  },[])

  
  const handleLoadMore=async()=>{
    if(hasMore && !loading && !refreshing){
      await fetchBooks(page+1);
    }
  }
  const renderItem=({item})=>(
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{uri:item.user.profileImage}} style={styles.avatar}/>
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image source={{uri:item.image}} style={styles.bookImage} contentFit="cover"/>

      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared On {formatPublishdate(item.createdAt)}</Text>
      </View>
    </View>
  )

  if(loading ){
    return <Loader size="large"/>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item)=>item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>fetchBooks(1,true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookScout</Text>
            <Text style={styles.headerSubtitle}>Discover Great Reads from Community</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No Recommendations Yet</Text>
            <Text style={styles.emptySubtext}>Be the First to Share a Book</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length>0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary}/>
          ):null
        }
      />
    </View>
  )
}

export default HomePage
