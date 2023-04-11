import React, { useState, useEffect } from "react";
import {
  FlatList,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import { firestore } from "../../firebase/config";
import { collection, onSnapshot, where, query } from "firebase/firestore";

import { signOutUser } from "../../redux/auth/authOperations";

import Delete from "../../assets/images/delete.svg";
import LogOutIcon from "../../assets/images/logOut.svg";

import Shape from "../../assets/images/Shape.svg";
import ThumbsUp from "../../assets/images/thumbUp.svg";
import MapPinIcon from "../../assets/images/mapPin.svg";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const { userId, login } = useSelector((state) => state.auth);

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );

  const getUserPosts = async () => {
    try {
      onSnapshot(
        query(collection(firestore, "posts"), where("userId", "==", userId)),
        (docSnap) => {
          console.log("docSnap.docs", docSnap.docs);
          setUserPosts(
            docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserPosts();
    const onChange = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
      const height = Dimensions.get("window").height;
      setWindowHeight(height);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);

    return () => dimensionsHandler?.remove();
  }, []);

  const signOut = () => {
    dispatch(signOutUser());
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        style={{
          ...styles.imageBGPicture,
          width: windowWidth,
          height: windowHeight,
        }}
        source={require("../../assets/images/Photo-BG.jpg")}
      >
        <View style={styles.wrapper}>
          <View style={styles.image_thumb}>
            <Delete style={styles.delBtn} width={25} height={25} />
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logOutBtn}>
            <LogOutIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={{ ...styles.title, fontFamily: "RobotoMedium" }}>
            {login}
          </Text>

          <View style={styles.cardInfo}>
            <ScrollView horizontal={true}>
              <FlatList
                data={userPosts}
                keyExtractor={(item, indx) => indx.toString()}
                renderItem={({ item }) => (
                  <View style={{ paddingVertical: 16 }}>
                    <Image
                      style={{
                        width: windowWidth - 16 * 2,
                        height: 240,
                        borderRadius: 8,
                      }}
                      source={{ uri: item.photo }}
                    />
                    <Text>{item.name}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flexDirection: "row", marginTop: 8 }}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Comments", {
                              photo: item.photo,
                              postId: item.id,
                            })
                          }
                        >
                          <Shape />
                        </TouchableOpacity>

                        <Text> </Text>
                        <ThumbsUp />
                        <Text> </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 8 }}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Map", {
                              coords: item.coords,
                            })
                          }
                        >
                          <MapPinIcon />
                        </TouchableOpacity>
                        <Text>City: {item.city}</Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </ScrollView>
            <View>
              <Text
                style={{
                  ...styles.locationName,
                  fontFamily: "RobotoRegular",
                }}
              >
                Forest
              </Text>
              <View style={{ ...styles.infoSection, width: windowWidth - 32 }}>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <MapPinIcon width={24} height={24} />
                  <Text style={{ alignSelf: "center", marginLeft: 8 }}>
                    Location
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  imageBGPicture: {
    flex: 1,
    resizeMode: "cover",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: 147,

    paddingTop: 33,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#fff",
  },

  image_thumb: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderColor: "#F6F6F6",
    borderWidth: 1,
    borderRadius: 16,
  },
  delBtn: {
    position: "absolute",
    bottom: 14,
    left: 104,
  },
  logOutBtn: {
    position: "absolute",
    top: 24,
    right: 16,
  },
  title: {
    marginTop: 32,
    fontSize: 30,
    textAlign: "center",
    lineHeight: 35.16,
    marginBottom: 33,
  },
  cardInfo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },
  locationName: {
    fontSize: 16,
    marginTop: 8,
  },
  infoSection: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default ProfileScreen;
