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
  getstartedTxt:{fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font24, marginTop: 10, fontWeight: 'bold',color:Color.fontColor },
  inputlabel:{fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginTop: responsiveHeight(6), color:Color.fontColor},
  inputStyle:{borderRadius:4,borderColor:Color.blueBorder,borderWidth:1,height:responsiveHeight(6),paddingLeft:10,paddingRight:20,paddingTop:2,paddingBottom:2,fontSize:CustomFont.font14,color:Color.fontColor},
  continueBtn:{height: responsiveHeight(6), backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', borderRadius: 5,marginTop:responsiveHeight(3) },
  googleLogin:{height: responsiveHeight(6), alignItems: 'center', justifyContent: 'center', borderRadius: 5,marginTop:responsiveHeight(3),flexDirection:'row',backgroundColor:Color.googleLoginBtn },
});
export default styles;
