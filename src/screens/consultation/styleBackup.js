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
  container: {
    flex: 1
  },
  modelView3dots: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(150),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: responsiveHeight(-35),
  },
  modelNoShow: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    //height: responsiveHeight(30),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: responsiveHeight(-38),
    // position : 'absolute',
  },
  modelViewAbout: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(120),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
    // position : 'absolute',
  },
  modelViewSeverity: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
    // position : 'absolute',
  },
  modelViewSignificant: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    //height: responsiveHeight(120),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
    // position : 'absolute',
  }, modelViewEducation: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-10),
    // position : 'absolute',
  },
  createInputStyleMobile: { height: responsiveHeight(7), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), fontSize: CustomFont.font14, color: Color.fontColor, paddingLeft: 10, paddingTop: responsiveHeight(2) },
  inputHeader: { fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(1.6) },
  modelViewMessage: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-13),
  },modelViewMessageMedicine: {
    flex:1,
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(120),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-13),
  },
  tagView: {
    flexDirection: 'row', margin: responsiveWidth(1.6),
    backgroundColor: Color.white,
    height: responsiveHeight(5.5),
    borderRadius: responsiveHeight(3),
    // justifyContent: 'center',
    alignItems: 'center', borderColor: Color.createInputBorder, borderWidth: 1,
    paddingStart: responsiveWidth(3), paddingEnd: responsiveWidth(3),
    // paddingTop: responsiveHeight(1), paddingBottom: responsiveHeight(1)
  },
  searchView: { flexDirection: 'row',  borderColor: Color.createInputBorder, borderWidth: .7, borderRadius: 5, alignItems: 'center',marginTop:responsiveHeight(1.8)},
  searchInput: { color:Color.optiontext, fontWeight:CustomFont.fontWeight400, 
    padding: 0, height: responsiveHeight(5.5), borderRadius: 5, paddingLeft: 7, paddingRight: 7,
    marginRight: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, flex: 1
  },
  crossSearch: {tintColor:Color.primary, height: responsiveHeight(2), width: responsiveHeight(2), borderRadius: responsiveHeight(1), alignSelf: 'center', marginEnd: 10 },
  selectedView: { flexDirection: 'row', margin: responsiveWidth(1.6), borderRadius: 5, borderWidth:.7,  backgroundColor: Color.selectedBgSymptom, borderColor:Color.primary  },
  unSelectView: { flexDirection: 'row', margin: responsiveWidth(1.6), height: responsiveWidth(10), borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Color.borderColor, },
  txtSelect: { margin: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.optiontext,fontWeight:CustomFont.fontWeight500,fontFamily:CustomFont.fontName },
  txtSelectMed: { marginLeft: responsiveWidth(2.5), marginRight: responsiveWidth(2.5), fontSize: CustomFont.font16, marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4) },
  crossSelected: {
    alignItems: 'center', justifyContent: 'center',
    height: 15, width: 15, borderRadius: 7.5, marginLeft: 5,
     marginRight: 7,marginTop:responsiveWidth(3)
  },
  crossSelectedMed: { alignItems: 'center', justifyContent: 'center', marginLeft: 10, },
  unselectView: {
    flexDirection: 'row', margin: responsiveWidth(1.6), height: responsiveFontSize(5), borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderColor: Color.createInputBorder, borderWidth: .7
  },
  unselectTxtColor: { marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.optiontext ,fontWeight:CustomFont.fontWeight400, fontFamily:CustomFont.fontName},
  doaseView: { width: responsiveWidth(13), borderWidth: 1, borderRadius: 5, borderColor: Color.borderColor, height: responsiveWidth(10), color: Color.darkText, fontSize: CustomFont.font12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  doaseViewSelect: {width: responsiveWidth(13), borderWidth: 1, borderRadius: 5, borderColor: Color.liveBg, height: responsiveWidth(10), color: Color.darkText, fontSize: CustomFont.font12, justifyContent: 'center', alignItems: 'center', marginRight: 10,backgroundColor:Color.genderSelection },
  //doaseViewSelect: { width: responsiveWidth(13), borderRadius: 5, height: responsiveWidth(10), fontSize: CustomFont.font13, justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: Color.primaryBlue },

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
  tagView1: {
    flexDirection: 'row', margin: responsiveWidth(1.6), backgroundColor: Color.weekdaycellPink,
    height: responsiveHeight(5.5),
    borderRadius: responsiveHeight(3),
    // justifyContent: 'center',
    alignItems: 'center', borderColor: Color.weekdaycellPink, borderWidth: 1,
    paddingStart: responsiveWidth(3), paddingEnd: responsiveWidth(3),
    // paddingTop: responsiveHeight(1), paddingBottom: responsiveHeight(1)
  },
  threedot_icons: {
    height: responsiveFontSize(5), width: responsiveFontSize(5)
  },
  modalTopDay: { width: responsiveWidth(22), height: responsiveHeight(6), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.white, borderRadius: 6, marginLeft: 10, marginRight: 10,borderWidth:1 },
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
   cancelAppointmentModelView: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: responsiveHeight(-10),
    position : 'absolute',
  }, modelViewNote: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
    // position : 'absolute',
  },
  durationAndroid: { flexDirection: 'row', marginTop: responsiveHeight(1.6), alignItems: 'center',zIndex:99 },
  durationIos: { flexDirection: 'row', marginTop: responsiveHeight(1.6), alignItems: 'center',zIndex:99 },
  modelView1: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingTop: 30,
    height: responsiveHeight(62),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: responsiveHeight(-20),
    paddingBottom : responsiveHeight(11)
},
modalHeading: {
    flex: 1,
    color: Color.black,
    fontWeight: CustomFont.fontWeight600,
    fontSize: CustomFont.font16,
    fontFamily: CustomFont.fontName,
},

