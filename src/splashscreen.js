import React from 'react';
import {
  View,
  Text, StatusBar, Image
} from 'react-native';
import Color from './components/Colors';
import CustomFont from './components/CustomFont';
import { responsiveWidth, responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import * as Progress from 'react-native-progress';
import icLauncher from '../assets/app_icon.png'
class SplashScreen extends React.Component {

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Color.white, }}>
        <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ height: responsiveHeight(7), width: responsiveHeight(7)}} source={icLauncher} />
           
            <Text style={{ fontFamily: CustomFont.fontNameBold, color: Color.black, fontSize: CustomFont.font26, fontWeight: 'bold', marginLeft: 10 }}>DrOnA Health</Text>
          </View>
        </View>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Progress.CircleSnail size={responsiveFontSize(8)} progress={.1} />
        </View>
        <View style={{ flex: .6, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Color.lightgray, fontSize: CustomFont.font16 }}>v1.0</Text>
        </View>
      </View>
    );
  }
}
export default SplashScreen;