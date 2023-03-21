import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar, Alert, Image, TouchableOpacity,ScrollView, FlatList, Platform, BackHandler, TextInput
} from 'react-native';
import Color from '../../../components/Colors';
import CloseIcon from '../../../../assets/cross.png';
import CrossIcon from '../../../../assets/close_white1.png';
import AddIcon from '../../../../assets/plus_blue.png';
import cross_red from '../../../../assets/cross_red.png';
import CommonStyle from '../../../components/CommonStyle.js';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import { Calendar } from 'react-native-calendars';
import styles from './style';
import Modal from 'react-native-modal';
import TakeAPhotoIcon from '../../../../assets/ic_camera.png';
import UploadPhotoIcon from '../../../../assets/ic_gallery.png';
import UploadFileIcon from '../../../../assets/ic_upload.png';
import DocumentPicker from 'react-native-document-picker';
import PdfIcon from '../../../../assets/fileimg/pdficon.png';
import CalenderIcon from '../../../../assets/calender_icon.png';
import CustomFont from '../../../components/CustomFont';
import Toolbar from '../../../customviews/Toolbar.js';


import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNFS from 'react-native-fs';
import Moment from 'moment';
let tempImageArr = [];
let isFirstAdd = 0;
let galArr = [];
import MultipleImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import Snackbar from 'react-native-snackbar';
import { setLogEvent } from '../../../service/Analytics';

