import React, { useState } from 'react';
import {
	ScrollView,
	View,
	Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, FlatList, Alert, BackHandler
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import arrow_right from '../../../assets/arrow_right.png';
import arrow_grey from '../../../assets/arrow_grey.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import search_gray from '../../../assets/search_gray.png';
import CrossTxt from '../../../assets/cross_insearch.png';
import cross_new from '../../../assets/cross_new.png';
import plus_new from '../../../assets/plus_new.png';
import edit_new from '../../../assets/edit_primary.png';
import cross_select from '../../../assets/cross_pink.png';

import cross_pink from '../../../assets/cross_pink.png';

import ThreeDotsModal from './ThreeDotsModal';
import PreviewRxButton from './PreviewRxButton';
import { setLogEvent } from '../../service/Analytics';
import Trace from '../../service/Trace'
let timeRange = '';
let ConditionsFullArray = [], currentMedicationFullArray = [], AllergiesFullArray = [], NotesData = '', NotesGuid = '', patientGuid = '', familyHistoryListGlobal = [],
	FamilyConditionFullArr = [], selectedFamilyHistoryGlobal = [];
let appoinmentGuid = "";
let appointmentStatus = null;
let normalListBackup = [], selectedListBackup = [];
let conditionFlag = false, currentMedicationFlag = false, alergiesFlag = false, familyHistryFlag, significantHitryFlag = false;
let selectedFamilyMemberGuild = '', significantNoteBackup = '', isUpdateGlobalStatusBackup = false;
let medicineFullData = '';
let medicineTypeFullArray = [], customAddMedicationItem = {};
class medicalHistory extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isConditionsModalOpen: false,
			ConditionsArr: [],
			SelectedConditionsArr: [],
			conditionsSearchTxt: '',

			FamilyConditionsArr: [],
			selectedfamilyConditionsArr: [],

			iscurrentMedicationModalOpen: false,
			currentMedicationSearchTxt: '',
			currentMedicationArr: [],
			SelectedcurrentMedicationArr: [],
			isMedicineModalOpen: false,
			addMedicinePopup: false,
			isMedicineTypeSelected: false,
			genericName: '',
			strength: '',
			medicineTypeName: '',
			medicineTypeArr: [],
			medicineFoundStatus: '',
			InpborderColor2: Color.inputdefaultBorder,
			showStateDosage: false,





			isAllergiesModalOpen: false,
			AllergiesArr: [],
			SelectedAllergiesArr: [],
			AllergiesSearchTxt: '',

			notesData: '',
			notesDataGuid: '',
			isModalVisibleSignificant: false,

			isFamilyDetailsModalOpen: false,
			isFamilyMemberModalOpen: false,
			FamilyHistoryArr: [],
			SelectedFamilyHistoryArr: [],
			FamilyHistorySearchTxt: '',

			selectedFamily: '',
			selectedFamilyGuid: '',
			medicineTypeSearchTxt: '',

			fld1: Color.inputdefaultBorder,
			fld2: Color.inputdefaultBorder,
			fld3: Color.inputdefaultBorder,
			fld4: Color.inputdefaultBorder,
			familyHistoryIconStatus: false,
		};
		this.clearArray()
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
	}
	callOnBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.inputdefaultBorder })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.inputdefaultBorder })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.inputdefaultBorder })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.inputdefaultBorder })
		}
	}
	callIsFucused2 = () => {
		this.setState({ InpborderColor2: Color.primary, showStateDosage: true })
	}
	callIsBlur2 = () => {
		this.setState({ InpborderColor2: Color.inputdefaultBorder, })
		//this.dismissDialog()
	}

	clearArray = () => {
		ConditionsFullArray = []; currentMedicationFullArray = []; AllergiesFullArray = [];
		conditionFlag = false;
		currentMedicationFlag = false;
		alergiesFlag = false;
		familyHistryFlag = false;
		significantHitryFlag = false;
		selectedFamilyMemberGuild = '';
	}
	componentDidMount() {
		let { signupDetails } = this.props;
		timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Medical_History_Screen', signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Medical_History_Screen", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
		appoinmentGuid = this.props.data && this.props.data.pastAppointmentGuid ? this.props.data.pastAppointmentGuid : signupDetails.appoinmentGuid;
		patientGuid = this.props.item && this.props.item.patientGuid ? this.props.item.patientGuid : signupDetails.patientGuid;
		appointmentStatus = this.props.item && this.props.item.appointmentStatus ? this.props.item.appointmentStatus : '';
		this.getAdditionalInfo();
		// if (this.props.pastAppointGuid)
		// 	this.setValueFromResponse(this.props.responseDataVisitInfo)
	}
	getAdditionalInfo = () => {
		//alert(this.props.pastAppointGuid)
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"userGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Version": "",
			"Data": { "AppointmentGuid": this.props.pastAppointGuid ? this.props.pastAppointGuid : signupDetails.appoinmentGuid }
		}
		actions.callLogin('V14/FuncForDrAppToGetPatientConsultationMedicalHistoryData', 'post', params, signupDetails.accessToken, 'GetVisitInfoMedicalHistry');

	}

	componentWillUnmount() {
		Trace.stopTrace()
	}

	getMedicineTypeList = () => {
		this.setState({ iscurrentMedicationModalOpen: false });
		let { actions, signupDetails } = this.props;
		let params = {
			"userGuid": signupDetails.UserGuid,
			"doctorGuid": signupDetails.doctorGuid,
			"clinicGuid": signupDetails.clinicGuid,
			"version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetMedicineType', 'post', params, signupDetails.accessToken, 'getmedicinetypeInMedicalHistry');

		// this.setState({ isMedicineModalOpen: false, showStateDosage: false })
		// this.callApiToGetMedicineType();
	}
	// callApiToGetMedicineType = () => {

	// }

	AddCustomMedicine = () => {
		if (this.state.currentMedicationSearchTxt && this.state.medicineTypeName) {
			let { actions, signupDetails } = this.props;
			let params = {
				"userGuid": signupDetails.UserGuid,
				"doctorGuid": signupDetails.doctorGuid,
				"clinicGuid": signupDetails.clinicGuid,
				"version": "",
				"Data": {
					"MedicineName": this.state.currentMedicationSearchTxt,
					"MedicineDesc": this.state.genericName,
					"MedicineTypeGuid": this.state.medicineTypeName,
					"Strength": this.state.strength
				}
			}
			actions.callLogin('V15/FuncForDrAppToAddNewCurrentMedication', 'post', params, signupDetails.accessToken, 'AddMedicineInMedicalHistry');
			// medicineFlag = true;
			DRONA.setIsConsultationChange(true);
		} else {
			Snackbar.show({ text: 'Medicine name and type can not be blank', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}

	}
	typeStregth = (text) => {
		this.setState({ strength: text });
	}
	typeGenericName = (text) => {
		this.setState({ genericName: text });
	}
	typeMedcineName = (text) => {
		this.setState({ currentMedicationSearchTxt: text });
		if (text) {
			if (this.state.medicineTypeName && this.state.medicineTypeName.length > 0)
				this.setState({ isMedicineTypeSelected: true });
		} else {
			this.setState({ isMedicineTypeSelected: false });
		}
	}
	SearchFilterFunctionDosage = (text) => {
		if (text) {
			var searchResult = _.filter(medicineTypeFullArray, function (item) {
				return item.label.toLowerCase().indexOf(text.toLowerCase()) > -1;
			});
			this.setState({ medicineTypeArr: searchResult, showStateDosage: true, medicineTypeSearchTxt: text });
		} else
			this.setState({ medicineTypeSearchTxt: '', medicineTypeArr: medicineTypeFullArray });
	}

	clickOnState = (item) => {
		this.setState({ medicineTypeName: item.value })
		if (this.state.currentMedicationSearchTxt)
			this.setState({ isMedicineTypeSelected: true })
		this.setState({ medicineTypeSearchTxt: item.label, showStateDosage: false })
	}

	savePage = () => {
		if (conditionFlag || currentMedicationFlag || alergiesFlag || familyHistryFlag || significantHitryFlag) {
			let { actions, signupDetails } = this.props;
			let tmpAlergiesArr = [...this.state.SelectedAllergiesArr];
			for (let i = 0; i < tmpAlergiesArr.length; i++) {
				tmpAlergiesArr[i].severityList = null;
				tmpAlergiesArr[i].reactions = null;
			}
			let currMediTmpArr = [...this.state.SelectedcurrentMedicationArr];
			let tmpArr = [];
			if (currMediTmpArr.length > 0) {
				for (let i = 0; i < currMediTmpArr.length; i++) {
					tmpArr.push({ currentMedicationGuid: currMediTmpArr[i].medicineGuid, currentMedicationName: currMediTmpArr[i].medicineName, currentMedicationDesc: currMediTmpArr[i].medicineDesc })
				}
			}
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"PatientGuid": patientGuid,
				"Data": {
					"AppointmentGuid": appoinmentGuid,
					"MedicalHistory": {
						"ConditionList": this.state.SelectedConditionsArr,
						"CurrentMedicationList": tmpArr,
						"AllergyList": tmpAlergiesArr,
						"FamilyHistoryList": selectedFamilyHistoryGlobal,
						"PatientSignificantHistory": {
							"PatientSignificantHistoryGuId": NotesGuid,
							"SignificantHistory": this.state.notesData,
						},
						"IsConditionListUpdated": conditionFlag,
						"IsCurrentMedicationListUpdated": currentMedicationFlag,
						"IsAllergyListUpdated": alergiesFlag,
						"IsFamilyHistoryListUpdated": familyHistryFlag,
						"IsPatientSignificantHistoryUpdated": significantHitryFlag
					}
				}
			}
			DRONA.setIsConsultationChange(false);
			actions.callLogin('V14/FuncForDrAppToAddMedicalHistoryTabModel', 'post', params, signupDetails.accessToken, 'MedicalHistryPageSave');
		} else {
			Snackbar.show({ text: 'No change on this page', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}

	}
	setValueFromResponse = (data) => {
		let patientMedicalHistory = data;//patientMedicalHistory
		selectedFamilyHistoryGlobal = patientMedicalHistory.selectedFamilyHistory ? patientMedicalHistory.selectedFamilyHistory : [];
		ConditionsFullArray = patientMedicalHistory.conditionList ? patientMedicalHistory.conditionList : []
		currentMedicationFullArray = patientMedicalHistory.currentMedicationList ? patientMedicalHistory.currentMedicationList : []
		AllergiesFullArray = patientMedicalHistory.allergyList ? patientMedicalHistory.allergyList : []
		NotesData = patientMedicalHistory.patientSignificantHistory ? patientMedicalHistory.patientSignificantHistory.significantHistory : ''
		significantNoteBackup = NotesData;
		NotesGuid = patientMedicalHistory.patientSignificantHistory ? patientMedicalHistory.patientSignificantHistory.patientSignificantHistoryGuId : ''

		FamilyConditionFullArr = patientMedicalHistory.conditionList ? patientMedicalHistory.conditionList : []

		familyHistoryListGlobal = patientMedicalHistory.familyHistoryList ? patientMedicalHistory.familyHistoryList : []

		let selectedCondition = patientMedicalHistory.selectedConditions && patientMedicalHistory.selectedConditions.length > 0 ? patientMedicalHistory.selectedConditions : []
		let selectedcurrentMedication = patientMedicalHistory.selectedMedications ? patientMedicalHistory.selectedMedications : []
		let selectedAllergies = patientMedicalHistory.selectedAllergies ? patientMedicalHistory.selectedAllergies : []

		ConditionsFullArray = _.differenceBy(ConditionsFullArray, selectedCondition, 'conditionGuid');

		this.setState({
			ConditionsArr: ConditionsFullArray, currentMedicationArr: currentMedicationFullArray ? currentMedicationFullArray : [],
			AllergiesArr: AllergiesFullArray, FamilyHistoryArr: familyHistoryListGlobal, notesData: NotesData,
			notesDataGuid: NotesGuid
		});

		this.setState({
			SelectedConditionsArr: selectedCondition, SelectedcurrentMedicationArr: selectedcurrentMedication,
			SelectedAllergiesArr: selectedAllergies
		})
		let flg = false;
		for (let i = 0; i < familyHistoryListGlobal.length; i++) {
			let selCondition = _.find(selectedFamilyHistoryGlobal, { familyMemberGuid: familyHistoryListGlobal[i].familyMemberGuid })
			if (selCondition && selCondition.patientCondition && selCondition.patientCondition.length > 0) {
				flg = true;
				break;
			}
		}
		this.setState({ familyHistoryIconStatus: flg });
		try {
			if (selectedFamilyHistoryGlobal.length != familyHistoryListGlobal.length) {
				let tmpArr = _.differenceBy(familyHistoryListGlobal, selectedFamilyHistoryGlobal, 'familyMemberGuid');
				selectedFamilyHistoryGlobal = selectedFamilyHistoryGlobal.concat(tmpArr);
			}
		} catch (error) {

		}
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'GetVisitInfoMedicalHistry') {
				try {
					if (newProps.responseData.statusCode == '0') {
						let data = newProps.responseData.data;
						this.setValueFromResponse(data);
					}
				} catch (e) { }
			} else if (tagname === 'MedicalHistryPageSave') {
				setTimeout(() => {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}, 1000)

				if (newProps.responseData.statusCode == '-1') {
					conditionFlag = false;
					currentMedicationFlag = false;
					alergiesFlag = false;
					familyHistryFlag = false;
					significantHitryFlag = false;
				}
			} else if (tagname === 'SearchForConditions') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						temp.push({
							"conditionGuid": null,
							"conditionDesc": null,
							"conditionName": "Add new “" + this.state.conditionsSearchTxt + '”'
						})
						this.setState({ ConditionsArr: temp });
					}
					else
						this.setState({
							ConditionsArr: [{
								"conditionGuid": null,
								"conditionDesc": null,
								"conditionName": "Add new “" + this.state.conditionsSearchTxt + '”'
							}]
						});

				}
			} else if (tagname === 'SearchFamilyConditions') {
				if (newProps.responseData.statusCode == '0') {
					let temp = newProps.responseData.data;
					if (temp) {
						temp.push({
							"conditionGuid": null,
							"conditionDesc": null,
							"conditionName": "Add new “" + this.state.conditionsSearchTxt + '”'
						})
						this.setState({ FamilyConditionsArr: temp });
					} else {
						this.setState({
							FamilyConditionsArr: [{
								"conditionGuid": null,
								"conditionDesc": null,
								"conditionName": "Add new “" + this.state.conditionsSearchTxt + '”'
							}]
						});
					}

				}
			} else if (tagname === 'SearchForcurrentMedication') {
				if (newProps.responseData.statusCode == '0') {
					let tmpObj={
						"patientCurrentMedicationGuid": null,
						"patientAppointmentMedicineGuId": null,
						"medicineGuid": null,
						"medicineName": "Add new “" + this.state.currentMedicationSearchTxt + '”',
						"medicineDesc": null,
						"strength": null,
						"medicineTypeGuid": null,
						"medicineType": null,
					}
					let temp = newProps.responseData.data ? newProps.responseData.data:[];
					temp.push(tmpObj);
					this.setState({currentMedicationArr:temp});
console.log('===='+JSON.stringify(temp));
					// if (newProps.responseData.data && newProps.responseData.data.length > 0) {
					// 	let temp = newProps.responseData.data;
					// 	temp.push({
					// 		"medicineTypeGuid": null,
					// 		"medicineDesc": null,
					// 		"medicineName": "Add new “" + this.state.currentMedicationSearchTxt + '”'
					// 	})
					// 	this.setState({ ConditionsArr: temp });
					// }
					// else
					// 	this.setState({
					// 		currentMedicationArr: [{
					// 			"medicineTypeGuid": null,
					// 			"medicineDesc": null,
					// 			"medicineName": "Add new “" + this.state.currentMedicationSearchTxt + '”'
					// 		}]
					// 	});
				}
			} else if (tagname === 'SearchFoAllergies') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						temp.push({
							"appointmentGuid": null,
							"allergyGuid": null,
							"patientAllergyGuId": null,
							"allergyName": "Add new “" + this.state.AllergiesSearchTxt + '”',
							"allergyDesc": null
						})
						this.setState({ AllergiesArr: temp });
					}
					else
						this.setState({
							AllergiesArr: [{
								"appointmentGuid": null,
								"allergyGuid": null,
								"patientAllergyGuId": null,
								"allergyName": "Add new “" + this.state.AllergiesSearchTxt + '”',
								"allergyDesc": null
							}]
						});
				}
			}
			else if (tagname === 'AddConditions') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {
					let conditionGuid = newProps.responseData.data.conditionGuid;
					let tempArr = [...this.state.SelectedConditionsArr]
					tempArr[tempArr.length - 1].conditionGuid = conditionGuid
					this.setState({ SelectedConditionsArr: tempArr });
				}
				else {
					this.setState({ SelectedConditionsArr: tempArr });
				}
			}
			else if (tagname === 'AddAllergies') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {
					let allergyGuid = newProps.responseData.data.allergyGuid;
					let tempArr = [...this.state.SelectedAllergiesArr]
					tempArr[tempArr.length - 1].allergyGuid = allergyGuid
					this.setState({ SelectedAllergiesArr: tempArr });
				}
				else {
					this.setState({ SelectedAllergiesArr: tempArr });
				}
			}
			else if (tagname === 'AddMedicineInMedicalHistry') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {
					let medicineGuid = newProps.responseData.data.medicineGuid;
					let tempArr = [...this.state.SelectedcurrentMedicationArr];
					customAddMedicationItem.medicineName=newProps.responseData.data.medicineName;
					customAddMedicationItem.medicineDesc=this.state.genericName;
					customAddMedicationItem.strength=this.state.strength;
					customAddMedicationItem.medicineType=this.state.medicineTypeSearchTxt;
					tempArr.push(customAddMedicationItem);
					tempArr[tempArr.length - 1].medicineGuid = medicineGuid
					this.setState({ SelectedcurrentMedicationArr: tempArr });
					// if (!medicineTypeGuid)
					// 	medicineTypeGuid = this.state.medicineTypeName;
					setTimeout(() => {
						this.setState({ addMedicinePopup: false })
					}, 300)
				}
				else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			}
			else if (tagname === 'getmedicinetypeInMedicalHistry') {
				if (newProps.responseData.statusCode == '0') {
					let response = newProps.responseData.data
					let tempMedicineTypeArr = [];

					for (let i = 0; i < response.length; i++) {
						let tempObj = {};
						tempObj.label = response[i].medicineType;
						tempObj.value = response[i].medicineTypeGuid;
						tempMedicineTypeArr.push(tempObj)
					}
					medicineTypeFullArray = tempMedicineTypeArr;
					this.setState({ medicineTypeArr: tempMedicineTypeArr })
					setTimeout(() => {
						this.setState({ addMedicinePopup: true, genericName: '', strength: '', medicineTypeName: '', isMedicineTypeSelected: false, medicineTypeSearchTxt: '' })
					}, 300);
				}
			}else if (tagname === 'AddFamilyConditions') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {
					let conditionGuid = newProps.responseData.data.conditionGuid;
					let tempArr = [...this.state.selectedfamilyConditionsArr]
					tempArr[tempArr.length - 1].conditionGuid = conditionGuid
					this.setState({ selectedfamilyConditionsArr: tempArr });
				}
				// else {
				// 	this.setState({ selectedfamilyConditionsArr: tempArr });
				// }
			}
		}
	}

	//Family history condition
	clickOnFamilyCondition = (item, index) => {
		familyHistryFlag = true;
		DRONA.setIsConsultationChange(true);
		let tempserviceArr = [...this.state.FamilyConditionsArr];
		let selectedTempserviceArr = [...this.state.selectedfamilyConditionsArr];
		item.conditionName = item.conditionName.replace("Add new “", "").replace('”', "")
		let isNameExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].conditionName.toLowerCase() == item.conditionName.toLowerCase()) {
						isNameExist = true;
						break;
					}
				}
		} catch (error) {

		}
		if (isNameExist) {
			Snackbar.show({ text: item.conditionName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.FamilyConditionsArr];
			selectedListBackup = [...this.state.selectedfamilyConditionsArr];


			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			//tempserviceArr = _.differenceBy(tempserviceArr, [item], 'conditionGuid');
			try {
				ConditionsFullArray = _.differenceBy(ConditionsFullArray, [item], 'conditionGuid');
				// selectedFamilyHistoryGlobal.push(item);
			} catch (error) { }
			this.setState({ selectedfamilyConditionsArr: selectedTempserviceArr, FamilyConditionsArr: ConditionsFullArray, conditionsSearchTxt: '' })
			var index2 = _.findIndex(selectedFamilyHistoryGlobal, { familyMemberGuid: selectedFamilyMemberGuild });
			selectedFamilyHistoryGlobal[index2].patientCondition = selectedTempserviceArr;
			let { actions, signupDetails } = this.props;

			setLogEvent("medical_history", { "add_family_condition": "click", UserGuid: signupDetails.UserGuid })
			if (!item.conditionGuid) {
				let params = {
					"userGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid, // item.appointmentGuid,
						"ConditionGuid": item.conditionGuid,//conditionGuidForCustom
						"ConditionName": item.conditionName,
						"ConditionDesc": item.conditionDesc,
					}
				}
				actions.callLogin('V15/FuncForDrAppToAddPatientCondition', 'post', params, signupDetails.accessToken, 'AddFamilyConditions');
			}
		}
	}

	removeSelectedFamilyCondition = (item, index) => {
		let tempserviceArr = [...this.state.FamilyConditionsArr];
		let selectedTempserviceArr = [...this.state.selectedfamilyConditionsArr];

		normalListBackup = [...this.state.FamilyConditionsArr];
		selectedListBackup = [...this.state.selectedfamilyConditionsArr];

		tempserviceArr.push(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ selectedfamilyConditionsArr: selectedTempserviceArr, FamilyConditionsArr: tempserviceArr })
		// selectedFamilyHistoryGlobal = _.differenceBy(selectedFamilyHistoryGlobal, [item], 'conditionGuid');
		ConditionsFullArray.push(item)
		var index2 = _.findIndex(selectedFamilyHistoryGlobal, { familyMemberGuid: selectedFamilyMemberGuild });
		selectedFamilyHistoryGlobal[index2].patientCondition = selectedTempserviceArr;
		let { actions, signupDetails } = this.props;
		setLogEvent("medical_history", { "remove_family_condition": "click", UserGuid: signupDetails.UserGuid })
	}

	//Conditions
	clickOnConditions = (item, index) => {
		conditionFlag = true;
		DRONA.setIsConsultationChange(true)
		let tempserviceArr = [...this.state.ConditionsArr];
		let selectedTempserviceArr = [...this.state.SelectedConditionsArr];
		item.conditionName = item.conditionName.replace("Add new “", "").replace('”', "")
		let isNameExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].conditionName.toLowerCase() == item.conditionName.toLowerCase()) {
						isNameExist = true;
						break;
					}
				}
		} catch (error) {

		}
		if (isNameExist) {
			Snackbar.show({ text: item.conditionName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.ConditionsArr];
			selectedListBackup = [...this.state.SelectedConditionsArr];

			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			try {
				ConditionsFullArray = _.differenceBy(ConditionsFullArray, [item], 'conditionGuid');
			} catch (error) { }
			this.setState({ SelectedConditionsArr: selectedTempserviceArr, ConditionsArr: ConditionsFullArray, conditionsSearchTxt: '' })

			let { actions, signupDetails } = this.props;
			setLogEvent("medical_history", { "add_condition": "click", UserGuid: signupDetails.UserGuid })
			if (!item.conditionGuid) {
				let params = {
					"userGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid, // item.appointmentGuid,
						"ConditionGuid": item.conditionGuid,//conditionGuidForCustom
						"ConditionName": item.conditionName,
						"ConditionDesc": item.conditionDesc,
					}
				}
				actions.callLogin('V15/FuncForDrAppToAddPatientCondition', 'post', params, signupDetails.accessToken, 'AddConditions');
			}
		}
	}
	removeSelectedConditions = (item, index) => {
		let tempserviceArr = [...this.state.ConditionsArr];
		let selectedTempserviceArr = [...this.state.SelectedConditionsArr];

		normalListBackup = [...this.state.ConditionsArr];
		selectedListBackup = [...this.state.SelectedConditionsArr];

		tempserviceArr.push(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedConditionsArr: selectedTempserviceArr, ConditionsArr: tempserviceArr })
		ConditionsFullArray.push(item)

		let { actions, signupDetails } = this.props;
		setLogEvent("medical_history", { "delete_condition": "click", UserGuid: signupDetails.UserGuid })
	}

	SearchConditions = (text, from) => {
		if(text)
		text=text.trim();
		//console.log('------' + JSON.stringify(ConditionsFullArray))
		let { signupDetails } = this.props;
		setLogEvent("medical_history", { "search_condition": "search", UserGuid: signupDetails.UserGuid })
		var searchResult = _.filter(ConditionsFullArray, function (item) {
			return item.conditionName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		// if (searchResult.length == 0) {
		// 	searchResult.push({
		// 		"conditionGuid": null,
		// 		"conditionDesc": null,
		// 		"conditionName": "Add new “" + this.state.conditionsSearchTxt + '”'
		// 	})
		// }
		if (from == 'family') {
			this.setState({
				FamilyConditionsArr: searchResult, conditionsSearchTxt: text
			});
		} else {
			this.setState({
				ConditionsArr: searchResult, conditionsSearchTxt: text
			});
		}

		if (text.length > 2) {
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"Version": "",
				"Data": {
					"SearchText": text
				}
			}
			//console.log("Conditions search params" + JSON.stringify(params));
			actions.callLogin('V1/FuncForDrAppToSearchForPatientCondition', 'post', params, signupDetails.accessToken, from == 'family' ? 'SearchFamilyConditions' : 'SearchForConditions');
		}
	}

	// Add current Medication
	clickOncurrentMedication = (item, index) => {
		currentMedicationFlag = true;
		DRONA.setIsConsultationChange(true);
		let tempserviceArr = [...this.state.currentMedicationArr];
		let selectedTempserviceArr = [...this.state.SelectedcurrentMedicationArr];

		let isNameExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].medicineName.toLowerCase() == item.medicineName.toLowerCase()) {
						isNameExist = true;
						break;
					}
				}
		} catch (error) {

		}
		if (isNameExist) {
			Snackbar.show({ text: item.medicineName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			if (!item.medicineGuid) {
				item.medicineName = item.medicineName.replace("Add new “", "").replace('”', "");
				customAddMedicationItem = item;
				this.getMedicineTypeList(item)

			} else {
				normalListBackup = [...this.state.currentMedicationArr];
				selectedListBackup = [...this.state.SelectedcurrentMedicationArr];


				selectedTempserviceArr.push(item)
				tempserviceArr.splice(index, 1);
				try {
					currentMedicationFullArray = _.differenceBy(currentMedicationFullArray, [item], 'medicineGuid');
				} catch (error) { }

				this.setState({ SelectedcurrentMedicationArr: selectedTempserviceArr, currentMedicationArr: currentMedicationFullArray, currentMedicationSearchTxt: '' })

				let { actions, signupDetails } = this.props;
				setLogEvent("medical_history", { "add_medication": "click", UserGuid: signupDetails.UserGuid })
			}

		}
	}

	removeSelectedcurrentMedication = (item, index) => {
		let tempserviceArr = [...this.state.currentMedicationArr];
		let selectedTempserviceArr = [...this.state.SelectedcurrentMedicationArr];

		normalListBackup = [...this.state.currentMedicationArr];
		selectedListBackup = [...this.state.SelectedcurrentMedicationArr];

		tempserviceArr.push(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedcurrentMedicationArr: selectedTempserviceArr, currentMedicationArr: tempserviceArr })
		currentMedicationFullArray.push(item);
		let { actions, signupDetails } = this.props;

		setLogEvent("medical_history", { "remove_medication": "click", UserGuid: signupDetails.UserGuid })
	}
	SearchcurrentMedication = (text) => {
		if(text)
		text=text.trim();
		var searchResult = _.filter(currentMedicationFullArray, function (item) {
			return item.medicineName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		if (searchResult.length == 0) {
			searchResult.push({
				"patientCurrentMedicationGuid": null,
				"patientAppointmentMedicineGuId": null,
				"medicineGuid": null,
				"medicineName": "Add new “" + text + '”',
				"medicineDesc": null,
				"strength": null,
				"medicineTypeGuid": null,
				"medicineType": null,
			})
		}
		this.setState({
			currentMedicationArr: searchResult, currentMedicationSearchTxt: text
		});
		if (text.length > 2) {
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"Version": "",
				"Data": {
					"SearchText": text
				}
			}
			actions.callLogin('V14/FuncForDrAppToSearchForPatientCurrentMedication', 'post', params, signupDetails.accessToken, 'SearchForcurrentMedication');
		}
		let { actions, signupDetails } = this.props;
		setLogEvent("medical_history", { "search_medication": "search", UserGuid: signupDetails.UserGuid, keyword: text })
	}

	// Allergies
	clickOnAllergies = (item, index) => {
		alergiesFlag = true;
		DRONA.setIsConsultationChange(true);
		let tempserviceArr = [...this.state.AllergiesArr];
		let selectedTempserviceArr = [...this.state.SelectedAllergiesArr];
		item.allergyName = item.allergyName.replace("Add new “", "").replace('”', "")
		let isNameExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].allergyName.toLowerCase() == item.allergyName.toLowerCase()) {
						isNameExist = true;
						break;
					}
				}
		} catch (error) {

		}
		if (isNameExist) {
			Snackbar.show({ text: item.allergyName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.AllergiesArr];
			selectedListBackup = [...this.state.SelectedAllergiesArr];

			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			try {
				AllergiesFullArray = _.differenceBy(AllergiesFullArray, [item], 'allergyGuid');
			} catch (error) { }
			this.setState({ SelectedAllergiesArr: selectedTempserviceArr, AllergiesArr: AllergiesFullArray, AllergiesSearchTxt: '' })

			let { actions, signupDetails } = this.props;
			setLogEvent("medical_history", { "add_allergies": "click", UserGuid: signupDetails.UserGuid })
			if (!item.allergyGuid) {
				let params = {
					"userGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid, // item.appointmentGuid,
						"AllergyGuid": item.allergyGuid,
						"AllergyName": item.allergyName,
						"AllergyDesc": item.allergyDesc,
					}
				}
				actions.callLogin('V15/FuncForDrAppToAddNewAllergiesV15', 'post', params, signupDetails.accessToken, 'AddAllergies');
			}
		}
	}
	removeSelectedAllergies = (item, index) => {
		let tempserviceArr = [...this.state.AllergiesArr];
		let selectedTempserviceArr = [...this.state.SelectedAllergiesArr];
		normalListBackup = [...this.state.AllergiesArr];
		selectedListBackup = [...this.state.SelectedAllergiesArr];

		tempserviceArr.push(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedAllergiesArr: selectedTempserviceArr, AllergiesArr: tempserviceArr })
		AllergiesFullArray.push(item);

		let { actions, signupDetails } = this.props;
		setLogEvent("medical_history", { "remove_allergies": "click", UserGuid: signupDetails.UserGuid })
	}

	SearchAllergies = (text) => {
		if(text)
		text=text.trim();
		var searchResult = _.filter(AllergiesFullArray, function (item) {
			return item.allergyName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		// if (searchResult.length == 0) {
		// 	searchResult.push({
		// 		"appointmentGuid": null,
		// 		"allergyGuid": null,
		// 		"patientAllergyGuId": null,
		// 		"allergyName": "Add new “" + text + '”',
		// 		"allergyDesc": null
		// 	})
		// }
		this.setState({
			AllergiesArr: searchResult, AllergiesSearchTxt: text
		});
		if (text.length > 2) {
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"Version": "",
				"Data": {
					"SearchText": text
				}
			}
			actions.callLogin('V1/FuncForDrAppToSearchForAllergies', 'post', params, signupDetails.accessToken, 'SearchFoAllergies');
		}
		let { signupDetails } = this.props;
		setLogEvent("medical_history", { "search_allergies": "search", UserGuid: signupDetails.UserGuid, keyword: text })
	}

	saveSignificantHistory = (updatedSignificantHistory) => {
		this.setState({ fld4: Color.inputdefaultBorder })
		if (!this.state.notesData) {
			Snackbar.show({ text: 'Please enter on notes', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			Trace.stopTrace()
			this.setState({ isModalVisibleSignificant: false })
			let { actions, signupDetails } = this.props;

			let HistoryFlag = "";//Add

			if (this.state.notesData && this.state.notesData.length > 0) {
				HistoryFlag = this.state.notesDataGuid;
			}
			else {
				HistoryFlag = null;
			}

			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"Data": {
					"AppointmentGuid": appoinmentGuid,
					"SignificantHistory": updatedSignificantHistory,
					"PatientSignificantHistoryGuId": HistoryFlag,
				}
			}
			actions.callLogin('V1/FuncForDrAppToAddPatientSignificantHistory', 'post', params, signupDetails.accessToken, 'saveUpdatedSignificantHistory');
			setLogEvent("medical_history", { "add_significant": "click", UserGuid: signupDetails.UserGuid, })
		}
	}

	renderSeparatorTag = () => {
		return <View style={{ marginTop: 0, height: 1, backgroundColor: Color.divider, opacity: 1 }} />;
	};

	getSelectedConditionsTxt = () => {
		let tmpArr = [...this.state.SelectedConditionsArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].conditionName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	getSelectedcurrentMedicationTxt = () => {
		let tmpArr = [...this.state.SelectedcurrentMedicationArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].medicineName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	getSelectedAllergiesTxt = () => {
		let tmpArr = [...this.state.SelectedAllergiesArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].allergyName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}

	getSelectedFamilyConditionTxt = () => {
		let tmpArr = [...this.state.selectedfamilyConditionsArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].conditionName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	getComditionUnderFamily = (familyMemberGuid, familyHistoryName) => {
		let str = '';
		try {
			let selCondition = _.find(selectedFamilyHistoryGlobal, { familyMemberGuid: familyMemberGuid })
			if (selCondition && selCondition.patientCondition && selCondition.patientCondition.length > 0) {
				let patientCondition = selCondition.patientCondition;
				for (let i = 0; i < patientCondition.length; i++) {
					str += patientCondition[i].conditionName + ', ';
				}
				if (familyHistoryName)
					str = familyHistoryName + ' (' + str.replace(/,\s*$/, "") + ') '
				else
					str = str.replace(/,\s*$/, "");
			}
		} catch (error) {
		}
		return str;
	}
	RefreshPatient = (val) => {
		this.props.RefreshPatient(val);
	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
				<View style={{ flex: 1 }}>
					<ScrollView style={{ flex: 1 }}>
						<View>

							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Conditions_Popup', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Conditions_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({
									isConditionsModalOpen: true
								});
							}}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>

										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Conditions</Text>
											<TouchableOpacity onPress={() => {
												let { signupDetails } = this.props;
												timeRange = Trace.getTimeRange();
												Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Conditions_Popup', signupDetails.firebaseLocation)
												Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Conditions_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
												this.setState({
													isConditionsModalOpen: true
												});
											}}>
												{this.state.SelectedConditionsArr && this.state.SelectedConditionsArr.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} />}
											</TouchableOpacity>
										</View>
										<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
											{this.state.SelectedConditionsArr && this.state.SelectedConditionsArr.length > 0 ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedConditionsTxt()}</Text> : null}
										</View>
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Current_Medication_Popup', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Current_Medication_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({
									iscurrentMedicationModalOpen: true
								});
							}}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>

										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Current Medication</Text>
											<TouchableOpacity onPress={() => {
												let { signupDetails } = this.props;
												timeRange = Trace.getTimeRange();
												Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Current_Medication_Popup', signupDetails.firebaseLocation)
												Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Current_Medication_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
												this.setState({
													iscurrentMedicationModalOpen: true
												});
											}}>
												{this.state.SelectedcurrentMedicationArr && this.state.SelectedcurrentMedicationArr.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} />}
											</TouchableOpacity>
										</View>
										{this.state.SelectedcurrentMedicationArr && this.state.SelectedcurrentMedicationArr.length > 0 ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedcurrentMedicationTxt()}</Text> : null}
									</View>
								</View>
							</TouchableOpacity>


							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Allergies_Popup', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Allergies_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({
									isAllergiesModalOpen: true
								});
							}}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Allergies</Text>
											<TouchableOpacity onPress={() => {
												let { signupDetails } = this.props;
												timeRange = Trace.getTimeRange();
												Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Allergies_Popup', signupDetails.firebaseLocation)
												Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Allergies_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

												this.setState({
													isAllergiesModalOpen: true
												});
											}}>
												{this.state.SelectedAllergiesArr && this.state.SelectedAllergiesArr.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} />}
											</TouchableOpacity>
										</View>
										{this.state.SelectedAllergiesArr && this.state.SelectedAllergiesArr.length > 0 ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedAllergiesTxt()}</Text> : null}
									</View>
								</View>
							</TouchableOpacity>


							<TouchableOpacity onPress={() => {
								this.setState({ isFamilyMemberModalOpen: true })

							}}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Family History</Text>
											<TouchableOpacity onPress={() => {
												this.setState({ isFamilyMemberModalOpen: true })

											}}>
												{this.state.familyHistoryIconStatus ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} />}
											</TouchableOpacity>
										</View>
										<View style={{ flexDirection: 'column', marginTop: 5 }}>
											{this.state.FamilyHistoryArr && this.state.FamilyHistoryArr.length > 0 ? this.state.FamilyHistoryArr.map((item, index) => {
												return (
													<View style={{ flexDirection: 'row', }}>
														{this.getComditionUnderFamily(item.familyMemberGuid, item.familyHistoryName) ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getComditionUnderFamily(item.familyMemberGuid, item.familyHistoryName)}</Text> : null}

													</View>
												);
											}, this) : null}
										</View>
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Significant_History_Popup', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Significant_History_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								isUpdateGlobalStatusBackup = DRONA.getIsConsultationChange();
								DRONA.setIsConsultationChange(false)
								this.setState({ isModalVisibleSignificant: true, })
							}}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(2) }}>
									<View style={{ margin: responsiveWidth(5) }}>

										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Other History</Text>

											{this.state.notesData && this.state.notesData.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} />}

										</View>
										{this.state.notesData && this.state.notesData.length > 0 ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.state.notesData}</Text> : null}

									</View>
								</View>
							</TouchableOpacity>

						</View>
					</ScrollView>

					<View style={{ backgroundColor: Color.white, flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 10, justifyContent: 'center' }}>

						<ThreeDotsModal item={this.props.item} nav={{ navigation: this.props.nav.navigation }} RefreshPatient={this.RefreshPatient} />

						{!appointmentStatus || (appointmentStatus == 'No Show' || appointmentStatus == 'Cancelled' || appointmentStatus == 'Completed' || signupDetails.isAssistantUser || !signupDetails.appoinmentGuid || (this.props.item.consultationType == 'Virtual' && !this.props.item.isPaymentReceived))
							?
							<View style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.disabledBtn, borderRadius: 5, marginTop: 7, marginBottom: 7 }}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Save</Text>
							</View>
							:
							<TouchableOpacity onPress={() => {
								if (this.props.showCall) {
									Snackbar.show({ text: 'Please end the video call.', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								} else {
									this.savePage();
								}



							}} style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.primary, borderRadius: 5, marginTop: 7, marginBottom: 7 }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16 }}>Save</Text>
							</TouchableOpacity>

							//<PreviewRxButton nav={{ navigation: this.props.nav.navigation }} showCall={this.props.showCall} />
						}


					</View>

				</View>

				{/* -----------------Conditions modal------------- */}
				<Modal isVisible={this.state.isConditionsModalOpen} onRequestClose={() => this.setState({ isConditionsModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>
						<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(10) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({
										fld1: Color.inputdefaultBorder, isConditionsModalOpen: false, conditionsSearchTxt: ''
									})
								}}>
									<Image source={cross_new} style={{ height: responsiveWidth(5), width: responsiveWidth(6), marginRight: 10 }} />
								</TouchableOpacity>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.darkText, opacity: 0.8, fontWeight: 'bold' }}>Conditions</Text>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({ fld1: Color.inputdefaultBorder, isConditionsModalOpen: false, conditionsSearchTxt: '' }
									)
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primary }}>Done</Text>
								</TouchableOpacity>
							</View>

							<View style={[styles.searchView, { borderColor: this.state.fld1 }]}>
								<Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
								<TextInput returnKeyType="done"
									onFocus={() => this.callOnFocus('1')}
									onBlur={() => this.callOnBlur('1')}
									placeholderTextColor={Color.placeHolderColor}
									style={styles.searchInput} placeholder="search conditions" value={this.state.conditionsSearchTxt}
									onChangeText={(conditionsSearchTxt) => this.SearchConditions(conditionsSearchTxt, 'con')} />
								{this.state.conditionsSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ conditionsSearchTxt: '', ConditionsArr: ConditionsFullArray }); }}>
									<Image style={styles.crossSearch} source={CrossTxt} />
								</TouchableOpacity> : null}
							</View>

							<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 ,marginRight:15}}>
								{this.state.SelectedConditionsArr && this.state.SelectedConditionsArr.length > 0 ? this.state.SelectedConditionsArr.map((item, index) => {
									return (<View style={styles.selectedView} >
										<Text style={styles.txtSelect}>{item.conditionName}</Text>
										<TouchableOpacity style={styles.crossSelected}
											onPress={() => {
												conditionFlag = true;
												DRONA.setIsConsultationChange(true)
												this.removeSelectedConditions(item, index)
											}}>
											<Image source={cross_select} style={{ height: responsiveWidth(3.8), width: responsiveWidth(4), }} />
										</TouchableOpacity></View>);
								}, this) : null}
							</View>

							<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
								{this.state.ConditionsArr && this.state.ConditionsArr.length > 0 ? this.state.ConditionsArr.map((item, index) => {
									return (<TouchableOpacity style={styles.unselectView} onPress={() => this.clickOnConditions(item, index)} >
										<Text style={styles.unselectTxtColor}>{item.conditionName}</Text>
									</TouchableOpacity>
									);
								}, this) : null}
							</View>
						</View>
					</View>
				</Modal>

				{/* -----------------Current Medication modal------------- */}
				<Modal isVisible={this.state.iscurrentMedicationModalOpen} onRequestClose={() => this.setState({ iscurrentMedicationModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>
						<ScrollView style={{ marginBottom: 40 }} keyboardShouldPersistTaps='always'>
							<View >
								<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(10) }}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => {
											Trace.stopTrace()
											this.setState({
												fld2: Color.inputdefaultBorder, iscurrentMedicationModalOpen: false, currentMedicationSearchTxt: ''
											})
										}}>
											<Image source={cross_new} style={{ height: responsiveWidth(5), width: responsiveWidth(6), marginRight: 10 }} />
										</TouchableOpacity>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, fontWeight: 'bold', opacity: 0.8 }}>Medicines</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => {
											Trace.stopTrace()
											this.setState({
												fld2: Color.inputdefaultBorder, iscurrentMedicationModalOpen: false, currentMedicationSearchTxt: ''
											})
										}}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary }}>Done</Text>
										</TouchableOpacity>
									</View>

									<View style={[styles.searchView, { borderColor: this.state.fld2 }]}>
										<Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
										<TextInput returnKeyType="done"
											onFocus={() => this.callOnFocus('2')}
											onBlur={() => this.callOnBlur('2')}
											placeholderTextColor={Color.placeHolderColor}
											style={styles.searchInput} placeholder="search medicine" value={this.state.currentMedicationSearchTxt}
											onChangeText={(currentMedicationSearchTxt) => this.SearchcurrentMedication(currentMedicationSearchTxt)} />
										{this.state.currentMedicationSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ currentMedicationSearchTxt: '', currentMedicationArr: currentMedicationFullArray }); }}>
											<Image style={styles.crossSearch} source={CrossTxt} />
										</TouchableOpacity> : null}
									</View>

									<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3,marginRight:15 }}>
										{this.state.SelectedcurrentMedicationArr && this.state.SelectedcurrentMedicationArr.length > 0 ? this.state.SelectedcurrentMedicationArr.map((item, index) => {
											return (<View style={styles.selectedView} >
												<Text style={styles.txtSelect}>{item.medicineName}</Text>
												<TouchableOpacity style={styles.crossSelected}
													onPress={() => {
														currentMedicationFlag = true;
														DRONA.setIsConsultationChange(true);
														this.removeSelectedcurrentMedication(item, index)
													}}>
													<Image source={cross_pink} style={{ height: responsiveWidth(3.8), width: responsiveWidth(4), }} />
												</TouchableOpacity></View>);
										}, this) : null}
									</View>

									<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
										{this.state.currentMedicationArr && this.state.currentMedicationArr.length > 0 ? this.state.currentMedicationArr.map((item, index) => {
											return (<TouchableOpacity style={styles.unselectView} onPress={() => this.clickOncurrentMedication(item, index)} >
												<Text style={styles.unselectTxtColor}>{item.medicineName}</Text>
											</TouchableOpacity>
											);
										}, this) : null}
									</View>
								</View>
							</View>
						</ScrollView>
					</View>
				</Modal>

				{/* ----------------- Add New Medicine modal------------- */}
				<Modal isVisible={this.state.addMedicinePopup}>
					<View style={[styles.modelViewMessageMedicine]}>
						<ScrollView keyboardShouldPersistTaps='always'>
							<View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Color.white }}>
								<View style={{ marginTop: responsiveHeight(2), marginLeft: responsiveWidth(7), marginRight: responsiveWidth(7) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }} >
										<Text style={{ flex: 1, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, color: Color.fontColor }} onPress={() => this.props.navigation.goBack()}>Add New Medicine</Text>
										<TouchableOpacity onPress={() => this.setState({ addMedicinePopup: false })} style={{ flex: 1, alignItems: 'flex-end' }}>
											<Image style={{ resizeMode: 'contain', height: responsiveHeight(4), width: responsiveWidth(4) }} source={cross_new} />
										</TouchableOpacity>
									</View>

									<View style={{ marginTop: responsiveHeight(2) }}>
										<Text style={{ color: Color.optiontext, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12 }}>Medicine Name *</Text>
										<TextInput returnKeyType="done" onChangeText={this.typeMedcineName} value={this.state.currentMedicationSearchTxt} style={{ paddingLeft: 5, borderColor: Color.borderColor, borderRadius: 7, marginTop: 10, height: responsiveHeight(5.5), borderWidth: 1, color: Color.fontColor, textTransform: 'capitalize' }} />
									</View>
									<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
										<View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
											<Text style={{ color: Color.optiontext, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12 }}>Generic Name</Text>
											<TextInput returnKeyType="done" onChangeText={this.typeGenericName} value={this.state.genericName} placeholderTextColor={Color.textGrey} placeholder="Enter Name" style={{ paddingLeft: 5, borderColor: Color.borderColor, borderRadius: 7, marginTop: 10, height: responsiveHeight(5.5), borderWidth: 1, color: Color.fontColor }} />
										</View>
										<View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
											<Text style={{ color: Color.optiontext, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12 }}>Strength</Text>
											<TextInput returnKeyType="done" onChangeText={this.typeStregth} value={this.state.strength} placeholderTextColor={Color.textGrey} placeholder="Enter strength" style={{ paddingLeft: 5, borderColor: Color.borderColor, borderRadius: 7, marginTop: 10, height: responsiveHeight(5.5), borderWidth: 1, color: Color.fontColor }} />
										</View>
									</View>
									<View style={{ marginTop: responsiveHeight(2) }}>
										<Text style={{ color: Color.optiontext, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12 }}>Medicine Type *</Text>
										<TextInput onBlur={this.callIsBlur2} onFocus={this.callIsFucused2} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor2 }]} placeholder="Search/Choose type" placeholderTextColor={Color.placeHolderColor} value={this.state.medicineTypeSearchTxt} onChangeText={(medicineTypeSearchTxt) => { return this.SearchFilterFunctionDosage(medicineTypeSearchTxt); }} maxLength={15} />

										<View style={{ flex: 1 }}>
											{this.state.showStateDosage ?
												<View style={{
													borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
													borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
												}}>
													{this.state.medicineTypeArr && this.state.medicineTypeArr.length > 0 ? <FlatList style={{ backgroundColor: '#fafafa', height: responsiveHeight(32) }}
														data={this.state.medicineTypeArr}
														renderItem={({ item, index }) => (
															<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
																onPress={() => this.clickOnState(item)}>
																<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }}>{item.label}</Text>
															</TouchableOpacity>
														)}
														keyExtractor={(item, index) => index.toString()}
													/> : null}

												</View> : null}
										</View>

										{/* <DropDownPicker zIndex={999}
										items={this.state.medicineTypeArr}
										containerStyle={{ height: responsiveHeight(6.5) }}
										style={{ backgroundColor: '#FFF', marginTop: 10 }}
										itemStyle={{
											justifyContent: 'flex-start', height: responsiveHeight(5)
										}}
										dropDownStyle={{ backgroundColor: '#FFF', zIndex: 4 }}
										onChangeItem={item => {
											this.setState({ medicineTypeName: item.value })
											if (this.state.currentMedicationSearchTxt)
												this.setState({ isMedicineTypeSelected: true })
										}}
										globalTextStyle={{ color: Color.fontColor }}
										placeholder="Search/Choose type"
										placeholderTextColor={Color.textGrey}
										labelStyle={{
											color: Color.text1, marginLeft: 5, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName
										}}
									/> */}
									</View>


									<TouchableOpacity style={{
										marginTop: this.state.showStateDosage ? responsiveHeight(3) : responsiveHeight(15), marginBottom: responsiveHeight(4),
										backgroundColor: this.state.isMedicineTypeSelected ? Color.primary : Color.btnDisable, borderRadius: 10, height: responsiveHeight(6),
										alignItems: 'center', justifyContent: 'center',
									}} onPress={this.AddCustomMedicine}>
										<Text style={{
											fontFamily: CustomFont.fontName, color: Color.white,
											fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700
										}}>Add</Text>
									</TouchableOpacity>
								</View>

							</View>
						</ScrollView>

					</View>
				</Modal>


				{/* -----------------Allergy modal------------- */}
				<Modal isVisible={this.state.isAllergiesModalOpen} onRequestClose={() => this.setState({ isAllergiesModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>
						<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(10) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({
										fld3: Color.inputdefaultBorder, isAllergiesModalOpen: false, AllergiesSearchTxt: ''
									})
								}}>
									<Image source={cross_new} style={{ height: responsiveWidth(5), width: responsiveWidth(6), marginRight: 10 }} />
								</TouchableOpacity>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, fontWeight: 'bold' }}>Allergies</Text>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({
										fld3: Color.inputdefaultBorder, isAllergiesModalOpen: false, AllergiesSearchTxt: ''
									})
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary }}>Done</Text>
								</TouchableOpacity>
							</View>

							<View style={[styles.searchView, { borderColor: this.state.fld3 }]}>
								<Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
								<TextInput returnKeyType="done"
									onFocus={() => this.callOnFocus('3')}
									onBlur={() => this.callOnBlur('3')}
									placeholderTextColor={Color.placeHolderColor}
									style={styles.searchInput} placeholder="search allergy" value={this.state.AllergiesSearchTxt}
									onChangeText={(AllergiesSearchTxt) => this.SearchAllergies(AllergiesSearchTxt)} />
								{this.state.AllergiesSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ AllergiesSearchTxt: '', AllergiesArr: AllergiesFullArray }); }}>
									<Image style={styles.crossSearch} source={CrossTxt} />
								</TouchableOpacity> : null}
							</View>

							<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3,marginRight:15 }}>
								{this.state.SelectedAllergiesArr && this.state.SelectedAllergiesArr.length > 0 ? this.state.SelectedAllergiesArr.map((item, index) => {
									return (<View style={styles.selectedView} >
										<Text style={styles.txtSelect}>{item.allergyName}</Text>
										<TouchableOpacity style={styles.crossSelected}
											onPress={() => {
												alergiesFlag = true;
												DRONA.setIsConsultationChange(true);
												this.removeSelectedAllergies(item, index)
											}}>
											<Image source={cross_select} style={{ height: responsiveWidth(3.8), width: responsiveWidth(4), }} />
										</TouchableOpacity></View>);
								}, this) : null}
							</View>

							<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
								{this.state.AllergiesArr && this.state.AllergiesArr.length > 0 ? this.state.AllergiesArr.map((item, index) => {
									return (<TouchableOpacity style={styles.unselectView} onPress={() => this.clickOnAllergies(item, index)} >
										<Text style={styles.unselectTxtColor}>{item.allergyName}</Text>
									</TouchableOpacity>
									);
								}, this) : null}
							</View>
						</View>
					</View>
				</Modal>

				{/* -----------------Family History List------------- */}
				<Modal isVisible={this.state.isFamilyMemberModalOpen} onRequestClose={() => this.setState({ isFamilyMemberModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>
						<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(10) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({
										isFamilyMemberModalOpen: false, currentMedicationSearchTxt: '', FamilyHistoryArr: this.state.FamilyHistoryArr
									})
								}}>
									<Image source={cross_new} style={{ height: responsiveWidth(5), width: responsiveWidth(6), marginRight: 10 }} />
								</TouchableOpacity>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, fontWeight: 'bold', opacity: 0.8 }}>Family History</Text>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({
										isFamilyMemberModalOpen: false, currentMedicationSearchTxt: '', FamilyHistoryArr: this.state.FamilyHistoryArr
									})
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary }}>Close</Text>
								</TouchableOpacity>
							</View>

							<View style={{ flexDirection: 'column', margin: 3 }}>
								{this.state.FamilyHistoryArr && this.state.FamilyHistoryArr.length > 0 ? this.state.FamilyHistoryArr.map((item, index) => {
									return (
										<View style={{ flexDirection: 'column' }}>
											<TouchableOpacity style={{ marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), marginTop: responsiveHeight(3), borderRadius: 6, flexDirection: 'row', backgroundColor: Color.white, alignItems: 'center', borderRadius: 6, justifyContent: 'space-between' }}
												onPress={() => {
													selectedFamilyMemberGuild = item.familyMemberGuid;
													//alert(JSON.stringify(selectedFamilyHistoryGlobal));
													let selCondition = _.find(selectedFamilyHistoryGlobal, { familyMemberGuid: item.familyMemberGuid })
													let patientCondition = selCondition && selCondition.patientCondition && selCondition.patientCondition.length > 0 ? selCondition.patientCondition : []
													if (patientCondition && patientCondition.length > 0) {
														for (let i = 0; i < patientCondition.length; i++) {
															patientCondition[i].familyHistoryGuid = selCondition.familyHistoryGuid;
															//patientCondition[i].familyHistoryConditionGuId = selCondition.familyHistoryConditionGuId;
														}
													}
													let familyConditionTmpArr = _.differenceBy(FamilyConditionFullArr, patientCondition, 'conditionGuid');
													this.setState({
														selectedFamily: item.familyHistoryName,
														selectedFamilyGuid: item.familyMemberGuid,
														selectedfamilyConditionsArr: patientCondition,
														FamilyConditionsArr: familyConditionTmpArr,
														isFamilyDetailsModalOpen: true,
														conditionsSearchTxt: ''
													});
													ConditionsFullArray = familyConditionTmpArr;

												}}  >

												<Text style={{ fontSize: CustomFont.font16, color: Color.feeText, fontFamily: CustomFont.fontNameBold, marginLeft: 5, fontWeight: 'bold' }}>{item.familyHistoryName}</Text>
												<Image source={arrow_right} style={{ height: responsiveFontSize(1.8), width: responsiveFontSize(1.8), resizeMode: 'center', marginRight: 10 }} />
											</TouchableOpacity>

											<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(3.7), marginRight: responsiveWidth(6), opacity: .6, marginTop: 7 }}>{this.getComditionUnderFamily(item.familyMemberGuid, '')}</Text>
										</View>
									);
								}, this) : null}
							</View>

						</View>
					</View>
					{/* -----------------Family History Details------------- */}
					<Modal isVisible={this.state.isFamilyDetailsModalOpen} onRequestClose={() => this.setState({ isFamilyDetailsModalOpen: false })}>
						<View style={[styles.modelViewMessage]}>
							<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(10) }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
									<TouchableOpacity style={{ padding: 10 }} onPress={() => {
										//this.getAdditionalInfo();
										let { signupDetails } = this.props;
										timeRange = Trace.getTimeRange();
										Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Family_History_Popup', signupDetails.firebaseLocation)
										Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Family_History_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
										let tmpArr = [...this.state.FamilyHistoryArr];
										setTimeout(() => {
											this.setState({ isFamilyDetailsModalOpen: false, isFamilyMemberModalOpen: true, currentMedicationSearchTxt: '', FamilyHistoryArr: tmpArr })
										}, 1000)
									}}>
										<Image source={arrow_grey} style={{ height: responsiveWidth(5), width: responsiveWidth(6), marginRight: 10 }} />
									</TouchableOpacity>
									<TouchableOpacity style={{ padding: 10 }} onPress={() => {
										let { signupDetails } = this.props;
										timeRange = Trace.getTimeRange();
										Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Family_History_Popup', signupDetails.firebaseLocation)
										Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Family_History_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
										let tmpArr = [...this.state.FamilyHistoryArr];
										setTimeout(() => {
											this.setState({ isFamilyDetailsModalOpen: false, isFamilyMemberModalOpen: true, currentMedicationSearchTxt: '', FamilyHistoryArr: tmpArr })
										}, 1000)
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary }}>Close</Text>
									</TouchableOpacity>
								</View>

								<View style={{ marginBottom: 0 }}>
									<Text style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, fontWeight: 'bold', opacity: 0.8 }}>{this.state.selectedFamily}</Text>
									<Text style={{ marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, opacity: 0.6 }}>Select Medical Conditions</Text>
								</View>

								<View style={[styles.searchView, { borderColor: this.state.fld1 }]}>
									<Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
									<TextInput returnKeyType="done"
										onFocus={() => this.callOnFocus('1')}
										onBlur={() => this.callOnBlur('1')}
										placeholderTextColor={Color.placeHolderColor}
										style={styles.searchInput} placeholder="search conditions" value={this.state.conditionsSearchTxt}
										onChangeText={(conditionsSearchTxt) => this.SearchConditions(conditionsSearchTxt, 'family')} />
									{this.state.conditionsSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ conditionsSearchTxt: '', FamilyConditionsArr: ConditionsFullArray }); }}>
										<Image style={styles.crossSearch} source={CrossTxt} />
									</TouchableOpacity> : null}
								</View>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3,marginRight:15 }}>
									{this.state.selectedfamilyConditionsArr && this.state.selectedfamilyConditionsArr.length > 0 ? this.state.selectedfamilyConditionsArr.map((item, index) => {
										return (<View style={styles.selectedView} >
											<Text style={styles.txtSelect}>{item.conditionName}</Text>
											<TouchableOpacity style={styles.crossSelected}
												onPress={() => {
													familyHistryFlag = true;
													DRONA.setIsConsultationChange(true);
													this.removeSelectedFamilyCondition(item, index)
												}}>
												<Image source={cross_select} style={{ height: responsiveWidth(3.8), width: responsiveWidth(4), }} />
											</TouchableOpacity></View>);
									}, this) : null}
								</View>


								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.FamilyConditionsArr && this.state.FamilyConditionsArr.length > 0 ? this.state.FamilyConditionsArr.map((item, index) => {
										return (<TouchableOpacity style={styles.unselectView} onPress={() => this.clickOnFamilyCondition(item, index)} >
											<Text style={styles.unselectTxtColor}>{item.conditionName}</Text>
										</TouchableOpacity>
										);
									}, this) : null}
								</View>

							</View>
						</View>
					</Modal>
				</Modal>

				{/* -----------Significant History------------------- */}

				<Modal isVisible={this.state.isModalVisibleSignificant} avoidKeyboard={true} onRequestClose={() => this.setState({ isModalVisibleSignificant: false })}>
					<View style={styles.modelViewSignificant}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
							<Text style={{ marginLeft: responsiveHeight(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, fontWeight: 'bold', opacity: 0.8 }}>Other History</Text>
							<TouchableOpacity style={{ padding: 10 }} onPress={() => {
								if (isUpdateGlobalStatusBackup) {
									DRONA.setIsConsultationChange(true)
								} else if (this.state.notesData != significantNoteBackup) {
									DRONA.setIsConsultationChange(true)
								}
								Trace.stopTrace()
								this.setState({ fld4: Color.inputdefaultBorder, isModalVisibleSignificant: false })
							}}>
								<Image source={cross_new} style={{ height: responsiveWidth(5), width: responsiveWidth(6), marginRight: 5 }} />
							</TouchableOpacity>

						</View>
						<KeyboardAvoidingView behavior={"padding"} >
							<ScrollView keyboardShouldPersistTaps='always'>
								<View style={{ margin: responsiveWidth(2), flex: 1, marginBottom: responsiveHeight(23) }}>

									<View style={{ flex: 1 }}>
										{/* <Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginLeft: responsiveHeight(3), marginTop: 20 }}>Significant History</Text> */}
										<TextInput blurOnSubmit={true} returnKeyType="done"
											onFocus={() => this.callOnFocus('4')}
											onBlur={() => this.callOnBlur('4')}
											placeholderTextColor={Color.placeHolderColor}
											style={{ borderWidth: 1, borderColor: this.state.fld4, padding: 7, height: responsiveHeight(30), fontSize: CustomFont.font14, borderRadius: 5, marginLeft: responsiveHeight(2), marginRight: responsiveHeight(2), textAlignVertical: 'top', color: Color.fontColor, opacity: .8, marginTop: 10 }}
											placeholder="" multiline={true} value={this.state.notesData} onChangeText={notesData => {
												this.setState({ notesData });
												significantNoteBackup = notesData;
												significantHitryFlag = true;
												DRONA.setIsConsultationChange(true);
											}} maxLength={2000} />
										<View style={{ alignItems: 'flex-end' }}>
											<Text style={{ fontSize: CustomFont.font10, color: Color.fontColor, marginRight: responsiveHeight(3), marginTop: 5, opacity: .4 }}>{this.state.notesData.length} / 2000</Text>

										</View>
										<TouchableOpacity onPress={() => {
											if (isUpdateGlobalStatusBackup) {
												DRONA.setIsConsultationChange(true)
											} else if (this.state.notesData != significantNoteBackup) {
												DRONA.setIsConsultationChange(true)
											}
											Trace.stopTrace()
											this.setState({ fld4: Color.inputdefaultBorder, isModalVisibleSignificant: false })
										}} style={{
											marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4),
											backgroundColor: Color.primary, borderRadius: 10, marginTop: responsiveHeight(3), height: responsiveHeight(5.8), justifyContent: 'center', alignItems: 'center'
										}}>
											<Text style={{ fontSize: CustomFont.font16, color: Color.white, fontFamily: CustomFont.fontName }}>Save</Text>
										</TouchableOpacity>
									</View>

								</View>
							</ScrollView>
						</KeyboardAvoidingView>
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
)(medicalHistory);
