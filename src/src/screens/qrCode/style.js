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
    flex: 1, backgroundColor: Color.newBgColor
  },
  safeArea: { flex: 1, backgroundColor: Color.lightBackground },
  mainView: {
    flex: 1, alignItems: 'center'
  },

  seperator: {
    height: 0.7,
    width: '100%',
    backgroundColor: Color.lightgray,
  }, editBtn: { width: responsiveWidth(25), justifyContent: 'center', alignItems: 'center', borderRadius: responsiveWidth(8), borderColor: Color.white, borderWidth: 1, flexDirection: 'row' },
  shareBtn: { width: responsiveWidth(30), justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: Color.yelllowHome, marginLeft: 10, flexDirection: 'row' },
  profileRoundImg: { width: responsiveWidth(10), height: responsiveWidth(10), borderRadius: responsiveWidth(6), backgroundColor: '#EEE8FB', justifyContent: 'center', alignItems: 'center' },
  profileRoundImgCommunity: { width: 40, height: 40, borderRadius: 20, backgroundColor: Color.lightPurple, justifyContent: 'center', alignItems: 'center' },
  contentSubDivision: {
    width: responsiveWidth(90),
    height: responsiveHeight(18),
    borderRadius: 12,
    margin: responsiveWidth(2),
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSubDivision1: {
    width: responsiveWidth(45),
    height: responsiveHeight(17),
    borderTopLeftRadius: 12,
    marginLeft: responsiveWidth(2),
    //marginRight: responsiveWidth(1),
    marginTop: responsiveWidth(2),
    backgroundColor: Color.newBgColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSubDivision2: {
    width: responsiveWidth(45),
    height: responsiveHeight(17),
    borderTopRightRadius: 12,
    marginTop: responsiveWidth(2),
    backgroundColor: Color.newBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(2),
    //marginLeft: responsiveWidth(1),
  },
  contentSubDivision3: {
    width: responsiveWidth(45),
    height: responsiveHeight(17),
    borderBottomLeftRadius: 12,
    marginLeft: responsiveWidth(2),
    //marginRight: responsiveWidth(1),
    marginTop: responsiveWidth(0.8),
    backgroundColor: Color.newBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(2),
  },
  contentSubDivision4: {
    width: responsiveWidth(45),
    height: responsiveHeight(17),
    borderBottomRightRadius: 12,
    marginTop: responsiveWidth(0.8),
    backgroundColor: Color.newBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(2),
   // marginLeft: responsiveWidth(1),
  },

  subdivision: {
    flexDirection: 'row',
    height: responsiveHeight(15),
    borderRadius: 12,
    margin: responsiveWidth(2),
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subdivision2: {
    
    justifyContent: 'center',
    height: responsiveHeight(20),
    borderRadius: 12,
    margin: responsiveWidth(2),
    backgroundColor: Color.white,
   
  },
  inside1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  knowledgeCenterTab: {
    width: responsiveWidth(44),
    height: responsiveHeight(15), alignItems: 'center', flexDirection: 'column', justifyContent: 'center',
    borderRadius: 5,
  },
  shareRoundImg: { width: responsiveWidth(8), height: responsiveWidth(8), borderRadius: responsiveWidth(8) },
  seperatorPatient: {
    height: 1.5,
    //width: '100%',
    backgroundColor: Color.patientBackground
  },
  addPost: {
    height: responsiveFontSize(7),
    width: responsiveFontSize(7),
    borderRadius: responsiveFontSize(5),
    backgroundColor: Color.primary,
    position: 'absolute',
    bottom: responsiveHeight(2),
    right: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:999,
    borderStyle:'solid',
    borderWidth:8,
    borderColor:'#E0E0E0',
  },
  tabBarTextStyle: {
    fontSize: CustomFont.font12,
    color: Color.optiontext,
    fontWeight:'600',
    fontFamily: CustomFont.fontName
  },

  tabStyle: {},
  scrollStyle: {
    backgroundColor: 'white',
    paddingLeft: 65,
    paddingRight: 65,
    // justifyContent: 'center',
  },
  underlineStyle: {
    height: responsiveHeight(.7),
    backgroundColor: Color.primary,
    borderRadius:8,
    width:30,
    position:'absolute',
    bottom:0
  },
  modelView: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 30,
    height: responsiveHeight(60),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-40),
    // position : 'absolute',
  },

  modelViewMessage: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-10),
  }, modelMessageChoose: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: responsiveHeight(-60),
  },
  resetModal: {
    backgroundColor: Color.white,
    height: responsiveHeight(28),
    width: responsiveWidth(94),
    marginStart: responsiveWidth(-2),
    borderRadius : 5,
    paddingTop : 20,
    paddingLeft  :15,
    paddingRight : 15,
    paddingBottom:20
  },
  divider :{marginTop : responsiveHeight(2), height : .25, backgroundColor : 'gray', width : responsiveWidth(100)},

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
  createInputStyle: { height: responsiveHeight(7), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.fontColor, paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0 },
  arrowForbigTxt:{height:responsiveFontSize(1.6),width:responsiveFontSize(1.6),resizeMode:'contain'},
  arrowForsmallTxt:{height:responsiveFontSize(1.6),width:responsiveFontSize(1.6),resizeMode:'contain'},
  iconViewPop : {
    height:responsiveFontSize(4),width:responsiveFontSize(4),borderRadius:responsiveFontSize(2),
    justifyContent:'center',alignItems:'center',marginLeft:responsiveWidth(5.5)
  },
  crossIcon: {
    height: 14, width: 14
  },
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
  removeText :{
    fontFamily  :CustomFont.fontName,
    fontSize  :CustomFont.font20,
    fontWeight  :CustomFont.fontWeight700
  },
  delMsg  :{
    fontFamily  :CustomFont.fontName,
    fontSize  :CustomFont.font14,
    fontWeight  :CustomFont.fontWeight400,
    
  },
  cancelremovetxt :{
    fontFamily  :CustomFont.fontName, fontSize : CustomFont.font14
  }
});
export default styles;
