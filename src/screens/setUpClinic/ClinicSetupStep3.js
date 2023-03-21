import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	Alert,
	StatusBar, Image, TextInput, TouchableOpacity, Keyboard, ScrollView, FlatList, Platform, KeyboardAvoidingView, Linking
} from 'react-native';
import styles from './style';
import TickIcon from '../../../assets/green_tick.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import Snackbar from 'react-native-snackbar';

import Plus from '../../../assets/followupplus.png';
import Minus from '../../../assets/followupminus.png';
import minus_gray from '../../../assets/minus_gray.png';
import Rupee from '../../../assets/rupee.png';
import clinic_unchecked from '../../../assets/clinic_unchecked.png';
import checked_square from '../../../assets/checked_square.png';
import stepper from '../../../assets/stepperCheck.png';
import { setLogEvent } from '../../service/Analytics';
import Validator from '../../components/Validator';
let objParamsBackup = {};
let inClinicGuid = '';
class ClinicSetupStep3 extends React.Component {
	constructor(props) {
		super(props);
		let params = this.props.navigation.state.params;
		this.state = {
			fld1: Color.inputdefaultBorder,
			fld2: Color.inputdefaultBorder,
			fld3: Color.inputdefaultBorder,
			fld4: Color.inputdefaultBorder,
			consultationFeeInc: params && params.consultationFeeInc ? params.consultationFeeInc : '',
			followUpFeeInc: params && params.followUpFeeInc ? params.followUpFeeInc : '',
			followUpValidForInc: params && params.followUpValidForInc ? params.followUpValidForInc : '0',
			consultationFeeVir: params && params.consultationFeeVir ? params.consultationFeeVir : '',
			followUpFeeVir: params && params.followUpFeeVir ? params.followUpFeeVir : '',
			followUpValidForVir: params.followUpValidForVir ? params.followUpValidForVir : '0',
			isSameToInclinic: params && params.isVirtualInclinicFeeSame ? params.isVirtualInclinicFeeSame : false,
			isModalVisibleSuccess: false,
			successType: '',
			isModalVisible: false,
			dynamicMessage: '',
			showInClinicView: true,
			showVirtualView: true,
			dynamicMargin: 10
		};
		//console.log(JSON.stringify(params))
		objParamsBackup = {};
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'SaveUpdateDoctorConsultationTimings') {
				if (newProps.responseData.statusCode == -1) {
					DRONA.setIsDrTimingsUpdated(true);
					setLogEvent("add_clinic_schedule");
					Keyboard.dismiss(0);
					setTimeout(()=>{
						if (this.props.navigation.state.params.from == 'first')
						this.props.navigation.navigate('WebPagePreview');
					else{
						DRONA.setIsReloadApi(true)
						this.props.navigation.navigate('SetUpClinic', { tabActive: 0, from: 'first' });
					}
					},500)
					
						
				} else if (newProps.responseData.statusCode == -9) {
					setTimeout(() => {
						Alert.alert(
							'Error',
							newProps.responseData.statusMessage,
							[
								{
									text: 'Ok',
									onPress: () => {
										this.props.navigation.goBack();
									},
								},
							],
							{ cancelable: false },
						);
					}, 300);
				} else if (newProps.responseData.statusCode == -3) {
					this.setState({
						isModalVisible: true,
						dynamicMessage: newProps.responseData.statusMessage + '\n Do you want to continue for the same ? '
					})

				} else {
					setTimeout(() => {
						alert(JSON.stringify(newProps.responseData.statusMessage));
					}, 300);
				}
			}
		}
	}
	async componentDidMount() {
		let objParams = this.props.navigation.state.params.objParams;
		inClinicGuid = this.props.navigation.state.params.inClinicGuid;
		virtualGuid = this.props.navigation.state.params.virtualGuid;
		let dataArr = objParams.data.consultationTimeslots;
		if (dataArr && dataArr.length > 0) {
			let virtual = false, inclinic = false;
			for (let i = 0; i < dataArr.length; i++) {
				if (dataArr[i].consultationTypeGuid == inClinicGuid) {
					inclinic = true;
				} else {
					virtual = true;
				}
			}
			this.setState({ showInClinicView: inclinic, showVirtualView: virtual })
		}
		 console.log('-----'+this.state.consultationFeeInc);
		 console.log('---++--'+this.state.consultationFeeVir);
// if(this.state.consultationFeeInc && this.state.consultationFeeVir && this.state.consultationFeeInc>0 && this.state.consultationFeeVir>0){
// 	this.setState({isSameToInclinic:true})
// }else{
// 	this.setState({isSameToInclinic:false})
// }

	}

	callOnFocus = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.primary })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.primary })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.primary, dynamicMargin: responsiveHeight(5) })
		} else if (type == '4') {
			this.setState({ fld4: Color.primary, dynamicMargin: responsiveHeight(9) })
		} else if (type == '5') {
			this.setState({ fld4: Color.primary, dynamicMargin: responsiveHeight(13) })
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
			this.setState({ fld3: Color.inputdefaultBorder, dynamicMargin: 10 })
		} else if (type == '4') {
			this.setState({ fld4: Color.inputdefaultBorder, dynamicMargin: 10 })
		} else if (type == '5') {
			this.setState({ fld4: Color.inputdefaultBorder, dynamicMargin: 10 })
		}

	}
	IncrementItem = () => {
		this.setState({ followUpValidForInc: (parseInt(this.state.followUpValidForInc) + 1).toString() });
		if (this.state.isSameToInclinic)
			this.setState({ followUpValidForVir: (parseInt(this.state.followUpValidForInc) + 1).toString() });
	}
	DecreaseItem = () => {
		if (parseInt(this.state.followUpValidForInc) > 0) {
			this.setState({ followUpValidForInc: (parseInt(this.state.followUpValidForInc) - 1).toString() });
			if (this.state.isSameToInclinic)
				this.setState({ followUpValidForVir: (parseInt(this.state.followUpValidForInc) - 1).toString() });
		}
	}
	IncrementItemVirtual = () => {
		this.setState({ followUpValidForVir: (parseInt(this.state.followUpValidForVir) + 1).toString() });
		if (this.state.isSameToInclinic)
			this.setState({ followUpValidForInc: (parseInt(this.state.followUpValidForVir) + 1).toString() });
	}
	DecreaseItemVirtual = () => {
		if (parseInt(this.state.followUpValidForVir) > 0) {
			this.setState({ followUpValidForVir: (parseInt(this.state.followUpValidForVir) - 1).toString() });
			if (this.state.isSameToInclinic)
				this.setState({ followUpValidForInc: (parseInt(this.state.followUpValidForVir) - 1).toString() });
		}


	}
	gotoNext = () => {
		let followUpFeeIncLocal = this.state.followUpFeeInc ? parseInt(this.state.followUpFeeInc) : 0;
		let followUpFeeVirLocal = this.state.followUpFeeVir ? parseInt(this.state.followUpFeeVir) : 0;
		if (!this.state.consultationFeeInc && !this.state.consultationFeeVir) {
			Snackbar.show({ text: 'Please enter Consultation Fee', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (this.state.showInClinicView && !this.state.consultationFeeInc) {
			Snackbar.show({ text: 'Please enter In-clinic Consultation Fee', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (this.state.showVirtualView && !this.state.consultationFeeVir) {
			Snackbar.show({ text: 'Please enter Virtual Consultation Fee', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (this.state.consultationFeeInc && this.state.consultationFeeInc == 0) {
			Snackbar.show({ text: 'In-clinic Consultation Fee should not 0', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (this.state.consultationFeeVir && this.state.consultationFeeVir == 0) {
			Snackbar.show({ text: 'Virtual Consultation Fee should not 0', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (this.state.consultationFeeInc && this.state.consultationFeeInc < followUpFeeIncLocal) {
			Snackbar.show({ text: 'In-clinic Consultation Fee should be greater than Follow-up fees', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (this.state.consultationFeeVir && this.state.consultationFeeVir < followUpFeeVirLocal) {
			Snackbar.show({ text: 'Virtual Consultation Fee should be greater than Follow-up fees', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (!this.state.consultationFeeInc && followUpFeeIncLocal > 0) {
			Snackbar.show({ text: 'Please enter In-clinic Consultation Fee', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else if (!this.state.consultationFeeVir && followUpFeeVirLocal > 0) {
			Snackbar.show({ text: 'Please enter Virtual Consultation Fee ', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		}
		else {
			let objParams = this.props.navigation.state.params.objParams;
			let consultationTimeslots = objParams.data.consultationTimeslots;

			if (consultationTimeslots && consultationTimeslots.length > 0) {
				for (let i = 0; i < consultationTimeslots.length; i++) {
					if (consultationTimeslots[i].consultationTypeGuid == inClinicGuid) {
						consultationTimeslots[i].consultationFee = this.state.consultationFeeInc ? parseInt(this.state.consultationFeeInc) : '0';
						consultationTimeslots[i].followUpFee = this.state.followUpFeeInc ? parseInt(this.state.followUpFeeInc) : '0';
						consultationTimeslots[i].followUpValidFor = this.state.followUpValidForInc ? parseInt(this.state.followUpValidForInc) : '0';
					} else {
						consultationTimeslots[i].consultationFee = this.state.consultationFeeVir ? parseInt(this.state.consultationFeeVir) : '0';
						consultationTimeslots[i].followUpFee = this.state.followUpFeeVir ? parseInt(this.state.followUpFeeVir) : '0';
						consultationTimeslots[i].followUpValidFor = this.state.followUpValidForVir ? parseInt(this.state.followUpValidForVir) : '0';
					}
				}
			}
			objParams.data.isVirtualInclinicFeeSame = this.state.isSameToInclinic;
			objParamsBackup = objParams;
			//objParams.consultationTimeslots=consultationTimeslots;
			let { actions, signupDetails } = this.props;
			//console.log(JSON.stringify(params));
			actions.callLogin('V1/FuncForDrAppToSaveUpdateDoctorConsultationTimings', 'post', objParams, signupDetails.accessToken, 'SaveUpdateDoctorConsultationTimings');
			setLogEvent("edit_clinic", { "save": "click", userGuid: signupDetails.UserGuid })
		}
	}
	getRecallAPi = () => {
		if (objParamsBackup)
			objParamsBackup.data.editConsent = true;
		let { actions, signupDetails } = this.props;
		actions.callLogin('V1/FuncForDrAppToSaveUpdateDoctorConsultationTimings', 'post', objParamsBackup, signupDetails.accessToken, 'SaveUpdateDoctorConsultationTimings');
	}
	render() {
		let { actions, signupDetails } = this.props;
		let from = this.props.navigation.state.params.from;
		return (
			<SafeAreaView style={[CommonStyle.container, { backgroundColor: Color.newBgColor }]}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flexDirection: 'row', backgroundColor: Color.white, alignItems: 'center', zIndex: 999, justifyContent: 'space-between' }}>
					<TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
						<Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5), tintColor: Color.primary }} />
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: responsiveWidth(3), fontWeight: Platform.OS == 'ios' ? CustomFont.fontWeight600 : '700' }}>{from == 'first' ? 'Fee' : 'Edit Fee'}</Text>
					</TouchableOpacity>

				</View>
				{from == 'first' ?
					<View>
						<View style={{ flexDirection: 'row', backgroundColor: Color.white }}>
							<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: Color.progressBar, borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(8) }}>
								<Image source={stepper} style={{ height: responsiveFontSize(1.6), width: responsiveFontSize(1.6), resizeMode: 'contain' }} />
							</View>
							<View style={{ flex: 4, justifyContent: 'center' }}>
								<View style={{ width: '100%', height: responsiveWidth(.2), backgroundColor: Color.progressBar }} />
							</View>
							<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: Color.progressBar, borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center' }}>
								<Image source={stepper} style={{ height: responsiveFontSize(1.6), width: responsiveFontSize(1.6), resizeMode: 'contain' }} />
							</View>
							<View style={{ flex: 4, justifyContent: 'center' }}>
								<View style={{ width: '100%', height: responsiveWidth(.2), backgroundColor: Color.progressBar }} />
							</View>
							<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: Color.primary, borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(7) }}>
								<Text style={{ color: Color.white, textAlign: 'center', fontSize: CustomFont.font16 }}>3</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row', backgroundColor: Color.white, paddingTop: 5, paddingBottom: 15, justifyContent: 'space-between' }}>
							<Text style={{ color: '#CCC8CF', fontSize: CustomFont.font12, marginLeft: responsiveWidth(3) }}>Clinic Details</Text>
							<Text style={{ color: '#CCC8CF', fontSize: CustomFont.font12 }}>Consultation Timings</Text>
							<Text style={{ color: Color.primary, fontSize: CustomFont.font12, marginRight: responsiveWidth(8) }}>Fees</Text>
						</View>
					</View> : null}

				<View style={{ flex: 1 }}>
					<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} >
						<ScrollView keyboardShouldPersistTaps='always'>
							<View style={{ marginBottom: this.state.dynamicMargin }}>
								{this.state.showInClinicView ? <View style={{ borderRadius: 10, backgroundColor: Color.white, margin: responsiveWidth(3), marginTop: 10, marginBottom: responsiveHeight(3) }}>
									<View style={{ margin: responsiveWidth(3.5) }}>
										<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold', marginTop: 7 }}>In-Clinic Consultation</Text>
										<Text style={{ fontSize: CustomFont.font12, color: Color.feesHeadTxt, fontWeight: CustomFont.fontWeight500, marginTop: responsiveHeight(2.5) }}>Consultation Fee *</Text>
										<View style={{ marginTop: 8, }}>
											<Image style={{ left: responsiveWidth(4), position: 'absolute', top: responsiveHeight(.8), height: responsiveHeight(5), width: responsiveWidth(3.5), resizeMode: 'contain' }} source={Rupee} />
											<TextInput returnKeyType="done"
												onFocus={() => this.callOnFocus('1')}
												onBlur={() => this.callOnBlur('1')}
												style={{
													textAlign: 'left',
													borderColor: this.state.fld1, borderWidth: .7, borderRadius: 4, height: responsiveHeight(6.5),
													fontSize: CustomFont.font14, paddingLeft: responsiveWidth(10), paddingRight: responsiveWidth(2), color: Color.fontColor
												}} onChangeText={consultationFeeInc => {
													if (consultationFeeInc) {
														if (Validator.isDecimal(consultationFeeInc)) {
															this.setState({ consultationFeeInc });
															if (this.state.isSameToInclinic)
																this.setState({ consultationFeeVir: consultationFeeInc });
														}
													} else {
														this.setState({ consultationFeeInc });
														if (this.state.isSameToInclinic)
															this.setState({ consultationFeeVir: consultationFeeInc });
													}

												}} placeholder="Enter Amount" placeholderTextColor={Color.placeHolderColor} value={this.state.consultationFeeInc} keyboardType={'phone-pad'} maxLength={7} />
										</View>


										<View style={{ marginTop: responsiveHeight(3) }}>
											<Text style={{ fontSize: CustomFont.font12, color: Color.feesHeadTxt, fontWeight: CustomFont.fontWeight500 }}>Follow-up Charges</Text>
											<View style={{ marginTop: 8, }}>
												<Image style={{ left: responsiveWidth(4), position: 'absolute', top: responsiveHeight(.8), height: responsiveHeight(5), width: responsiveWidth(3.5), resizeMode: 'contain' }} source={Rupee} />
												<TextInput returnKeyType="done"
													onFocus={() => this.callOnFocus('2')}
													onBlur={() => this.callOnBlur('2')}

													style={{
														textAlign: 'left',
														borderColor: this.state.fld2, borderWidth: .7, borderRadius: 4, height: responsiveHeight(6.5),
														fontSize: CustomFont.font14, paddingLeft: responsiveWidth(10), paddingRight: responsiveWidth(2), color: Color.fontColor
													}} onChangeText={followUpFeeInc => {
														if (followUpFeeInc) {
															if (Validator.isDecimal(followUpFeeInc)) {
																this.setState({ followUpFeeInc });
																if (this.state.isSameToInclinic)
																	this.setState({ followUpFeeVir: followUpFeeInc });
															}
														} else {
															this.setState({ followUpFeeInc });
															if (this.state.isSameToInclinic)
																this.setState({ followUpFeeVir: followUpFeeInc });
														}

														// this.setState({ followUpFeeInc });
														// if (this.state.isSameToInclinic)
														// 	this.setState({ followUpFeeVir: followUpFeeInc });
													}} placeholder="Enter Amount" placeholderTextColor={Color.placeHolderColor} value={this.state.followUpFeeInc} keyboardType={'phone-pad'} maxLength={7} />
											</View>
										</View>

										<View style={{ marginTop: responsiveHeight(3) }}>
											<Text style={{ fontSize: CustomFont.font12, color: Color.feesHeadTxt, fontWeight: CustomFont.fontWeight500 }}>Follow-up Valid for (days)</Text>
											<View style={{ marginTop: 8, height: responsiveHeight(6.5), flexDirection: 'row', alignItems: 'center', borderColor: Color.createInputBorder, borderWidth: .7, borderRadius: 4, }}>
												<View style={{ flex: 2 }}>
													<TextInput returnKeyType="done"
														//onFocus={() => this.callOnFocus('3')}
														//onBlur={() => this.callOnBlur('3')}
														style={{ height: responsiveHeight(6.5), paddingLeft: responsiveWidth(4), textAlign: 'left', fontSize: CustomFont.font16, color: Color.fontColor }} onChangeText={followUpValidForInc => {
															if (followUpValidForInc) {
																if (Validator.isMobileValidate(followUpValidForInc)) {
																	this.setState({ followUpValidForInc });
																	if (this.state.isSameToInclinic)
																		this.setState({ followUpValidForVir: followUpValidForInc });
																}
															} else {
																this.setState({ followUpValidForInc });
																if (this.state.isSameToInclinic)
																	this.setState({ followUpValidForVir: followUpValidForInc });
															}

															// this.setState({ followUpValidForInc });
															// if (this.state.isSameToInclinic)
															// 	this.setState({ followUpValidForVir: followUpValidForInc });
														}} value={this.state.followUpValidForInc} keyboardType={'phone-pad'} maxLength={3} />
												</View>
												<View style={{ flex: .5 }}>
													<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: responsiveHeight(7.5), }} onPress={() => this.DecreaseItem()}>
														<Image source={this.state.followUpValidForInc > 0 ? Minus : minus_gray} style={{ resizeMode: 'contain', width: responsiveWidth(6), height: responsiveHeight(6) }} />
													</TouchableOpacity>
												</View>
												<View style={{ flex: .5, }}>
													<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), }} onPress={() => this.IncrementItem()}>
														<Image source={Plus} style={{ resizeMode: 'contain', width: responsiveWidth(6), height: responsiveHeight(6) }} />
													</TouchableOpacity>
												</View>

											</View>
										</View>
									</View>

								</View> : null}




								{this.state.showVirtualView ? <View style={{ borderRadius: 10, backgroundColor: Color.white, margin: responsiveWidth(3), marginTop: 10, marginBottom: responsiveHeight(3) }}>
									<View style={{ margin: responsiveWidth(3.5) }}>
										<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold', marginTop: 7 }}>Virtual Consultation</Text>
										{this.state.showInClinicView && this.state.showVirtualView ? <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}
											onPress={() => {
												this.setState({ isSameToInclinic: !this.state.isSameToInclinic });
												setTimeout(() => {
													if (this.state.isSameToInclinic) {
														if (this.state.consultationFeeInc)
															this.setState({ consultationFeeVir: this.state.consultationFeeInc, followUpFeeVir: this.state.followUpFeeInc, followUpValidForVir: this.state.followUpValidForInc });
														else
															this.setState({ consultationFeeInc: this.state.consultationFeeVir, followUpFeeInc: this.state.followUpFeeVir, followUpValidForInc: this.state.followUpValidForVir });
													}

												}, 300)
											}}>
											<Image source={this.state.isSameToInclinic ? checked_square : clinic_unchecked} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), resizeMode: 'contain' }} />
											<Text style={{ fontSize: CustomFont.font14, color: Color.feesHeadTxt, marginLeft: 10 }}>Same as In-Clinic Consultation</Text>
										</TouchableOpacity> : null}

										<Text style={{ fontSize: CustomFont.font12, color: Color.feesHeadTxt, fontWeight: CustomFont.fontWeight500, marginTop: responsiveHeight(3) }}>Consultation Fee *</Text>
										<View style={{ marginTop: 8, }}>
											<Image style={{ left: responsiveWidth(4), position: 'absolute', top: responsiveHeight(.8), height: responsiveHeight(5), width: responsiveWidth(3.5), resizeMode: 'contain' }} source={Rupee} />
											<TextInput returnKeyType="done"
												onFocus={() => this.callOnFocus('3')}
												onBlur={() => this.callOnBlur('3')}
												editable={!this.state.isSameToInclinic}
												style={{
													textAlign: 'left',
													borderColor: this.state.fld3, borderWidth: .7, borderRadius: 4, height: responsiveHeight(6.5),
													fontSize: CustomFont.font14, paddingLeft: responsiveWidth(10), paddingRight: responsiveWidth(2), color: Color.fontColor
												}} onChangeText={consultationFeeVir => {
													if (consultationFeeVir) {
														if (Validator.isDecimal(consultationFeeVir)) {
															this.setState({ consultationFeeVir });
															if (this.state.isSameToInclinic)
																this.setState({ consultationFeeVir: consultationFeeVir });
														}
													} else {
														this.setState({ consultationFeeVir });
														if (this.state.isSameToInclinic)
															this.setState({ consultationFeeInc: consultationFeeVir });
													}
													// this.setState({ consultationFeeVir });
													// if (this.state.isSameToInclinic)
													// 	this.setState({ consultationFeeInc: consultationFeeVir });
												}} placeholder="Enter Amount" placeholderTextColor={Color.placeHolderColor} value={this.state.consultationFeeVir} keyboardType={'phone-pad'} maxLength={7} />
										</View>


										<View style={{ marginTop: responsiveHeight(3) }}>
											<Text style={{ fontSize: CustomFont.font12, color: Color.feesHeadTxt, fontWeight: CustomFont.fontWeight500 }}>Follow-up Charges</Text>
											<View style={{ marginTop: 8, }}>
												<Image style={{ left: responsiveWidth(4), position: 'absolute', top: responsiveHeight(.8), height: responsiveHeight(5), width: responsiveWidth(3.5), resizeMode: 'contain' }} source={Rupee} />
												<TextInput returnKeyType="done"
													onFocus={() => this.callOnFocus('4')}
													onBlur={() => this.callOnBlur('4')}
													editable={!this.state.isSameToInclinic}
													style={{
														textAlign: 'left',
														borderColor: this.state.fld4, borderWidth: .7, borderRadius: 4, height: responsiveHeight(6.5),
														fontSize: CustomFont.font14, paddingLeft: responsiveWidth(10), paddingRight: responsiveWidth(2), color: Color.fontColor
													}} onChangeText={followUpFeeVir => {
														if (followUpFeeVir) {
															if (Validator.isDecimal(followUpFeeVir)) {
																this.setState({ followUpFeeVir });
																if (this.state.isSameToInclinic)
																	this.setState({ followUpFeeInc: followUpFeeVir });
															}
														} else {
															this.setState({ followUpFeeVir });
															if (this.state.isSameToInclinic)
																this.setState({ followUpFeeInc: followUpFeeVir });
														}


														// this.setState({ followUpFeeVir });
														// if (this.state.isSameToInclinic)
														// 	this.setState({ followUpFeeInc: followUpFeeVir });
													}} placeholder="Enter Amount" placeholderTextColor={Color.placeHolderColor} value={this.state.followUpFeeVir} keyboardType={'phone-pad'} maxLength={7} />
											</View>
										</View>

										<View style={{ marginTop: responsiveHeight(3) }}>
											<Text style={{ fontSize: CustomFont.font12, color: Color.feesHeadTxt, fontWeight: CustomFont.fontWeight500 }}>Follow-up Valid for (days)</Text>
											<View style={{ marginTop: 8, height: responsiveHeight(6.5), flexDirection: 'row', alignItems: 'center', borderColor: Color.createInputBorder, borderWidth: .7, borderRadius: 4, }}>
												<View style={{ flex: 2 }}>
													<TextInput returnKeyType="done"
														onFocus={() => this.callOnFocus('5')}
														onBlur={() => this.callOnBlur('5')}
														editable={!this.state.isSameToInclinic}
														style={{ height: responsiveHeight(6.5), paddingLeft: responsiveWidth(4), textAlign: 'left', fontSize: CustomFont.font16, color: Color.fontColor }} onChangeText={followUpValidForVir => {
															if (followUpValidForVir) {
																if (Validator.isMobileValidate(followUpValidForVir)) {
																	this.setState({ followUpValidForVir });
																	if (this.state.isSameToInclinic)
																		this.setState({ followUpValidForInc: followUpValidForVir });
																}
															} else {
																this.setState({ followUpValidForVir });
																if (this.state.isSameToInclinic)
																	this.setState({ followUpValidForInc: followUpValidForVir });
															}
															// this.setState({ followUpValidForVir });
															// if (this.state.isSameToInclinic)
															// 	this.setState({ followUpValidForInc: followUpValidForVir });
														}} value={this.state.followUpValidForVir} keyboardType={'phone-pad'} maxLength={3} />
												</View>
												<View style={{ flex: .5 }}>
													<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: responsiveHeight(7.5) }} onPress={() => {
														if (!this.state.isSameToInclinic)
															this.DecreaseItemVirtual()
													}}>
														<Image source={this.state.followUpValidForVir > 0 ? Minus : minus_gray} style={{ resizeMode: 'contain', width: responsiveWidth(6), height: responsiveHeight(6) }} />
													</TouchableOpacity>
												</View>
												<View style={{ flex: .5, }}>
													<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), }} onPress={() => {
														if (!this.state.isSameToInclinic)
															this.IncrementItemVirtual()
													}}>
														<Image source={Plus} style={{ resizeMode: 'contain', width: responsiveWidth(6), height: responsiveHeight(6) }} />
													</TouchableOpacity>
												</View>

											</View>
										</View>
									</View>

								</View> : null}




							</View>
						</ScrollView>
					</KeyboardAvoidingView>



				</View>
				<View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

					<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(1.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 10 }} onPress={() => {
						this.gotoNext();
					}}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save & Continue</Text>
					</TouchableOpacity>
				</View>
				<Modal isVisible={this.state.isModalVisible} onRequestClose={() => this.setState({ isModalVisible: false })}>
					<View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Message </Text>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>{this.state.dynamicMessage}</Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false })}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
								</TouchableOpacity>
							</View>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primary }} onPress={() => {
									this.setState({ isModalVisible: false })
									this.getRecallAPi();
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Yes</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<Modal isVisible={this.state.isModalVisibleSuccess} onRequestClose={() => this.setState({ isModalVisibleSuccess: false })}>
					<View style={[styles.modelViewMessage2]}>
						<Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
						<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>{this.state.successType}</Text>
						<TouchableOpacity
							onPress={() => {
								this.setState({ isModalVisibleSuccess: false });
								this.props.navigation.navigate('DoctorHome');
							}}
							style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
							<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
						</TouchableOpacity>
					</View>
				</Modal>
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
)(ClinicSetupStep3);
