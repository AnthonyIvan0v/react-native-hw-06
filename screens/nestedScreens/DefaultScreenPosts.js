import React, { useState, useEffect } from "react";

import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";

import { firestore } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";

import { signOutUser } from "../../redux/auth/authOperations";

import LogOutIcon from "../../assets/images/logOut.svg";
import ShapeCommentsIcon from "../../assets/images/Shape.svg";
import MapPinIcon from "../../assets/images/mapPin.svg";

const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const { login, email } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getAllPosts = async () => {
    const firestoreRef = collection(firestore, "posts");
    onSnapshot(firestoreRef, (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));
      setPosts(posts);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    if (route.params) setPosts((prevState) => [...prevState, route.params]);
  }, [route.params]);

  const signOut = () => {
    dispatch(signOutUser());
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Image
          source={{ uri: item.photo }}
          style={{
            height: 240,
            width: "100%",
            borderRadius: 8,
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ ...styles.photoName, fontFamily: "RobotoRegular" }}>
          {item.name}
        </Text>
        <View
          style={{
            ...styles.aboutPhotoWrapp,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", marginRight: 35 }}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Comments", {
                    photo: item.photo,
                    postId: item.id,
                  });
                }}
              >
                <ShapeCommentsIcon width={24} height={24} />
              </TouchableOpacity>

              <Text style={{ marginRight: 8 }}> 5 </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Map", { coords: item.coords });
              }}
            >
              <MapPinIcon width={24} height={24} />
            </TouchableOpacity>
            <View
              style={{
                marginLeft: 8,
                flexDirection: "column",
              }}
            >
              <Text>City: {item.city}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={{ ...styles.container, width: "100%" }}
      nestedScrollEnabled={true}
    >
      <View style={styles.header}>
        <Text style={{ ...styles.title, fontFamily: "RobotoMedium" }}>
          Posts
        </Text>
        <TouchableOpacity style={styles.logOutBtn} onPress={signOut}>
          <LogOutIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.userBlock}>
        <Image
          style={{ marginRight: 8, borderRadius: 16 }}
          source={require("../../assets/images/User.jpg")}
        />
        <View>
          <Text style={{ fontFamily: "RobotoMedium" }}>{login}</Text>
          <Text style={{ fontFamily: "RobotoRegular" }}>{email}</Text>
        </View>
      </View>
      <View>
        <ScrollView horizontal={true}>
          <FlatList
            data={posts}
            keyExtractor={(item, index) => `key-${index}`}
            renderItem={renderItem}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  header: {
    position: "relative",
    paddingTop: 55,
    paddingBottom: 11,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },

  logOutBtn: {
    position: "absolute",
    top: 54,
    right: 15,
  },
  userBlock: {
    paddingTop: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    marginTop: 32,
    marginBottom: 24,
    width: "100%",
    minWidth: 320,
  },
  photoName: {
    fontSize: 16,
    marginTop: 8,
  },
  aboutPhotoWrapp: {
    marginTop: 8,
    flexDirection: "row",
  },
});

export default DefaultScreenPosts;
