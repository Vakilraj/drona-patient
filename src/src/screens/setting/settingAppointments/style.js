import { StyleSheet } from 'react-native';
import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: Color.lightGrayBg
    },
    backImage: {
        marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2)
    },
    headerContainer: {
        justifyContent: 'center', height: 40
    },
    title: {
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
        marginLeft: responsiveWidth(4),
        color: Color.text2,
        fontWeight:CustomFont.fontWeight700
    },
    headingView: {

        color: Color.feeText,
        fontSize: CustomFont.font14,
        fontFamily: CustomFont.fontName,
        marginLeft: responsiveWidth(4),
        letterSpacing: 0,
        opacity: 0.8,
    },
    
    viewMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Color.white,
        height: responsiveHeight(10),
        paddingLeft: responsiveHeight(2),
        paddingRight: responsiveHeight(2),
        alignItems:'center'
    },
    timeContainer: {
        marginBottom: responsiveHeight(.3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 3,
        backgroundColor: Color.white,
        height: responsiveHeight(10),
        paddingLeft: responsiveHeight(2),
        paddingRight: responsiveHeight(2),
        marginTop: 40
    },

    viewContainer: {
        flex: 1, flexDirection: 'row'
    },
    imageContainer: {
        flex: 1, justifyContent: 'center', paddingLeft: responsiveHeight(2)
    },
    iconView: {
        height: responsiveFontSize(4), width: responsiveFontSize(4), resizeMode: 'contain'
    },
    lableContainer: {
        flex: 10, justifyContent: 'center', flexDirection: 'column'
    },
    lable: {
        fontSize: CustomFont.font14, color: Color.text2, fontFamily: CustomFont.fontName, fontWeight:CustomFont.fontWeight700
    },
    subLable: {
        fontSize: CustomFont.font12, color: Color.darkText, marginLeft: 7, marginTop: -3,color:Color.fontColor
    },
    arrowContainer: {
        position: 'absolute', right: responsiveHeight(2), alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: "center"
    },
    arrowView: {
        height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain'
    }
});
export default styles;
