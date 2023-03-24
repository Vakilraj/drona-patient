import React, { useState } from 'react';
import {View,
	Text,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import Moment from 'moment';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
var _ = require('lodash');
import { setLogEvent } from '../../../service/Analytics';

import Snackbar from 'react-native-snackbar';
import { TextInput } from 'react-native';

let prvLength = -1, bpAlertMsg = '', bmiIndex = 0;
let VitalAllData = '',FinalExtractNullData = [];
let appoinmentGuid = "", vitalDate = null;
class CN extends React.Component {
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

	}
	async componentDidMount() {
		let { signupDetails } = this.props;
		appoinmentGuid = this.props.data && this.props.data.pastAppointmentGuid ? this.props.data.pastAppointmentGuid : signupDetails.appoinmentGuid;
		VitalAllData = this.props.responseData.data.vitalMasters;
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

	setValueFromResponse = (data) => {
		let tempArr = data.prescriptionInfoYearly;
		let tmpPrescArr = []
		let prescDetailsArr = []
		if (tempArr && tempArr.length > 0) {
			for (let i = 0; i < tempArr.length; i++) {

				let jsonObj = {
					title: tempArr[i].prescriptionDetails && tempArr[i].prescriptionDetails.length > 0 ? tempArr[i].prescriptionYear : '',
					data: tempArr[i].prescriptionDetails
				}

				prescDetailsArr.push(jsonObj);
				try {
					if (tempArr[i].prescriptionDetails && tempArr[i].prescriptionDetails.length > 0) {
						for (let j = 0; j < tempArr[i].prescriptionDetails.length; j++) {
							if (tmpPrescArr.length < 3)
								tmpPrescArr.push(tempArr[i].prescriptionDetails[j])
						}
					}
				} catch (error) {

				}
			}
			this.setState({ pastEncounterDetailsArr: prescDetailsArr, prescriptionArr: tmpPrescArr, showDynamicMsg: '' })
		} else {
			this.setState({ pastEncounterDetailsArr: [], prescriptionArr: [], showDynamicMsg: 'Past prescription not found' })
		}
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
				this.setState({ vitalsDataArrayAll: this.state.vitalsDataArrayAll })
			}
		}
	}

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
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"PatientGuid": signupDetails.patientGuid,
				"Data": {
					"AppointmentGuid": appoinmentGuid,
					"PatientGuid": signupDetails.patientGuid,
					"vitalMasters": FinalExtractNullData,
					"vitalDate": vitalDate ? Moment(vitalDate).format('YYYY-MM-DD') : Moment(new Date()).format('YYYY-MM-DD'),
				}
			}
			actions.callLogin('V1/FuncForDrAppToAddUpdatePatientVitals_V2', 'post', params, signupDetails.accessToken, 'addUpdateVitalsData');

		}
	}

	render() {
		let { signupDetails } = this.props;
		//let item = this.props.navigation.state.params.item;
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: Color.white,
					margin: responsiveWidth(3),
					borderRadius: 10
				}}>
				<FlatList
					data={this.state.vitalsDataArrayAll}
					extraData={this.state}
					keyExtractor={(item, index) => index.toString()}
					style={{ marginBottom: responsiveHeight(6) }}
					showsVerticalScrollIndicator={false}
					renderItem={(({ item, index }) => {
						return (
							<View
								style={{
									marginLeft: responsiveWidth(4),
									marginTop: responsiveWidth(4),
									display: 'flex',
									flexDirection: 'row',
									flex: 1,
									marginRight: responsiveWidth(3),
									alignItems: 'center'
								}} >
								<View style={{ flex: 2,
								}}>
									<Text
										style={{
											fontSize: CustomFont.font14,
											fontWeight: '600',
											color: Color.optiontext,
											margin: responsiveWidth(1),
											maxWidth: responsiveWidth(30),
										}}>{item.vitalName}</Text>
								</View>

								<View
									style={{
										flexDirection: 'column',
										alignItems: 'center',
										flex: 1.5
									}}
								>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											borderWidth: 1,
											borderColor: Color.datecolor,
											borderRadius: 10,
											//maxHeight: responsiveHeight(5),
											paddingLeft: responsiveWidth(1),
											flex: 1,
										}}
									>

										<TextInput returnKeyType="done"
											style={{ flex: 2 ,height:responsiveHeight(5)}}
											onFocus={() => {
												if (Platform.OS == 'ios')
													this.setState({ dynamicTop: responsiveHeight(15) })
												if (index > 6)
													this.setState({ dynamicBottom: 50 })
											}}
											onBlur={() => {
												if (Platform.OS == 'ios')
													this.setState({ dynamicTop: 0, dynamicBottom: 0 });
											}}
											placeholderTextColor={Color.placeHolderColor}
											placeholder="Enter" value={this.state.textInputs[index]}
											maxLength={12}
											onChangeText={(text2) => {
												let text = this.removeSpecialChar(text2, item?.vitalName);
												// console.log(prvLength + '------' + text2.length)
												if (item?.vitalName == 'BP' && text && text?.length > 1 && !text.includes('/') && prvLength < text2.length && prvLength > 0) {
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

										<Text
											style={{
												// paddingLeft: responsiveWidth(3),
												paddingRight: responsiveWidth(2),
												// flex: 1.7,
												// textAlign: 'right',
												fontSize: CustomFont.font12,
												color: Color.optiontext,
												fontWeight: '700',
												textAlign: 'center',
												maxWidth: responsiveWidth(17),
												// backgroundColor: 'blue'
											}}>{item.vitalUnit}</Text>
									</View>
									{this.state.bpFieldError && item.vitalName == 'BP' ?
										<Text
											style={{
												color: 'red',
												marginTop: 5,
												fontSize: CustomFont.font10,
												marginRight: 2
											}}>{bpAlertMsg}</Text>
										: null}
								</View>
							</View>
						)
					})}

				/>
				{this.state.vitalsDataArrayAll && this.state.vitalsDataArrayAll.length > 0 ?
					<View style={{
						width: '100%',
						flex: 1, alignItems: 'center',
						justifyContent: 'center',
						marginBottom: responsiveHeight(3)
					}}>
						<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 30 }} onPress={() => {
							// if (this.state.vitalsDataArrayAll && this.state.vitalsDataArrayAll.length > 0) {
							this.updateVitals()
							// } else {
							// Snackbar.show({ text: 'No data available to submit ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
							// }
						}}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
						</TouchableOpacity>
					</View>
					: null}
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
)(CN);