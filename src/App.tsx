import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App