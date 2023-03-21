import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
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
        marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2),
        width:responsiveWidth(7), height:responsiveWidth(4)
    },
    headerContainer :{
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
    renderContainer: {
        flex: 1,
        alignItems:'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Color.white,
        height: responsiveHeight(5),
        paddingRight: responsiveHeight(2),
        paddingLeft: responsiveHeight(2)
    },
    lableContainer: {
        flex: 10, justifyContent: 'center'
    },
    lable: {
        fontSize: CustomFont.font14, color: Color.text2, fontFamily: CustomFont.fontName,  fontWeight:CustomFont.fontWeight700
    }
});
export default styles;
