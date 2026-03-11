// Simplified web implementation without React hooks to avoid
// invalid hook call errors during server rendering with Expo Router.
export function useColorScheme() {
  return 'light';
}
