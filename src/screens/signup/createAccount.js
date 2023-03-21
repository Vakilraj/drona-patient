import React, { useState } from 'react';
import {
	SafeAreaView, ScrollView,
	View,
	Text, Image, TextInput, TouchableOpacity, StatusBar, PermissionsAndroid, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import CheckBox from '@react-native-community/checkbox';
import Color from '../../components/Colors';
import Validator from '../../components/Validator';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import app_icon from '../../../assets/app_icon.png';
import editfile from '../../../assets/edit_new_blue.png';
import home_bg from '../../../assets/home_bg.png';
import whatsapp from '../../../assets/whatsapp.png';
import eye from '../../../assets/eye.png';
import eyeClose from '../../../assets/eyeClose.png';
//import * as ReadSms from 'react-native-read-sms/ReadSms';
import { setSignUp } from '../../service/Analytics';
let weekPasssList = [{ weekPasswordGuid: '', weekPasswordName: 'Test@123' },]
import { sha256 } from 'js-sha256';

class RegistrationForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fname: '',
			lname: '',
			mobile: '',
			password: '',
			confPass: '',

			fnameAlert: '',
			lnameAlert: '',
			mobileAlert: '',
			passwordAlert: '',
			confPasswordAlert: '',
			email: '',
			emailAlert: '',
			keyboardAvoiding: 0,
			InpborderColor1: Color.inputdefaultBorder,
			InpborderColor2: Color.inputdefaultBorder,
			InpborderColor3: Color.inputdefaultBorder,
			InpborderColor4: Color.inputdefaultBorder,
			InpborderColor5: Color.inputdefaultBorder,
			buttonBorderWidth: 0,
			checkBoxFlag: true,
			passwordShow: true,
			reEnterPasswordShow: true
		};
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": null,
			"DoctorGuid": null,
			"ClinicGuid": null,
			version: null,
			Data: null
		};
		actions.callLogin('V1/FuncForDrAppToGetWeekPasswordList', 'post', params, 'token', 'GetWeekPasswordList');
	}
	setChecked = (val) => {
		if (val === 'Male') {
			this.setState({ male: 'checked', female: 'unchecked', other: 'unchecked' });
		} else if (val === 'Female') {
			this.setState({ male: 'unchecked', female: 'checked', other: 'unchecked' });
		} else {
			this.setState({ male: 'unchecked', female: 'unchecked', other: 'checked' });
		}
	}
	signUp = async () => {
		let { actions, signupDetails } = this.props;
		if (!this.state.fname.trim()) {
			this.setState({ fnameAlert: 'Please enter first name' });
			this.refs.fname.focus();
		} else if (!Validator.isNameValidate(this.state.fname.trim())) {
			this.setState({ fnameAlert: 'Name should contain only alphabets' });
			this.refs.fname.focus();
		} else if (this.state.fname.trim().length < 1) {
			this.setState({ fnameAlert: 'Minimum 1 characters required' });
			this.refs.fname.focus();
		} else if (!this.state.lname.trim()) {
			this.setState({ lnameAlert: 'Please enter last name' });
			this.refs.lname.focus();
		} else if (this.state.lname.trim().length < 1) {
			this.setState({ lnameAlert: 'Minimum 1 characters required' });
			this.refs.lname.focus();
		} else if (!Validator.isNameValidate(this.state.lname.trim())) {
			this.setState({ lnameAlert: 'Name should contain only alphabets' });
			this.refs.lname.focus();
		}
		// else if (signupDetails.normalLoginIdType === 'email' && !this.state.mobile) {
		// 	this.setState({ mobileAlert: 'Please enter mobile number' });
		// 	this.refs.mobile.focus();
		// } else if (signupDetails.normalLoginIdType === 'email' && this.state.mobile.length != 10) {
		// 	this.setState({ mobileAlert: 'Mobile number should be 10 digit' });
		// 	this.refs.mobile.focus();
		// } else if (!Validator.isMobileValidate(this.state.mobile) && signupDetails.normalLoginIdType === 'email') {
		// 	this.setState({ mobileAlert: 'Mobile number should contain only number' });
		// 	this.refs.mobile.focus();
		// }
		else if (!this.state.email) {
			this.setState({ emailAlert: 'Please enter email id' });
			this.refs.mobile.focus();
		} else if (!Validator.isEmailValid(this.state.email)) {
			this.setState({ emailAlert: 'Please enter valid email id' });
			this.refs.mobile.focus();
		}

		else if (!this.state.password) {
			this.setState({ passwordAlert: 'Please enter password' });
			this.refs.pass.focus();
		}else if (this.state.password.length < 8 || !Validator.isStrongPassword(this.state.password)) {
			this.setState({ passwordAlert: 'Password should be minimum 8 characters with 1 uppercase, 1 lowercase, 1 numeric & 1 special character.' });
			this.refs.pass.focus();
		} else if (!this.state.confPass) {
			this.setState({ confPasswordAlert: 'Please enter confirm password' });
			this.refs.confpass.focus();
		} else if (this.state.password != this.state.confPass) {
			this.setState({ confPasswordAlert: 'Passwords do not match' });
		} else if (weekPasssList.some(item => item.weekPasswordName == this.state.password)) {
			this.setState({ confPasswordAlert: 'Please do not use common password' });
		} else {
			signupDetails.fname = this.state.fname.trim();
			signupDetails.lname = this.state.lname.trim();
			signupDetails.email = this.state.email;
			signupDetails.mobile = signupDetails.userLoginId;
			actions.setSignupDetails(signupDetails);
			//if (Platform.OS === 'android') {
			// const hasPermission = await ReadSms.requestReadSMSPermission();
			// if (hasPermission) {
			// 	this.callApi();
			// } else {
			// 	Alert.alert(
			// 		'Need Permission',
			// 		'Need SMS permission to automatic read OTP for mobile verification',
			// 		[
			// 			{
			// 				text: 'Cancel',
			// 				onPress: () => console.log(''),
			// 				style: 'cancel',
			// 			},
			// 			{
			// 				text: 'Okay', onPress: () => {
			// 					this.needPermission();
			// 				},
			// 			},
			// 		],
			// 		{ cancelable: false },
			// 	);
			// }
			// } else {
			// 	this.callApi();
			// }

			this.callApi();
		}
	}
	needPermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_SMS);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				this.callApi();

			} else {
				this.callApi();
			}
		} catch (err) {
			// To handle permission related exception
			console.warn(err);
		}
	}
	callApi = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Version": "",
			"Data": {
				"UserModel": {
					"UserName": signupDetails.userLoginId,
					"Password": sha256(this.state.password),
					"ConfirmPassword": sha256(this.state.confPass),
					"GoogleSignIn": false
				},
				"ProfileModel": {
					"FirstName": this.state.fname.trim(),
					"LastName": this.state.lname.trim(),
					"Email": this.state.email,
					"MobileNo": signupDetails.userLoginId,
					"AllowWhatsappUpdates": this.state.checkBoxFlag
				}
			}
		};
		//console.log(JSON.stringify(params));
		actions.callLogin('V1/FuncForDrAppToRegisterUser', 'post', params, signupDetails.accessToken, 'createAccount');
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'createAccount') {
				if (newProps.responseData.statusMessage === 'Success') {
					let userGuid = newProps.responseData.data && newProps.responseData.data.userModel && newProps.responseData.data.userModel.userGuid ? newProps.responseData.data.userModel.userGuid : null;
					let { actions, signupDetails } = this.props;
					signupDetails.UserGuid = userGuid;
					actions.setSignupDetails(signupDetails);
					this.props.navigation.navigate('OtpVerification', { userGuid: userGuid,from: 'createAccount' });
					setSignUp("email")
				} else {
					alert(newProps.responseData.statusMessage);
				}
			} else if (tagname == 'GetWeekPasswordList') {
				if (newProps.responseData.data)
					weekPasssList = newProps.responseData.data;
				//alert(JSON.stringify(weekPasssList))
			}
		}

	}

	callIsFucused1 = () => {
		this.setState({ keyboardAvoiding: responsiveHeight(-30) })
		this.setState({ InpborderColor1: Color.primary })
	}
	callIsBlur1 = () => {
		this.setState({ InpborderColor1: Color.inputdefaultBorder })
	}
	callIsFucused2 = () => {
		this.setState({ keyboardAvoiding: responsiveHeight(-20) })
		this.setState({ InpborderColor2: Color.primary })
	}
	callIsBlur2 = () => {
		this.setState({ InpborderColor2: Color.inputdefaultBorder })
	}
	callIsFucused3 = () => {
		this.setState({ keyboardAvoiding: 0 })
		this.setState({ InpborderColor3: Color.primary })
	}
	callIsBlur3 = () => {
		this.setState({ InpborderColor3: Color.inputdefaultBorder })
	}

	callIsBlur4 = () => {
		this.setState({ InpborderColor4: Color.inputdefaultBorder })
	}

	callIsBlur5 = () => {
		this.setState({ InpborderColor5: Color.inputdefaultBorder })
	}
	checkConfpass = (text) => {
		if (this.state.password != text) {
			this.setState({ confPasswordAlert: 'Password do not match' })
		}
		else {
			this.setState({ confPasswordAlert: '' });
		}
		this.setState({ confPass: text });
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		//alert(loading)
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} >
					<ScrollView keyboardShouldPersistTaps='always'>
						<View style={{ flex: 1 }}>
							<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
							<View style={{ flex: 1, margin: responsiveWidth(4), marginTop: responsiveWidth(0) }}>
								{/* <View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(-4) }}>
							<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ height: responsiveFontSize(6), width: responsiveFontSize(6), justifyContent: 'center', alignItems: 'center' }} >
								<Image source={CrossIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} />
							</TouchableOpacity>
						</View> */}
								<TouchableOpacity style={{ marginTop: responsiveHeight(3) }} >
									<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
								</TouchableOpacity>
								<Text style={styles.getstartedTxt}>Let’s Create Your Account!</Text>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginTop: responsiveHeight(3), color: Color.patientTextColor }}>Welcome to DrOnA Healthcare, create your account using your email address and mobile number</Text>

								<View style={{ backgroundColor: Color.phoneNumberBg, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(4), alignItems: 'center', height: responsiveHeight(5.5) }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: 10 }}>{'+91-' + signupDetails.userLoginId}</Text>
									<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
										<Image source={editfile} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), marginRight: 10, marginLeft: 10 }} onPress={() => this.props.navigation.navigate('GetStarted')} />
									</TouchableOpacity>
								</View>

								<View>
									{/* <Text style={[styles.labelStyle, { marginTop: responsiveHeight(5) }]}>Email Id *</Text> */}
									<TextInput returnKeyType="done" onBlur={this.callIsBlur3} onFocus={this.callIsFucused3} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor3 }]} placeholder="Email Address *" placeholderTextColor={Color.placeHolderColor} onChangeText={email => {
										if (email) {
											if (Validator.isEmailValid(email.trim())) {
												this.setState({ emailAlert: '' });
											}
											else {
												this.setState({ emailAlert: 'Please enter valid email id' });
											}
											this.setState({ email:email.trim()})
										} else {
											this.setState({ email})
											this.setState({ emailAlert: 'Please enter email id' });
										}
										// this.setState({ email:email.trim() })
										// this.setState({ emailAlert: '' })
										// if(!Validator.isEmailValid(this.state.email))
										// {
										// 	this.setState({ emailAlert: 'Please enter valid email id' })
										// }
									}
									} keyboardType={Platform.OS == 'ios' ? 'email-address' : 'email'}
										ref='mobile' onSubmitEditing={() => this.refs.pass.focus()} value={this.state.email} returnKeyType="done" />
									{this.state.emailAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.emailAlert}</Text> : null}
								</View>
								{/* <Text style={styles.labelStyle}>First Name *</Text> */}
								{/* <TextInput returnKeyType="done" onBlur={this.callIsBlur1} onFocus={this.callIsFucused1} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor1, textTransform:'capitalize' }]} placeholder="First Name *" placeholderTextColor={Color.placeHolderColor} onChangeText={fname => {
									
								    fname = fname.trim() 
									this.setState({ fname })
									if (!fname || Validator.isNameValidate(fname)) {
										this.setState({ fnameAlert: '' })
									} else {
										this.setState({ fnameAlert: 'name should contain only alphabets' })
									}
								}} ref='fname' onSubmitEditing={() => this.refs.lname.focus()} value={this.state.fname} returnKeyType="done" /> */}

								<View style={{ flexDirection: 'row' }}>
									<View style={{ flex: 1, backgroundColor: Color.grayBorder, width: responsiveHeight(4), height: responsiveHeight(6), justifyContent: 'center', marginTop: responsiveHeight(1.8), borderTopLeftRadius: 5, borderBottomLeftRadius: 5, }}><Text style={{ marginLeft: responsiveWidth(2) }}>Dr.</Text></View>
									<View style={{ flex: 11 }}><TextInput returnKeyType="done" onBlur={this.callIsBlur1} onFocus={this.callIsFucused1} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor1,  marginLeft: -3 }]} placeholder="First Name *" placeholderTextColor={Color.placeHolderColor} onChangeText={fname => {

										this.setState({ fname })
										if (!fname || Validator.isNameValidate(fname)) {
											this.setState({ fnameAlert: '' })
										} else {
											this.setState({ fnameAlert: 'Name should contain only alphabets' })
										}
									}} ref='fname' onSubmitEditing={() => this.refs.lname.focus()} value={this.state.fname} /></View>
								</View>

								{this.state.fnameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.fnameAlert}</Text> : null}
								{/* <Text style={styles.labelStyle}>Last Name *</Text> */}
								<TextInput returnKeyType="done" onBlur={this.callIsBlur2} onFocus={this.callIsFucused2} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor2, }]} placeholder="Last Name *" placeholderTextColor={Color.placeHolderColor} onChangeText={lname => {
									this.setState({ lname })
									if (!lname || Validator.isNameValidate(lname)) {
										this.setState({ lnameAlert: '' })
									} else {
										this.setState({ lnameAlert: 'Name should contain only alphabets' })
									}
								}} ref='lname' onSubmitEditing={() => this.refs.mobile.focus()} value={this.state.lname} />
								{this.state.lnameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.lnameAlert}</Text> : null}


								<View>
									<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(3.3), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ passwordShow: !this.state.passwordShow })} >
										<Image source={this.state.passwordShow ? eye : eyeClose} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginTop: responsiveHeight(.7), tintColor: Color.primary }} />
									</TouchableOpacity>
									<TextInput onBlur={this.callIsBlur4} style={[styles.createInputStyle, { zIndex: -999, borderColor: this.state.InpborderColor4 }]} placeholder="Password *"
										onChangeText={password => this.setState({ password, passwordAlert: '' })}
										placeholderTextColor={Color.placeHolderColor}
										secureTextEntry={this.state.passwordShow} ref='pass'
										onSubmitEditing={() => this.refs.confpass.focus()}
										returnKeyType="done"
										onFocus={() => this.setState({ keyboardAvoiding: 0, InpborderColor4: Color.primary })}
									/>
								</View>

								{this.state.passwordAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.passwordAlert}</Text> : null}

								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginTop: responsiveHeight(1.6), color: Color.optiontext }}>Valid format for a password is DroNa@12</Text>
								{/* <Text style={styles.labelStyle}>Confirm Password *</Text> */}
								<View>
									<TextInput onBlur={this.callIsBlur5} style={[styles.createInputStyle, { zIndex: -999, borderColor: this.state.InpborderColor5 }]} placeholder="Re-enter Password *" placeholderTextColor={Color.placeHolderColor} onChangeText={confPass => this.checkConfpass(confPass)}
										secureTextEntry={this.state.reEnterPasswordShow}
										ref='confpass'
										returnKeyType="done"
										onFocus={() => this.setState({
											keyboardAvoiding: responsiveHeight(5),
											InpborderColor5: Color.primary
										})}
									/>
									<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(3.3), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ reEnterPasswordShow: !this.state.reEnterPasswordShow })} >
										<Image source={this.state.reEnterPasswordShow ? eye : eyeClose} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginTop: responsiveHeight(.7), tintColor: Color.primary }} />
									</TouchableOpacity>
									{this.state.confPasswordAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.confPasswordAlert}</Text> : null}
								</View>

								<TouchableOpacity style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }} onPress={() => this.setState({ checkBoxFlag: !this.state.checkBoxFlag })}>
									<CheckBox
										value={this.state.checkBoxFlag}
										onValueChange={(newValue) => {
											this.setState({ checkBoxFlag: newValue })
										}}
										tintColors={{ true: Color.primary, false: Color.unselectedCheckBox }}
										style={{ color: Color.mediumGrayTxt, height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), marginTop: 7 }}
									/>
									<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: 15, marginTop: 3 }}>I agree to receive important updates </Text>

								</TouchableOpacity>
								<TouchableOpacity style={{ flexDirection: 'row', marginLeft: responsiveWidth(12) }} onPress={() => this.setState({ checkBoxFlag: !this.state.checkBoxFlag })}>

									<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor }}>On</Text>
									<Image source={whatsapp} style={{ width: responsiveFontSize(3), height: responsiveFontSize(3), resizeMode: 'contain', marginLeft: 7, marginRight: 5 }} />
									<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold' }}>WhatsApp</Text>

								</TouchableOpacity>
								<TouchableOpacity style={{ marginTop: 10 }} onPress={() => this.props.navigation.navigate('TermsofUseDetails', { item: null })}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(2) }}>By continuing, you agree to the <Text style={{ color: Color.primary }}>Terms & Conditions</Text></Text>
								</TouchableOpacity>

								<TouchableOpacity style={[styles.signUpBtn, { marginTop: responsiveHeight(1.6) }]} onPress={this.signUp}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Sign Up</Text>
								</TouchableOpacity>

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
)(RegistrationForm);