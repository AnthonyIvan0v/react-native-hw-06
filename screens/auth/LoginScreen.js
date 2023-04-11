import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Dimensions,
  StyleSheet,
  ScrollView,
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { authSignInUser } from "../../redux/auth/authOperations";

import { useDispatch } from "react-redux";

const initialState = {
  email: "",
  password: "",
};

export default function Login({ navigation }) {
  // console.log("navigation", navigation);
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [borderEmailColor, setBorderEmailColor] = useState("#E8E8E8");
  const [borderPasswordColor, setBorderPasswordColor] = useState("#E8E8E8");

  const [inputBgEmailColor, setInputBgEmailColor] = useState("#F6F6F6");
  const [inputBgPasswordColor, setInputBgPasswordColor] = useState("#F6F6F6");

  const windowWidth = Dimensions.get("window").width - 16 * 2;
  const [dimensions, setDimensions] = useState({ windowWidth });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ windowWidth: window.width - 16 * 2 });
    });
    return () => subscription?.remove();
  });

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const handleSubmit = () => {
    if (!state.email.trim() || !state.password.trim()) {
      Alert.alert("Please fill in all empty fields!");
      return;
    }

    setState(initialState);
    dispatch(authSignInUser(state));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/Photo-BG.jpg")}
        >
          <View
            style={{
              ...styles.wrapp,
              width: "100%",
              marginTop: isShowKeyboard ? 273 : 323,
            }}
          >
            <View style={{ ...styles.form, width: dimensions.windowWidth }}>
              <Text
                style={{
                  ...styles.header,
                  fontFamily: "RobotoMedium",
                }}
              >
                Log in
              </Text>

              <TextInput
                value={state.email}
                type="email"
                style={{
                  ...styles.input,
                  marginBottom: 16,
                  fontFamily: "RobotoRegular",
                  borderColor: borderEmailColor,
                  backgroundColor: inputBgEmailColor,
                }}
                placeholder="Email adress"
                onFocus={() => {
                  setIsShowKeyboard(true);
                  setBorderEmailColor("#FF6C00");
                  setInputBgEmailColor("#FFFFFF");
                }}
                onBlur={() => {
                  setBorderEmailColor("#E8E8E8");
                  setInputBgEmailColor("#F6F6F6");
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, email: value }))
                }
              />

              <TextInput
                value={state.password}
                type="password"
                style={{
                  ...styles.input,
                  marginBottom: 43,
                  fontFamily: "RobotoRegular",
                  borderColor: borderPasswordColor,
                  backgroundColor: inputBgPasswordColor,
                }}
                secureTextEntry={true}
                placeholder="Password"
                onFocus={() => {
                  setIsShowKeyboard(true);
                  setBorderPasswordColor("#FF6C00");
                  setInputBgPasswordColor("#FFFFFF");
                }}
                onBlur={() => {
                  setBorderPasswordColor("#E8E8E8");
                  setInputBgPasswordColor("#F6F6F6");
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, password: value }))
                }
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btn}
                onPress={handleSubmit}
              >
                <Text
                  style={{ ...styles.btnTitle, fontFamily: "RobotoRegular" }}
                >
                  Log in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Registration")}
              >
                <Text
                  style={{ ...styles.linkTitle, fontFamily: "RobotoRegular" }}
                >
                  Don`t have an account? Register
                </Text>
              </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
  },
  wrapp: {
    flex: 1,
    alignItems: "center",

    paddingTop: 32,
    borderWidth: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },

  addBtn: {
    position: "absolute",
    bottom: 14,
    left: 104,
  },

  header: {
    fontSize: 30,
    textAlign: "center",
    lineHeight: 35.16,
    marginBottom: 33,
  },
  form: {
    flex: 1,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    placeholderTextColor: "#BDBDBD",
  },
  btn: {
    height: 51,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  btnTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 19,
  },
  linkTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 132,
    lineHeight: 18.75,
    color: "#1B4371",
  },
});
