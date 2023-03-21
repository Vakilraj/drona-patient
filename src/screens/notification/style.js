import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightBackground,
  },
  safeArea: { flex: 1, backgroundColor: Color.lightBackground },

  
});
export default styles;
