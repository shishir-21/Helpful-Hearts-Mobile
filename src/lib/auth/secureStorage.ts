import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "helpful_hearts.access_token";

export const secureTokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken: (accessToken: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
  clear: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
};