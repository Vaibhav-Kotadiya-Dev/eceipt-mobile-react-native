import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AppStack } from "./AppStack";
import AuthorizationStackScreen from "./AuthStack";
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from "react-query";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryDelay: 3000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: 5000,
    },
    mutations: {

    },
  },
});

const Stack = createStackNavigator();

export const Router = () => {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <Toast />
        <Stack.Navigator
          initialRouteName={'NONAUTH'}
          screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen
          name={'AUTH'}
          component={AppStack}
        />
        <Stack.Screen name={'NONAUTH'} component={AuthorizationStackScreen} />
      </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
};
