import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <View className="flex-1 bg-slate-50 pt-16 px-6">
      <Text className="text-2xl font-bold text-slate-900 mb-6">Profile</Text>

      <View className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <Text className="text-lg font-semibold text-slate-900 mb-1">{user?.full_name}</Text>
        <Text className="text-slate-500">{user?.email}</Text>
      </View>

      <View className="space-y-4">
        <TouchableOpacity className="bg-white p-4 rounded-xl border border-slate-200 flex-row justify-between items-center">
          <Text className="text-slate-700 font-medium">My Applications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-white p-4 rounded-xl border border-slate-200 flex-row justify-between items-center">
          <Text className="text-slate-700 font-medium">Upload CV</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-red-50 p-4 rounded-xl border border-red-100 items-center mt-4"
          onPress={logout}
        >
          <Text className="text-red-600 font-medium">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
