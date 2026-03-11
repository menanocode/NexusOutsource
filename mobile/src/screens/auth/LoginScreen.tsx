import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSendOtp = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email');
    setLoading(true);
    try {
      // In a real app we'd have a 2-step process (OTP screen). 
      // For MVP, if we use portal login we can bypass OTP or mock it.
      // But let's mock the 2 step flow.
      await api.post('/auth/send-otp', { email });
      Alert.alert('OTP Sent', 'Check your email/phone for the OTP', [
        { text: 'Enter OTP', onPress: () => navigation.navigate('VerifyOtp', { email }) }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-50">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</Text>
        <Text className="text-sm text-slate-500">Sign in to apply for top jobs</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-slate-700 mb-1">Email Address</Text>
          <TextInput
            className="w-full h-12 px-4 border border-slate-300 rounded-lg bg-white"
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mt-4"
          onPress={handleSendOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-lg">Continue with Email</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-slate-500">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-blue-600 font-semibold">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
