import React, { useState } from 'react';
import {
	ScrollView,
	View,
	Text, TextInput, Image, TouchableOpacity, FlatList, Platform, PermissionsAndroid, Alert,
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import cross_new from '../../../assets/check.png';
import cross_close from '../../../assets/Vector-512.png';
import plus_new from '../../../assets/plus_new.png';
import edit_new from '../../../assets/edit_primary.png';
import cross_select from '../../../assets/cross_pink.png';
import fluentArrowUpload from '../../../assets/fluent_arrow_upload.png';
import down from '../../../assets/down.png';
import FollowUpModal from './FollowUpModal';
import ThreeDotsModal from './ThreeDotsModal';
import PreviewRxButton from './PreviewRxButton';
import Moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';

import cross from '../../../assets/cross_blue.png';
let selectedIndex = 0, tempSelectedIndex = 0;
import AsyncStorage from 'react-native-encrypted-storage';
import Language from '../../utils/Language.js';
import { setLogEvent } from '../../service/Analytics';
import Validator from '../../components/Validator';
// import CustomModalOne from '../../components/CustomModalOne';
// import CustomModalTwo from '../../components/CustomModalTwo';

let SymptomFullArray = [], findingFullArray = [], diagnosticFullArray = [], medicineFullArray = [], InvestigationeFullArray = [], InstructionFullArray = [], NotesData = '',
	VitalAllData = '', medTiming = null, FinalExtractNullData = [];
let appoinmentGuid = "", patientGuid = '', vitalDate = null;
let appointmentStatus = null, vitalLoadSTatus = 0;
let normalListBackup = [], selectedListBackup = [], noteGuid = '';
let vitalFlag = false, symptomFlag = false, findingFlag = false, diagnosticFlag = false, medicineFlag = false, instructionFlag = false, investigationFlag = false, notesFlag = false;
let medicineIndex = 0, medicineAddUpdateFlag = 'add', vitalIsAddedStatus = '';
import Trace from '../../service/Trace'
let timeRange = '', medicineTypeFullArray = [], prvLength = -1, bpAlertMsg = '', bmiIndex = 0;


class Consultation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadVital: [],
			vitalsDataArray: [],
			vitalsDataArrayAll: [],
			vitalDataList: [],
			vitalHeight: '',
			vitalTemprature: '',
			vitalSPO2: '',
			vitalWeight: '',
			vitalHeartRate: '',

			isSymptomModalOpen: false,
			SymptomArr: [],
			SelectedSymptomArr: [],
			symptomSearchTxt: '',

			isFindingModalOpen: false,
			findingSearchTxt: '',
			FindingArr: [],
			SelectedFindingArr: [],

			isDiagnosticModalOpen: false,
			DiagnosticArr: [],
			SelectedDiagnosticArr: [],
			diagnosticSearchTxt: '',

			notesData: '',
			followupData: null,
			isModalVisibleAbout: false,

			isModalVisibleVital: false,

			isMedicineModalOpen: false,
			MedicineArr: [],
			SelectedMedicineArr: [],
			medicineSearchTxt: '',

			investigationSearchTxt: '',
			isModalVisibleInvestigations: false,
			InvestigationArray: [],
			SelectedInvestigationArr: [],

			instructionSearchTxt: '',
			isModalVisibleInstruction: false,
			InstructionArray: [],
			SelectedInstructionArr: [],

			isVitalEmpty: true,
			showFollowUpModal: true,

			fld1: Color.borderColor,
			fld2: Color.borderColor,
			fld3: Color.borderColor,
			fld4: Color.borderColor,
			fld5: Color.borderColor,
			fld6: Color.borderColor,
			fld7: Color.borderColor,
			fld8: Color.borderColor,
			dynamicTop: 0,
			dynamicBottom: 0,
			languageArr: [
				{ value: 'en', index: 0, label: 'English', isTempSelected: false },
				{ value: 'be', index: 1, label: 'Bengali', isTempSelected: false },
				{ value: 'hi', index: 2, label: 'Hindi', isTempSelected: false },
				{ value: 'ma', index: 3, label: 'Marathi', isTempSelected: false },
				{ value: 'ta', index: 4, label: 'Tamil', isTempSelected: false },
				{ value: 'te', index: 5, label: 'Telugu', isTempSelected: false },
				{ value: 'gu', index: 6, label: 'Gujarati', isTempSelected: false },
			],
			isLanguage: false,
			selectedImageArr: null,
			isSearchStart: false,

			//
			addMedicinePopup: false,
			medicineSearchTxt: '',
			isMedicineTypeSelected: false,
			genericName: '',
			strength: '',
			medicineTypeName: '',
			medicineTypeArr: [],
			medicineFoundStatus: '',
			isHideConsultNowBtn: false,
			textInputs: [],
			medicineTypeSearchTxt: '',
			InpborderColor2: Color.inputdefaultBorder,
			showStateDosage: false,
			bpFieldError: false,
			isModalOpenSeverity: false,
			SeverityDataArray: [{ itemValue: "Mild", select: false }, { itemValue: "Moderate", select: false }, { itemValue: "Severe", select: false }],
			isModalVisibleInstructionInvest: false,
		};
		this.clearArray()
		vitalLoadSTatus = 0;
	}
	clearArray = () => {
		SymptomFullArray = []; findingFullArray = []; diagnosticFullArray = []; medicineFullArray = []; InvestigationeFullArray = []; InstructionFullArray = [];
		vitalFlag = false;
		symptomFlag = false;
		findingFlag = false;
		diagnosticFlag = false;
		medicineFlag = false;
		instructionFlag = false;
		investigationFlag = false;
		notesFlag = false;
		medicineIndex = 0;
		medicineAddUpdateFlag = 'add';
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

	async componentDidMount() {

		let tempIndex = await AsyncStorage.getItem('lanIndex');
		selectedIndex = tempIndex == null ? 0 : tempIndex
		this.setLanguage(selectedIndex)
		this.setState({ selectedIndex: tempIndex == null ? 0 : tempIndex });
		let { signupDetails } = this.props;
		timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Patient_Consultation_Journey', signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Patient_Consultation_Journey", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
		//
		appoinmentGuid = this.props.data && this.props.data.pastAppointmentGuid ? this.props.data.pastAppointmentGuid : signupDetails.appoinmentGuid;

		patientGuid = this.props.item && this.props.item.patientGuid ? this.props.item.patientGuid : '';
		appointmentStatus = this.props.item && this.props.item.appointmentStatus ? this.props.item.appointmentStatus : '';
		if (this.props.responseDataVisitInfo)
			this.setValueFromResponse(this.props.responseDataVisitInfo)

		let item = this.props.item;
		//console.log(signupDetails.selectedDate +'--------++----'+JSON.stringify(item));
		if (signupDetails.appoinmentGuid && signupDetails.selectedDate && signupDetails.selectedDate != Moment(new Date()).format("YYYY-MM-DD")) {
			let callStartTime = item.appointmentStartTime;
			let callEndTime = item.appointmentEndTime;

			let chkIn = Moment(callStartTime, ["h:mm A"]).format("HH:mm") // 24 hrs
			let chkOut = Moment(callEndTime, ["h:mm A"]).format("HH:mm")

			var startCallDateFormat = signupDetails.selectedDate + ' ' + chkIn;// "2017-04-14 23:07:15"; 
			var endCallDateFormat = signupDetails.selectedDate + ' ' + chkOut;

			var endCall8HrsLaterInMilisecond = Moment(endCallDateFormat).add(8, 'hours').valueOf();
			var startCallInMilisecond = Moment(startCallDateFormat).valueOf();
			if (item.consultationType == 'Virtual') {
				if (Moment().isBefore(startCallInMilisecond - 300000) || Moment().isAfter(endCall8HrsLaterInMilisecond)) {
					this.setState({ isHideConsultNowBtn: true });
				} else {
					this.setState({ isHideConsultNowBtn: false });
				}
			} else {
				this.setState({ isHideConsultNowBtn: true });
			}

		}
	}
	setValueFromResponse = (data) => {
		let patientConsultation = data;
		SymptomFullArray = patientConsultation.symptomList
		findingFullArray = patientConsultation.findingList
		diagnosticFullArray = patientConsultation.diagnosisList
		medicineFullArray = patientConsultation.medicineList ? patientConsultation.medicineList : []
		InvestigationeFullArray = patientConsultation.investigationList ? patientConsultation.investigationList : []
		InstructionFullArray = patientConsultation.instructionsList ? patientConsultation.instructionsList : []
		NotesData = patientConsultation.prescriptionNote ? patientConsultation.prescriptionNote.prescriptionNoteName : ''
		let selectedSymptoms = patientConsultation.selectedSymptoms && patientConsultation.selectedSymptoms.length > 0 ? patientConsultation.selectedSymptoms : []
		let selectedInvestigations = patientConsultation.selectedInvestigations && patientConsultation.selectedInvestigations.length > 0 ? patientConsultation.selectedInvestigations : []
		let selectedInstructions = patientConsultation.selectedInstructions && patientConsultation.selectedInstructions.length > 0 ? patientConsultation.selectedInstructions : []
		let selectedFindings = patientConsultation.selectedFindings ? patientConsultation.selectedFindings : []
		let selectedDiagnosis = patientConsultation.selectedDiagnosis ? patientConsultation.selectedDiagnosis : []
		let selectedMedicines = patientConsultation.selectedMedicines ? patientConsultation.selectedMedicines : []

		noteGuid = patientConsultation.prescriptionNote ? patientConsultation.prescriptionNote.prescriptionNoteGuid : ''
		this.setState({
			SymptomArr: SymptomFullArray, FindingArr: findingFullArray, DiagnosticArr: diagnosticFullArray, MedicineArr: medicineFullArray, InvestigationArray: InvestigationeFullArray, InstructionArray: InstructionFullArray,
			notesData: NotesData, followupData: data.followUp, showFollowUpModal: false
		});

		//alert(JSON.stringify(this.props.VitalStatus))
		if (medicineFullArray.length == 0)
			this.setState({ medicineFoundStatus: 'Medicine not found' });
		if (data.vitalMasters || this.props.VitalStatus) {
			vitalIsAddedStatus = '';
			this.setState({ vitalsDataArray: data.vitalMasters })
		} else {
			vitalIsAddedStatus = 'Add';
			this.setState({ vitalsDataArray: [] })
		}

		this.setState({ SelectedSymptomArr: selectedSymptoms, SelectedInvestigationArr: selectedInvestigations, SelectedInstructionArr: selectedInstructions, SelectedFindingArr: selectedFindings, SelectedDiagnosticArr: selectedDiagnosis, SelectedMedicineArr: selectedMedicines })
		medTiming = patientConsultation.medTiming;
		setTimeout(() => {
			this.setState({ showFollowUpModal: true });
		})

		if (this.props.from == 'Vitals' && vitalLoadSTatus == 0) {
			setTimeout(() => {
				this.getVitals();
				vitalLoadSTatus = 1;
			}, 500);
		} else if (this.props.from == 'Past Encounters') {
			if (selectedSymptoms)
				symptomFlag = true;

			if (selectedFindings)
				findingFlag = true;

			if (selectedDiagnosis)
				diagnosticFlag = true;

			if (selectedMedicines)
				medicineFlag = true;

			if (NotesData)
				notesFlag = true;

			if (selectedInvestigations)
				investigationFlag = true;

			if (selectedInstructions)
				instructionFlag = true;

		}
	}
	componentWillUnmount() {
		Trace.stopTrace()
	}

	savePage = () => {
		Trace.stopTrace()
		//vitalFlag || 
		if (symptomFlag || findingFlag || diagnosticFlag || medicineFlag || instructionFlag || investigationFlag || notesFlag) {
			//alert("LL")
			let { actions, signupDetails } = this.props;
			// var tempArrInvest = _.filter(this.state.InvestigationArray, function (item) { return item.isSelected });
			// var tempArrInstruc = _.filter(this.state.InstructionArray, function (item) { return item.isSelected });
			let tmpMedicineArr = [...this.state.SelectedMedicineArr];
			let tmpArr = []
			for (let i = 0; i < tmpMedicineArr.length; i++) {
				let doaseArr = tmpMedicineArr[i].medicineDosasesType;
				let tempObj = Object.assign({ medicineDosasesTypeGuid: doaseArr[0].medicineDoasesGuId, medicineDosasesType: doaseArr[0].doasestype }, tmpMedicineArr[i]);
				tempObj.medicineDosasesType = doaseArr[0].doasestype;
				tempObj.medicineTimingShift = null;
				tmpArr.push(tempObj);
			}
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"PatientGuid": patientGuid,
				"Data": {
					"AppointmentGuid": signupDetails.appoinmentGuid,
					"Consultation": {
						"SymptomList": this.state.SelectedSymptomArr,
						"FindingList": this.state.SelectedFindingArr,
						"DiagnosisList": this.state.SelectedDiagnosticArr,
						"MedicineList": tmpArr,
						"InvestigationList": this.state.SelectedInvestigationArr,
						"InstructionsList": this.state.SelectedInstructionArr,
						"PrescriptionNote": {
							"PrescriptionNoteGuid": noteGuid,
							"PrescriptionNoteName": this.state.notesData
						},
						"IsSymptomListUpdated": symptomFlag,
						"IsDiagnosisListUpdated": diagnosticFlag,
						"IsFindingListUpdated": findingFlag,
						"IsMedicineListUpdated": medicineFlag,
						"IsInvestigationListUpdated": investigationFlag,
						"IsInstructionsListUpdated": instructionFlag,
						"IsPrescriptionNoteUpdated": notesFlag
					}
				}
			}
			DRONA.setIsConsultationChange(false);



			actions.callLogin('V14/FuncForDrAppToAddConsultationTabData', 'post', params, signupDetails.accessToken, 'ConsultationPageSave');
		} else {
			//alert("LLLLL")
			this.callPreviewRx();
		}
	}
	callPreviewRx = async () => {
		try {
			if (Platform.OS === 'android') {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					this.getFuncForDrAppToConsulatationBillingPreview();
				} else {
					Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
				}
			} else {

				this.getFuncForDrAppToConsulatationBillingPreview();
			}
		} catch (err) {
			console.warn(err);
		}
	}
	getFuncForDrAppToConsulatationBillingPreview = () => {
		let { actions, signupDetails } = this.props;
		DRONA.setIsReloadApi(true);
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
		actions.callLogin('V14/FuncForDrAppToConsulatationBillingPreview', 'post', params, signupDetails.accessToken, 'consulatationBillingPreviewData');

	}

	RefreshData = (val) => {
		if (val.isEdit) {
			let tmpARr = this.state.SelectedMedicineArr ? [...this.state.SelectedMedicineArr] : [];
			if (medicineAddUpdateFlag == 'add') {
				tmpARr.push(val.data);
			} else {
				tmpARr.splice(medicineIndex, 1, val.data);
			}
			medicineFlag = true;
			this.setState({ SelectedMedicineArr: tmpARr })
			DRONA.setIsConsultationChange(true);
		} else {
			medicineFlag = val.isEdit;
		}

	}


	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, } = this.props;
			if (tagname === 'GetVisitInfo') {
				try {
					if (newProps.responseData.statusCode == '0') {
						//let data = newProps.responseData.data.patientConsultation;

						//this.setValueFromResponse(data);
					}
				} catch (e) { }
			} else if (tagname === 'SearchForSymptom') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						let tempserviceArr = [...this.state.SelectedSymptomArr];
						try {
							let temp2 = _.differenceBy(temp, tempserviceArr, 'symptomGuid');
							temp2.push({
								"symptomGuid": null,
								"SymptomDesc": '',
								"symptomName": "Add new Symptom “" + this.state.symptomSearchTxt + '”'
							})
							this.setState({ SymptomArr: temp2 });
						} catch (error) { }


					} else
						this.setState({
							SymptomArr: [{
								"symptomGuid": null,
								"SymptomDesc": '',
								"symptomName": "Add new Symptom “" + this.state.symptomSearchTxt + '”'
							}]
						});
				}
			} else if (tagname === 'AddSymptoms') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {

					let GetpatientAppointmentSymptomsGuId = newProps.responseData.data.patientAppointmentSymptomsGuId;
					let symptomGuid = newProps.responseData.data.symptomGuid;
					let tempArr = [...this.state.SelectedSymptomArr]
					tempArr[tempArr.length - 1].symptomGuid = symptomGuid
					tempArr[tempArr.length - 1].patientAppointmentSymptomsGuId = GetpatientAppointmentSymptomsGuId
					this.setState({ SelectedSymptomArr: tempArr });

					//Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				else {
					//Snackbar.show({ text: 'Symptom not added. Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					this.setState({ SymptomArr: normalListBackup, SelectedSymptomArr: selectedListBackup });
				}
			}
			else if (tagname === 'AddFinding') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {
					let GetpatientAppointmentFindingGuId = newProps.responseData.data.patientAppointmentFindingsGuId;
					let findingGuid = newProps.responseData.data.findingGuid;
					let tempArr = [...this.state.SelectedFindingArr]
					tempArr[tempArr.length - 1].patientAppointmentFindingsGuId = GetpatientAppointmentFindingGuId
					tempArr[tempArr.length - 1].findingGuid = findingGuid
					this.setState({ SelectedFindingArr: tempArr });

					//Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				else {
					this.setState({ FindingArr: normalListBackup, SelectedFindingArr: selectedListBackup });
					//Snackbar.show({ text: 'Finding not added. Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			} else if (tagname === 'AddDiagnosis') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {
					let GetpatientAppointmentDiagnosisGuId = newProps.responseData.data.patientAppointmentDiagnosisGuId;
					let diagnosisGuid = newProps.responseData.data.diagnosisGuid;
					let tempArr = [...this.state.SelectedDiagnosticArr]
					tempArr[tempArr.length - 1].patientAppointmentDiagnosisGuId = GetpatientAppointmentDiagnosisGuId
					tempArr[tempArr.length - 1].diagnosisGuid = diagnosisGuid
					this.setState({ SelectedDiagnosticArr: tempArr });

					//Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				else {
					//Snackbar.show({ text: 'Diagnostic not added . Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					this.setState({ DiagnosticArr: normalListBackup, SelectedDiagnosticArr: selectedListBackup });
				}

			}
			else if (tagname === 'SearchForFindings') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						let tempserviceArr = [...this.state.SelectedFindingArr];
						try {
							let temp2 = _.differenceBy(temp, tempserviceArr, 'findingGuid');
							temp2.push({
								"appointmentGuid": null,
								"findingGuid": null,
								"patientAppointmentFindingsGuId": null,
								"findingName": "Add new “" + this.state.findingSearchTxt + '”',
								"findingDesc": null
							})
							this.setState({ FindingArr: temp2 });
						} catch (error) { }

					}
					else
						this.setState({
							FindingArr: [{
								"appointmentGuid": null,
								"findingGuid": null,
								"patientAppointmentFindingsGuId": null,
								"findingName": "Add new “" + this.state.findingSearchTxt + '”',
								"findingDesc": null
							}]
						});
				}
			} else if (tagname === 'SearchForDiagnosis') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						let tempserviceArr = [...this.state.SelectedDiagnosticArr];
						try {
							let temp2 = _.differenceBy(temp, tempserviceArr, 'diagnosisGuid');
							temp2.push({
								"appointmentGuid": null,
								"diagnosisGuid": null,
								"patientAppointmentDiagnosisGuId": null,
								"diagnosisName": "Add new “" + this.state.diagnosticSearchTxt + '”',
								"diagnosisDesc": null
							})
							this.setState({ DiagnosticArr: temp2 });
						} catch (error) { }

					}
					else
						this.setState({
							DiagnosticArr: [{
								"appointmentGuid": null,
								"diagnosisGuid": null,
								"patientAppointmentDiagnosisGuId": null,
								"diagnosisName": "Add new “" + this.state.diagnosticSearchTxt + '”',
								"diagnosisDesc": null
							}]
						});
				}
			} else if (tagname === 'SearchForMedicine') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						if (temp && temp.length > 0) {
							this.setState({ MedicineArr: temp });
						} else {
							this.setState({ MedicineArr: [] });
						}
						// temp.push({
						// 	"medicineGuid": null,
						// 	"medicineName": "Add new “" + this.state.medicineSearchTxt + '”',
						// })
						// this.setState({ MedicineArr: temp });
					}
				}
			}
			// else if (tagname === 'SearchForInvestigation') {
			// 	if (newProps.responseData.statusCode == '0') {
			// 		if (newProps.responseData.data && newProps.responseData.data.length > 0) {
			// 			//console.log('invest----'+JSON.stringify(InvestigationeFullArray));
			// 			if (this.state.investigationSearchTxt) {
			// 				let tmpArr = newProps.responseData.data;
			// 				for (let i = 0; i < tmpArr.length; i++) {
			// 					if (tmpArr[i].investigationGuid) {
			// 						let selArr = _.find(InvestigationeFullArray, { investigationGuid: tmpArr[i].investigationGuid })
			// 						if (selArr && selArr.isSelected) {
			// 							tmpArr[i].isSelected = true;
			// 						}
			// 					}

			// 				}

			// 				this.setState({ InvestigationArray: tmpArr });
			// 			}
			// 			else
			// 				this.setState({ InvestigationArray: InvestigationeFullArray });
			// 		} else {
			// 			let temp = [];
			// 			if (this.state.investigationSearchTxt)
			// 				temp.push({ "appointmentGuid": null, "doctorGuid": "", "investigationGuid": null, "investigationName": "Add new “" + this.state.investigationSearchTxt + '”', "investigationDesc": null, "patientAppointmentInvestigationGuId": null, "isSelected": false }
			// 				)
			// 			this.setState({ InvestigationArray: temp });
			// 		}
			// 	}
			// } 

			else if (tagname === 'SearchForInvestigation') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						let tempserviceArr = [...this.state.SelectedInvestigationArr];
						try {
							let temp2 = _.differenceBy(temp, tempserviceArr, 'investigationGuid');
							temp2.push({
								"appointmentGuid": null,
								"investigationGuid": null,
								"investigationDesc": '',
								"investigationName": "Add new “" + this.state.investigationSearchTxt + '”'
							})
							this.setState({ InvestigationArray: temp2 });
						} catch (error) { }


					} else
						this.setState({
							InvestigationArray: [{
								"appointmentGuid": null,
								"investigationGuid": null,
								"investigationDesc": '',
								"investigationName": "Add new “" + this.state.investigationSearchTxt + '”'
							}]
						});
				}
			}
			else if (tagname === 'AddInvestigation') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {

					let GetpatientAppointmentInvestigationGuId = newProps.responseData.data.patientAppointmentInvestigationGuId;
					let InvestigationGuid = newProps.responseData.data.investigationGuid;
					let tempArr = [...this.state.SelectedInvestigationArr]
					tempArr[tempArr.length - 1].investigationGuid = InvestigationGuid
					tempArr[tempArr.length - 1].patientAppointmentInvestigationGuId = GetpatientAppointmentInvestigationGuId
					this.setState({ SelectedInvestigationArr: tempArr });

				}
				else {
					this.setState({ InvestigationArray: normalListBackup, SelectedInvestigationArr: selectedListBackup });
				}
			}



			// else if (tagname === 'SearchForInstructions') {
			// 	if (newProps.responseData.statusCode == '0') {
			// 		if (newProps.responseData.data && newProps.responseData.data.length > 0) {
			// 			if (this.state.instructionSearchTxt) {
			// 				let tmpArr = newProps.responseData.data;
			// 				for (let i = 0; i < tmpArr.length; i++) {
			// 					if (tmpArr[i].instructionsGuid) {
			// 						let selArr = _.find(InstructionFullArray, { instructionsGuid: tmpArr[i].instructionsGuid })
			// 						if (selArr && selArr.isSelected) {
			// 							tmpArr[i].isSelected = true;
			// 						}
			// 					}

			// 				}

			// 				this.setState({ InstructionArray: tmpArr });


			// 			}
			// 			else
			// 				this.setState({ InstructionArray: InstructionFullArray });
			// 		}

			// 		else {
			// 			let temp = [];
			// 			if (this.state.instructionSearchTxt)
			// 				temp.push({ "appointmentGuid": null, "doctorGuid": "", "instructionsGuid": null, "instructionsName": "Add new “" + this.state.instructionSearchTxt + '”', "instructionsDesc": null, "patientAppointmentInstructionGuId": null, "isSelected": false }
			// 				)
			// 			this.setState({ InstructionArray: temp });
			// 			//InstructionFullArray.push({"appointmentGuid": null, "doctorGuid": "", "instructionsGuid": null, "instructionsName": this.state.instructionSearchTxt, "instructionsDesc": null, "patientAppointmentInstructionGuId": null, "isSelected": false})
			// 		}
			// 	}
			// }


			else if (tagname === 'SearchForInstructions') {
				if (newProps.responseData.statusCode == '0') {
					if (newProps.responseData.data && newProps.responseData.data.length > 0) {
						let temp = newProps.responseData.data;
						let tempserviceArr = [...this.state.SelectedInstructionArr];
						try {
							let temp2 = _.differenceBy(temp, tempserviceArr, 'instructionsGuid');
							temp2.push({
								"appointmentGuid": null,
								"instructionsGuid": null,
								"instructionsDesc": '',
								"instructionsName": "Add new “" + this.state.instructionSearchTxt + '”'
							})
							this.setState({ InstructionArray: temp2 });
						} catch (error) { }


					} else
						this.setState({
							InstructionArray: [{
								"appointmentGuid": null,
								"instructionsGuid": null,
								"instructionsDesc": '',
								"instructionsName": "Add new “" + this.state.instructionSearchTxt + '”'
							}]
						});
				}
			}
			else if (tagname === 'AddInstruction') {
				if (newProps.responseData.statusCode == '0' && newProps.responseData.data) {

					let GetpatientAppointmentInstructionGuId = newProps.responseData.data.patientAppointmentInstructionGuId;
					let InstructionGuid = newProps.responseData.data.instructionsGuid;
					let tempArr = [...this.state.SelectedInstructionArr]
					tempArr[tempArr.length - 1].instructionsGuid = InstructionGuid
					tempArr[tempArr.length - 1].patientAppointmentInstructionGuId = GetpatientAppointmentInstructionGuId
					this.setState({ SelectedInstructionArr: tempArr });

				}
				else {
					this.setState({ InstructionArray: normalListBackup, SelectedInstructionArr: selectedListBackup });
				}
			}

			else if (tagname === 'getVitalsData') {
				if (newProps.responseData.statusCode == '0') {
					setTimeout(() => {
						this.setState({ isModalVisibleVital: true })
					}, 1000)
					VitalAllData = newProps.responseData.data.vitalMasters;
					let tempAr = [];
					if (VitalAllData && VitalAllData.length > 0) {
						for (let i = 0; i < VitalAllData.length; i++) {
							tempAr.push(VitalAllData[i].vitalValue);
							if (VitalAllData[i].vitalName == 'BMI')
								bmiIndex = i
						}
						this.setState({ vitalsDataArrayAll: VitalAllData, textInputs: tempAr });
					}



					vitalDate = newProps.responseData.data.vitalDate
					//this.calculateBMI();
					setLogEvent("add_vital", { "customize_vital": "click", UserGuid: signupDetails.UserGuid })
					// 			let { actions } = this.props;
					// let params = {"Data": { "AppType": "DrAppAndroid", } }
					// actions.callLogin('V1/FuncForWebAppToGetCurrentDateTime', 'post', params, 'token', 'tt');
				}
			}
			else if (tagname === 'addUpdateVitalsData') {
				if (newProps.responseData.statusCode == '0') {
					DRONA.setIsConsultationChange(false);
					setLogEvent("add_vital", { "save_update": "click", UserGuid: signupDetails.UserGuid });
					this.setState({ vitalsDataArray: FinalExtractNullData });
					vitalIsAddedStatus = '';
				}
			}
			// else if (tagname === 'AddCustomInvestigation') {
			// 	if (newProps.responseData.statusCode == '0') {
			// 		let data = newProps.responseData.data
			// 		let { signupDetails } = this.props;
			// 		let tempItem = {
			// 			"appointmentGuid": null,
			// 			"doctorGuid": signupDetails.doctorGuid,
			// 			"investigationGuid": data.investigationGuid,
			// 			"investigationName": this.state.InvestigationArray[this.state.InvestigationArray.length - 1].investigationName,
			// 			"investigationDesc": null,
			// 			"patientAppointmentInvestigationGuId": data.patientAppointmentInvestigationGuId,
			// 			"isSelected": true
			// 		}
			// 		InvestigationeFullArray.push(tempItem)
			// 		this.setState({ investigationSearchTxt: "", InvestigationArray: InvestigationeFullArray })
			// 		//Snackbar.show({ text: 'Investigation added successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			// 	} else {
			// 		//Snackbar.show({ text: 'Investigation not added. Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			// 		this.setState({ InvestigationArray: normalListBackup });
			// 	}
			// } 
			// else if (tagname === 'AddCustomInstruction') {
			// 	if (newProps.responseData.statusCode == '0') {
			// 		let data = newProps.responseData.data
			// 		let { signupDetails } = this.props;
			// 		let tempItem = {
			// 			"appointmentGuid": null,
			// 			"doctorGuid": signupDetails.doctorGuid,
			// 			"instructionsGuid": data.instructionsGuid,
			// 			"instructionsName": this.state.InstructionArray[this.state.InstructionArray.length - 1].instructionsName,
			// 			"instructionsDesc": null,
			// 			"patientAppointmentInstructionGuId": data.patientAppointmentInstructionGuId,
			// 			"isSelected": true
			// 		}
			// 		InstructionFullArray.push(tempItem)
			// 		this.setState({ instructionSearchTxt: "", InstructionArray: InstructionFullArray })
			// 		//Snackbar.show({ text: 'Instruction added successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			// 	} else {
			// 		//Snackbar.show({ text: 'Instruction not added. Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			// 		this.setState({ InstructionArray: normalListBackup, SelectedConditionsArr: selectedListBackup });
			// 	}
			// } 
			else if (tagname === 'getmedicinetype') {
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
			} else if (tagname === 'addmedicine') {
				if (newProps.responseData.statusCode == '0') {
					let response = newProps.responseData.data;
					this.setState({ addMedicinePopup: false })
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					//  console.log('Response ' + JSON.stringify(response))
					//
					this.props.nav.navigation.navigate('MedicineDetails', { item: response, medTiming: medTiming, Refresh: this.RefreshData });
				}

			} else if (tagname === 'ConsultationPageSave') {
				if (newProps.responseData.statusCode == '-1' || newProps.responseData.statusCode == '-3') {
					let data = newProps.responseData.data;
					setTimeout(() => {
						this.callPreviewRx();
					}, 200)

					vitalFlag = false;
					symptomFlag = false;
					findingFlag = false;
					diagnosticFlag = false;
					medicineFlag = false;
					instructionFlag = false;
					investigationFlag = false;
					notesFlag = false;
				}
				Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}
		}
	}
	getVitals = () => {
		let { actions, signupDetails } = this.props;

		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Data": {
				"AppointmentGuid": appoinmentGuid,
				//"AddPatientVitals": this.state.vitalsDataArray && this.state.vitalsDataArray.length > 0 ? '' : 'Add',
				"AddPatientVitals": vitalIsAddedStatus,
				"PatientGuid": patientGuid,
			}
		}
		actions.callLogin('V1/FuncForDrAppToPatientAppointmentVitalDetails', 'post', params, signupDetails.accessToken, 'getVitalsData');
	}
	calculateBMI = () => {
		if (this.state.vitalsDataArrayAll && this.state.vitalsDataArrayAll.length) {
			let height = 0, weight = 0;
			this.state.vitalsDataArrayAll.forEach((value) => {
				if (value.vitalName === "Weight" && value.vitalValue) {
					weight = value.vitalValue
				} else if (value.vitalName === "Height" && value.vitalValue) {
					height = value.vitalValue
				}
			})

			if (height > 0 && weight > 0) {
				let heightInMeter = (height * height) / 10000;
				let bmi = weight / heightInMeter;
				bmi = bmi.toFixed(1)

				for (let i = 0; i < this.state.vitalsDataArrayAll.length; i++) {
					if (this.state.vitalsDataArrayAll[i].vitalName === "BMI") {
						this.state.vitalsDataArrayAll[i].vitalValue = bmi
						this.state.textInputs[i] = bmi;
						break
					}
				}

				// console.log("bmical- " + bmi + " " + JSON.stringify(this.state.vitalsDataArrayAll))
				this.setState({ vitalsDataArrayAll: this.state.vitalsDataArrayAll })
			}
		}
	}
	updateVitals = () => {
		FinalExtractNullData = [];
		let isBackslashOnBp = true;
		let interest = [...this.state.vitalsDataArrayAll];
		for (let i = 0; i < interest.length; i++) {
			if (interest[i].vitalValue) {
				FinalExtractNullData.push(interest[i]);
				if (interest[i].vitalName == 'BP' && interest[i].vitalValue) {
					if (interest[i].vitalValue.includes('/')) {
						let str = interest[i].vitalValue.split('/')[1];
						if (!str) {
							bpAlertMsg = 'Please enter valid BP'
							isBackslashOnBp = false;
						}
					} else {
						bpAlertMsg = 'Please enter backslash (/) on BP field'
						isBackslashOnBp = false;
					}

				}
			}
		}
		if (!isBackslashOnBp) {
			this.setState({ bpFieldError: true });
			//Snackbar.show({ text: 'Please enter backslash (/) on BP field', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });

		} else if (FinalExtractNullData.length < 1) {
			Snackbar.show({ text: 'Please add atlease one Vitals', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else {
			this.setState({ isModalVisibleVital: false });
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"Data": {
					"AppointmentGuid": appoinmentGuid,
					"PatientGuid": patientGuid,
					"vitalMasters": FinalExtractNullData,
					"vitalDate": vitalDate ? Moment(vitalDate).format('YYYY-MM-DD') : Moment(new Date()).format('YYYY-MM-DD'),
				}
			}
			actions.callLogin('V1/FuncForDrAppToAddUpdatePatientVitals_V2', 'post', params, signupDetails.accessToken, 'addUpdateVitalsData');

		}
	}

	saveNotes = (updatedNote) => {
		this.setState({ fld8: Color.borderColor })
		if (!this.state.notesData) {
			Snackbar.show({ text: 'Please enter on notes', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			this.setState({ isModalVisibleAbout: false })
		}
	}
	clickOnSymptom = (item, index) => {
		//SelectedIndex = index
		let tempserviceArr = [...this.state.SymptomArr];
		let selectedTempserviceArr = [...this.state.SelectedSymptomArr];
		item.symptomName = item.symptomName.replace("Add new Symptom “", "").replace('”', "")
		let isSymptomExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].symptomName.toLowerCase() == item.symptomName.toLowerCase()) {
						isSymptomExist = true;
						break;
					}
				}
		} catch (error) {

		}

		if (isSymptomExist) {
			Snackbar.show({ text: item.symptomName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.SymptomArr];
			selectedListBackup = [...this.state.SelectedSymptomArr];


			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			try {
				SymptomFullArray = _.differenceBy(SymptomFullArray, [item], 'symptomGuid');
			} catch (error) { }
			this.setState({ SelectedSymptomArr: selectedTempserviceArr, SymptomArr: tempserviceArr, symptomSearchTxt: '', SymptomArr: SymptomFullArray })

			if (!item.symptomGuid) {
				let { actions, signupDetails } = this.props;
				let params = {
					"userGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid, // item.appointmentGuid,
						"SymptomName": item.symptomName,
						"SymptomDesc": item.symptomDesc,
						"SymptomGuid": item.symptomGuid,
					}
				}
				actions.callLogin('V1/FuncForDrAppToAddSymptoms', 'post', params, signupDetails.accessToken, 'AddSymptoms');
			}
		}


	}
	removeSelectedSymptom = (item, index) => {
		let tempserviceArr = [...this.state.SymptomArr];
		let selectedTempserviceArr = [...this.state.SelectedSymptomArr];

		normalListBackup = [...this.state.SymptomArr];
		selectedListBackup = [...this.state.SelectedSymptomArr];

		tempserviceArr.unshift(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedSymptomArr: selectedTempserviceArr, SymptomArr: tempserviceArr })
		SymptomFullArray.push(item)
	}
	SearchSymptom = (text) => {
		var searchResult = _.filter(SymptomFullArray, function (item) {
			return item.symptomName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		if (searchResult.length == 0) {
			searchResult.push({
				"symptomGuid": null,
				"SymptomDesc": '',
				"symptomName": "Add new Symptom “" + text + '”'
			})
		}
		this.setState({
			SymptomArr: searchResult, symptomSearchTxt: text
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
			actions.callLogin('V1/FuncForDrAppToSearchForSymptom', 'post', params, signupDetails.accessToken, 'SearchForSymptom');
		}

	}
	// finding

	clickOnFinding = (item, index) => {
		//SelectedIndex = index
		let tempserviceArr = [...this.state.FindingArr];
		let selectedTempserviceArr = [...this.state.SelectedFindingArr];
		item.findingName = item.findingName.replace("Add new “", "").replace('”', "")
		let isNameExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].findingName.toLowerCase() == item.findingName.toLowerCase()) {
						isNameExist = true;
						break;
					}
				}
		} catch (error) {

		}
		if (isNameExist) {
			Snackbar.show({ text: item.findingName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.FindingArr];
			selectedListBackup = [...this.state.SelectedFindingArr];


			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			try {
				findingFullArray = _.differenceBy(findingFullArray, [item], 'findingGuid');
			} catch (error) { }
			this.setState({ SelectedFindingArr: selectedTempserviceArr, FindingArr: tempserviceArr, findingSearchTxt: '', FindingArr: findingFullArray })

			if (!item.findingGuid) {
				let { actions, signupDetails } = this.props;
				let params = {
					"userGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid,
						"FindingName": item.findingName,
						"FindingDesc": item.findingDesc,
						"FindingGuid": item.findingGuid,
					}
				}
				actions.callLogin('V1/FuncForDrAppToAddFinding', 'post', params, signupDetails.accessToken, 'AddFinding');
			}
		}
	}
	removeSelectedFinding = (item, index) => {
		let tempserviceArr = [...this.state.FindingArr];
		let selectedTempserviceArr = [...this.state.SelectedFindingArr];
		normalListBackup = [...this.state.FindingArr];
		selectedListBackup = [...this.state.SelectedFindingArr];

		tempserviceArr.unshift(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedFindingArr: selectedTempserviceArr, FindingArr: tempserviceArr })
		findingFullArray.push(item);
	}
	SearchFinding = (text) => {
		var searchResult = _.filter(findingFullArray, function (item) {
			return item.findingName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		if (searchResult.length == 0) {
			searchResult.push({
				"appointmentGuid": null,
				"findingGuid": null,
				"patientAppointmentFindingsGuId": null,
				"findingName": "Add new “" + text + '”',
				"findingDesc": null
			})
		}
		this.setState({
			FindingArr: searchResult, findingSearchTxt: text
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
			actions.callLogin('V1/FuncForDrAppToSearchForFindings', 'post', params, signupDetails.accessToken, 'SearchForFindings');
		}
	}
	// diagnostic

	clickOnDiagnostic = (item, index) => {
		//SelectedIndex = index
		let tempserviceArr = [...this.state.DiagnosticArr];
		let selectedTempserviceArr = [...this.state.SelectedDiagnosticArr];
		item.diagnosisName = item.diagnosisName.replace("Add new “", "").replace('”', "")
		let isNameExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].diagnosisName.toLowerCase() == item.diagnosisName.toLowerCase()) {
						isNameExist = true;
						break;
					}
				}
		} catch (error) {

		}
		if (isNameExist) {
			Snackbar.show({ text: item.diagnosisName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.DiagnosticArr];
			selectedListBackup = [...this.state.SelectedDiagnosticArr];


			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			try {
				diagnosticFullArray = _.differenceBy(diagnosticFullArray, [item], 'diagnosisGuid');
			} catch (error) { }

			this.setState({ SelectedDiagnosticArr: selectedTempserviceArr, DiagnosticArr: tempserviceArr, diagnosticSearchTxt: '', DiagnosticArr: diagnosticFullArray })
			if (!item.diagnosisGuid) {
				let { actions, signupDetails } = this.props;
				let params = {
					"userGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid,
						"DiagnosisName": item.diagnosisName,
						"DiagnosisDesc": item.diagnosisDesc,
						"DiagnosisGuid": item.diagnosisGuid,
					}
				}
				actions.callLogin('V1/FuncForDrAppToAddDiagnosis', 'post', params, signupDetails.accessToken, 'AddDiagnosis');
			}
		}

	}
	removeSelectedDiagnostic = (item, index) => {
		let tempserviceArr = [...this.state.DiagnosticArr];
		let selectedTempserviceArr = [...this.state.SelectedDiagnosticArr];

		normalListBackup = [...this.state.DiagnosticArr];
		selectedListBackup = [...this.state.SelectedDiagnosticArr];

		tempserviceArr.unshift(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedDiagnosticArr: selectedTempserviceArr, DiagnosticArr: tempserviceArr })
		diagnosticFullArray.push(item);
	}
	SearchDiagnostic = (text) => {
		var searchResult = _.filter(diagnosticFullArray, function (item) {
			return item.diagnosisName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		if (searchResult.length == 0) {
			searchResult.push({
				"appointmentGuid": null,
				"diagnosisGuid": null,
				"patientAppointmentDiagnosisGuId": null,
				"diagnosisName": "Add new “" + text + '”',
				"diagnosisDesc": null
			})
		}
		this.setState({
			DiagnosticArr: searchResult, diagnosticSearchTxt: text
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
			actions.callLogin('V1/FuncForDrAppToSearchForDiagnosis', 'post', params, signupDetails.accessToken, 'SearchForDiagnosis');
		}
	}

	// medicine

	clickOnMedicine = (item, index) => {
		let tempserviceArr = [...this.state.MedicineArr];
		let selectedTempserviceArr = [...this.state.SelectedMedicineArr];

		normalListBackup = [...this.state.MedicineArr];
		selectedListBackup = [...this.state.SelectedMedicineArr];

		selectedTempserviceArr.push(item)
		tempserviceArr.splice(index, 1);
		this.setState({ SelectedMedicineArr: selectedTempserviceArr, MedicineArr: tempserviceArr })
		try {
			medicineFullArray = _.differenceBy(medicineFullArray, [item], 'medicineGuid');
		} catch (error) { }

	}
	removeSelectedMedicine = (item, index) => {
		let tempserviceArr = [...this.state.MedicineArr];
		let selectedTempserviceArr = [...this.state.SelectedMedicineArr];
		normalListBackup = [...this.state.MedicineArr];
		selectedListBackup = [...this.state.SelectedMedicineArr];

		tempserviceArr.push(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedMedicineArr: selectedTempserviceArr, MedicineArr: tempserviceArr })
		medicineFullArray.push(item)
		medicineFlag = true;
	}

	SearchMedicine = (text) => {

		var searchResult = _.filter(medicineFullArray, function (item) {
			return item.medicineName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		// if (searchResult.length == 0) {
		// 	searchResult.push({
		// 		"medicineGuid": null,
		// 		"medicineName": "Add new " + text,
		// 	})
		// }
		this.setState({
			MedicineArr: searchResult, medicineSearchTxt: text
		});
		if (text && text.length > 2) {
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
			actions.callLogin('V14/FuncForDrAppToSearchForMedicine', 'post', params, signupDetails.accessToken, 'SearchForMedicine');
		}
		if (text && text.length == 0) {
			this.setState({ isSearchStart: false })
		}
		else {
			this.setState({ isSearchStart: true })
		}
	}

	// Investigation

	clickOnInvestigation = (item, index) => {
		//SelectedIndex = index
		let tempserviceArr = [...this.state.InvestigationArray];
		let selectedTempserviceArr = [...this.state.SelectedInvestigationArr];
		item.investigationName = item.investigationName.replace("Add new “", "").replace('”', "")
		let isInvestigationExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].investigationName.toLowerCase() == item.investigationName.toLowerCase()) {
						isInvestigationExist = true;
						break;
					}
				}
		} catch (error) {

		}

		if (isInvestigationExist) {
			Snackbar.show({ text: item.investigationName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.InvestigationArray];
			selectedListBackup = [...this.state.SelectedInvestigationArr];


			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			try {
				InvestigationeFullArray = _.differenceBy(InvestigationeFullArray, [item], 'investigationGuid');
			} catch (error) { }
			this.setState({ SelectedInvestigationArr: selectedTempserviceArr, InvestigationArray: tempserviceArr, investigationSearchTxt: '', InvestigationArray: InvestigationeFullArray })

			if (!item.investigationGuid) {
				let { actions, signupDetails } = this.props;
				let params = {
					"UserGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid,
						"InvestigationName": item.investigationName,
						"InvestigationDesc": item.investigationDesc,
						"InvestigationGuid": item.investigationGuid
					}

				}

				actions.callLogin('V1/FuncForDrAppToAddInvestigation', 'post', params, signupDetails.accessToken, 'AddInvestigation');
			}
		}


	}
	removeSelectedInvestigation = (item, index) => {
		let tempserviceArr = [...this.state.InvestigationArray];
		let selectedTempserviceArr = [...this.state.SelectedInvestigationArr];

		normalListBackup = [...this.state.InvestigationArray];
		selectedListBackup = [...this.state.SelectedInvestigationArr];

		tempserviceArr.unshift(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedInvestigationArr: selectedTempserviceArr, InvestigationArray: tempserviceArr })
		InvestigationeFullArray.push(item)
	}
	SearchInvestigation = (text) => {
		var searchResult = _.filter(InvestigationeFullArray, function (item) {
			return item.investigationName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		if (searchResult.length == 0) {
			searchResult.push({
				"investigationGuid": null,
				"investigationDesc": '',
				"investigationName": "Add new “" + text + '”'
			})
		}
		this.setState({
			InvestigationArray: searchResult, investigationSearchTxt: text
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
			actions.callLogin('V1/FuncForDrAppToSearchForInvestigation', 'post', params, signupDetails.accessToken, 'SearchForInvestigation');
		}

	}


	// Instruction

	clickOnInstruction = (item, index) => {
		//SelectedIndex = index
		let tempserviceArr = [...this.state.InstructionArray];
		let selectedTempserviceArr = [...this.state.SelectedInstructionArr];
		item.instructionsName = item.instructionsName.replace("Add new “", "").replace('”', "")
		let isInstructionExist = false;
		try {
			if (selectedTempserviceArr && selectedTempserviceArr.length > 0)
				for (let i = 0; i < selectedTempserviceArr.length; i++) {
					if (selectedTempserviceArr[i].instructionsName.toLowerCase() == item.instructionsName.toLowerCase()) {
						isInstructionExist = true;
						break;
					}
				}
		} catch (error) {

		}

		if (isInstructionExist) {
			Snackbar.show({ text: item.instructionsName + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			normalListBackup = [...this.state.InstructionArray];
			selectedListBackup = [...this.state.SelectedInstructionArr];


			selectedTempserviceArr.push(item)
			tempserviceArr.splice(index, 1);
			try {
				InstructionFullArray = _.differenceBy(InstructionFullArray, [item], 'instructionsGuid');
			} catch (error) { }
			this.setState({ SelectedInstructionArr: selectedTempserviceArr, InstructionArray: tempserviceArr, instructionSearchTxt: '', InstructionArray: InstructionFullArray })

			if (!item.instructionsGuid) {
				let { actions, signupDetails } = this.props;
				let params = {
					"UserGuid": signupDetails.UserGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"Version": "",
					"Data": {
						"AppointmentGuid": appoinmentGuid,
						"InstructionsName": item.instructionsName,
						"InstructionsGuid": item.instructionsGuid
					}
				}
				actions.callLogin('V1/FuncForDrAppToAddInstruction', 'post', params, signupDetails.accessToken, "AddInstruction");
			}
		}


	}
	removeSelectedInstruction = (item, index) => {
		let tempserviceArr = [...this.state.InstructionArray];
		let selectedTempserviceArr = [...this.state.SelectedInstructionArr];

		normalListBackup = [...this.state.InstructionArray];
		selectedListBackup = [...this.state.SelectedInstructionArr];

		tempserviceArr.unshift(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ SelectedInstructionArr: selectedTempserviceArr, InstructionArray: tempserviceArr })
		InstructionFullArray.push(item)
	}
	SearchInstruction = (text) => {
		var searchResult = _.filter(InstructionFullArray, function (item) {
			return item.instructionsName ? item.instructionsName.toLowerCase().indexOf(text.toLowerCase()) > -1 : false;
		});
		if (searchResult.length == 0) {
			searchResult.push({
				"instructionGuid": null,
				"instructionDesc": '',
				"instructionName": "Add new “" + text + '”'
			})
		}
		this.setState({
			InstructionArray: searchResult, instructionSearchTxt: text
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
			actions.callLogin('V1/FuncForDrAppToSearchForInstructions', 'post', params, signupDetails.accessToken, 'SearchForInstructions');

		}

	}


	// SearchInvestigation = (text) => {
	// 	var searchResult = _.filter(InvestigationeFullArray, function (item) {
	// 		return item.investigationName.toLowerCase().indexOf(text.toLowerCase()) > -1;
	// 	});
	// 	// if (searchResult.length == 0 && text.length > 0) {
	// 	// 	searchResult.push({
	// 	// 		"investigationGuid": null,
	// 	// 		"investigationName": "Add new “" + text + '”',
	// 	// 	})
	// 	// } else if (searchResult.length == 0) {
	// 	// 	searchResult.push(InvestigationeFullArray)
	// 	// }

	// 	this.setState({
	// 		InvestigationArray: searchResult, investigationSearchTxt: text
	// 	});
	// 	if (text.length > 2) {
	// 		let { actions, signupDetails } = this.props;
	// 		let params = {
	// 			"UserGuid": signupDetails.UserGuid,
	// 			"DoctorGuid": signupDetails.doctorGuid,
	// 			"ClinicGuid": signupDetails.clinicGuid,
	// 			"Version": "",
	// 			"Data": {
	// 				"SearchText": text
	// 			}
	// 		}
	// 		actions.callLogin('V1/FuncForDrAppToSearchForInvestigation', 'post', params, signupDetails.accessToken, 'SearchForInvestigation');
	// 	}
	// }
	// SearchInstruction = (text) => {
	// 	var searchResult = _.filter(InstructionFullArray, function (item) {
	// 		return item.instructionsName.toLowerCase().indexOf(text.toLowerCase()) > -1;
	// 	});
	// 	// if (searchResult.length == 0 && text.length > 0) {
	// 	// 	searchResult.push({
	// 	// 		"instructionsGuid": null,
	// 	// 		"instructionsName": "Add new “" + text + '”',
	// 	// 	})
	// 	// } else if (searchResult.length == 0) {
	// 	// 	searchResult.push(InstructionFullArray)
	// 	// }
	// 	this.setState({
	// 		InstructionArray: searchResult, instructionSearchTxt: text
	// 	});
	// 	if (text.length > 2) {
	// 		let { actions, signupDetails } = this.props;
	// 		let params = {
	// 			"UserGuid": signupDetails.UserGuid,
	// 			"DoctorGuid": signupDetails.doctorGuid,
	// 			"ClinicGuid": signupDetails.clinicGuid,
	// 			"Version": "",
	// 			"Data": {
	// 				"SearchText": text
	// 			}
	// 		}
	// 		actions.callLogin('V1/FuncForDrAppToSearchForInstructions', 'post', params, signupDetails.accessToken, 'SearchForInstructions');
	// 	}
	// }

	// deleteCustomInvestigations = (item, index) => {
	// 	let { actions, signupDetails } = this.props;
	// 	this.state.InvestigationArray.splice(index, 1);
	// 	this.setState({ InvestigationArray: this.state.InvestigationArray })
	// 	setLogEvent("patient_consultation", { "delete_investigation": "click", UserGuid: signupDetails.UserGuid })
	// 	Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Delete_Investigation", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
	// }


	// deleteCustomInstructions = (item, index) => {
	// 	let { actions, signupDetails } = this.props;
	// 	this.state.InstructionArray.splice(index, 1);
	// 	this.setState({ InstructionArray: this.state.InstructionArray })
	// 	setLogEvent("patient_consultation", { "delete_instruction": "click", UserGuid: signupDetails.UserGuid })
	// 	Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Delete_Instruction", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

	// }

	// renderListInvestigations = ({ item, index }) => (
	// 	<TouchableOpacity style={{ flexDirection: 'row', marginTop: responsiveWidth(1.5), margin: 5 }} onPress={() => {
	// 		let { actions, signupDetails } = this.props;
	// 		// if (item.isSelected) {
	// 		// 	let params = {
	// 		// 		"UserGuid": signupDetails.UserGuid,
	// 		// 		"DoctorGuid": signupDetails.doctorGuid,
	// 		// 		"ClinicGuid": signupDetails.clinicGuid,
	// 		// 		"Version": "",
	// 		// 		"Data": {
	// 		// 			"AppointmentGuid": appoinmentGuid,
	// 		// 			"PatientAppointmentInvestigationGuId": item.patientAppointmentInvestigationGuId
	// 		// 		}
	// 		// 	}
	// 		// 	actions.callLogin('V1/FuncForDrAppToRemoveInvestigation', 'post', params, signupDetails.accessToken, 'RemoveInvestigation');
	// 		// 	setLogEvent("patient_consultation", { "remove_investigation": "click", UserGuid: signupDetails.UserGuid })
	// 		// } else {
	// 		// 	item.investigationName = item.investigationName.replace("Add new “", "").replace('”', "")
	// 		// 	let params = {
	// 		// 		"UserGuid": signupDetails.UserGuid,
	// 		// 		"DoctorGuid": signupDetails.doctorGuid,
	// 		// 		"ClinicGuid": signupDetails.clinicGuid,
	// 		// 		"Version": "",
	// 		// 		"Data": {
	// 		// 			"AppointmentGuid": appoinmentGuid,
	// 		// 			"InvestigationName": item.investigationName,
	// 		// 			"InvestigationDesc": item.investigationDesc,
	// 		// 			"InvestigationGuid": item.investigationGuid
	// 		// 		}
	// 		// 	}
	// 		// 	actions.callLogin('V1/FuncForDrAppToAddInvestigation', 'post', params, signupDetails.accessToken, item.investigationGuid == null ? "AddCustomInvestigation" : 'AddInvestigation');
	// 		// 	setLogEvent("patient_consultation", { "add_investigation": "select", UserGuid: signupDetails.UserGuid })
	// 		// }

	// 		//normalListBackup = [...this.state.InvestigationArray];
	// 		if (!item.isSelected) {
	// 			let isNameExist = false;
	// 			try {
	// 				let name = item.investigationName.replace("Add new “", "").replace('”', "")
	// 				if (InvestigationeFullArray && InvestigationeFullArray.length > 0)
	// 					for (let i = 0; i < InvestigationeFullArray.length; i++) {
	// 						if (InvestigationeFullArray[i].investigationName.toLowerCase() == name.toLowerCase() && InvestigationeFullArray[i].isSelected) {
	// 							isNameExist = true;
	// 							break;
	// 						}
	// 					}
	// 				if (isNameExist) {
	// 					Snackbar.show({ text: name + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
	// 					return;
	// 				}
	// 			} catch (error) {

	// 			}

	// 		}
	// 		normalListBackup = InvestigationeFullArray;
	// 		// item.isSelected = !item.isSelected;
	// 		// this.setState({ InvestigationArray: InvestigationeFullArray,investigationSearchTxt:'' })
	// 		if (item.investigationGuid) {
	// 			try {
	// 				var index2 = _.findIndex(InvestigationeFullArray, { investigationGuid: item.investigationGuid });
	// 				InvestigationeFullArray[index2].isSelected = !InvestigationeFullArray[index2].isSelected
	// 				this.setState({ InvestigationArray: InvestigationeFullArray, investigationSearchTxt: '' })

	// 			} catch (error) {

	// 			}
	// 			// item.isSelected=!item.isSelected;
	// 			// this.setState({ InvestigationArray:this.state.InvestigationArray  });
	// 		} else {
	// 			item.isSelected = !item.isSelected;
	// 			this.setState({ InvestigationArray: this.state.InvestigationArray, investigationSearchTxt: '' });
	// 			item.investigationName = item.investigationName.replace("Add new “", "").replace('”', "")
	// 			let params = {
	// 				"UserGuid": signupDetails.UserGuid,
	// 				"DoctorGuid": signupDetails.doctorGuid,
	// 				"ClinicGuid": signupDetails.clinicGuid,
	// 				"Version": "",
	// 				"Data": {
	// 					"AppointmentGuid": appoinmentGuid,
	// 					"InvestigationName": item.investigationName,
	// 					"InvestigationDesc": item.investigationDesc,
	// 					"InvestigationGuid": item.investigationGuid
	// 				}
	// 			}
	// 			actions.callLogin('V1/FuncForDrAppToAddInvestigation', 'post', params, signupDetails.accessToken, "AddCustomInvestigation");
	// 		}
	// 		investigationFlag = true;
	// 		DRONA.setIsConsultationChange(true);
	// 	}}>
	// 		<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}>
	// 			<Image source={item.isSelected ? Checked : un_checkbox} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5) }} />
	// 			<Text style={{ flex: 1, marginRight: responsiveWidth(2), marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: CustomFont.fontWeight400 }}>{item.investigationName}</Text>
	// 			{
	// 				item.doctorGuid == null || item.doctorGuid == "" ? null :
	// 					<TouchableOpacity onPress={() => { this.deleteCustomInvestigations(item, index) }}>
	// 						<Image source={deleteIcon} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2), marginRight: responsiveFontSize(1) }} />
	// 					</TouchableOpacity>
	// 			}
	// 		</View>
	// 	</TouchableOpacity>
	// );
	// renderListInstructions = ({ item, index }) => (
	// 	<TouchableOpacity style={{ flexDirection: 'row', marginTop: responsiveWidth(1.5), margin: 5 }} onPress={() => {
	// 		let { actions, signupDetails } = this.props;
	// 		// if (item.isSelected) {
	// 		// 	let params = {
	// 		// 		"UserGuid": signupDetails.UserGuid,
	// 		// 		"DoctorGuid": signupDetails.doctorGuid,
	// 		// 		"ClinicGuid": signupDetails.clinicGuid,
	// 		// 		"Version": "",
	// 		// 		"Data": {
	// 		// 			"AppointmentGuid": appoinmentGuid,
	// 		// 			"PatientAppointmentInstructionGuId": item.patientAppointmentInstructionGuId
	// 		// 		}
	// 		// 	}
	// 		// 	actions.callLogin('V1/FuncForDrAppToRemoveInstruction', 'post', params, signupDetails.accessToken, 'RemoveInstruction');
	// 		// 	setLogEvent("patient_consultation", { "remove_instruction": "click", UserGuid: signupDetails.UserGuid })
	// 		// } else {
	// 		// 	item.instructionsName = item.instructionsName.replace("Add new “", "").replace('”', "")
	// 		// 	let params = {
	// 		// 		"UserGuid": signupDetails.UserGuid,
	// 		// 		"DoctorGuid": signupDetails.doctorGuid,
	// 		// 		"ClinicGuid": signupDetails.clinicGuid,
	// 		// 		"Version": "",
	// 		// 		"Data": {
	// 		// 			"AppointmentGuid": appoinmentGuid,
	// 		// 			"InstructionsName": item.instructionsName,
	// 		// 			"InstructionsGuid": item.instructionsGuid
	// 		// 		}
	// 		// 	}
	// 		// 	actions.callLogin('V1/FuncForDrAppToAddInstruction', 'post', params, signupDetails.accessToken, item.instructionsGuid == null ? "AddCustomInstruction" : "AddInstruction");
	// 		// 	setLogEvent("patient_consultation", { "add_instruction": "select", UserGuid: signupDetails.UserGuid })
	// 		// }
	// 		if (!item.isSelected) {
	// 			let isNameExist = false;
	// 			try {
	// 				let name = item.instructionsName.replace("Add new “", "").replace('”', "")
	// 				if (InstructionFullArray && InstructionFullArray.length > 0)
	// 					for (let i = 0; i < InstructionFullArray.length; i++) {
	// 						if (InstructionFullArray[i].instructionsName.toLowerCase() == name.toLowerCase() && InstructionFullArray[i].isSelected) {
	// 							isNameExist = true;
	// 							break;
	// 						}
	// 					}
	// 				if (isNameExist) {
	// 					Snackbar.show({ text: name + ' already added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
	// 					return;
	// 				}
	// 			} catch (error) {

	// 			}

	// 		}
	// 		if (item.instructionsGuid) {
	// 			var index2 = _.findIndex(InstructionFullArray, { instructionsGuid: item.instructionsGuid });
	// 			InstructionFullArray[index2].isSelected = !InstructionFullArray[index2].isSelected
	// 			this.setState({ InstructionArray: InstructionFullArray, instructionSearchTxt: '' })
	// 		} else {
	// 			item.isSelected = !item.isSelected;
	// 			this.setState({ InstructionArray: this.state.InstructionArray, instructionSearchTxt: '' });

	// 			item.instructionsName = item.instructionsName.replace("Add new “", "").replace('”', "")
	// 			let params = {
	// 				"UserGuid": signupDetails.UserGuid,
	// 				"DoctorGuid": signupDetails.doctorGuid,
	// 				"ClinicGuid": signupDetails.clinicGuid,
	// 				"Version": "",
	// 				"Data": {
	// 					"AppointmentGuid": appoinmentGuid,
	// 					"InstructionsName": item.instructionsName,
	// 					"InstructionsGuid": item.instructionsGuid
	// 				}
	// 			}
	// 			actions.callLogin('V1/FuncForDrAppToAddInstruction', 'post', params, signupDetails.accessToken, "AddCustomInstruction");
	// 		}
	// 		// else{
	// 		// 	var index2 = _.findIndex(InstructionFullArray, { instructionsName: this.state.instructionSearchTxt });
	// 		// 	InstructionFullArray[index2].isSelected = !InstructionFullArray[index2].isSelected
	// 		// 	this.setState({ InstructionArray: InstructionFullArray, instructionSearchTxt: '' })
	// 		// }

	// 		//normalListBackup = [...this.state.InstructionArray];
	// 		//item.isSelected = !item.isSelected;
	// 		// console.log('InstructionFullArray-------'+JSON.stringify(InstructionFullArray));
	// 		// console.log('e-------'+JSON.stringify(this.state.InstructionArray));

	// 		normalListBackup = InstructionFullArray;

	// 		instructionFlag = true;
	// 		DRONA.setIsConsultationChange(true);
	// 	}}>
	// 		<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}>
	// 			<Image source={item.isSelected ? Checked : un_checkbox} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
	// 			<Text style={{ flex: 1, marginRight: responsiveWidth(2), marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor }}>{item.instructionsName}</Text>
	// 			{
	// 				item.doctorGuid == null || item.doctorGuid == "" ? null :
	// 					<TouchableOpacity onPress={() => { this.deleteCustomInstructions(item, index) }}>
	// 						<Image source={deleteIcon} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2), marginRight: responsiveFontSize(1) }} />
	// 					</TouchableOpacity>
	// 			}
	// 		</View>
	// 	</TouchableOpacity>
	// );

	renderSeparatorTag = () => {
		return <View style={{ marginTop: 0, height: 1, backgroundColor: Color.divider, opacity: 1 }} />;
	};
	renderListVitals = ({ item, index }) => (
		<View style={{ marginLeft: responsiveWidth(4), marginTop: responsiveWidth(4) }}>
			<View>
				<Text style={{ fontSize: CustomFont.font12, fontWeight: '700', color: Color.optiontext, margin: responsiveWidth(1) }}>{item.vitalName}</Text>
			</View>

			<View style={{ flexDirection: 'row', alignItems: 'center', }}>

				<TextInput returnKeyType="done"
					onFocus={() => {
						if (Platform.OS == 'ios')
							this.setState({ dynamicTop: responsiveHeight(15) })
						if (index > 6)
							this.setState({ dynamicBottom: 50 })
					}}
					onBlur={() => {
						if (Platform.OS == 'ios')
							this.setState({ dynamicTop: 0, dynamicBottom: 0 });
						//this.callOnBlur('1')
					}}
					//keyboardType='phone-pad'
					placeholderTextColor={Color.placeHolderColor}
					style={{ margin: 5, borderColor: Color.borderColor, borderWidth: 1, padding: 10, height: responsiveHeight(6), fontSize: CustomFont.font14, borderRadius: 5, width: '60%', fontWeight: CustomFont.fontWeight400, color: Color.optiontext, backgroundColor: Color.backgroundColor }}
					placeholder="Enter Value" value={this.state.textInputs[index]}
					maxLength={12} onChangeText={(text2) => {
						let text = this.removeSpecialChar(text2, item.vitalName);
						//console.log(prvLength + '------' + text2.length)
						if (item.vitalName == 'BP' && text && text.length > 1 && !text.includes('/') && prvLength < text2.length && prvLength > 0) {
							if (text.startsWith("1")) {
								if (text.length > 2)
									text += '/';
							} else {
								text += '/';
							}

						}


						let { textInputs } = this.state;
						textInputs[index] = text;
						this.setState({
							textInputs,
						});

						vitalFlag = true;
						DRONA.setIsConsultationChange(true);

						item.vitalValue = text;
						this.setState({ vitalsDataArrayAll: this.state.vitalsDataArrayAll });
						if (item.vitalName === "Weight" || item.vitalName === "Height") {
							if (text && text.length > 0) {
								this.calculateBMI()
							} else {
								if (this.state.vitalsDataArrayAll[bmiIndex].vitalName === "BMI") {
									this.state.vitalsDataArrayAll[bmiIndex].vitalValue = "";
								}
								textInputs[bmiIndex] = '';
								this.setState({
									textInputs,
								});
							}
						}
						prvLength = text.length;
						if (this.state.bpFieldError)
							this.setState({ bpFieldError: false });
					}}
				/>

				<Text style={{ paddingLeft: responsiveWidth(3), paddingRight: responsiveWidth(4), fontSize: CustomFont.font16, color: Color.yrColor, fontWeight: CustomFont.fontWeight700 }}>{item.vitalUnit}</Text>
			</View>
			{this.state.bpFieldError && item.vitalName == 'BP' ? <Text style={{ color: 'red', marginTop: 5, fontSize: CustomFont.font10 }}>{bpAlertMsg}</Text> : null}
		</View>
	);
	removeSpecialChar = (text, vitalName) => {
		let numbers = vitalName == 'BP' ? '0123456789/' : '0123456789./';
		if (text) {
			let lastchar = text.charAt(text.length - 1);
			if (numbers.indexOf(lastchar) > -1) {
				return text;
			} else {
				return '';
			}

		} else {
			return text;
		}
	}
	getSelectedSymptomTxt = () => {
		let tmpArr = [...this.state.SelectedSymptomArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].symptomName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	getSelectedFindingTxt = () => {
		let tmpArr = [...this.state.SelectedFindingArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].findingName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	getSelectedDiagnosticTxt = () => {
		let tmpArr = [...this.state.SelectedDiagnosticArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].diagnosisName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	getSelectedMMedicineTxt = () => {
		let tmpArr = [...this.state.SelectedSymptomArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].symptomName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}

	getSelectedInvestigationsTxt = () => {
		let tmpArr = [...this.state.SelectedInvestigationArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].investigationName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}

	getSelectedInstructionTxt = () => {
		let tmpArr = [...this.state.SelectedInstructionArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].instructionsName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}

	VitalCardList = (item, index) => {
		return (
			<View>
				{item.vitalValue != null && item.vitalValue != "" ? <View><Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{item.vitalName}: {item.vitalValue} {item.vitalUnit} </Text></View> : null}
			</View>
		)
	}

	RefreshPatient = (val) => {
		this.props.RefreshPatient(val);
	}

	renderItem = ({ item, index }) => {
		let isSelected = item.isTempSelected;
		return (
			<TouchableOpacity style={{
				flexDirection: 'row', marginEnd: 8, marginTop: 8,
				width: responsiveWidth(27.4),
				backgroundColor: isSelected ? Color.lightpinkbg : Color.white,
				height: responsiveHeight(7),
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 10,
				justifyContent: 'center',
				alignItems: 'center',
				borderColor: isSelected ? Color.pink : Color.lightBlue,
				borderWidth: 1
			}}
				onPress={() => { this.setLanguage(index) }}>
				<Text zIndex={999} style={{ color: Color.darkGray, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700 }}>{item.label}</Text>
			</TouchableOpacity>
		);
	};
	setLanguage = (index) => {
		tempSelectedIndex = index;
		//alert(tempSelectedIndex)
		try {
			AsyncStorage.setItem('lanIndex', tempSelectedIndex.toString())
		} catch (e) { }
		for (let i = 0; i < this.state.languageArr.length; i++) {
			this.state.languageArr[i].isTempSelected = i == index;
		}
		this.setState({ languageArr: this.state.languageArr, isLanguage: false })
		Language.language.setLanguage(this.state.languageArr[index].value)
	}

	addPressClick = () => {
		this.setState({ isMedicineModalOpen: false, showStateDosage: false })
		this.callApiToGetMedicineType();
	}

	callApiToGetMedicineType = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"userGuid": signupDetails.UserGuid,
			"doctorGuid": signupDetails.doctorGuid,
			"clinicGuid": signupDetails.clinicGuid,
			"version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetMedicineType', 'post', params, signupDetails.accessToken, 'getmedicinetype');
	}

	addPressed = () => {
		if (this.state.medicineSearchTxt && this.state.medicineTypeName) {
			let { actions, signupDetails } = this.props;
			let params = {
				"userGuid": signupDetails.UserGuid,
				"doctorGuid": signupDetails.doctorGuid,
				"clinicGuid": signupDetails.clinicGuid,
				"version": "",
				"Data": {
					"MedicineName": this.state.medicineSearchTxt,
					"MedicineDesc": this.state.genericName,
					"MedicineTypeGuid": this.state.medicineTypeName,
					"Strength": this.state.strength
				}
			}
			actions.callLogin('V14/FuncForDrAppToAddNewMedicine', 'post', params, signupDetails.accessToken, 'addmedicine');
			medicineFlag = true;
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
		this.setState({ medicineSearchTxt: text });
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
		if (this.state.medicineSearchTxt)
			this.setState({ isMedicineTypeSelected: true })

		this.setState({ medicineTypeSearchTxt: item.label, showStateDosage: false })
	}
	callIsFucused2 = () => {
		this.setState({ InpborderColor2: Color.primary, showStateDosage: true })
	}
	callIsBlur2 = () => {
		this.setState({ InpborderColor2: Color.inputdefaultBorder, })
		//this.dismissDialog()
	}
	getSelectedMMedicineTxt = (item) => {
		let str = item.medicineName;
		if (item.strength)
			str += ' ' + item.strength;

		if (item.medicineType)
			str += ' ' + item.medicineType;

		if (item.dosagePattern)
			str += ' ' + item.dosagePattern;
		return str;
	}

	ShowMedicineAfterSelect = (item) => {
		let str = item.dosagePattern ? item.dosagePattern + ', ' : '';
		if (item.durationValue)
			str += item.durationValue + ', ';

		if (item.durationType)
			str += item.durationType + ' ';

		if (item.medicineTimingFrequency != 'No Preference')
			str += item.medicineTimingFrequency + ' ';

		if (item.dosages)
			str += ' dose: ' + item.dosages;

		if (item.dosages && item.medicineDosasesType[0].doasestype)
			str += ' ' + item.medicineDosasesType[0].doasestype;
		return str;
	}
	renderSeverityModalItem = (item, index) => {
		return (
			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }} onPress={() => {
				for (let i = 0; i < this.state.SeverityDataArray.length; i++) {
					this.state.SeverityDataArray[i].select = false;
				}
				this.state.SeverityDataArray[index].select = true;
				selectedReson = this.state.SeverityDataArray[index].itemValue;
				this.setState({ SeverityDataArray: this.state.SeverityDataArray })
			}}>
				<CheckBox
					disabled={false}
					value={item.select}
					onValueChange={(newValue) => {
						for (let i = 0; i < this.state.SeverityDataArray.length; i++) {
							this.state.SeverityDataArray[i].select = false;
						}
						this.state.SeverityDataArray[index].select = true;
						selectedReson = this.state.SeverityDataArray[index].itemValue;
						this.setState({ SeverityDataArray: this.state.SeverityDataArray })
					}}
					tintColors={{ true: Color.primary, false: Color.unselectedCheckBox }}
					style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), color: Color.mediumGrayTxt, marginLeft: 2 }}

				/>
				<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, marginLeft: 10, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}>{item.itemValue}</Text>
			</TouchableOpacity>
		)
	}
	render() {
		let { actions, signupDetails } = this.props;
		//console.log('---SymptomArr---'+JSON.stringify(this.state.SelectedMedicineArr));
		return (
			<View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
				<View style={{ flex: 1 }}>
					<ScrollView style={{ marginBottom: responsiveHeight(2) }}>
						<View style={{ flex: 1 }}>
							{/* -----------Upload Hand wtitten prescription Button-------- */}
							<TouchableOpacity onPress={() => {
								if (!appointmentStatus || (appointmentStatus == 'No Show' || appointmentStatus == 'Cancelled' || appointmentStatus == 'Completed' || signupDetails.isAssistantUser || !signupDetails.appoinmentGuid || this.props.showCall)) {

								}
								else {
									this.props.nav.navigation.navigate('AddPrescription', { imageArr: [], isAddOrEdit: 'add', appStatus: appointmentStatus })

								}

							}} style={{
								backgroundColor: (!appointmentStatus || (appointmentStatus == 'No Show' || appointmentStatus == 'Cancelled' || appointmentStatus == 'Completed' || signupDetails.isAssistantUser || !signupDetails.appoinmentGuid || this.props.showCall)) ? Color.disabledBtn : Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0),
								padding: responsiveWidth(5), flexDirection: 'row', alignItems: 'center'
							}} >
								<Image source={fluentArrowUpload} style={{ height: 25, width: 24 }} />
								<Text style={{ marginStart: 10, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, color: Color.primary, fontFamily: CustomFont.fontName }}>Upload Handwritten Prescription</Text>
							</TouchableOpacity>

							<TouchableOpacity style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }} onPress={() => {
								this.getVitals();
							}}>
								<View style={{ margin: responsiveWidth(5) }}>

									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Vitals</Text>

										{this.state.vitalsDataArray && this.state.vitalsDataArray.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), margin: 5 }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}

									</View>
									<FlatList
										data={this.state.vitalsDataArray}
										renderItem={({ item, index }) => this.VitalCardList(item, index)}
										extraData={this.state}
										// horizontal={true}
										showsHorizontalScrollIndicator={false}
										keyExtractor={(item, index) => index.toString()}
									/>
								</View>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => {

								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Symptoms', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Symptoms", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({ isSymptomModalOpen: true });
							}}
								disabled={signupDetails.isAssistantUser}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Symptoms</Text>
											{signupDetails.isAssistantUser ? null : <TouchableOpacity onPress={() => {
												let { signupDetails } = this.props;
												timeRange = Trace.getTimeRange();
												Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Symptoms', signupDetails.firebaseLocation)
												Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Symptoms", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
												this.setState({ isSymptomModalOpen: true });
											}}>
												{this.state.SelectedSymptomArr && this.state.SelectedSymptomArr.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}
											</TouchableOpacity>}

										</View>
										<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
											{this.state.SelectedSymptomArr && this.state.SelectedSymptomArr.length > 0 ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedSymptomTxt()}</Text> : null}
										</View>
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => { this.setState({ isFindingModalOpen: true }); }} disabled={signupDetails.isAssistantUser}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Examination Findings</Text>
											{signupDetails.isAssistantUser ? null :
												<TouchableOpacity onPress={() => {
													this.setState({
														isFindingModalOpen: true
													});
												}}>
													{this.state.SelectedFindingArr && this.state.SelectedFindingArr.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}
												</TouchableOpacity>}
										</View>
										{this.state.SelectedFindingArr && this.state.SelectedFindingArr.length > 0 ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedFindingTxt()}</Text> : null}

									</View>
								</View>
							</TouchableOpacity>


							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Diagnosis', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Diagnosis", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({
									isDiagnosticModalOpen: true
								});
							}} disabled={signupDetails.isAssistantUser}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>

										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Diagnosis</Text>
											{signupDetails.isAssistantUser ? null :
												<TouchableOpacity onPress={() => {
													let { signupDetails } = this.props;
													timeRange = Trace.getTimeRange();
													Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Diagnosis', signupDetails.firebaseLocation)
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Diagnosis", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.setState({
														isDiagnosticModalOpen: true
													});
												}}>
													{this.state.SelectedDiagnosticArr && this.state.SelectedDiagnosticArr.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}
												</TouchableOpacity>}
										</View>
										{this.state.SelectedDiagnosticArr && this.state.SelectedDiagnosticArr.length > 0 ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedDiagnosticTxt()}</Text> : null}

									</View>
								</View>
							</TouchableOpacity>


							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Medicines', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Medicines", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({ isMedicineModalOpen: true, MedicineArr: medicineFullArray })
							}} disabled={signupDetails.isAssistantUser}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Medicines</Text>
											{signupDetails.isAssistantUser ? null :
												<TouchableOpacity onPress={() => {
													let { signupDetails } = this.props;
													timeRange = Trace.getTimeRange();
													Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Medicines', signupDetails.firebaseLocation)
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Medicines", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.setState({ isSearchStart: false, isMedicineModalOpen: true, medTiming: medTiming, medicineSearchTxt: '', MedicineArr: medicineFullArray })
												}}>
													{this.state.SelectedMedicineArr && this.state.SelectedMedicineArr.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}
												</TouchableOpacity>}
										</View>
										<View>
											{this.state.SelectedMedicineArr && this.state.SelectedMedicineArr.length > 0 ? this.state.SelectedMedicineArr.map((item, index) => {
												return (
													<View style={{ marginTop: responsiveWidth(1.6) }} >
														<Text style={{ marginRight: responsiveWidth(2), fontSize: CustomFont.font14, color: Color.fontColor }}>• {item.medicineName + ' ' + item.strength}</Text>
														<Text style={{ marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), fontSize: CustomFont.font12, color: Color.fontColor, opacity: .6 }}>{this.ShowMedicineAfterSelect(item)}</Text>
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
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Investigation', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Investigation", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({
									isModalVisibleInvestigations: true,
									InvestigationArray: InvestigationeFullArray
								})
							}} disabled={signupDetails.isAssistantUser}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>

										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Investigations</Text>
											{signupDetails.isAssistantUser ? null :
												<TouchableOpacity onPress={() => {

													let { signupDetails } = this.props;
													timeRange = Trace.getTimeRange();
													Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Investigation', signupDetails.firebaseLocation)
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Investigation", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

													this.setState({
														// awardsTitle: '',
														// awardsProvider: '',
														// awardsYear: '',
														isModalVisibleInvestigations: true,
														InvestigationArray: InvestigationeFullArray
													})
												}}>
													{this.getSelectedInvestigationsTxt() ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}
												</TouchableOpacity>}
										</View>
										{this.getSelectedInvestigationsTxt() ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedInvestigationsTxt()}</Text> : null}

									</View>
								</View>
							</TouchableOpacity>


							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Instructions', signupDetails.firebaseLocation)
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Instructions", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
								this.setState({
									isModalVisibleInstruction: true,
									InstructionArray: InstructionFullArray
								})
							}} disabled={signupDetails.isAssistantUser}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Instructions</Text>
											{signupDetails.isAssistantUser ? null :
												<TouchableOpacity onPress={() => {
													let { signupDetails } = this.props;
													timeRange = Trace.getTimeRange();
													Trace.startTrace(timeRange, signupDetails.mobile, signupDetails.age, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Instructions', signupDetails.firebaseLocation)
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Instructions", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.setState({
														isModalVisibleInstruction: true,
														InstructionArray: InstructionFullArray
													})
												}}>
													{this.state.InstructionArray && this.state.InstructionArray.length > 0 && this.getSelectedInstructionTxt() ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}
												</TouchableOpacity>}
										</View>
										{this.getSelectedInstructionTxt() ? <Text style={{ marginRight: responsiveWidth(3), fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, fontFamily: CustomFont.fontName }}>{this.getSelectedInstructionTxt()}</Text> : null}
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setState({ isModalVisibleAbout: true, })} disabled={signupDetails.isAssistantUser}>
								<View style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(0) }}>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Notes</Text>
											{signupDetails.isAssistantUser ? null :
												<TouchableOpacity onPress={() => {
													let timeRange = Trace.getTimeRange();
													Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + "Consultation_Notes", signupDetails.firebaseLocation);
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Consultation_Notes", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.setState({ isModalVisibleAbout: true, })
												}}>
													{this.state.notesData && this.state.notesData.length > 0 ? <Image source={edit_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} /> : <Image source={plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', margin: 5 }} />}
												</TouchableOpacity>}
										</View>
										{this.state.notesData && this.state.notesData.length > 0 ? <Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontFamily: CustomFont.fontName }}>{this.state.notesData}</Text> : null}

									</View>
								</View>
							</TouchableOpacity>

							{this.state.followupData ? <FollowUpModal nav={this.state.followupData} /> : null}

						</View>
					</ScrollView>

					<View style={{ backgroundColor: Color.white, flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 10, justifyContent: 'center' }}>

						<ThreeDotsModal item={this.props.item} nav={{ navigation: this.props.nav.navigation }} RefreshPatient={this.RefreshPatient} />
						{!appointmentStatus || (appointmentStatus == 'No Show' || appointmentStatus == 'Cancelled' || appointmentStatus == 'Completed' || signupDetails.isAssistantUser || !signupDetails.appoinmentGuid || (this.props.item.consultationType == 'Virtual' && !this.props.item.isPaymentReceived) || this.state.isHideConsultNowBtn || signupDetails.returnValueFromTwilio)
							?
							<View style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.disabledBtn, borderRadius: 5, marginTop: 7, marginBottom: 7 }}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Save & Preview Rx</Text>
							</View>
							:
							<TouchableOpacity onPress={() => {
								if (this.props.showCall) {
									Snackbar.show({ text: 'Please end the video call.', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								} else {
									this.savePage();
								}
							}} style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.primary, borderRadius: 5, marginTop: 7, marginBottom: 7 }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16 }}>Save & Preview Rx</Text>
							</TouchableOpacity>



						}
						<PreviewRxButton nav={{ navigation: this.props.nav.navigation }} showCall={this.props.showCall} item={this.props.item} />
					</View>
				</View>
				{/* ------------ Language Modal ---------------  */}

				<Modal isVisible={this.state.isLanguage} avoidKeyboard={true}>
					<View style={styles.modelView1}>
						<View style={[{ flexDirection: 'row', marginStart: 24, marginEnd: 24, marginTop: 0, }]}>
							<Text style={{ ...styles.modalHeading, fontWeight: CustomFont.fontWeight700 }}>Choose Language</Text>
							<TouchableOpacity style={{ paddingLeft: 20, paddingRight: 10, justifyContent: 'center', marginTop: responsiveHeight(-.5), marginStart: 10 }} onPress={() => this.setState({ isLanguage: false })}>

								<Image style={{ height: responsiveHeight(4), width: responsiveWidth(4), resizeMode: 'contain' }} source={cross} />
							</TouchableOpacity>
						</View>

						<FlatList
							data={this.state.languageArr}
							renderItem={this.renderItem}
							style={[{ marginStart: 24, marginEnd: 24, marginTop: 24, }]}
							numColumns={3}
						/>
					</View>
				</Modal>

				{/* -----------Vital  modal------------------- */}
				<Modal isVisible={this.state.isModalVisibleVital} avoidKeyboard={true}
					onRequestClose={() => this.setState({ isModalVisibleVital: false })}>
					<View style={styles.modelViewAbout}>
						<View style={{ marginStart: 0, margin: responsiveWidth(5), marginEnd: 0, flex: 1, marginBottom: responsiveHeight(15), paddingTop: this.state.dynamicTop, paddingBottom: this.state.dynamicBottom }}>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 7 }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 10 }}>Add Vitals</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ padding: 7 }} onPress={() => this.setState({ isModalVisibleVital: false })}>
									<Image source={cross_close} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10, resizeMode: 'contain' }} />
								</TouchableOpacity>
							</View>

							{this.state.vitalsDataArrayAll && this.state.vitalsDataArrayAll.length > 0 ?
								<FlatList
									data={this.state.vitalsDataArrayAll}
									renderItem={this.renderListVitals}
									extraData={this.state}
									style={{ marginBottom: responsiveHeight(7) }}
									keyExtractor={(item, index) => index.toString()}
								/>

								: <Text style={{ textAlign: 'center', alignSelf: 'center', fontSize: CustomFont.font14, fontWeight: '700', color: Color.primary, margin: responsiveWidth(1) }}>No vital data found</Text>}

							{this.state.vitalsDataArrayAll && this.state.vitalsDataArrayAll.length > 0 ?
								<View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: responsiveHeight(23) }}>
									<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 30 }} onPress={() => {
										if (this.state.vitalsDataArrayAll && this.state.vitalsDataArrayAll.length > 0) {
											this.updateVitals()
										} else {
											Snackbar.show({ text: 'No data available to submit ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
										}
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
									</TouchableOpacity>
								</View> : null}
						</View>
					</View>
				</Modal>

				{/* -----------------symptom modal------------- */}

				<Modal isVisible={this.state.isSymptomModalOpen} onRequestClose={() => this.setState({ isSymptomModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>

						<View style={{ flex: 1, margin: responsiveWidth(3), marginBottom: responsiveHeight(23) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Add Symptoms</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace();
									this.setState({
										fld2: Color.borderColor,
										isSymptomModalOpen: false,
										symptomSearchTxt: '',
										SymptomArr: SymptomFullArray
									})
								}}>
									<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />
								</TouchableOpacity>
							</View>

							<View style={[styles.searchView, { borderColor: this.state.fld2, borderWidth: 1, backgroundColor: Color.white }]}>
								{/* <Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
							 */}
								<TextInput returnKeyType="done"
									onFocus={() => this.callOnFocus('2')}
									onBlur={() => this.callOnBlur('2')}
									placeholderTextColor={Color.placeHolderColor}
									style={[styles.searchInput]} placeholder="Search or add symptoms" value={this.state.symptomSearchTxt}
									onChangeText={(symptomSearchTxt) => {
										let { signupDetails } = this.props;
										//prev
										setLogEvent("patient_consultation", { "search_symptoms": "search", UserGuid: signupDetails.UserGuid, "keyword": symptomSearchTxt })

										Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Search_Symptoms", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
										this.SearchSymptom(symptomSearchTxt)
										this.SearchSymptom(symptomSearchTxt)
									}} maxLength={30} />
								{this.state.symptomSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ symptomSearchTxt: '', SymptomArr: SymptomFullArray }); }}>
									<Image style={{ ...styles.crossSearch }} source={cross_close} />
								</TouchableOpacity> : null}
							</View>
							<ScrollView>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.SelectedSymptomArr && this.state.SelectedSymptomArr.length > 0 ? this.state.SelectedSymptomArr.map((item, index) => {
										return (<TouchableOpacity style={styles.selectedView} onPress={() => {

											// this.setState({ isSymptomModalOpen: false });
											// setTimeout(() => {
											// 	this.setState({ isModalOpenSeverity: true });
											// }, 500)


										}}>
											<Text style={styles.txtSelect}>{item.symptomName}</Text>
											{/* <CustomModalOne /> */}
											<TouchableOpacity style={styles.crossSelected}
												onPress={() => {
													symptomFlag = true;
													DRONA.setIsConsultationChange(true);
													let { signupDetails } = this.props;
													setLogEvent("delete_symptoms", { UserGuid: signupDetails.UserGuid })
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Delete_Symptoms", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.removeSelectedSymptom(item, index)
												}}>
												{/* <Text style={{ color: Color.primary, fontSize: CustomFont.font10 }}>X</Text> */}
												<Image source={cross_select} style={{ height: responsiveWidth(3), width: responsiveWidth(3), }} />
											</TouchableOpacity>


										</TouchableOpacity>);
									}, this) : null}
									{this.state.SelectedSymptomArr && this.state.SelectedSymptomArr.length > 0 ?
										<View style={{ backgroundColor: Color.borderColor, height: .5, width: '100%', marginTop: 10, paddingHorizontal: 10 }}>
										</View> : null}

								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.SymptomArr && this.state.SymptomArr.length > 0 ? this.state.SymptomArr.map((item, index) => {

										return (<TouchableOpacity onPress={() => {
											symptomFlag = true;
											DRONA.setIsConsultationChange(true);
											let { signupDetails } = this.props;
											setLogEvent("add_symptoms", { UserGuid: signupDetails.UserGuid })
											Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Add_Symptoms", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

											if (item.symptomName)
												this.clickOnSymptom(item, index)
										}}>
											<View style={styles.unselectView}>
												<Text style={styles.unselectTxtColor}>{item.symptomName}</Text>
											</View>
										</TouchableOpacity>
										);
									}, this) : null}
								</View>
							</ScrollView>
						</View>


					</View>
				</Modal>

				{/* -----------------finding modal------------- */}
				<Modal isVisible={this.state.isFindingModalOpen} onRequestClose={() => this.setState({ isFindingModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>
						<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(24), flex: 1, }}>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Examination Findings</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ fld3: Color.borderColor, isFindingModalOpen: false, findingSearchTxt: '', FindingArr: findingFullArray })}>
									<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />

								</TouchableOpacity>
							</View>


							<View style={[styles.searchView, { borderColor: this.state.fld3, borderWidth: 1, backgroundColor: Color.white }]}>

								<TextInput returnKeyType="done"
									onFocus={() => this.callOnFocus('3')}
									onBlur={() => this.callOnBlur('3')}
									placeholderTextColor={Color.placeHolderColor}
									style={styles.searchInput} placeholder="Search or add findings" value={this.state.findingSearchTxt}
									onChangeText={(findingSearchTxt) => {
										this.SearchFinding(findingSearchTxt)
										let { signupDetails } = this.props;
										setLogEvent("patient_consultation", { "search_findings": "search", UserGuid: signupDetails.UserGuid, "keyword": findingSearchTxt })
									}} maxLength={30} />
								{this.state.findingSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ findingSearchTxt: '', FindingArr: findingFullArray }); }}>
									<Image style={{ ...styles.crossSearch, }} source={cross_close} />

								</TouchableOpacity> : null}
							</View>
							<ScrollView>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.SelectedFindingArr && this.state.SelectedFindingArr.length > 0 ? this.state.SelectedFindingArr.map((item, index) => {
										return (<View style={styles.selectedView} >
											<Text style={styles.txtSelect}>{item.findingName}</Text>
											<TouchableOpacity style={styles.crossSelected}
												onPress={() => {
													findingFlag = true;
													DRONA.setIsConsultationChange(true);
													this.removeSelectedFinding(item, index)
													let { signupDetails } = this.props;
													setLogEvent("delete_finding", { UserGuid: signupDetails.UserGuid })
												}}>
												<Image source={cross_select} style={{ height: responsiveWidth(3.8), width: responsiveWidth(4), }} />
											</TouchableOpacity></View>);
									}, this) : null}
								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.FindingArr && this.state.FindingArr.length > 0 ? this.state.FindingArr.map((item, index) => {
										return (<TouchableOpacity style={styles.unselectView} onPress={() => {
											findingFlag = true;
											DRONA.setIsConsultationChange(true);
											let { signupDetails } = this.props;
											setLogEvent("add_finding", { UserGuid: signupDetails.UserGuid })
											if (item.findingName)
												this.clickOnFinding(item, index)
										}} >
											<Text style={styles.unselectTxtColor}>{item.findingName}</Text>
										</TouchableOpacity>
										);
									}, this) : null}
								</View>
							</ScrollView>
						</View>

					</View>
				</Modal>
				{/* -----------------diagnostic modal------------- */}
				<Modal isVisible={this.state.isDiagnosticModalOpen}
					onRequestClose={() => this.setState({ isDiagnosticModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>
						<ScrollView keyboardShouldPersistTaps='always' style={{ marginBottom: responsiveHeight(22) }}>
							<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(22), flex: 1 }}>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
									<TouchableOpacity style={{ padding: 10 }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Diagnosis</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ padding: 10 }} onPress={() => {
										Trace.stopTrace();
										this.setState({ fld4: Color.borderColor, isDiagnosticModalOpen: false, diagnosticSearchTxt: '', DiagnosticArr: diagnosticFullArray })
									}}>
										<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />
									</TouchableOpacity>
								</View>

								<View style={[styles.searchView, { borderColor: this.state.fld4, borderWidth: 1, backgroundColor: Color.white }]}>
									{/* <Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
								 */}
									<TextInput returnKeyType="done"
										onFocus={() => this.callOnFocus('4')}
										onBlur={() => this.callOnBlur('4')}
										placeholderTextColor={Color.placeHolderColor}
										style={styles.searchInput} placeholder="Search or add diagnosis" value={this.state.diagnosticSearchTxt}
										onChangeText={(diagnosticSearchTxt) => {
											let { signupDetails } = this.props;
											timeRange = Trace.getTimeRange();
											Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Diagnosis_Search', signupDetails.firebaseLocation)
											Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Diagnosis_Search", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
											setLogEvent("patient_consultation", { "search_diagnosis": "search", UserGuid: signupDetails.UserGuid, "keyword": diagnosticSearchTxt })
											Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Search_Diagnosis", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
											this.SearchDiagnostic(diagnosticSearchTxt)
										}} maxLength={30}
									/>

									{this.state.diagnosticSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ diagnosticSearchTxt: '', DiagnosticArr: diagnosticFullArray }); }}>
										<Image style={{ ...styles.crossSearch, tintColor: Color.primary, }} source={cross_close} />
									</TouchableOpacity> : null}
								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.SelectedDiagnosticArr && this.state.SelectedDiagnosticArr.length > 0 ? this.state.SelectedDiagnosticArr.map((item, index) => {
										return (<View style={styles.selectedView} >
											<Text style={styles.txtSelect}>{item.diagnosisName}</Text>
											<TouchableOpacity style={styles.crossSelected}
												onPress={() => {
													diagnosticFlag = true;
													DRONA.setIsConsultationChange(true);
													let { signupDetails } = this.props;
													setLogEvent("delete_diagnosis", { UserGuid: signupDetails.UserGuid })
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Delete_Diagnosis", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.removeSelectedDiagnostic(item, index)
												}}>
												<Image source={cross_select} style={{ height: responsiveWidth(3.8), width: responsiveWidth(4), }} />
											</TouchableOpacity></View>);
									}, this) : null}
								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.DiagnosticArr && this.state.DiagnosticArr.length > 0 ? this.state.DiagnosticArr.map((item, index) => {
										return (<TouchableOpacity style={styles.unselectView} onPress={() => {
											diagnosticFlag = true;
											DRONA.setIsConsultationChange(true);
											let { signupDetails } = this.props;
											setLogEvent("add_diagnosis", { UserGuid: signupDetails.UserGuid })
											Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Add_Diagnosis", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
											if (item.diagnosisName)
												this.clickOnDiagnostic(item, index)
										}} >
											<Text style={styles.unselectTxtColor}>{item.diagnosisName}</Text>
										</TouchableOpacity>
										);
									}, this) : null}
								</View>
							</View>
						</ScrollView>

					</View>
				</Modal>

				{/* -----------------Medicine modal------------- */}

				<Modal isVisible={this.state.isMedicineModalOpen}
					onRequestClose={() => this.setState({ isMedicineModalOpen: false })}>
					<View style={[styles.modelViewMessageMedicine]}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<TouchableOpacity style={{ padding: 10 }} >
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Add Medicines</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ padding: 10 }} onPress={() => {
								let { signupDetails } = this.props;
								Trace.stopTrace()
								setLogEvent("patient_consultation", { "close_medicine": "click", UserGuid: signupDetails.UserGuid })
								this.setState({ fld5: Color.borderColor, isMedicineModalOpen: false, medicineSearchTxt: '', MedicineArr: medicineFullArray })
							}}>
								<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />
							</TouchableOpacity>
						</View>

						<ScrollView keyboardShouldPersistTaps='always'>
							<View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(15) }}>

								<View style={[styles.searchView, { borderColor: this.state.fld5, borderWidth: 1, backgroundColor: Color.white }]}>
									{/* <Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
								 */}
									<TextInput returnKeyType="done"
										onFocus={() => this.callOnFocus('5')}
										onBlur={() => this.callOnBlur('5')}
										placeholderTextColor={Color.placeHolderColor}
										style={[styles.searchInput,]} placeholder="Search or add medicine" value={this.state.medicineSearchTxt}
										onChangeText={(medicineSearchTxt) => {
											let { signupDetails } = this.props;
											setLogEvent("patient_consultation", { "search_medicine": "search", UserGuid: signupDetails.UserGuid, "keyword": medicineSearchTxt })
											Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Medicine_Search', signupDetails.firebaseLocation)
											Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Medicine_Search", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
											this.SearchMedicine(medicineSearchTxt)
										}} maxLength={30} />
									{this.state.medicineSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ medicineSearchTxt: '', MedicineArr: medicineFullArray }); }}>
										<Image style={{ ...styles.crossSearch, tintColor: Color.primary, }} source={cross_close} />
									</TouchableOpacity> : null}
								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.SelectedMedicineArr && this.state.SelectedMedicineArr.length > 0 ? this.state.SelectedMedicineArr.map((item, index) => {
										return (<View style={styles.selectedView} >
											<TouchableOpacity onPress={() => {
												let { signupDetails } = this.props;
												setLogEvent("medicine", { "select_medicine": "click", UserGuid: signupDetails.UserGuid })
												Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Select_Medicine", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
												this.setState({ isMedicineModalOpen: false })
												medicineIndex = index;
												medicineAddUpdateFlag = 'update';
												this.props.nav.navigation.navigate('MedicineDetails', { item: item, medTiming: medTiming, Refresh: this.RefreshData });
											}}>
												<Text style={styles.txtSelect}>{this.getSelectedMMedicineTxt(item)}</Text>
											</TouchableOpacity>
											<TouchableOpacity style={styles.crossSelected}
												onPress={() => {
													let { signupDetails } = this.props;
													setLogEvent("delete_medicine", { UserGuid: signupDetails.UserGuid })
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Delete_Medicine", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.removeSelectedMedicine(item, index)
												}}>
												<Image source={cross_select} style={{ height: responsiveWidth(3.8), width: responsiveWidth(4), }} />
											</TouchableOpacity></View>);
									}, this) : null}
								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.MedicineArr && this.state.MedicineArr.length > 0 ? this.state.MedicineArr.map((item, index) => {
										return (<TouchableOpacity style={styles.unselectView} onPress={() => {
											this.setState({ isMedicineModalOpen: false })
											medicineIndex = index;
											medicineAddUpdateFlag = 'add';
											this.props.nav.navigation.navigate('MedicineDetails', { item: item, medTiming: medTiming, Refresh: this.RefreshData });
											// this.clickOnMedicine(item, index)
										}} >
											<Text style={[styles.unselectTxtColor, { marginRight: responsiveWidth(1) }]}>{item.medicineName + ' ' + item.strength}</Text>
											<Text style={{ marginRight: responsiveWidth(2), fontSize: CustomFont.font12, color: Color.fontColor, opacity: .6, fontFamily: CustomFont.fontName }}>{item.medicineType && item.medicineType.length > 3 ? item.medicineType.substr(0, 3) : item.medicineType}</Text>
										</TouchableOpacity>
										);
									}, this) : <Text style={{ marginTop: responsiveHeight(10), marginLeft: responsiveWidth(30), color: Color.fontColor }}>{this.state.medicineFoundStatus}</Text>}
								</View>
								{
									this.state.isSearchStart ?
										<TouchableOpacity onPress={this.addPressClick} style={{ margin: responsiveWidth(3), alignItems: 'center', justifyContent: 'center' }}>
											<Text style={{ color: Color.primaryBlue, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700 }}> + Add '{this.state.medicineSearchTxt}' as a New Medicine</Text>
										</TouchableOpacity> : null
								}
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
										<TextInput returnKeyType="done" onChangeText={this.typeMedcineName} value={this.state.medicineSearchTxt} style={{ paddingLeft: 5, borderColor: Color.borderColor, borderRadius: 7, marginTop: 10, height: responsiveHeight(5.5), borderWidth: 1, color: Color.fontColor }} />
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
											if (this.state.medicineSearchTxt)
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
									}} onPress={this.addPressed}>
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

				{/* ---------- Investigation model------------ */}

				<Modal isVisible={this.state.isModalVisibleInvestigations}
					onRequestClose={() => this.setState({ isModalVisibleInvestigations: false })}>
					<View style={[styles.modelViewMessage]}>
						<View style={{ flex: 1, margin: responsiveWidth(3), marginBottom: responsiveHeight(23) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }} >
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Add Investigations</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({ fld6: Color.borderColor, isModalVisibleInvestigations: false, investigationSearchTxt: '', InvestigationArray: InvestigationeFullArray })
								}

								}>
									<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10, }} />
								</TouchableOpacity>
							</View>
							<View style={[styles.searchView, { borderColor: this.state.fld6, borderWidth: 1, backgroundColor: Color.white }]}>
								{/* <Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
								 */}
								<TextInput returnKeyType="done"
									onFocus={() => this.callOnFocus('2')}
									onBlur={() => this.callOnBlur('2')}
									placeholderTextColor={Color.placeHolderColor}
									style={[styles.searchInput]} placeholder="Search or add investigation" value={this.state.investigationSearchTxt}
									onChangeText={(investigationSearchTxt) => {
										let { signupDetails } = this.props;
										//prev
										setLogEvent("patient_consultation", { "search_investigation": "search", UserGuid: signupDetails.UserGuid, "keyword": investigationSearchTxt })

										Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "search_investigation", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
										this.SearchInvestigation(investigationSearchTxt)
										this.SearchInvestigation(investigationSearchTxt)
									}} maxLength={30} />


								{this.state.investigationSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ investigationSearchTxt: '', InvestigationArray: InvestigationeFullArray }); }}>
									<Image style={{ ...styles.crossSearch, tintColor: Color.primary, }} source={cross_close} />

								</TouchableOpacity> : null}
							</View>

							<ScrollView>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.SelectedInvestigationArr && this.state.SelectedInvestigationArr.length > 0 ? this.state.SelectedInvestigationArr.map((item, index) => {
										return (<View style={styles.selectedView} >
											<Text style={styles.txtSelect}>{item.investigationName}</Text>
											<TouchableOpacity style={styles.crossSelected}
												onPress={() => {
													investigationFlag = true;
													DRONA.setIsConsultationChange(true);
													let { signupDetails } = this.props;
													setLogEvent("delete_Investigation", { UserGuid: signupDetails.UserGuid })
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "delete_Investigation", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.removeSelectedInvestigation(item, index)
												}}>
												{/* <Text style={{ color: Color.primary, fontSize: CustomFont.font10 }}>X</Text> */}
												<Image source={cross_select} style={{ height: responsiveWidth(3), width: responsiveWidth(3), }} />
											</TouchableOpacity>


										</View>);
									}, this) : null}
									{this.state.SelectedInvestigationArr && this.state.SelectedInvestigationArr.length > 0 ?
										<View style={{ backgroundColor: Color.borderColor, height: .5, width: '100%', marginTop: 10, paddingHorizontal: 10 }}>
										</View> : null}

								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.InvestigationArray && this.state.InvestigationArray.length > 0 ? this.state.InvestigationArray.map((item, index) => {

										return (<TouchableOpacity onPress={() => {
											investigationFlag = true;
											DRONA.setIsConsultationChange(true);
											let { signupDetails } = this.props;
											setLogEvent("add_investigation", { UserGuid: signupDetails.UserGuid })
											Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "add_investigation", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

											if (item.investigationName)
												this.clickOnInvestigation(item, index)
										}}>
											<View style={styles.unselectView}>
												<Text style={styles.unselectTxtColor}>{item.investigationName}</Text>
											</View>
										</TouchableOpacity>
										);
									}, this) : null}
								</View>
							</ScrollView>

							{/* <FlatList
								data={this.state.InvestigationArray}
								renderItem={this.renderListInvestigations}
								extraData={this.state}
								keyExtractor={(item, index) => index.toString()}
								style={{ marginBottom: Platform.OS == 'android' ? responsiveHeight(25) : responsiveHeight(20), minHeight: responsiveHeight(60) }}
							/> */}

						</View>
					</View>
				</Modal>

				{/* ---------- Instruction model------------ */}

				<Modal isVisible={this.state.isModalVisibleInstruction}
					onRequestClose={() => this.setState({ isModalVisibleInstruction: false })}>
					<View style={[styles.modelViewMessage]}>
						<View style={{ flex: 1, margin: responsiveWidth(3), marginBottom: responsiveHeight(23) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }} >
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Add Instructions</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									Trace.stopTrace()
									this.setState({
										fld7: Color.borderColor,
										isModalVisibleInstruction: false,
										instructionSearchTxt: '',
										InstructionArray: InstructionFullArray
									})
								}}>
									<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />
								</TouchableOpacity>
							</View>
							<View style={[styles.searchView, { borderColor: this.state.fld6, borderWidth: 1, backgroundColor: Color.white }]}>
								{/* <Image source={search_gray} style={{ alignSelf: 'center', marginStart: 10 }} />
							 */}
								<TextInput returnKeyType="done"
									onFocus={() => this.callOnFocus('2')}
									onBlur={() => this.callOnBlur('2')}
									placeholderTextColor={Color.placeHolderColor}
									style={[styles.searchInput]} placeholder="Search or add instructions" value={this.state.instructionSearchTxt}
									onChangeText={(instructionSearchTxt) => {
										let { signupDetails } = this.props;
										//prev
										setLogEvent("patient_consultation", { "search_instruction": "search", UserGuid: signupDetails.UserGuid, "keyword": instructionSearchTxt })

										Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "search_instruction", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
										this.SearchInstruction(instructionSearchTxt)
										this.SearchInstruction(instructionSearchTxt)
									}} maxLength={30} />
								{this.state.instructionSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ instructionSearchTxt: '', InstructionArray: InstructionFullArray }); }}>
									<Image style={{ ...styles.crossSearch, tintColor: Color.primary, }} source={cross_close} />
								</TouchableOpacity> : null}
							</View>
							<ScrollView>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.SelectedInstructionArr && this.state.SelectedInstructionArr.length > 0 ? this.state.SelectedInstructionArr.map((item, index) => {
										return (<TouchableOpacity style={styles.selectedView} onPress={()=>{

											// this.setState({isModalVisibleInstruction: false})
											// setTimeout(()=>{
											// 	this.setState({isModalVisibleInstructionInvest:true})
											// },500)
										}} >
											<Text style={styles.txtSelect}>{item.instructionsName}</Text>
											<TouchableOpacity style={styles.crossSelected}
												onPress={() => {
													instructionFlag = true;
													DRONA.setIsConsultationChange(true);
													let { signupDetails } = this.props;
													setLogEvent("delete_Instruction", { UserGuid: signupDetails.UserGuid })
													Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "delete_Instruction", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
													this.removeSelectedInstruction(item, index)
												}}>
												{/* <Text style={{ color: Color.primary, fontSize: CustomFont.font10 }}>X</Text> */}
												<Image source={cross_select} style={{ height: responsiveWidth(3), width: responsiveWidth(3), }} />
											</TouchableOpacity>


										</TouchableOpacity>);
									}, this) : null}
									{this.state.SelectedInstructionArr && this.state.SelectedInstructionArr.length > 0 ?
										<View style={{ backgroundColor: Color.borderColor, height: .5, width: '100%', marginTop: 10, paddingHorizontal: 10 }}>
										</View> : null}

								</View>

								<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 3 }}>
									{this.state.InstructionArray && this.state.InstructionArray.length > 0 ? this.state.InstructionArray.map((item, index) => {

										return (<TouchableOpacity onPress={() => {
											instructionFlag = true;
											DRONA.setIsConsultationChange(true);
											let { signupDetails } = this.props;
											setLogEvent("add_instruction", { UserGuid: signupDetails.UserGuid })
											Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "add_instruction", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

											if (item.instructionsName)
												this.clickOnInstruction(item, index)
										}}>
											<View style={styles.unselectView}>
												<Text style={styles.unselectTxtColor}>{item.instructionsName}</Text>
											</View>
										</TouchableOpacity>
										);
									}, this) : null}
								</View>
							</ScrollView>

							{/* <FlatList
								data={this.state.InstructionArray}
								renderItem={this.renderListInstructions}
								extraData={this.state}
								keyExtractor={(item, index) => index.toString()}
								style={{ marginBottom: Platform.OS == 'android' ? responsiveHeight(25) : responsiveHeight(20), minHeight: responsiveHeight(60) }}
							/> */}

						</View>
					</View>
				</Modal>

				{/* -----------Notes modal------------------- */}

				<Modal style={{ paddingTop: responsiveHeight(7) }} isVisible={this.state.isModalVisibleAbout} avoidKeyboard={true}
					onRequestClose={() => this.setState({ isModalVisibleAbout: false })}>
					<View style={styles.modelViewNote}>
						<View behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={this.state.keyboardAvoiding}>
							<ScrollView>
								<View style={{ margin: responsiveWidth(2), flex: 1, marginBottom: responsiveHeight(22) }}>

									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
										{/* <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ fld8: Color.borderColor, isModalVisibleAbout: false })}>
											<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />
										</TouchableOpacity> */}
										<TouchableOpacity style={{ padding: 10 }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Add Notes</Text>
										</TouchableOpacity>

										{/* <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ fld8: Color.borderColor, isModalVisibleAbout: false })}>
											<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />
										</TouchableOpacity> */}
										<TouchableOpacity style={{ padding: 10 }} onPress={() => {
											Trace.stopTrace();
											this.setState({ fld8: Color.borderColor, isModalVisibleAbout: false })
										}}>
											<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10 }} />
										</TouchableOpacity>
									</View>
									<View style={{ flex: 1 }}>

										<TextInput blurOnSubmit={false} 
											onFocus={() => this.callOnFocus('8')}
											onBlur={() => this.callOnBlur('8')}
											placeholderTextColor={Color.placeHolderColor}
											style={{ borderWidth: 1, borderColor: this.state.fld8, padding: 10, height: responsiveHeight(30), fontSize: CustomFont.font14, borderRadius: 5, marginLeft: responsiveHeight(1.5), marginRight: responsiveHeight(1.5), textAlignVertical: 'top', color: Color.optiontext, marginTop: 10 }}
											placeholder="Add notes" multiline={true} value={this.state.notesData} onChangeText={notesData => {
												this.setState({ notesData });
												notesFlag = true;
												DRONA.setIsConsultationChange(true);
											}} maxLength={2000} />
										<View style={{ alignItems: 'flex-end' }}>
											<Text style={{ fontSize: CustomFont.font10, color: Color.fontColor, marginRight: responsiveHeight(3), marginTop: 5, opacity: .4 }}>{this.state.notesData.length} / 2000</Text>

										</View>
										<TouchableOpacity onPress={() => {
											Trace.stopTrace();
											this.setState({ fld8: Color.borderColor, isModalVisibleAbout: false })
										}} style={{
											marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4),
											backgroundColor: Color.primary, borderRadius: 10, marginTop: responsiveHeight(6), height: responsiveHeight(5), justifyContent: 'center', alignItems: 'center'
										}}>
											<Text style={{ fontSize: CustomFont.font16, color: Color.white, fontFamily: CustomFont.fontName }}>Save</Text>
										</TouchableOpacity>
									</View>

								</View>
							</ScrollView>
						</View>
					</View>
				</Modal>
				{/* -----------Severity Modal---------- */}
				<Modal isVisible={this.state.isModalOpenSeverity} avoidKeyboard={true}
					onRequestClose={() => this.setState({ isModalOpenSeverity: false })}>
					<View style={[styles.modelView3dots, { height: responsiveHeight(120) }]}>
						<ScrollView>
							<View style={{ marginBottom: responsiveHeight(32) }}>
								<View style={{ margin: responsiveWidth(5) }}>
									<View style={{ height: responsiveHeight(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<View >
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700, }}>Symptoms</Text>
										</View>
										<TouchableOpacity onPress={() => this.setState({ isModalOpenSeverity: false })}>
											<Image source={cross_close} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), marginRight: 10, resizeMode: 'contain' }} />
										</TouchableOpacity>
									</View>


									<View>
										<Text style={{ color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginTop: 10 }}>
											Since</Text>
										<TouchableOpacity style={{ flexDirection: 'row', height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), alignItems: 'center', justifyContent: 'space-between' }}
											onPress={() => this.setState({ isModalVisibleRelation: true })}>

											<TextInput editable={true} style={{ fontSize: CustomFont.font14, color: Color.placeHolderColor, paddingLeft: 10, paddingRight: 10 }}>1 Day</TextInput><Image source={down} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginRight: responsiveWidth(3) }} />
										</TouchableOpacity>
										<Text style={{ color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginTop: 15, }}>
											Severity
										</Text>
										<View style={{ marginBottom: responsiveHeight(5) }}>
											<FlatList
												data={this.state.SeverityDataArray}
												renderItem={({ item, index }) => this.renderSeverityModalItem(item, index)}
												keyExtractor={(item, index) => index.toString()}
											/>
										</View>
										<Text style={{ color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginBottom: 10 }}>
											Notes</Text>
										<TextInput returnKeyType="done" style={{ height: responsiveHeight(10), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, fontSize: CustomFont.font14, color: Color.placeHolderColor, paddingLeft: 10, paddingRight: 10 }} multiline={true} placeholder="Enter Notes" placeholderTextColor={Color.placeHolderColor} ></TextInput>
										<View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(11), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
											<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 20 }} onPress={() => {
												console.log('Button Pressed')
											}}>
												<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</ScrollView>
					</View>
				</Modal>
				{/* -----Instruction Investigation Data Add Modal------- */}
				<Modal isVisible={this.state.isModalVisibleInstructionInvest} avoidKeyboard={true}
					onRequestClose={() => this.setState({ isModalVisibleInstructionInvest: false })}>
					<View style={[styles.modelView3dots, { height: responsiveHeight(50) }]}>
						<ScrollView>
							<View style={{ marginBottom: responsiveHeight(32) }}>
								<View style={{ margin: responsiveWidth(5) }}>
									<View style={{ height: responsiveHeight(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<View >
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700, }}>CT Scan</Text>
										</View>
										<TouchableOpacity onPress={() => this.setState({ isModalVisibleInstructionInvest: false })}>
										<Image source={cross_close} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), marginRight: 10, resizeMode: 'contain' }} />
										</TouchableOpacity>
									</View>


									<View>
										<Text style={{ color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginBottom: 10 }}>
											Notes</Text>
										<TextInput returnKeyType="done" style={{ height: responsiveHeight(10), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, fontSize: CustomFont.font14, color: Color.placeHolderColor, paddingLeft: 10, paddingRight: 10 }} multiline={true} placeholder="Enter Notes" placeholderTextColor={Color.placeHolderColor} ></TextInput>
										<View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(11), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
											<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 20 }} onPress={() => {
												console.log('Button Pressed')
											}}>
												<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</ScrollView>
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
)(Consultation);
