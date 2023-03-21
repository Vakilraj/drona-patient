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
  container: {
    flex: 1
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
addtxt: {
  flex: 1,
  fontFamily: CustomFont.fontName,
  fontSize: CustomFont.font18,
  color: Color.black,
  fontWeight: '700',
},
modelView: {
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
  marginTop: responsiveHeight(3.5),
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Color.primary,
  height: responsiveHeight(6),
  marginBottom: responsiveHeight(3)
},
markCancel:
{ 
  marginTop: responsiveHeight(.5),
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Color.lightPurple,
  height: responsiveHeight(6),
  marginBottom: responsiveHeight(20) 
}

});
export default styles;
