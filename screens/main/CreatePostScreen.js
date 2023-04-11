import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera, CameraType } from "expo-camera";
import { storage } from "../../firebase/config";

import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  View,
} from "react-native";
import * as Location from "expo-location";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../firebase/config";

import ArrowLeftIcon from "../../assets/images/arrowLeft.svg";
import CameraIcon from "../../assets/images/camera.svg";
import MapPinIcon from "../../assets/images/mapPin.svg";
import DeleteIcon from "../../assets/images/trashBin.svg";

export const CreatePostScreen = ({ navigation }) => {
  const [location, setLocation] = useState({});
  const [coords, setCoords] = useState(null);
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [snap, setSnap] = useState(null);
  const [photo, setPhoto] = useState(null);

  const { userId, login } = useSelector((state) => state.auth);

  const locationHandler = (text) => setLocation(text.trim());
  const nameHandler = (text) => setName(text.trim());

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    // const photo = await snap.takePictureAsync();
    // setPhoto(photo.uri);'
    // const options = { quality: 0.1 };
    const { uri } = await snap.takePictureAsync();

    let photoLocation = await Location.getCurrentPositionAsync({});
    // console.log("photoLocation", photoLocation);
    let coords = {
      latitude: photoLocation.coords.latitude,
      longitude: photoLocation.coords.longitude,
    };
    let address = await Location.reverseGeocodeAsync(coords);
    console.log("address", address);
    let city = address[0].city;
    setPhoto(uri);
    console.log("uri", uri);
    setCoords(coords);
    setCity(city);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const { cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (cameraStatus === "granted") {
        setHasCameraPermission(true);
      }
    })();
  }, []);

  const isDisabled = () => {
    if (!photo || name === "" || location === "") {
      return true;
    }
    return false;
  };

  const onSend = async () => {
    console.log("navigation", navigation.navigate);
    uploadPhotoToServer();

    uploadPostToServer();

    navigation.navigate("DefaultScreen");

    Keyboard.dismiss();
    onDelete();
  };

  const onDelete = () => {
    setName("");
    setLocation(null);
    setPhoto(null);
    setCity(null);
  };

  // uploading to firebase
  const uploadPhotoToServer = async () => {
    const postId = Date.now().toString();
    const path = `images/${postId}.jpeg`;
    const storageRef = ref(storage, path);

    const response = await fetch(photo);
    const file = await response.blob();

    const uploadPhoto = await uploadBytes(storageRef, file).then(() => {
      console.log("Uploaded a blob or file!");
    });

    const processedPhoto = await getDownloadURL(storageRef)
      .then((downloadURL) => {
        return downloadURL;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });

    return processedPhoto;
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();

    try {
      const setUserPost = await addDoc(collection(firestore, "posts"), {
        userId,
        login,
        photo,
        name,
        location,
        coords,
        city,
      });
      console.log("post is loaded");
    } catch (error) {
      console.error("Error while adding doc: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <View>
          <View style={styles.header}>
            <Text style={{ ...styles.title, fontFamily: "RobotoMedium" }}>
              Create post
            </Text>
            <TouchableOpacity style={styles.backBtn}>
              <ArrowLeftIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <View>
              {photo ? (
                <View style={styles.takenPhotoContainer}>
                  <Image
                    source={{ uri: photo }}
                    style={{ height: 240, width: "100%" }}
                  />
                  <TouchableOpacity
                    style={styles.newSnapBtn}
                    onPress={() => setPhoto(null)}
                  >
                    <Text style={{ color: "#FFFFFF" }}>Tap for new photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Camera ref={setSnap} style={styles.camera}>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 60,
                      width: 60,
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: 50,
                    }}
                    onPress={takePhoto}
                  >
                    <CameraIcon style={styles.cameraIcon} />
                  </TouchableOpacity>
                </Camera>
              )}

              <View style={styles.form}>
                <TouchableOpacity>
                  <Text
                    style={{ ...styles.download, fontFamily: "RobotoRegular" }}
                  >
                    Download a photo
                  </Text>
                </TouchableOpacity>
                <TextInput
                  value={name}
                  onChangeText={nameHandler}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                  }}
                  placeholder="Name..."
                  placeholderTextColor="#BDBDBD"
                  style={{
                    ...styles.input,
                    fontFamily: "RobotoRegular",
                  }}
                />
                <View>
                  <MapPinIcon style={styles.location} />
                  <TextInput
                    value={location}
                    onChangeText={locationHandler}
                    onFocus={() => {
                      setIsShowKeyboard(true);
                    }}
                    placeholder="Location"
                    placeholderTextColor="#BDBDBD"
                    style={{
                      ...styles.input,
                      paddingLeft: 28,
                      fontFamily: "RobotoRegular",
                    }}
                  />
                </View>
                <TouchableOpacity
                  disabled={isDisabled()}
                  style={[
                    styles.submitBtn,
                    isDisabled() ? styles.invalidBtn : styles.validBtn,
                  ]}
                  activeOpacity={0.8}
                  onPress={onSend}
                >
                  <Text
                    style={[
                      styles.submitBtnText,
                      isDisabled() ? styles.invalidBtn : styles.validBtn,
                    ]}
                  >
                    Publish
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.deleteWrapp}
                  activeOpacity={0.8}
                  onPress={onDelete}
                >
                  <DeleteIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },

  backBtn: {
    position: "absolute",
    top: 45,
    left: 16,
  },
  camera: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginHorizontal: 16,
    marginTop: 32,
  },
  takenPhotoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 32,
  },
  cameraIcon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  download: {
    fontSize: 16,
    color: "#BDBDBD",
    marginBottom: 32,
  },
  form: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    height: 50,
    fontSize: 16,
  },
  location: {
    position: "absolute",
    left: 0,
    bottom: 15,
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 100,
    height: 50,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#F6F6F6",
  },
  validBtn: {
    backgroundColor: "#FF6C00",
    color: "#FFFFFF",
  },
  invalidBtn: {
    backgroundColor: "#F6F6F6",
    color: "#BDBDBD",
  },
  submitBtnText: { fontFamily: "RobotoRegular" },
  deleteWrapp: {
    height: 40,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
  },
  newSnapBtn: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreatePostScreen;
