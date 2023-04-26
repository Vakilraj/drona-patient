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
    flex: 1, backgroundColor: Color.white
  },
  modelViewAbout: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(65),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
    // position : 'absolute',
  },
  modelViewEducation: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-10),
    // position : 'absolute',
  },
  createInputStyle: { height: responsiveHeight(7), borderColor: Color.newBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.yrColor, paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0 },
  createInputStyleMobile: { height: responsiveHeight(7), borderColor: Color.newBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.grayTxt, paddingLeft: 10, paddingTop: responsiveHeight(2) },
  inputHeader: { fontSize: CustomFont.font12, color: Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, marginTop: responsiveHeight(1.6) },
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

  //BasicInfo
  mainTitle: {
    fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, color: Color.yrColor
  },
  profileTitle: {
    fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12,
    color: Color.optiontext, marginTop: responsiveHeight(3)
  },
  profileTxt: {
    fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14,
    color: Color.yrColor
  },

  //edit basic info
  //AdditionalInfo
  cardAdditional: { marginTop: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 4,backgroundColor:Color.white },
  down: { width: 10, height: 5.63, padding: 0 },
  editIcon: { height: 12, width: 12, },
  additionalTitle: {  marginStart: 7, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, color: Color.yrColor
  },
  editView: {
    flexDirection: 'row', alignItems: 'center'
  },
  addEditTxt: {
    marginStart: 8, color: Color.primary, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600
  },
  additionalDivider: {
    height: 1, backgroundColor: Color.primary, opacity: 0.1, marginTop: 16
  },
  additionalTxt: {
    fontSize: CustomFont.font14, color: Color.yrColor, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, marginTop: responsiveHeight(1.6),
  },
  subAdditionalTxt: {
    fontSize: CustomFont.font14, color: Color.yrColor, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, marginTop: 6,
  },
  itemSelectedView: {
    flexDirection: 'row', margin: responsiveWidth(1.6), height: responsiveHeight(5.5), borderRadius: responsiveHeight(1), justifyContent: 'center', alignItems: 'center', borderColor: Color.createInputBorder, borderWidth: 0, backgroundColor: Color.statusBarNewColor
  },
  itemSelectedTxt: {
    marginLeft: responsiveWidth(3), marginRight: responsiveWidth(1.5), fontSize: CustomFont.font14, color: Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500
  },
  modelViewAdditional: { margin: responsiveWidth(3) },
  modelMainTitle: { flex: 1, fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700 },
  modelTextInput: {
    padding: 16, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, borderWidth: 1, height: responsiveHeight(30), fontSize: CustomFont.font14, borderRadius: 5, textAlignVertical: 'top', color: Color.yrColor, marginTop: 10
  },
  itemSelectModelView: {
    flexDirection: 'row', margin: responsiveWidth(1.6), height: responsiveHeight(5.5), borderRadius: responsiveHeight(1), justifyContent: 'center', alignItems: 'center', borderColor: Color.weekdaycellPink, borderWidth: 1, backgroundColor: Color.goldPink
  },
  crossIcon: {
    width: 17, height: 17,resizeMode:'contain'
  },
  sugeTxt: {
    fontSize: CustomFont.font14, color: Color.yrColor, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, marginTop: responsiveHeight(4), marginBottom: 15
  },
  modalBtn: {
    alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6.5), backgroundColor: Color.primary, marginTop: responsiveHeight(4)
  },
  modalBtnTxt: {
    fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center'
  },
  tiTitle: {
    fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(3)
  },
  modelTextInput1: {
    height: responsiveHeight(6), marginTop: responsiveHeight(1.3),padding: 0,
    paddingLeft: 16, paddingRight: 16,  fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, borderWidth: 1, fontSize: CustomFont.font14, borderRadius: 5, color: Color.yrColor, 
  },
  createInputStylefname: { height: responsiveHeight(7), borderColor: Color.newBorder, borderWidth: 1, borderTopRightRadius: 5,borderBottomRightRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.yrColor, paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0 },
});
export default styles;
