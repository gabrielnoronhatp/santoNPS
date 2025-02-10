import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Carousel from '../components/Carousel';
import RatingScreen from '../screens/RatingScreen';
import { RootStackParamList } from '../types';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Carousel">
        <Stack.Screen name="Carousel" component={Carousel} options={{ headerShown: false }} /> 
        <Stack.Screen name="Rating" component={RatingScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;