import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert, TextInput,
} from 'react-native';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const REACTIONS = ['👍', '❤️', '🔥', '🎉', '😮'];
const ACHIEVEMENT_TYPES = ['Course Completion', 'Quiz Score', 'Milestone', 'General'];

export default function FeedScreen({ navigation }) {
  const { user } = useAuth();
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/posts');
      const postsWithComments = await Promise.all(
        res.data.map(async (p) => {
          const cRes = await api.get(`/comments/${p._id}`);
          return { ...p, comments: cRes.data };
        })
      );
      setPosts(postsWithComments);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handleReact = async (postId, type) => {
    try {
      await api.post(`/posts/${postId}/react`, { type });
      fetchPosts();
    } catch (err) { Alert.alert('Error', err.message); }
  };

  const handleApprove = async (postId) => {
    try {
      await api.post(`/posts/${postId}/approve`);
      fetchPosts();
    } catch (err) { Alert.alert('Error', err.message); }
  };

  const renderPost = ({ item }) => {
    const reactions = item.reactions ? Object.entries(item.reactions) : [];
    return (
      <View style={[styles.postCard, item.status === 'PENDING' && styles.postPending]}>
        {item.status === 'PENDING' && (
          <Text style={styles.pendingBadge}>⏳ Pending Approval</Text>
        )}
        <View style={styles.postHeader}>
          <Text style={styles.authorName}>{item.authorName}</Text>
          <Text style={styles.achievementBadge}>{item.achievementType}</Text>
        </View>
        <Text style={styles.postContent}>{item.content}</Text>

        {/* Reactions */}
        <View style={styles.reactionsRow}>
          {REACTIONS.map((emoji) => {
            const entry   = reactions.find(([k]) => k === emoji);
            const count   = entry ? entry[1].length : 0;
            const reacted = entry ? entry[1].includes(user?._id) : false;
            return (
              <TouchableOpacity key={emoji} style={[styles.reactionBtn, reacted && styles.reactionActive]} onPress={() => handleReact(item._id, emoji)}>
                <Text>{emoji} {count > 0 ? count : ''}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Comments preview */}
        <TouchableOpacity style={styles.commentsRow} onPress={() => navigation.navigate('PostDetail', { postId: item._id })}>
          <Text style={styles.commentsText}>💬 {item.comments?.length || 0} comments — View post</Text>
        </TouchableOpacity>

        {/* Admin/Staff: Approve */}
        {user && ['ADMIN', 'STAFF'].includes(user.role) && item.status === 'PENDING' && (
          <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item._id)}>
            <Text style={styles.approveBtnText}>✅ Approve Post</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#6C63FF" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>🌐 Community Feed</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => navigation.navigate('CreatePost')}>
          <Text style={styles.newBtnText}>+ Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPosts(); }} tintColor="#6C63FF" />}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet. Be the first!</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0F0F23', padding: 16 },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F23' },
  heading:       { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  newBtn:        { backgroundColor: '#6C63FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  newBtnText:    { color: '#fff', fontWeight: '700' },
  postCard:      { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#2A2A4A' },
  postPending:   { borderColor: '#FF9800', opacity: 0.85 },
  pendingBadge:  { color: '#FF9800', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  postHeader:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  authorName:    { color: '#6C63FF', fontWeight: '700' },
  achievementBadge:{ fontSize: 11, color: '#fff', backgroundColor: '#2A2A4A', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  postContent:   { color: '#ddd', lineHeight: 20, marginBottom: 12 },
  reactionsRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  reactionBtn:   { backgroundColor: '#0F0F23', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  reactionActive:{ backgroundColor: '#2A2A60' },
  commentsRow:   { paddingTop: 8, borderTopWidth: 1, borderColor: '#2A2A4A' },
  commentsText:  { color: '#888', fontSize: 13 },
  approveBtn:    { backgroundColor: '#1A3A1A', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 10 },
  approveBtnText:{ color: '#4CAF50', fontWeight: '700' },
  empty:         { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
