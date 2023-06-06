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
import radioSelected from '../../../../assets/radioSelected.png';
import radioNotSelected from '../../../../assets/radioNotSelected.png';
import resetInfo from '../../../../assets/reset_info.png';

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
import DropDownPicker from 'react-native-dropdown-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFS from 'react-native-fs';
let selectedDay = '', selectedDayDue = '', currentDate = '', selectedDayReformat = '', selectedDayReformatDue = '', selectedDayReformat1 = "";;
let galArr = [];
let tempImageArr = [];
let isFirstAdd = 0;
let isAddOrEdit = 'add';
let tempArr = [];
let attachmentGuidArr = [];

let data = null;
let item = null;
let details = null;
var lmpDate = '';
var addDate = '';
var selectedDayFromCal = '';
var prePregDateCheck = '', prePregnencyGuid='', postPregnencyGuid='',isPrepregency=true,selectedChildIndex=0;
let isNeedRefresh=false,clickFlag = 0,SelectedRecordGuid=null;
import Trace from '../../../service/Trace'
let timeRange = '';
class PregnancyList extends React.Component {
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
            notesData: '',
            vaccineId: '',
            recordId: '',
            intervalId: '',
            patientVaccinationId: '',
            isVaccineNameEditable: false,
            editDataArr: [],
            category: [],
            groupType: '',
            isPrePregnancy: true,
            lmpDate: "",
            edd: "",

