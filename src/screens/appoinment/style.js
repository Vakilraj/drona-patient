import { StyleSheet } from 'react-native';
import {
  responsiveFontSize, responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
const styles = StyleSheet.create({
  profileRoundImg: { width: responsiveWidth(10), height: responsiveWidth(10), borderRadius: responsiveWidth(6), backgroundColor: Color.selectedBackgroundColor, justifyContent: 'center', alignItems: 'center' },
  profileImg: { width: responsiveWidth(11), height: responsiveWidth(11), borderRadius: responsiveWidth(6), justifyContent: 'center', alignItems: 'center', resizeMode: 'cover' },
  phoneImg: { width: responsiveWidth(3), height: responsiveWidth(3), margin: 8, marginTop: 5, justifyContent: 'center', alignItems: 'center' },
  seperatorPatient: {
    height: 1,
    width: '100%',
    backgroundColor: Color.patientBackground,
  },
  addPost: {
    height: responsiveFontSize(5.5), width: responsiveFontSize(5.5), borderRadius: responsiveFontSize(3),
    alignItems: 'center', justifyContent: 'center'
  },
  modelView: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(85),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-36),
    // position : 'absolute',
  },
  modelViewRelation: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-30) : responsiveHeight(-20),
    // position : 'absolute',
  },
  createInputStyle: { height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.patientSearchAge, paddingLeft: 15, paddingRight: 10, paddingTop: 0, paddingBottom: 0, fontWeight: CustomFont.fontWeight400 },
  createInputStyle: { height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font16, color: Color.patientSearchAge, paddingLeft: 15, paddingRight: 10, paddingTop: 0, paddingBottom: 0, fontWeight: CustomFont.fontWeight400 },
  inputHeader: { fontSize: CustomFont.font12, color: Color.optiontext, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(2.2), fontWeight: '500' },
  inputHeaderTop: { fontSize: CustomFont.font12, color: Color.textGrey, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(1.0), fontWeight: '400' },
  inputHeaderTop1: { fontSize: CustomFont.font12, color: Color.optiontext, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(2.2), fontWeight: '700' },
  
  modelViewAddress: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    marginStart: -20,

    bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
    // position : 'absolute',
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
  // Camera Modal
  modelViewCamera: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 30,
    height: Platform.OS === 'ios' ? responsiveHeight(37) : responsiveHeight(40),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-40),
    // position : 'absolute',
  },

  rowHeading: {
    flexDirection: 'row',
    margin: 20,
  },

  modalHeadingCamera: {
    color: Color.fontColor,
    fontWeight: CustomFont.fontWeight500,
    fontSize: CustomFont.font16,
    fontFamily: CustomFont.fontFamily,
  },

  closeIcon: {
    marginStart: 10,
    marginEnd: 20,
    marginTop: 10
  },

  row1Camera: {
    marginTop: 24,
    flexDirection: 'row',
    marginStart: 20,
    marginEnd: 20,
    alignItems: 'center'
  },

  row2: {
    flexDirection: 'row',
    marginTop: 20,
    marginStart: 20,
    marginEnd: 20,
    alignItems: 'center'
  },
  rowTxt: {
    fontSize: CustomFont.font20,
    flex: 20,
    marginStart: 15,
    marginTop: Platform.OS === 'ios' ? 0 : -2,
    justifyContent: 'center',
    color: Color.feeText,
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
  iconView: {
    // flex: 1,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.weekdaycellPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    height: 18, width: 18,
  },
  imageIconCancel: {
    height: 30, width: 30,
  },
  iconViewCancel: {
    // flex: 1,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.mostLightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelViewDiscard: {
    backgroundColor: Color.white,
    borderRadius: 8,
     height: responsiveHeight(15),
    // width: responsiveWidth(80),
    marginLeft: responsiveWidth(5),
    marginRight: responsiveWidth(5),
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent:'center',
    alignItems:'center'

  },
  rowDiscard: {
    marginLeft: 20,
    marginRight: 10,

  }, modalHeading: {
    color: Color.fontColor,
    fontWeight: CustomFont.fontWeight500,
    fontSize: CustomFont.font16,
    fontFamily: CustomFont.fontName,
  },underlineStyle: {
    height: responsiveHeight(.7),
    backgroundColor: Color.primary,
    borderRadius:8,
    width:30,
    position:'absolute',
    bottom:0
  },

// Adhoc css
modelAdhoc: {
  backgroundColor: Color.white,
  borderTopStartRadius: 20,
  borderTopEndRadius: 20,
  height: responsiveHeight(65),
  width: responsiveWidth(101),
  marginStart: -20,
  bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
  // position : 'absolute',
},
modelViewAdditional: { margin: responsiveWidth(3) },
  modelMainTitle: { flex: 1, fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700 },
  
  crossIcon: {
    height: 14, width: 14
  },
  tiTitle: {
    fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(3)
  },
  modelTextInput1: {
    height: responsiveHeight(6), marginTop: responsiveHeight(1.3),padding: 0,
    paddingLeft: 16, paddingRight: 16,  fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font14, 
    marginBottom:responsiveWidth(3),
  },
  modalBtn: {
    alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6.5), backgroundColor: Color.primary, marginTop: responsiveHeight(4)
  },
  modalBtnTxt: {
    fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center'
  },
  
  adhocIcon: {
    height: 24, width: 24,
    marginRight:responsiveHeight(2),
  },
  

});
export default styles;
