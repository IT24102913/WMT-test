import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

export default function LessonViewScreen({ route, navigation }) {
  const { lessonId } = route.params;
  const { user, updateUser } = useAuth();
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [quizAnswers,  setQuizAnswers]  = useState({});
  const [quizSubmitted,setQuizSubmitted]= useState(false);
  const [quizResult,   setQuizResult]   = useState(null);
  const [completing,   setCompleting]   = useState(false);

  useEffect(() => { fetchLesson(); }, []);

  const fetchLesson = async () => {
    try {
      const res = await api.get(`/lessons/${lessonId}`);
      setData(res.data);
      setQuizSubmitted(res.data.completedQuizLessonIds?.includes(lessonId));
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    setCompleting(true);
    try {
      await api.post(`/lessons/${lessonId}/complete`);
      Alert.alert('✅ Done!', 'Lesson marked as complete.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setCompleting(false);
    }
  };

  const handleSubmitQuiz = async () => {
    const { lesson } = data;
    if (!lesson.quiz?.length) return;

    let correct = 0;
    let earned  = 0;
    const results = lesson.quiz.map((q, idx) => {
      const selected = quizAnswers[idx];
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) { correct++; earned += q.points; }
      return { isCorrect, selectedIndex: selected, correctIndex: q.correctOptionIndex };
    });

    setQuizResult({ results, correct, total: lesson.quiz.length, earned });
    setQuizSubmitted(true);

    try {
      const res = await api.post(`/lessons/${lessonId}/submit-quiz`, { earnedPoints: earned });
      if (updateUser && res.data) {
        updateUser({ ...user, points: res.data.totalPoints });
      }
    } catch (err) {
      if (!err.message.includes('already submitted')) Alert.alert('Error', err.message);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#6C63FF" /></View>;
  if (!data)   return null;

  const { lesson, isEnrolled, completedLessonIds } = data;
  const isCompleted = completedLessonIds?.includes(lessonId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.content}>{lesson.content}</Text>

      {lesson.materialUrl && (
        <View style={styles.materialBox}>
          <Text style={styles.materialText}>📄 {lesson.materialName || 'Lesson Material (PDF)'}</Text>
        </View>
      )}

      {/* Quiz Section */}
      {lesson.quiz?.length > 0 && (
        <View style={styles.quizSection}>
          <Text style={styles.quizHeading}>🎯 Quiz ({lesson.quiz.length} questions)</Text>

          {quizSubmitted && quizResult && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>
                Score: {quizResult.correct}/{quizResult.total} — Earned: {quizResult.earned} pts 🏆
              </Text>
            </View>
          )}
          {quizSubmitted && !quizResult && (
            <Text style={styles.alreadyDone}>✅ You already completed this quiz.</Text>
          )}

          {lesson.quiz.map((q, qIdx) => (
            <View key={qIdx} style={styles.questionBlock}>
              {q.content ? <Text style={styles.questionContent}>{q.content}</Text> : null}
              <Text style={styles.questionText}>{qIdx + 1}. {q.question}</Text>
              <Text style={styles.pointsNote}>{q.points} pts</Text>
              {q.options.map((opt, oIdx) => {
                const isSelected = quizAnswers[qIdx] === oIdx;
                const isCorrect  = quizResult?.results[qIdx]?.correctIndex === oIdx;
                const isWrong    = quizSubmitted && isSelected && !isCorrect;
                return (
                  <TouchableOpacity
                    key={oIdx}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                      quizSubmitted && isCorrect && styles.optionCorrect,
                      quizSubmitted && isWrong   && styles.optionWrong,
                    ]}
                    onPress={() => !quizSubmitted && setQuizAnswers((p) => ({ ...p, [qIdx]: oIdx }))}
                    disabled={quizSubmitted}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {!quizSubmitted && (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitQuiz}>
              <Text style={styles.submitBtnText}>Submit Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Complete Button */}
      {isEnrolled && !isCompleted && !lesson.quiz?.length && (
        <TouchableOpacity style={styles.completeBtn} onPress={handleCompleteLesson} disabled={completing}>
          {completing ? <ActivityIndicator color="#fff" /> : <Text style={styles.completeBtnText}>✅ Mark as Complete</Text>}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0F0F23', padding: 16 },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F23' },
  title:         { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 12 },
  content:       { color: '#ccc', lineHeight: 22, marginBottom: 16 },
  materialBox:   { backgroundColor: '#1A1A2E', padding: 12, borderRadius: 10, marginBottom: 16 },
  materialText:  { color: '#6C63FF', fontWeight: '600' },
  quizSection:   { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16, marginTop: 8 },
  quizHeading:   { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  resultBox:     { backgroundColor: '#2A3A2A', borderRadius: 10, padding: 12, marginBottom: 12 },
  resultText:    { color: '#4CAF50', fontWeight: '700', textAlign: 'center' },
  alreadyDone:   { color: '#6C63FF', textAlign: 'center', marginBottom: 12 },
  questionBlock: { marginBottom: 20 },
  questionContent:{ color: '#aaa', fontSize: 13, marginBottom: 6, fontStyle: 'italic' },
  questionText:  { color: '#fff', fontWeight: '600', marginBottom: 4 },
  pointsNote:    { color: '#FFD700', fontSize: 12, marginBottom: 8 },
  option:        { backgroundColor: '#0F0F23', borderRadius: 8, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: '#2A2A4A' },
  optionSelected:{ borderColor: '#6C63FF', backgroundColor: '#1E1A40' },
  optionCorrect: { borderColor: '#4CAF50', backgroundColor: '#1A2E1A' },
  optionWrong:   { borderColor: '#F44336', backgroundColor: '#2E1A1A' },
  optionText:    { color: '#fff' },
  submitBtn:     { backgroundColor: '#6C63FF', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  completeBtn:   { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  completeBtnText:{ color: '#fff', fontWeight: '700', fontSize: 16 },
});
