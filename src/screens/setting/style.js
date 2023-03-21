import { StyleSheet } from 'react-native';
import {
    responsiveFontSize, responsiveHeight,
    responsiveWidth
} from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
const styles = StyleSheet.create({

    settingView: {
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
        marginLeft: responsiveWidth(4),
        color: Color.white
    },
    headingContainer: {
        justifyContent: 'center', height: 40
    },
    headingView: {

        color: Color.text2,
        fontSize: CustomFont.font14,
        fontFamily: CustomFont.fontName,
        marginLeft: responsiveWidth(4),
        fontWeight: CustomFont.fontWeight700,



    },
    container: {

        marginBottom: responsiveHeight(.3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 3,
        backgroundColor: Color.white,
        height: responsiveHeight(8),
    },
    viewContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
    },
    imageContainer: {
        justifyContent: 'center', marginLeft: responsiveHeight(2), height: responsiveHeight(5.5), width: responsiveHeight(6), borderRadius: responsiveHeight(3.2), backgroundColor: Color.billBack,
    },
    iconView: {
        height: responsiveHeight(2.5), width: responsiveHeight(2.5), resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center'
    },
    lableContainer: {
        flex: 10, justifyContent: 'center',
    },
    lable: {
        fontSize: CustomFont.font14, color: Color.text2, margin: 7, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700
    },
    arrowContainer: {
        flex: 1, justifyContent: 'center'
    },
    arrowView: {
        height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain'
    },
    profileTitle: {
        fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12,
        color: Color.optiontext, marginTop: responsiveHeight(2), marginLeft: responsiveWidth(4),
    },
    profileTxt: {
        fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14,
        color: Color.yrColor, marginLeft: responsiveWidth(4),textTransform: 'capitalize'
    },
    modelViewAbout: {
        backgroundColor: Color.white,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        height: responsiveHeight(65),
        width: responsiveWidth(101),
        marginStart: -20,
        bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
        // position : 'absolute',
    },
    modelMainTitle: { flex: 1, fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700 },
    crossIcon: {
        height: responsiveHeight(4), width: responsiveWidth(4)
    },
    tiTitle: {
        fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(3)
    },
    modelTextInput1: {
        height: responsiveHeight(6), marginTop: responsiveHeight(1.3), padding: 0,
        paddingLeft: 16, paddingRight: 16, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, borderWidth: 1, fontSize: CustomFont.font14, borderRadius: 5, color: Color.yrColor,
    },

    createInputStyle: { height: responsiveHeight(6), borderColor: Color.createInputBorder,
         borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2),
         fontSize: CustomFont.font14, color: Color.fontColor, paddingLeft: 10, paddingRight: 10, 
         paddingTop: 0, paddingBottom: 0, opacity: .7 },

    modalBtn: {
        alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6.5), backgroundColor: Color.primary, marginTop: responsiveHeight(4)
    },
    modalBtnTxt: {
        fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center'
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
      modelView1: {
        backgroundColor: Color.white,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        paddingTop: 30,
        height: responsiveHeight(62),
        width: responsiveWidth(100),
        marginStart: -20,
        bottom: responsiveHeight(-20),
        paddingBottom : responsiveHeight(11)
    },
    modalHeading: {
        flex: 1,
        color: Color.black,
        fontWeight: CustomFont.fontWeight600,
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
    },
});
export default styles;
