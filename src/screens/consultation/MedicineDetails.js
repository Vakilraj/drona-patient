import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	View,
	Text, Platform, Image, TouchableOpacity, BackHandler, TextInput, FlatList, SafeAreaView
} from 'react-native';
import arrow_grey from '../../../assets/back_blue.png';
import downarrow from '../../../assets/downarrow.png';
import upArrow from '../../../assets/uparrow.png';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';

import CustomFont from '../../components/CustomFont';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DropDownPicker from 'react-native-dropdown-picker';
import Snackbar from 'react-native-snackbar';
import { setLogEvent } from '../../service/Analytics';
import Validator from '../../components/Validator';
import Trace from '../../service/Trace'
import _ from 'lodash';
let prevIndexTimings = 0, prevIndexDoase = 0, prevIndexDuration = 1, medicineType = '', medicineTypeGuid = '', durationType = 'days', DurationTypeValue = '5', MedicineDoasesGuId = '', doasestype = '', Dosages = '', TimingTypeGuid = '', dosagePattern = '';
let doasagesPatterArr = [{ label: '1-0-0', value: '1-0-0', isSelect: true }, { label: '0-1-0', value: '0-1-0', isSelect: false }, { label: '0-0-1', value: '0-0-1', isSelect: false }, { label: '1-1-0', value: '1-1-0', isSelect: false }, { label: '0-1-1', value: '0-1-1', isSelect: false }, { label: '1-0-1', value: '1-0-1', isSelect: false }, { label: '1-1-1', value: '1-1-1', isSelect: false }, { label: '6 Hourly', value: '6 Hourly', isSelect: false }, { label: 'Alternate Day', value: 'Alternate Day', isSelect: false }, { label: 'Weekly', value: 'Weekly', isSelect: false }, { label: 'Monthly', value: 'Monthly', isSelect: false }, { label: 'SOS', value: 'SOS', isSelect: false }, { label: 'Custom dosage', value: 'Custom dosage', isSelect: false }]
let clickFlag = 0, isEdit = false, prvLength = -1, InputTxtLengthDosage = 15, InputTxtLengthDuration = 5, InputTxtLengthUnit = 5;
let medicineTimingFrequency = 'Empty Stomach';
let medicineDosasesType;
let fromDaysData = [{ value: 'days' }, { value: 'weeks' }, { value: 'months' }, { value: 'years' }]
let fullArrayUnit = [];
let doctorNotes = [];
let whenToTakeData = [
	{ label: 'Before Food', value: 'Before Food' },
	{ label: 'After Food', value: 'After Food' },
	{ label: 'No Preference', value: 'No Preference' },
	{ label: 'Before Breakfast', value: 'Before Breakfast' },
	{ label: 'After Breakfast', value: 'After Breakfast' },
	{ label: 'Before Lunch', value: 'Before Lunch' },
	{ label: 'After Lunch', value: 'After Lunch' },
	{ label: 'Before Dinner', value: 'Before Dinner' },
	{ label: 'After Dinner', value: 'After Dinner' },
	{ label: 'Empty Stomach', value: 'Empty Stomach' },
	{ label: 'Bed Time', value: 'Bed Time' },
	{ label: 'SOS', value: 'SOS' },
]
let durationData = [
	{ label: 'Daily', value: 'Daily' },
	{ label: 'Alternate Day', value: 'Alternate Day' },
	{ label: 'Fort Night', value: 'Fort Night' },
	{ label: 'Hourly', value: 'Hourly' },
	{ label: 'Monthly', value: 'Monthly' },
	{ label: 'SOS', value: 'SOS' },
	{ label: 'Weekly', value: 'Weekly' },
]
class MedicineDetails extends React.Component {
	constructor(props) {
		super(props);
		if (Array.isArray(props.navigation.state.params.item)) {
			medicineDosasesType = props.navigation.state.params.item[0].medicineDosasesType
		} else {
			medicineDosasesType = props.navigation.state.params.item.medicineDosasesType
		}
		this.state = {
			noteData: '',
			showStateDosage: false,
			dosageDropdownArr: doasagesPatterArr,
			dosageSearchTxt: '',
			InpborderColor2: Color.inputdefaultBorder,
			InpborderColorDuration: Color.inputdefaultBorder,
			InpborderColorUnit: Color.inputdefaultBorder,
			InpborderColorFrom: Color.inputdefaultBorder,
			InpborderColorTo: Color.inputdefaultBorder,
			CustomInput: false,
			whenToTakeArr: whenToTakeData,
			showDurationDropDown: false,
			showUnitDropDown: false,
			dutaionTxt: '',
			unitTxt: '',
			DurationDropdownArr: durationData,
			UnitDropdownArr: medicineDosasesType,
			taperedData: [],
			selectedIndex: 0,
			fromDaysTxt: '',
			showFromDayTxtDropDown: false,
			fromDaysDataArr: fromDaysData,
			showToDayTxtDropDown: false,
			showDoctorNotesdropDown: false,
			doctorNoteTxt: '',
			// noteDatas: temp,
			doctorNotesDataArr: [],
			// DurationDropdownArr: durationData,



		};
		prevIndexTimings = 0;
		prevIndexDoase = 0;
		prevIndexDuration = 1;
		medicineTypeGuid = '';
		durationType = 'days';
		DurationTypeValue = '5';
		MedicineDoasesGuId = '';
		doasestype = '';
		Dosages = '';
		TimingTypeGuid = '';
		dosagePattern = '';
		isEdit = false;
	}
	async componentDidMount() {
		clickFlag = 0;
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack()
			try {
				this.props.navigation.state.params.Refresh({ isEdit: isEdit, data: null });
			} catch (error) {
			}
		});
		let item = this.props.navigation.state.params.item;
		console.log('===this.props.navigation.state.params===', JSON.stringify(this.props.navigation.state.params.medicineUnitVal))
		if (Array.isArray(item)) {
			this.setState({ taperedData: item });
		}
		else {
			let tempArr = [];
			tempArr.push(item);
			this.setState({ taperedData: tempArr })
		}
		doctorNotes = this.props.navigation.state.params.doctorNotes;
		this.setState({ doctorNotesDataArr: doctorNotes })
		medicineTypeGuid = item.medicineTypeGuid;
		// medicineType = item.medicineType;

		if (item.medicineDosasesType && item.medicineDosasesType.length > 0) {
			// let tempDoaseArr = [];
			// for (let i = 0; i < item.medicineDosasesType.length; i++) {
			// 	tempDoaseArr.push({ label: item.medicineDosasesType[i].doasestype, value: item.medicineDosasesType[i].medicineTypeGuid, medicineDoasesGuId: item.medicineDosasesType[i].medicineDoasesGuId })
			// }
			medicineTypeGuid = item.medicineDosasesType[0].medicineTypeGuid;
			MedicineDoasesGuId = item.medicineDosasesType[0].medicineDoasesGuId;
			doasestype = item.medicineDosasesType[0].doasestype;
			fullArrayUnit = item.medicineDosasesType;
			console.log('----fullArrayUnit-----' + JSON.stringify(fullArrayUnit))
			//this.setState({ DosageTitleArr: tempDoaseArr });
			// if (doasestype === 'Tablet') {
			// 	let tmpArr = [{ label: '1/2', value: '1/2', isSelect: false }, { label: '3/4', value: '3/4', isSelect: false }, { label: '1', value: '1', isSelect: true }, { label: '2', value: '2', isSelect: false }];
			// 	// for (let i = 2; i < 3; i++) {
			// 	// 	tmpArr.push({ label: i + '', value: i + '', isSelect: false })
			// 	// }
			// 	this.setState({ DosageArr: tmpArr, doaseUnit: doasestype })
			// 	prevIndexDoase = 2;
			// } else {
			// 	this.setState({ DosageArr: [{ label: '1', value: '1', isSelect: true }, { label: '2', value: '2', isSelect: false }, { label: '3', value: '3', isSelect: false }, { label: '4', value: '4', isSelect: false }], doaseUnit: doasestype })
			// }
		}
		// let medTiming = this.props.navigation.state.params.medTiming;
		// if (medTiming) {
		// 	let tempTimingArr = [];
		// 	prevIndexTimings = 0;
		// 	for (let i = 0; i < medTiming.length; i++) {
		// 		// if (i == 0)
		// 		// 	tempTimingArr.push({ label: medTiming[i].medicineTiming, value: medTiming[i].medicineTimingGuId, isSelect: true })
		// 		// else
		// 		if (medTiming[i].medicineTimingGuId == item.timingTypeGuid)
		// 			prevIndexTimings = i;
		// 		tempTimingArr.push({ label: medTiming[i].medicineTiming, value: medTiming[i].medicineTimingGuId, isSelect: medTiming[i].medicineTimingGuId == item.timingTypeGuid })
		// 	}
		// 	TimingTypeGuid = medTiming[0].medicineTimingGuId
		// 	if (item.timingTypeGuid) {
		// 		TimingTypeGuid = item.timingTypeGuid;
		// 	} else {
		// 		tempTimingArr[0].isSelect = true;
		// 	}
		// 	this.setState({ TimingTitleArr: tempTimingArr, defaultTimingTitle: TimingTypeGuid });

		// }

		//prefilled
		setTimeout(() => {
			try {
				// let index = this.state.DosageArr.findIndex(x => x.value == item.dosages);
				// if (index > -1) {
				// 	this.state.DosageArr[prevIndexDoase].isSelect = false;
				// 	prevIndexDoase = index;
				// 	this.state.DosageArr[index].isSelect = true;
				// 	this.setState({ DosageArr: this.state.DosageArr })
				// } else {
				// 	if (item.dosages && item.dosages != 0)
				// 		this.state.DosageArr[prevIndexDoase].isSelect = false;
				// 	this.setState({ doaseValue: item.dosages ? item.dosages : '', DosageArr: this.state.DosageArr })
				// }

				Dosages = item.dosages ? item.dosages : 1;
				durationType = item.durationType ? item.durationType : 'days';
				if (item.durationType)
					DurationTypeValue = item.durationType;
				if (item.medicineTimingFrequency)
					medicineTimingFrequency = item.medicineTimingFrequency;

				this.setState({ noteData: item.note ? item.note : '' })

				if (item.dosagePattern) {
					dosagePattern = item.dosagePattern;
					InputTxtLengthDosage = dosagePattern.length;
					if (dosagePattern && dosagePattern.indexOf('.')) {
						this.setState({ CustomInput: true })
					}
					this.setState({ dosageSearchTxt: dosagePattern })
				}
				let durationRefileedTxt = DurationTypeValue + ' ' + durationType;
				InputTxtLengthDuration = durationRefileedTxt.length;

				let unitRefileedTxt = Dosages + ' ' + doasestype;
				InputTxtLengthUnit = unitRefileedTxt.length;

				this.setState({ dutaionTxt: durationRefileedTxt, unitTxt: unitRefileedTxt })

				// let indexDuratuion = this.state.DurationArr.findIndex(x => x.value == item.durationType);
				// if (indexDuratuion > -1) {
				// 	this.state.DurationArr[prevIndexDuration].isSelect = false;
				// 	prevIndexDuration = indexDuratuion;
				// 	this.state.DurationArr[indexDuratuion].isSelect = true;
				// 	this.setState({ DurationArr: this.state.DurationArr })
				// } else {
				// 	if (item.durationType && item.durationType != 0)
				// 		this.state.DurationArr[prevIndexDuration].isSelect = false;
				// 	this.setState({ durationType: item.durationType ? item.durationType + '' : '', DurationArr: this.state.DurationArr })
				// }
				// if (item.durationType)
				// 	DurationTypeValue = item.durationType;
				//this.setState({ takingTimeIndex: timings == "Empty Stomach" ? 0 : timings == "Before Food" ? 1 : timings == "After Food" ? 2 : timings == "No Preference" ? 3 : 0 });

				//this.setState({ defaultTimingTitle: TimingTypeGuid })



			} catch (e) { }


		}, 1000)
	}

	// getDurationAndUnit = (item) => {
	// 	Dosages = item.dosages ? item.dosages : 1;
	// 	durationType = item.durationType ? item.durationType : 'days';
	// 	if (item.durationType)
	// 		DurationTypeValue = item.durationType;
	// 	if (item.medicineTimingFrequency)
	// 		medicineTimingFrequency = item.medicineTimingFrequency;

	// 	//this.setState({ noteData: item.note ? item.note : '' })

	// 	if (item.dosagePattern) {
	// 		dosagePattern = item.dosagePattern;
	// 		InputTxtLengthDosage = dosagePattern.length;
	// 		if (dosagePattern && dosagePattern.indexOf('.')) {
	// 			this.setState({ CustomInput: true })
	// 		}
	// 		//this.setState({ dosageSearchTxt: dosagePattern })
	// 	}
	// 	let durationRefileedTxt = DurationTypeValue + ' ' + durationType;
	// 	InputTxtLengthDuration = durationRefileedTxt.length;

	// 	let unitRefileedTxt = Dosages + ' ' + doasestype;
	// 	InputTxtLengthUnit = unitRefileedTxt.length;

	// 	//this.setState({ dutaionTxt: durationRefileedTxt, unitTxt: unitRefileedTxt })
	// 	return unitRefileedTxt;
	// }

	// getDoseValue = (item) => {
	// 	Dosages = item.dosages ? item.dosages : 1;
	// 	if (this.state.selectedIndex)
	// 		if (item.dosagePattern) {
	// 			dosagePattern = item.dosagePattern;
	// 			InputTxtLengthDosage = dosagePattern.length;
	// 			if (dosagePattern && dosagePattern.indexOf('.')) {
	// 				this.setState({ CustomInput: true })
	// 			}
	// 			this.setState({ dosageSearchTxt: dosagePattern })
	// 		}
	// }

	// getDurationValue = (item) => {
	// 	// let durationRefileedTxt = DurationTypeValue + ' ' + durationType;
	// 	// InputTxtLengthDuration = durationRefileedTxt.length;

	// 	// let unitRefileedTxt = Dosages + ' ' + doasestype;
	// 	// InputTxtLengthUnit = unitRefileedTxt.length;

	// 	// this.setState({ dutaionTxt: durationRefileedTxt, unitTxt: unitRefileedTxt })
	// }

	saveData = () => {
		clickFlag = 1;
		let { signupDetails } = this.props;
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'Medicine_Add', signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Medicine_Add", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
		let item = this.props.navigation.state.params.item;
		let saveData = [...this.state.taperedData];
		let savevalue = {}
		console.log('========= saveData1 ========', JSON.stringify(saveData))
		saveData.forEach((_item, index) => {
			saveData[index].medicineTypeGuid = saveData[0].medicineTypeGuid;
			saveData[index].medicineGuid = saveData[0].medicineGuid;
			saveData[index].yellowFlag = true;
			saveData[index].appointmentGuid = signupDetails.appoinmentGuid;
			saveData[index].medicineName = saveData[0].medicineName;
			saveData[index].medicineIndex = index;
			 //saveData[index].medicineDosasesTypeGuid = 'c7221d1c-8579-11eb-996a-0022486b91c8';
			saveData[index].durationValue = 0;
			saveData[index].dosages = null;
			saveData[index].route = null;

			// saveData[0]?.medicineDosasesType && saveData[0]?.medicineDosasesType.forEach((val) => {
			// 	if (val.doasestype === _item.medicineType) {
			// 		//saveData[index].medicineDosasesType = val.medicineDoasesGuId;
			// 		saveData[index].medicineDosasesTypeGuid = val.medicineDoasesGuId;
			// 	}
			// })
			// delete saveData[index].medicineDosasesType
		})

		console.log('========= saveData ========', JSON.stringify(saveData))
		let data = {
			appointmentGuid: signupDetails.appoinmentGuid,
			medicineGuid: item.medicineGuid,
			medicineName: item.medicineName + ' ' + item.strength, //+ ' ' + item.medicineDesc
			medicineDesc: item.medicineDesc,
			strength: item.strength,
			medicineTypeGuid: medicineTypeGuid,
			medicineType: medicineType,
			// durationType: durationType,
			durationType: DurationTypeValue,
			yellowFlag: true,
			timingTypeGuid: TimingTypeGuid,
			medicineTimingShift: null,
			medicineTimingFrequency: medicineTimingFrequency,
			dosages: Dosages,
			dosagePattern: dosagePattern,
			note: this.state.noteData,
			patientAppointmentMedicineGuId: item.patientAppointmentMedicineGuId,
			medicineDosasesType: [{ medicineDoasesGuId: MedicineDoasesGuId, doasestype: doasestype }] //"medicineTypeGuid":medicineTypeGuid
		}
		isEdit = true;
		const { navigation } = this.props;
		navigation.goBack();
		navigation.state.params.Refresh({ isEdit: isEdit, data: saveData });
		//actions.callLogin('V1/FuncForDrAppToAddUpdateMedicine', 'post', params, signupDetails.accessToken, 'saveMedicine');
		setLogEvent("patient_consultation", { "save_medicine": "click", UserGuid: signupDetails.UserGuid })

	}

	clickOnDoctorNotes = (item, index) => {
		const tempData = this.state.taperedData
		// this.setState({ noteData });
		tempData[index].note = item.note;
		this.setState({ noteData: item.note, showDoctorNotesdropDown: false })
	}

	callIsFucused2 = (index) => {
		this.setState({ InpborderColor2: Color.primary, selectedIndex: index });
		if (!this.state.CustomInput)
			this.setState({ showStateDosage: true });
	}
	callIsBlur2 = () => {
		this.setState({ InpborderColor2: Color.inputdefaultBorder, }) // showStateDosage: false
		//this.dismissDialog()
	}
	dismissDialog = () => {
		this.setState({ showStateDosage: false });
	}
	callIsFucusedDuration = (index) => {
		this.setState({ InpborderColorDuration: Color.primary, selectedIndex: index, showDurationDropDown: true })
	}
	callIsBlurDuration = () => {
		this.setState({ InpborderColorDuration: Color.inputdefaultBorder, });
	}

	callIsFucusedUnit = (index) => {
		this.setState({ InpborderColorUnit: Color.primary, selectedIndex: index, showUnitDropDown: true })
	}
	callIsBlurUnit = () => {
		this.setState({ InpborderColorUnit: Color.inputdefaultBorder, });
	}
	callIsBlurFrom = () => {
		this.setState({ InpborderColorFrom: Color.inputdefaultBorder, });
	}
	callIsFucusedFrom = (index) => {
		this.setState({ InpborderColorFrom: Color.primary, selectedIndex: index })
	}
	callIsBlurTo = () => {
		this.setState({ InpborderColorTo: Color.inputdefaultBorder, });
	}
	callIsFucusedTo = (index) => {
		this.setState({ InpborderColorTo: Color.primary, selectedIndex: index })
	}

	SearchFilterFunctionDosage = (text, index) => {
		const tempData = [...this.state.taperedData]
		this.setState({ selectedIndex: index })
		if (text && text.length > 0) {
			// if (Validator.isMobileValidate(txtWithOutHifen)) {
			// 	if (prvLength > text.length) {
			// 		this.setState({ dosageSearchTxt: text });
			// 	} else {
			// 		let str = txtWithOutHifen;
			// 		if (str.length > 1) {
			// 			try {
			// 				var parts = str.split("");
			// 				text = parts.join("-");
			// 			} catch (error) {

			// 			}

			// 		}
			// 		this.setState({ dosageSearchTxt: text });
			// 	}
			// }
			// var searchResult = _.filter(doasagesPatterArr, function (item) {
			// 	return item.label.indexOf(text) > -1;
			// });
			// this.setState({ dosageDropdownArr: searchResult, showStateDosage: true });

			// dosagePattern = text;
			// prvLength = text.length;
			if (text && text.length > 0) {
				if (Validator.isNumberHyphanDotSlashValidate(text)) {
					this.setState({ dosageSearchTxt: text });
					tempData[index].dosagePattern = text;
				}
				var searchResult = _.filter(doasagesPatterArr, function (item) {
					return item.label.indexOf(text) > -1;
				});
				this.setState({ dosageDropdownArr: searchResult, showStateDosage: true });

				dosagePattern = text;
				// prvLength = text.length;
			}
		} else
			this.setState({ dosageSearchTxt: '', dosageDropdownArr: doasagesPatterArr });
	}
	DoseValidation = (text) => {
		if (this.state.selectedIndex)
			if (text) {
				if (Validator.isDoseValidate(text)) {
					this.setState({ dosageSearchTxt: text })
					dosagePattern = text;
				}
			} else {
				this.setState({ dosageSearchTxt: '' });
			}
	}
	clickOnState = (item, index) => {
		const tempData = this.state.taperedData
		if (item.value === 'Custom dosage') {
			dosagePattern = null;
			tempData[index].dosagePattern = '';
			this.setState({ dosageSearchTxt: '', showStateDosage: false, CustomInput: true });
			try {
				setTimeout(() => {
					this.refs.search.focus();
				}, 500)
			} catch (error) {

			}
		}
		else {
			dosagePattern = item.value;
			//if(dosagePattern && dosagePattern.length>4)
			InputTxtLengthDosage = dosagePattern.length;
			tempData[index].dosagePattern = item.label
			this.setState({ dosageSearchTxt: item.label, showStateDosage: false, CustomInput: false })
		}
	}

	handleDurationData = (text, index) => {
		this.setState({ selectedIndex: index })
		let ans = [];
		let temp = [...this.state.DurationDropdownArr]
		if (text) {
			ans = temp.filter((val) => val.label.toLowerCase().includes(text.toLowerCase()))
		}
		this.setState({ dutaionTxt: text, DurationDropdownArr: text.length === 0 ? durationData : ans })
		// if (text && Validator.isMobileValidate(text)) {
		// 	for (let i = 0; i < duationTypeArr.length; i++) {
		// 		if (text == 1)
		// 			duationTypeArr[i].label = text + ' ' + duationTypeArr[i].label;
		// 		else
		// 			duationTypeArr[i].label = text + ' ' + duationTypeArr[i].label + 's';
		// 	}
		// 	this.setState({ DurationDropdownArr: duationTypeArr, showDurationDropDown: true })
		// }
		// this.setState({ dutaionTxt: text });
	}

	clickOnDuration = (item, index) => {
		let tempData = this.state.taperedData;
		if (this.state.selectedIndex == index)
			if (item.label) {
				let str = item.label.split(' ');
				durationType = str[1];
				DurationTypeValue = str[0];
				InputTxtLengthDuration = item.label.length;
			}

		tempData[index].durationType = item.label;
		this.setState({ dutaionTxt: item.label, showDurationDropDown: false })
	}

	handleUnitData = (text, index) => {
		this.setState({ selectedIndex: index })
		// if (text && Validator.isMobileValidate(text)) {
		// 	Dosages = text;
		// 	this.setState({ unitTxt: text, showUnitDropDown: true });
		// } else
		// 	this.setState({ unitTxt: text, showUnitDropDown: false });
		let tempArr = [...fullArrayUnit];
		if (text) {
			var searchResult = _.filter(tempArr, function (item) {
				return item.doasestype.toLowerCase().indexOf(text.toLowerCase()) > -1;
			});
			this.setState({
				UnitDropdownArr: searchResult
			});
		} else {
			this.setState({
				UnitDropdownArr: fullArrayUnit
			});
		}

		this.setState({ unitTxt: text });

	}

	clickOnUnit = (item, index) => {
		this.state.taperedData[index].medicineDosasesTypeGuid=item.medicineDoasesGuId;
		let tempData = this.state.taperedData;
		doasestype = item.doasestype;
		// medicineType = item.doasestype;
		medicineTypeGuid = item.medicineTypeGuid;
		MedicineDoasesGuId = item.medicineDoasesGuId;
		// let str = this.state.unitTxt + ' ' + doasestype;
		// InputTxtLengthUnit = str.length;
		tempData[index].medicineType = item.doasestype
		this.setState({ unitTxt: item.doasestype, showUnitDropDown: false })
	}

	clickOnDosege = (item, index) => {
		this.setState({ dosageSearchTxt: '', CustomInput: !this.state.CustomInput, showStateDosage: true, selectedIndex: index })
	}

	handleFromDaysData = (item, index) => {
		let temp = [{ value: 'days' }, { value: 'weeks' }, { value: 'months' }, { value: 'years' }]
		if (item && Validator.isMobileValidate(item)) {
			temp.forEach((ele) => {
				ele.value = item + ' ' + `${ele.value}`
			})
			this.setState({ fromDaysTxt: item, showFromDayTxtDropDown: true, selectedIndex: index, fromDaysDataArr: temp })
		}

	}

	clickOnFromDays = (item, index) => {
		let tempData = this.state.taperedData;
		tempData[index].startFrom = item.value
		let temp = [{ value: 'days' }, { value: 'weeks' }, { value: 'months' }, { value: 'years' }]
		this.setState({ fromDaysTxt: item.value, showFromDayTxtDropDown: false, fromDaysDataArr: temp })
	}
	handleToDaysData = (item, index) => {
		let temp = [{ value: 'days' }, { value: 'weeks' }, { value: 'months' }, { value: 'years' }]
		if (item && Validator.isMobileValidate(item)) {
			temp.forEach((ele) => {
				ele.value = item + ' ' + `${ele.value}`
			})
			this.setState({ toDaysTxt: item, showToDayTxtDropDown: true, selectedIndex: index, fromDaysDataArr: temp })
		}

	}

	clickOnToDays = (item, index) => {
		const tempData = this.state.taperedData;
		tempData[index].to = item.value
		let temp = [{ value: 'days' }, { value: 'weeks' }, { value: 'months' }, { value: 'years' }]
		this.setState({ toDaysTxt: item.value, showToDayTxtDropDown: false, fromDaysDataArr: temp })
	}

	renderTaperedItem = ({ item, index }) => {
		let medicineName = this.state.taperedData;
		return (
			<View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, borderTopWidth: index !== 0 ? 2 : null, borderColor: index !== 0 ? '#D2D7F3' : null }}>
					<View style={{ justifyContent: 'flex-start', marginTop: responsiveHeight(2), flex: 3.5 }}>
						<Text style={{ color: Color.black, fontSize: CustomFont.font18, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName }}>{medicineName[0].medicineName ? medicineName[0].medicineName.replace("Add new", '') : ''} {medicineName[0].strength ? medicineName[0].strength : ''}{this.state.taperedData.length > 1 ? "Dose " + `${index + 1}` : null}</Text>
						<Text style={{ fontStyle: 'italic', color: Color.datecolor, marginTop: responsiveHeight(1), fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400, }}>{medicineName[0].medicineDesc}</Text>
					</View>
					{
						this.state.taperedData.length > 1 && index !== 0 ? (
							<TouchableOpacity
								style={{ flex: 1 }}
								onPress={() => {
									let tempArr = this.state.taperedData;
									tempArr.splice(index, 1);
									this.setState({ taperedData: tempArr });
								}}>
								<Text
									style={{
										fontSize: CustomFont.font14,
										fontWeight: CustomFont.fontWeight600,
										color: Color.primaryBlue,
										marginBottom: responsiveHeight(4),
										marginRight: responsiveWidth(2),
										marginTop: responsiveHeight(2)
									}}
								>Remove</Text>
							</TouchableOpacity>
						) : null
					}
				</View>
				{/* ------- Unit------- */}
				<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>Units</Text>
				<View >
					<TextInput onBlur={this.callIsBlurUnit} onFocus={() => this.callIsFucusedUnit(index)}
						style={[styles.createInputStyle, { borderColor: this.state.selectedIndex === index ? this.state.InpborderColorUnit : Color.inputdefaultBorder }]} placeholder={'Enter Unit'}
						placeholderTextColor={Color.placeHolderColor}
						defaultValue={item?.medicineType ? item?.medicineType : ''}
						// value={item?.medicineType }
						// maxLength={InputTxtLengthUnit}
						onChangeText={(text) => this.handleUnitData(text, index)}
						ref='search' returnKeyType='done' />
					<Image style={{
						height: responsiveFontSize(1.3),
						width: responsiveFontSize(1.3),
						resizeMode: 'contain',
						position: 'absolute',
						marginTop: responsiveHeight(4),
						right: 15,
						tintColor: Color.fontColor
					}}
						source={this.state.selectedIndex == index && this.state.showUnitDropDown ? upArrow : downarrow} />
				</View>
				{this.state.showUnitDropDown && this.state.UnitDropdownArr?.length > 0 && this.state.selectedIndex == index ?
					<View style={{
						borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
						borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
					}}>
						<FlatList style={{ backgroundColor: '#fafafa' }}
							data={this.state.UnitDropdownArr}
							renderItem={({ item, _index }) => (
								<TouchableOpacity style={{ zIndex: 999, height: responsiveHeight(7), justifyContent: 'flex-start', }} onPress={() => this.clickOnUnit(item, index)}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }} >{item.doasestype}</Text>
								</TouchableOpacity>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View> : null}

				{/* ------- Dosage------- */}

				<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>Dosage </Text>
				<View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<TextInput onBlur={this.callIsBlur2} onFocus={() => this.callIsFucused2(index)} keyboardType={'phone-pad'}
							style={[styles.createInputStyle, { flex: 1, borderColor: this.state.selectedIndex === index ? this.state.InpborderColor2 : Color.inputdefaultBorder }]}
							placeholder="Enter dosages" placeholderTextColor={Color.placeHolderColor}
							defaultValue={item?.dosagePattern ? item?.dosagePattern : ''}
							onChangeText={(dosageSearchTxt) => { this.SearchFilterFunctionDosage(dosageSearchTxt, index); }}
							maxLength={15}
							ref='search' returnKeyType='done' />
					</View>
					<Image style={{
						height: responsiveFontSize(1.3),
						width: responsiveFontSize(1.3),
						resizeMode: 'contain',
						position: 'absolute',
						marginTop: responsiveHeight(4),
						right: 15,
						tintColor: Color.fontColor
					}}
						source={this.state.showStateDosage && this.state.selectedIndex == index ? upArrow : downarrow} />
				</View>

				<View style={{ flex: 1 }}>
					{this.state.selectedIndex === index && this.state.showStateDosage && this.state.dosageDropdownArr && this.state.dosageDropdownArr.length > 0 ?
						<View style={{
							borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
							borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
						}}><FlatList style={{ backgroundColor: '#fafafa' }}
							data={this.state.dosageDropdownArr}
							renderItem={({ item, _index }) => (
								<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
									onPress={() => this.clickOnState(item, index)}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }}>{item.value}</Text>
								</TouchableOpacity>
							)}
							keyExtractor={(item, index) => index.toString()}
							/>
						</View> : null}
				</View>
				{/* ------- When to Take------- */}
				<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>When</Text>
				<DropDownPicker zIndex={10}
					items={this.state.whenToTakeArr}
					containerStyle={{ borderRadius: responsiveWidth(2), height: responsiveHeight(6), marginTop: responsiveHeight(1.6) }}
					style={{ backgroundColor: '#ffffff', color: Color.textGrey }}
					textStyle={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16 }} itemStyle={{
						justifyContent: 'flex-start'
					}}
					dropDownStyle={{ backgroundColor: '#fafafa', zIndex: 4 }}
					onChangeItem={item => {
						medicineTimingFrequency = item.value;
						let temp = [...this.state.taperedData];
						temp[index].medicineTimingFrequency = item.value
					}}
					globalTextStyle={{ color: Color.fontColor, fontSize: CustomFont.font16 }}
					placeholder="Empty Stomach"
					placeholderStyle={{ color: Color.placeHolderColor, fontSize: CustomFont.font16 }}
				/>
				{/* ------------------------------ Frequency ---------------------- */}
				<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>Frequency</Text>
				<View>
					<TextInput onBlur={this.callIsBlurDuration} onFocus={() => this.callIsFucusedDuration(index)}
						style={[styles.createInputStyle, { borderColor: this.state.selectedIndex === index ? this.state.InpborderColorDuration : Color.inputdefaultBorder }]} placeholder={'Enter duration'} placeholderTextColor={Color.placeHolderColor}
						defaultValue={item?.durationType}
						// maxLength={InputTxtLengthDuration}
						onChangeText={(text) => this.handleDurationData(text, index)}
						ref='search' returnKeyType='done' />
					<Image style={{
						height: responsiveFontSize(1.3),
						width: responsiveFontSize(1.3),
						resizeMode: 'contain',
						position: 'absolute',
						marginTop: responsiveHeight(4),
						right: 15,
						tintColor: Color.fontColor
					}}
					source={this.state.showDurationDropDown && this.state.selectedIndex == index ? upArrow : downarrow} />
				</View>

				{this.state.selectedIndex == index && this.state.dutaionTxt && this.state.showDurationDropDown && this.state.DurationDropdownArr?.length > 0 ?
					<View style={{
						borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
						borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
					}}>
						<FlatList style={{ backgroundColor: '#fafafa' }}
							data={this.state.DurationDropdownArr}
							renderItem={({ item, _index }) => (
								<TouchableOpacity style={{ zIndex: 999, height: responsiveHeight(7), justifyContent: 'flex-start', }} onPress={() => this.clickOnDuration(item, index)}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }} >{item.label}</Text>
								</TouchableOpacity>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View> : null}
				{
					this.state.taperedData.length > 1 ?
						<View style={{ flexDirection: 'row', flex: 1 }}>
							<View style={{ flex: 1, }}>
								<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>Start From</Text>
								<TextInput
									onBlur={this.callIsBlurFrom}
									onFocus={() => this.callIsFucusedFrom(index)}
									keyboardType={'phone-pad'}
									style={[styles.createInputStyle, { borderColor: this.state.selectedIndex === index ? this.state.InpborderColorFrom : Color.inputdefaultBorder, marginRight: responsiveWidth(2) }]}
									placeholder={'From Days'}
									placeholderTextColor={Color.placeHolderColor}
									defaultValue={item?.startFrom}
									onChangeText={(text) => this.handleFromDaysData(text, index)}
									ref='search' returnKeyType='done' />
							</View>

							<View style={{ flex: 1, }}>
								<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>To</Text>
								<TextInput
									onBlur={this.callIsBlurTo}
									onFocus={() => this.callIsFucusedTo(index)}
									keyboardType={'phone-pad'}
									style={[styles.createInputStyle, { borderColor: this.state.selectedIndex === index ? this.state.InpborderColorTo : Color.inputdefaultBorder, marginRight: responsiveWidth(2) }]}
									placeholder={'To Days'}
									placeholderTextColor={Color.placeHolderColor}
									defaultValue={item?.to}
									onChangeText={(text) => this.handleToDaysData(text, index)}
									ref='search' returnKeyType='done' />
							</View>
						</View> : null

				}
				<View style={{ flexDirection: 'row', flex: 1 }}>
					{this.state.fromDaysTxt && this.state.showFromDayTxtDropDown && this.state.selectedIndex == index ?
						<View style={{
							borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
							borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8), marginRight: responsiveWidth(2), flex: 1
						}}><FlatList style={{ backgroundColor: '#fafafa' }}
							data={this.state.fromDaysDataArr}
							renderItem={({ item, _index }) => (
								<TouchableOpacity style={{ zIndex: 999, height: responsiveHeight(7), justifyContent: 'flex-start', }} onPress={() => this.clickOnFromDays(item, index)}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }} >{item.value}</Text>
								</TouchableOpacity>
							)}
							keyExtractor={(item, index) => index.toString()}
							/>
						</View> : <View style={{ flex: 1, marginRight: responsiveWidth(2) }}></View>}
					{this.state.toDaysTxt && this.state.showToDayTxtDropDown && this.state.selectedIndex == index ?
						<View style={{
							borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
							borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8), flex: 1, marginRight: responsiveWidth(2)
						}}><FlatList style={{ backgroundColor: '#fafafa' }}
							data={this.state.fromDaysDataArr}
							renderItem={({ item, _index }) => (
								<TouchableOpacity style={{ zIndex: 999, height: responsiveHeight(7), justifyContent: 'flex-start', }} onPress={() => this.clickOnToDays(item, index)}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }} >{item.value}</Text>
								</TouchableOpacity>
							)}
							keyExtractor={(item, index) => index.toString()}
							/>
						</View> : <View style={{ flex: 1, marginRight: responsiveWidth(2) }}></View>}
				</View>

				{/* ------------------- NOTE  ---------------*/}

				<Text style={{ marginTop: responsiveHeight(3), color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName }}>note</Text>
				{/* <TextInput returnKeyType="done" style={{ marginBottom: responsiveHeight(1), borderWidth: 1, borderColor: Color.borderColor, padding: 10, height: responsiveHeight(12), fontSize: CustomFont.font14, borderRadius: 5, textAlignVertical: 'top', color: Color.fontColor, opacity: .8, marginTop: 10 }}
					placeholder="Add comments"
					onFocus={() => this.setState({ showDoctorNotesdropDown: true })}
					placeholderTextColor={Color.placeHolderColor}
					multiline={true}
					defaultValue={item?.note ? item?.noteData : ''}
					onChangeText={noteData => {
						const tempData = this.state.taperedData
						// this.setState({ selectedIndex: index })
						// this.setState({ noteData });
						tempData[index].note = noteData;
						this.setState({ selectedIndex: index })
						if (noteData) {
							let temps = [...doctorNotes];
							let notesData = temps.filter((val) => {
								return val.note.toLocaleLowerCase().includes(noteData.toLocaleLowerCase());
							})
							this.setState({ doctorNotesDataArr: notesData })
						}
						let { signupDetails } = this.props;
						setLogEvent("medicine", { "add_note": "click", UserGuid: signupDetails.UserGuid })
					}} maxLength={100} blurOnSubmit /> */}
				<TextInput returnKeyType="done" style={{ marginBottom: responsiveHeight(1), borderWidth: 1, borderColor: Color.borderColor, padding: 10, height: responsiveHeight(6), fontSize: CustomFont.font14, borderRadius: 5, textAlignVertical: 'top', color: Color.fontColor, opacity: .8, marginTop: 10 }}
					onFocus={() => this.setState({ showDoctorNotesdropDown: true })}
					placeholder="Add comments"
					placeholderTextColor={Color.placeHolderColor}
					multiline={true} value={item.note}
					onChangeText={noteData => {
						const tempData = this.state.taperedData
						tempData[index].note = noteData
						this.setState({ selectedIndex: index })
						if (noteData) {
							let temps = [...doctorNotes];
							let notesData = temps.filter((val) => {
								return val.note.toLocaleLowerCase().includes(noteData.toLocaleLowerCase());
							})
							this.setState({ doctorNotesDataArr: notesData })
						}
						this.setState({ noteData });
						let { signupDetails } = this.props;
						setLogEvent("medicine", { "add_note": "click", UserGuid: signupDetails.UserGuid })
					}} maxLength={100} blurOnSubmit />

				{
					this.state.showDoctorNotesdropDown && doctorNotes?.length > 0 && this.state.selectedIndex === index ? <View style={{
						borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
						borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
					}}><FlatList style={{ backgroundColor: '#fafafa' }}
						data={this.state.doctorNotesDataArr}
						renderItem={({ item, _index }) => (
							<TouchableOpacity key={_index} style={{ zIndex: 999, height: responsiveHeight(7), justifyContent: 'flex-start', }} onPress={() => this.clickOnDoctorNotes(item, index)}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }} >{item.note}</Text>
							</TouchableOpacity>
						)}
						keyExtractor={(item, index) => index.toString()}
						/>
					</View> : null
				}

			</View>
		)
	}


	render() {
		let item = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} onStartShouldSetResponder={() => this.dismissDialog()}>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : null}>
					<View style={{ margin: responsiveWidth(5) }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<TouchableOpacity onPress={() => {
								this.props.navigation.goBack();
								try {
									this.props.navigation.state.params.Refresh({ isEdit: isEdit, data: null });
								} catch (error) {

								}

							}}>
								<Image source={arrow_grey} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5), margin: 7, marginTop: 10 }} />
							</TouchableOpacity>

						</View>
						<FlatList
							style={{ height: responsiveHeight(73) }}
							data={this.state.taperedData}
							renderItem={(item, index) => this.renderTaperedItem(item, index)}
							extraData={this.state}
						/>
						<TouchableOpacity
							onPress={() => {
								let tempArr = this.state.taperedData;
								let tempObj = {};//tempArr[0];
								tempArr.push(tempObj);
								this.setState({ taperedData: tempArr });
							}}>
							<Text
								style={{
									fontSize: CustomFont.font14,
									fontWeight: CustomFont.fontWeight600,
									color: Color.primaryBlue,
									marginBottom: responsiveHeight(4)
								}}
							>+ Add Tapered Dose</Text>
						</TouchableOpacity>

						<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(7), width: '100%', backgroundColor: Color.primary }} onPress={() => {
							if (clickFlag == 0)
								this.saveData();
						}}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center', fontFamily: CustomFont.fontName }}>Add</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
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
)(MedicineDetails);
