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
        backgroundColor: Color.bgColor
    },
    profileRoundImgCommunity: { width: 40, height: 40, borderRadius: 20, backgroundColor: Color.lightPurple, justifyContent: 'center', alignItems: 'center' },
    modelViewMessage: {
        backgroundColor: Color.white,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        height: responsiveHeight(100),
        width: responsiveWidth(101),
        marginStart: -20,
        bottom: Platform.OS === 'ios' ? responsiveHeight(-10) : responsiveHeight(-10),
    },
    nameImage: {
        height: 40, width: 40, borderRadius: 20
    },
    nameTxt: { fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, color: Color.profileImageText, fontWeight: CustomFont.fontWeight500 },
    likeTxt: { fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: Color.fontColor, marginLeft: responsiveWidth(2) },
    likeIcon: { height: 20, width: 20 },
    crossIcon: { height: 14, width: 14 },
    speciality: { fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.datecolor },
    age: { color: Color.datecolor, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, opacity: 1 },
});
export default styles;