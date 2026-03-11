import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function JobsScreen() {
  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['mobile-jobs'],
    queryFn: async () => {
      const { data } = await api.get('/jobs');
      return data.data.jobs;
    }
  });

  const jobs = jobsResponse || [];

  return (
    <View className="flex-1 bg-slate-50 pt-12">
      <View className="px-6 pb-4 border-b border-slate-200">
        <Text className="text-2xl font-bold text-slate-900">Discover Jobs</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
              <Text className="text-lg font-semibold text-slate-900">{item.title}</Text>
              <Text className="text-slate-500 mb-3">{item.partner?.company_name || 'Partner Company'}</Text>
              <View className="flex-row justify-between items-center">
                <View className="bg-blue-100 px-2 py-1 rounded">
                  <Text className="text-blue-800 text-xs">{item.job_type}</Text>
                </View>
                <Text className="text-blue-600 font-medium text-sm">View Details</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
