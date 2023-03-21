import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Color.patientBackground
  },
  containerAndroid: {
    flex: 1,backgroundColor: Color.patientBackground,minHeight:responsiveHeight(82)
  },
  headerTxt: {
    color: Color.white,
    fontFamily: CustomFont.fontName,
    fontSize: CustomFont.font16,
  },
  ecard: {
    justifyContent: 'center',
    // marginLeft: responsiveWidth(-2),
    height: responsiveHeight(22),
    alignItems: 'center',
    justifyContent: 'center',

    // width : responsiveWidth(80),
    // backgroundColor : 'red'
    width: responsiveWidth(70),
  },
  fea: {
    fontFamily: CustomFont.fontName,
    fontSize: CustomFont.font16,
    color: Color.fontColor,
    marginTop: responsiveHeight(1.3),
    fontWeight: CustomFont.fontWeight700,
    marginBottom: responsiveHeight(1),
    // marginLeft : responsiveWidth(0),
    textAlign: 'center'
  },
  img: {
    height:
      responsiveHeight(22),
    width: responsiveWidth(80),
    borderRadius: 10,

  },
  rowView: {
    marginStart: 5,
    marginTop: 1,
    // marginEnd: 24,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.ecardBack,
    borderRadius: 20,
    // alignItems : 'center'
  },
  lRowView: {

    justifyContent: 'flex-start',
    height: responsiveHeight(15),
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: responsiveWidth(1.5),
    marginBottom: 12,

  },
  cName: {
    fontFamily: CustomFont.fontName,
    fontSize: CustomFont.font14,
    fontWeight: CustomFont.fontWeight400,
    color: Color.fontColor,
    alignSelf: 'center',
    padding: 10,

  },
  languageName: {
    fontFamily: CustomFont.fontName,
    color: Color.optiontext,
    fontWeight: CustomFont.fontWeight600,
     
  },
  ecardcategory1: {
    justifyContent: 'flex-start',
    height: responsiveHeight(20),
    width: responsiveWidth(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 12,
  },
  imageContainer: {
    width: responsiveHeight(9),
    height: responsiveHeight(9),
    borderRadius: responsiveHeight(4.5),
    borderColor: Color.imageBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white
  },
  doctorNameInput: {
    borderWidth: 1,
    borderColor: Color.borderColor,
    height: responsiveHeight(6),
    borderRadius: 5,
    marginTop: responsiveHeight(1.4),
    padding: 5,
    color: Color.fontColor,
    paddingLeft: 8,
    fontWeight: CustomFont.fontWeight500,
    fontSize: CustomFont.font14,
    fontFamily: CustomFont.fontName,

  },
  card: {
    borderRadius: 10,
    height: '73%',
    margin: responsiveWidth(5),
    
  },
  cardpreview: {
    borderRadius: 10,
    height: '83%',
    // backgroundColor: Color.red,
    marginTop: responsiveWidth(3),
    marginLeft: responsiveWidth(3),
    marginRight: responsiveWidth(3)
  },
  viewshot: {
    borderRadius: 20,
    backgroundColor: Color.white,
    height: '100%',
    // marginTop : 20,
    // marginLeft : responsiveWidth(3),
    // marginRight : responsiveWidth(3)
  },
  btnView: {
    marginTop: 40,
    height: responsiveHeight(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: responsiveWidth(8),
    marginRight: responsiveWidth(8)
  },
  btn1: {
    flexDirection: 'row',
    width: responsiveWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: Color.primary,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 10,
    height: responsiveHeight(7),
  },
  btn2: {
    flexDirection: 'row',
    width: responsiveWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: Color.primary,
    backgroundColor: Color.primary,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 10,
    height: responsiveHeight(7),
    marginLeft: 10
  },
  downloadTxt:
  {
    color: Color.primary,
    marginLeft: 15,
    fontSize: CustomFont.font16,
    fontFamily: CustomFont.fontName
  },
  shareTxt: {
    color: Color.white,
    marginLeft: 15,
    fontSize: CustomFont.font16,
    fontFamily: CustomFont.fontName
  },
  languageModalMainView: {
    marginLeft: responsiveWidth(-5),  width: responsiveWidth(100),
    backgroundColor: Color.white, borderRadius: 7, alignItems: 'flex-start',borderTopLeftRadius:20,borderTopRightRadius:20
  },
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
  imgcategory: {
    height: responsiveHeight(20),
    width: responsiveWidth(44),
    borderRadius: 10,
    resizeMode :'contain'
},
});
export default styles;