import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Color from './Colors';
import CustomFont from './CustomFont';
const styles = StyleSheet.create({
    loaderStyle: {
        position : 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        
      },
      pleaseWait: {
        position : 'absolute',
        left: responsiveWidth(38),
        right: responsiveWidth(30),
        top: responsiveHeight(53),
        color : Color.primary,
      },
      container: {
        flex: 1,
        backgroundColor: Color.newBgColor,
      },containerlightBg: {
        flex: 1,
        backgroundColor: Color.bgColor,
      },
      safeArea: {
        flex: 1, 
        backgroundColor: Color.white
      },

      modelViewBrowse: {
        backgroundColor: Color.white,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        width: responsiveWidth(101),
        marginStart: -20,
        bottom: responsiveHeight(-40),
      },addtxt: {
           flex: 1,
           fontFamily: CustomFont.fontName,
           fontSize: CustomFont.font18,
           color: Color.black,
           fontWeight: '700',
       },crossbtn: {
           // alignItems: 'center', justifyContent: 'center',
           height: 14,
           width: 14
       }, closeIcon: {
           width: 14,
           height: 14,
       }, divider: {
           height: 1, backgroundColor: Color.primaryBlue, opacity: 0.1
       },rowShare: {
           flexDirection: 'row',
           marginStart: responsiveWidth(5.5),
           marginEnd: 16,
           alignItems: 'center',
           marginTop: 16,
           marginBottom: 16,
           height: responsiveHeight(5)
       },	btn: {
           alignItems: 'center', height: responsiveHeight(5),
           flexDirection: 'row',
       },optionimg: { resizeMode: 'contain', height: 40, width: 40 },optiontxt: {
           marginLeft: 16,
           fontFamily: CustomFont.fontName,
           fontSize: CustomFont.font14,
           fontWeight: '700',
           color: Color.black
    
       },divider: {
           height: 1, backgroundColor: Color.primaryBlue, opacity: 0.1
       },
       customFontStyle: {
        fontSize: CustomFont.font16,
        marginLeft: responsiveWidth(2),
        color: '#292B2C', 
        fontWeight:CustomFont.fontWeight400,
        lineHeight: 30,
        fontFamily:CustomFont.fontName
      }
});
export default styles;
