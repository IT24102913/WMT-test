import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{user.username?.charAt(0).toUpperCase()}</Text>
      </View>

      <Text style={styles.username}>@{user.username}</Text>
      <Text style={styles.fullName}>{user.fullName || 'No full name set'}</Text>

      {/* Role Badge */}
      <View style={[styles.roleBadge, { backgroundColor: user.role === 'ADMIN' ? '#F44336' : user.role === 'STAFF' ? '#FF9800' : '#6C63FF' }]}>
        <Text style={styles.roleText}>{user.role}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🏆 {user.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{user.email}</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0F0F23', padding: 24 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#6C63FF', alignSelf: 'center',
    justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 12,
  },
  avatarText:  { color: '#fff', fontSize: 36, fontWeight: '800' },
  username:    { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  fullName:    { color: '#aaa', fontSize: 15, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  roleBadge:   { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  roleText:    { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow:    { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  statBox:     { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 20, alignItems: 'center', minWidth: 120 },
  statValue:   { color: '#fff', fontSize: 22, fontWeight: '800' },
  statLabel:   { color: '#aaa', fontSize: 13, marginTop: 4 },
  infoCard:    { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, marginBottom: 12 },
  infoLabel:   { color: '#666', fontSize: 12, marginBottom: 4 },
  infoValue:   { color: '#fff', fontSize: 15 },
  logoutBtn:   { backgroundColor: '#2A1A1A', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#FF6B6B' },
  logoutText:  { color: '#FF6B6B', fontWeight: '700', fontSize: 16 },
});
