import React from 'react';
import {
	SafeAreaView, View,
	Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, StatusBar, Platform, ScrollView,
} from 'react-native';
import styles from './style';
import CustomFont from '../../components/CustomFont';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import app_icon from '../../../assets/app_icon.png';
import editfile from '../../../assets/editfile.png';
import home_bg from '../../../assets/home_bg.png';
let sliderTimer = null;
import AsyncStorage from 'react-native-encrypted-storage';
import { setLogEvent } from '../../service/Analytics';
import { sha256 } from 'js-sha256';
import CryptoJS from "react-native-crypto-js";
//let countinSec=60;
class LoginWithOtp extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
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
			buttonBorderWidth: 0,
			blockBtnResentOtp: true,
		};
		this._interval=null;
		//countinSec=60;
	}
	componentDidMount() {
	    this.resentOTP();
	}
	startTimer1 = () => {
		try {
			sliderTimer = setInterval(() => {
				try {
					this.setState({ showOtpTime: --this.state.showOtpTime })
					if (this.state.showOtpTime == 0) {
						clearInterval(sliderTimer);
						this.setState({ resentBtnType: false })
					}
				} catch (error) {
					//console.log(error);
				}

			}, 2000);
		} catch (error) {

		}

	}
	startTimer=()=>{
		sliderTimer = setInterval(() => {
			try {
				//countinSec--;
				//console.log('-----------    '+countinSec);
				//if(countinSec%2==0)
				this.setState({ showOtpTime: --this.state.showOtpTime });
				if (this.state.showOtpTime == 0) {
					clearInterval(sliderTimer);
					sliderTimer=null;
					this.setState({ resentBtnType: false })
				}
			} catch (error) {
				//console.log(error);
			}

		}, 1000);
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
		var otp256 = sha256(otp+"");
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Version": "",
			"Data": {
				"OtpValue": otp256,
				"Reference": signupDetails.mobile,
				IsLoginWithOtp: true
			}
		};
		//alert(JSON.stringify(params));
		actions.callLogin('V1/FuncForDrAppToValidateOTP_V2', 'post', params, 'token', 'verifyOtpForLogin');
		setLogEvent("validate_otp", { "validate_OTP_Click": "click", "mobile": signupDetails.mobile })
	}
	resentOTP = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			userGuid: null,
			version: null,

			Data: {
				"Reference": signupDetails.mobile,
				"UserGuid": signupDetails.UserGuid
			}
		};
		actions.callLogin('V11/FuncForDrAppToSaveAndSendOTP', 'post', params, 'token', 'ResentOtpForLogin');
		this.setState({ resentBtnType: true, showOtpTime: 60 })
		//countinSec=60;
		this.startTimer();
		setLogEvent("validate_otp", { "Resend_OTP_Click": "click", "mobile": signupDetails.mobile })
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'verifyOtpForLogin') {
				if (newProps.responseData.statusMessage === 'Success' && newProps.responseData.accessToken) {  // && newProps.responseData.data.isOtpValid
					signupDetails.accessToken = newProps.responseData.accessToken;
					if (newProps.responseData.data && newProps.responseData.data.userInfo) {
						signupDetails.UserGuid = newProps.responseData.data.userInfo.userGuid;
						actions.setSignupDetails(signupDetails);
						await AsyncStorage.setItem('userGuid', CryptoJS.AES.encrypt(newProps.responseData.data.userInfo.userGuid, 'MNKU').toString());
					} else {
						signupDetails.UserGuid = newProps.responseData.data.userGuid;
						actions.setSignupDetails(signupDetails);
						await AsyncStorage.setItem('userGuid', CryptoJS.AES.encrypt(newProps.responseData.data.userGuid, 'MNKU').toString());
					}
					await AsyncStorage.setItem('accessToken', CryptoJS.AES.encrypt(newProps.responseData.accessToken, 'MNKU').toString());
					//this.props.navigation.navigate('DoctorHome',{from:'login'});
					this.props.navigation.navigate('ChooseClinic',{from:'login'});
				} else {
					alert(JSON.stringify(newProps.responseData.statusMessage))
				}
			} else if (tagname === 'ResentOtpForLogin') {
				this.setState({ buttonBorderWidth: 0 })
				Snackbar.show({ text: 'OTP sent. Please verify OTP', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
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
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<KeyboardAvoidingView behavior={'padding'}>
					<ScrollView style={{ backgroundColor: Color.white }} keyboardShouldPersistTaps='always'>
						<View style={{ flex: 1 }}>
							<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
							<View style={{ flex: 1, margin: responsiveWidth(6), marginTop: responsiveWidth(3) }}>
								<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginTop: responsiveHeight(3) }} >
									<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
								</TouchableOpacity>

								<Text style={styles.getstartedTxt}>Verify Mobile Number</Text>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginTop: responsiveHeight(3), color: Color.fontColor }}>Enter the 6-digit OTP sent to your mobile number</Text>

								<View style={{ backgroundColor: Color.phoneNumberBg, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(4), alignItems: 'center', height: responsiveHeight(6) }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: 10 }}>{'+91-' + signupDetails.mobile}</Text>
									<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
										<Image source={editfile} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), marginRight: 10, marginLeft: 10 }} onPress={() => this.props.navigation.navigate('GetStarted')} />
									</TouchableOpacity>
								</View>


								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(7) }}>Enter 6 digit code</Text>
								{Platform.OS === 'android' ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(3) }}>
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
									}} maxLength={1} value={this.state.otp1} keyboardType="number-pad"/>
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
									}} maxLength={1} value={this.state.otp2}  keyboardType="number-pad"/>
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
									}} maxLength={1} value={this.state.otp3}  keyboardType="number-pad"/>
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
									}} maxLength={1} value={this.state.otp4} keyboardType="number-pad"/>

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
										if (this.state.otp1.length && this.state.otp2.length && this.state.otp3.length && this.state.otp4.length && this.state.otp5 && otp6) {
											this.setState({ isButtonEnable: true })
										} else {
											this.setState({ isButtonEnable: false })
										}
									}} maxLength={1} value={this.state.otp6} keyboardType="number-pad" />
								</View> :
									<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3) }}>
										<TextInput returnKeyType="done" style={{ flex: 1, borderRadius: 4, borderColor: Color.otpInputBorder, borderWidth: 1, height: responsiveHeight(6), padding: 0, fontSize: CustomFont.font16, color: Color.fontColor, textAlign: 'center' }}
											onChangeText={otp => {
												this.setState({ otp });
												this.setState({ isButtonEnable: true })
											}} maxLength={6} value={this.state.otp} textContentType="oneTimeCode" keyboardType="number-pad" />
									</View>}

								<TouchableOpacity style={{ borderWidth: this.state.buttonBorderWidth, borderColor: Color.buttonBorderColor, height: responsiveHeight(5.5), backgroundColor: this.state.isButtonEnable ? Color.primary : Color.lightgray, alignItems: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop: responsiveHeight(4) }}
									onPress={() => this.state.isButtonEnable ? this.verifyOTP() : Snackbar.show({
										text: 'Please enter OTP',
										duration: Snackbar.LENGTH_SHORT,
										backgroundColor: Color.primary
									})
									}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Done </Text>
								</TouchableOpacity>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(6) }}>
									<View>
										{this.state.resentBtnType ? <View style={{ height: responsiveHeight(5.5), alignItems: 'center', justifyContent: 'center' }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primary }}>Resend OTP in {this.state.showOtpTime}s</Text>
										</View> :this.state.blockBtnResentOtp ? 
											<TouchableOpacity onPress={() => this.resentOTP()} style={{ height: responsiveHeight(5.5), alignItems: 'center', justifyContent: 'center' }}>
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primary, padding: 5 }}>Resend OTP</Text>
											</TouchableOpacity>:null
										}
									</View>

									<TouchableOpacity style={{ height: responsiveHeight(5.5), alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('Login')}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary }}>Login with password</Text>
									</TouchableOpacity>

								</View>

							</View>
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
)(LoginWithOtp);