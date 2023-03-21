import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightBackground,
  },
  safeArea: { flex: 1, backgroundColor: Color.lightBackground },
  mainView: {
    flex: 1, alignItems: 'center'
  },
  header: { flexDirection: 'row', marginTop: responsiveHeight(10) },
  appIcon: { height: responsiveWidth(15), width: responsiveWidth(15) },
  headerTxt: { fontSize: responsiveFontSize(4), color: Color.slideTxt, fontWeight: 'bold', marginLeft: responsiveWidth(3) },
  switchView: { width: responsiveWidth(100), flexDirection: 'row', marginTop: responsiveScreenHeight(1) },
  switchTxt: { marginTop: 4, marginRight: 5, fontSize: responsiveFontSize(1.6) },
  sinupBtn: { width: responsiveWidth(80), height: responsiveHeight(5.9), backgroundColor: Color.inactiveDotColor, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1), borderRadius: 3 },
  signUpLabel: { color: Color.lightgray, fontSize: responsiveFontSize(1.6), marginTop: responsiveHeight(2) },
  signupBg: { flex: 1, width: responsiveWidth(100), alignItems: 'center', backgroundColor: Color.lightBackground, marginTop: responsiveHeight(10) },
  loginBtn: { width: responsiveWidth(80), height: responsiveHeight(5.5), backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(3.2), borderRadius: 3 },
  loginBtn1: { width: responsiveWidth(87), height: responsiveHeight(5.5), backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(5), borderRadius: 5 },
  otpInput:{width:responsiveWidth(13.4), borderRadius:6,borderColor:Color.otpInputBorder,borderWidth:1,height:responsiveHeight(8.5),padding:0,fontSize:CustomFont.font16,color: Color.fontColor,textAlign:'center'},

});
export default styles;