let recordGuid;
let selectedDay = '';
var progressTimer = null;
import Trace from '../../../service/Trace'
let timeRange = '';
class AddFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            date: '',
            recordTitle: '',
            showCalender: false,
            isModalShow: false,
            showDiscard: false,
            dateSendToServer: '',
            isShowToast: false,
            showCalendar: false,
            fileDate: '',
            selectedRecordType: -1,
            recordTypeArr: [],
            showProgressModal: false,
            progessVal: .2,
            recordGuid: null,
            recordTypeGuid: '',
            fullAttachmentArr: [],
            titleBorderColor: Color.borderColor,
            buttonBoderWidth: 0,
        };
    }

    componentDidMount() {
    let { signupDetails } = this.props;
    timeRange = Trace.getTimeRange();
    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Add_File',  signupDetails.firebaseLocation)
    Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Add_File", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })


        let today = new Date();
        let tempDate = Moment(today).format('DD-MM-YYYY');
        this.setState({ fileDate: tempDate });
        selectedDay = today;
        // alert(selectedDay)
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        isFirstAdd = 0;
        tempImageArr = [];
        if (this.props.navigation.state.params.imageArr.length == 0) {
            recordGuid = this.props.navigation.state.params.recordGuid;
            // alert(recordGuid)
            this.callAPIForEditRecordDetails(recordGuid);
        }
        else {
            setTimeout(() => {
                recordGuid = null;
                this.callAPIForEditRecordDetails(recordGuid);
                let tempArr = [];
                // tempArr = [...this.props.navigation.state.params.imageArr];
                let tempRecordArr = [...this.props.navigation.state.params.imageArr];
                //console.log(i+'-------'+JSON.stringify(tempObj.size))
                for (let i = 0; i < tempRecordArr.length; i++) {
                    let tempObj = {};
                    let dataObj = tempRecordArr[i];
                    tempObj.uri = dataObj.uri;
                    tempObj.attachmentGuid = null;
                    tempObj.recordGuid = null
                    tempObj.orgFileName = null
                    tempObj.orgFileExt = null
                    tempObj.sysFileName = null
                    tempObj.sysFileExt = null
                    tempObj.fileBytes = null
                    tempObj.sysFilePath = null
                    tempObj.delMark = null
                    tempObj.DelMark = 0;
                    tempObj.uploadedOnCloud = null;
                    tempObj.type = dataObj.type;
                    tempObj.size = dataObj.size;
                    tempObj.imgExtn = dataObj.imgExtn;
                    tempArr.push(tempObj)

                }
                tempImageArr = tempArr;
                tempArr.push('##');
                this.setState({ data: tempArr });
                //Newly Added
                this.setState({ fullAttachmentArr: tempArr })
            }, 500);
        }
    }
   

    callIsFucused = () => {
        this.setState({ titleBorderColor: Color.primary })
    }
    callIsBlur = () => {
        this.setState({ titleBorderColor: Color.inputdefaultBorder })
    }
    callAPIForEditRecordDetails = (recordGuid) => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": null,
            "Version": "",
            "Data": {
                "AppointmentGuid": signupDetails.appoinmentGuid,
                "RecordGuid": recordGuid
            }
        };
        actions.callLogin('V1/FuncForDrAppToGetEditPatientRecord', 'post', params, signupDetails.accessToken, 'editrecorddetails');

    }
    componentWillUnmount() {
        Trace.stopTrace()
        if(progressTimer)
        clearInterval(progressTimer);
        this.backHandler.remove();
    }

    handleBackPress = () => {
        this.setState({ showDiscard: true })
        // this.props.navigation.goBack();
        return true;
    }

    add = () => {
        this.setState({ isModalShow: true })
    }
    hideAddPopup = () => {
        this.setState({ isModalShow: false })
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let data = newProps.responseData.data;
            if (tagname === 'editrecorddetails') {
                if (newProps.responseData.statusCode === '0') {
                    // alert(JSON.stringify(data))
                    if (data != null) {
                        // alert(recordGuid)
                        if (recordGuid != null) {
                            this.setState({ recordTitle: data.recordTitle });
                            let tempDateArr = data.recordDate.split(' ');
                            let showDate = Moment(tempDateArr[0]).format('DD-MM-YYYY');
                            this.setState({ fileDate: showDate });
                            selectedDay = Moment(tempDateArr[0]).format('YYYY-MM-DD');
                            this.setState({ recordGuid: data.recordGuid })

                            let tempArr = [];
                            // let dataMadeArr = [];
                            for (let i = 0; i < data.attachment.length; i++) {
                                let tempObj = {};
                                let dataObj = data.attachment[i];
                                tempObj.uri = dataObj.attachmentUrl;
                                tempObj.attachmentGuid = dataObj.attachmentGuid;
                                tempObj.recordGuid = dataObj.recordGuid
                                tempObj.orgFileName = dataObj.orgFileName
                                tempObj.orgFileExt = dataObj.orgFileExt
                                if (dataObj.orgFileExt != '.pdf') {
                                    tempObj.type = 'image';
                                }
                                else {
                                    tempObj.type = 'doc';
                                }
                                // As per instruction from backend
                                tempObj.sysFileName = dataObj.attachmentGuid
                                tempObj.sysFileExt = dataObj.sysFileExt
                                tempObj.fileBytes = dataObj.fileBytes
                                tempObj.sysFilePath = dataObj.sysFilePath
                                tempObj.delMark = dataObj.delMark
                                tempObj.DelMark = 0;
                                tempObj.uploadedOnCloud = dataObj.uploadedOnCloud;
                                tempArr.push(tempObj)

                            }
                            for (let j = 0; j < data.recordType.length; j++) {
                                if (data.recordType[j].isSelected) {
                                    this.setState({ selectedRecordType: j });
                                    this.setState({ recordTypeGuid: data.recordType[j].recordTypeGuid });
                                }

                            }
                            tempArr.push('##');
                            tempImageArr = [...tempArr];
                            this.setState({ data: tempArr, recordTypeArr: data.recordType });
                            this.setState({ fullAttachmentArr: tempArr });
                        }
                        else {
                            this.setState({ recordTypeArr: data.recordType });
                            // this.setState({recordTypeGuid : data.recordType[0].recordTypeGuid});
                        }


                    }
                }
                else {
                    alert('Some error occured, please try again later.')
                }

            } else if (tagname === 'saveandedit') {
                if (newProps.responseData.statusCode === '0') {
                    let data = newProps.responseData.data;
                    if (data != null) {
                        // setTimeout(() => {
                        //     this.setState({ progessVal: 1 })
                        // }, 4000);
                        let i=0;
                        progressTimer =  setInterval(() => {
                            i = i + 1;
                            let temp = parseFloat(i/10); 
                            this.setState({ progessVal: temp })
                          }, 600);
                        setTimeout(() => {
                            this.setState({ showProgressModal: false });
                            this.props.navigation.goBack();
                        }, 5000);
                        setLogEvent("add_files")
                    }
                }

            }
        }
    }
    openCamera = () => {
        MultipleImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
            compressImageQuality: .5
        }).then(image => {
            this.hideAddPopup();
            this.handleCameraGalleryImage(image);
            //console.log('---image-'+JSON.stringify(image));
        });
    }
    handleCameraGalleryImage = (response) => {
        let fileExtFromBase64=response.data && response.data.startsWith("iV") ?'.png':'.jpeg'
        const source = { uri: 'data:image/jpeg;base64,' + response.data, type: 'image',size : response.size,imgExtn: fileExtFromBase64 };
        let tempObj = {};
                tempObj.uri = source.uri;
                tempObj.attachmentGuid = null;
                tempObj.recordGuid = null
                tempObj.orgFileName = null
                tempObj.orgFileExt = null
                tempObj.sysFileName = null
                tempObj.sysFileExt = null
                tempObj.fileBytes = null
                tempObj.sysFilePath = null
                tempObj.delMark = null
                tempObj.DelMark = 0;
                tempObj.uploadedOnCloud = null;
                tempObj.type = source.type;
                tempObj.size = source.size;
                tempObj.imgExtn = source.imgExtn;
                if (isFirstAdd === 0) {
                    isFirstAdd = 1;
                    galArr = [...tempImageArr];
                    galArr.splice(galArr.length - 1, 0, tempObj)
                }
                else {
                    galArr.splice(galArr.length - 1, 0, tempObj)
                }
                // this.setState({ data: galArr });
                this.setState({ fullAttachmentArr: galArr });
                //
                let tempArr = [];
                for (let k = 0; k < galArr.length - 1; k++) {
                    let tempObj = {};
                    tempObj = galArr[k];
                    if (tempObj.DelMark == 0) {
                        tempArr.push(tempObj);
                    }
                }
                tempArr.push('##');
                this.setState({ data: tempArr });
    }
    openGallery = () => {
        // NEW CODE
        let imagArr = [];
        // this.setState({ data: [] });
        MultipleImagePicker.openPicker({
            // cropping: true,
            mediaType: "photo",
            includeBase64: true,
            multiple: true,
            compressImageQuality: Platform.OS === 'ios' ? .3 : .4,
        }).then(image => {
            this.hideAddPopup();
            // if(image && image.length>0 && (image[0].path.includes('jpg') || image[0].path.includes('jpeg') || image[0].path.includes('png'))){
            // }else{
            // }
            for (let i = 0; i < image.length; i++) {
                let source = { uri: 'data:image/jpeg;base64,' + image[i].data, type: 'image',size: image[i].size, imgExtn: image[i].mime };

                let tempObj = {};
                tempObj.uri = source.uri;
                tempObj.attachmentGuid = null;
                tempObj.recordGuid = null
                tempObj.orgFileName = null
                tempObj.orgFileExt = null
                tempObj.sysFileName = null
                tempObj.sysFileExt = null
                tempObj.fileBytes = null
                tempObj.sysFilePath = null
                tempObj.delMark = null
                tempObj.DelMark = 0;
                tempObj.uploadedOnCloud = null;
                tempObj.type = source.type;
                tempObj.size = source.size;
                tempObj.imgExtn = source.imgExtn;

                if (isFirstAdd === 0) {
                    isFirstAdd = 1;
                    // alert(tempImageArr.length)
                    galArr = [...tempImageArr];
                    galArr.splice(galArr.length - 1, 0, tempObj);
                }
                else {
                    galArr.splice(galArr.length - 1, 0, tempObj)

                }
                // this.setState({ data: galArr });
                this.setState({ fullAttachmentArr: galArr });
               

            }
            //
            let tempArr = [];
            for (let k = 0; k < galArr.length - 1; k++) {
                let tempObj = {};
                tempObj = galArr[k];
                if (tempObj.DelMark == 0) {
                    tempArr.push(tempObj);
                }
            }
            tempArr.push('##');
            this.setState({ data: tempArr });
            //
        });
    }
    openDocuments = async () => {
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf]
            })
                .then(res => {
                    this.hideAddPopup();
                    for (let i = 0; i < res.length; i++) {
                        RNFS.readFile(res[i].uri, "base64").then(result => {

                            const source = { uri: result, type: 'doc',size : res[i].size };
                            //
                            let tempObj = {};
                            tempObj.uri = source.uri;
                            tempObj.attachmentGuid = null;
                            tempObj.recordGuid = null
                            tempObj.orgFileName = null
                            tempObj.orgFileExt = null
                            tempObj.sysFileName = null
                            tempObj.sysFileExt = null
                            tempObj.fileBytes = null
                            tempObj.sysFilePath = null
                            tempObj.delMark = null
                            tempObj.DelMark = 0;
                            tempObj.uploadedOnCloud = null;

                            // alert(source.type)
                            tempObj.type = source.type;
                            tempObj.size = source.size;
                            //
                            if (isFirstAdd === 0) {
                                isFirstAdd = 1;
                                galArr = [...tempImageArr]
                                galArr.splice(galArr.length - 1, 0, tempObj)
                            }
                            else {
                                galArr.splice(galArr.length - 1, 0, tempObj)
                            }

                            //
                            let tempArr = [];
                            for (let k = 0; k < galArr.length - 1; k++) {
                                let tempObj = {};
                                tempObj = galArr[k];
                                if (tempObj.DelMark == 0) {
                                    tempArr.push(tempObj);
                                }
                            }
                            tempArr.push('##');
                            this.setState({ data: tempArr });
                            //

                            //this.setState({ data: galArr });
                            this.setState({ fullAttachmentArr: galArr });
                        })
                    }

                })
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }

    cancelPress = () => {
        this.setState({ showDiscard: false })
    }
    discardPress = () => {
        this.setState({ showDiscard: false })
        this.props.navigation.goBack()
    }
    deleteImage = (item, index) => {
        // alert(index )
        let tempArr = [...this.state.data];
        tempArr.splice(index, 1)
        this.setState({ data: tempArr });
        //  tempImageArr = [...this.state.data];
        //  setTimeout(() => {
        //     tempImageArr = [...this.state.data];
        //  }, 500);
        for (let i = 0; i < this.state.fullAttachmentArr.length; i++) {
            // let tempObj = this.state.data[i];
            let tempObj = this.state.fullAttachmentArr[i];
            if (item.attachmentGuid != null) {
                if (item.attachmentGuid == tempObj.attachmentGuid) {
                    let tempAttchArr = this.state.fullAttachmentArr;
                    // To make DelMark to 1
                    let tempObj = this.state.fullAttachmentArr[i];
                    tempObj.uri = tempObj.uri;
                    tempObj.attachmentGuid = tempObj.attachmentGuid;
                    tempObj.recordGuid = null
                    tempObj.orgFileName = null
                    tempObj.orgFileExt = tempObj.orgFileExt
                    tempObj.sysFileName = null
                    tempObj.sysFileExt = tempObj.orgFileExt
                    tempObj.fileBytes = null
                    tempObj.sysFilePath = null
                    tempObj.delMark = null
                    tempObj.DelMark = 1;
                    tempObj.uploadedOnCloud = null;
                    //
                    tempAttchArr.splice(i, 1, tempObj);
                    this.setState({ fullAttachmentArr: tempAttchArr });
                    break;
                }
            }
            else {
                if (item.attachmentGuid == tempObj.attachmentGuid) {
                    let tempAttchArr = this.state.fullAttachmentArr;
                    tempAttchArr.splice(i, 1);
                    this.setState({ fullAttachmentArr: tempAttchArr });
                    break;
                }

            }
        }

        //  setTimeout(() => {
        //     tempImageArr = [...this.state.data];
        //  }, 500);

        setTimeout(() => {
            tempImageArr = [...this.state.fullAttachmentArr];
            // alert(tempImageArr.length);

        }, 500);
        // setTimeout(() => {
        //     console.log('output :' + JSON.stringify(this.state.fullAttachmentArr));
        // }, 500);

    }

    removeImage = (item, index) => {
        Alert.alert(
            "Delete Message",
            "Are you sure to delete?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log(""),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.deleteImage(item, index) }
            ]
        );



        //  let tempArr = [...this.state.data];
        //  tempArr.splice(index, 1)
        //  this.setState({data : tempArr});
        // //  tempImageArr = [...this.state.data];
        //  setTimeout(() => {
        //     tempImageArr = [...this.state.data];
        //  }, 500);
        // for(let i = 0 ; i < this.state.fullAttachmentArr.length ; i++){
        //     // let tempObj = this.state.data[i];
        //     let tempObj = this.state.fullAttachmentArr[i];
        //     if(item.attachmentGuid != null)
        //     {
        //         console.log('bear')
        //         if(item.attachmentGuid == tempObj.attachmentGuid){
        //             let tempAttchArr = this.state.fullAttachmentArr;
        //             // To make DelMark to 1
        //             let tempObj = this.state.fullAttachmentArr[i];
        //             tempObj.uri = tempObj.uri;
        //             tempObj.attachmentGuid = tempObj.attachmentGuid;
        //             tempObj.recordGuid = null
        //             tempObj.orgFileName = null
        //             tempObj.orgFileExt = tempObj.orgFileExt
        //             tempObj.sysFileName = null
        //             tempObj.sysFileExt = tempObj.orgFileExt
        //             tempObj.fileBytes = null
        //             tempObj.sysFilePath = null
        //             tempObj.delMark = null
        //             tempObj.DelMark = 1;
        //             tempObj.uploadedOnCloud = null;
        //             //
        //             tempAttchArr.splice(i, 1, tempObj);
        //             this.setState({fullAttachmentArr : tempAttchArr});
        //             break;
        //         }
        //     }
        //     else{
        //         if(item.attachmentGuid == tempObj.attachmentGuid){
        //             console.log('yes')
        //             let tempAttchArr = this.state.fullAttachmentArr;
        //             tempAttchArr.splice(i, 1);
        //             this.setState({fullAttachmentArr : tempAttchArr});
        //             break;
        //         }

        //     }
        // }
        // setTimeout(() => {
        //     console.log('output :' + JSON.stringify(this.state.fullAttachmentArr));
        // }, 500);
    }
    typeTitle = (text) => {
        this.setState({ recordTitle: text })
    }
    typeDate = (text) => {
        // alert(text)  
    }
    openCalender = () => {
        this.setState({ showCalendar: true })
    }
    selectRecordType = (item, index) => {
        this.setState({ recordTypeGuid: item.recordTypeGuid });
         //alert(item.recordTypeGuid)
        this.setState({ selectedRecordType: index });
    }
    submitPress = () => {
        // let totalImageSizeInBytes = 0;
        // let sizeInMb =0;
        // try {
        //     for(let i = 0 ; i <= this.state.data.length - 2 ; i++){
        //         let tempObj = this.state.data[i];
        //         totalImageSizeInBytes = totalImageSizeInBytes + tempObj.size;
        //     }
        //      sizeInMb = totalImageSizeInBytes/1000000;
        // } catch (error) {
            
        // }
        
        //alert(sizeInMb);
        if (this.state.recordTitle == '') {
            Snackbar.show({ text: 'Please Enter Record Title', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (this.state.fileDate == '') {
            Snackbar.show({ text: 'Please Enter Record Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (this.state.recordTypeGuid == '') {
            Snackbar.show({ text: 'Please Select Record Type', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (this.state.data.length <= 1) {
            Snackbar.show({ text: 'Please select at least one file', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        // else if (sizeInMb > 10) {
        //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        // }
        else {
            let { actions, signupDetails } = this.props;
            let sendDataArr = [];
            for (let i = 0; i < this.state.fullAttachmentArr.length - 1; i++) {
                let tempbase64 = ''
                let tempFileExt = '.jpeg';
                let attachmentUrl = null;
                let attachGuid = null;
                let sysFileName = null;
                if (this.state.fullAttachmentArr[i].attachmentGuid == null) {
                    if (this.state.fullAttachmentArr[i].uri.indexOf('data:image/jpeg;base64,') > -1) {
                        let tempArr = this.state.fullAttachmentArr[i].uri.split('data:image/jpeg;base64,');
                        if (tempArr.length > 1) {
                            tempbase64 = tempArr[1];
                        }
                    //     let fileExtArr = this.state.fullAttachmentArr[i].imgExtn.split("/");
                    // let fileExt = '.' + fileExtArr[1];
                   // tempFileExt = '.png';
                     //tempFileExt  = fileExt;
                     //tempFileExt  = '.jpeg';
                    }
                    else {
                        tempbase64 = this.state.fullAttachmentArr[i].uri;
                        tempFileExt = '.pdf'
                    }
                    attachmentUrl = null;
                    attachGuid = null;
                    sysFileName = 'test' + i;
                }
                else {
                    attachmentUrl = this.state.fullAttachmentArr[i].uri;
                    attachGuid = this.state.fullAttachmentArr[i].attachmentGuid;
                    sysFileName = this.state.fullAttachmentArr[i].attachmentGuid;
                    tempbase64 = null;
                    tempFileExt = this.state.fullAttachmentArr[i].orgFileExt
                }
                let tempObj = {};
                tempObj.attachmentGuid = attachGuid;
                tempObj.OrgFileExt = tempFileExt
                tempObj.OrgFileName = 'test' + i+tempFileExt;

                // Previous 
                //  tempObj.SysFileName = null;
                // tempObj.SysFileExt = null;
                // As per instruction from backend
                tempObj.SysFileName = sysFileName;
                tempObj.SysFileExt = tempFileExt;
                //
                tempObj.FileBytes = tempbase64; //this.state.data[i].uri;
                tempObj.AttachmentUrl = attachmentUrl;
                tempObj.UploadedOnCloud = 0;
                tempObj.DelMark = this.state.fullAttachmentArr[i].DelMark
                sendDataArr.push(tempObj);
            }
            let sendFileDate = Moment(selectedDay).format('YYYY-MM-DD');
            // alert(sendFileDate)
            let params = {
                "RoleCode": signupDetails.roleCode,
                "DoctorGuid": signupDetails.doctorGuid,
                "UserGuid": signupDetails.UserGuid,
                "Version": null,
                "Data":
                {
                    PatientGuid: signupDetails.patientGuid,
                    RecordGuid: this.state.recordGuid,
                    AppointmentGuid: signupDetails.appoinmentGuid,
                    RecordTitle: this.state.recordTitle,
                    RecordDate: sendFileDate,
                    RecordTypeGuid: this.state.recordTypeGuid,
                    ListOfAttachments: sendDataArr
                }
            }
            this.setState({ showProgressModal: true });
            actions.callLogin('V11/FuncForDrAppToAddPatientRecord_V2', 'post', params, signupDetails.accessToken, 'saveandedit');
            
            setLogEvent("files", { "upload_files": "upload", UserGuid: signupDetails.UserGuid, })

        }

    }
    renderList = (item, index) => {
        return (
            <TouchableOpacity style={[styles.rowView, {
                borderWidth: 1,
                borderColor: this.state.selectedRecordType === index ?
                    Color.weekdaycellPink : Color.createInputBorder,
                backgroundColor: this.state.selectedRecordType === index ? Color.goldPink : Color.white, marginStart: index == 0 ? 0 : 10
            }]} onPress={() => this.selectRecordType(item, index)}>
                {/* <View style={styles.circle} /> */}
                <Text style={[styles.cName, { color: Color.optiontext }]}>{item.recordTypeName}</Text>
            </TouchableOpacity>
        )
    }

    hideCalender = () => {
        this.setState({ showCalendar: false })
    }
    dateSelected = () => {
        let showDate = Moment(selectedDay).format('DD-MM-YYYY');
        this.setState({ fileDate: showDate, showCalendar: false })
    }

    render() {
        return (
            <SafeAreaView style={[CommonStyle.container, { backgroundColor: Color.bgColor }]}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
                <Toolbar
                    title={"Add File Details"}
                    onBackPress={() => {
                        this.handleBackPress()
                    }} />

                <View style={styles.container}>
                    {/* <View style={{ backgroundColor: Color.primary, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.handleBackPress()} >
                            <Image source={arrowBack} style={styles.backImage} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Add File Details</Text>
                    </View> */}

                    <ScrollView  keyboardShouldPersistTaps='always'>
                        <View style={{ marginBottom: 24 }}>
                            <View style={{ marginTop: 24, height: responsiveHeight(25) }}>
                                <FlatList
                                    extraData={this.state}
                                    data={this.state.data}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginTop: 10 }}
                                    ItemSeparatorComponent={this.ItemSeparatorView}
                                    renderItem={({ item, index }) => (
                                        index === this.state.data.length - 1 ?
                                            <TouchableOpacity onPress={this.add} >
                                                <View style={styles.previewadd}>
                                                    <Image source={AddIcon} style={{ height: 30, width: 30 }} />
                                                    <Text style={styles.add}>Add File</Text>
                                                </View>
                                            </TouchableOpacity>
                                            : <View style={[styles.preview, { marginStart: index == 0 ? responsiveWidth(5) : responsiveWidth(8) }]}>
                                                {item.type === 'image' ? <View style={{ padding: 10 }}><Image source={{ uri: item.uri }} style={{ borderRadius: 5, height: 80, width: 80 }} /></View> : <View style={{ padding: 10 }}><Image source={PdfIcon} style={{ height: 80, width: 80, borderRadius: 5 }} /></View>}
                                                <TouchableOpacity onPress={() => {
                                                    let { signupDetails } = this.props;
                                                    setLogEvent("files", { "delete_files": "click", UserGuid: signupDetails.UserGuid, })
                                                    this.removeImage(item, index)
                                                }}  style={styles.imgcross}>
                                                    <Image style={{ height: 16, width: 16 }} source={CrossIcon} />
                                                </TouchableOpacity>
                                            </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            <View style={{ backgroundColor: Color.white, borderRadius: 10, marginStart: 16, marginEnd: 16, padding: 16 }}>
                                <View style={{ marginTop: 0, marginLeft: responsiveWidth(0), marginRight: responsiveWidth(0) }}>
                                    <Text style={styles.titletxt}>Title *</Text>
                                    <TextInput returnKeyType="done" onFocus={this.callIsFucused}  placeholderTextColor = {Color.placeHolderColor}
                                        onBlur={this.callIsBlur} value={this.state.recordTitle} onChangeText={this.typeTitle}
                                        style={[styles.input, { borderColor: this.state.titleBorderColor }]} placeholder="Enter Name" />

                                    <Text style={[styles.titletxt, { marginTop: 24 }]}>Date *</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput returnKeyType="done" placeholder={"DD/MM/YYYY"}  placeholderTextColor = {Color.placeHolderColor} editable={false} value={this.state.fileDate} onChangeText={this.typeDate}
                                            style={styles.inputdate} />
                                        <TouchableOpacity onPress={this.openCalender} style={{ position: 'absolute', right:  responsiveHeight(2), top: responsiveHeight(3.1) }}>
                                            <Image source={CalenderIcon} style={{ height: responsiveHeight(3), width: responsiveHeight(3) }} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <Text style={[styles.titletxt, { marginTop: 24 }]}>Record Type *</Text>
                                <FlatList
                                    style={{ marginTop: 8, marginBottom: 0 }}
                                    data={this.state.recordTypeArr}
                                    horizontal={true}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => this.renderList(item, index)}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                //onEndReached={this.loadMoreData}
                                />

                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.bottomBtnView} >
                        <TouchableOpacity onPress={this.submitPress} style={styles.submitbtn}>
                            <Text style={styles.submittxt}>Submit</Text>
                        </TouchableOpacity>
                    </View>


                    <Modal isVisible={this.state.isModalShow} avoidKeyboard={true}>
                        <View style={styles.modelView}>
                            <View style={{ marginBottom: 22, flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, }}>
                                <Text style={styles.addtxt}>Add File</Text>
                                <TouchableOpacity style={styles.crossbtn} onPress={() => this.setState({ isModalShow: !this.state.isModalShow, buttonBoderWidth: 0 })}>
                                    <Image style={styles.closeIcon} source={CloseIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rowShare}>
                                <TouchableOpacity style={styles.btn} onPress={this.openCamera}>
                                    <Image style={styles.optionimg} source={TakeAPhotoIcon} />
                                    <Text style={styles.optiontxt}>Take a photo</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.divider} />

                            <View style={styles.rowShare}>
                                <TouchableOpacity style={styles.btn} onPress={this.openGallery}>
                                    <Image style={styles.optionimg} source={UploadPhotoIcon} />
                                    <Text style={styles.optiontxt}>Upload from gallery</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.divider} />

                            <View style={styles.rowShare}>
                                <TouchableOpacity style={styles.btn} onPress={this.openDocuments}>
                                    <Image style={styles.optionimg} source={UploadFileIcon} />
                                    <Text style={styles.optiontxt}>Upload files</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.showDiscard}>
                        <View style={styles.modelViewDiscard}>
                            <View style={styles.rowDiscard}>
                                <Text style={[styles.modalHeading,{marginTop:20}]}>All data added here will be discarded.</Text>
                                <View style={{ marginRight: 20, flexDirection: 'row', marginTop: Platform.OS === 'android' ? responsiveHeight(3) : responsiveHeight(2) }}>
                                    <View style={{ flex: 1.4, alignItems: 'flex-end' }}>
                                        <Text onPress={this.cancelPress} style={{ color: Color.primary, fontFamily: CustomFont.fontName, fontSize: CustomFont.font18 }}>Cancel</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text onPress={this.discardPress} style={{ color: Color.primary, fontFamily: CustomFont.fontName, fontSize: CustomFont.font18 }}>Discard</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal isVisible={this.state.showCalendar} >
                        <View style={{ backgroundColor: Color.white }}>
                            <Calendar
                                // minDate={'2012-05-10'}
                                maxDate={new Date()}
                                current={new Date()}
                                firstDay={1}

                                // hideDayNames={true}
                                theme={{
                                    monthTextColor: Color.primary,
                                    arrowColor: Color.primary,
                                    todayTextColor: Color.primary,
                                    selectedDayTextColor: Color.white,
                                    selectedDayBackgroundColor: Color.liveBg,
                                }}
                                markedDates={{
                                    [this.state.fileDate]: { selected: true },
                                }}
                                onDayPress={day => {
                                    selectedDay = day.dateString
                                    // let showDate = Moment(selectedDay).format('DD-MM-YYYY');
                                    this.setState({ fileDate: day.dateString })
                                }}
                            //hideDayNames={true}
                            //minDate={new Date()}
                            />
                            <View style={{ width: responsiveWidth(80), marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={this.hideCalender} style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderWidth: 1, borderColor: Color.otpInputBorder, padding: responsiveWidth(2), minWidth: responsiveWidth(22) }}>
                                    <Text style={{ color: Color.fontColor }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.dateSelected} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Color.primary, marginLeft: 40, padding: responsiveWidth(2), borderRadius: 5, minWidth: responsiveWidth(22) }}>
                                    <Text style={{ color: Color.white }}>Done</Text>
                                </TouchableOpacity>
                            </View></View>
                    </Modal>

                    <Modal style={{ justifyContent: 'center', alignItems: 'center' }}
                        isVisible={this.state.showProgressModal} >
                        <View style={styles.progresspopup}>
                            <TouchableOpacity style={{position:'absolute',top:responsiveHeight(6),right:0}} onPress={()=>{
                                this.setState({ showProgressModal: false });
                                this.props.navigation.goBack();
                            }}>
<Image source={cross_red} style={{height:responsiveFontSize(3),width:responsiveFontSize(3),resizeMode:'contain',margin:20}}/>
                            </TouchableOpacity>
                            <Text style={styles.fileuploadheader}>{ }{this.state.data.length - 1}  {this.state.data.length > 2 ? 'files' : 'file'} uploading...</Text>
                            <Progress.Bar
                                size={responsiveWidth(20)}
                                progress={this.state.progessVal}
                                color={Color.green}
                                unfilledColor={Color.divider}
                                borderWidth={0}
                                height={responsiveHeight(1)}
                                width={responsiveWidth(60)}
                                style={styles.progress} />
                            <Text style={styles.fileuploadtxt}>this may take time, please wait</Text>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    };
}
// export default AddPrescriptions;

// ** Redux Functionality **//
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
)(AddFiles);
