import { createStackNavigator } from "@react-navigation/stack";
import LandingScreen from "../screens/landing";
import Home from "../screens/Home";
// @ts-ignore
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import SignIn from "../screens/(auth)/SignIn";
import SignUp from "../screens/(auth)/SignUp";
import TabLayout from "./TabLayout";
import AddPost from "../screens/AddPost";
import DrawerNavigator from "./DrawerNavigator";
import Event from "../screens/(tab)/Event";
import Profile from "../screens/(profile)/Profile";
import { TransitionPresets } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ExploreClubs from "../screens/ExploreClubs";
import { useTheme } from "react-native-paper";
import CreateClub from "../screens/CreateClub";
import AddEvent from "../screens/AddEvent";
import AllActivityScreen from "../screens/allActivityScreen/AllActivityScreen";
import Colors from "../constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import ProfileStepOneScreen from "../screens/(verificationScreen)/VerificationScreen";
import ProfileStepTwoScreen from "../screens/(profile)/ProfileStepTwoScreen";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
  TabLayout: undefined;
  AddPost: undefined;
  Event: undefined;
  Profile: undefined;
  DrawerNavigator: undefined;
  ExploreClubs: undefined;
  CreateClub: undefined;
  AddEvent: undefined;
  AllActivityScreen: undefined;
  ProfileStepOneScreen: undefined;
  ProfileStepTwoScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false, headerTitle: "" }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerTitle: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerTitle: "", headerTransparent: true }}
      />
    </Stack.Navigator>
  );
};

export const AuthenticatedStack = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (!userData?.profile_completed) {
      navigation.navigate("ProfileStepOneScreen");
    }
  }, [userData]);

  return (
    <Stack.Navigator
      initialRouteName={
        userData?.profile_completed ? "DrawerNavigator" : "ProfileStepOneScreen"
      }
      screenOptions={{
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.SlideFromLeftIOS,
        }}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPost}
        options={{
          headerShown: true,
          headerTitle: "Add New Post",
          headerBackTitle: "Back",
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          headerTransparent: true,
          headerTintColor: colors.onBackground,
          headerShown: false,
          headerTitle: "Profile",
          gestureEnabled: false,
          ...TransitionPresets.SlideFromRightIOS,
        })}
      />

      <Stack.Screen
        name="CreateClub"
        component={CreateClub}
        options={({ navigation }) => ({
          headerShown: true,
          ...TransitionPresets.SlideFromRightIOS,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={colors.onBackground} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="AddEvent"
        component={AddEvent}
        options={{
          headerShown: true,
          headerTitle: "Add Event",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name="AllActivityScreen"
        component={AllActivityScreen}
        options={({ navigation }) => ({
          headerTitle: "All Activity",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.onBackground,
            fontSize: RFValue(16),
            marginLeft: RFValue(10),
          },

          ...TransitionPresets.SlideFromRightIOS,
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingHorizontal: RFValue(7) }}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="arrow-left"
                size={RFValue(24)}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ProfileStepOneScreen"
        component={ProfileStepOneScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileStepTwoScreen"
        component={ProfileStepTwoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
