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
  weekdaycell: { borderRadius: 4, height: responsiveHeight(7), width: responsiveWidth(11.6), justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(1), marginLeft: responsiveWidth(1) },
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
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-45),
    // position : 'absolute',
  },
  iconView: {
    height: responsiveFontSize(4), width: responsiveFontSize(4), borderRadius: responsiveFontSize(2),
    justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(5)
  },
  contactModelView: {
    backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 30,
    height: responsiveHeight(35),
    width: responsiveWidth(100),
    marginStart: -20,
    bottom: responsiveHeight(-5),
    position: 'absolute',
  },
  yesNoStyle: { height: responsiveHeight(5), width: responsiveWidth(18), borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.cancelButtonBg, margin: responsiveWidth(3), marginRight: 0 }
});

export default styles;
