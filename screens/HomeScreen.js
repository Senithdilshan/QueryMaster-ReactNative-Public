
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Colors } from '../constants/styles';
import IconButton from '../components/UI/IconButton';
import Chat from '../components/Chat/Chat';
import { deleteDocument, sendOpenAiMessage, uploadDocument } from '../util/LangChain';
import uuid from 'react-native-uuid';
import { getLastTransformedHistory } from '../Helpers/ChatHistory.helper';
import * as DocumentPicker from 'expo-document-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import * as FileSystem from 'expo-file-system';
import { addConversation, getAllConversations, getConversationData, updateChatHistory, updateDocumentIds } from '../util/DataBase/Functions';
import { AuthContext } from '../Store/Auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { summarizeTitle } from '../Helpers/TitleSumerize.helper';

const HomeScreen = () => {
  const route = useRoute();
  const userCtx = useContext(AuthContext);
  const flatListRef = useRef(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState({
    id: '',
    name: ''
  });
  const id = useRef(route.params?.id ? route.params.id : 0);
  const [chatHistoryData, setChatHistoryData] = useState();
  const [userMessage, setUserMessage] = useState('');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getChatHistory = async () => {
      id.current = route.params?.id ? route.params.id : 0
      // console.log("id", id.current);
      if (id.current === 0) {
        setChatHistoryData([]);
      } else {
        const response = await getConversationData(id.current);
        setChatHistoryData(response?.chatHistory);
        // console.log("res", response);
      }
    }
    getChatHistory();
  }, [route.params]);
  const sendMessageHandler = async () => {
    if (userMessage.length > 0) {
      setIsSendButtonDisabled(true);
      let chatObj = {
        id: uuid.v4(),
        message: userMessage,
        isAi: false,
        document: isFileUploaded ? {
          id: file?.id,
          name: file?.name
        } : null,
        date: new Date()
      }
      setChatHistoryData(prevHistory => [...prevHistory, chatObj]);
      isFileUploaded && setIsFileUploaded(false);
      const history = getLastTransformedHistory(chatHistoryData);
      try {
        const response = await sendOpenAiMessage(chatObj.message, chatObj.document !== null ? chatObj?.document?.id : null, history, userCtx.modelName);
        setUserMessage('');
        let resChatobj = {
          id: response?.id,
          message: response?.content,
          isAi: true,
          document: null,
          date: new Date()
        }
        setChatHistoryData(prevHistory => [...prevHistory, resChatobj]);
        if (id.current === 0) {
          const conversationId = uuid.v4();
          const title = summarizeTitle(resChatobj.message);
          const storedUserId = await AsyncStorage.getItem('userId') || '';
          const res = await addConversation(conversationId, userCtx.userId ? userCtx.userId : storedUserId, title);
          id.current = conversationId;
          userCtx.setLastDocIdHandler(conversationId);
          // console.log(res);
        }
        try {
          await updateChatHistory(id.current, chatObj);
          await updateChatHistory(id.current, resChatobj);
        } catch (error) {
          console.log(error);
        }
        if (isFileUploaded) {
          await updateDocumentIds(id.current, file?.id)
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Something went wrong. Please try again later');
      }
      setIsSendButtonDisabled(false);
    } else {
      Alert.alert('Please enter a message');
    }
  }

  const fileUploadHandler = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'],
    });
    // console.log(result);
    if (!result.canceled) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: result.assets[0].mimeType
      }, result.assets[0].name);
      try {
        const response = await uploadDocument(formData);
        setFile({
          id: response?.ids[0],
          name: result.assets[0].name
        });
        // console.log(response);
        setIsFileUploaded(true);
      } catch (error) {
        Alert.alert('Error', 'File upload failed. Please try again later');
      }
      setIsLoading(false);
    }
  }
  const deleteFileHandler = async () => {
    setIsDeleting(true);
    try {
      await deleteDocument(file?.id);
      setIsFileUploaded(false);
      setFile(null);
    } catch (error) {
      Alert.alert('Error', 'File deletion failed. Please try again later');
    }
    setIsDeleting(false);
  }


  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, []);
  const renderChatList = (itemData) => {
    const item = itemData?.item;
    return <Chat item={item} />
  }
  return (
    <View style={[styles.rootContainer, { paddingBottom: isFileUploaded ? 120 : 70 }]}>
      <Spinner
        visible={isLoading}
        textContent={'Uploading...'}
        textStyle={{ color: 'white' }}
      />
      <Spinner
        visible={isDeleting}
        textContent={'Deleting...'}
        textStyle={{ color: 'white' }}
      />
      <View contentContainerStyle={styles.scrollView}>
        <FlatList
          ref={flatListRef}
          data={chatHistoryData}
          keyExtractor={(item) => item.id}
          renderItem={renderChatList} />
      </View>
      <View style={[styles.inputContainer, isFileUploaded && { borderRadius: 20 }]}>
        {isFileUploaded && (
          <View style={styles.attachmentContainer}>
            <IconButton icon={'document'} color={"white"} size={24} onPress={() => { }} />
            <Text style={styles.attachmentText}>{file?.name}</Text>
            <IconButton icon={'remove-circle'} color={"white"} size={24} onPress={deleteFileHandler} />
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton icon={'document-attach'} color={"white"} size={24} onPress={fileUploadHandler} isButtonDisabled={isSendButtonDisabled} />
          <TextInput
            multiline={true}
            style={styles.textInput}
            placeholder="Message"
            placeholderTextColor="white"
            value={userMessage}
            onChangeText={(text) => setUserMessage(text)}
            readOnly={isSendButtonDisabled}
          />
          <IconButton icon={'send'} color={"white"} size={24} onPress={sendMessageHandler} isButtonDisabled={isSendButtonDisabled} />
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.chatHome,

  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  inputContainer: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: Colors.chatInput,
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aca8a8',
    borderRadius: 30,
    padding: 5,
    justifyContent: 'space-between',
  },
  attachmentText: {
    color: 'white',
  },
  textInput: {
    width: 220,
    padding: 10,
    backgroundColor: Colors.chatInput,
    borderRadius: 30,
    color: 'white',
  },
});
