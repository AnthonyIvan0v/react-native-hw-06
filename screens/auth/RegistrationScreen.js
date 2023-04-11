import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AddIcon from "../../assets/images/add.svg";
import { authSignUpUser } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

const initialState = {
  login: "",
  email: "",
  password: "",
};

export default function Registration({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);

  const [borderLoginColor, setBorderLoginColor] = useState("#E8E8E8");
  const [borderEmailColor, setBorderEmailColor] = useState("#E8E8E8");
  const [borderPasswordColor, setBorderPasswordColor] = useState("#E8E8E8");

  const [inputBgLoginColor, setInputBgLoginColor] = useState("#F6F6F6");
  const [inputBgEmailColor, setInputBgEmailColor] = useState("#F6F6F6");
  const [inputBgPasswordColor, setInputBgPasswordColor] = useState("#F6F6F6");

  const windowWidth = Dimensions.get("window").width - 16 * 2;
  const [dimensions, setDimensions] = useState({ windowWidth });

  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ windowWidth: window.width - 16 * 2 });
    });
    return () => subscription?.remove();
  });

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const onSubmit = async () => {
    try {
      const newState = {
        login: state.login,
        email: state.email,
        password: state.password,
      };
      console.log(`newState`, newState);
      dispatch(authSignUpUser(newState));
      console.log("state", state);
      setState(initialState);
    } catch (error) {
      console.log("error.message", error.message);
      console.log("error.code", error.code);
    }
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
              marginTop: isShowKeyboard ? 147 : 263,
            }}
          >
            <View style={styles.userImageThumb}>
              <AddIcon style={styles.addBtn} width={25} height={25} />
            </View>

            <View style={{ ...styles.form, width: dimensions.windowWidth }}>
              <Text
                style={{
                  ...styles.header,
                  fontFamily: "RobotoMedium",
                }}
              >
                Registration
              </Text>

              <TextInput
                value={state.login}
                type="text"
                style={{
                  ...styles.input,
                  marginBottom: 16,
                  fontFamily: "RobotoRegular",
                  borderColor: borderLoginColor,
                  backgroundColor: inputBgLoginColor,
                }}
                placeholder="Login"
                onFocus={() => {
                  setIsShowKeyboard(true);
                  setBorderLoginColor("#FF6C00");
                  setInputBgLoginColor("#FFFFFF");
                }}
                onBlur={() => {
                  setBorderLoginColor("#E8E8E8");
                  setInputBgLoginColor("#F6F6F6");
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, login: value }))
                }
              />

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
                onPress={onSubmit}
              >
                <Text
                  style={{ ...styles.btnTitle, fontFamily: "RobotoRegular" }}
                >
                  Register
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Login")}
              >
                <Text
                  style={{ ...styles.linkTitle, fontFamily: "RobotoRegular" }}
                >
                  Already have an account? Login
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

    paddingTop: 92,
    borderWidth: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },

  userImageThumb: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderColor: "#F6F6F6",
    borderWidth: 1,
    borderRadius: 16,
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
    lineHeight: 18.75,
    color: "#1B4371",
  },
});
