import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore(state => state.user);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-6 pt-16 pb-6 bg-blue-600">
        <Text className="text-blue-100 text-sm">Hello,</Text>
        <Text className="text-white text-2xl font-bold">{user?.full_name || 'Candidate'}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-900 mb-4">Recommended Jobs</Text>
          <TouchableOpacity 
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-3"
            onPress={() => navigation.navigate('Jobs')}
          >
            <Text className="text-lg font-semibold text-slate-900">Software Engineer</Text>
            <Text className="text-slate-500 mb-2">TechCorp Indonesia</Text>
            <View className="flex-row items-center">
              <View className="bg-blue-100 px-2 py-1 rounded">
                 <Text className="text-blue-800 text-xs">Full-time</Text>
              </View>
              <Text className="text-slate-400 text-xs ml-3">Posted 2d ago</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
