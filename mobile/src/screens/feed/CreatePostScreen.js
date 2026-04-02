import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const ACHIEVEMENT_TYPES = ['Course Completion', 'Quiz Score', 'Milestone', 'General'];

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const [content, setContent]             = useState('');
  const [achievementType, setAchievement] = useState('General');
  const [loading, setLoading]             = useState(false);

  const handleCreate = async () => {
    if (content.trim().length < 10) {
      Alert.alert('Validation', 'Post must be at least 10 characters.'); return;
    }
    setLoading(true);
    try {
      await api.post('/posts', { content: content.trim(), achievementType });
      Alert.alert('Posted!', 'Your post has been submitted for approval.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.heading}>📝 New Post</Text>

      <Text style={styles.label}>Achievement Type</Text>
      <View style={styles.typeRow}>
        {ACHIEVEMENT_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeBtn, achievementType === t && styles.typeBtnActive]}
            onPress={() => setAchievement(t)}
          >
            <Text style={[styles.typeBtnText, achievementType === t && styles.typeBtnTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>What's your achievement?</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Share your achievement, milestone, or update... (10–3000 chars)"
        placeholderTextColor="#888"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={6}
        maxLength={3000}
      />
      <Text style={styles.charCount}>{content.length}/3000</Text>

      <TouchableOpacity style={styles.btn} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Submit Post</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23', padding: 20 },
  heading:   { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 20 },
  label:     { color: '#ccc', marginBottom: 8, fontSize: 14 },
  typeRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn:   { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#1A1A2E', borderRadius: 20, borderWidth: 1, borderColor: '#2A2A4A' },
  typeBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  typeBtnText:   { color: '#aaa', fontSize: 12 },
  typeBtnTextActive: { color: '#fff', fontWeight: '700' },
  input: {
    backgroundColor: '#1A1A2E', color: '#fff', borderRadius: 10,
    padding: 14, marginBottom: 4, borderWidth: 1, borderColor: '#2A2A4A', fontSize: 15,
  },
  textarea:  { height: 160, textAlignVertical: 'top' },
  charCount: { color: '#666', fontSize: 12, textAlign: 'right', marginBottom: 16 },
  btn:    { backgroundColor: '#6C63FF', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText:{ color: '#fff', fontWeight: '700', fontSize: 16 },
});
