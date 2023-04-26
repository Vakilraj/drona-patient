import { StyleSheet } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth
} from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.lightGrayBg
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: Color.primaryBlue,
        justifyContent: 'space-between',
        height: responsiveHeight(7),
        alignItems: 'center',
        zIndex: 999
    },
    backView: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    changePasswordView: {
        fontFamily: CustomFont.fontName,
        letterSpacing: 0,
        opacity: 1,
        fontSize: CustomFont.font16,
        color: Color.white,
        marginLeft: responsiveWidth(3)
    },
    doneView: {
        fontFamily: CustomFont.fontName,
        opacity: 1,
        fontSize: CustomFont.font14,
        color: Color.white
    },
    containerView: {
        flex: 1,
        backgroundColor: Color.lightGrayBg
    },
    backImage: {
        height: responsiveWidth(4),
        width: responsiveWidth(5)
    },
    createInputStyle: {
        height: responsiveHeight(6),
        borderColor: Color.createInputBorder,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: Color.white,
        marginTop: responsiveHeight(1),
        fontSize: CustomFont.font14,
        color: Color.black,
        fontFamily: CustomFont.fontName,
        paddingLeft: 10,
        paddingRight: 10,
        letterSpacing: 0,
        opacity: 0.75
    },
    
    inputHeader: {
        fontSize: CustomFont.font12,
        color: Color.fontColor,
        marginTop: responsiveHeight(1.6),
        fontFamily: CustomFont.fontName,
        letterSpacing: 0,
        opacity: 1,
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
});
export default styles;
