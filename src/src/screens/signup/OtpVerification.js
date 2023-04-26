import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView,ScrollView, StatusBar, Platform
} from 'react-native';
import Modal from 'react-native-modal';
import styles from './style';
import CustomFont from '../../components/CustomFont';
import TickIcon from '../../../assets/alert.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
let sliderTimer = null;
import app_icon from '../../../assets/app_icon.png';
import editfile from '../../../assets/edit_new_blue.png';
import home_bg from '../../../assets/home_bg.png';
import { sha256 } from 'js-sha256';
let otpGlobal='';
class OtpVerification extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			otpMessage: false,
			otpVerifyResponse: '',
			isChecked: false,
			otp: '',
			isButtonEnable: false,
			otp1: '',
			otp2: '',
			otp3: '',
			otp4: '',
			otp5: '',
			otp6: '',
			showOtpTime: 60,
			resentBtnType: true,
			InpborderColor1: Color.inputdefaultBorder,
			InpborderColor2: Color.inputdefaultBorder,
			InpborderColor3: Color.inputdefaultBorder,
			InpborderColor4: Color.inputdefaultBorder,
			InpborderColor5: Color.inputdefaultBorder,
			InpborderColor6: Color.inputdefaultBorder,
			buttonBorderWidth: 0
		};
	}
	componentDidMount() {
			this.resentOTP();
	}

	startTimer = () => {
		try {
			sliderTimer = setInterval(() => {
				try {
					this.setState({ showOtpTime: --this.state.showOtpTime })
					if (this.state.showOtpTime == 0) {
						clearInterval(sliderTimer);
						this.setState({ resentBtnType: false })
					}
				} catch (error) {
					
				}
	
			}, 2000);
		} catch (error) {
			
		}
		
	}
	componentWillUnmount() {
		try {
			clearInterval(sliderTimer);
		} catch (error) {
			
		}
	}
	verifyOTP = () => {
		this.setState({ buttonBorderWidth: 1 })
		let { actions, signupDetails } = this.props;
		let otp = Platform.OS === 'android' ? this.state.otp1 + this.state.otp2 + this.state.otp3 + this.state.otp4 + this.state.otp5 + this.state.otp6 : this.state.otp;
		otpGlobal=otp;
		var otp256 = sha256(otp+"");
		let params = {
			"UserGuid": signupDetails.UserGuid, "Version": "",
			"Data": {
				"OtpValue": otp256,
				"Reference": signupDetails.mobile,
			}
		};
		//console.log(JSON.stringify(params));
		actions.callLogin('V1/FuncForDrAppToValidateOTP', 'post', params, 'token', 'verifyOtp');
		//actions.callLogin('V1/FuncForDrAppToValidateOTP', 'post', params, 'token', 'verifyOtp');
	}
	resentOTP = () => {
		let { actions, signupDetails } = this.props;
		let userGuid = null;
		try {
			userGuid = this.props.navigation.state.params.userGuid ? this.props.navigation.state.params.userGuid : null
		} catch (e) {
			userGuid = null;
		}

		let params = {
			userGuid: null,
			version: null,

			Data: {
				"Reference": signupDetails.mobile,
				"UserGuid": signupDetails.UserGuid
			}
		};
		actions.callLogin('V11/FuncForDrAppToSaveAndSendOTP', 'post', params, 'token', 'ResentOtp');
		this.setState({ resentBtnType: true, showOtpTime: 60 })
		this.startTimer();
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'verifyOtp') {
				this.setState({ buttonBorderWidth: 0 })
				if (newProps.responseData.statusMessage === 'Success') {  // && newProps.responseData.data.isOtpValid
					let { actions, signupDetails } = this.props;
					// signupDetails.UserGuid = newProps.responseData.data.userGuid;
					// actions.setSignupDetails(signupDetails);
					signupDetails.accessToken = newProps.responseData.accessToken;
					//if (newProps.responseData.data.userGuid)
						if (newProps.responseData.data && newProps.responseData.data.userInfo) {
							signupDetails.UserGuid = newProps.responseData.data.userInfo.userGuid;
							actions.setSignupDetails(signupDetails);
						} else {
							signupDetails.UserGuid = newProps.responseData.data.userGuid;
							actions.setSignupDetails(signupDetails);
						}
					if (this.props.navigation.state.params.from == 'member') {
						this.props.navigation.navigate('BecomeAMember', { from: 'signup' });
					}else if (this.props.navigation.state.params.from == 'clinicSetup') {
						this.props.navigation.navigate('AccountActivatedMessage',{from:'signup'});
					}
					// else if (this.props.navigation.state.params.from == 'clinicSetup2') {
					// 	this.props.navigation.navigate('ClinicSetupStep2');
					// }
					 else if (this.props.navigation.state.params.from == 'assistant') {
						let name = '', clinicName = '';
						try {
							if (newProps.responseData.data && newProps.responseData.data.assistantDetails) {
								let asstDetails=newProps.responseData.data.assistantDetails;
								name = asstDetails.firstName+' '+asstDetails.lastName;
								clinicName=asstDetails.clinicName;
								// let clArr = newProps.responseData.data.clinicDetailsList;
								// if (clArr)
								// 	clinicName = clArr[0].clinicName;
							}
						} catch (e) { }
						this.props.navigation.navigate('AssistantPasswordSetup', { userName: name, clinicName: clinicName,otp:otpGlobal });
					} else {
						this.props.navigation.navigate('ApplyClinicSetting');
					}

				} else {
					this.setState({ otpMessage: true });
					this.setState({ otpVerifyResponse: JSON.stringify(newProps.responseData.statusMessage) });

					// alert(JSON.stringify(newProps.responseData.statusMessage))
				}
			} else if (tagname === 'ResentOtp') {
				if (newProps.responseData.statusMessage === 'Success') {
				Snackbar.show({ text: 'OTP sent. Please verify OTP', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}else{
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			}
		}

	}

	callIsFucused1 = () => {
		this.setState({ InpborderColor1: Color.primary })
	}
	callIsBlur1 = () => {
		this.setState({ InpborderColor1: Color.inputdefaultBorder })
	}
	callIsFucused2 = () => {

		this.setState({ InpborderColor2: Color.primary })
	}
	callIsBlur2 = () => {
		this.setState({ InpborderColor2: Color.inputdefaultBorder })
	}
	callIsFucused3 = () => {

		this.setState({ InpborderColor3: Color.primary })
	}
	callIsBlur3 = () => {
		this.setState({ InpborderColor3: Color.inputdefaultBorder })
	}
	callIsFucused4 = () => {
		this.setState({ InpborderColor4: Color.primary })
	}
	callIsBlur4 = () => {
		this.setState({ InpborderColor4: Color.inputdefaultBorder })
	}

	callIsFucused5 = () => {
		this.setState({ InpborderColor5: Color.primary })
	}
	callIsBlur5 = () => {
		this.setState({ InpborderColor5: Color.inputdefaultBorder })
	}

	callIsFucused6 = () => {
		this.setState({ InpborderColor6: Color.primary })
	}
	callIsBlur6 = () => {
		this.setState({ InpborderColor6: Color.inputdefaultBorder })
	}
	render() {
		let { signupDetails } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
			<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
              <KeyboardAvoidingView behavior={'padding'}>
				<ScrollView style={{ backgroundColor: Color.white }}  keyboardShouldPersistTaps='always'>
				<View style={{ flex: 1 }}>
					<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
					<View style={{ flex: 1, margin: responsiveWidth(6), marginTop: responsiveWidth(3) }}>
						<TouchableOpacity style={{ marginTop: responsiveHeight(3) }} >
							<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
						</TouchableOpacity>

						<Text style={styles.getstartedTxt}>Verify Mobile Number</Text>
						<Text style={{ fontFamily: CustomFont.fontName,color:Color.fontColor, fontSize: CustomFont.font14, marginTop: responsiveHeight(3) }}>Enter the 6-digit OTP sent to your mobile number</Text>

						<View style={{ backgroundColor: Color.phoneNumberBg, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(4), alignItems: 'center', height: responsiveHeight(6) }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: 10 }}>{'+91-' + signupDetails.mobile}</Text>
							<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
								<Image source={editfile} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), marginRight: 10, marginLeft: 10 }} onPress={() => this.props.navigation.navigate('GetStarted')} />
							</TouchableOpacity>
						</View>

						{Platform.OS === 'android' ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(5) }}>
							<TextInput returnKeyType="done" onBlur={this.callIsBlur1} onFocus={this.callIsFucused1} ref="otp1" style={[styles.otpInput, { borderColor: this.state.InpborderColor1 }]} onChangeText={otp1 => {
								this.setState({ otp1 })
								if (otp1.length == 1) {
									this.refs.otp2.focus();
								}
								if (otp1.length && this.state.otp2.length && this.state.otp3.length && this.state.otp4.length && this.state.otp5 && this.state.otp6) {
									this.setState({ isButtonEnable: true })
								} else {
									this.setState({ isButtonEnable: false })
								}
							}} maxLength={1} value={this.state.otp1} keyboardType="number-pad" />
							<TextInput returnKeyType="done" onBlur={this.callIsBlur2} onFocus={this.callIsFucused2} ref="otp2" style={[styles.otpInput, { borderColor: this.state.InpborderColor2 }]} onChangeText={otp2 => {
								this.setState({ otp2 })
								if (otp2.length == 1) {
									this.refs.otp3.focus();
								}else{
									this.refs.otp1.focus();
								}
								if (this.state.otp1.length && otp2.length && this.state.otp3.length && this.state.otp4.length && this.state.otp5 && this.state.otp6) {
									this.setState({ isButtonEnable: true })
								} else {
									this.setState({ isButtonEnable: false })
								}
							}} maxLength={1} value={this.state.otp2} keyboardType="number-pad" />
							<TextInput returnKeyType="done" onBlur={this.callIsBlur3} onFocus={this.callIsFucused3} ref="otp3" style={[styles.otpInput, { borderColor: this.state.InpborderColor3 }]} onChangeText={otp3 => {
								this.setState({ otp3 })
								if (otp3.length == 1) {
									this.refs.otp4.focus();
								}else{
									this.refs.otp2.focus();
								}
								if (this.state.otp1.length && this.state.otp2.length && otp3.length && this.state.otp4.length && this.state.otp5 && this.state.otp6) {
									this.setState({ isButtonEnable: true })
								} else {
									this.setState({ isButtonEnable: false })
								}
							}} maxLength={1} value={this.state.otp3} keyboardType="number-pad" />
							<TextInput returnKeyType="done" onBlur={this.callIsBlur4} onFocus={this.callIsFucused4} ref="otp4" style={[styles.otpInput, { borderColor: this.state.InpborderColor4 }]} onChangeText={otp4 => {
								this.setState({ otp4 })
								if (otp4.length == 1) {
									this.refs.otp5.focus();
								}else{
									this.refs.otp3.focus();
								}
								if (this.state.otp1.length && this.state.otp2.length && this.state.otp3.length && otp4.length && this.state.otp5 && this.state.otp6) {
									this.setState({ isButtonEnable: true })
								} else {
									this.setState({ isButtonEnable: false })
								}
							}} maxLength={1} value={this.state.otp4} keyboardType="number-pad" />

