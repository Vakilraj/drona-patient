import React from 'react';
import {
    Image, SafeAreaView, ScrollView, Text, Platform, Alert, PermissionsAndroid,
    TouchableOpacity, View, TextInput, DeviceEventEmitter
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
let timeRange = '', PrescriptionGuId = null, filePath = '';

import _ from 'lodash';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Moment from 'moment';
import Language from '../../utils/Language.js';
import AsyncStorage from '@react-native-community/async-storage';
let consultTypeValue = '', isRetry = false, pdfData = null, clickBtnType = '';
let symptomHead = '', findingHead = '', diagionsisHead = '', notes = '', timingAndDur = '', medicine = '', investigationAdvise = '', instructionHead = '', followUpHeadGlobal = '', noteStr = '', procedureHead = '';
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
            showHomeBtn: false,
            languageArr: [
                { value: 'en', index: 0, label: 'English', isTempSelected: false },
                { value: 'be', index: 1, label: 'Bengali', isTempSelected: false },
                { value: 'hi', index: 2, label: 'Hindi', isTempSelected: false },
                { value: 'ma', index: 3, label: 'Marathi', isTempSelected: false },
                { value: 'ta', index: 4, label: 'Tamil', isTempSelected: false },
                { value: 'te', index: 5, label: 'Telegu', isTempSelected: false },
                { value: 'gu', index: 6, label: 'Gujarati', isTempSelected: false },
            ],
        };
    }

    async componentDidMount() {
        isRetry = false;
        let { signupDetails } = this.props;
        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'Prescription_Complete', signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Prescription_Complete", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
        base64ImageArr = [];
        // try {
        //     if (Platform.OS === 'android') {
        //         const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //             this.getConsulatationBillingPreviewData();
        //         } else {
        //             Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
        //         }
        //     } else {

        //         this.getConsulatationBillingPreviewData();
        //     }
        // } catch (err) {
        //     console.warn(err);
        // }
        this.getConsulatationBillingPreviewData();
        this.getPrivateNote();
        prevScreenName = this.props.navigation.state.params.prevScreenName;
        filePath = this.props.navigation.state.params.filePath;
        //console.log(prevScreenName +' ------++-------  '+filePath);
        consultTypeValue = signupDetails.consultType;
        if (prevScreenName == 'handwrittenadd') {
            this.makeBase64ImageArray(this.props.navigation.state.params.imgArr)
        } else if (prevScreenName == 'handwrittenedit') {
            this.makeBase64ImageArrayEditCase(this.props.navigation.state.params.imgArr)
        }
    }
    createPDF = async (prescriptionDataFullArray) => {
        var time = new Date().getTime();
        time = Moment(time).format('h:mm:ss a')
        var date = new Date().getDate();
        date = date < 10 ? '0' + date : '' + date
        var month = new Date().getMonth() + 1;
        month = month < 10 ? '0' + month : '' + month
        var year = new Date().getFullYear();

        let clinicInfo = prescriptionDataFullArray.clinicInfo != null ? prescriptionDataFullArray.clinicInfo : []
        let doctorInfo = prescriptionDataFullArray.doctorInfo != null ? prescriptionDataFullArray.doctorInfo : []
        let patientInfo = prescriptionDataFullArray.patientInfo != null ? prescriptionDataFullArray.patientInfo : []
        let symptomList = prescriptionDataFullArray.symptomList != null ? prescriptionDataFullArray.symptomList : []
        let findingList = prescriptionDataFullArray.findingList != null ? prescriptionDataFullArray.findingList : []
        let medicineList = prescriptionDataFullArray.medicineList != null ? prescriptionDataFullArray.medicineList : []
        let prescriptionNote = prescriptionDataFullArray.prescriptionNote != null ? prescriptionDataFullArray.prescriptionNote : []
        let instructionsList = prescriptionDataFullArray.instructionsList != null ? prescriptionDataFullArray.instructionsList : []
        let investigationList = prescriptionDataFullArray.investigationList != null ? prescriptionDataFullArray.investigationList : []
        let diagnosisList = prescriptionDataFullArray.diagnosisList != null ? prescriptionDataFullArray.diagnosisList : [];
        let procedureList = prescriptionDataFullArray.procedureList != null ? prescriptionDataFullArray.procedureList : []
        let followUpItem = prescriptionDataFullArray.followUp
        let registrationNumber = doctorInfo ? doctorInfo.registrationNumber : ''
        let eSign = prescriptionDataFullArray != null ? prescriptionDataFullArray.esignature : null;
        let prescriptionHeading = Language.language.pres;
        symptomHead = Language.language.symptoms;
        findingHead = Language.language.findings;
        investigationAdvise = Language.language.advisedinvestigation;
        instructionHead = Language.language.instructions;
        diagionsisHead = Language.language.diagnosis;
        followUpHeadGlobal = Language.language.followup;
        procedureHead = Language.language.procedures;
        notes = Language.language.notes;
        medicine = Language.language.medicine;
        timingAndDur = Language.language.timingandduration;
        noteStr = Language.language.note;

        const htmlCode = `
		<style>
	table, th, td {
	  
	  border-collapse: collapse;
	}
	th, td {
	  padding: 5px;
	  text-align: left;
	}
	</style>
	     
		<h1>`+ prescriptionHeading + `</h1>
		<table style="width:100%">
		<tr>
				<td width="20%">
					 <img width="100" height="100" src=`+ clinicInfo.clinicImageUrl + ` />		  
				</td>
				<td width="50%" style="vertical-align:top; ">			
					  <h2>`+ this.showOriginalValueView(clinicInfo.clinicName) + `</h2>
					  <p>`+ this.showOriginalValueView(clinicInfo.clinicAddress) + `</p>
					  `+ this.clinicInfoNo(clinicInfo.clinicNumber) + `
				</td>
				<td width="30%" style="vertical-align:top;">
						<h2>Dr. `+ this.showOriginalValueView(doctorInfo.firstName) + ` ` + this.showOriginalValueView(doctorInfo.lastName) + `</h2>
						`+ this.doctorSpeciality(doctorInfo) + `
						`+ this.doctorEducationView(doctorInfo) + `
						<p>Reg no. : ` + registrationNumber + `</p>
				</td>
		</tr>
	   </table>
	
		 <hr style="height:3px"/>
	
		<table style="width:100%">
		<tr>
		  <td width="70%" ><b>Name:</b> `+ this.showOriginalValueView(patientInfo.firstName) + ` ` + this.showOriginalValueView(patientInfo.lastName) + `</td>		  
		  <td width="30%" ><b>Date:</b> `+ date + `-` + month + `-` + year + `</td>
		</tr>

		<tr>
			<td><b>Sex/Age:</b> `+ this.showOriginalValueView(patientInfo.gender) + `, ` + this.showOriginalValueView(patientInfo.age) + `</td>
			<td><b>Mobile:</b> `+ this.showOriginalValueView(patientInfo.contactNumber) + `</td>
		</tr>

		<tr>
			<td><b>Consult ID:</b> `+ this.showOriginalValueView(patientInfo.patientCode) + `</td>
			<td><b>Consult Type:</b> `+ consultTypeValue + `</td>
	    </tr>

	  </table>
	
		 <hr style="height:3px"/>
	
		
		  `+ this.showSymptomList(symptomList) + `
		  `+ this.showfindingViewList(findingList) + `
		  `+ this.showdiagnosisViewList(diagnosisList) + `
		  `+ this.showmedicineListViewList(medicineList) + `
		  `+ this.showinvestigationsViewList(investigationList) + `
		  `+ this.showinstructionViewList(instructionsList) + `
		  `+ this.showProcedureList(procedureList) + `
		  `+ this.showprescriptionNoteViewList(prescriptionNote) + `
		  `+ this.showfollowUpViewList(followUpItem) + `
		  
		
	
	  <table style="width:100%;margin-bottom:0px">
	  <tr>  
	  <td width="80%"/>
	  <td width="20%">
		<img width="150" height="40" src=`+ eSign + ` />
	  </td>
	  </tr>
	  </table>

	  <table style="width:100%;margin-top:0px">
	  <tr>  
	  <td width="80%"/>
	  <td width="20%">
	  Dr. `+ this.showOriginalValueView(doctorInfo.firstName) + ` ` + this.showOriginalValueView(doctorInfo.lastName) + ` 
	  </td>
	  </tr>
	  </table>
	</table>

		
	 
		  `
        let options = {
            html: htmlCode,

            fileNamey: 'test',
            directory: 'Documents',

        };

        let file = await RNHTMLtoPDF.convert(options)
        filePath = file.filePath;
        if (isRetry && filePath)
            this.completeConsultation(clickBtnType);
        //console.log('---file path--'+filePath)
    }
    followUpView = (followUpItem) => {
        let followUpDate = ''
        if (followUpItem) {
            let followupFormatDate = followUpItem.followUpDate.split("T")[0];
            if (followupFormatDate)
                followUpDate = Moment(followupFormatDate).format('DD-MM-YYYY');
        }
        return `
		<span">`+ followUpDate + `</span>
		 `
    }
    referToView = (referTo) => {
        let referToHead = Language.language.referto;
        let noteStr = Language.language.note;
        <div style="width:60%">{noteStr}</div>
        let temp = []
        if (referTo) {
            const htmlCode = `
			<th style="width:60%">`+ referToHead + ` </br>` + referTo + `</th> 
			 `
            temp.push(htmlCode)
        } else {
            const htmlCode = `
			<th style="width:60%">`+ referToHead + ` </br></th>
			 `
            temp.push(htmlCode)
        }
        return temp
    }

    doctorSpeciality = (doctorInfo) => {
        let htmlCode = `
		<p>`+ doctorInfo.doctorSpeciality[0].specialtyName + ` </p>`;
        return htmlCode;
    }

    clinicInfoNo = (clinicNoInfo) => {
        let temp = []

        if (clinicNoInfo > 0) {
            let htmlCode = `<p>Clinic Ph. No: ` + clinicNoInfo + `</p>`
            temp.push(htmlCode)
            return htmlCode;
        }
        else {
            let htmlCode = ` &nbsp `
            temp.push(htmlCode)
            return htmlCode;
        }
    }

    doctorEducationView = (doctorInfo) => {

        let temp = []
        if (doctorInfo.doctorEducation != null && doctorInfo.doctorEducation.length > 0) {

            for (var i = 0; i < doctorInfo.doctorEducation.length; i++) {
                let tmpStr = ''
                if (doctorInfo.doctorEducation[i].degree) {
                    tmpStr = ' ' + doctorInfo.doctorEducation[i].degree;
                }
                if (doctorInfo.doctorEducation[i].fieldofStudy) {
                    tmpStr += ', ' + doctorInfo.doctorEducation[i].fieldofStudy;
                }
                if (doctorInfo.doctorEducation[i].location) {
                    tmpStr += ', ' + doctorInfo.doctorEducation[i].location;
                }
                temp.push(tmpStr)

            }
        }
        return temp;
    }

    prescriptionNoteView = (prescriptionNoteName) => {

        let temp = []

        if (prescriptionNoteName) {
            prescriptionNoteName = prescriptionNoteName.replace(/\n/g, "</br>")
            const htmlCode = `<span">` + prescriptionNoteName + `</span>`
            temp.push(htmlCode)
        } else {
            const htmlCode = `
			<td></td>
			`
            temp.push(htmlCode)
        }
        return temp

    }
    showOriginalValueView = (value) => {
        let temp = []

        if (value) {
            const htmlCode =
                `` + value + ``
            temp.push(htmlCode)
        } else {
            const htmlCode = `
			&nbsp 
			`
            temp.push(htmlCode)
        }
        return temp
    }
    showSymptomList = (symptomList) => {
        if (symptomList && symptomList.length > 0) {
            let temp = []
            for (var i = 0; i < symptomList.length; i++) {
                let tempStr = '';
                if (symptomList[i].severityName)
                    tempStr = symptomList[i].severityName;
                if (symptomList[i].since)
                    tempStr += tempStr ? ', ' + symptomList[i].since : symptomList[i].since;
                if (symptomList[i].notes)
                    tempStr += tempStr ? ', ' + symptomList[i].notes : symptomList[i].notes;
                if (tempStr)
                    tempStr = '(' + tempStr + ')';

                const htmlCode = (symptomList[i].symptomName) + ' ' + tempStr;
                temp.push(htmlCode)
            }
            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
				<tr>
					<th style="width:15%;">`+ symptomHead + ` :</th>
					<td>`+ temp.join(", ") + `</td>
				</tr>
			</table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }

    showfindingViewList = (findingList) => {
        if (findingList && findingList.length > 0) {
            let temp = []
            for (var i = 0; i < findingList.length; i++) {
                let tempStr = '';
                if (findingList[i].severityName)
                    tempStr = findingList[i].severityName;
                if (findingList[i].since)
                    tempStr += tempStr ? ', ' + findingList[i].since : findingList[i].since;
                if (findingList[i].notes)
                    tempStr += tempStr ? ', ' + findingList[i].notes : findingList[i].notes;
                if (tempStr)
                    tempStr = '(' + tempStr + ')'
                const htmlCode = (findingList[i].findingName) + ' ' + tempStr;
                temp.push(htmlCode)
            }
            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
	  <tr>
		<th style="width:15%;">`+ findingHead + ` :</th>
	   <td>`+ temp.join(", ") + `</td>  
	  </tr> 
	</table> 
			`
            return htmlCode
        }
        else {
            return ''
        }

    }

    showdiagnosisViewList = (diagnosisList) => {
        if (diagnosisList && diagnosisList.length > 0) {
            let temp = []
            for (var i = 0; i < diagnosisList.length; i++) {
                let tempStr = '';
                if (diagnosisList[i].diagnosisStatus)
                    tempStr = diagnosisList[i].diagnosisStatus;
                if (diagnosisList[i].since)
                    tempStr += tempStr ? ', ' + diagnosisList[i].since : diagnosisList[i].since;
                if (diagnosisList[i].notes)
                    tempStr += tempStr ? ', ' + diagnosisList[i].notes : diagnosisList[i].notes;
                if (tempStr)
                    tempStr = '(' + tempStr + ')'
                const htmlCode = (diagnosisList[i].diagnosisName) + ' ' + tempStr;
                temp.push(htmlCode)
            }

            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
		<tr>
		  <th style="width:15%;">`+ diagionsisHead + ` :</th>
		 <td>`+ temp.join(", ") + `</td>  
		</tr> 
	  </table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }

    showmedicineListViewList = (medicineList) => {
        if (medicineList && medicineList.length > 0) {
            let temp = []
            for (var i = 0; i < medicineList.length; i++) {

                const htmlCode = `
				 <tr>
				 <td style="width:35%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;"><b>`+ medicineList[i].medicineName + ` ` + medicineList[i].strength + `</b></br>` + `(<i>` + medicineList[i].medicineDesc + `</i>)` + `</td>
					<td style="width:40%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;"> `+ (medicineList[i].dosagePattern) + (!medicineList[i].medicineTimingFrequency || medicineList[i].medicineTimingFrequency == 'No Preference' ? '' : ' (' + medicineList[i].medicineTimingFrequency + ')') + ` </br> ` + 'dose: ' + medicineList[i].dosages + `, ` + medicineList[i].durationValue + ` ` + medicineList[i].durationType + ` </td>
					<td style="width:25%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;">`+ medicineList[i].note + `</td>
				  </tr>
				 `
                temp.push(htmlCode)
            }

            const htmlCode = `
			<table style="width:100%;margin-top: 20px" >  
		<tr style="display: table-row; vertical-align: inherit;border-color: inherit; ">
			<th width="35%" style="background-color: #14091529;color: #000;text-align: left;font-size: 12px;font-weight: 700;
		  border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ medicine + ` :</th>
			<th width="40%" style="background-color: #14091529;color: #000;text-align: letf;font-size: 12px;font-weight: 700;
		  border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ timingAndDur + `</th>
			<th width="25%" style="background-color: #14091529;color: #000;text-align: left;font-size: 12px;font-weight: 700;
		  border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ notes + `</th>      
		</tr>
	   </tr>

	   <tr>
	   `+ temp + `
	    </tr>
	  </table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }

    showinvestigationsViewList = (investigationList) => {
        if (investigationList && investigationList.length > 0) {
            let temp = []
            for (var i = 0; i < investigationList.length; i++) {
                const htmlCode = investigationList[i].investigationName + ' ' + (investigationList[i].notes ? '(' + investigationList[i].notes + ')' : '');

                temp.push(htmlCode)
            }
            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
			<tr>
			  <th style="width:15%;vertical-align:text-top">`+ investigationAdvise + `:</th>
			 <td style="vertical-align:text-top">`+ temp.join(", ") + `</td>  
			</tr> 
		  </table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }

    showinstructionViewList = (instructionsList) => {
        if (instructionsList && instructionsList.length > 0) {
            let temp = []
            for (var i = 0; i < instructionsList.length; i++) {

                // if (i == 0) {
                const htmlCode = instructionsList[i].instructionsName;
                temp.push(htmlCode)
            }

            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
			<tr>
			  <th style="width:15%;vertical-align:top">`+ instructionHead + ` :</th>
			 <td style="vertical-align:text">`+ temp.join(", ") + `</td>  
			</tr> 
		  </table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }

    showProcedureList = (procedureList) => {
        if (procedureList && procedureList.length > 0) {
            let temp = []
            for (var i = 0; i < procedureList.length; i++) {
                const htmlCode = procedureList[i].procedureName
                temp.push(htmlCode)
            }
            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
				<tr>
					<th style="width:15%;">`+ procedureHead + ` :</th>
					<td>`+ temp.join(", ") + `</td>
				</tr>
			</table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }

    showfollowUpViewList = (followUpItem) => {
        if (followUpItem) {
            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
	  <tr>
		<th style="width:15%;vertical-align:top">`+ followUpHeadGlobal + ` :</th>
	   <td style="vertical-align:text">`+ this.followUpView(followUpItem) + `</td>  
	  </tr> 
	</table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }
    showprescriptionNoteViewList = (prescriptionNote) => {
        if (prescriptionNote.prescriptionNoteName && prescriptionNote.prescriptionNoteName.length > 0) {
            const htmlCode = `
			<table style="width:100%;margin-top: 5px" >
		<tr>
		  <th style="width:15%;vertical-align:text-top">`+ noteStr + ` :</th>
		 <td style="vertical-align:text-top">`+ this.prescriptionNoteView(prescriptionNote.prescriptionNoteName) + `</td>  
		</tr> 
	  </table>
			`
            return htmlCode
        }
        else {
            return ''
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

    // async UNSAFE_componentWillReceiveProps(newProps) {
    //     setApiHandle(this.handleApi, newProps)

    // }
    checkPermission = async (data) => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.createPDF(data);
            } else {
                pdfData = data;
                Alert.alert('Permission Denied!', 'You need to give storage permission to generate pdf');
            }
        } else {
            this.createPDF(data);
        }
    }
    async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
           // console.log('---------------call res'+tagname)
            let response=newProps.responseData.data;

            if (tagname === 'getConsulatationBillingPreviewData') {
                let billingDetailsFullArray = response.billingDetails;
                let patientDetailsFullArray = response.prescriptionData.patientInfo;
                this.setState({ billingDetailsState: billingDetailsFullArray });
                this.setState({ patientDetailsState: patientDetailsFullArray });
                // if (prevScreenName == 'normalPrescription') {
                //     try {
                //         let tempIndex = await AsyncStorage.getItem('lanIndex');
                //         Language.language.setLanguage(this.state.languageArr[tempIndex].value)
                //     } catch (error) {
    
                //     }
                //     this.checkPermission(response.prescriptionData);
                // }
    
            } else if (tagname === 'completeConsultationWithNoti') {
                //DeviceEventEmitter.emit('isComingFromPatient', {});
                //console.log('---------------emmit')
                
                let { signupDetails } = this.props;
                if (prevScreenName == 'normalPrescription') {
                    timeRange = Trace.getTimeRange();
                    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + "E_Prescription_Created", signupDetails.firebaseLocation)
                    Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "E_Prescription_Created", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality, 'prescription_type': 'E_Prescription' })
                } else if (prevScreenName == 'handwrittenadd') {
                    timeRange = Trace.getTimeRange();
                    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'HandWritten_Prescription_Created', signupDetails.firebaseLocation)
                    Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "HandWritten_Prescription_Created", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality, 'prescription_type': 'HandWritten_Prescription' })
                }
                if (response) {
                    PrescriptionGuId = response.prescriptionGuId;
                }
                //if(DRONA.getShowAppoinmentCompleteMsg()!=2){
                   
                //}
                //DRONA.setShowAppoinmentCompleteMsg(1);
                //this.props.navigation.navigate('DoctorHome');
            } else if (tagname === 'completeConsultationWithOutNoti') {
                if (response) {
                    PrescriptionGuId = response.prescriptionGuId;
                    setTimeout(() => {
                        Snackbar.show({ text: 'Appointment Completed successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                    }, 500)
                    // setTimeout(() => {
                    //     this.printRemotePDF();
                    //     this.setState({ showHomeBtn: true })
                    // }, 1500)
                }
            } else if (tagname === 'GetDoctorPrivateNoteComplete') {
                if (response) {
                    DoctorPatientClinicGuid = response.doctorPatientClinicGuid;
                    this.setState({ notesData: response.doctorPrivateNote });
                }
                PrescriptionGuId = response.prescriptionGuId;
                //notesData  DoctorPatientClinicGuid
            }

        }}
    handleApi = async (response, tag) => {
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
        // if (Platform.OS == 'android' && !filePath && prevScreenName == 'normalPrescription') {
        //     Alert.alert(
        //         "Required Permission",
        //         "You need to give storage permission to generate pdf. \n Please try again",
        //         [{
        //             text: "Cancel",
        //             onPress: () => {
        //                 this.props.navigation.goBack();
        //             },
        //             style: "cancel"
        //         },
        //         {
        //             text: 'Ok',
        //             onPress: () => {
        //                 isRetry = true;
        //                 clickBtnType = type;
        //                 this.checkPermission(pdfData)
        //             },
        //         },
        //         ],
        //         { cancelable: false },
        //     );
        // } else {
            RNFS.readFile(filePath, "base64").then(result => {
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
                if (type == 'withNotification'){
                    actions.callLogin('V16/FuncForDrAppToCompleteConsultWithNotification', 'post', params, signupDetails.accessToken, 'completeConsultationWithNoti');
                    //DRONA.setShowAppoinmentCompleteMsg(1);
                    setTimeout(()=>{
                        this.props.navigation.navigate('DoctorHome');
                    },500)
                    
                }
                else{
                    this.printRemotePDF();
                    this.setState({ showHomeBtn: true })
                    setTimeout(() => {
                    actions.callLogin('V16/FuncForDrAppToCompleteConsultWithoutNotification', 'post', params, signupDetails.accessToken, 'completeConsultationWithOutNoti');
                    }, 300)     
                }
            })
        //}
    }
    downloadPdf = async () => {
        if (Platform.OS == 'android') {
            RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
        }
        else {
            RNFetchBlob.ios.previewDocument(filePath);
        }
    }

    async printRemotePDF() {
        let { signupDetails } = this.props;

        setLogEvent("Print_RX", { "Print": "click", UserGuid: signupDetails.UserGuid })
        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'Print_Rx', signupDetails.firebaseLocation)
        Trace.startTracePrintoutSetup(timeRange, signupDetails.firebasePhoneNumber, 'No', signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'PrescriptionTemplate_Printout', signupDetails.firebaseLocation)

        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Print_Rx", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality, })

        base64ImageArr = [];
        await RNPrint.print({ filePath: filePath })
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
                                    this.props.navigation.navigate('PreviewRx', { PreviewPdfPath: filePath, from: prevScreenName })
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
                            <Image source={home_done} style={{ height: responsiveFontSize(3.2), width: responsiveFontSize(3.2), resizeMode: 'contain', marginLeft: 5, tintColor: Color.white }} />
                        </TouchableOpacity> : null}

                    </View>


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