preview: {
  width: 80,
  height: 80,
  borderRadius: 5,
  marginStart: responsiveWidth(2),
  // backgroundColor: Color.primary,
  alignItems: 'center',
  opacity: 1

},
previewadd: {
  width: 120,
  height: 40,
  borderRadius: 5,
  marginStart: 10,
  marginTop: 10,
  flexDirection: 'row',
  // backgroundColor: Color.primary,
  alignItems: 'center',
  paddingStart: 10,
  // justifyContent: 'center',
  opacity: 1,
  borderColor: Color.primary,
  borderWidth: 1,
  borderStyle: 'dashed',
},
add: {
  color: Color.primary,
  alignSelf: 'center',
  fontWeight: CustomFont.fontWeight600,
  fontSize: CustomFont.font14,
  marginTop: 6,
  fontFamily: CustomFont.fontName,
},
imgcross: {
  height: 24,
  borderRadius: 12,
  backgroundColor: Color.primary,
  justifyContent: 'center',
  alignItems: 'center',
  width: 24,
  right: 0,
  top: 0,
  position: 'absolute'
},
modelView: {
  backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    //height: responsiveHeight(50),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-45),
},
rowShare: {
  flexDirection: 'row',
  marginStart: responsiveWidth(5.5),
  marginEnd: 16,
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 16,
  height: responsiveHeight(5)
},
divider: {
  height: 1, backgroundColor: Color.primaryBlue, opacity: 0.1
},
btn: {
  alignItems: 'center', height: responsiveHeight(5),
  flexDirection: 'row',
},
crossbtn: {
  // alignItems: 'center', justifyContent: 'center',
  height: 14,
  width: 14
},
optiontxt: {
  marginLeft: 16,
  fontFamily: CustomFont.fontName,
  fontSize: CustomFont.font14,
  fontWeight: '700',
  color: Color.black

},
optionimg: { resizeMode: 'contain', height: 40, width: 40 },
closeIcon: {
  width: 14,
  height: 14,
},
createInputStyle:{borderRadius:4, borderWidth:1,height:responsiveHeight(6),paddingLeft:responsiveWidth(3),paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:CustomFont.font16,marginTop:responsiveHeight(1.8),color: Color.fontColor },
underlineStyle: {
  height: responsiveHeight(.7),
  backgroundColor: Color.primary,
  borderRadius:8,
  width:30,
  position:'absolute',
  bottom:0
},

