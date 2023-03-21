import { StyleSheet } from 'react-native';
import {
    responsiveWidth,
    responsiveHeight
} from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.patientBackground
    },
    backImage: {
        marginLeft: responsiveWidth(3),
        marginTop: responsiveHeight(.8),
        marginBottom: responsiveWidth(2)
    },
    noMedicalContainer: {
        alignSelf: 'center',
        height: responsiveHeight(24), width: responsiveHeight(24), borderRadius: responsiveHeight(12),
        backgroundColor: Color.nofilebackground,
        alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(15)
    },
    noMedicalFileImage: {
        marginTop: responsiveHeight(8),
        justifyContent: 'center',
        resizeMode: 'contain', height: 260, width: 260,
    },
    headerContainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: responsiveHeight(2),
        paddingStart: responsiveWidth(20),
        paddingEnd: responsiveWidth(20)
    },
    title: {
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
        marginLeft: responsiveWidth(4),
        color: Color.white
    },
    headingView: {
        color: Color.patientSearchName,
        fontSize: CustomFont.font14,
        fontWeight: CustomFont.fontWeight500,
        fontFamily: CustomFont.fontName,
        letterSpacing: 0,
        // opacity: 0.6,
        textAlign: 'center'
    },
    addContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        right: responsiveWidth(5),
        bottom: responsiveWidth(5),
        borderRadius: 50,
        padding: 3,
        paddingRight: responsiveWidth(5),
        backgroundColor: Color.primary
    },
    addText: {
        color: Color.white,
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
        letterSpacing: 0,
    },
    modelViewDiscard: {
        backgroundColor: Color.white,
        borderRadius: 8,
        // height: responsiveHeight(15),
        // width: responsiveWidth(80),
        marginLeft: responsiveWidth(5),
        marginRight: responsiveWidth(5),
        paddingTop: 10,
        paddingBottom: 10

    },
    modalHeading: {
        color: Color.fontColor,
        fontWeight: CustomFont.fontWeight500,
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
    },

    rowHeading: {
        flexDirection: 'row',
        margin: 20,
    },
    rowDiscard: {
        marginLeft: 20,
        // marginTop : 20,
        marginRight: 10,
        // backgroundColor : 'red'
    },

    modelView: {
        backgroundColor: Color.white,
        height: Platform.OS === 'ios' ? responsiveHeight(40) : responsiveHeight(57),
        width: responsiveWidth(100),
        marginStart: -20,
        bottom: Platform.OS === 'ios' ? responsiveHeight(-30) : responsiveHeight(-30),
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
    },
    modelView1: {
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        backgroundColor: Color.white,
        height: Platform.OS === 'ios' ? responsiveHeight(80) : responsiveHeight(100),
        width: responsiveWidth(101),
        marginStart: -20,
        bottom: Platform.OS === 'ios' ? responsiveHeight(-30) : responsiveHeight(-35),
    },
    modelViewAbout: {
        backgroundColor: Color.white,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        height: responsiveHeight(120),
        width: responsiveWidth(101),
        marginStart: -20,
        bottom: Platform.OS === 'ios' ? responsiveHeight(-20) : responsiveHeight(-20),
        // position : 'absolute',
       // backgroundColor: 'red',
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
    rowShare1: {
        flexDirection: 'row',
        marginStart: responsiveWidth(5.5),
        marginEnd: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        height: responsiveHeight(5)
    },
    iconView: {
        flex: 1,
        // backgroundColor : 'blue',
        flexDirection: 'row',
        height: responsiveHeight(5)
    },
    divider: {
        height: 1, backgroundColor: Color.primaryBlue, opacity: 0.1
    },
    closeIcon: {
        width: 14,
        height: 14,
    },
    headview: {
        flexDirection: 'row',
        width: responsiveWidth(101),
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16
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
        fontWeight: '500',
        color: Color.black

    },
    optiontxtdel: {
        marginLeft: 12,
        fontFamily: CustomFont.fontName,
        fontSize: CustomFont.font16,
        color: Color.rednew

    },
    btn: {
        alignItems: 'center', height: responsiveHeight(5),
        flexDirection: 'row',
    },
    optionimg: { resizeMode: 'contain', height: 40, width: 40 },
    addtxt: {
        flex: 1,
        fontFamily: CustomFont.fontName,
        fontSize: CustomFont.font18,
        color: Color.black,
        fontWeight: '500',
    },
    lowerContainer: {
        // borderRadius: responsiveHeight(1),
        // borderWidth: responsiveHeight(0.2),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.preCardBG,
        borderColor: Color.lightBlue,
        // padding: 16,
        // marginTop: responsiveHeight(.5),
    },

    flatListView: { borderRadius: 0, flex: 1, backgroundColor: Color.white, justifyContent: 'flex-start', padding: 16, borderRadius: 10, marginTop: 5 },
    dateContainer: { marginTop: 0, alignItems: 'center', justifyContent: 'center', marginBottom: 0 },
    dayText: {
        marginTop: 0, color: Color.liveBg, fontWeight: CustomFont.fontWeight700,
        fontSize: CustomFont.font16, fontFamily: CustomFont.fontName
    },
    monthText: {
        marginTop: 6, color: Color.datecolor, fontSize: CustomFont.font12,
        fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName
    },
    timeText: {
        fontFamily: CustomFont.fontName,
        fontWeight: CustomFont.fontWeight400,
        fontSize: CustomFont.font14,
    },
    dName: {
        color: Color.datecolor,
        fontFamily: CustomFont.fontName,
        fontWeight: CustomFont.fontWeight500,
        fontSize: CustomFont.font12,
        marginTop: 8
    },
    dName1: {
        color: Color.patientSearchName,
        fontFamily: CustomFont.fontName,
        fontWeight: CustomFont.fontWeight500,
        fontSize: CustomFont.font14,
    },
    dSpcl: {
        color: Color.hintColor,
        fontFamily: CustomFont.fontName,
        fontWeight: CustomFont.fontWeight400,
        fontSize: CustomFont.font12,
    },
    vType: {
        marginTop: 0, marginLeft: 4, color: Color.hintColor,
        fontSize: CustomFont.font12, fontFamily: CustomFont.fontName,
        fontWeight: CustomFont.fontWeight400,
    },
    yrTxt: {
        color: Color.yrColor,
        fontWeight: CustomFont.fontWeight700,
        fontSize: CustomFont.font14,
        fontFamily: CustomFont.fontName,
        // marginStart: 20,
        marginTop: 16,
    },
    report: {
        color: Color.datecolor,
        fontFamily: CustomFont.fontName,
        fontWeight: CustomFont.fontWeight400,
        fontSize: CustomFont.font12,
    },
    vStatusContainer: {
        paddingLeft: 8,
        paddingRight: 8,
        // paddingTop: 0,
        paddingBottom: 2,
        borderRadius: 10,
        // justifyContent: 'center',
        // alignItems: 'center',
        //  alignSelf: 'flex-end',
        marginTop: 5,
        marginRight: -20
    },
    visitStatus: {
        fontFamily: CustomFont.fontName,
        color: Color.white, fontSize: CustomFont.font10,
        textAlign: 'center'
    },
    threedot: {
        // minHeight: 38,
        width: 24,
        height: 24,
        // backgroundColor : 'orange',
        // justifyContent : 'flex-start',
        alignItems: 'flex-end',
        // alignSelf: 'flex-end',
    },
    preview: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginStart: responsiveWidth(5),
        // backgroundColor: Color.primary,
        alignItems: 'center',
        opacity: 1

    },
    previewadd: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginStart: 30,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
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
    titletxt: {
        color: Color.optiontext,
        fontSize: CustomFont.font12,
        fontWeight: CustomFont.fontWeight500,
        fontFamily: CustomFont.fontName
    },
    input: {
        height: responsiveHeight(6.5),
        borderRadius: 6,
        borderWidth: 1,
        marginTop: 10,
        borderColor: Color.borderColor,
        fontSize: CustomFont.font14,
        color: Color.yrColor,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 0,
        paddingBottom: 0,
        fontWeight: CustomFont.fontWeight400,
        fontFamily: CustomFont.fontName,
        // marginLeft : responsiveWidth(5), 
        // marginRight:responsiveWidth(5) 
    },
    inputdate: {
        height: responsiveHeight(6.5),
        borderRadius: 6,
        borderWidth: 1,
        marginTop: 10,
        borderColor: Color.borderColor,
        fontSize: CustomFont.font14,
        color: Color.yrColor,
        alignSelf: 'center',
        // marginLeft : responsiveWidth(5), 
        //marginRight:responsiveWidth(5) 
        width: "100%",
        paddingLeft: 20,
        fontWeight: CustomFont.fontWeight400,
        fontFamily: CustomFont.fontName,
    },
    rowView: {
        marginStart: 20,
        marginTop: 1,
        height: responsiveHeight(5.4),
        minWidth: 50,
        // marginEnd: 24,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: responsiveWidth(3),
        paddingRight: responsiveWidth(3),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.lightPrimary,
        borderRadius: 5,
        justifyContent: 'center'
    },
    cName: {
        fontFamily: CustomFont.fontName,
        fontSize: CustomFont.font14,
        color: Color.optiontext,
        fontWeight: CustomFont.fontWeight500,
        alignSelf: 'center'
    },
    thisrecord: {
        fontFamily: CustomFont.fontName,
        fontSize: CustomFont.font12,
        color: Color.fontColor,
        marginLeft: responsiveWidth(4),
        marginTop: 30
    },
    submitbtn: {
        // marginLeft: responsiveWidth(5),
        // marginRight: responsiveWidth(5),
        // marginTop : responsiveWidth(5),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.primary,
        borderRadius: 4,
        height: responsiveHeight(6),
        //marginBottom: 30
    },
    submittxt: {
        fontFamily: CustomFont.fontName,
        fontSize: CustomFont.font16,
        color: Color.white,
    },
    progresspopup: {
        height: responsiveHeight(100),
        // marginLeft : -20, 
        width: responsiveWidth(100),
        backgroundColor: Color.uploadstatus,
        opacity: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    progress: {
        marginTop: responsiveHeight(3),
        //backgroundColor : Color.divider, 
        borderRadius: 50,
        // borderColor  :Color.divider
    },
    fileuploadheader: {
        color: Color.patientSearchName,
        fontSize: CustomFont.font16,
        fontFamily: CustomFont.fontName,
        fontWeight: CustomFont.fontWeight700,
        marginTop: 0
    },
    fileuploadtxt: {
        color: Color.datecolor,
        fontSize: CustomFont.font14,
        fontFamily: CustomFont.fontName,
        marginTop: 16,
        fontWeight: CustomFont.fontWeight400,
        textAlign: 'center'
    },
    modelView2: {
        backgroundColor: Color.white,
        height: Platform.OS === 'ios' ? responsiveHeight(30) : responsiveHeight(30),
        width: responsiveWidth(101),
        marginStart: -20,
        bottom: Platform.OS === 'ios' ? responsiveHeight(-30) : responsiveHeight(-35),
    },
    bottomBtnView: {
         
        padding: 16, backgroundColor: Color.white, borderTopStartRadius: 20, borderTopEndRadius: 20,
        width: '100%'
    },
});
export default styles;