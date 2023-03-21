import { Platform, StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
const styles = StyleSheet.create({
  weekdaycell:{borderRadius:4,height:responsiveHeight(7),width:responsiveWidth(11.6),justifyContent:'center',alignItems:'center',marginRight:responsiveWidth(1),marginLeft:responsiveWidth(1)},
  modalTopDay:{width:responsiveWidth(23),height:responsiveHeight(5),justifyContent:'center',alignItems:'center',backgroundColor:Color.calendarTopButtonColor,borderRadius:10,marginLeft:10,marginRight:10},
  createInputStylefornewClinic:{borderRadius:4,borderColor:Color.createInputBorder,borderWidth:1,height:responsiveHeight(7),
    paddingLeft:10,paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:CustomFont.font16,marginTop:responsiveHeight(1.3),color: Color.fontColor, backgroundColor:Color.white},
arrowForsmallTxt:{marginRight:30, padding:10, height: responsiveFontSize(1.6), width: responsiveFontSize(1.6),resizeMode:'contain' },
arrowForbigTxt:{position:'absolute', height: responsiveFontSize(1.6), width: responsiveFontSize(1.6),resizeMode:'contain',right:Platform.OS==='android'? responsiveWidth(5): responsiveWidth(8),top:responsiveHeight(2) },
modelView: {
  backgroundColor: Color.white,
  borderTopStartRadius: 20,
  borderTopEndRadius: 20,
  height: responsiveHeight(100),
  width: responsiveWidth(101),
  marginStart: -20,
  bottom: Platform.OS === 'ios' ? responsiveHeight(-30)  : responsiveHeight(-20),
  // position : 'absolute',
},modelViewUpi: {
  backgroundColor: Color.white,
  borderTopStartRadius: 20,
  borderTopEndRadius: 20,
  height: responsiveHeight(100),
  width: responsiveWidth(101),
  marginStart: -20,
  bottom: Platform.OS === 'ios' ? responsiveHeight(-50)  : responsiveHeight(-50),
  // position : 'absolute',
},
createTextArea:{height:responsiveHeight(14), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5,backgroundColor:Color.white,marginTop:responsiveHeight(1.2),fontSize:CustomFont.font14,color:Color.fontColor,padding:7,opacity:.7, textAlignVertical: 'top' },
createInputStyleMobile:{height:responsiveHeight(7), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5,backgroundColor:Color.white,marginTop:responsiveHeight(1.2),fontSize:CustomFont.font14,color:Color.fontColor,paddingLeft:10,paddingTop:responsiveHeight(2),opacity:.7 },
inputHeader:{fontFamily : CustomFont.fontName, fontSize:CustomFont.font12,color:Color.textItem,marginTop:responsiveHeight(1.6)},
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




container: {
  // flex: 1, 
  backgroundColor: Color.white
},
consult: {
  marginTop: responsiveWidth(4),
  fontSize: CustomFont.font12,
  color: Color.optiontext,
  fontFamily : CustomFont.fontName,
  fontWeight:CustomFont.fontWeight500
},
dropDownView: {
  height: 250,
  // zIndex: 10,
  marginTop: 4,
  marginBottom: 4,
},
dropDown: {
  height: responsiveHeight(7.5),
  marginBottom: 5
  // marginStart: responsiveWidth(2), 
  // marginEnd: responsiveWidth(2)
},
tagView: {
  flexDirection: 'row', margin: responsiveWidth(1.6), backgroundColor: Color.weekdaycellPink,
  height: responsiveHeight(5.5),
  borderRadius: responsiveHeight(3),
  // justifyContent: 'center',
  alignItems: 'center', borderColor: Color.weekdaycellPink, borderWidth: 1,
  paddingStart: responsiveWidth(3), paddingEnd: responsiveWidth(3),
  // paddingTop: responsiveHeight(1), paddingBottom: responsiveHeight(1)
},
rowView: {
  // marginStart: responsiveWidth(5),
  marginTop: 1,
  // marginEnd: 24,
  paddingTop: 5,
  paddingBottom: 5,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Color.primary,
  borderRadius: 5,
},
circle: {
  backgroundColor: 'transparent',
  height: responsiveHeight(1),
  width: responsiveHeight(1),
  borderRadius: responsiveHeight(.5),
},
qusTxt: {
  marginStart: 10,
  marginEnd: 10,
  color: Color.white,
  fontSize: CustomFont.font16,
  fontWeight: CustomFont.fontWeight400,
  fontFamily: CustomFont.fontName,
  flex: 1,
},
createInputStyle: { height: responsiveHeight(7), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.fontColor, paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0 },

// Modal
modelViewCamera: {
  backgroundColor: Color.white,
  borderRadius: 20,
  // borderTopEndRadius: 20,
  // paddingLeft: 10,
  // paddingRight: 10,
  // paddingTop: 30,
  // height: Platform.OS === 'ios' ? responsiveHeight(37) : responsiveHeight(40),
  alignSelf: 'center',
  // width: responsiveWidth(100),
  paddingBottom: responsiveHeight(10),
  marginStart: 20,
  marginEnd: 20,
  // bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-40),
  // position : 'absolute',
},
image: { height: 29, width: 36 },
imageView: {
  marginTop: 46, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
  height: 88, width: 88, borderRadius: 44, backgroundColor: Color.green
},
title: {fontFamily : CustomFont.fontName, marginTop: 33, fontSize: CustomFont.font16, color: Color.darkText, alignSelf: 'center' },
msg: {
  fontFamily : CustomFont.fontName,
  textAlign: 'center', marginStart: 37, marginEnd: 37, marginTop: 14, fontSize: CustomFont.font14,
  color: Color.feeText, alignSelf: 'center'
},

modelViewMessage: {
  backgroundColor: Color.white,
  borderTopStartRadius: 20,
  borderTopEndRadius: 20,
  height: responsiveHeight(50),
  width: responsiveWidth(101),
  marginStart: -20,
  bottom: Platform.OS === 'ios' ? responsiveHeight(-35)  : responsiveHeight(-35),
},

bsIcon: {
  marginStart: 10,
  marginEnd: 10,
},
closeIcon:{
  marginStart: 10,
  marginEnd: 20,
  marginTop : 10
},
iconView : {
  height:responsiveFontSize(4),width:responsiveFontSize(4),borderRadius:responsiveFontSize(2),backgroundColor:'#FF739a',
  justifyContent:'center',alignItems:'center',marginLeft:responsiveWidth(3)
},iconViewClose : {
  height:responsiveFontSize(4),width:responsiveFontSize(4),borderRadius:responsiveFontSize(2),backgroundColor:Color.lightGrayBg,
  justifyContent:'center',alignItems:'center',marginLeft:responsiveWidth(3)
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
});
export default styles;