            showActualDay: 'DD/MM/YYYY',
            patientGuid: '',
            pregnencyScanGuid: '',
            patientPregnencyDetailsGuId: '',
            PregnencyScanName: '',
            PregnencyScanintervalGuid: '',
            PatientPregnancyGuId: '',
            LmpDate: '',
            ActualDelieveryDate: '',
            ActualDate: '',
            DueDate: '',
            Notes: '',
            AppointmentGuid: '',
            RecordGuid: '',
            IntervalGuId: '',
            PatientScanAgeGroupGuid: '',
            AgeGroupName: '',
            isResetModal: false,
            addDate: "",
            isModalVisibleCalendars1: false,
            showActualDay1: "",
            setBycalorNot: true
        }

        lmpDate = '';
        addDate = '';
        selectedDayFromCal = '';
        prePregDateCheck = '';
        prePregnencyGuid='';
         postPregnencyGuid='';
         isPrepregency=true;
         selectedChildIndex=0;
         clickFlag = 0;
    }

    async componentDidMount() {
        
        let { signupDetails } = this.props;
        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Pre_Pregnancy_Calendar_Time',  signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Pre_Pregnancy_Calendar_Time", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
    
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () =>{
            this.props.navigation.goBack();
            try {
                if(isNeedRefresh)
            this.props.navigation.state.params.Refresh();
            } catch (error) {   
            }
        } )
        item = this.props.navigation.state.params.item;
        tempArr = [];
        data = this.props.navigation.state.params.data;
        details = this.props.navigation.state.params.details;
        if(details && details.pregrancyType && details.pregrancyType.length>0){
            prePregnencyGuid=details.pregrancyType[0].pregrancyTypeGuid;
         postPregnencyGuid=details.pregrancyType[1].pregrancyTypeGuid;
        }
        //alert(postPregnencyGuid)
        prePregDateCheck = details.lmpDate;
        this.setState({ lmpDate: this.formatDateForLMP(details.lmpDate) });

        if (details.lmpDate) {
            lmpDate = this.getdateFormat(details.lmpDate);
        }
        if (details.addDate) {
            //alert(details.addDate)
            addDate = this.getdateFormat(details.addDate);
        }
        this.getVaccinationList();
    }
    componentWillUnmount(){
        Trace.stopTrace()
    }

    formatDateForLMP = (dateValue) => {
        return dateValue ? Moment(dateValue).format('DD MMM YYYY') : ""
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
                                    isFirstAdd = 1;
                                    this.state.tempData.splice(0, 1)
                                }
                                tempArr.push('##');
                                this.setState({ tempData: tempArr });
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
    openGallery = async () => {
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
                let source = { uri: 'data:image/jpeg;base64,' + image[i].data, type: 'image',size: image[i].size ,imgExtn: image[i].mime};
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
        if (this.state.isModalVisibleCalendars1) {
            this.setState({ showActualDay1: selectedDayReformat1, isModalVisibleCalendars1: false });
            let tempDateArr = selectedDayReformat1.split('/');
            let dateStr = tempDateArr[2] + '-' + tempDateArr[1] + '-' + tempDateArr[0];
            selectedDayFromCal = dateStr;
            if (this.state.isPrePregnancy) {
                lmpDate = dateStr;
                this.setState({ setBycalorNot: false })
            }
            else {
                addDate = dateStr;
                
            }
        }
        if (this.state.isModalVisibleCalendars) {
            this.setState({ showActualDay: selectedDayReformat, isModalVisibleCalendars: false });
        }
        if (this.state.isModalVisibleCalendarDue) {
            this.setState({ showDueDay: selectedDayReformatDue, isModalVisibleCalendarDue: false });
        }
    }

    handleApi = (response, tag, statusMessage) => {
        if (tag === 'getPregnancyinfo') {
            data = response;
            this.handlePrePostPregnancy(this.state.isPrePregnancy)
            this.setState({ showActualDay1: "" })
        }
        else if (tag === 'saveorupdatepregnancydata') {
            clickFlag =0;
            Snackbar.show({ text: statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            this.setState({ addModalOpen: false });
            this.getVaccinationList();

            //  let tempArr = [...this.state.vaccineArray];
            // var index = _.findIndex(tempArr, { ageGroup: this.state.AgeGroupName });
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
        else if (tag === 'resetpregnancydata') {
            isNeedRefresh=true;
            //console.log('Reset Response ' + JSON.stringify(response))
            Snackbar.show({ text: statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            this.setState({ isResetModal: false });
            if (this.state.isPrePregnancy) {
                this.setState({ isPrePregnancy: true })
            }
            else {
                this.setState({ isPrePregnancy: false })
            }
            this.setState({ addDate: null, lmpDate: null })
            lmpDate=''; addDate='';
            prePregDateCheck = '';
        }
    }
    goToPregnancyCalenderScreen = () => {
     
    }

    handlePrePostPregnancy = (isPrePregnancy) => {
        if (data === null || data === undefined) return;
        details.lmpDate = data && data.lmpDate ? data.lmpDate : ""
        details.addDate = data && data.addDate ? data.addDate : ""
        this.setState({ PatientPregnancyGuId: data.patientPregnancyGuId })
        let array = [];
        // alert(isPrePregnancy)
        if (isPrePregnancy) {
            array = data.prePregnencyInfoAgeWise ? data.prePregnencyInfoAgeWise : []
        }
        else {
            array = data.postPregnencyInfoAgeWise ? data.postPregnencyInfoAgeWise : []
        }

        if (this.state.isPrePregnancy) {
            if (data.lmpDate) {
                this.setState({ lmpDate: this.formatDateForLMP(data.lmpDate) })
            }
            else {
                // this.setState({lmpDate: this.formatDateForLMP(selectedDayFromCal) }) 
            }
            if (data.eddDate) {
                this.setState({ edd: this.formatDateForLMP(data.eddDate) })
            }
            else {
                this.setState({ edd: this.formatDateForLMP(selectedDayFromCal) })
            }
        }
        if (!this.state.isPrePregnancy) {
            if (data.addDate) {
                this.setState({ addDate: this.formatDateForLMP(data.addDate) })
            }
            else {
                // this.setState({ addDate: this.formatDateForLMP(selectedDayFromCal) })
            }
        }
        // alert(this.state.lmpDate +  '   ' + this.state.addDate + '  ' + isPrePregnancy)

        for (let i = 0; i < array.length; i++) {
            let length = array[i].data.length
            let item = array[i].data[length - 1]

            if (item && Object.keys(item).length === 0
                && Object.getPrototypeOf(item) === Object.prototype) {
                break
            } else
                array[i].data.push({})
        }
        this.setState({ vaccineArray: array })
        
    }

    getVaccinationList = () => {

        if ((details.lmpDate === null || details.lmpDate === "") && (details.addDate === null || details.addDate === "")
            && this.state.showActualDay1 === "")

            return;
        let { actions, signupDetails } = this.props;

        // let pregnencyTypeGuid = ""
        // for (let i = 0; i < details.pregrancyType.length; i++) {
        //     if (details.pregrancyType[i].pregrancyType === "Pre Pregnency" && this.state.isPrePregnancy) {
        //         pregnencyTypeGuid = details.pregrancyType[i].pregrancyTypeGuid
        //         break
        //     } else if (details.pregrancyType[i].pregrancyType === "Post Pregnency" && !this.state.isPrePregnancy) {
        //         pregnencyTypeGuid = details.pregrancyType[i].pregrancyTypeGuid
        //         break
        //     }
        // }


        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": null,
            "Version": null,
            "data": {
                "PatientGuid": item.patientGuid,
                "PregnencyTypeGuid": isPrepregency ? prePregnencyGuid: postPregnencyGuid,
                "LMPDate": this.state.setBycalorNot ? prePregDateCheck : lmpDate,
                "ADDDate": addDate

            }
        }
        actions.callLogin('V1/FuncForDrAppToGetPregnancyCalnderInfo', 'post', params, signupDetails.accessToken, 'getPregnancyinfo');
    }

    getdateFormat = (val) => {
        let str = '';
        try {
            str = Moment(val).format('YYYY-MM-DD');
        } catch (error) {
            str = val;
        }
        return str;
    }

    formatDate = (dateValue) => {
        return Moment(dateValue).format('MMM DD, YYYY')
    }
    formatDateForCalender = (dateValue) => {
        if (dateValue != null && dateValue != '0000-00-00') {
            return Moment(dateValue).format('DD/MM/YYYY')
        }
        else {
            return 'DD/MM/YYYY'
        }
    }
    formatDateForAPI = (val) => {
        if (val != null && val != '0000-00-00') {
            return Moment(val).format('YYYY-MM-DD')
        } else {
            return val;
        }
    }
    clickOnEdit = (item, section) => {
        if (item.isCustomAdded == '1') {
            this.setState({ isVaccineNameEditable: true })
        } else {
            this.setState({ isVaccineNameEditable: false })
        }
        tempArr = [];
        let editLocalArray = [];
        this.setState({ editDataArr: [], tempData: [{}] })

        if (item.pregnencyAttachmentList != null) {
            for (let i = 0; i < item.pregnencyAttachmentList.length; i++) {
                if (item.pregnencyAttachmentList[i].attachmentUrl != null) {
                    let tempAttachmentList = item.pregnencyAttachmentList[i];
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
        
        this.setState({ vaccineName: item.pregnencyScanName })
        this.setState({ showActualDay: this.formatDateForCalender(item.actualDate) })
        this.setState({ showDueDay: this.formatDateForCalender(item.dueDate) })
        this.setState({ notesData: item.notes })



        this.setState({ pregnencyScanGuid: item.pregnencyScanGuid })
        this.setState({ patientPregnencyDetailsGuId: item.patientPregnencyDetailsGuId })
        this.setState({ PregnencyScanintervalGuid: item.pregnencyScanintervalGuid })

        this.setState({ LmpDate: section.data[0].lmpDate })
        this.setState({ ActualDelieveryDate: section.data[0].actualDelieveryDate })
        this.setState({ RecordGuid: item.recordGuid })
        this.setState({ IntervalGuId: section.data[0].intervalGuId })
        this.setState({ PatientScanAgeGroupGuid: section.data[0].patientScanAgeGroupGuid })
        this.setState({ AgeGroupName: section.ageGroup })
        this.setState({ groupType: section.ageGroup })
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
        //alert(sizeInMb)
        if (isAddOrEdit == 'add') {
            if (this.state.vaccineName == '' || this.state.vaccineName == null) {
                Snackbar.show({ text: 'Please Enter Test Name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (this.state.showDueDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Due Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // else if (sizeInMb > 10) {
            //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            // else if (this.state.showActualDay == 'DD/MM/YYYY') {
            //     Snackbar.show({ text: 'Please select Actual Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            else {
                let { actions, signupDetails } = this.props;
                // alert(signupDetails.appoinmentGuid)
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
                let adActualDateArr = this.state.showActualDay.split('/');
                let actualDay = adActualDateArr[2] + '-' + adActualDateArr[1] + '-' + adActualDateArr[0];
                let dueDateArr = this.state.showDueDay.split('/');
                let sendDueDate = dueDateArr[2] + '-' + dueDateArr[1] + '-' + dueDateArr[0];

                let lmpDate = this.formatDateForAPI(this.state.lmpDate)

                let params = {
                    "UserGuid": signupDetails.UserGuid,
                    "DoctorGuid": signupDetails.doctorGuid,
                    "PatientGuid": item.patientGuid,
                    "Version": null,
                    "Data":
                    {
                        "PatientPregnencyDetailsGuId": null,
                        "PregnencyScanGuid": isAddOrEdit == 'add' ? null : this.state.pregnencyScanGuid,
                        "PregnencyScanName": this.state.vaccineName,
                        //  "PregnencyScanintervalGuid":this.state.PregnencyScanintervalGuid,
                        "PregnencyScanintervalGuid": null,
                        "PatientPregnancyGuId": this.state.PatientPregnancyGuId,
                        "LmpDate": lmpDate,
                        // "ActualDelieveryDate":this.state.ActualDelieveryDate,
                        "PatientGuId": item.patientGuid,
                        "ActualDate": actualDay == "YYYY-MM-DD" ? '' : actualDay,
                        "Notes": this.state.notesData,
                        "AppointmentGuid": signupDetails.appoinmentGuid,
                        "DueDate": sendDueDate,
                        "RecordGuid": this.state.recordId,
                        "IntervalGuId": this.state.IntervalGuId,
                        "PatientScanAgeGroupGuid": this.state.PatientScanAgeGroupGuid,
                        "PregnencyAttachmentList": sendDataArr.length > 0 ? sendDataArr : [],
                        "AgeGroupName": this.state.AgeGroupName
                    }
                }
                actions.callLogin('V11/FuncForDrAppToSavePregnencyInfo', 'post', params, signupDetails.accessToken, 'saveorupdatepregnancydata');
                clickFlag =1;
            }
        }
        else if (isAddOrEdit == 'edit' && this.state.editDataArr.length == 0) {

            if (this.state.vaccineName == '' || this.state.vaccineName == null) {
                Snackbar.show({ text: 'Please Enter Test Name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (this.state.showDueDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Due Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // else if (sizeInMb > 10) {
            //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            // else if (this.state.showActualDay == 'DD/MM/YYYY') {
            //     Snackbar.show({ text: 'Please select Actual Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
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

                let adActualDateArr = this.state.showActualDay.split('/');
                let actualDay = adActualDateArr[2] + '-' + adActualDateArr[1] + '-' + adActualDateArr[0];
                let dueDateArr = this.state.showDueDay.split('/');
                let sendDueDate = dueDateArr[2] + '-' + dueDateArr[1] + '-' + dueDateArr[0];
                let lmpDate = this.formatDateForAPI(this.state.lmpDate)
                let params = {
                    "UserGuid": signupDetails.UserGuid,
                    "DoctorGuid": signupDetails.doctorGuid,
                    "PatientGuid": item.patientGuid,
                    "Version": null,
                    "Data":
                    {
                        "PatientPregnencyDetailsGuId": item.patientPregnencyDetailsGuId = null ? null : this.state.patientPregnencyDetailsGuId,
                        "PregnencyScanGuid": isAddOrEdit == 'add' ? null : this.state.pregnencyScanGuid,
                        "PregnencyScanName": this.state.vaccineName,
                        "PregnencyScanintervalGuid": this.state.PregnencyScanintervalGuid,
                        "PatientPregnancyGuId": this.state.PatientPregnancyGuId,
                        "LmpDate": lmpDate,
                        // "ActualDelieveryDate":this.state.ActualDelieveryDate,
                        "PatientGuId": item.patientGuid,
                        "ActualDate": actualDay == "YYYY-MM-DD" ? '' : actualDay,
                        "Notes": this.state.notesData,
                        "AppointmentGuid": signupDetails.appoinmentGuid,
                        "DueDate": sendDueDate,
                        "RecordGuid": this.state.recordId,
                        "IntervalGuId": this.state.IntervalGuId,
                        "PatientScanAgeGroupGuid": this.state.PatientScanAgeGroupGuid,
                        "PregnencyAttachmentList": sendDataArr.length > 0 ? sendDataArr : [],
                        "AgeGroupName": this.state.AgeGroupName
                    }
                }
                actions.callLogin('V11/FuncForDrAppToSavePregnencyInfo', 'post', params, signupDetails.accessToken, 'saveorupdatepregnancydata');
                clickFlag =1;

            }

        }
        else {

            if (this.state.vaccineName == '' || this.state.vaccineName == null) {
                Snackbar.show({ text: 'Please Enter Vaccine Name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (this.state.showDueDay == 'DD/MM/YYYY') {
                Snackbar.show({ text: 'Please select Due Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            // else if (sizeInMb > 10) {
            //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // }
            // else if (this.state.showActualDay == 'DD/MM/YYYY') {
            //     Snackbar.show({ text: 'Please select Actual Date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
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
                    let tempFileExt = '.jpeg';
                    let attachmentUrl = null;
                    let attachGuid = null;
                    let sysFileName = null;
                    if (this.state.editDataArr[i].attachmentGuid == null) {
                        if (this.state.editDataArr[i].uri.indexOf('data:image/jpeg;base64,') > -1) {
                            let tempArr = this.state.editDataArr[i].uri.split('data:image/jpeg;base64,');
                            if (tempArr.length > 1) {
                                tempbase64 = tempArr[1];
                            }
                            // let fileExtArr = this.state.editDataArr[i].imgExtn.split("/");
                            // let fileExt = '.' + fileExtArr[1];
                           // tempFileExt = '.png';
                             //tempFileExt  = fileExt;
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

                let adActualDateArr = this.state.showActualDay.split('/');
                let actualDay = adActualDateArr[2] + '-' + adActualDateArr[1] + '-' + adActualDateArr[0];
                let dueDateArr = this.state.showDueDay.split('/');
                let sendDueDate = dueDateArr[2] + '-' + dueDateArr[1] + '-' + dueDateArr[0];
                let lmpDate = this.formatDateForAPI(this.state.lmpDate)
                let params = {
                    "UserGuid": signupDetails.UserGuid,
                    "DoctorGuid": signupDetails.doctorGuid,
                    "PatientGuid": item.patientGuid,
                    "Version": null,
                    "Data":
                    {
                        "PatientPregnencyDetailsGuId": item.patientPregnencyDetailsGuId = null ? null : this.state.patientPregnencyDetailsGuId,
                        "PregnencyScanGuid": isAddOrEdit == 'add' ? null : this.state.pregnencyScanGuid,
                        "PregnencyScanName": this.state.vaccineName,
                        "PregnencyScanintervalGuid": this.state.PregnencyScanintervalGuid,
                        "PatientPregnancyGuId": this.state.PatientPregnancyGuId,

                        "LmpDate": lmpDate,
                        //"ActualDelieveryDate":this.state.ActualDelieveryDate,
                        "PatientGuId": item.patientGuid,
                        "ActualDate": actualDay == "YYYY-MM-DD" ? '' : actualDay,
                        "Notes": this.state.notesData,
                        "AppointmentGuid": signupDetails.appoinmentGuid,
                        "DueDate": sendDueDate,
                        "RecordGuid": this.state.recordId,
                        "IntervalGuId": this.state.IntervalGuId,
                        "PatientScanAgeGroupGuid": this.state.PatientScanAgeGroupGuid,
                        "PregnencyAttachmentList": sendDataArr.length > 0 ? sendDataArr : [],
                        "AgeGroupName": this.state.AgeGroupName
                    }
                }
                actions.callLogin('V11/FuncForDrAppToSavePregnencyInfo', 'post', params, signupDetails.accessToken, 'saveorupdatepregnancydata');
                clickFlag =1;

            }

        }
    }


    renderItem = (item, index, section) => {
        return (
            <View>
                {
                    item && Object.keys(item).length === 0
                        && Object.getPrototypeOf(item) === Object.prototype ?
                        <TouchableOpacity style={{ alignItems: 'center', marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, borderRadius: responsiveWidth(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}
                            onPress={() => { this.addNewVaccine(section) }}>
                            <Image source={AddIcon} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontNameBold, marginLeft: responsiveWidth(4), color: Color.primary }}>Add Another Test</Text>
                        </TouchableOpacity>
                        :
                        !item.vaccinationStatus || item.vaccinationStatus == "Pending" || item.vaccinationStatus == "Due" || item.vaccinationStatus == "OverDue" ?
                            <View style={{ marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, borderRadius: responsiveWidth(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
                                <View style={{ flex: 1 }}>
                                    <Image source={!item.vaccinationStatus || item.vaccinationStatus == "Pending" ? vacIcon : item.vaccinationStatus == "Due" ? clockOrangeIcon : crossRed} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                                </View>
                                <View style={{ flex: 9, }}>
                                    <Text style={{ marginTop: responsiveHeight(1.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginLeft: responsiveWidth(4), color: Color.fontColor }}>{item.pregnencyScanName}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                        <View style={{}}>
                                            <View>
                                                <Text style={{ marginTop: responsiveHeight(.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: !item.vaccinationStatus || item.vaccinationStatus == "Pending" ? Color.datecolor : item.vaccinationStatus == "Due" ? Color.orangeDue : Color.textDue }}>Due Date : {this.formatDate(item.dueDate)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity onPress={() =>{
                                    selectedChildIndex=index;
                                    this.clickOnEdit(item, section)
                                } } style={{ alignItems: 'center', justifyContent: 'center', flex: 2, padding: responsiveWidth(0.5) }}>
                                    <Image source={editIcon} style={{ width: responsiveFontSize(2), height: responsiveFontSize(2), resizeMode: 'contain' }} />
                                </TouchableOpacity>

                            </View> :
                            <TouchableOpacity onPress={() =>{
                                selectedChildIndex=index;
                                this.clickOnEdit(item, section);
                            } } style={{ marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, borderRadius: responsiveWidth(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
                                <View style={{ flex: 1 }}>
                                    <Image source={vac_tick} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                                </View>
                                <View style={{ flex: 9, }}>
                                    <Text style={{ marginTop: responsiveHeight(1.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginLeft: responsiveWidth(4), color: Color.fontColor }}>{item.pregnencyScanName}</Text>
                                    <View style={{ marginTop: 3 }}>
                                        <View>
                                            <Text style={{ marginTop: responsiveHeight(.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: Color.textGrey, }}>Due Date : {this.formatDate(item.dueDate)}</Text>
                                        </View>
                                        {item.actualDate == null || item.actualDate == '0000-00-00' ?
                                            null
                                            :
                                            <View>
                                                <Text style={{ marginTop: responsiveHeight(.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginLeft: responsiveWidth(4), color: Color.textGrey, }}>Actual Date : {this.formatDate(item.actualDate)}</Text>
                                            </View>
                                        }


                                    </View>
                                </View>
                                {
                                    item.attachmentList == null ? null :
                                        item.attachmentList.length > 1 ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 2, padding: responsiveWidth(0.5) }}>
                                            <Image source={{ uri: item.attachmentList[0].attachmentUrl }} style={{ borderRadius: 5, width: responsiveFontSize(3.5), height: responsiveFontSize(3.5), resizeMode: 'contain' }} />
                                            <Text style={{ position: 'absolute', color: Color.white, fontWeight: CustomFont.fontWeightBold }}>+{item.attachmentList.length - 1}</Text>
                                        </View> : <View style={{ alignItems: 'center', justifyContent: 'center', flex: 2, padding: responsiveWidth(0.5) }}>
                                            <Image source={{ uri: item.attachmentList[0].attachmentUrl }} style={{ borderRadius: 5, width: responsiveFontSize(3.5), height: responsiveFontSize(3.5), resizeMode: 'contain' }} />
                                        </View>

                                }
                            </TouchableOpacity>
                }
            </View>
        );
    };

    addNewVaccine = (section) => {


        this.setState({ tempData: [{}] });
        this.setState({ isVaccineNameEditable: true })
        isAddOrEdit = 'add';
        this.setState({ vaccineName: '' })
        this.setState({ notesData: '' })
        this.setState({ showActualDay: 'DD/MM/YYYY' })
        this.setState({ showDueDay: 'DD/MM/YYYY' })
        this.setState({ addModalOpen: true })

        this.setState({ pregnencyScanGuid: section.data[0].pregnencyScanGuid })
        this.setState({ patientPregnencyDetailsGuId: section.data[0].patientPregnencyDetailsGuId })
        this.setState({ PregnencyScanintervalGuid: section.data[0].pregnencyScanintervalGuid })
        this.setState({ LmpDate: section.data[0].lmpDate })
        this.setState({ ActualDelieveryDate: section.data[0].actualDelieveryDate })


        this.setState({ RecordGuid: section.data[0].recordGuid })
        this.setState({ IntervalGuId: section.data[0].intervalGuId })
        this.setState({ PatientScanAgeGroupGuid: section.data[0].patientScanAgeGroupGuid })
        this.setState({ AgeGroupName: section.ageGroup });
        //SelectedRecordGuid=section.data[0].recordGuid 
        //  this.setState({ PatientPregnancyGuId: section.patientPregnancyGuId })

    }
    typeVaccineName = (text) => {
        this.setState({ vaccineName: text })
    }
    typeNotes = (text) => {
        this.setState({ notesData: text })
    }

    callResetCalender = () => {
        this.setState({ isResetModal: true })
    }

    callAPIForResetCalender = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "userGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "Version": "",
            "Data": {
                "PatientGuid": item.patientGuid,
                "PatientPregnancyGuId": this.state.PatientPregnancyGuId
            }
        }
        //console.log('abc ----------' + JSON.stringify(params))
        actions.callLogin('V1/FuncForDrAppToResetPregnancyCalnderInfo', 'post', params, signupDetails.accessToken, 'resetpregnancydata');
    }

    resetCalendar = () => {
        data = null
        this.setState({ vaccineArray: [] })
        this.callAPIForResetCalender()
        this.setState({ isResetModal: false })
    }

    render() {
        let { loading } = this.props;
        return (
            <SafeAreaView style={CommonStyle.containerlightBg}>
                <View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
                    <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                    {/* <NavigationEvents onDidFocus={() => this.getVaccinationList()} /> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.white }}>
                        <TouchableOpacity onPress={() =>{
                            this.props.navigation.goBack();
                            try {
                                if(isNeedRefresh)
                            this.props.navigation.state.params.Refresh();
                            } catch (error) {
                                
                            }
                        } } style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                                <Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
                            <Text style={{ color: Color.patientSearch, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>Pregnancy Calendar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(2), paddingLeft: responsiveWidth(4), paddingBottom: responsiveWidth(3), }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}>
                            <TouchableOpacity style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}
                                onPress={() => {
                                    isPrepregency=true;
                                    this.setState({ isPrePregnancy: true })
                                    setTimeout(() => {
                                        this.handlePrePostPregnancy(this.state.isPrePregnancy)
                                        this.getVaccinationList();
                                    }, 300);
                                    let { signupDetails } = this.props;
                                    timeRange = Trace.getTimeRange();
                                    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Pre_Pregnancy_Calendar_Time',  signupDetails.firebaseLocation)
                                    Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Pre_Pregnancy_Calendar_Time", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
                            
                                }}>
                                <Image source={this.state.isPrePregnancy ? radioSelected : radioNotSelected} style={{ marginTop: responsiveWidth(2.3), marginRight: responsiveWidth(2), marginBottom: responsiveWidth(2), width: responsiveFontSize(2.2), height: responsiveFontSize(2.2), resizeMode: 'contain' }} />
                                <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text2, fontWeight: 'bold' }}>Pre-Pregnancy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: responsiveWidth(5), justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => {
                                    isPrepregency=false;
                                    this.setState({ isPrePregnancy: false })
                                    //
                                    let { signupDetails } = this.props;
                                    timeRange = Trace.getTimeRange();
                                    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Post_Pregnancy_Calendar_Time',  signupDetails.firebaseLocation)
                                    Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Post_Pregnancy_Calendar_Time", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
                                     //
                                    setTimeout(() => {
                                        this.handlePrePostPregnancy(this.state.isPrePregnancy)
                                        this.getVaccinationList();
                                    }, 300);

                                }}>
                                <Image source={!this.state.isPrePregnancy ? radioSelected : radioNotSelected} style={{ marginTop: responsiveWidth(2.3), marginRight: responsiveWidth(2), marginBottom: responsiveWidth(2), width: responsiveFontSize(2.2), height: responsiveFontSize(2.2), resizeMode: 'contain' }} />
                                <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text2, fontWeight: 'bold' }}>Post-Pregnancy</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 6 }}>
                            <Text style={{ borderColor: '#D5DAF3CC', borderBottomWidth: 1, marginRight: responsiveWidth(3) }} />
                        </View>

                        {this.state.isPrePregnancy && this.state.lmpDate != null && this.state.lmpDate != "" ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.white }}>
                            <Text style={{ marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.text2 }}>Last Menstrual Period Date (LMP) </Text>
                            <Text style={{ marginTop: responsiveHeight(2), marginRight: responsiveHeight(2), fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.text2 }}>{this.state.lmpDate}</Text>
                        </View> : null}

                        {(this.state.isPrePregnancy && this.state.lmpDate != null && this.state.lmpDate != "") ? <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.white }}>
                                <Text style={{ marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2), fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.text2 }} >{this.state.isPrePregnancy ? "Expected Delivery Date (EDD)" : "Actual Delivery Date (ADD)"}</Text>
                                <Text style={{ marginRight: responsiveHeight(2), marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.text2 }}>{this.state.isPrePregnancy ? this.state.edd : this.state.addDate}</Text>
                            </View>
                            <Text style={{ marginTop: 15, fontWeight: 'bold', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primaryBlue }}
                                onPress={this.callResetCalender}>Reset Calendar</Text>
                        </View> : null}


                        {(!this.state.isPrePregnancy && this.state.addDate != null && this.state.addDate != "") ? <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.white }}>
                                <Text style={{ marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2), fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.text2 }} >Actual Delivery Date (ADD)</Text>
                                <Text style={{ marginRight: responsiveHeight(2), marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.text2 }}>{this.state.addDate}</Text>
                            </View>
                            <Text style={{ marginTop: 15, fontWeight: 'bold', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primaryBlue }}
                                onPress={this.callResetCalender}>Reset Calendar</Text>
                        </View> : null}


                        {(!this.state.isPrePregnancy && (this.state.addDate == "" || this.state.addDate == null)) || (this.state.isPrePregnancy && (this.state.lmpDate == null || this.state.lmpDate == "")) ? <View>
                            <View style={{ flex: 6 }}>
                                <Text style={{ borderColor: '#D5DAF3CC', borderBottomWidth: 1, marginRight: responsiveWidth(3) }} />
                            </View>

                            <Text style={{ marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem }} >{this.state.isPrePregnancy ? "Last Menstrual Period Date (LMP)" : "Actual Delivery Date (ADD)"}</Text>
                            <TouchableOpacity style={{ width: responsiveWidth(40), height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1.2), flexDirection: 'row' }}
                                onPress={() => {
                                    this.setState({ isModalVisibleCalendars1: true })
                                }}>
                                <TextInput returnKeyType="done" style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, color: Color.fontColor, textAlign: 'center', fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}
                                    value={this.state.showActualDay1}
                                    editable={false}
                                    placeholder={"DD/MM/YYYY"}
                                    placeholderTextColor={Color.datecolor}
                                />
                                <Image source={CalenderIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginLeft: responsiveWidth(5), marginRight: responsiveWidth(3) }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(50), alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2) }} onPress={() => {
                                // this.props.navigation.navigate('PregnancyList');
                                if (this.state.showActualDay1 === null || this.state.showActualDay1 === '') {
                                    if (this.state.isPrePregnancy) {
                                        alert("Please Select Last Menstrual Date")
                                    }
                                    else {
                                        alert("Please Select Actual Delivery Date")
                                    }

                                } else {
                                    this.getVaccinationList()
                                    // alert(this.state.showSelectedDay)
                                }
                            }}>
                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14 }}>Generate Chart</Text>
                            </TouchableOpacity>
                        </View> : null}
                    </View>

                    <View style={{ flex: 1, backgroundColor: Color.newBgColor }}>
                        {this.state.vaccineArray && this.state.vaccineArray.length == 0 ?
                            <View style={{ alignItems: 'center', marginTop: responsiveHeight(20) }}>
                                {/* <TouchableOpacity onPress={() => this.setState({ addModalOpen: true })}> */}
                                <TouchableOpacity>
                                    <Image source={blank_vaccination} style={{ width: responsiveWidth(40), height: responsiveHeight(40), resizeMode: 'contain' }} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: CustomFont.text1, fontSize: CustomFont.font14, color: Color.text1, opacity: 0.6, marginTop: responsiveHeight(5), }} >No vaccinations recorded</Text>
                            </View>
                            :
                            <View style={{ marginTop: responsiveHeight(1) }}>
                                <SectionList
                                    stickySectionHeadersEnabled={false}
                                    sections={this.state.vaccineArray}
                                    renderItem={({ item, index, section }) => this.renderItem(item, index, section)}
                                    renderSectionHeader={({ section }) => <Text style={{ marginLeft: 18, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold', marginBottom: 6, marginTop: 6 }}>{section.ageGroup}</Text>}
                                    keyExtractor={(item, index) => index} />
                            </View>
                        }
                    </View>

                    <Modal isVisible={this.state.isResetModal}
                        onPress={() => {
                            this.setState({ isResetModal: false });
                        }} onRequestClose={() => this.setState({ isResetModal: false })}>
                        <View style={[styles.modelViewAbout, { height: responsiveHeight(70) }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(2) }}>
                                <View style={{ padding: 7 }}>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 10 }}>Reset Calendar</Text>
                                </View>
                                <TouchableOpacity style={{ padding: 7 }} onPress={() => {
                                    this.setState({ isResetModal: false });
                                }}>
                                    <Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginBottom: 4, alignItems: 'center' }}>
                                <Image source={resetInfo} style={{ marginTop: 80, height: 137, width: 137 }} />
                                <Text style={{ textAlign: 'center', marginTop: 32, marginStart: 22, marginEnd: 22, color: Color.fontColor, fontSize: CustomFont.font14, fontFamily: CustomFont.fontFamily, fontWeight: CustomFont.fontWeight400 }}>
                                    All pregnancy data will be erased and progress will be lost. Are you sure you want to continue?
                                </Text>
                            </View>
                            <View style={{ position: 'absolute', left: responsiveWidth(2), right: responsiveWidth(2), bottom: responsiveHeight(10) }}>
                                <TouchableOpacity style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(1.5), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', alignItems: 'center', height: responsiveHeight(6.5), backgroundColor: Color.primaryBlue, marginTop: responsiveWidth(4) }}
                                    onPress={() => this.resetCalendar()}>
                                    <Text style={{ fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(0), color: Color.white, }}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.addModalOpen}
                        onPress={() => {
                            this.setState({ addModalOpen: false });
                            isFirstAdd = 0;
                        }} onRequestClose={() => this.setState({ addModalOpen: false })}>
                        <View style={[styles.modelViewAbout]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(2) }}>
                                <TouchableOpacity style={{ padding: 7 }}>
                                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 10 }}>{isAddOrEdit == 'add' ? 'Add New Test' : 'Edit ' + this.state.vaccineName} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 7 }} onPress={() => {
                                    this.setState({ addModalOpen: false });
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
                                        style={{ marginTop: 10 }}
                                        ItemSeparatorComponent={this.ItemSeparatorView}
                                        renderItem={({ item, index }) => (
                                            index === this.state.tempData.length - 1 ?
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({ isModalShows: true })
                                                }}style={styles.previewadd} >
                                                        <Image source={AddIcon} style={{ height: 30, width: 30 }} />
                                                        <Text style={styles.add}>Add File</Text>
                                                </TouchableOpacity>
                                                : <View style={[styles.preview, { marginStart: index == 0 ? responsiveWidth(5) : responsiveWidth(8) }]}>
                                                    {item.type === 'image' ? <View style={{ padding: 10 }}>
                                                        <Image source={{ uri: item.uri }} style={{ borderRadius: 5, height: 80, width: 80 }} />
                                                    </View> : <View style={{ padding: 10 }}><Image source={PdfIcon} style={{ height: 80, width: 80, borderRadius: 5 }} /></View>}
                                                    <TouchableOpacity onPress={() => this.removeImage(item, index)} style={{ zIndex:999, borderRadius: 12, backgroundColor: Color.primary, margin:10, right: -15,top: 0, position: 'absolute'}}>
                                                       
                                                        <Image style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} source={CrossIcon} />
                                                       
                                                    </TouchableOpacity>
                                                </View>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>

                                <View style={{ backgroundColor: Color.white, borderRadius: 10, marginStart: 16, marginEnd: 16, marginTop: 20, padding: 7 }}>
                                    <View>

                                        <Text style={styles.titletxt}>Test Name *</Text>
                                        <TextInput returnKeyType="done" editable={this.state.isVaccineNameEditable ? true : false} onFocus={this.callIsFucused} placeholderTextColor={Color.placeHolderColor}
                                            onBlur={this.callIsBlur} value={this.state.vaccineName} onChangeText={this.typeVaccineName}
                                            style={[styles.input, { borderColor: Color.createInputBorder }]} placeholder="Enter Test Name" />
                                        {/* <Text style={styles.titletxt}>Category *</Text> */}
                                        {/* <DropDownPicker
                                            zIndex={999}
                                            items={this.state.category}
                                            // defaultValue={this.title}
                                            containerStyle={{ height: responsiveHeight(7.5), marginBottom: 5 }}
                                            style={{ borderColor: Color.createInputBorder, marginTop: responsiveWidth(1.5) }}
                                            itemStyle={{
                                                justifyContent: 'flex-start'
                                            }}
                                            dropDownStyle={{ backgroundColor: Color.white, zIndex: 999 }}
                                            onChangeItem={item => { consultantwithinGuid = item.consultantWithinGuid; getRecipientList() }}
                                            placeholder="Select"
                                            placeholderTextColor={Color.placeHolderColor}
                                            labelStyle={{ fontSize: CustomFont.font14, color: Color.textGrey }}
                                        /> */}

                                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
                                            <View style={{ flex: 4 }}>
                                                <Text style={[styles.titletxt, { marginTop: 12 }]}>Due Date *</Text>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <TouchableOpacity style={{ width: '100%', height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1.2), flexDirection: 'row' }}
                                                        onPress={() => {
                                                            this.setState({ isModalVisibleCalendarDue: this.state.groupType == 'Others' || isAddOrEdit == 'add' ? true : false })
                                                        }}>
                                                        <Text style={{ flex: 1, marginLeft: responsiveWidth(1.6), fontSize: CustomFont.font14, color: Color.yrColor, textAlign: 'center', fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, width: '100%', }}>{this.state.showDueDay}</Text>
                                                        <Image source={CalenderIcon} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1) }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ flex: 0.3 }}></View>
                                            <View style={{ flex: 4 }}>
                                                <Text style={[styles.titletxt, { marginTop: 12 }]}>Actual Date </Text>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <TouchableOpacity style={{ height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1.2), flexDirection: 'row', width: '100%' }}
                                                        onPress={() => {
                                                            this.setState({ isModalVisibleCalendars: true })
                                                        }}>
                                                        <Text style={{ marginLeft: responsiveWidth(1.6), fontSize: CustomFont.font14, color: Color.yrColor, textAlign: 'center', fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}>{this.state.showActualDay}</Text>
                                                        <Image source={CalenderIcon} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1) }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>

                                        <Text style={[styles.titletxt, { marginTop: responsiveHeight(3) }]}>Notes</Text>
                                        <TextInput returnKeyType="done" editable={true} onFocus={this.callIsFucused} placeholderTextColor={Color.placeHolderColor}
                                            onBlur={this.callIsBlur} value={this.state.notesData} onChangeText={this.typeNotes}
                                            style={[styles.input, { borderColor: Color.createInputBorder }]} placeholder="Add Note" />
                                    </View>
                                </View>
                            </View>

                            <View style={{ position: 'absolute', left: responsiveWidth(2), right: responsiveWidth(2), bottom: responsiveHeight(35) }}>
                                <TouchableOpacity style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(1.5), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', alignItems: 'center', height: responsiveHeight(6.5), backgroundColor: Color.primaryBlue, marginTop: responsiveWidth(4) }}
                                    onPress={() =>{
                                        if(clickFlag ==0)
                                        this.savePress();
                                    }} disabled={loading}>
                                    <Text style={{ fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(0), color: Color.white, }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* <Modal isVisible={this.state.isResetModal}
                            onPress={() => {
                                this.setState({ isResetModal: false });
                            }}>
                            <View style={[styles.modelViewAbout, { height: responsiveHeight(70) }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(2) }}>
                                    <TouchableOpacity style={{ padding: 7 }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 10 }}>Reset Calendar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ padding: 7 }} onPress={() => {
                                        this.setState({ isResetModal: false });
                                    }}>
                                        <Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10, resizeMode: 'contain' }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginBottom: 4, alignItems: 'center' }}>
                                    <Image source={resetInfo} style={{ marginTop: 80, height: 137, width: 137 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 32, marginStart: 22, marginEnd: 22, color: Color.fontColor, fontSize: CustomFont.font14, fontFamily: CustomFont.fontFamily, fontWeight: CustomFont.fontWeight400 }}>
                                        All pregnancy data will be erased and progress will be lost. Are you sure you want to continue?
                                    </Text>
                                </View>
                                <View style={{ position: 'absolute', left: responsiveWidth(2), right: responsiveWidth(2), bottom: responsiveHeight(10) }}>
                                    <TouchableOpacity style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(1.5), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', alignItems: 'center', height: responsiveHeight(6.5), backgroundColor: Color.primaryBlue, marginTop: responsiveWidth(4) }}
                                        onPress={() => this.resetCalendar()}>
                                        <Text style={{ fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(0), color: Color.white, }}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal> */}


                        <Modal isVisible={this.state.isModalVisibleCalendars} onRequestClose={() => this.setState({ isModalVisibleCalendars: false })} >
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
                                            //maxDate={new Date()}
                                            minDate={this.state.isPrePregnancy ? lmpDate:addDate}
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

                        <Modal isVisible={this.state.isModalVisibleCalendarDue} onRequestClose={() => this.setState({ isModalVisibleCalendarDue: false })}>
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
                                            //minDate={new Date()}
                                            minDate={this.state.isPrePregnancy ? lmpDate:addDate}
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
                        <Modal isVisible={this.state.isModalShows} avoidKeyboard={true} onRequestClose={() => this.setState({ isModalShows: false })}>
                            <View style={styles.modelView}>
                                <View style={{ marginBottom: 22, flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, }}>
                                    <Text style={styles.addtxt}>{isAddOrEdit == 'add' ? 'Add Pregnancy' : 'Edit Pregnancy'} </Text>
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
                    <Modal isVisible={this.state.isModalVisibleCalendars1} onRequestClose={() => this.setState({ isModalVisibleCalendars1: false })}>
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
                                            selectedDayReformat1 = Moment(selectedDay).format('DD/MM/YYYY');
                                            // this.setState({ showDueDay: 'DD/MM/YYYY' })
                                        }}
                                        // maxDate={this.state.isPrePregnancy ? new Date() : null}
                                        // minDate={!this.state.isPrePregnancy ? new Date() : null}
                                        maxDate={new Date()}
                                        nextTitleStyle={{color:Color.fontColor}}
                                        previousTitleStyle={{color:Color.fontColor}}
                                        yearTitleStyle={{color:Color.fontColor}}
                                        monthTitleStyle={{color:Color.fontColor}}
                                    />
                                    <View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
                                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleCalendars1: false })}>
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
)(PregnancyList);