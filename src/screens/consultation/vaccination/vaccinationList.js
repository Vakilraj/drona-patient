import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar, TouchableOpacity, Image, BackHandler, SectionList, FlatList, TextInput, Alert
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
import AddIcon from '../../../../assets/plus_blue.png';
import CloseIcon from '../../../../assets/cross.png';
import arrowBack from '../../../../assets/back_blue.png';
import searchBlue from '../../../../assets/search_blue.png';
import MultipleImagePicker from 'react-native-image-crop-picker';
import plus_new from '../../../../assets/plus_new.png';
import vac_tick from '../../../../assets/vac_tick.png';
import RNFS from 'react-native-fs';

import vacIcon from '../../../../assets/vaccine.png';
import clockOrangeIcon from '../../../../assets/clock_orange.png';
import crossRed from '../../../../assets/cross_red.png';
import editIcon from '../../../../assets/edit_new_blue.png';
import vac_frame from '../../../../assets/vac_frame.png';
import CrossIcon from '../../../../assets/close_white1.png';
import blank_vaccination from '../../../../assets/blank_vaccination.png';
import Color from '../../../components/Colors';
import cross_new from '../../../../assets/cross_blue.png';
import CommonStyle from '../../../components/CommonStyle.js';
import Moment from 'moment';
import styles from './style';
import CustomFont from '../../../components/CustomFont';
import { setApiHandle } from "../../../service/ApiHandle"
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from 'react-native-responsive-dimensions';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TakeAPhotoIcon from '../../../../assets/ic_camera.png';
import UploadPhotoIcon from '../../../../assets/ic_gallery.png';
import UploadFileIcon from '../../../../assets/ic_upload.png';
import DocumentPicker from 'react-native-document-picker';
import PdfIcon from '../../../../assets/fileimg/pdficon.png';
import CalenderIcon from '../../../../assets/calender_icon.png';
import _ from 'lodash';
import { NavigationEvents } from 'react-navigation';
import Snackbar from 'react-native-snackbar';
import Trace from '../../../service/Trace';

let selectedDay = '', selectedDayDue = '', currentDate = '', selectedDayReformat = '', selectedDayReformatDue = '';
let billingDetailsFullArray = [];
let galArr = [];
let vaccineArrayHolder = [];
let isFirstAdd = 0;
let isAddOrEdit = 'add';
let tempArr = [];
let attachmentGuidArr = [];
let item = null, clickFlag = 0, selectedChildIndex = 0;


class vaccinationHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vaccineArray: [],
            addModalOpen: false,
            isModalShows: false,
            isModalVisibleCalendars: false,
            showSelectedDay: 'DD/MM/YYYY',
            showDueDay: 'DD/MM/YYYY',
            isModalVisibleCalendarDue: false,
            tempData: [{}],
            // tempData:[],
            fullAttachmentArr: [],
            brandName: '',
            batchNumber: '',
            vaccineName: '',
            searchTxt: '',
            vaccineId: '',
            recordId: '',
            intervalId: '',
            patientVaccinationId: '',
            isVaccineNameEditable: false,
            editDataArr: [],

            groupType: '',
            groupTypeGuid: '',
            showSearchStatus: false,

        }
        selectedChildIndex = 0;
        clickFlag = 0;
    }

    componentDidMount() {
        
        let { signupDetails } = this.props;
        let timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +'Vaccination_List',  signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Vaccination_List", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { navigation } = this.props;
            navigation.goBack();
            navigation.state.params.Refresh();
        })
        tempArr = [];
        item = this.props.navigation.state.params.item;
        //this.getVaccinationList();

    }
    componentWillUnmount(){
        Trace.stopTrace()
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)
    }

    deleteImage = (item, index) => {
        if (isAddOrEdit == 'add') {
            let tempArr = [...this.state.tempData];
            tempArr.splice(index, 1)
            this.setState({ tempData: tempArr });
        }
        else if (isAddOrEdit == 'edit' && this.state.editDataArr.length > 0) {
            let tempRecordGuid = this.state.tempData[index].attachmentGuid;
            if (tempRecordGuid != null) {
                attachmentGuidArr.push(tempRecordGuid)
            }
            let tempArr = [...this.state.tempData];
            tempArr.splice(index, 1)
            this.setState({ tempData: tempArr });
            for (let j = 0; j < this.state.editDataArr.length; j++) {
                // alert(JSON.stringify(item.attachmentGuid))
                if (item.attachmentGuid != null) {
                    let tempObj = this.state.editDataArr[j];
                    if (item.attachmentGuid == tempObj.attachmentGuid) {
                        tempObj.DelMark = 1;
                    }
                    this.state.editDataArr.splice(j, 1, tempObj)
                }
            }
        }
        else {
            let tempArr = [...this.state.tempData];
            tempArr.splice(index, 1)
            this.setState({ tempData: tempArr });
        }
    }

    removeImage = (item, index) => {
        Alert.alert(
            "Delete Message",
            "Are you sure want to delete?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log(""),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.deleteImage(item, index) }
            ]
        );
    }

    openDocuments = async () => {
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf]
            })
                .then(res => {
                    this.hideAddPopup();
                    tempArr = this.state.tempData; // Added Line
                    if (isFirstAdd != 0) {
                        tempArr.splice(tempArr.length - 1, 1)
                    }
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
                            tempObj.type = source.type;
                            tempObj.size = source.size;
                            tempArr.push(tempObj)

                            if (i == res.length - 1) {
                                if (isFirstAdd == 0) {
                                    this.state.tempData.splice(0, 1)
                                    isFirstAdd = 1;
                                }
                                tempArr.push('##');
                                this.setState({ tempData: tempArr });
                                //console.log('-------'+JSON.stringify(tempArr))
                            }
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
    openGallery = () => {
        MultipleImagePicker.openPicker({
            // cropping: true,
            includeBase64: true,
            multiple: true,
            compressImageQuality: Platform.OS === 'ios' ? .3 : .4,
        }).then(image => {
            this.hideAddPopup();
            tempArr = this.state.tempData; // Added Line
            if (isFirstAdd != 0) {
                tempArr.splice(tempArr.length - 1, 1)
            }
            for (let i = 0; i < image.length; i++) {
                let tempObj = {};
                let source = { uri: 'data:image/jpeg;base64,' + image[i].data, type: 'image',size: image[i].size,imgExtn: image[i].mime };
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
                tempArr.push(tempObj)
            }
            if (isFirstAdd == 0) {
                isFirstAdd = 1;
                this.state.tempData.splice(0, 1)
            }
            tempArr.push('##');
            this.setState({ tempData: tempArr });
        });
    }

    hideAddPopup = () => {
        this.setState({ isModalShows: false })
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

        tempArr = this.state.tempData; // Added Line
        if (isFirstAdd != 0) {
            tempArr.splice(tempArr.length - 1, 1)
        }
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
                tempArr.push(tempObj)
                if (isFirstAdd == 0) {
                    isFirstAdd = 1;
                    this.state.tempData.splice(0, 1)
                }
                tempArr.push('##');
                this.setState({ tempData: tempArr });

    }
    clickOnDone = () => {
        if (this.state.isModalVisibleCalendars) {
            if (selectedDayReformat.length > 0)
                this.setState({ showSelectedDay: selectedDayReformat })
            this.setState({ isModalVisibleCalendars: false });
        }
        if (this.state.isModalVisibleCalendarDue) {
            if (selectedDayReformatDue.length > 0)
                this.setState({ showDueDay: selectedDayReformatDue, })
            this.setState({ isModalVisibleCalendarDue: false });
        }
    }

    handleApi = (response, tag, statusMessage) => {
        if (tag === 'getvaccination') {
            let tempArr = [];
            tempArr = response.vaccinationInfoAgeWise ? response.vaccinationInfoAgeWise : []
            for (let i = 0; i < tempArr.length; i++) {
                let length = tempArr[i].data.length
                let item = tempArr[i].data[length - 1]

                if (item && Object.keys(item).length === 0
                    && Object.getPrototypeOf(item) === Object.prototype) {
                    break
                } else
                    tempArr[i].data.push({})
            }
            this.setState({ vaccineArray: tempArr })

            //
            vaccineArrayHolder = response.vaccinationInfoAgeWise ? response.vaccinationInfoAgeWise : [];
        }
        else if (tag === 'saveorupdatevaccine') {
            clickFlag = 0;
            Snackbar.show({ text: statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            this.setState({ addModalOpen: false });
            this.getVaccinationList();

            // let tempArr = [...this.state.vaccineArray];
            // var index = _.findIndex(tempArr, { ageGroupGuId: this.state.groupTypeGuid });
            // if (isAddOrEdit == 'add') {
            //     let childArr = tempArr[index].data;
            //     childArr.splice(childArr.length-1, 0, response);
            //     tempArr[index].data = childArr;
            //     //tempArr[index].data.push(response);
            // } else {
            //     let childArr = tempArr[index].data;
            //     childArr.splice(selectedChildIndex, 1, response);
            //     tempArr[index].data = childArr;
            // }
            // this.setState({ vaccineArray: tempArr });
            //console.log('--------'+JSON.stringify(response))
        }
    }

    getVaccinationList = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "RoleCode": signupDetails.roleCode,
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "PatientGuid": signupDetails.patientGuid,
            "Version": null,
            "data": {
                "AppointmentGuid": signupDetails.appoinmentGuid,
                "PatientGuid": item.patientGuid,
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetVaccinationInfo', 'post', params, signupDetails.accessToken, 'getvaccination');
    }

    formatDate = (dateValue) => {
        let dateGet = dateValue;
        // let formatedDatefinal = dateGet.substr(8, 2)
        return Moment(dateValue).format('MMM DD, YYYY')
    }
    formatDateForCalender = (dateValue) => {
        if (dateValue != null && dateValue != '0000-00-00') {
            let dateGet = dateValue;
            // let formatedDatefinal = dateGet.substr(8, 2)
            return Moment(dateValue).format('DD/MM/YYYY')
        }
        else {
            return 'DD/MM/YYYY'
        }
    }
    
    clickOnEdit = (item, section) => {
        let { signupDetails } = this.props;
        let timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +"Add_And_Edit_Vaccination",  signupDetails.firebaseLocation);
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Add_And_Edit_Vaccination", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })

        //alert(item.attachmentList.length)
        this.setState({ groupType: section.ageGroup })
        this.setState({ groupTypeGuid: section.ageGroupGuId })

        if (section.ageGroup == 'Others') {
            this.setState({ isVaccineNameEditable: true })
        } else {
            this.setState({ isVaccineNameEditable: false })
        }
        tempArr = [];
        let editLocalArray = [];
        this.setState({ editDataArr: [], tempData: [{}] })

        if (item.attachmentList != null) {
            for (let i = 0; i < item.attachmentList.length; i++) {
                if (item.attachmentList[i].attachmentUrl != null) {
                    let tempAttachmentList = item.attachmentList[i];
                    let tempObj = {};
                    tempObj.uri = tempAttachmentList.attachmentUrl;
                    tempObj.attachmentGuid = tempAttachmentList.attachmentGuid;
                    tempObj.recordGuid = tempAttachmentList.recordGuid;
                    tempObj.orgFileName = tempAttachmentList.orgFileName;
                    tempObj.orgFileExt = tempAttachmentList.orgFileExt;
                    tempObj.sysFileName = tempAttachmentList.sysFileName;
                    tempObj.sysFileExt = tempAttachmentList.sysFileExt;
                    tempObj.fileBytes = tempAttachmentList.fileBytes;
                    tempObj.sysFilePath = tempAttachmentList.sysFilePath;
                    tempObj.delMark = tempAttachmentList.delMark;
                    tempObj.DelMark = 0;
                    tempObj.uploadedOnCloud = tempAttachmentList.uploadedOnCloud;
                    tempObj.type = 'image';
                    tempArr.push(tempObj)
                    if (isFirstAdd == 0) {
                        isFirstAdd = 1;
                        this.state.tempData.splice(0, 1);
                        // alert('KKK')
                    }
                    // To perform Image add and delete while editing a vaccination
                    let tempObjEdit = {};
                    tempObjEdit.uri = tempAttachmentList.attachmentUrl;
                    tempObjEdit.attachmentGuid = tempAttachmentList.attachmentGuid;
                    tempObjEdit.recordGuid = tempAttachmentList.recordGuid;
                    tempObjEdit.orgFileName = tempAttachmentList.orgFileName;
                    tempObjEdit.orgFileExt = tempAttachmentList.orgFileExt;
                    tempObjEdit.sysFileName = tempAttachmentList.sysFileName;
                    tempObjEdit.sysFileExt = tempAttachmentList.sysFileExt;
                    tempObjEdit.fileBytes = tempAttachmentList.fileBytes;
                    tempObjEdit.sysFilePath = tempAttachmentList.sysFilePath;
                    tempObjEdit.delMark = tempAttachmentList.delMark;
                    tempObjEdit.DelMark = 0;
                    tempObjEdit.uploadedOnCloud = tempAttachmentList.uploadedOnCloud;
                    tempObjEdit.type = 'image';
                    editLocalArray.push(tempObjEdit)
                    //
                }
            }
            tempArr.push('##');
            this.setState({ tempData: tempArr });
            // To perform Image add and delete while editing a vaccination
            this.setState({ editDataArr: editLocalArray });

            tempArr = [];
        }
        //console.log('Test : ' + JSON.stringify(this.state.tempData))

        isAddOrEdit = 'edit';
        this.setState({
            vaccineId: item.vaccineGuId,
            intervalId: item.intervalGuId, recordId: item.recordGuid
        });
        this.setState({ brandName: item.brandName });
        this.setState({ batchNumber: item.batchNumber });
        this.setState({ vaccineName: item.vaccineName })
        this.setState({ patientVaccinationId: item.patientVaccinationGuid })

        this.setState({ showSelectedDay: this.formatDateForCalender(item.administeredDate) })
        this.setState({ showDueDay: this.formatDateForCalender(item.dueDate) })

        this.setState({ addModalOpen: true })
    }
    savePress = () => {
        // let totalImageSizeInBytes = 0;
        // let sizeInMb =0;
        // try {
        //     for(let i = 0 ; i <= this.state.tempData.length - 2 ; i++){
        //         let tempObj = this.state.tempData[i];
        //         totalImageSizeInBytes = totalImageSizeInBytes + tempObj.size;
        //     }
        //     if(totalImageSizeInBytes >0)
        //      sizeInMb = totalImageSizeInBytes/1000000;
        // } catch (error) {
            
        // }
        if (isAddOrEdit == 'add') {
            if (this.state.vaccineName == '' || this.state.vaccineName == null) {
                Snackbar.show({ text: 'Please Enter Vaccine Name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // else if (this.state.showSelectedDay == 'DD/MM/YYYY') {
            //     Snackbar.show({ text: 'Please select Administered Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            else if (this.state.showDueDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Due Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // else if (sizeInMb > 10) {
            //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            else {
                let { actions, signupDetails } = this.props;
                //
                let sendDataArr = [];
                // alert(this.state.tempData.length)
                for (let i = 0; i < this.state.tempData.length - 1; i++) {
                    let tempbase64 = ''
                    let tempFileExt = '.jpeg';
                    let attachmentUrl = null;
                    let attachGuid = null;
                    let sysFileName = null;
                    if (this.state.tempData[i].attachmentGuid == null) {
                        if (this.state.tempData[i].uri.indexOf('data:image/jpeg;base64,') > -1) {
                            let tempArr = this.state.tempData[i].uri.split('data:image/jpeg;base64,');
                            if (tempArr.length > 1) {
                                tempbase64 = tempArr[1];
                            }
                    //         let fileExtArr = this.state.tempData[i].imgExtn.split("/");
                    // let fileExt = '.' + fileExtArr[1];
                   // tempFileExt = '.png';
                     //tempFileExt  = fileExt;
                        }
                        else {
                            tempbase64 = this.state.tempData[i].uri;
                            tempFileExt = '.pdf'
                        }
                        attachmentUrl = null;
                        attachGuid = null;
                        sysFileName = 'test' + i;
                    }
                    else {
                        attachmentUrl = this.state.tempData[i].uri;
                        attachGuid = this.state.tempData[i].attachmentGuid;
                        sysFileName = this.state.tempData[i].attachmentGuid;
                        tempbase64 = null;
                        tempFileExt = this.state.tempData[i].orgFileExt
                    }
                    let tempObj = {};
                    tempObj.attachmentGuid = attachGuid;
                    tempObj.OrgFileExt = tempFileExt
                    tempObj.OrgFileName = 'test' + i+tempFileExt;
                    tempObj.SysFileName = sysFileName;
                    tempObj.SysFileExt = tempFileExt;
                    tempObj.FileBytes = tempbase64; //this.state.data[i].uri;
                    tempObj.AttachmentUrl = attachmentUrl;
                    tempObj.UploadedOnCloud = 0;
                    tempObj.DelMark = this.state.tempData[i].DelMark
                    sendDataArr.push(tempObj);
                }

                let adMinisDateArr = this.state.showSelectedDay.split('/');
                let sendAdministrativeDay = adMinisDateArr[2] + '-' + adMinisDateArr[1] + '-' + adMinisDateArr[0];
                let dueDateArr = this.state.showDueDay.split('/');
                let sendDueDate = dueDateArr[2] + '-' + dueDateArr[1] + '-' + dueDateArr[0];

                let params = {
                    "DoctorGuid": signupDetails.doctorGuid,
                    "ClincGuid": signupDetails.clinicGuid,
                    "UserGuid": signupDetails.UserGuid,
                    "Data": {
                        //
                        "AgeGroupName": this.state.groupType,
                        "AgeGroupGuId": this.state.groupTypeGuid,
                        "IsValid": true,
                        "IsAdded": true,
                        "isSave": "true",
                        "VaccinationStatus": "pending",
                        "GivenDate": "2022-03-06T18:30:00.000Z",
                        "DueDateOwn": "2022-03-02T18:30:00.000Z",
                        "Notes": "",
                        "VaccineGuId": isAddOrEdit == 'add' ? "" : this.state.vaccineId,
                        "VaccineName": this.state.vaccineName,
                        "IntervalGuId": this.state.intervalId,
                        "BrandName": this.state.brandName,
                        "BatchNumber": this.state.batchNumber,
                        "AppointmentGuid": signupDetails.appoinmentGuid,
                        // "AdministeredDate": sendAdministrativeDay,
                        "AdministeredDate": sendAdministrativeDay == 'YYYY-MM-DD' ? null : sendAdministrativeDay,
                        "DueDate": sendDueDate,
                        "RecordGuid": isAddOrEdit == 'add' ? null : this.state.recordId == null ? "" : this.state.recordId,
                        "AttachmentList": sendDataArr,
                        "PatientVaccinationGuid": isAddOrEdit == 'add' ? "" : this.state.patientVaccinationId == null ? "" : this.state.patientVaccinationId
                    }
                }
                actions.callLogin('V11/FuncForDrAppToSaveVaccinationInfo', 'post', params, signupDetails.accessToken, 'saveorupdatevaccine');
                clickFlag = 1;
            }
        }
        else if (isAddOrEdit == 'edit' && this.state.editDataArr.length == 0) {

            if (this.state.vaccineName == '' || this.state.vaccineName == null) {
                Snackbar.show({ text: 'Please Enter Vaccine Name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (this.state.showSelectedDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Administered Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (this.state.showDueDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Due Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // else if (sizeInMb > 10) {
            //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            else {
                let { actions, signupDetails } = this.props;
                //
                let sendDataArr = [];
                // alert(this.state.tempData.length)
                for (let i = 0; i < this.state.tempData.length - 1; i++) {
                    let tempbase64 = ''
                    let tempFileExt = '.jpeg';
                    let attachmentUrl = null;
                    let attachGuid = null;
                    let sysFileName = null;
                    if (this.state.tempData[i].attachmentGuid == null) {
                        if (this.state.tempData[i].uri.indexOf('data:image/jpeg;base64,') > -1) {
                            let tempArr = this.state.tempData[i].uri.split('data:image/jpeg;base64,');
                            if (tempArr.length > 1) {
                                tempbase64 = tempArr[1];
                            }
                            // let fileExtArr = this.state.tempData[i].imgExtn.split("/");
                            // let fileExt = '.' + fileExtArr[1];
                           // tempFileExt = '.png';
                             //tempFileExt  = fileExt;
                        }
                        else {
                            tempbase64 = this.state.tempData[i].uri;
                            tempFileExt = '.pdf'
                        }
                        attachmentUrl = null;
                        attachGuid = null;
                        sysFileName = 'test' + i;
                    }
                    else {
                        attachmentUrl = this.state.tempData[i].uri;
                        attachGuid = this.state.tempData[i].attachmentGuid;
                        sysFileName = this.state.tempData[i].attachmentGuid;
                        tempbase64 = null;
                        tempFileExt = this.state.tempData[i].orgFileExt
                    }
                    let tempObj = {};
                    tempObj.attachmentGuid = attachGuid;
                    tempObj.OrgFileExt = tempFileExt
                    tempObj.OrgFileName = 'test' + i+tempFileExt;
                    tempObj.SysFileName = sysFileName;
                    tempObj.SysFileExt = tempFileExt;
                    tempObj.FileBytes = tempbase64; //this.state.data[i].uri;
                    tempObj.AttachmentUrl = attachmentUrl;
                    tempObj.UploadedOnCloud = 0;
                    tempObj.DelMark = this.state.tempData[i].DelMark
                    sendDataArr.push(tempObj);
                }

                let adMinisDateArr = this.state.showSelectedDay.split('/');
                let sendAdministrativeDay = adMinisDateArr[2] + '-' + adMinisDateArr[1] + '-' + adMinisDateArr[0];
                let dueDateArr = this.state.showDueDay.split('/');
                let sendDueDate = dueDateArr[2] + '-' + dueDateArr[1] + '-' + dueDateArr[0];

                let params = {
                    "DoctorGuid": signupDetails.doctorGuid,
                    "ClincGuid": signupDetails.clinicGuid,
                    "UserGuid": signupDetails.UserGuid,
                    "Data": {
                        //
                        "AgeGroupName": this.state.groupType,
                        "AgeGroupGuId": this.state.groupTypeGuid,
                        "IsValid": true,
                        "IsAdded": true,
                        "isSave": "true",
                        "VaccinationStatus": "pending",
                        "GivenDate": "2022-03-06T18:30:00.000Z",
                        "DueDateOwn": "2022-03-02T18:30:00.000Z",
                        "Notes": "",
                        //
                        "VaccineGuId": isAddOrEdit == 'add' ? "" : this.state.vaccineId,
                        "VaccineName": this.state.vaccineName,
                        "IntervalGuId": this.state.intervalId,
                        "BrandName": this.state.brandName,
                        "BatchNumber": this.state.batchNumber,
                        "AppointmentGuid": signupDetails.appoinmentGuid,
                        "AdministeredDate": sendAdministrativeDay,
                        "DueDate": sendDueDate,
                        "RecordGuid": isAddOrEdit == 'add' ? null : this.state.recordId == null ? "" : this.state.recordId,
                        "AttachmentList": sendDataArr,
                        "PatientVaccinationGuid": isAddOrEdit == 'add' ? "" : this.state.patientVaccinationId == null ? "" : this.state.patientVaccinationId
                    }
                }
                actions.callLogin('V11/FuncForDrAppToSaveVaccinationInfo', 'post', params, signupDetails.accessToken, 'saveorupdatevaccine');
                clickFlag = 1;

            }
        }
        else {

            if (this.state.vaccineName == '' || this.state.vaccineName == null) {
                Snackbar.show({ text: 'Please Enter Vaccine Name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (this.state.showSelectedDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Administered Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (this.state.showDueDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Due Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // else if (sizeInMb > 10) {
            //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            else {
                let { actions, signupDetails } = this.props;
                let sendDataArr = [];
                // Edit With Existing file
                for (let k = 0; k < this.state.tempData.length - 1; k++) {
                    let obj = this.state.tempData[k];
                    if (obj.attachmentGuid == null) {
                        this.state.editDataArr.push(obj);
                    }
                }
                for (let i = 0; i < this.state.editDataArr.length; i++) {
                    let tempbase64 = ''
                    let tempFileExt = '';
                    let attachmentUrl = null;
                    let attachGuid = null;
                    let sysFileName = null;
                    if (this.state.editDataArr[i].attachmentGuid == null) {
                        if (this.state.editDataArr[i].uri.indexOf('data:image/jpeg;base64,') > -1) {
                            let tempArr = this.state.editDataArr[i].uri.split('data:image/jpeg;base64,');
                            if (tempArr.length > 1) {
                                tempbase64 = tempArr[1];
                            }
                            tempFileExt = '.png';
                        }
                        else {
                            tempbase64 = this.state.editDataArr[i].uri;
                            tempFileExt = '.pdf'
                        }
                        attachmentUrl = null;
                        attachGuid = null;
                        sysFileName = 'test' + i;
                    }
                    else {
                        attachmentUrl = this.state.editDataArr[i].uri;
                        attachGuid = this.state.editDataArr[i].attachmentGuid;
                        sysFileName = this.state.editDataArr[i].attachmentGuid;
                        tempbase64 = null;
                        tempFileExt = this.state.editDataArr[i].orgFileExt
                    }
                    let tempObj = {};
                    tempObj.attachmentGuid = attachGuid;
                    tempObj.OrgFileExt = tempFileExt
                    tempObj.OrgFileName = 'test' + i+tempFileExt;
                    tempObj.SysFileName = sysFileName;
                    tempObj.SysFileExt = tempFileExt;
                    tempObj.FileBytes = tempbase64; //this.state.data[i].uri;
                    tempObj.AttachmentUrl = attachmentUrl;
                    tempObj.UploadedOnCloud = 0;
                    tempObj.DelMark = this.state.editDataArr[i].DelMark
                    sendDataArr.push(tempObj);
                }
                let adMinisDateArr = this.state.showSelectedDay.split('/');
                let sendAdministrativeDay = adMinisDateArr[2] + '-' + adMinisDateArr[1] + '-' + adMinisDateArr[0];
                let dueDateArr = this.state.showDueDay.split('/');
                let sendDueDate = dueDateArr[2] + '-' + dueDateArr[1] + '-' + dueDateArr[0];

                let params = {
                    "DoctorGuid": signupDetails.doctorGuid,
                    "ClincGuid": signupDetails.clinicGuid,
                    "UserGuid": signupDetails.UserGuid,
                    "Data": {
                        //
                        "AgeGroupName": this.state.groupType,
                        "AgeGroupGuId": this.state.groupTypeGuid,
                        "IsValid": true,
                        "IsAdded": true,
                        "isSave": "true",
                        "VaccinationStatus": "pending",
                        "GivenDate": "2022-03-06T18:30:00.000Z",
                        "DueDateOwn": "2022-03-02T18:30:00.000Z",
                        "Notes": "",
                        //
                        "VaccineGuId": isAddOrEdit == 'add' ? "" : this.state.vaccineId,
                        "VaccineName": this.state.vaccineName,
                        "IntervalGuId": this.state.intervalId,
                        "BrandName": this.state.brandName,
                        "BatchNumber": this.state.batchNumber,
                        "AppointmentGuid": signupDetails.appoinmentGuid,
                        "AdministeredDate": sendAdministrativeDay,
                        "DueDate": sendDueDate,
                        "RecordGuid": isAddOrEdit == 'add' ? null : this.state.recordId == null ? "" : this.state.recordId,
                        "AttachmentList": sendDataArr,
                        "PatientVaccinationGuid": isAddOrEdit == 'add' ? "" : this.state.patientVaccinationId == null ? "" : this.state.patientVaccinationId
                    }
                }
                actions.callLogin('V11/FuncForDrAppToSaveVaccinationInfo', 'post', params, signupDetails.accessToken, 'saveorupdatevaccine');
                clickFlag = 1;
            }
        }
    }


    SearchFilterFunction = (searchText) => {
        var temp = []
        this.state.vaccineArray.map((item) => {
            var dataItem = {};

            var title = item.vaccineName;
            var brandData = [];

            item.data.map((searchItem) => {
                if (searchItem.vaccineName) {
                    let flatName = searchItem.vaccineName
                    if (flatName.toLowerCase().match(searchText.toLowerCase())) {
                        brandData.push(searchItem);
                    }
                }

            })
            if (brandData.length > 0) {
                dataItem.title = title;
                dataItem.data = brandData;
                temp.push(dataItem);
                this.setState({
                    vaccineArray: temp
                })
            }
        })
        this.setState({ searchTxt: searchText });

        if (!searchText) {
            this.setState({
                vaccineArray: vaccineArrayHolder
            })
        }

    }

    renderItem = (item, index, section) => {
        //console.log('item-------'+JSON.stringify(section.ageGroup))
        let isPdf = item.attachmentList != null && item.attachmentList.length > 0 && item.attachmentList[0].attachmentUrl.includes(".pdf");
        return (
            <View>
                {
                    item && Object.keys(item).length === 0
                        && Object.getPrototypeOf(item) === Object.prototype ?
                        <TouchableOpacity style={{ alignItems: 'center', marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, borderRadius: responsiveWidth(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}
                            onPress={() => { this.addNewVaccine(section) }}>
                            <Image source={AddIcon} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontNameBold, marginLeft: responsiveWidth(4), color: Color.primary }}>Add Another Vaccine</Text>
                        </TouchableOpacity> :


                        item.vaccinationStatus == "Pending" || item.vaccinationStatus == "Due" || item.vaccinationStatus == "OverDue" ?
                            <View style={{ marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, borderRadius: responsiveWidth(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
                                <View style={{ flex: 1 }}>
                                    <Image source={item.vaccinationStatus == "Pending" ? vacIcon : item.vaccinationStatus == "Due" ? clockOrangeIcon : crossRed} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                                </View>
                                <View style={{ flex: 9, }}>
                                    <Text style={{ marginTop: responsiveHeight(1.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginLeft: responsiveWidth(4), color: Color.fontColor }}>{item.vaccineName}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                        <View style={{}}>
                                            <View>
                                                <Text style={{ marginTop: responsiveHeight(.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: item.vaccinationStatus == "Pending" ? Color.datecolor : item.vaccinationStatus == "Due" ? Color.orangeDue : Color.textDue }}>Due Date : {this.formatDate(item.dueDate)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity onPress={() => {
                                    selectedChildIndex = index;
                                    this.clickOnEdit(item, section)
                                }} style={{ alignItems: 'center', justifyContent: 'center', flex: 2, padding: responsiveWidth(0.5) }}>
                                    <Image source={editIcon} style={{ width: responsiveFontSize(2), height: responsiveFontSize(2), resizeMode: 'contain' }} />
                                </TouchableOpacity>

                            </View> :
                            <TouchableOpacity onPress={() => {
                                selectedChildIndex = index;
                                this.clickOnEdit(item, section)
                            }} style={{ marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, borderRadius: responsiveWidth(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
                                <View style={{ flex: 1 }}>
                                    <Image source={vac_tick} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                                </View>
                                <View style={{ flex: 9, }}>
                                    <Text style={{ marginTop: responsiveHeight(1.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginLeft: responsiveWidth(4), color: Color.fontColor }}>{item.vaccineName}</Text>
                                    <View style={{ marginTop: 3 }}>
                                        <View>
                                            <Text style={{ marginTop: responsiveHeight(.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: Color.textGrey, }}>Due Date : {this.formatDate(item.dueDate)}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ marginTop: responsiveHeight(.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: Color.textGrey, }}>Administered Date : {item.administeredDate &&item.administeredDate!='0000-00-00' ? this.formatDate(item.administeredDate) :''}</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    item.attachmentList == null ? null :
                                        item.attachmentList.length > 1 ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 2, padding: responsiveWidth(0.5) }}>
                                            <Image source={isPdf ? PdfIcon : { uri: item.attachmentList[0].attachmentUrl }} style={{ borderRadius: 5, width: responsiveFontSize(3.5), height: responsiveFontSize(3.5), resizeMode: 'contain' }} />
                                            <Text style={{ position: 'absolute', color: Color.white, fontWeight: CustomFont.fontWeightBold }}>+{item.attachmentList.length - 1}</Text>
                                        </View> : <View style={{ alignItems: 'center', justifyContent: 'center', flex: 2, padding: responsiveWidth(0.5) }}>
                                            <Image source={isPdf ? PdfIcon : { uri: item.attachmentList[0].attachmentUrl }} style={{ borderRadius: 5, width: responsiveFontSize(3.5), height: responsiveFontSize(3.5), resizeMode: 'contain' }} />
                                        </View>

                                }
                            </TouchableOpacity>
                }
            </View>
        );
    };

    addNewVaccine = (section) => {
        let { signupDetails } = this.props;
        let timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +"Add_And_Edit_Vaccination",  signupDetails.firebaseLocation);
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Add_And_Edit_Vaccination", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })

        this.setState({ groupType: section.ageGroup })
        this.setState({ groupTypeGuid: section.ageGroupGuId })
        this.setState({ tempData: [{}] });
        this.setState({ isVaccineNameEditable: true })
        isAddOrEdit = 'add';
        this.setState({ brandName: '' });
        this.setState({ batchNumber: '' });
        this.setState({ vaccineName: '' })
        // let adMinDate = this.formatDate(item.administeredDate);
        this.setState({ showSelectedDay: 'DD/MM/YYYY' })
        this.setState({ showDueDay: 'DD/MM/YYYY' })
        this.setState({ addModalOpen: true })
    }
    typeVaccineName = (text) => {
        this.setState({ vaccineName: text })
    }
    typeBrandName = (text) => {
        this.setState({ brandName: text })
    }
    typeBatchNumber = (text) => {
        this.setState({ batchNumber: text })
    }
    renderListHeader = ({ section }) => (
        <View>
            {section.ageGroup ? <Text style={{ marginLeft: 18, fontSize: CustomFont.font14, fontWeight: 'bold', marginBottom: 6, marginTop: 6, color: Color.fontColor }}>{section.ageGroup}</Text>
                : null
            }
        </View>
    );
    render() {
        let { loading} = this.props;
        return (
            <SafeAreaView style={CommonStyle.containerlightBg}>
                <View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
                    <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                    <NavigationEvents onDidFocus={() => this.getVaccinationList()} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.white }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                            <View onPress={() => {
                                const { navigation } = this.props;
                                navigation.goBack();
                                navigation.state.params.Refresh();
                            }} >
                                <Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                            </View>
                            <Text style={{ color: Color.patientSearch, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>Vaccination</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ showSearchStatus: true })}>
                                <Image source={searchBlue} style={{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(2.8), height: responsiveFontSize(2.8), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => this.addNewVaccine()}>
                                <Image source={plus_new} style={{ marginLeft: responsiveWidth(5), marginRight: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(2.2), height: responsiveFontSize(2.2), resizeMode: 'contain' }} />
                            </TouchableOpacity> */}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, backgroundColor: Color.newBgColor }}>
                        {this.state.showSearchStatus ?
                            <TextInput returnKeyType="done"
                                //onBlur={this.callOnBlur}
                                //returnKeyType={'done'}
                                //keyboardType={'phone-pad'}
                                placeholderTextColor={Color.placeHolderColor}
                                style={{
                                    padding: 0, backgroundColor: Color.white, height: responsiveHeight(5), borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginLeft: responsiveWidth(2.5),
                                    marginRight: responsiveWidth(2.5), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName,
                                    color: Color.patientSearch, marginTop: responsiveHeight(2)
                                }} placeholder="Search by vaccine name" value={this.state.searchTxt}
                                onChangeText={(searchTxt) => { return this.SearchFilterFunction(searchTxt); }} /> : null}

                        {this.state.vaccineArray && this.state.vaccineArray.length == 0 ?
                            <View style={{ alignItems: 'center', marginTop: responsiveHeight(20) }}>
                                <TouchableOpacity onPress={() => this.setState({ addModalOpen: true })}>
                                    <Image source={blank_vaccination} style={{ width: responsiveWidth(40), height: responsiveHeight(40), resizeMode: 'contain' }} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: CustomFont.text1, fontSize: CustomFont.font14, color: Color.text1, opacity: 0.6, marginTop: responsiveHeight(5), }} >No vaccinations recorded</Text>
                            </View>
                            :
                            <View style={{ marginTop: responsiveHeight(1), paddingBottom: responsiveHeight(2) }}>
                                <SectionList
                                    stickySectionHeadersEnabled={false}
                                    sections={this.state.vaccineArray}
                                    renderItem={({ item, index, section }) => this.renderItem(item, index, section)}
                                    renderSectionHeader={
                                        (childData) => this.renderListHeader(childData)
                                    }
                                    keyExtractor={(item, index) => index} />
                            </View>
                        }
                    </View>

                    <Modal isVisible={this.state.addModalOpen} onPress={() => {
                        this.setState({ addModalOpen: false });
                        isFirstAdd = 0;
                    }}>
                        <View style={[styles.modelViewAbout]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(2) }}>
                                <TouchableOpacity style={{ padding: 7 }}>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 10 }}>{isAddOrEdit == 'add' ? 'Add Vaccination' : 'Edit Vaccination'} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 7 }} onPress={() => {
                                    this.setState({ addModalOpen: false });
                                    Trace.stopTrace();
                                }}>
                                    <Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginBottom: 4 }}>

                                {/* <TouchableOpacity onPress={() => this.setState({ isModalShows: true })} >
                                <View style={styles.previewadd}>
                                    <Image source={AddIcon} style={{ height: 30, width: 30 }} />
                                    <Text style={styles.add}>Add File</Text>
                                </View>
                            </TouchableOpacity> */}

                                <View style={{ marginTop: 8 }}>
                                    <FlatList
                                        extraData={this.state}
                                        data={this.state.tempData}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        style={{ marginTop: 10, marginEnd: 20 }}
                                        ItemSeparatorComponent={this.ItemSeparatorView}
                                        renderItem={({ item, index }) => (
                                            index === this.state.tempData.length - 1 ?
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({ isModalShows: true })
                                                }} >
                                                    <View style={styles.previewadd}>
                                                        <Image source={AddIcon} style={{ height: 30, width: 30 }} />
                                                        <Text style={styles.add}>Add File</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                : <View style={[styles.preview, { marginStart: index == 0 ? responsiveWidth(5) : responsiveWidth(8) }]}>
                                                    {item.orgFileExt === '.png' ? <View style={{ padding: 10 }}>
                                                        <Image source={{ uri: item.uri }} style={{ borderRadius: 5, height: 80, width: 80 }} />
                                                    </View> : <View style={{ padding: 10 }}><Image source={PdfIcon} style={{ height: 80, width: 80, borderRadius: 5 }} /></View>}
                                                    <TouchableOpacity zIndex={999} onPress={() => this.removeImage(item, index)} style={styles.imgcross}>
                                                        <Image style={{ height: 16, width: 16 }} source={CrossIcon} />
                                                    </TouchableOpacity>
                                                </View>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>

                                <View style={{ backgroundColor: Color.white, borderRadius: 10, marginStart: 16, marginEnd: 16, padding: 16 }}>
                                    <View style={{ marginTop: 0, marginLeft: responsiveWidth(0), marginRight: responsiveWidth(0) }}>
                                        <Text style={styles.titletxt}>Vaccine Name *</Text>
                                        <TextInput returnKeyType="done" editable={this.state.isVaccineNameEditable ? true : false} onFocus={this.callIsFucused} placeholderTextColor={Color.placeHolderColor}
                                            onBlur={this.callIsBlur} value={this.state.vaccineName} onChangeText={this.typeVaccineName}
                                            style={[styles.input, { borderColor: Color.createInputBorder }]} placeholder="Enter Vaccine Name" />
                                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
                                            <View style={{ flex: 4 }}>
                                                <Text style={styles.titletxt}>Brand Name </Text>
                                                <TextInput returnKeyType="done" onFocus={this.callIsFucused} placeholderTextColor={Color.placeHolderColor}
                                                    onBlur={this.callIsBlur} value={this.state.brandName} onChangeText={this.typeBrandName}
                                                    style={[styles.input, { borderColor: Color.createInputBorder }]} placeholder="Brand Name" />
                                            </View>
                                            <View style={{ flex: 0.5 }}>
                                            </View>
                                            <View style={{ flex: 4 }}>
                                                <Text style={styles.titletxt}>Batch Number </Text>
                                                <TextInput returnKeyType="done" onFocus={this.callIsFucused} placeholderTextColor={Color.placeHolderColor}
                                                    onBlur={this.callIsBlur} value={this.state.batchNumber} onChangeText={this.typeBatchNumber}
                                                    style={[styles.input, { borderColor: Color.createInputBorder }]} placeholder="Batch Number" />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
                                            <View style={{ flex: 4 }}>

                                                <Text style={[styles.titletxt, { marginTop: 12 }]}>Administered Date *</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <TouchableOpacity style={{ height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1.2), flexDirection: 'row' }}
                                                        onPress={() => {
                                                            this.setState({ isModalVisibleCalendars: true })
                                                        }}>
                                                        <Text style={{ width: responsiveWidth(28), marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, color: Color.fontColor, textAlign: 'center', fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}>{this.state.showSelectedDay}</Text>
                                                        <Image source={CalenderIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginLeft: responsiveWidth(1), marginRight: responsiveWidth(2) }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ flex: 0.5 }}></View>
                                            <View style={{ flex: 4 }}>
                                                <Text style={[styles.titletxt, { marginTop: 12 }]}>Due Date *</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <TouchableOpacity style={{ width: '100%', height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1.2), flexDirection: 'row' }}
                                                        onPress={() => {
                                                            this.setState({ isModalVisibleCalendarDue: this.state.groupType == 'Others' || isAddOrEdit == 'add' ? true : false })
                                                        }}
                                                    >
                                                        <Text style={{ width: responsiveWidth(28), marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, color: Color.fontColor, textAlign: 'center', fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}>{this.state.showDueDay}</Text>
                                                        <Image source={CalenderIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginLeft: responsiveWidth(1), marginRight: responsiveWidth(2) }} />
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ position: 'absolute', left: responsiveWidth(2), right: responsiveWidth(2), bottom: responsiveHeight(35) }}>
                                <TouchableOpacity style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(1.5), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', alignItems: 'center', height: responsiveHeight(6.5), backgroundColor: Color.primaryBlue, marginTop: responsiveWidth(4) }}
                                    onPress={() => {
                                        if (clickFlag == 0)
                                    {
                                            this.savePress()
                                    }
                                    Trace.stopTrace();
                                    }} disabled={loading}>
                                    <Text style={{ fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(0), color: Color.white, }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Modal isVisible={this.state.isModalVisibleCalendars} >
                            <View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
                                <ScrollView>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <CalendarPicker
                                            width={responsiveWidth(90)}
                                            startFromMonday={true}
                                            todayTextStyle={{ color: '#00bfff' }}
                                            todayBackgroundColor="#FFF"
                                            selectedDayColor={Color.primary}
                                            selectedDayTextColor="#FFFFFF"
                                            todayTextColor="red"
                                            selectYearTitle={true}
                                            style={{ width: responsiveWidth(99) }}
                                            onDateChange={date => {
                                                // selectedDay = Moment(date).format('YYYY-MM-DD')
                                                // this.setState({ dateForfullCalendar: selectedDay})
                                                selectedDay = Moment(date.toString()).format('YYYY/MM/DD');
                                                selectedDayReformat = Moment(selectedDay).format('DD/MM/YYYY');
                                                // this.setState({ showDueDay: 'DD/MM/YYYY' })
                                            }}
                                            // maxDate={new Date()}
                                            minDate={new Date()}
                                            nextTitleStyle={{color:Color.fontColor}}
                                            previousTitleStyle={{color:Color.fontColor}}
                                            yearTitleStyle={{color:Color.fontColor}}
                                            monthTitleStyle={{color:Color.fontColor}}
                                        />
                                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
                                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleCalendars: false })}>
                                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
                                                this.clickOnDone();
                                            }}>
                                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </Modal>

                        <Modal isVisible={this.state.isModalVisibleCalendarDue} >
                            <View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
                                <ScrollView>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <CalendarPicker
                                            width={responsiveWidth(90)}
                                            startFromMonday={true}
                                            todayTextStyle={{ color: '#00bfff' }}
                                            todayBackgroundColor="#FFF"
                                            selectedDayColor={Color.primary}
                                            selectedDayTextColor="#FFFFFF"
                                            todayTextColor="red"
                                            selectYearTitle={true}
                                            style={{ width: responsiveWidth(99) }}
                                            onDateChange={date => {
                                                // selectedDay = Moment(date).format('YYYY-MM-DD')
                                                // this.setState({ dateForfullCalendar: selectedDay})
                                                selectedDayDue = Moment(date.toString()).format('YYYY/MM/DD');
                                                selectedDayReformatDue = Moment(selectedDayDue).format('DD/MM/YYYY');
                                                // this.setState({ showSelectedDay: 'DD/MM/YYYY' })
                                            }}
                                            // maxDate={new Date()}
                                            minDate={new Date()}
                                            nextTitleStyle={{color:Color.fontColor}}
                                            previousTitleStyle={{color:Color.fontColor}}
                                            yearTitleStyle={{color:Color.fontColor}}
                                            monthTitleStyle={{color:Color.fontColor}}
                                        />
                                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
                                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleCalendarDue: false })}>
                                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
                                                this.clickOnDone();
                                            }}>
                                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </Modal>
                        <Modal isVisible={this.state.isModalShows} avoidKeyboard={true}>
                            <View style={styles.modelView}>
                                <View style={{ marginBottom: 22, flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, }}>
                                    <Text style={styles.addtxt}>{isAddOrEdit == 'add' ? 'Add Vaccination' : 'Edit Vaccination'} </Text>
                                    <TouchableOpacity style={styles.crossbtn} onPress={() => this.setState({ isModalShows: false })}>
                                        <Image style={styles.closeIcon} source={CloseIcon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.rowShare}>
                                    <TouchableOpacity style={styles.btn} onPress={this.openDocuments}>
                                        <Image style={styles.optionimg} source={UploadFileIcon} />
                                        <Text style={styles.optiontxt}>Upload Files</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.rowShare}>
                                    <TouchableOpacity style={styles.btn} onPress={this.openGallery}>
                                        <Image style={styles.optionimg} source={UploadPhotoIcon} />
                                        <Text style={styles.optiontxt}>Upload from Gallery</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.rowShare}>
                                    <TouchableOpacity style={styles.btn} onPress={this.openCamera}>
                                        <Image style={styles.optionimg} source={TakeAPhotoIcon} />
                                        <Text style={styles.optiontxt}>Take a Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>


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
)(vaccinationHistory);
