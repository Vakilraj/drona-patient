import { StyleSheet } from 'react-native';
import {
    responsiveWidth,
    responsiveHeight
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
    headerContainer :{
        justifyContent: 'flex-start', marginTop:responsiveHeight(2),
    },
    title: {
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
        marginLeft: responsiveWidth(4),
        color: Color.text2,
        fontWeight:CustomFont.fontWeight700
    },
    headingView: {

        color: Color.text2,
        fontSize: CustomFont.font14,
        fontFamily: CustomFont.fontName,
        marginLeft: responsiveWidth(4),
        letterSpacing: 0,
        fontWeight:CustomFont.fontWeight400
    },
    renderContainer: {
        flex: 1,
        marginBottom: responsiveHeight(.3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 3,
        backgroundColor: Color.white,
        height: responsiveHeight(8),
        paddingRight: responsiveHeight(2),
        paddingLeft: responsiveHeight(2)
    },
    lableContainer: {
        flex: 10, justifyContent: 'center'
    },
    lable: {
        fontSize: CustomFont.font16, color: Color.black, fontFamily: CustomFont.fontNam, opacity: 1
    }
});
export default styles;
