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
        flex: 1,
        backgroundColor: "#CECECE"
    },
    preview: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginStart: responsiveWidth(2),
        // backgroundColor: Color.primary,
        alignItems: 'center',
        opacity: 1

    },
    previewadd: {
        width: 120,
        height: 40,
        borderRadius: 5,
        marginStart: 10,
        marginTop: 10,
        flexDirection: 'row',
        // backgroundColor: Color.primary,
        alignItems: 'center',
        paddingStart: 10,
        // justifyContent: 'center',
        opacity: 1,
        borderColor: Color.primary,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    add: {
        color: Color.primary,
        alignSelf: 'center',
        fontWeight: CustomFont.fontWeight600,
        fontSize: CustomFont.font14,
        marginTop: 6,
        fontFamily: CustomFont.fontName,
    },
    imgcross: {
        height: 24,
        borderRadius: 12,
        backgroundColor: Color.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        right: 0,
        top: 0,
        position: 'absolute'
    },
    modelView: {
        backgroundColor: Color.white,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    //height: responsiveHeight(50),
    width: responsiveWidth(101),
    marginStart: -20,
    bottom: Platform.OS === 'ios' ? responsiveHeight(-42) : responsiveHeight(-45),
    },
    rowShare: {
        flexDirection: 'row',
        marginStart: responsiveWidth(5.5),
        marginEnd: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        height: responsiveHeight(5)
    },
    divider: {
        height: 1, backgroundColor: Color.primaryBlue, opacity: 0.1
    },
    btn: {
        alignItems: 'center', height: responsiveHeight(5),
        flexDirection: 'row',
    },
    addtxt: {
        flex: 1,
        fontFamily: CustomFont.fontName,
        fontSize: CustomFont.font18,
        color: Color.black,
        fontWeight: '700',
    },
    crossbtn: {
        // alignItems: 'center', justifyContent: 'center',
        height: 14,
        width: 14
    },
    optiontxt: {
        marginLeft: 16,
        fontFamily: CustomFont.fontName,
        fontSize: CustomFont.font14,
        fontWeight: '700',
        color: Color.black

    },
    optionimg: { resizeMode: 'contain', height: 40, width: 40 },
    closeIcon: {
        width: 14,
        height: 14,
    },
});
export default styles;