modelViewAddTreatment: {
  backgroundColor: Color.white,
  borderTopStartRadius: 20,
  borderTopEndRadius: 20,
  height: responsiveHeight(120),
  width: responsiveWidth(101),
  marginStart: -20,
  bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
  // position : 'absolute',
},


optionButton: {
  justifyContent: "center",
  alignItems: "center",
  marginTop:responsiveHeight(2),
  marginBottom:responsiveHeight(4),
},
addtxt: {
  flex: 1,
  fontFamily: CustomFont.fontName,
  fontSize: CustomFont.font18,
  color: Color.black,
  fontWeight: '700',
},
modelViewffff: {
  backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(135),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-45),
},
compMessage:
{
  fontFamily: CustomFont.fontName,
  fontSize: CustomFont.font14,
  color: Color.black,
  fontWeight: '500',
  lineHeight:24,
  textAlign:'center',
},
compIcon:
{
  alignItems: 'center',
  marginTop:responsiveHeight(2),
  marginBottom:responsiveHeight(2)
},
markComp:
{
  marginTop: responsiveHeight(8.5),
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Color.primary,
  height: responsiveHeight(6),
  marginBottom: responsiveHeight(2)
},
markCancel:
{ 
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Color.lightPurple,
  height: responsiveHeight(6),
  marginBottom: responsiveHeight(20) 
},


card:{
  backgroundColor : Color.white, 
  borderBottomLeftRadius : 10,
  borderBottomRightRadius : 10,
  height : responsiveHeight(20) ,
  paddingLeft : responsiveHeight(2),
  paddingRight : responsiveHeight(2),
  },
  cardExpand:{
    backgroundColor : Color.white, 
    borderBottomLeftRadius : 10,
    borderBottomRightRadius : 10,
   // height : responsiveHeight(20) ,
    paddingLeft : responsiveHeight(2),
    paddingRight : responsiveHeight(2),
    paddingBottom :responsiveHeight(2), 
    },
  cardHeaderView:{
    backgroundColor : Color.white, 
    borderTopLeftRadius : 10,
    borderTopRightRadius : 10,
    paddingLeft : responsiveHeight(2),
    paddingRight : responsiveHeight(2),
    paddingTop : responsiveHeight(2),
    paddingBottom : responsiveHeight(2),
    },
  bottomCard : {
  backgroundColor : Color.white, 
  borderTopLeftRadius : 10,
  borderTopRightRadius : 10,
  height : responsiveHeight(12),
  position :'absolute',
  bottom : 0,
  alignItems : 'center',
  width : responsiveWidth(100),
  padding : responsiveHeight(2),

  flexDirection : 'row'
  },
  tripledotbtn :{
    width : responsiveHeight(6), 
    height : responsiveHeight(6),
    backgroundColor : Color.lightBackground,
    alignItems : 'center',
    justifyContent : 'center',
    borderRadius : 6,
  
  },
  cnbtn :{
    width : responsiveWidth(76), 
    height : responsiveHeight(6),
    marginLeft : responsiveWidth(3),
    backgroundColor : Color.primary,
    alignItems : 'center',
    justifyContent : 'center',
    borderRadius : 6,
  },
  tripledottext :{
    fontSize : CustomFont.font16, 
    fontWeight : CustomFont.fontWeightBold, 
    alignSelf : 'center'
  },
  consulttext :{
    fontSize : CustomFont.font16, 
    color : Color.white,
    fontWeight : CustomFont.fontWeightBold, 
    alignSelf : 'center'
  }
});
export default styles;
