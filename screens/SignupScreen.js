import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import { CreateUser } from '../util/Auth';
import { Alert } from 'react-native';
import { AuthContext } from '../Store/Auth-context';
import Spinner from 'react-native-loading-spinner-overlay';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const authCtx = useContext(AuthContext);

  const signUpHandler = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const response = await CreateUser(email, password);
      authCtx.authenticate(response.token, response.userId);
    } catch (error) {
      Alert.alert('Signup Failed!');
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
      <AuthContent onAuthenticate={signUpHandler} />
    </>
  );
}

export default SignupScreen;
