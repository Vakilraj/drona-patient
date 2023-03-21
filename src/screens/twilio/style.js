import {StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.grayTxt,
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
   // backgroundColor : 'blue'
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    marginTop : responsiveHeight(18),
    backgroundColor : Color.primary,
    alignItems : 'center',
    justifyContent : 'center',
    height : responsiveHeight(6),
    width : '75%',
    borderRadius : 5
  },buttonEndCall: {
    marginTop : responsiveHeight(50),
    backgroundColor : 'red',
    alignItems : 'center',
    justifyContent : 'center',
    height : responsiveHeight(6),
    width : '40%',
    borderRadius : 5
  },
  localVideo: {
    flex: 1,
    width: responsiveWidth(40),
    height: responsiveWidth(60),
    position: "absolute",
    right: 0,
    bottom: responsiveHeight(10),
  },
  remoteGrid: {
    flex: 1,
    //flexDirection: "row",
    flexWrap: "wrap",
  },
  remoteVideo: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    width: responsiveWidth(100),
    height: responsiveHeight(100),

  },remoteVideoMinimize: {
    width: responsiveWidth(30),
    height: responsiveWidth(40),

  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
  },

  optionsContainer1 :{
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    //height: responsiveHeight(16),
   // backgroundColor: Color.red,
    flexDirection: "row",
    alignItems: "center",
    //justifyContent : 'center',
    backgroundColor:'#FAFAFA'
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
    marginTop: responsiveHeight(8.5),
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