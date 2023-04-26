import { Platform, StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
const styles = StyleSheet.create({
  weekdaycell: { borderRadius: 4, height: responsiveHeight(7), width: responsiveWidth(11), justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(1), marginLeft: responsiveWidth(1), borderWidth: 1, borderColor: Color.primary },
  modalTopDay: { width: responsiveWidth(23), height: responsiveHeight(5), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.calendarTopButtonColor, borderRadius: 10, marginLeft: 10, marginRight: 10 },
  createInputStylefornewClinic: {
    borderRadius: 4, borderColor: Color.createInputBorder, borderWidth: 1, height: responsiveHeight(7),
    paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), color: Color.fontColor, backgroundColor: Color.white
  },
  container: {
    flex: 1,
    backgroundColor: Color.newBgColor,minHeight:responsiveHeight(93)
  },
  containerAndroid: {
    flex: 1,backgroundColor: Color.newBgColor,minHeight:responsiveHeight(95)
  },
  arrowForsmallTxt: { marginRight: 30, padding: 10, height: responsiveFontSize(1.6), width: responsiveFontSize(1.6), resizeMode: 'contain' },
  arrowForbigTxt: { position: 'absolute', height: responsiveFontSize(1.6), width: responsiveFontSize(1.6), resizeMode: 'contain', right: Platform.OS === 'android' ? responsiveWidth(5) : responsiveWidth(8), top: responsiveHeight(2) },
  modelView: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-30) : responsiveHeight(-20),
    // position : 'absolute',
  }, modelViewUpi: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-50) : responsiveHeight(-50),
    // position : 'absolute',
  },
  createInputStyle: { height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.headingTxtClr, paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0, opacity: .7 },
  createTextArea: { height: responsiveHeight(14), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.fontColor, padding: 7, opacity: .7, textAlignVertical: 'top' },
  createInputStyleMobile: {borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.newBgColor, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.fontColor,padding:responsiveHeight(1.6), paddingLeft: 10,textAlignVertical:'center', opacity: .7 },
  inputHeader: { fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem, marginTop: responsiveHeight(3) },
  modelViewAddress: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: responsiveHeight(-10),
    // position : 'absolute',
  },
  addPost: {
    // height: responsiveFontSize(6), width: responsiveFontSize(6), borderRadius: responsiveFontSize(3), backgroundColor: Color.primary, position: 'absolute',
    // bottom: responsiveHeight(6), right: responsiveWidth(4), alignItems: 'center', justifyContent: 'center'
     height: responsiveFontSize(7),
    width: responsiveFontSize(7),
    borderRadius: responsiveFontSize(5),
    backgroundColor: Color.primary,
    position: 'absolute',
    bottom: responsiveHeight(6),
    right: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:999,
    borderStyle:'solid',
    borderWidth:8,
    borderColor:'#E0E0E0',
  },
  modelView3dots: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(45),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: responsiveHeight(-30),
    // position : 'absolute',
  },
  modelViewMessage2: {
    backgroundColor: Color.white,
    borderRadius: 20,
    width: responsiveWidth(80),
    marginStart: 17,
    paddingStart: responsiveWidth(10),
    paddingEnd: responsiveWidth(10),
    alignItems: 'center',
    bottom: Platform.OS === 'ios' ? responsiveHeight(0) : responsiveHeight(0),
  },
  modalTopDay: {
    width: responsiveWidth(23), height: responsiveHeight(5),
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: 6,
    marginLeft: 2,
    marginRight: 2,
    borderWidth: .7,
    borderColor: Color.inputdefaultBorder
  },
  topic: {
    height: responsiveHeight(7), width: responsiveWidth(30),
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 6,
    borderColor: Color.helptopicborder, borderWidth: .7,
  },
  topicTxt: {

    fontWeight: CustomFont.fontWeight500,
    fontFamily: CustomFont.fontName,
    fontSize: CustomFont.font16,
    color: Color.optiontext
  },
  tiTitle: {
    fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(3)
  },
  actionTitle: {
    fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font14, color: Color.optiontext,  marginLeft: responsiveHeight(1)
  },
  modelTextInput1: {
    height: responsiveHeight(6), marginTop: responsiveHeight(1.3), padding: 0,
    paddingLeft: 16, paddingRight: 16, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, borderWidth: 1, fontSize: CustomFont.font14, borderRadius: 5, color: Color.yrColor,
  },
  loginBtn1: { width: responsiveWidth(87), height: responsiveHeight(6), backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(5), borderRadius: 5 },
});
export default styles;
