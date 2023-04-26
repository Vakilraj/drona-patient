import React, { useState } from 'react';
import {
	View,
	Text, Image, TouchableOpacity, PermissionsAndroid
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import TickIcon from '../../../assets/alert.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Moment from 'moment';
import Modal from 'react-native-modal';
import Language from '../../utils/Language.js';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
let flag = 0;
let consultTypeValue = '';
let symptomHead = '', findingHead = '', diagionsisHead = '', notes = '', timingAndDur = '', medicine = '', investigationAdvise = '', instructionHead = '', followUpHeadGlobal = '', noteStr = '',procedureHead = '';
class PreviewRxButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			prescriptionDataFullArray: [],
			billingDetailsFullArray: [],
			successPdfGeneration: false,
			successPdfGenerationMsg: '',
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
		flag == 0;
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		consultTypeValue = signupDetails.consultType;

		// let tempIndex = await AsyncStorage.getItem('lanIndex');
		// Language.language.setLanguage(this.state.languageArr[tempIndex].value)
	}

	// getConsulatationBillingPreviewData = async () => {
	// 	let tempIndex = await AsyncStorage.getItem('lanIndex');
	// 	Language.language.setLanguage(this.state.languageArr[tempIndex].value)

	// 	try {
	// 		if (Platform.OS === 'android') {
	// 			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
	// 			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	// 				this.getFuncForDrAppToConsulatationBillingPreview();
	// 			} else {
	// 				Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
	// 			}
	// 		} else {
	// 			this.getFuncForDrAppToConsulatationBillingPreview();
	// 		}
	// 	} catch (err) {
	// 		console.warn(err);
	// 	}

	// }
	// getFuncForDrAppToConsulatationBillingPreview = () => {
	// 	let { actions, signupDetails } = this.props;
	// 	let params = {
	// 		"RoleCode": signupDetails.roleCode,
	// 		"UserGuid": signupDetails.UserGuid,
	// 		"DoctorGuid": signupDetails.doctorGuid,
	// 		"ClinicGuid": signupDetails.clinicGuid,
	// 		"Version": "",
	// 		"Data": {
	// 			"version": null,
	// 			"AppointmentGuid": signupDetails.appoinmentGuid,
	// 		}
	// 	}
	// 	actions.callLogin('V1/FuncForDrAppToConsulatationBillingPreview', 'post', params, signupDetails.accessToken, 'consulatationBillingPreviewData');
	// }

	// symptomsView = (symptomList) => {
	// 	let temp = []

	// 	for (var i = 0; i < symptomList.length; i++) {
	// 		if (i == 0) {
	// 			const htmlCode = symptomList[i].symptomName
	// 			temp.push(htmlCode)
	// 		}
	// 		else {
	// 			const htmlCode = `, ` + symptomList[i].symptomName
	// 			temp.push(htmlCode)
	// 		}
	// 	}
	// 	return temp.join("")
	// }
	// findingView = (findingList) => {

	// 	let temp = []

	// 	for (var i = 0; i < findingList.length; i++) {
	// 		if (i == 0) {
	// 			const htmlCode = findingList[i].findingName
	// 			temp.push(htmlCode)
	// 		}
	// 		else {
	// 			const htmlCode = `, ` + findingList[i].findingName
	// 			temp.push(htmlCode)
	// 		}
	// 	}
	// 	return temp.join("")
	// }

	// symptomsView = (symptomList) => {
	// 	let temp = []

	// 	for (var i = 0; i < symptomList.length; i++) {

	// 		const htmlCode = `
	// 		  <tr>
	// 	      <td><li>`+ symptomList[i].symptomName + ` </li></td>
	// 	       </tr>
	// 		 `
	// 		temp.push(htmlCode)
	// 	}
	// 	return temp.join("")
	// }
	// findingView = (findingList) => {

	// 	let temp = []

	// 	for (var i = 0; i < findingList.length; i++) {

	// 		const htmlCode = `
	// 		  <tr>
	// 	      <td><li> `+ findingList[i].findingName + ` </li></td>
	// 	       </tr>
	// 		 `
	// 		temp.push(htmlCode)
	// 	}
	// 	return temp.join("")
	// }

	// diagnosisView = (diagnosisList) => {

	// 	let temp = []

	// 	for (var i = 0; i < diagnosisList.length; i++) {
	// 		if (i == 0) {
	// 			const htmlCode = `
	// 		<span">`+ diagnosisList[i].diagnosisName + `</span>
	// 		 `
	// 			temp.push(htmlCode)
	// 		} else {
	// 			const htmlCode = `
	// 		<span">,  `+ diagnosisList[i].diagnosisName + `</span>
	// 		 `
	// 			temp.push(htmlCode)
	// 		}


	// 	}
	// 	return temp.join("")
	// }
	// instructionView = (instructionsList) => {

	// 	let temp = []

	// 	for (var i = 0; i < instructionsList.length; i++) {

	// 		if (i == 0) {
	// 			const htmlCode = `
	// 		<span">`+ instructionsList[i].instructionsName + `</span>
	// 		 `
	// 			temp.push(htmlCode)
	// 		} else {
	// 			const htmlCode = `
	// 		<span">,  `+ instructionsList[i].instructionsName + `</span>
	// 		 `
	// 			temp.push(htmlCode)
	// 		}



	// 	}
	// 	return temp.join("")

	// }

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
		// <th style="width:60%">{noteStr}</th>
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

	// investigationsView = (investigationList) => {

	// 	let temp = []

	// 	for (var i = 0; i < investigationList.length; i++) {

	// 		if (i == 0) {
	// 			const htmlCode = `
	// 		<span">`+ investigationList[i].investigationName + `</span>
	// 		 `
	// 			temp.push(htmlCode)
	// 		} else {
	// 			const htmlCode = `
	// 		<span">,  `+ investigationList[i].investigationName + `</span>
	// 		 `
	// 			temp.push(htmlCode)
	// 		}

	// 	}
	// 	return temp.join("")
	// }

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
		//let htmlCode=``;

		if (doctorInfo.doctorEducation != null && doctorInfo.doctorEducation.length > 0) {

			for (var i = 0; i < doctorInfo.doctorEducation.length; i++) {
				let tmpStr = ''
				if (doctorInfo.doctorEducation[i].degree) {
					//htmlCode= ' ' + doctorInfo.doctorEducation[i].degree;
					tmpStr = ' ' + doctorInfo.doctorEducation[i].degree;
				}
				if (doctorInfo.doctorEducation[i].fieldofStudy) {
					//htmlCode+=`,` +doctorInfo.doctorEducation[i].fieldofStudy;
					tmpStr += ', ' + doctorInfo.doctorEducation[i].fieldofStudy;
				}
				if (doctorInfo.doctorEducation[i].location) {
					//htmlCode=`,` +doctorInfo.doctorEducation[i].location;
					tmpStr += ', ' + doctorInfo.doctorEducation[i].location;
				}

				// htmlCode+= `</br>`

				// const htmlCode = `
				//  	 `+ doctorInfo.doctorEducation[i].degree + `,` + doctorInfo.doctorEducation[i].fieldofStudy + `,` + doctorInfo.doctorEducation[i].location + `</br> 
				//  	`
				//temp.push(htmlCode)
				temp.push(tmpStr)

			}
		}
		return temp

		// return temp.join("")
	}


	// medicineListView = (medicineList) => {
	// 	let temp = []
	// 	for (var i = 0; i < medicineList.length; i++) {

	// 		const htmlCode = `
	// 		 <tr>
	// 			<td style="width:35%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;"><b>`+ medicineList[i].medicineName + ` ` + medicineList[i].strength + `</b></br>` + medicineList[i].medicineDesc + `</td>
	// 			<td style="width:40%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;"> `+ (medicineList[i].dosagePattern) + (medicineList[i].medicineTimingFrequency == 'No Preference' ? ' ' : ' (' + medicineList[i].medicineTimingFrequency + ')') + ` </br> ` + 'dose: ' + medicineList[i].dosages + `, ` + medicineList[i].durationValue + ` ` + medicineList[i].durationType + ` </td>
	// 			<td style="width:25%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;">`+ medicineList[i].note + `</td>
	//       	</tr>
	// 		 `
	// 		temp.push(htmlCode)
	// 	}
	// 	return temp.join("")
	// }
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
                tempStr += tempStr ? ', ' + symptomList[i].since:symptomList[i].since;
            if (symptomList[i].notes)
                tempStr += tempStr ? ', ' + symptomList[i].notes:symptomList[i].notes;
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
                tempStr += tempStr ? ', ' + findingList[i].since :findingList[i].since;
            if (findingList[i].notes)
                tempStr += tempStr ? ', ' + findingList[i].notes:findingList[i].notes;
            if (tempStr)
                tempStr = '(' + tempStr + ')'
				
				// if (i == 0) {
					//const htmlCode = findingList[i].findingName
					const htmlCode = (findingList[i].findingName) + ' ' + tempStr;
					temp.push(htmlCode)
				// }
				//else {
					// const htmlCode = `, ` + findingList[i].findingName
					// temp.push(htmlCode)
				//}
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
				// if (i == 0) {
					//const htmlCode = diagnosisList[i].diagnosisName ;
					let tempStr = '';
            if (diagnosisList[i].diagnosisStatus)
                tempStr = diagnosisList[i].diagnosisStatus;
            if (diagnosisList[i].since)
                tempStr += tempStr ? ', ' + diagnosisList[i].since :diagnosisList[i].since;
            if (diagnosisList[i].notes)
                tempStr += tempStr ? ', ' + diagnosisList[i].notes :diagnosisList[i].notes;
            if (tempStr)
                tempStr = '(' + tempStr + ')'
					const htmlCode = (diagnosisList[i].diagnosisName) + ' ' + tempStr;
				// 	temp.push(htmlCode)
				// } else {
				// 	const htmlCode = `
				// <span">,  `+ diagnosisList[i].diagnosisName + `</span>
				//  `
					temp.push(htmlCode)
				//}


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
				 <td style="width:35%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;"><b>`+ medicineList[i].medicineName + ` ` + medicineList[i].strength + `</b></br>` + `(<i>` + medicineList[i].medicineDesc + `</i>)` +`</td>
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

				// if (i == 0) {
					//const htmlCode =  investigationList[i].investigationName;
					const htmlCode = investigationList[i].investigationName + ' ' + (investigationList[i].notes ? '('+investigationList[i].notes +')': '');
				// 	temp.push(htmlCode)
				// } else {
				// 	const htmlCode = `
				// <span">,  `+ investigationList[i].investigationName + `</span>
				//  `
					temp.push(htmlCode)
				//}

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
					const htmlCode = instructionsList[i].instructionsName ;
				// 	temp.push(htmlCode)
				// } else {
				// 	const htmlCode = `
				// <span">,  `+ instructionsList[i].instructionsName + `</span>
				 //`
					temp.push(htmlCode)
				//}



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
		// alert(JSON.stringify(followUpItem))
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



	createPDF = async (prescriptionDataFullArray, billingDetailsFullArray) => {
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
		// alert(eSign)
		// let eSign = "https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/322a60e8-4ce9-11ec-876f-0022486bcc17.png?sv=2018-03-28&sr=f&sig=uaJhiYzSZKTJRzc2j6BhYsgDyykN5iHunEAZh0H9ssg%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637738577035312777"

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

		{/* <p>Clinic Ph. No: `+ this.showOriginalValueView(clinicInfo.clinicNumber) + `</p> */ }

		// add on 451 when need to implement space reducing task.

		// 	<table style="width:100%">
		// 	<tr>
		// 	  <th style="width:60%">`+ symptomHead + `</th>
		// 	  <th style="width:40%">`+ findingHead + `</th>

		// 	</tr>
		// 	<tr>
		// 	 <td>
		// 	  <div>
		// 	  <table>
		// 	  `+ this.symptomsView(symptomList) + ` 
		// 	  </table>
		// 	  </div>
		// 	  </td>
		// 	  <td>
		// 	  <div>
		// 	   <table>
		// 	  `+ this.findingView(findingList) + `
		// 	  </table>
		// 	  </div>
		// 	  </td>

		// 	</tr>

		//   </table>

		//alert(prescription1)
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
		DRONA.setIsReloadApi(false);
		this.props.nav.navigation.navigate('PreviewRx', { PreviewPdfPath: file.filePath, from: 'normalPrescription', consultId: patientInfo.patientCode });
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'consulatationBillingPreviewData' && DRONA.getIsReloadApi()) { // && flag == 1
				Snackbar.show({ text: 'Generating Pdf. Please wait..', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				try {
					let tempIndex = await AsyncStorage.getItem('lanIndex');
					Language.language.setLanguage(this.state.languageArr[tempIndex].value)
				} catch (error) {

				}

				let data = newProps.responseData.data
				let billingDetailsFullArray = data.billingDetails;
				let prescriptionDataFullArray = data.prescriptionData;
				// if (billingDetailsFullArray == null) {
				// 	this.setState({
				// 		successPdfGeneration: true,
				// 		successPdfGenerationMsg: 'Due to billing data not added. Preview can not be generated.'
				// 	});
				// }
				// else if (billingDetailsFullArray.billingStatus == 'Due') {
				// 	this.setState({
				// 		successPdfGeneration: true,
				// 		successPdfGenerationMsg: 'Record payment is not done'
				// 	});
				// }
				// else if (billingDetailsFullArray.billingStatus == 'Canceled') {
				// 	this.setState({
				// 		successPdfGeneration: true,
				// 		successPdfGenerationMsg: 'Please create bill first'
				// 	});
				// }
				// else {
				this.setState({
					prescriptionDataFullArray: prescriptionDataFullArray,
					billingDetailsFullArray: billingDetailsFullArray
				})
				this.createPDF(prescriptionDataFullArray, billingDetailsFullArray)
				//}
			}
		}
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<View>

				<Modal isVisible={this.state.successPdfGeneration}
					onRequestClose={() => this.setState({ successPdfGeneration: false })}>
					<View style={[styles.modelViewMessage2]}>
						<Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
						<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
							{this.state.successPdfGenerationMsg}
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
)(PreviewRxButton);
