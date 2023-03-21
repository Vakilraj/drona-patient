import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  LogBox,
  AppState,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AppNavigation from './src/AppNavigation.js';
import Color from './src/components/Colors';
import CustomFont from './src/components/CustomFont';
import SpinnerScreen from './src/splashscreen';
import NetInfo from '@react-native-community/netinfo';
import messaging, {AuthorizationStatus} from '@react-native-firebase/messaging';
import Snackbar from 'react-native-snackbar';

// Ignore log notification by message
// LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();
// import PushNotification from 'react-native-push-notification';
const slides = [
  {
    key: 'key1',
    title: 'Simplify Your Practice',
    text: 'Improve your clinics efficiency\n with DrOnA',
    image: require('./assets/drawer-1.png'),
    index: 0,
  },
  {
    key: 'key2',
    title: 'Consult Your Patients',
    text: 'Manage your patients online\n and in-clinic',
    image: require('./assets/drawer-2.png'),
    index: 1,
  },
  {
    key: 'key3',
    title: 'Create Digital Prescriptions',
    text: 'Create beautiful prescriptions\nyour patients can download',
    image: require('./assets/drawer-3.png'),
    index: 2,
  },
];

var sliderTimer = null;
slideIndex = 0;
import {init} from './src/utils/Global';
//import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from 'react-native-encrypted-storage';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      showSplash: true,
      appState: AppState.currentState,
    };
  }

  async componentDidMount() {
    init();
    const profile_complete = await AsyncStorage.getItem('profile_complete');
    if (profile_complete === 'profile_complete') {
      this.setState({first: false});
      this.setState({showSplash: false});
    } else {
      LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
      setTimeout(() => {
        this.setState({showSplash: false});
        sliderTimer = setInterval(() => {
          try {
            slideIndex++;
            this.refs.slide.goToSlide(slideIndex);
            if (slideIndex == 2) {
              slideIndex = -1;
            }
          } catch (error) {
            console.log(error);
          }
        }, 2000);
      }, 3000);
      this.getFcmToken();
    }
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        DRONA.setIsNetConnected(false);
        Snackbar.show({
          text: 'Please check your internet connection',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Color.primary,
        });
      } else {
        DRONA.setIsNetConnected(true);
      }
      //alert(JSON.stringify(DRONA.getIsNetConnected()));
    });

    // NetInfo.addEventListener(state => {
    // 	//alert(state.isConnected);
    // 	// NetInfo.fetch().then(state => {
    // 	// 	alert(state.isConnected);
    // 	//   });
    // 	//alert(state.isConnected);
    // 	if (!state.isConnected) {
    // 		Snackbar.show({ text: 'Please check your internet connection', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
    // 	}
    // });
    // NetInfo.fetch().then(state => {
    // 		alert(state.isConnected);
    // 	  });
  }

  componentWillUnmount() {
    this.appStateSubscription.remove();
    console.log('App has come to the unmount!');
  }

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    //console.log('kkk------------------'+fcmToken);
    //alert('hh'+fcmToken);
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      //alert('hhhh 2 '+fcmToken);

      //   messaging().onMessage(async remoteMessage => {
      // 	let data=remoteMessage.notification;
      // 	if(Platform.OS === 'ios'){
      // 	  //alert(JSON.stringify(remoteMessage));
      // 	  //alert(remoteMessage.notification.body);
      // 	}else{
      // 		//alert('hhhh 2 rece'+JSON.stringify(data));
      // 	  PushNotification.localNotification({
      // 	  title: data.title ? data.title : 'Aktuaris',
      // 	  message: data.title ? data.body : 'Aktuaris',
      // 	  playSound: false,
      // 	  soundName: 'default',
      // 	  //actions: '["Yes", "No"]'
      // 	});
      // 	}

      //   });
    }

    // messaging().onNotificationOpenedApp(remoteMessage => {
    // 	console.log('-------------------------------jjj-------------------------------')
    // 	alert('+++++++'+JSON.stringify(remoteMessage));
    // 	// console.log(
    // 	//   'Notification caused app to open from background state:',
    // 	//   remoteMessage.notification,
    // 	// );
    // 	//navigation.navigate(remoteMessage.data.type);
    //   });

    //   messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    // 	console.log('------------------------------kgder--------------------------------'+JSON.stringify(remoteMessage))
    // 	if (remoteMessage) {
    // 		alert('-------'+JSON.stringify(remoteMessage));
    // 	//   console.log(
    // 	//     'Notification caused app to open from quit state:',
    // 	//     remoteMessage.notification,
    // 	//   );
    // 	  //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
    // 	}
    //   });
  };

  _renderItem = ({item}) => {
    return (
      <View style={{flexDirection: 'row', marginTop: responsiveHeight(5)}}>
        {/* {item.index == 0 ? null : <View style={{ width: 24, backgroundColor: item.index == 0 ? '#FBF5E5' : item.index == 1 ? '#FCEFF5' : item.index === 2 ? '#FBF5E5' : '#FBF5E5', borderTopEndRadius: 10, borderBottomEndRadius: 10 }} />} */}

        <View
          style={{
            flex: 1,
            height: responsiveHeight(75),
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor:
              item.index === 0
                ? '#FCEFF5'
                : item.index === 1
                ? '#FBF5E5'
                : item.index === 2
                ? '#DBF1FD'
                : '#DBF1FD',
            marginStart: item.index == 0 ? 24 : 15,
            marginEnd: item.index == 2 ? 24 : 15,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#DBF1FD',
            padding: Platform.OS === 'ios' ? 0 : 16,
            paddingBottom: 24,
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}>
            <StatusBar
              backgroundColor={Color.statusBarNewColor}
              barStyle="dark-content"
            />
            <Image
              source={item.image}
              style={{
                marginTop: responsiveHeight(7),
                height: responsiveHeight(40),
                width: '100%',
                resizeMode: 'stretch',
                padding: 20,
                marginBottom: item.index == 0 ? 20 : item.index == 1 ? -20 : 0,
              }}
            />
            <Text
              style={{
                fontFamily: CustomFont.fontName,
                fontWeight: 'bold',
                fontSize: CustomFont.font18,
                marginTop:
                  Platform.OS === 'ios'
                    ? responsiveHeight(1.5)
                    : responsiveHeight(-2),
                marginLeft: 20,
                marginRight: 20,
                marginTop: 1,
                textAlign: 'center',
                color: Color.fontColor,
              }}>
              {item.title}
            </Text>
            {/* <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400, marginTop: responsiveHeight(1.5), marginLeft: 10, marginRight: 10, textAlign: 'center', color: Color.red }}>{item.text}</Text> */}
            {item.key === 'key1' ? (
              <Text
                style={{
                  fontFamily: CustomFont.fontNameBold,
                  fontSize: CustomFont.font14,
                  marginTop: responsiveHeight(1.5),
                  marginLeft: 10,
                  marginRight: 10,
                  textAlign: 'center',
                  color: Color.fontColor,
                }}>
                Improve Your {"Clinic's"} Efficiency{'\n'} With DrOnA Health
              </Text>
            ) : item.key === 'key2' ? (
              <Text
                style={{
                  fontFamily: CustomFont.fontNameBold,
                  fontSize: CustomFont.font14,
                  marginTop: responsiveHeight(1.5),
                  marginLeft: 10,
                  marginRight: 10,
                  textAlign: 'center',
                  color: Color.fontColor,
                }}>
                Manage Your Patients{'\n'} Virtual and In-clinic
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: CustomFont.fontNameBold,
                  fontSize: CustomFont.font14,
                  marginTop: responsiveHeight(1.5),
                  marginLeft: 10,
                  marginRight: 10,
                  textAlign: 'center',
                  color: Color.fontColor,
                }}>
                Improve Your {"Clinic's"} Efficiency{'\n'} With DrOnA Health
              </Text>
            )}
          </View>
        </View>
        {item.index == 2 ? null : (
          <View
            style={{
              width: 24,
              backgroundColor:
                item.index == 0
                  ? '#FBF5E5'
                  : item.index == 1
                  ? '#DBF1FD'
                  : item.index === 2
                  ? '#DBF1FD'
                  : '#DBF1FD',
              borderTopStartRadius: 10,
              borderBottomStartRadius: 10,
            }}
          />
        )}
      </View>
    );
  };

  _onDone = () => {
    clearInterval(sliderTimer);
    sliderTimer = null;
    this.setState({first: false});
  };
  render() {
    //alert(responsiveFontSize(4))
    if (this.state.showSplash) {
      return <SpinnerScreen />;
    }
    return this.state.first ? (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: Color.white,
        }}>
        <View style={{flex: 10}}>
          <AppIntroSlider
            ref="slide"
            renderItem={this._renderItem}
            data={slides}
            onDone={this._onDone}
            activeDotStyle={{backgroundColor: Color.primary}}
            dotStyle={{backgroundColor: Color.inactiveDotColor}}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              width: responsiveWidth(80),
              height: responsiveHeight(5.9),
              backgroundColor: Color.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={this._onDone}>
            <Text
              style={{
                fontFamily: CustomFont.fontName,
                color: Color.white,
                fontSize: CustomFont.font16,
              }}>
              Get Started 
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <AppNavigation />
    );
  }
}

export default App;
