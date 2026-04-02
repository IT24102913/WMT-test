import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator }     from '@react-navigation/stack';
import { Text } from 'react-native';

// Screens
import CourseListScreen   from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import CreateCourseScreen from '../screens/courses/CreateCourseScreen';
import LessonViewScreen   from '../screens/lessons/LessonViewScreen';
import CreateLessonScreen from '../screens/lessons/CreateLessonScreen';
import FeedScreen         from '../screens/feed/FeedScreen';
import CreatePostScreen   from '../screens/feed/CreatePostScreen';
import PostDetailScreen   from '../screens/feed/PostDetailScreen';
import ProfileScreen      from '../screens/profile/ProfileScreen';
import FeedbackScreen     from '../screens/feedback/FeedbackScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Courses Stack ─────────────────────────────────────────────────────────────
function CoursesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CourseList"   component={CourseListScreen}   options={{ title: 'Courses' }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course Details' }} />
      <Stack.Screen name="CreateCourse" component={CreateCourseScreen} options={{ title: 'Create Course' }} />
      <Stack.Screen name="LessonView"   component={LessonViewScreen}   options={{ title: 'Lesson' }} />
      <Stack.Screen name="CreateLesson" component={CreateLessonScreen} options={{ title: 'Add Lesson' }} />
      <Stack.Screen name="Feedback"     component={FeedbackScreen}     options={{ title: 'Feedback' }} />
    </Stack.Navigator>
  );
}

// ── Feed Stack ────────────────────────────────────────────────────────────────
function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed"       component={FeedScreen}       options={{ title: 'Community Feed' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'New Post' }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
    </Stack.Navigator>
  );
}

// ── Bottom Tabs ───────────────────────────────────────────────────────────────
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   '#6C63FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#1A1A2E', borderTopColor: '#2A2A4A' },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ color, fontSize: 11, fontWeight: focused ? '700' : '400' }}>
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Courses" component={CoursesStack} />
      <Tab.Screen name="Feed"    component={FeedStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
