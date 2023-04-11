import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import { useSelector } from "react-redux";

import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/config";

import SendIcon from "../../assets/images/send";

const CommentsScreen = ({ route }) => {
  const { postId, photo } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllcomments] = useState("");
  const { login } = useSelector((state) => state.auth);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const sendCommentToServer = async () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    try {
      const firestoreRef = doc(firestore, "posts", postId);
      await addDoc(collection(firestoreRef, "comments"), {
        comment,
        login,
        date,
        time,
      });
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

  const createComment = () => {
    sendCommentToServer();
    setComment("");
    keyboardHide();
  };

  const getAllComents = async () => {
    try {
      const firestoreRef = doc(firestore, "posts", postId);
      onSnapshot(collection(firestoreRef, "comments"), (docSnap) =>
        setAllcomments(docSnap.docs.map((doc) => ({ ...doc.data() })))
      );
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllComents();
  }, []);

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.comment}>
        <Text>User: {login}</Text>
        <Text>Text: {item.comment}</Text>
        <Text style={styles.date}>
          on {item.date} at {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <View>
          <Image
            source={{ uri: photo }}
            style={{ height: 240, borderRadius: 8 }}
          />
          <View>
            <ScrollView horizontal={true}>
              <FlatList
                data={allComments}
                keyExtractor={allComments.id}
                renderItem={renderItem}
              />
            </ScrollView>
          </View>
          <View style={styles.inputContainer}>
            <View>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Add comment"
                onFocus={() => setIsShowKeyboard(true)}
                style={{
                  ...styles.submitBtn,
                }}
              />
              <TouchableOpacity onPress={createComment}>
                <SendIcon width={34} height={34} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 32,
  },
  comment: {
    minWidth: 320,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "rgba(0, 0, 0, 0.03)",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  date: {
    fontSize: 12,
    textAlign: "right",
    color: "grey",
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    padding: 16,
    height: 50,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "rgba(189, 189, 189, 1)",
    backgroundColor: "#FFFFFF",
  },
  sendIcon: {
    position: "absolute",

    right: 15,
    bottom: 8,
  },
  inputContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    height: 50,
    fontSize: 16,
  },
});

export default CommentsScreen;
