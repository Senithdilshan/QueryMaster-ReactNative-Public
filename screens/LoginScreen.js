import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import Spinner from 'react-native-loading-spinner-overlay';
import { LoginUser } from '../util/Auth';
import { Alert } from 'react-native';
import { AuthContext } from '../Store/Auth-context';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  const loginHandler = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const response = await LoginUser(email, password);
      authCtx.authenticate(response.token, response.userId);
    } catch (error) {
      Alert.alert(
        'Authentication Failed!',
        'Please check your credentials');
      setIsAuthenticating(false);
    }

  }
  return (
    <>
      <Spinner
        visible={isAuthenticating}
        textContent={'Logging you in...'}
        textStyle={{ color: 'white' }}
      />
      <AuthContent isLogin onAuthenticate={loginHandler} />
    </>
  );
}

export default LoginScreen;
