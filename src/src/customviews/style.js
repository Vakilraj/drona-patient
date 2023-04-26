import { StyleSheet, Dimensions, Platform } from 'react-native';
import Color from '../components/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomFont from '../components/CustomFont';

const { width, height } = Dimensions.get('window');

const Styles = StyleSheet.create({
    mainView: { flexDirection: 'row', marginTop: 0, backgroundColor: Color.white, alignItems: 'center', height: Platform.OS == 'ios' ? 40 : responsiveHeight(7.5) },
    icon: { width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), marginTop: responsiveHeight(.35), resizeMode:'contain',
    },
    title: {
        flex: 1, fontFamily: CustomFont.fontNameBold, fontWeight: Platform.OS == 'ios' ? CustomFont.fontWeight600 :'700', fontSize: CustomFont.font16, color: Color.yrColor
    },
    // bigImageContainer: {
    //     // flex:1,
    //     borderRadius: responsiveHeight(7.5),
    //     // overflow: "hidden",
    //     //borderWidth: 1,
    //     marginStart: 20,
    //     marginTop: 20,
    //     borderColor: Color.primary,
    //     height: responsiveHeight(15),
    //     width: responsiveHeight(15),
    // },
    // bigNameView: {
    //     height: responsiveHeight(12), width: responsiveHeight(12),
    //     borderRadius: responsiveHeight(7.5),
    //     backgroundColor: Color.lightText, alignItems: 'center', justifyContent: 'center',
    //     marginStart: 20,
    //     marginTop: 20,
    // },
    // bigNameTxt: {
    //     fontFamily: CustomFont.fontName,
    //     fontSize: CustomFont.font24,
    //     fontWeight: CustomFont.fontWeight500,
    //     color: Color.white
    // },
    // smallImageContainer: {
    //     // flex:1,
    //     borderRadius: responsiveHeight(1),
    //     // overflow: "hidden",
    //     // borderWidth: 1,
    //     marginStart: 20,
    //     marginTop: 20,
    //     borderColor: Color.primary,
    //     height: responsiveHeight(7),
    //     width: responsiveHeight(7),
    // },
    // smallNameView: {
    //     height: responsiveHeight(7), width: responsiveHeight(7),
    //     borderRadius: responsiveHeight(3.5),
    //     backgroundColor: Color.lightText, alignItems: 'center', justifyContent: 'center',
    //     marginStart: 20,
    //     marginTop: 20,
    // },
    // smallNameTxt: {
    //     fontFamily: CustomFont.fontName,
    //     fontSize: CustomFont.font12,
    //     fontWeight: CustomFont.fontWeight500,
    //     color: Color.white
    // },


    // CustomButton
    bottomViewCB: {
        padding: 16,
        backgroundColor: Color.white, borderTopStartRadius: 20, borderTopEndRadius: 20,
        bottom: 0, position: 'absolute', width: '100%'
    },

     // TextFieldInput
     tfiHeading: { fontSize: CustomFont.font12, color: Color.mediumGray, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName },
     tfiIconView: {},
     tfiIcon: { height: 20, width: 20, marginBottom: 0, marginEnd: 16, },
     tfiIconLeft: { height: 20, width: 20, marginStart: 16, },
     mainViewTFI: {height : responsiveHeight(5.5),  flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: Platform.OS == 'ios' ? 10 : 0, paddingBottom: Platform.OS == 'ios' ? 10 : 0, backgroundColor : 'rgba(87, 21, 210, 0.05)', borderRadius: 10, },
     tfiTI: { paddingEnd: 16, flex: 1, color: Color.darkGray, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, },
     tfiAlert: { marginTop: 8, color: Color.red, marginLeft: 0, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font12 },
     mainViewTFIBorder: {height : responsiveHeight(5.5),  flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: Platform.OS == 'ios' ? 10 : 0, paddingBottom: Platform.OS == 'ios' ? 10 : 0, borderWidth:1, borderColor : '#BDBDBD', borderRadius: 6, },
});
export default Styles;