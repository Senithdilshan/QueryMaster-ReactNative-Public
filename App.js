import { StatusBar } from 'expo-status-bar';
import Navigation from './Navigation/Navigation';
import AuthContextProvider from './Store/Auth-context';
import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { init } from './util/DataBase/SQLite.Database';
import Spinner from 'react-native-loading-spinner-overlay';
export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init().then(() => {
      setDbInitialized(true);
    }).catch(err => {
      console.log(err);
    });
  }, [])

  if (!dbInitialized) {
    return (
      <Spinner
        visible={!dbInitialized}
        textContent={'App Starting...'}
        textStyle={{ color: 'white' }}
      />
    )
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
