import React from 'react';
import { Button, Text, View } from 'react-native';

import { styles } from './styles';
import { useAuth } from '../contexts/AuthContext';

export const HomeScreen = () => {
  const auth = useAuth();
  const signOut = () => {
    auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text>HOME SCREEN</Text>
      <Text>{auth.tenantId}</Text>
      <Text>{auth.userName}</Text>
      <Text>{auth.userRole}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};
