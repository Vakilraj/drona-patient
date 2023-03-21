import { Platform, StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,} from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
const styles = StyleSheet.create({
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
 
});
export default styles;
