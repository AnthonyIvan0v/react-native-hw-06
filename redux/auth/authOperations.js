import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { authSlice } from "./authReducer";

const { authStateChange, updateUserProfile, authSignOut } = authSlice.actions;

export const authStateChangeUser = () => async (dispatch) => {
  await onAuthStateChanged(auth, (user) => {
    try {
      if (user) {
        const userUpdateProfile = {
          login: user.displayName,
          userId: user.uid,
          email: user.email,
        };
        dispatch(authStateChange({ stateChange: true }));
        dispatch(updateUserProfile(userUpdateProfile));
      }
    } catch (error) {
      console.log("error.message:", error.message);
    }
  });
};

export const authSignUpUser =
  ({ login, email, password }) =>
  async (dispatch) => {
    try {
      // const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: login,
      });

      const { uid, displayName, photoURL } = auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
          email,
        })
      );

      Alert.alert(`Welcome`);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        Alert.alert("The password is too weak.");
      } else {
        Alert.alert(errorMessage);
      }
      console.log(error);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("user", user);
      Alert.alert("Welcome!");
    } catch (error) {
      Alert.alert(`${error.message}`);
      console.log("error.message", error.message);
      console.log("error.code", error.code);
    }
  };

export const signOutUser = () => async (dispatch, getState) => {
  // signOut() method from firebase
  auth
    .signOut()
    .then(() => {
      dispatch(authSignOut());
    })
    .catch((error) => {
      console.log(error);
    });
};
