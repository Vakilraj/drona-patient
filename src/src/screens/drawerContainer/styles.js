// eslint-disable-next-line prettier/prettier
import { StyleSheet, Platform } from 'react-native';
import Color from './../../components/Colors';
import CustomFont from './../../components/CustomFont';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Color.white,minHeight:responsiveHeight(98)
  },
  viewHeader: {
    backgroundColor: Color.lightPurple,
    flex: 1.3, flexDirection: 'row', paddingTop: Platform.OS === 'ios' ? responsiveHeight(7) : responsiveHeight(1.6)
  },
  viewBody: {
    flex: 7, marginTop: responsiveHeight(1.6)
  },
  viewFooter: {
    flex: 3, justifyContent: 'flex-end', marginBottom: responsiveHeight(2)
  },
  listItemView: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? responsiveHeight(5.5) : responsiveHeight(8),
    alignItems: 'center',
  },
  menuImage: {
    height: responsiveFontSize(2.5),
    width: responsiveFontSize(2.5),
    marginLeft: Platform.OS === 'ios' ? responsiveWidth(6) : responsiveWidth(5),
    resizeMode: 'contain',
  },
  menuIcon: {
    height: responsiveFontSize(4),
    width: responsiveFontSize(4),
    marginLeft: Platform.OS === 'ios' ? responsiveWidth(6) : responsiveWidth(5),
    color: Color.white
  },
  txtMenu: {
    fontSize: CustomFont.font14,
    fontWeight: '700',
    fontFamily: CustomFont.fontName,
    color: Color.yrColor,
    marginLeft: Platform.OS === 'ios' ? responsiveWidth(5) : responsiveWidth(4),
    paddingTop: Platform.OS === 'ios' ? 7 : 0,
  },
  drNameTxt: {
    fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700,
    color: Color.yrColor, fontFamily: CustomFont.fontName,
    marginTop: responsiveHeight(.8),
    textTransform: 'capitalize',
  },
  splTxt: {
    fontSize: CustomFont.font12, color: Color.datecolor,
    fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500,
  },
  footerImg: {
    height: responsiveHeight(7),
    width: responsiveHeight(7),
    resizeMode: 'contain',

  },
  headerviewBorder: {
    alignItems: 'center',
    borderWidth: .5,
    borderColor: Color.lightgray,
    marginTop: Platform.OS === 'ios' ? responsiveHeight(15.8) : responsiveHeight(8),
    width: Platform.OS === 'ios' ? responsiveWidth(48) : responsiveWidth(49),
    borderRadius: 5,
  },
  dueMonthView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    marginBottom: Platform.OS === 'ios' ? 40 : 20
  },
  menuHeaderImgFile: {
    height: responsiveHeight(4),
    width: responsiveWidth(60),
    resizeMode: 'contain',
    marginTop: Platform.OS === 'ios' ? responsiveHeight(2.5) : responsiveHeight(2),
  },
  txtPolicy: {
    fontSize: responsiveFontSize(2.5),
    marginTop: responsiveHeight(0.7),
    color: Color.black,
    fontFamily: 'Gotham-Book'
  },
  txthNumber: {
    fontSize: responsiveFontSize(1.8),
    marginTop: Platform.OS === 'ios' ? 4 : 5,
    color: Color.grayNew,
    fontFamily: 'Gotham-Book'
  },
  txthNumberDue: {
    fontSize: responsiveFontSize(1.8),
    marginTop: Platform.OS === 'ios' ? 4 : -1,
    color: Color.black,
    fontFamily: 'Gotham-Book'
  },
  dueInMonthImg: {
    height: responsiveWidth(4),
    width: responsiveWidth(4),
    resizeMode: 'contain',
    marginRight: 6,
  },
  divider: {
    backgroundColor: Color.dividerDrawer,
    height: 1,
  }
});

export default styles;
