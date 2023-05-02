import React from 'react';
import {
    Image, SafeAreaView, ScrollView, Text, Platform,
    TouchableOpacity, View, TextInput
} from 'react-native';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';
import RNPrint from 'react-native-print';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNFetchBlob from 'rn-fetch-blob';
import arrowBack from '../../../assets/arrowBack_white.png';
import arrow_right from '../../../assets/chevron_right.png';
import Download from '../../../assets/downloadpreview.png';
import OK from '../../../assets/ok.png';
import vector_phone from '../../../assets/vector_phone.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import { setApiHandle } from "../../service/ApiHandle";
import styles from './style';
import TickIcon from '../../../assets/green_tick.png';
import whatsapp_icon from '../../../assets/whatsapp_icon.png';
import message_complete from '../../../assets/message_complete.png';
import home_done from '../../../assets/hometab/home_done.png';
let base64ImageArr = [], DoctorPatientClinicGuid = '', prevScreenName = '';
import Trace from '../../service/Trace'
import { setLogEvent } from '../../service/Analytics';
import Snackbar from 'react-native-snackbar';
import Validator from '../../components/Validator';
let timeRange = '', PrescriptionGuId=null;
class BillingComplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fld1: Color.borderColor,
            fld2: Color.borderColor,
            fld3: Color.borderColor,
            fld4: Color.borderColor,
            fld5: Color.borderColor,
            fld6: Color.borderColor,
            fld7: Color.borderColor,
            fld8: Color.borderColor,
            notesData: '',
            checked: false,
            billingDetailsState: [],
            patientDetailsState: [],
            CompleteModal: false,
            modelMessage: "Appointment Completed",
            filePath: '',
            successPdfGeneration: false,
            showHomeBtn: false,
        };
    }

    componentDidMount() {

        let { signupDetails } = this.props;
        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Prescription_Complete', signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Prescription_Complete", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
        base64ImageArr = [];
        this.getConsulatationBillingPreviewData();
        this.getPrivateNote();
        let filePath = this.props.navigation.state.params.filePath;
        this.setState({
            filePath: filePath
        })

        prevScreenName = this.props.navigation.state.params.prevScreenName;
        if (prevScreenName == 'handwrittenadd') {
            // 
            this.makeBase64ImageArray(this.props.navigation.state.params.imgArr)
        }
        //alert(prevScreenName)
        //normalPrescription // 

        if (prevScreenName == 'handwrittenedit') {
            this.makeBase64ImageArrayEditCase(this.props.navigation.state.params.imgArr)
        }
    }
    componentWillUnmount() {
        Trace.stopTrace()
    }
    getPrivateNote = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "PatientGuid": signupDetails.patientGuid,
            "Version": "",
            "Data": {
                "AppointmentGuid": signupDetails.appoinmentGuid,
            }
        }

        actions.callLogin('V1/FuncForDrAppToGetDoctorPrivateNote', 'post', params, signupDetails.accessToken, 'GetDoctorPrivateNoteComplete');
    }
    makeBase64ImageArray = (arr) => {
        base64ImageArr = [];
        let tempArr = arr.slice(0, -1);
        for (let i = 0; i < tempArr.length; i++) {
            let tempFileExt = '.jpeg';
            try {
                // let fileExtArr = tempArr[i].imgExtn.split("/");
                //                 let fileExt = '.' + fileExtArr[1];
                //tempFileExt = '.jpeg';
                //tempFileExt  = fileExt;
            } catch (error) {

            }

            let tempObj = {};
            tempObj.FileGuid = null;
            tempObj.OrgFileName = 'pres' + i + tempFileExt;
            tempObj.OrgFileExt = tempFileExt
            tempObj.SysFileName = null
            tempObj.SysFileExt = null
            tempObj.SysFilePath = null
            tempObj.fileBytes = tempArr[i].fileBytes
            tempObj.RefType = null
            tempObj.DelMark = tempArr[i].DelMark
            tempObj.UploadedOnCloud = 0
            tempObj.RefId = null
            base64ImageArr.push(tempObj)
        }
    }

    makeBase64ImageArrayEditCase = (arr) => {
        base64ImageArr = [];
        let tempArr = arr.slice(0, -1);
        for (let i = 0; i < tempArr.length; i++) {
            let tempObj = {};
            if (tempArr[i].fileBytes == null) {
                // Convert Image URL to Base64 data
                const fs = RNFetchBlob.fs;
                let imagePath = null;
                RNFetchBlob.config({
                    fileCache: true
                })
                    .fetch("GET", tempArr[i].uri)
                    // the image is now dowloaded to device's storage
                    .then(resp => {
                        // the image path you can use it directly with Image component
                        imagePath = resp.path();
                        return resp.readFile("base64");
                    })
                    .then(base64Data => {
                        tempObj.FileGuid = null;
                        tempObj.OrgFileName = 'pres' + i + '.jpeg';
                        tempObj.OrgFileExt = '.jpeg'
                        tempObj.SysFileName = null
                        tempObj.SysFileExt = null
                        tempObj.SysFilePath = null
                        tempObj.fileBytes = base64Data
                        tempObj.RefType = null
                        tempObj.DelMark = tempArr[i].DelMark
                        tempObj.UploadedOnCloud = 0
                        tempObj.RefId = null
                        base64ImageArr.push(tempObj)
                        // remove the file from storage
                        return fs.unlink(imagePath);
                    });

            }
            else {
                tempObj.FileGuid = null;
                tempObj.OrgFileName = 'pres' + i + '.jpeg'
                tempObj.OrgFileExt = '.jpeg'
                tempObj.SysFileName = null
                tempObj.SysFileExt = null
                tempObj.SysFilePath = null
                tempObj.fileBytes = tempArr[i].fileBytes
                tempObj.RefType = null
                tempObj.DelMark = tempArr[i].DelMark
                tempObj.UploadedOnCloud = 0
                tempObj.RefId = null
                base64ImageArr.push(tempObj)
            }

        }

    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)

    }
    handleApi = (response, tag) => {
        if (tag === 'getConsulatationBillingPreviewData') {
            let billingDetailsFullArray = response.billingDetails;
            let patientDetailsFullArray = response.prescriptionData.patientInfo;
            this.setState({ billingDetailsState: billingDetailsFullArray });
            this.setState({ patientDetailsState: patientDetailsFullArray });

        } else if (tag === 'completeConsultationWithNoti') {
            let { signupDetails } = this.props;
            if (prevScreenName == 'normalPrescription') {
                timeRange = Trace.getTimeRange();
                Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + "E_Prescription_Created", signupDetails.firebaseLocation)
                Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "E_Prescription_Created", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality, 'prescription_type': 'E_Prescription' })
            } else if (prevScreenName == 'handwrittenadd') {
                timeRange = Trace.getTimeRange();
                Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'HandWritten_Prescription_Created', signupDetails.firebaseLocation)
                Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "HandWritten_Prescription_Created", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality, 'prescription_type': 'HandWritten_Prescription' })
            }
            if (response) {
                PrescriptionGuId = response.prescriptionGuId;
            }
            setTimeout(() => {
                DRONA.setShowAppoinmentCompleteMsg(1);
                this.props.navigation.navigate('DoctorHome');
            }, 2000)
            setTimeout(()=>{
                Snackbar.show({ text: 'Appointment Completed successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
            },500)
           

            //this.setState({ CompleteModal: true, modelMessage: 'Appointment Completed' });
        } else if (tag === 'completeConsultationWithOutNoti') {
            if (response) {
            PrescriptionGuId = response.prescriptionGuId;
            setTimeout(()=>{
                Snackbar.show({ text: 'Appointment Completed successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
            },500)
            setTimeout(() => {
                this.printRemotePDF();
                this.setState({ showHomeBtn: true })
            }, 1500)
            }
        } else if (tag === 'GetDoctorPrivateNoteComplete') {
            if (response) {
                DoctorPatientClinicGuid = response.doctorPatientClinicGuid;
                this.setState({ notesData: response.doctorPrivateNote });
            }
            PrescriptionGuId = response.prescriptionGuId;
            //notesData  DoctorPatientClinicGuid
        }
    }
    callOnFocus = (type) => {
        if (type == '1') {
            this.setState({ fld1: Color.primary })
        }
        else if (type == '2') {
            this.setState({ fld2: Color.primary })
        }
        else if (type == '3') {
            this.setState({ fld3: Color.primary })
        }
        else if (type == '4') {
            this.setState({ fld4: Color.primary })
        }
        else if (type == '5') {
            this.setState({ fld5: Color.primary })
        }
        else if (type == '6') {
            this.setState({ fld6: Color.primary })
        }
        else if (type == '7') {
            this.setState({ fld7: Color.primary })
        }
        else if (type == '8') {
            this.setState({ fld8: Color.primary })
        }
    }
    callOnBlur = (type) => {
        if (type == '1') {
            this.setState({ fld1: Color.borderColor })
        }
        else if (type == '2') {
            this.setState({ fld2: Color.borderColor })
        }
        else if (type == '3') {
            this.setState({ fld3: Color.borderColor })
        }
        else if (type == '4') {
            this.setState({ fld4: Color.borderColor })
        }
        else if (type == '5') {
            this.setState({ fld5: Color.borderColor })
        }
        else if (type == '6') {
            this.setState({ fld6: Color.borderColor })
        }
        else if (type == '7') {
            this.setState({ fld7: Color.borderColor })
        }
        else if (type == '8') {
            this.setState({ fld8: Color.borderColor })
        }
    }


    getConsulatationBillingPreviewData = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "RoleCode": signupDetails.roleCode,
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "Version": "",
            "Data": {
                "version": null,
                "AppointmentGuid": signupDetails.appoinmentGuid,
            }
        }
        actions.callLogin('V14/FuncForDrAppToConsulatationBillingPreview', 'post', params, signupDetails.accessToken, 'getConsulatationBillingPreviewData');
    }

    completeConsultation = (type) => {
        let { actions, signupDetails } = this.props;
        setLogEvent("Appointment_Complete", { "Complete": "click", UserGuid: signupDetails.UserGuid })
        RNFS.readFile(this.state.filePath, "base64").then(result => {
            let params = {
                "DoctorGuid": signupDetails.doctorGuid,
                "ClinicGuid": signupDetails.clinicGuid,
                "UserGuid": signupDetails.UserGuid,
                "Version": "",
                "Data": {
                    "AppointmentGuid": signupDetails.appoinmentGuid,
                    "DoctorPrivateNote": this.state.notesData,
                    "DoctorPatientClinicGuid": DoctorPatientClinicGuid,
                    "PrescriptionGuId": PrescriptionGuId,
                    "Attachment": {
                        "FileGuid": null,
                        "OrgFileName": "TestPDF.pdf",
                        "OrgFileExt": ".pdf",
                        "SysFileName": null,
                        "SysFileExt": null,
                        "FileBytes": result,
                        "RefType": null,
                        "RefId": null,
                        "SysFilePath": null,
                        "DelMark": 0,
                        "UploadedOnCloud": 0
                    },

                    "HandwrittenListOfAttachment": base64ImageArr
                }
            }
            //actions.callLogin('V11/FuncForDrAppToCompleteConsultation_V4', 'post', params, signupDetails.accessToken, 'completeConsultation');
            if(type=='withNotification')
            actions.callLogin('V13/FuncForDrAppToCompleteConsultWithNotification', 'post', params, signupDetails.accessToken, 'completeConsultationWithNoti');
            else
            actions.callLogin('V12/FuncForDrAppToCompleteConsultWithoutNotification', 'post', params, signupDetails.accessToken, 'completeConsultationWithOutNoti');
        })
        //}
    }
    downloadPdf = async () => {
        if (Platform.OS == 'android') {
            RNFetchBlob.android.actionViewIntent(this.state.filePath, 'application/pdf');
        }
        else {
            RNFetchBlob.ios.previewDocument(this.state.filePath);
        }
        // setTimeout(() => {
        //     this.setState({
        //         successPdfGeneration: true
        //     })
        // }, 500)
        // if(Platform.OS == 'ios'){
        //     this.actualDownload();
        // }else{
        //     try {
        //         const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //             this.actualDownload();
        //         } else {
        //             Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
        //         }
        //     } catch (err) {
        //         console.warn(err);
        //     }
        // }

    }

    actualDownload1 = () => {
        //  var RandomNumber = Math.floor(Math.random() * 100) + 1 ;
        const { dirs } = RNFetchBlob.fs;
        let fileName = "bill" + (new Date()).getTime() + '.pdf'
        RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                //  title: RandomNumber.toString() + `test.pdf`,
                title: fileName,
                path: `${dirs.DownloadDir}/` + fileName,
            },
        }).fetch('GET', this.state.filePath, {})
            .then((res) => {
                alert('File successfully downloaded')
            })
            .catch((e) => {
            });
    }
    actualDownload = () => {
        const { dirs } = RNFetchBlob.fs;
        const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
        let fileName = "pastEncounter" + (new Date()).getTime() + '.pdf'
        const configfb = {
            fileCache: true,
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: 'test',
            path: `${dirToSave}/` + fileName,
        }
        const configOptions = Platform.select({
            ios: {
                fileCache: configfb.fileCache,
                title: configfb.title,
                path: configfb.path,
                appendExt: 'pdf',
            },
            android: configfb,
        });

        //console.log('The file saved to 23233', configfb, dirs);

        RNFetchBlob.config(configOptions)
            .fetch('GET', this.state.filePath, {})
            .then((res) => {
                if (Platform.OS === "ios") {
                    RNFetchBlob.ios.openDocument(res.data);
                    // RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                    // RNFetchBlob.ios.previewDocument(configfb.path);
                }
                //setisdownloaded(false)
                if (Platform.OS == 'android') {
                    Snackbar.show({ text: 'File downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                }
                //console.log('The file saved to ', res);
            })
            .catch((e) => {
            });
    }
    async printRemotePDF() {
        let { signupDetails } = this.props;

        setLogEvent("Print_RX", { "Print": "click", UserGuid: signupDetails.UserGuid })
        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Print_Rx', signupDetails.firebaseLocation)
        Trace.startTracePrintoutSetup(timeRange, signupDetails.firebasePhoneNumber, 'No', signupDetails.drSpeciality, signupDetails.firebaseUserType + 'PrescriptionTemplate_Printout', signupDetails.firebaseLocation)

        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Print_Rx", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality, })

        base64ImageArr = [];
        await RNPrint.print({ filePath: this.state.filePath })
    }
    nameFormat = (name, isDoctor) => {
        let shortName = '';
        if (name != null && name.length > 0) {
            let nameArr = name.split(' ')
            if (nameArr.length > 0) {
                let max = nameArr.length > 3 ? 3 : nameArr.length
                for (let i = 0; i < max; i++) {
                    shortName = shortName + (isDoctor && i == 0 ? '' : nameArr[i].charAt(0).toUpperCase());
                }
            }
        }
        return shortName
    }

    render() {
        let { signupDetails } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
                <View style={{ flex: 1, backgroundColor: Color.white }}>


                    <View style={{ flexDirection: 'row', backgroundColor: Color.white, padding: 10, height: responsiveFontSize(7.5), }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ tintColor: Color.primary, height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>

                        <View style={{ marginLeft: 5, marginRight: 10, height: responsiveFontSize(5), }}>

                            <View style={{
                                height: responsiveFontSize(5), width: responsiveFontSize(5), backgroundColor: '#84E4E2', borderRadius: responsiveFontSize(2.5),
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                {signupDetails.patientProfileUrl ?
                                    <Image source={{ uri: signupDetails.patientProfileUrl }} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), }} />

                                    : <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.white }}>{this.nameFormat(this.state.patientDetailsState.firstName + ' ' + this.state.patientDetailsState.lastName, false)}</Text>
                                }

                            </View>



                        </View>

                        <View style={{ flex: 5, marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1), }}>
                            <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.patientSearchName, marginRight: responsiveWidth(1), textTransform: 'capitalize' }}>{this.state.patientDetailsState.firstName === undefined ? "" : this.state.patientDetailsState.firstName} {this.state.patientDetailsState.lastName === undefined ? '' : this.state.patientDetailsState.lastName}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 3, }}>
                                {/* <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '500' }}>{this.state.patientDetailsState.gender} {this.state.patientDetailsState.age}</Text> */}

                                <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '700' }}>{this.state.patientDetailsState.gender ? this.state.patientDetailsState.gender.charAt(0) : ''} </Text>
                                <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '500' }}>{this.state.patientDetailsState.age ? this.state.patientDetailsState.age : ''}</Text>
                                <Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
                                <Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{this.state.patientDetailsState.contactNumber}</Text>

                            </View>
                        </View>

                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.downloadPdf()}>
                            <Image source={Download} style={{ marginRight: responsiveWidth(1), height: responsiveWidth(4), width: responsiveWidth(4), resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ padding: 10, backgroundColor: Color.patientBackground }}>
                        <View style={{ marginBottom: 5 }} >
                            <View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.6), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: responsiveWidth(5), alignItems: 'center', justifyContent: 'space-between' }} onPress={() => {
                                    this.props.navigation.navigate('PreviewRx', { PreviewPdfPath: this.state.filePath, from: prevScreenName })
                                }}>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700 }}>Prescription</Text>
                                    <Image style={{ height: 30, width: 30, tintColor: Color.primary, resizeMode: 'contain' }} source={arrow_right} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.6), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
                                <View style={{ margin: responsiveWidth(5) }}>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700 }}>Billing</Text>
                                    {this.state.billingDetailsState && this.state.billingDetailsState.billingItemDetails && this.state.billingDetailsState.billingItemDetails.length > 0 ? this.state.billingDetailsState.billingItemDetails.map((item, index) => {
                                        return (<View style={{ marginTop: responsiveHeight(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.patientSearchName, fontWeight: CustomFont.fontWeight500 }}>{item.billingItemName}</Text>
                                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.patientSearchName, fontWeight: CustomFont.fontWeight500 }}>Rs {item.billingItemAmount}</Text>
                                        </View>);
                                    }, this) : null}
                                    <View style={{ marginTop: responsiveHeight(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.patientSearchName, fontWeight: CustomFont.fontWeight500 }}>Payment via {this.state.billingDetailsState ? this.state.billingDetailsState.paymentmode : ""}</Text>
                                        <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.patientSearchName, fontWeight: CustomFont.fontWeight500 }}>-Rs {this.state.billingDetailsState && this.state.billingDetailsState.paymentmode ? this.state.billingDetailsState.totalAmount : '0'}</Text>
                                    </View>
                                    <View style={{ marginTop: responsiveHeight(2), height: .75, backgroundColor: '#DDD0F6' }}>

                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(2) }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.patientSearchName }}>Due Amount</Text>
                                        {this.state.billingDetailsState != null && this.state.billingDetailsState.billingStatus == 'Paid' ?
                                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.patientSearchName }}>Rs 0</Text>
                                            : <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.patientSearchName }}>Rs {this.state.billingDetailsState && this.state.billingDetailsState.totalAmount ? this.state.billingDetailsState.totalAmount : '0'}</Text>}
                                    </View>
                                </View>
                            </View>

                            <View style={{ marginBottom: 5, marginTop: responsiveHeight(2) }}>
                                <View style={{ flex: 1, backgroundColor: Color.white, padding: 5, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, }}>
                                    <Text style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.patientSearchName }}>Private Notes</Text>
                                    <TextInput returnKeyType="done"
                                        onFocus={() => this.callOnFocus('8')}
                                        onBlur={() => this.callOnBlur('8')}
                                        placeholderTextColor={Color.placeHolderColor}
                                        style={{ borderWidth: 1, borderColor: this.state.fld8, padding: 10, height: responsiveHeight(10), fontSize: CustomFont.font14, borderRadius: 5, marginLeft: responsiveHeight(1.5), marginRight: responsiveHeight(1.5), textAlignVertical: 'top', color: Color.optiontext, marginTop: 10 }}
                                        placeholder="Enter notes here" multiline={true} value={this.state.notesData} onChangeText={notesData => {
                                            if (notesData) {
                                                if (Validator.isSpecialCharValidateNotes(notesData)) {
                                                    this.setState({ notesData });
                                                }
                                            } else
                                                this.setState({ notesData });
                                        }} maxLength={560} blurOnSubmit={true} />
                                    <View style={{ alignItems: 'flex-end', marginBottom: responsiveHeight(1) }}>
                                        <Text style={{ fontSize: CustomFont.font10, color: Color.fontColor, marginRight: responsiveHeight(3), marginTop: 5, opacity: .4 }}>{this.state.notesData ? this.state.notesData.length : ''} / 2000</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={{ flexDirection: 'row', padding: 10, backgroundColor: Color.white, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.completeConsultation('withOutNotification');
                            }}
                            style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, flex: 1, height: responsiveHeight(6) }}>
                            <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>Print Rx</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.completeConsultation('withNotification'); }}
                            style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, flex: 1, height: responsiveHeight(6), flexDirection: 'row' }}>
                            {/* <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>Send on</Text> */}
                            <Image source={whatsapp_icon} style={{ height: responsiveFontSize(3.2), width: responsiveFontSize(3.2), resizeMode: 'contain', marginLeft: 5 }} />
                            {/* <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600, marginLeft: 5 }}>&</Text> */}
                            {/* <Image source={message_complete} style={{ height: responsiveFontSize(2.2), width: responsiveFontSize(2.2), resizeMode: 'contain', marginLeft: 5 }} /> */}
                        </TouchableOpacity>
                        {this.state.showHomeBtn ? <TouchableOpacity onPress={() => { this.props.navigation.navigate('DoctorHome') }}
                            style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, flex: 1, height: responsiveHeight(6) }}>
                            <Image source={home_done} style={{ height: responsiveFontSize(3.2), width: responsiveFontSize(3.2), resizeMode: 'contain', marginLeft: 5,tintColor:Color.white }} />
                        </TouchableOpacity> : null}

                    </View>

                    <Modal isVisible={this.state.CompleteModal}
                        onRequestClose={() => this.setState({ CompleteModal: false })}>
                        <View style={[styles.modelViewMessage2]}>
                            <Image source={OK} style={{ height: 65, width: 65, marginTop: 30 }} />
                            <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>
                                {this.state.modelMessage}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Trace.stopTrace()
                                    this.setState({ CompleteModal: false });
                                    DRONA.setShowAppoinmentCompleteMsg(1);
                                    this.props.navigation.navigate('DoctorHome');
                                }}
                                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
                            </TouchableOpacity>

                        </View>
                    </Modal>
                    <Modal isVisible={this.state.successPdfGeneration}
                        onRequestClose={() => this.setState({ successPdfGeneration: false })}>
                        <View style={[styles.modelViewMessage2]}>
                            <Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
                            <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                                File successfully downloaded
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ successPdfGeneration: false });
                                }}
                                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    signupDetails: state.signupReducerConfig.signupDetails,
    responseData: state.apiResponseDataConfig.responseData,
    loading: state.apiResponseDataConfig.loading,
});

const ActionCreators = Object.assign(
    {},
    apiActions, signupActions
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(BillingComplete);
