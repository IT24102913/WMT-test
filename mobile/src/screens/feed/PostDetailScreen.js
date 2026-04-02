import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

export default function PostDetailScreen({ route }) {
  const { postId } = route.params;
  const { user } = useAuth();
  const [post,     setPost]     = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        api.get(`/posts/${postId}`),
        api.get(`/comments/${postId}`),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim().length < 2) {
      Alert.alert('Validation', 'Comment must be at least 2 characters.'); return;
    }
    setSubmitting(true);
    try {
      await api.post('/comments', { content: newComment.trim(), postId });
      setNewComment('');
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleReport = async (commentId) => {
    Alert.prompt('Report Comment', 'Briefly describe your reason:', async (reason) => {
      if (!reason?.trim()) return;
      try {
        await api.post('/reports', { commentId, reason });
        Alert.alert('Reported', 'Comment has been reported for review.');
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#6C63FF" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Post */}
      {post && (
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Text style={styles.author}>{post.authorName}</Text>
            <Text style={styles.badge}>{post.achievementType}</Text>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>
        </View>
      )}

      {/* Comments */}
      <Text style={styles.sectionTitle}>💬 Comments ({comments.length})</Text>
      {comments.map((c) => {
        const isOwner = String(c.authorId) === String(user?._id);
        const canDelete = isOwner || ['ADMIN', 'STAFF'].includes(user?.role);
        return (
          <View key={c._id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{c.authorName}</Text>
              <Text style={styles.commentDate}>{new Date(c.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.commentContent}>{c.content}</Text>
            <View style={styles.commentActions}>
              {canDelete && (
                <TouchableOpacity onPress={() => Alert.alert('Delete?', 'Remove this comment?', [
                  { text: 'Cancel' }, { text: 'Delete', onPress: () => handleDeleteComment(c._id), style: 'destructive' }
                ])}>
                  <Text style={styles.deleteText}>🗑️ Delete</Text>
                </TouchableOpacity>
              )}
              {!isOwner && (
                <TouchableOpacity onPress={() => handleReport(c._id)}>
                  <Text style={styles.reportText}>⚑ Report</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      {/* Add Comment */}
      <Text style={styles.sectionTitle}>Add a Comment</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Write your comment..."
        placeholderTextColor="#888"
        value={newComment}
        onChangeText={setNewComment}
        multiline
        numberOfLines={3}
        maxLength={800}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={handleAddComment} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Post Comment</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0F0F23', padding: 16 },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F23' },
  postCard:      { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16, marginBottom: 16 },
  postHeader:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  author:        { color: '#6C63FF', fontWeight: '700' },
  badge:         { fontSize: 11, color: '#fff', backgroundColor: '#2A2A4A', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  postContent:   { color: '#ddd', lineHeight: 20 },
  sectionTitle:  { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 10, marginTop: 4 },
  commentCard:   { backgroundColor: '#1A1A2E', borderRadius: 10, padding: 12, marginBottom: 10 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  commentAuthor: { color: '#6C63FF', fontWeight: '600', fontSize: 13 },
  commentDate:   { color: '#666', fontSize: 11 },
  commentContent:{ color: '#ccc', lineHeight: 18 },
  commentActions:{ flexDirection: 'row', gap: 16, marginTop: 8 },
  deleteText:    { color: '#FF6B6B', fontSize: 12 },
  reportText:    { color: '#FF9800', fontSize: 12 },
  input: {
    backgroundColor: '#1A1A2E', color: '#fff', borderRadius: 10,
    padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2A2A4A', fontSize: 14,
  },
  textarea:  { height: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 10, alignItems: 'center' },
  submitText:{ color: '#fff', fontWeight: '700' },
});
