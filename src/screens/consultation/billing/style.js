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

  modelViewAbout: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-20)  : responsiveHeight(-20),
    // position : 'absolute',
  },
  searchView:{ flexDirection: 'row', backgroundColor: Color.white,  borderColor: Color.grayBorder, borderWidth: 1, borderRadius: 5,alignItems:'center',margin:5},
  searchInput:{padding: 0, height: responsiveHeight(6), borderRadius: 5, paddingLeft: 7, paddingRight: 7, marginLeft: responsiveWidth(1),
    marginRight: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, flex: 1,color:Color.fontColor
  },
  crossSearch:{ height: responsiveHeight(2.5), width: responsiveHeight(2.5), borderRadius: responsiveHeight(1), alignSelf: 'center', marginEnd: 10 },
  selectedView:{ flexDirection: 'row', margin: responsiveWidth(1.6), height: responsiveWidth(9), borderRadius: responsiveHeight(3), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary  },
  unSelectView:{ flexDirection: 'row', margin: responsiveWidth(1.6), height: responsiveWidth(9), borderRadius: responsiveHeight(3), justifyContent: 'center', alignItems: 'center',  borderWidth: 1, borderRadius: 18, borderColor: Color.createInputBorder,  },
  txtSelect:{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(1.5), fontSize: CustomFont.font14, color: Color.white },
  txtSelectMed:{ marginLeft: responsiveWidth(2.5), marginRight: responsiveWidth(2.5), fontSize: CustomFont.font16,marginLeft:responsiveWidth(4),marginRight:responsiveWidth(4) },
  crossSelected:{ alignItems: 'center', justifyContent: 'center',
    height: 15, width: 15, borderRadius: 7.5, marginLeft: 5,
    backgroundColor: Color.white,marginRight:7 },
    unselectView:{  flexDirection: 'row', margin: responsiveWidth(1.6), height: responsiveFontSize(4), borderRadius: responsiveHeight(3), justifyContent: 'center', alignItems: 'center', borderColor: Color.createInputBorder, borderWidth: 1
  },
  unselectTxtColor:{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor },
  weekdaycell: { borderRadius: 4, height: responsiveHeight(7), width: responsiveWidth(11.6), justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(1), marginLeft: responsiveWidth(1) },
  modalTopDay: { width: responsiveWidth(23), height: responsiveHeight(5), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.calendarTopButtonColor, borderRadius: 10, marginLeft: 10, marginRight: 10 },
  createInputStylefornewClinic: {
    borderRadius: 4, borderColor: Color.createInputBorder, borderWidth: 1, height: responsiveHeight(7),
    paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), color: Color.fontColor, backgroundColor: Color.white
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
  createTextArea: { height: responsiveHeight(14), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.fontColor, padding: 7, opacity: .7, textAlignVertical: 'top' },
  createInputStyleMobile: { height: responsiveHeight(7), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.fontColor, paddingLeft: 10, paddingTop: responsiveHeight(2), opacity: .7 },
  inputHeader: { fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(1.6) },
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
    marginTop: 12,
    fontSize: CustomFont.font12,
    color: Color.fontColor,
  },
  dropDownView: {
    height: 250,
    // zIndex: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  dropDown: {
    height: responsiveHeight(7),
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
    fontFamily: CustomFont.fontFamily,
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
  title: { marginTop: 33, fontSize: CustomFont.font16, color: Color.darkText, alignSelf: 'center' },
  msg: {
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
    bottom: Platform.OS === 'ios' ? responsiveHeight(-35) : responsiveHeight(-35),
  },

  bsIcon: {
    marginStart: 10,
    marginEnd: 10,
  },
  closeIcon: {
    marginStart: 10,
    marginEnd: 20,
    marginTop: 10
  },
  iconView: {
    height: responsiveFontSize(4), width: responsiveFontSize(4), borderRadius: responsiveFontSize(2), backgroundColor: '#FF739a',
    justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3)
  }, iconViewClose: {
    height: responsiveFontSize(4), width: responsiveFontSize(4), borderRadius: responsiveFontSize(2), backgroundColor: Color.lightGrayBg,
    justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3)
  },

  safeArea: { flex: 1, backgroundColor: Color.lightBackground },
  mainView: {
    flex: 1, alignItems: 'center'
  },
  modelViewMessage1: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(120),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-13),
  },
  titleTop: {
    color: Color.text1, fontSize: CustomFont.font14, fontWeight:CustomFont.fontWeight500,fontFamily:CustomFont.fontName
  },
  titleBottom: {
    color: Color.text1, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName,fontWeight:CustomFont.fontWeight700
  },
  textTitle: { marginTop: 20, fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: Color.textItem },
  modelViewMessage2: {
    backgroundColor: Color.white,
    borderRadius: 20,
    // height: responsiveHeight(50),
    width: responsiveWidth(80),
    marginStart: 17,
    paddingStart: responsiveWidth(10),
    paddingEnd: responsiveWidth(10),
    alignItems: 'center',
    bottom: Platform.OS === 'ios' ? responsiveHeight(0) : responsiveHeight(0),
  },
  modelViewMore: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(40),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-13),
  },
});
export default styles;
