import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	View,
	Text, Platform, Image, TouchableOpacity, BackHandler, TextInput, FlatList, SafeAreaView
} from 'react-native';
import arrow_grey from '../../../assets/back_blue.png';
import un_check_medi from '../../../assets/un_check_medi.png';
import checked_medi from '../../../assets/checked_medi.png';
import downarrow from '../../../assets/downarrow.png';
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
let prevIndexTimings = 0, prevIndexDoase = 0, prevIndexDuration = 1, medicineTypeGuid = '', DurationType = 'days', DurationTypeValue = '5', MedicineDoasesGuId = '', doasestype = '', Dosages = '', TimingTypeGuid = '', MedicineTimingShift = [], dosagePattern = '';
let doasagesPatterArr = [{ label: '1-0-0', value: '1-0-0', isSelect: true }, { label: '0-1-0', value: '0-1-0', isSelect: false }, { label: '0-0-1', value: '0-0-1', isSelect: false }, { label: '1-1-0', value: '1-1-0', isSelect: false }, { label: '0-1-1', value: '0-1-1', isSelect: false }, { label: '1-0-1', value: '1-0-1', isSelect: false }, { label: '1-1-1', value: '1-1-1', isSelect: false }, { label: '6 Hourly', value: '6 Hourly', isSelect: false }, { label: 'Alternate Day', value: 'Alternate Day', isSelect: false }, { label: 'Weekly', value: 'Weekly', isSelect: false }, { label: 'Monthly', value: 'Monthly', isSelect: false }, { label: 'SOS', value: 'SOS', isSelect: false }, { label: 'Custom dosage', value: 'Custom dosage', isSelect: false }]
let clickFlag = 0, isEdit = false, prvLength = -1, selectedInputTxtLength = 5;
import Trace from '../../service/Trace'
import _ from 'lodash';
class MedicineDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			doaseValue: '',
			durationValue: '',
			doaseUnit: 'Tablet',
			StrenthArr: [],
			DosageTitleArr: [],
			dosageDefaultTitle: '',
			DosageArr: [{ label: '1/2', value: '1/2', isSelect: false }, { label: '3/4', value: '3/4', isSelect: false }, { label: '1', value: '1', isSelect: true }, { label: '2', value: '2', isSelect: false }],
			TimingTitleArr: [],
			TimingDataArr: [{ label: 'Breakfast', value: 'Breakfast', isSelect: false }, { label: 'Lunch', value: 'Lunch', isSelect: false }, { label: 'Dinner', value: 'Dinner', isSelect: false }],
			DurationTitleArr: [{ label: 'days', value: 'days' }, { label: 'weeks', value: 'weeks' }, { label: 'months', value: 'months' }],
			DurationArr: [{ label: '3', value: '3', isSelect: false }, { label: '5', value: '5', isSelect: true }, { label: '7', value: '7', isSelect: false }, { label: '10', value: '10', isSelect: false }],
			takingTimeIndex: 0,
			selectTimingsIndex: 0,
			noteData: '',
			selectedDurationTitle: 'days',
			defaultTimingTitle: '',
			showStateDosage: false,
			dosageDropdownArr: doasagesPatterArr,
			dosageSearchTxt: '',
			InpborderColor2: Color.inputdefaultBorder,
			CustomInput: false,
			CustomDosesError: false,

		};
		prevIndexTimings = 0;
		prevIndexDoase = 0;
		prevIndexDuration = 1;
		medicineTypeGuid = '';
		DurationType = 'days';
		DurationTypeValue = '5';
		MedicineDoasesGuId = '';
		doasestype = '';
		Dosages = '';
		TimingTypeGuid = '';
		MedicineTimingShift = [];
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
		console.log('item-------' + JSON.stringify(item))
		medicineTypeGuid = item.medicineTypeGuid;
		if (item && item.medicineDosasesType) {
			if (item.medicineDosasesType && item.medicineDosasesType.length > 0) {
				let tempDoaseArr = [];
				for (let i = 0; i < item.medicineDosasesType.length; i++) {
					tempDoaseArr.push({ label: item.medicineDosasesType[i].doasestype, value: item.medicineDosasesType[i].medicineTypeGuid, medicineDoasesGuId: item.medicineDosasesType[i].medicineDoasesGuId })
				}
				medicineTypeGuid = item.medicineDosasesType[0].medicineTypeGuid;
				MedicineDoasesGuId = item.medicineDosasesType[0].medicineDoasesGuId;
				doasestype = item.medicineDosasesType[0].doasestype;
				this.setState({ DosageTitleArr: tempDoaseArr });
				if (doasestype === 'Tablet') {
					let tmpArr = [{ label: '1/2', value: '1/2', isSelect: false }, { label: '3/4', value: '3/4', isSelect: false }, { label: '1', value: '1', isSelect: true }, { label: '2', value: '2', isSelect: false }];
					// for (let i = 2; i < 3; i++) {
					// 	tmpArr.push({ label: i + '', value: i + '', isSelect: false })
					// }
					this.setState({ DosageArr: tmpArr, doaseUnit: doasestype })
					prevIndexDoase = 2;
				} else {
					this.setState({ DosageArr: [{ label: '1', value: '1', isSelect: true }, { label: '2', value: '2', isSelect: false }, { label: '3', value: '3', isSelect: false }, { label: '4', value: '4', isSelect: false }], doaseUnit: doasestype })
				}
			}
			let medTiming = this.props.navigation.state.params.medTiming;
			if (medTiming) {
				let tempTimingArr = [];
				prevIndexTimings = 0;
				for (let i = 0; i < medTiming.length; i++) {
					// if (i == 0)
					// 	tempTimingArr.push({ label: medTiming[i].medicineTiming, value: medTiming[i].medicineTimingGuId, isSelect: true })
					// else
					if (medTiming[i].medicineTimingGuId == item.timingTypeGuid)
						prevIndexTimings = i;
					tempTimingArr.push({ label: medTiming[i].medicineTiming, value: medTiming[i].medicineTimingGuId, isSelect: medTiming[i].medicineTimingGuId == item.timingTypeGuid })
				}
				TimingTypeGuid = medTiming[0].medicineTimingGuId
				if (item.timingTypeGuid) {
					TimingTypeGuid = item.timingTypeGuid;
				} else {
					tempTimingArr[0].isSelect = true;
				}
				this.setState({ TimingTitleArr: tempTimingArr, defaultTimingTitle: TimingTypeGuid });

			}
			//prefilled
			setTimeout(() => {
				try {
					let index = this.state.DosageArr.findIndex(x => x.value == item.dosages);
					if (index > -1) {
						this.state.DosageArr[prevIndexDoase].isSelect = false;
						prevIndexDoase = index;
						this.state.DosageArr[index].isSelect = true;
						this.setState({ DosageArr: this.state.DosageArr })
					} else {
						if (item.dosages && item.dosages != 0)
							this.state.DosageArr[prevIndexDoase].isSelect = false;
						this.setState({ doaseValue: item.dosages ? item.dosages : '', DosageArr: this.state.DosageArr })
					}

					Dosages = item.dosages ? item.dosages : 1;
					DurationType = item.durationType ? item.durationType : 'days';
					this.setState({ noteData: item.note ? item.note : '', selectedDurationTitle: item.durationType ? item.durationType : 'days' })

					let indexDuratuion = this.state.DurationArr.findIndex(x => x.value == item.durationValue);
					if (indexDuratuion > -1) {
						this.state.DurationArr[prevIndexDuration].isSelect = false;
						prevIndexDuration = indexDuratuion;
						this.state.DurationArr[indexDuratuion].isSelect = true;
						this.setState({ DurationArr: this.state.DurationArr })
					} else {
						if (item.durationValue && item.durationValue != 0)
							this.state.DurationArr[prevIndexDuration].isSelect = false;
						this.setState({ durationValue: item.durationValue ? item.durationValue + '' : '', DurationArr: this.state.DurationArr })
					}
					if (item.durationValue)
						DurationTypeValue = item.durationValue;
					let timings = item.medicineTimingFrequency;
					this.setState({ takingTimeIndex: timings == "Empty Stomach" ? 0 : timings == "Before Food" ? 1 : timings == "After Food" ? 2 : timings == "No Preference" ? 3 : 0 });

					this.setState({ defaultTimingTitle: TimingTypeGuid })
					//let mediShiftArr = item.medicineTimingShift;
					// if (mediShiftArr && mediShiftArr.length > 0) {
					// 	let name = this.state.TimingTitleArr.find(option => option.value === TimingTypeGuid).label;
					// 	let tmp = [];
					// 	if (name == 'Meals') {
					// 		tmp = [{ label: 'Breakfast', value: 'Breakfast', isSelect: false }, { label: 'Lunch', value: 'Lunch', isSelect: false }, { label: 'Dinner', value: 'Dinner', isSelect: false }];
					// 	} else if (name == 'Frequency') {
					// 		tmp = [{ label: '3 hourly', value: '3hourly', isSelect: false }, { label: '4 hourly', value: '4hourly', isSelect: false }, { label: '6 hourly', value: '6hourly', isSelect: false }, { label: '8 hourly', value: '8hourly', isSelect: false }, { label: '12 hourly', value: '12hourly', isSelect: false }];
					// 	} else if (name == 'Time Of Day') {
					// 		tmp = [{ label: 'Morning', value: 'Morning', isSelect: false }, { label: 'Afternoon', value: 'Afternoon', isSelect: false }, { label: 'Evening', value: 'Evening', isSelect: false }, { label: 'Night', value: 'Night', isSelect: false }];
					// 	}
					// 	let str = [];
					// 	let routeStr = '';
					// 	for (let i = 0; i < tmp.length; i++) {
					// 		if (mediShiftArr.some(person => person.medicineTimingShift === tmp[i].label)) {
					// 			tmp[i].isSelect = true;
					// 			str.push({ "MedicineTimingShift": tmp[i].label })
					// 			routeStr += '1-'
					// 		} else {
					// 			routeStr += '0-'
					// 		}
					// 	}
					// 	MedicineTimingShift = str;
					// 	dosagePattern = routeStr.replace(/-\s*$/, "")
					// 	this.setState({ TimingDataArr: tmp });

					// }
					if (item.dosagePattern) {
						dosagePattern = item.dosagePattern;
						selectedInputTxtLength = dosagePattern.length;
						if(dosagePattern && dosagePattern.indexOf('.')){
							this.setState({ CustomInput: true })
						}
						this.setState({ dosageSearchTxt: dosagePattern })
					}


				} catch (e) { }

				try {
					this.setState({ dosageDefaultTitle: medicineTypeGuid });
				} catch (error) {

				}
			}, 1000)

		}
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			// alert(JSON.stringify(newProps.responseData));
			let tagname = newProps.responseData.tag;
			if (tagname === 'saveMedicine') {
				clickFlag = 0;
				if (newProps.responseData.statusCode == '0') {
					isEdit = true;
					Snackbar.show({ text: 'Medicine added successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					setTimeout(() => {
						const { navigation } = this.props;
						navigation.goBack();
						navigation.state.params.Refresh(isEdit);
					}, 800);
				} else {
					Snackbar.show({ text: 'Medicine not added', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			}
		}
	}
	saveData = () => {
		clickFlag = 1;
		// if (!Dosages) {
		// 	Snackbar.show({ text: 'Please select unit', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 	clickFlag = 0;
		// } else if (!Validator.isDecimal(Dosages)) {
		// 	clickFlag = 0;
		// 	Snackbar.show({ text: 'Unit value only contain number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });

		// } else if (!doasestype) {
		// 	Snackbar.show({ text: 'Please select unit type', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 	clickFlag = 0;
		// }
		// else if (!dosagePattern) {
		// 	clickFlag = 0;
		// 	Snackbar.show({ text: 'Please select dosages pattern', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// }
		// else if (this.state.takingTimeIndex == -1) {
		// 	clickFlag = 0;
		// 	Snackbar.show({ text: 'Please select timings', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// } else if (!DurationType) {
		// 	clickFlag = 0;
		// 	Snackbar.show({ text: 'Please select duration type', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// } else if (!DurationTypeValue) {
		// 	clickFlag = 0;
		// 	Snackbar.show({ text: 'Please select duration', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// } else if (!Validator.isMobileValidate(DurationTypeValue)) {
		// 	clickFlag = 0;
		// 	Snackbar.show({ text: 'Duration value only contain number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });

		// } else {
		let { signupDetails } = this.props;
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'Medicine_Add', signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Medicine_Add", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
		let item = this.props.navigation.state.params.item;
		let data = {
			appointmentGuid: signupDetails.appoinmentGuid,
			medicineGuid: item.medicineGuid,
			medicineName: item.medicineName + ' ' + item.strength , //+ ' ' + item.medicineDesc
			medicineDesc: item.medicineDesc,
			strength: item.strength,
			medicineTypeGuid: medicineTypeGuid,
			durationType: DurationType,
			durationValue: DurationTypeValue,
			yellowFlag: true,
			timingTypeGuid: TimingTypeGuid,
			medicineTimingShift: null,
			medicineTimingFrequency: this.state.takingTimeIndex == 0 ? "Empty Stomach" : this.state.takingTimeIndex == 1 ? "Before Food" : this.state.takingTimeIndex == 2 ? 'After Food' : 'No Preference',
			dosages: Dosages,
			dosagePattern: dosagePattern,
			note: this.state.noteData,
			patientAppointmentMedicineGuId: item.patientAppointmentMedicineGuId,
			medicineDosasesType: [{ medicineDoasesGuId: MedicineDoasesGuId, doasestype: doasestype }] //"medicineTypeGuid":medicineTypeGuid
		}
		// let params = {
		// 	"userGuid": signupDetails.UserGuid,
		// 	"DoctorGuid": signupDetails.doctorGuid,
		// 	"ClinicGuid": signupDetails.clinicGuid,
		// 	"Version": "",
		// 	"Data": data
		// }
		isEdit = true;
		const { navigation } = this.props;
		navigation.goBack();
		navigation.state.params.Refresh({ isEdit: isEdit, data: data });
		//actions.callLogin('V1/FuncForDrAppToAddUpdateMedicine', 'post', params, signupDetails.accessToken, 'saveMedicine');
		setLogEvent("patient_consultation", { "save_medicine": "click", UserGuid: signupDetails.UserGuid })
		//}

	}

	callIsFucused2 = () => {
		this.setState({ InpborderColor2: Color.primary });
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

	SearchFilterFunctionDosage = (text) => {

		if (text && text.length > 0) {
			if (text.indexOf('.') > -1) {
				Snackbar.show({ text: 'Please select custom dosage from list ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}
			let txtWithOutHifen = ''
			if (text.indexOf('-') > -1) {
				try {
					txtWithOutHifen = text.replaceAll('-', '');
				} catch (error) {
					txtWithOutHifen=text;
				}
			}else{
				txtWithOutHifen = text;
			}

			if (Validator.isMobileValidate(txtWithOutHifen)) {
				if (prvLength > text.length) {
					this.setState({ dosageSearchTxt: text });
				} else {
					let str = txtWithOutHifen;
					if (str.length > 1) {
						try {
							var parts = str.split("");
							text = parts.join("-");
						} catch (error) {

						}

					}
					this.setState({ dosageSearchTxt: text });
				}
			}
			//  else {
			// 	this.setState({ dosageSearchTxt: text });
			// }
			var searchResult = _.filter(doasagesPatterArr, function (item) {
				return item.label.indexOf(text) > -1;
			});
			this.setState({ dosageDropdownArr: searchResult, showStateDosage: true });

			dosagePattern = text;
			prvLength = text.length;
		} else
			this.setState({ dosageSearchTxt: '', dosageDropdownArr: doasagesPatterArr });
	}
	DoseValidation = (text) => {
		console.log(this.state.showStateDosage + '----------custom' + this.state.CustomInput)
		if (text) {
			if (Validator.isDoseValidate(text)) {
				this.setState({ dosageSearchTxt: text })
				dosagePattern = text;
			}
		} else {
			this.setState({ dosageSearchTxt: '' });
		}
	}
	clickOnState = (item) => {
		if (item.value === 'Custom dosage') {
			dosagePattern = null;
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
			selectedInputTxtLength = dosagePattern.length;
			this.setState({ dosageSearchTxt: item.label, showStateDosage: false, CustomInput: false })
		}
	}



	render() {
		//let { actions, signupDetails } = this.props;
		let item = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} onStartShouldSetResponder={() => this.dismissDialog()}>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null}>
					<ScrollView keyboardShouldPersistTaps='always'>
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

							<View style={{ justifyContent: 'flex-start', marginTop: responsiveHeight(2) }}>
								<Text style={{ color: Color.black, fontSize: CustomFont.font18, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName }}>{item.medicineName ? item.medicineName.replace("Add new", '') : ''} {item.strength ? item.strength : ''}</Text>
								<Text style={{fontStyle: 'italic', color: Color.datecolor, marginTop: responsiveHeight(1), fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400,}}>{item.medicineDesc}</Text>
							</View>
							<View style={Platform.OS == 'android' ? styles.durationAndroid : styles.durationIos}>
								<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, marginTop: 5, fontFamily: CustomFont.fontName }}>Units</Text>

								{this.state.DosageTitleArr && this.state.DosageTitleArr.length > 0 ? <DropDownPicker
									items={this.state.DosageTitleArr}
									defaultValue={(this.state.dosageDefaultTitle)}
									containerStyle={{ height: responsiveHeight(7), width: responsiveWidth(30), marginLeft: responsiveWidth(8), borderColor: '#FFF' }}
									style={{ backgroundColor: '#FFF', borderColor: '#FFF' }}
									itemStyle={{
										justifyContent: 'flex-start'
									}}
									globalTextStyle={{ color: Color.fontColor }}
									dropDownStyle={{ backgroundColor: '#FFF', zIndex: 4 }}
									onChangeItem={item => {
										let { signupDetails } = this.props;
										setLogEvent("medicine", { "select_unit": "click", UserGuid: signupDetails.UserGuid })
										medicineTypeGuid = item.value;
										MedicineDoasesGuId = item.medicineDoasesGuId;
										doasestype = item.label;
										if (item.label === 'Tablet') {
											prevIndexDoase = 2;
											Dosages = 1;
											this.setState({ DosageArr: [{ label: '1/2', value: '1/2', isSelect: false }, { label: '3/4', value: '3/4', isSelect: false }, { label: '1', value: '1', isSelect: true }, { label: '2', value: '2', isSelect: false }, { label: '3', value: '3', isSelect: false }, { label: '4', value: '4', isSelect: false }], doaseUnit: item.label })
										} else {
											prevIndexDoase = 0;
											Dosages = 1;
											this.setState({ DosageArr: [{ label: '1', value: '1', isSelect: true }, { label: '2', value: '2', isSelect: false }, { label: '3', value: '3', isSelect: false }, { label: '4', value: '4', isSelect: false }], doaseUnit: item.label })
										}

									}}
									placeholder="Select"
									placeholderTextColor={Color.placeHolderColor}
									labelStyle={{
										color: Color.primary, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName
									}}
								/> : null
								}

							</View>

							<View style={{ flexDirection: 'row' }}>
								<ScrollView horizontal={true}>
									<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', }}>
										{this.state.DosageArr.map((item, index) => {
											return (
												<TouchableOpacity style={item.isSelect ? styles.doaseViewSelect : styles.doaseView}
													onPress={() => {

														this.state.DosageArr[prevIndexDoase].isSelect = false;
														item.isSelect = !item.isSelect;
														this.setState({ DosageArr: this.state.DosageArr, doaseValue: '' })
														prevIndexDoase = index;
														Dosages = item.value;
													}}>
													<Text style={{ color: item.isSelect ? Color.optiontext : Color.optiontext, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400 }}>{item.label}</Text>
												</TouchableOpacity>
											);
										}, this)}
										<TextInput returnKeyType="done" style={{ width: responsiveWidth(22), borderWidth: 1, borderRadius: 6, borderColor: Color.createInputBorder, height: responsiveHeight(5), color: Color.fontColor, fontSize: CustomFont.font12, justifyContent: 'center', alignItems: 'center', marginRight: 10, paddingLeft: 12, paddingRight: 10, paddingTop: 0, paddingBottom: 0 }}
											placeholder="Enter Unit" value={this.state.doaseValue != 'null' ? this.state.doaseValue : ''} onChangeText={doaseValue => {
												if (doaseValue) {
													if (Validator.isDecimal(doaseValue)) {
														Dosages = doaseValue;
														this.setState({ doaseValue });
														this.state.DosageArr[prevIndexDoase].isSelect = false;
														this.setState({ DosageArr: this.state.DosageArr })
													}
												} else {
													this.setState({ doaseValue });
												}




											}} maxLength={3} keyboardType={'phone-pad'} placeholderTextColor={Color.placeHolderColor} />
									</View>
								</ScrollView>
							</View>
							<View style={{ backgroundColor: '#DDD0F6', height: 1, width: '100%', marginTop: responsiveHeight(3), marginBottom: responsiveHeight(3), paddingHorizontal: 10 }} />
							<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, }}>Dosage </Text>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TextInput onBlur={this.callIsBlur2} onFocus={this.callIsFucused2} keyboardType={'phone-pad'} style={[styles.createInputStyle, { flex: 1, borderColor: this.state.InpborderColor2 }]} placeholder="Enter dosages" placeholderTextColor={Color.placeHolderColor} value={this.state.dosageSearchTxt} onChangeText={(dosageSearchTxt) => { return this.state.CustomInput ? this.DoseValidation(dosageSearchTxt) : this.SearchFilterFunctionDosage(dosageSearchTxt); }} maxLength={this.state.CustomInput ? 14 : selectedInputTxtLength} ref='search' returnKeyType='done'/>
								{this.state.CustomInput ? <TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(15), justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: this.state.InpborderColor2, marginTop: responsiveHeight(1.8), borderRadius: 6 }} onPress={() => this.setState({ dosageSearchTxt: '', CustomInput: !this.state.CustomInput, showStateDosage: true })}>
									<Image source={downarrow} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), resizeMode: 'contain' }} />
								</TouchableOpacity> : null}

							</View>

							{this.state.CustomDosesError ? <Text style={{ color: 'red', marginTop: 10 }}>Only number, dot and hyphen allowed</Text> : null}
							<View style={{ flex: 1 }}>
								{this.state.showStateDosage && this.state.dosageDropdownArr && this.state.dosageDropdownArr.length > 0 ?
									<View style={{
										borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
										borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
									}}><FlatList style={{ backgroundColor: '#fafafa' }}
										data={this.state.dosageDropdownArr}
										renderItem={({ item, index }) => (
											<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
												onPress={() => this.clickOnState(item)}>
												<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }}>{item.value}</Text>
											</TouchableOpacity>
										)}
										keyExtractor={(item, index) => index.toString()}
										/>
									</View> : null}
							</View>

							{/* <DropDownPicker zIndex={999}
								items={doasagesPatterArr}
								defaultValue={dosagePattern}
								containerStyle={{ height: responsiveHeight(7), marginTop: responsiveHeight(2) }}
								style={{ backgroundColor: '#FFF' }}
								itemStyle={{
									justifyContent: 'flex-start'
								}}
								dropDownStyle={{ backgroundColor: '#FFF', zIndex: 4, minHeight: responsiveHeight(43) }}
								onChangeItem={item => {
									dosagePattern = item.value;

								}}
								globalTextStyle={{color:Color.fontColor}}
								placeholder="1-0-0"
								placeholderTextColor={Color.placeHolderColor}
								labelStyle={{
									color: Color.primary, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName
								}}
							/> */}
							<View style={{ backgroundColor: '#DDD0F6', height: 1, width: '100%', marginTop: responsiveHeight(3), marginBottom: responsiveHeight(3), paddingHorizontal: 10 }} />

							<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, }}>Timings </Text>
							<View style={{ marginTop: responsiveHeight(1.6) }}>
								<TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', marginRight: 20, height: responsiveHeight(5) }} onPress={() => this.setState({ takingTimeIndex: 0 })}>
									<Image source={this.state.takingTimeIndex == 0 ? checked_medi : un_check_medi} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
									<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(1.8) }}>Empty Stomach</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', marginRight: 20, height: responsiveHeight(5) }} onPress={() => this.setState({ takingTimeIndex: 1 })}>
									<Image source={this.state.takingTimeIndex == 1 ? checked_medi : un_check_medi} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
									<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(1.8) }}>Before Food</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', marginRight: 20, height: responsiveHeight(5) }} onPress={() => this.setState({ takingTimeIndex: 2 })}>
									<Image source={this.state.takingTimeIndex == 2 ? checked_medi : un_check_medi} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
									<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(1.8) }}>After Food</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', marginRight: 20, height: responsiveHeight(5) }} onPress={() => this.setState({ takingTimeIndex: 3 })}>
									<Image source={this.state.takingTimeIndex == 3 ? checked_medi : un_check_medi} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
									<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(1.8) }}>No Preference</Text>
								</TouchableOpacity>
							</View>

							<View style={{ backgroundColor: '#DDD0F6', height: 1, width: '100%', marginTop: responsiveHeight(3), paddingHorizontal: 10 }} />

							<View style={Platform.OS == 'android' ? styles.durationAndroid : styles.durationIos}>
								<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName }}>Duration</Text>
								<DropDownPicker zIndex={99}
									items={this.state.DurationTitleArr}
									defaultValue={this.state.selectedDurationTitle}
									containerStyle={{ height: responsiveHeight(7), width: responsiveWidth(29), marginRight: 10, marginLeft: responsiveWidth(8) }}
									style={{ backgroundColor: '#FFF', borderColor: '#FFF' }}
									itemStyle={{
										justifyContent: 'flex-start'
									}}
									dropDownStyle={{ backgroundColor: '#FFF', zIndex: 4 }}
									onChangeItem={item => {
										DurationType = item.value;
										let { signupDetails } = this.props;
										setLogEvent("medicine", { "select_duration": "click", UserGuid: signupDetails.UserGuid })
									}}
									globalTextStyle={{ color: Color.fontColor }}
									placeholder="days"
									placeholderTextColor={Color.placeHolderColor}
									labelStyle={{
										color: Color.primary, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName
									}}
								/>
							</View>

							<View style={{ flexDirection: 'row', }}>
								<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
									<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', }}>
										{this.state.DurationArr.map((item, index) => {
											return (
												<TouchableOpacity style={item.isSelect ? styles.doaseViewSelect : styles.doaseView}
													onPress={() => {
														this.state.DurationArr[prevIndexDuration].isSelect = false;
														item.isSelect = !item.isSelect;
														this.setState({ DurationArr: this.state.DurationArr, durationValue: '' })
														prevIndexDuration = index;
														DurationTypeValue = item.value;
													}}>
													<Text style={{ color: Color.optiontext, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400 }}>{item.label}</Text>
												</TouchableOpacity>
											);
										}, this)}
										<TextInput returnKeyType="done" style={{ width: responsiveWidth(22), borderWidth: 1, borderRadius: 6, borderColor: Color.createInputBorder, height: responsiveHeight(5), color: Color.fontColor, fontSize: CustomFont.font12, justifyContent: 'center', alignItems: 'center', marginRight: 10, paddingLeft: 12, paddingRight: 10, paddingTop: 0, paddingBottom: 0 }}
											placeholder="Duration" value={this.state.durationValue ? this.state.durationValue : ''} onChangeText={durationValue => {
												if (durationValue) {
													if (Validator.isDecimal(durationValue)) {
														DurationTypeValue = durationValue;
														this.setState({ durationValue });
														this.state.DurationArr[prevIndexDuration].isSelect = false;
														this.setState({ DurationArr: this.state.DurationArr })
													}
												} else {
													this.setState({ durationValue });
												}



											}} maxLength={3} keyboardType={'phone-pad'}
											placeholderTextColor={Color.placeHolderColor} />
									</View>
								</ScrollView>
							</View>

							<Text style={{ marginTop: responsiveHeight(3), color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName }}>Note</Text>
							<TextInput returnKeyType="done" style={{ marginBottom: responsiveHeight(3), borderWidth: 1, borderColor: Color.borderColor, padding: 10, height: responsiveHeight(12), fontSize: CustomFont.font14, borderRadius: 5, textAlignVertical: 'top', color: Color.fontColor, opacity: .8, marginTop: 10 }}
								placeholder="Add comments"
								placeholderTextColor={Color.placeHolderColor}
								multiline={true} value={this.state.noteData}
								onChangeText={noteData => {
									this.setState({ noteData });
									let { signupDetails } = this.props;
									setLogEvent("medicine", { "add_note": "click", UserGuid: signupDetails.UserGuid })
								}} maxLength={100} blurOnSubmit />



							<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(7), width: '100%', backgroundColor: Color.primary }} onPress={() => {
								if (clickFlag == 0)
									this.saveData();
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center', fontFamily: CustomFont.fontName }}>Add</Text>
							</TouchableOpacity>
						</View>

					</ScrollView>
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
