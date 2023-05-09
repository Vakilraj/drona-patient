import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	View,
	Text, Platform, Image, TouchableOpacity, BackHandler, TextInput, FlatList, SafeAreaView
} from 'react-native';
import arrow_grey from '../../../assets/back_blue.png';
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
let prevIndexTimings = 0, prevIndexDoase = 0, prevIndexDuration = 1, medicineType = '', medicineTypeGuid = '', DurationType = '', DurationTypeValue = '5', MedicineDoasesGuId = '', doasestype = '', Dosages = '', TimingTypeGuid = '', dosagePattern = '';
let doasagesPatterArr = [{ label: '1-0-0', value: '1-0-0', isSelect: true }, { label: '0-1-0', value: '0-1-0', isSelect: false }, { label: '0-0-1', value: '0-0-1', isSelect: false }, { label: '1-1-0', value: '1-1-0', isSelect: false }, { label: '0-1-1', value: '0-1-1', isSelect: false }, { label: '1-0-1', value: '1-0-1', isSelect: false }, { label: '1-1-1', value: '1-1-1', isSelect: false }, { label: '6 Hourly', value: '6 Hourly', isSelect: false }, { label: 'Alternate Day', value: 'Alternate Day', isSelect: false }, { label: 'Weekly', value: 'Weekly', isSelect: false }, { label: 'Monthly', value: 'Monthly', isSelect: false }, { label: 'SOS', value: 'SOS', isSelect: false }]
let clickFlag = 0, isEdit = false, prvLength = -1, InputTxtLengthDosage = 5, InputTxtLengthDuration = 5, InputTxtLengthUnit = 5;
import Trace from '../../service/Trace'
import _ from 'lodash';
let medicineTimingFrequency = '',fullArrayUnit=[];
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
	{label: 'Daily', value:'Daily'},
	{label: 'Alternate Day', value:'Alternate Day'},
	{label: 'Fort Night', value:'Fort Night'},
	{label: 'Hourly', value:'Hourly'},
	{label: 'Monthly', value:'Monthly'},
	{label: 'SOS', value:'SOS'},
	{label: 'Weekly', value:'Weekly'},
]
class MedicineDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			noteData: '',
			showStateDosage: false,
			dosageDropdownArr: doasagesPatterArr,
			dosageSearchTxt: '',
			InpborderColor2: Color.inputdefaultBorder,
			InpborderColorDuration: Color.inputdefaultBorder,
			InpborderColorUnit: Color.inputdefaultBorder,
			CustomInput: false,
			whenToTakeArr: whenToTakeData,
			showDurationDropDown: false,
			showUnitDropDown: false,
			dutaionTxt: '',
			unitTxt: '',
			DurationDropdownArr: durationData,
			UnitDropdownArr: props.navigation.state.params.item.medicineDosasesType,



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
		dosagePattern = '';
		isEdit = false;
		medicineTimingFrequency = 'Empty Stomach';
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
		console.log('item----111---' + JSON.stringify(item))
		medicineTypeGuid = item.medicineTypeGuid;
		medicineType = item.medicineType;

		if (item.medicineDosasesType && item.medicineDosasesType.length > 0) {
			medicineTypeGuid = item.medicineDosasesType[0].medicineTypeGuid;
			MedicineDoasesGuId = item.medicineDosasesType[0].medicineDoasesGuId;
			doasestype = item.medicineDosasesType[0].doasestype;
			fullArrayUnit=item.medicineDosasesType;
			console.log('----'+JSON.stringify(fullArrayUnit))
		}
		//prefilled
		setTimeout(() => {
			try {

				Dosages = item.dosages ? item.dosages : 1;
				DurationType = item.durationType ? item.durationType : '';
				if (item.durationValue)
					DurationTypeValue = item.durationValue;
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
				let durationRefileedTxt = DurationType;
				InputTxtLengthDuration = durationRefileedTxt.length;

				// let unitRefileedTxt = Dosages + ' ' + doasestype;
				// InputTxtLengthUnit = unitRefileedTxt.length;

				this.setState({ dutaionTxt: durationRefileedTxt, unitTxt: this.state.UnitDropdownArr[0].doasestype})

			} catch (e) { }


		}, 1000)
	}

	saveData = () => {
		clickFlag = 1;
		let { signupDetails } = this.props;
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Medicine_Add', signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Medicine_Add", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
		let item = this.props.navigation.state.params.item;
		let data = {
			appointmentGuid: signupDetails.appoinmentGuid,
			medicineGuid: item.medicineGuid,
			medicineName: item.medicineName + ' ' + item.strength, //+ ' ' + item.medicineDesc
			medicineDesc: item.medicineDesc,
			strength: item.strength,
			medicineTypeGuid: medicineTypeGuid,
			medicineType: medicineType,
			durationType: DurationType,
			// durationValue: DurationTypeValue,
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
		console.log('-----data---' + JSON.stringify(data));
		isEdit = true;
		const { navigation } = this.props;
		navigation.goBack();
		navigation.state.params.Refresh({ isEdit: isEdit, data: data });
		setLogEvent("patient_consultation", { "save_medicine": "click", UserGuid: signupDetails.UserGuid })

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
	callIsFucusedDuration = () => {
		this.setState({ InpborderColorDuration: Color.primary, showDurationDropDown: true })
	}
	callIsBlurDuration = () => {
		this.setState({ InpborderColorDuration: Color.inputdefaultBorder});
	}

	callIsFucusedUnit = () => {
		this.setState({ InpborderColorUnit: Color.primary })
	}
	callIsBlurUnit = () => {
		this.setState({ InpborderColorUnit: Color.inputdefaultBorder, });
	}

	SearchFilterFunctionDosage = (text) => {
		// if (text && text.length > 0) {
		// 	if (text.indexOf('.') > -1) {
		// 		Snackbar.show({ text: 'Please select custom dosage from list ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 	}
		// 	let txtWithOutHifen = ''
		// 	if (text.indexOf('-') > -1) {
		// 		try {
		// 			txtWithOutHifen = text.replaceAll('-', '');
		// 		} catch (error) {
		// 			txtWithOutHifen = text;
		// 		}
		// 	} else {
		// 		txtWithOutHifen = text;
		// 	}

		// 	if (Validator.isMobileValidate(txtWithOutHifen)) {
		// 		if (prvLength > text.length) {
		// 			this.setState({ dosageSearchTxt: text });
		// 		} else {
		// 			let str = txtWithOutHifen;
		// 			if (str.length > 1) {
		// 				try {
		// 					var parts = str.split("");
		// 					text = parts.join("-");
		// 				} catch (error) {

		// 				}

		// 			}
		// 			this.setState({ dosageSearchTxt: text });
		// 		}
		// 	}
		// 	var searchResult = _.filter(doasagesPatterArr, function (item) {
		// 		return item.label.indexOf(text) > -1;
		// 	});
		// 	this.setState({ dosageDropdownArr: searchResult, showStateDosage: true });

		// 	dosagePattern = text;
		// 	prvLength = text.length;
		// } else
		// 	this.setState({ dosageSearchTxt: '', dosageDropdownArr: doasagesPatterArr });
		if (text && text.length > 0) {
		if (Validator.isNumberHyphanDotSlashValidate(text)) {
			this.setState({ dosageSearchTxt: text });
		}
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
			InputTxtLengthDosage = dosagePattern.length;
			this.setState({ dosageSearchTxt: item.label, showStateDosage: false, CustomInput: false })
		}
	}

	handleDurationData = (text) => {
		// let duationTypeArr = [{ label: 'day' }, { label: 'week' }, { label: 'month' }, { label: 'year' },];
		// if (text && VaduationTypeArrlidator.isMobileValidate(text)) {
		// 	for (let i = 0; i < duationTypeArr.length; i++) {
		// 		if (text == 1)
		// 			duationTypeArr[i].label = text + ' ' + duationTypeArr[i].label;
		// 		else
		// 			duationTypeArr[i].label = text + ' ' + duationTypeArr[i].label + 's';
		// 	}
		// 	this.setState({ DurationDropdownArr: duationTypeArr, showDurationDropDown: true })
		// }
		// this.setState({ dutaionTxt: text });
		let ans = [];
		if(text){
			ans = durationData.filter((val) => val.label.toLowerCase().includes(text.toLowerCase()))
		}
		this.setState({dutaionTxt: text, DurationDropdownArr: text.length === 0 ? durationData :ans, showDurationDropDown: true })
	}

	clickOnDuration = (item) => {
		// if (item.label) {
		// 	let str = item.label.split(' ');
		// 	DurationType = str[1];
		// 	DurationTypeValue = str[0];
		// 	InputTxtLengthDuration = item.label.length;
		// }

		DurationType = item.label;
		this.setState({ dutaionTxt: item.label, showDurationDropDown: false })
	}

	handleUnitData = (text) => {
		if(text){
			var searchResult = _.filter(fullArrayUnit, function (item) {
				return item.doasestype.toLowerCase().indexOf(text.toLowerCase()) > -1;
			});
			this.setState({
				UnitDropdownArr: searchResult
			});
		}else{
			this.setState({
				UnitDropdownArr: fullArrayUnit
			});
		}
		
		this.setState({ unitTxt: text, showUnitDropDown: true });
		// if (text && Validator.isMobileValidate(text)) {
		// 	Dosages = text;
		// 	this.setState({ unitTxt: text, showUnitDropDown: true });
		// } else
		// 	this.setState({ unitTxt: text, showUnitDropDown: false });

	}

	clickOnUnit = (item) => {
		doasestype = item.doasestype;
		medicineType = item.doasestype;
		medicineTypeGuid = item.medicineTypeGuid;
		MedicineDoasesGuId = item.medicineDoasesGuId;
		// let str = this.state.unitTxt + ' ' + doasestype;
		// InputTxtLengthUnit = str.length;
		this.setState({ unitTxt: item.doasestype, showUnitDropDown: false })
	}

	render() {
		let item = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white, marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} onStartShouldSetResponder={() => this.dismissDialog()}>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : null}>
					<ScrollView>
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
								<Text style={{ fontStyle: 'italic', color: Color.datecolor, marginTop: responsiveHeight(1), fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400, }}>{item.medicineDesc}</Text>
							</View>
							{/* ------- Unit------- */}
							<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>Units</Text>
							<TextInput onBlur={this.callIsBlurUnit} onFocus={this.callIsFucusedUnit}  style={[styles.createInputStyle, { borderColor: this.state.InpborderColorUnit }]} placeholder={'Enter Unit'} placeholderTextColor={Color.placeHolderColor} value={this.state.unitTxt}
							//  maxLength={InputTxtLengthUnit}
								onChangeText={(text) => this.handleUnitData(text)} ref='search' returnKeyType='done' />

							{this.state.showUnitDropDown && this.state.UnitDropdownArr && this.state.UnitDropdownArr.length>0?
								<View style={{
									borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
									borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
								}}><FlatList style={{ backgroundColor: '#fafafa' }}
									data={this.state.UnitDropdownArr}
									renderItem={({ item, index }) => (
										<TouchableOpacity style={{ zIndex: 999, height: responsiveHeight(7), justifyContent: 'flex-start', }} onPress={() => this.clickOnUnit(item)}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }} >{item.doasestype}</Text>
										</TouchableOpacity>
									)}
									keyExtractor={(item, index) => index.toString()}
									/>
								</View> : null}

							{/* ------- Dosage------- */}

							<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>Dosage </Text>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<TextInput onBlur={this.callIsBlur2} onFocus={this.callIsFucused2} keyboardType={'phone-pad'} style={[styles.createInputStyle, { flex: 1, borderColor: this.state.InpborderColor2 }]} placeholder="Enter dosages" placeholderTextColor={Color.placeHolderColor} value={this.state.dosageSearchTxt} onChangeText={(dosageSearchTxt) => { this.SearchFilterFunctionDosage(dosageSearchTxt) }} maxLength={15} ref='search' returnKeyType='done' />
								{/* {this.state.CustomInput ? <TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(15), justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: this.state.InpborderColor2, marginTop: responsiveHeight(1.8), borderRadius: 6 }} onPress={() => this.setState({ dosageSearchTxt: '', CustomInput: !this.state.CustomInput, showStateDosage: true })}>
									<Image source={downarrow} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), resizeMode: 'contain' }} />
								</TouchableOpacity> : null} */}

							</View>

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
							{/* ------- When to Take------- */}
							<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>When </Text>
							<DropDownPicker zIndex={10}
								items={this.state.whenToTakeArr}
								containerStyle={{ borderRadius: responsiveWidth(2), height: responsiveHeight(6), marginTop: responsiveHeight(1.6) }}
								style={{ backgroundColor: '#ffffff', color: Color.textGrey }}
								textStyle={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16}}								itemStyle={{
									justifyContent: 'flex-start'
								}}
								dropDownStyle={{ backgroundColor: '#fafafa', zIndex: 4 }}
								onChangeItem={item => {
								medicineTimingFrequency = item.value;
								}}
								globalTextStyle={{ color: Color.fontColor, fontSize: CustomFont.font16 }}
								placeholder={medicineTimingFrequency}
								placeholderStyle={{ color: Color.placeHolderColor, fontSize: CustomFont.font16 }}
							/>
							{/* ------- Duration------- */}
							<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: responsiveHeight(3) }}>Frequency</Text>
							<TextInput onBlur={this.callIsBlurDuration} onFocus={this.callIsFucusedDuration}  style={[styles.createInputStyle, { borderColor: this.state.InpborderColorDuration }]} placeholder={'Enter frequency'} placeholderTextColor={Color.placeHolderColor} value={this.state.dutaionTxt} 
							// maxLength={InputTxtLengthDuration}
								onChangeText={(text) => this.handleDurationData(text)} ref='search' returnKeyType='done' />

							{this.state.showDurationDropDown ?
								<View style={{
									borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
									borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
								}}><FlatList style={{ backgroundColor: '#fafafa' }}
									data={this.state.DurationDropdownArr}
									renderItem={({ item, index }) => (
										<TouchableOpacity key={index} style={{ zIndex: 999, height: responsiveHeight(7), justifyContent: 'flex-start', }} onPress={() => this.clickOnDuration(item)}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }} >{item.label}</Text>
										</TouchableOpacity>
									)}
									keyExtractor={(item, index) => index.toString()}
									/>
								</View> : null}

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