<TextInput returnKeyType="done" onBlur={this.callIsBlur5} onFocus={this.callIsFucused5} ref="otp5" style={[styles.otpInput, { borderColor: this.state.InpborderColor5 }]} onChangeText={otp5 => {
								this.setState({ otp5 })
								if (otp5.length == 1) {
									this.refs.otp6.focus();
								}else{
									this.refs.otp4.focus();
								}
								if (this.state.otp1.length && this.state.otp2.length && this.state.otp3.length && this.state.otp4.length && otp5 && this.state.otp6) {
									this.setState({ isButtonEnable: true })
								} else {
									this.setState({ isButtonEnable: false })
								}
							}} maxLength={1} value={this.state.otp5} keyboardType="number-pad" />

<TextInput returnKeyType="done" onBlur={this.callIsBlur6} onFocus={this.callIsFucused6} ref="otp6" style={[styles.otpInput, { borderColor: this.state.InpborderColor6 }]} onChangeText={otp6 => {
								this.setState({ otp6 })
								if (otp6.length == 0) {
									this.refs.otp5.focus();
								}
								if (this.state.otp1.length && this.state.otp2.length && this.state.otp3.length && this.state.otp4.length && this.state.otp5 && otp6 ) {
									this.setState({ isButtonEnable: true })
								} else {
									this.setState({ isButtonEnable: false })
								}
							}} maxLength={1} value={this.state.otp6} keyboardType="number-pad" />
						</View> :
							<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5) }}>
								<TextInput returnKeyType="done" style={{ flex: 1, borderRadius: 4, borderColor: Color.otpInputBorder, borderWidth: 1, height: responsiveHeight(6), padding: 0, fontSize: CustomFont.font16, color: Color.fontColor, textAlign: 'center' }}
									onChangeText={otp => {
										this.setState({ otp });
										this.setState({ isButtonEnable: true })
									}} maxLength={6} keyboardType={'phone-pad'} value={this.state.otp} textContentType="oneTimeCode"/>
							</View>}

						<TouchableOpacity style={{ borderWidth: this.state.buttonBorderWidth, borderColor: Color.buttonBorderColor, height: responsiveHeight(6), backgroundColor: this.state.isButtonEnable ? Color.primary : Color.lightgray, alignItems: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop: responsiveHeight(4) }}
							onPress={() => this.state.isButtonEnable ? this.verifyOTP() : Snackbar.show({
								text: 'Please enter OTP',
								duration: Snackbar.LENGTH_SHORT,
								backgroundColor: Color.primary
							})
							}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Verify</Text>
						</TouchableOpacity>

						<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(4) }}>
							{this.state.resentBtnType ? <TouchableOpacity style={{ backgroundColor: Color.googleLoginBtn, width: '100%', height: responsiveHeight(6), alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}><Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primary }}>Resend OTP in {this.state.showOtpTime}s</Text></TouchableOpacity> :
								<TouchableOpacity onPress={() => this.resentOTP()} style={{ backgroundColor: Color.googleLoginBtn, width: '100%', height: responsiveHeight(6), alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primary, padding: 5 }}>Resend OTP</Text>
								</TouchableOpacity>

							}

						</View>
					</View>


					<Modal isVisible={this.state.otpMessage} onRequestClose={() => this.setState({ otpMessage: false })}>
						<View style={[styles.modelViewMessage2]}>
							<Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
							<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
								{this.state.otpVerifyResponse}
							</Text>
							<TouchableOpacity
								onPress={() => {
									this.setState({ otpMessage: false });
								}}
								style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
							</TouchableOpacity>
						</View>
					</Modal>
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
)(OtpVerification);