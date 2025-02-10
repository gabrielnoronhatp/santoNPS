import React, { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import AppNavigator from './navigation/AppNavigator';


const App: React.FC = () => {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  return <AppNavigator />;
};

export default App;