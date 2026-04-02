import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import api from '../../api/axiosConfig';

export default function CreateLessonScreen({ route, navigation }) {
  const { courseId, lessonId, edit } = route.params || {};
  const [form, setForm] = useState({ title: '', content: '', quiz: [] });
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const addQuestion = () => {
    setForm((p) => ({
      ...p,
      quiz: [...p.quiz, { question: '', options: ['', '', '', ''], correctOptionIndex: 0, points: 10 }],
    }));
  };

  const setQuestion = (idx, field, val) => {
    setForm((p) => {
      const quiz = [...p.quiz];
      quiz[idx] = { ...quiz[idx], [field]: val };
      return { ...p, quiz };
    });
  };

  const setOption = (qIdx, oIdx, val) => {
    setForm((p) => {
      const quiz = [...p.quiz];
      const opts = [...quiz[qIdx].options];
      opts[oIdx] = val;
      quiz[qIdx] = { ...quiz[qIdx], options: opts };
      return { ...p, quiz };
    });
  };

  const removeQuestion = (idx) => {
    setForm((p) => ({ ...p, quiz: p.quiz.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      Alert.alert('Validation', 'Title and content are required.'); return;
    }
    setLoading(true);
    try {
      const payload = {
        title:    form.title.trim(),
        content:  form.content.trim(),
        courseId,
        quiz:     JSON.stringify(form.quiz),
      };

      if (edit && lessonId) {
        await api.put(`/lessons/${lessonId}`, payload);
        Alert.alert('Updated!', 'Lesson updated.');
      } else {
        await api.post('/lessons', payload);
        Alert.alert('Created!', 'Lesson created.');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.heading}>{edit ? '✏️ Edit Lesson' : '📖 Create Lesson'}</Text>

      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} placeholder="Lesson title" placeholderTextColor="#888" value={form.title} onChangeText={set('title')} />

      <Text style={styles.label}>Content *</Text>
      <TextInput style={[styles.input, styles.bigarea]} placeholder="Lesson content (20–15000 chars)" placeholderTextColor="#888" value={form.content} onChangeText={set('content')} multiline numberOfLines={8} />

      {/* Quiz Builder */}
      <Text style={styles.sectionTitle}>🎯 Quiz Questions ({form.quiz.length})</Text>
      {form.quiz.map((q, qIdx) => (
        <View key={qIdx} style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNum}>Question {qIdx + 1}</Text>
            <TouchableOpacity onPress={() => removeQuestion(qIdx)}>
              <Text style={styles.removeBtn}>✕ Remove</Text>
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} placeholder="Question text" placeholderTextColor="#888" value={q.question} onChangeText={(v) => setQuestion(qIdx, 'question', v)} />

          {q.options.map((opt, oIdx) => (
            <View key={oIdx} style={styles.optionRow}>
              <TouchableOpacity onPress={() => setQuestion(qIdx, 'correctOptionIndex', oIdx)}>
                <Text style={{ marginRight: 8, fontSize: 18 }}>{q.correctOptionIndex === oIdx ? '🟢' : '⚪'}</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.optionInput]}
                placeholder={`Option ${oIdx + 1}`}
                placeholderTextColor="#888"
                value={opt}
                onChangeText={(v) => setOption(qIdx, oIdx, v)}
              />
            </View>
          ))}

          <View style={styles.pointsRow}>
            <Text style={styles.label}>Points:</Text>
            <TextInput
              style={[styles.input, styles.pointsInput]}
              keyboardType="numeric"
              value={String(q.points)}
              onChangeText={(v) => setQuestion(qIdx, 'points', parseInt(v) || 10)}
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addQuestionBtn} onPress={addQuestion}>
        <Text style={styles.addQuestionText}>+ Add Quiz Question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{edit ? 'Save Changes' : 'Create Lesson'}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0F0F23', padding: 16 },
  heading:      { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 20 },
  label:        { color: '#ccc', marginBottom: 6, fontSize: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#fff', marginVertical: 12 },
  input: {
    backgroundColor: '#1A1A2E', color: '#fff', borderRadius: 10,
    padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2A2A4A', fontSize: 14, flex: 1,
  },
  bigarea:      { height: 160, textAlignVertical: 'top' },
  questionCard: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#2A2A4A' },
  questionHeader:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  questionNum:  { color: '#fff', fontWeight: '700' },
  removeBtn:    { color: '#FF6B6B', fontSize: 13 },
  optionRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  optionInput:  { flex: 1, marginBottom: 0 },
  pointsRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  pointsInput:  { width: 70, flex: 0, textAlign: 'center' },
  addQuestionBtn:{ backgroundColor: '#1A1A2E', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#6C63FF' },
  addQuestionText:{ color: '#6C63FF', fontWeight: '700' },
  btn:    { backgroundColor: '#6C63FF', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText:{ color: '#fff', fontWeight: '700', fontSize: 16 },
});
