import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
const styles = StyleSheet.create({
  mainView:{
    flex:1,alignItems:'center',
  },
  getstartedTxt:{fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font24, fontWeight: 'bold',marginTop:responsiveHeight(3),color:Color.fontColor },
  labelStyle:{fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor,marginTop:responsiveHeight(2.4) },
  labelStyleReg:{fontWeight:'bold', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor,marginTop:responsiveHeight(3) },
  createInputStyle:{borderRadius:4,borderColor:Color.createInputBorder,borderWidth:1,height:responsiveHeight(6),paddingLeft:responsiveWidth(3),paddingRight:10,paddingTop:2,paddingBottom:2,fontSize:CustomFont.font16,marginTop:responsiveHeight(1.8),color: Color.fontColor,zIndex:99},
  signUpBtn:{height: responsiveHeight(6), backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', borderRadius: 5,marginTop:responsiveHeight(10),marginBottom:responsiveHeight(4) },
  otpInput:{width:responsiveWidth(14), borderRadius:4,borderColor:Color.otpInputBorder,borderWidth:1,height:responsiveHeight(8.5),padding:0,fontSize:CustomFont.font16,color: Color.fontColor,textAlign:'center'},

  step2Btn:{flex:1,height: responsiveHeight(6.8), backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', borderRadius: 5,marginLeft:10 },
  setupTimings:{width:responsiveWidth(40), height: responsiveHeight(6.5), backgroundColor: Color.setupTimingsBtn, alignItems: 'center', justifyContent: 'center', borderRadius: 5,marginTop:responsiveHeight(4),marginBottom:10},
  importPatient:{flex:1, height: responsiveHeight(6.5), borderWidth:1,borderColor: Color.createInputBorder, alignItems: 'center', justifyContent: 'center', borderRadius: 4},







  //previous backup
  formstyle:{marginLeft:10,marginRight:20,marginTop:-10},
  commonFont:{fontSize:responsiveFontSize(1.9),marginTop:14},
  mobileNumberOtp:{fontSize:responsiveFontSize(1.9),marginTop:responsiveHeight(1),fontWeight:'bold'},
  formSubmit:{height: responsiveHeight(5.9), backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(3.6),},
  regMain:{marginLeft:15,marginRight:15},
  inputView:{ flexDirection: 'row', height: 40 },
  inputStyle:{borderRadius:4,borderColor:Color.blueBorder,borderWidth:1,height:responsiveHeight(6),paddingLeft:10,paddingRight:20,paddingTop:2,paddingBottom:2,fontSize:CustomFont.font14,color:Color.fontColor, },
  inputDateField:{ color: Color.black, borderBottomWidth: 1, borderBottomColor: Color.primary, width: '100%',fontSize:responsiveFontSize(2),height:36 ,margin:0,padding:0},
  titleInput:{ marginTop: 10,fontSize:responsiveFontSize(2) },
  optHeader:{ marginTop: 10,fontSize:responsiveFontSize(2.6),fontWeight:'bold'  },
  SubHeader:{ marginTop: 10,fontSize:responsiveFontSize(2.2),fontWeight:'bold'},
  resendOtp:{fontWeight:'bold',fontSize:responsiveFontSize(1.7),color:Color.primary,marginLeft:responsiveWidth(4.7)},
  checkbox:{alignSelf:'center',color:Color.primary,marginLeft:responsiveWidth(4),marginRight:responsiveWidth(1.5),},
  checkBoxView:{flexDirection:'row',width:responsiveWidth(100),marginTop:responsiveHeight(4)},
  sinupBtn:{ width: responsiveWidth(90), height: responsiveHeight(5.9), alignItems: 'center', justifyContent: 'center', borderRadius: 3, marginTop: responsiveHeight(40)},
  explorImg:{ width: responsiveWidth(100), height: responsiveHeight(42)},
  inputPromo:{ color: Color.black, width: '100%',fontSize:responsiveFontSize(2),height:responsiveHeight(5),margin:0,padding:0,paddingLeft:10,paddingRight:10},
  becomeamember:{ height: responsiveHeight(6), width:'100%', alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: Color.primary,marginTop:responsiveHeight(2.5)  },
  restore:{height: responsiveHeight(6.8),width:'100%', alignItems: 'center', justifyContent: 'center',},
  modelViewMessage: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: responsiveHeight(60),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: responsiveHeight(-25),
  },
  searchInput:{padding: 0, height: responsiveHeight(6), borderRadius: 5, paddingLeft: 7, paddingRight: 7, marginLeft: responsiveWidth(5),
    marginRight: responsiveWidth(7), fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, color:Color.fontColor,borderColor:Color.createInputBorder,borderWidth:1,marginTop:responsiveHeight(1.6)
  },
  modelView: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 30,
    height: responsiveHeight(45),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42)  : responsiveHeight(-45),
    // position : 'absolute',
},
iconView : {
  height:responsiveFontSize(4),width:responsiveFontSize(4),borderRadius:responsiveFontSize(2),
  justifyContent:'center',alignItems:'center',marginLeft:responsiveWidth(5)
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

});
export default styles;
