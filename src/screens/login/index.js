import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity
} from 'react-native';
import styles from './style';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import editfile from '../../../assets/editfile.png';
import eye from '../../../assets/eye.png';
import eyeClose from '../../../assets/eyeClose.png';

import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize, useResponsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
//import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from 'react-native-encrypted-storage';
import { setLogin } from "../../service/Analytics";
import { sha256 } from 'js-sha256';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
//const siteKey = '6LdF8l4hAAAAAKXZpDzi1AxVbBcJiA9mEMhN0ubL';
const siteKey = '6LfLL-wiAAAAAJ-GVkmQY1DgC2bTXKg-61bnmFB9';
const baseUrl = 'localhost://127.0.0.1';
import CryptoJS from "react-native-crypto-js";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			passwordShowStatus: true,
			alertTxt: '',
			inputBorderColor: Color.inputdefaultBorder,
		};
	}
	async componentDidMount() {
	}
	toggleSwitch = () => {
		this.setState({ isEnabled: !this.state.isEnabled })
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'login') {
				if (newProps.responseData.statusMessage === 'Success' && newProps.responseData.accessToken) {
					let { actions, signupDetails } = this.props;
					signupDetails.accessToken = newProps.responseData.accessToken;
					signupDetails.UserGuid = newProps.responseData.data.userInfo.userGuid;
					signupDetails.password = this.state.password;
					actions.setSignupDetails(signupDetails);
					await AsyncStorage.setItem('password', CryptoJS.AES.encrypt(this.state.password, 'MNKU').toString())
					await AsyncStorage.setItem('loginId',  CryptoJS.AES.encrypt(signupDetails.userLoginId, 'MNKU').toString());
					await AsyncStorage.setItem('accessToken',CryptoJS.AES.encrypt(newProps.responseData.accessToken, 'MNKU').toString());
					await AsyncStorage.setItem('userGuid',CryptoJS.AES.encrypt(newProps.responseData.data.userInfo.userGuid, 'MNKU').toString());
					Snackbar.show({ text: 'Login successful', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
					this.props.navigation.navigate('DoctorHome');
					//this.props.navigation.navigate('ChooseClinic',{from:'login'});
					setLogin("email")
				} else {
					//alert(newProps.responseData.statusMessage)
					if(newProps.responseData.data && newProps.responseData.data.isCapchaShow){
						this.captchaForm.show();
					}
					
					//alert(newProps.responseData.statusMessage)
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}, 500);
				}

			}
		}
	}
	clickOnLogin = () => {
		if (!this.state.password) {
			this.setState({ alertTxt: 'Please enter password' })
		} else {
			let { actions, signupDetails } = this.props;
			var encrtpPass = sha256(this.state.password);
			var finalPass = sha256(encrtpPass+signupDetails.salt);

// 			let ciphertext = CryptoJS.AES.encrypt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ijc3ZjBkZGRkLTNkN2QtMTFlZC1hZGI0LTQwYzYyNDVlNmUwZCIsIm5iZiI6MTY2NDE4NDQ5OCwiZXhwIjoxNjk1NzIwNDk4LCJpYXQiOjE2NjQxODQ0OTh9.IiDjCowaSlMwELuE5vJsSKZASPPCws4khUCnfAnw57E', 'MNKU').toString();
// console.log('---------enc-----'+ciphertext)
// 						let bytes  = CryptoJS.AES.decrypt(ciphertext,'MNKU');
// 						let originalText = bytes.toString(CryptoJS.enc.Utf8);
// 						console.log('-----decrypt-------'+originalText); 
// let decVal=CryptoJS.AES.decrypt('03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4','MNKU').toString(CryptoJS.enc.Utf8);
// console.log('-----original value-------'+decVal); 
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"Version": "",
				"Data": {
					"UserName": signupDetails.userLoginId,
					"Password": finalPass
				}
			};
			actions.callLogin('V1/FuncForDrAppToLoginWithPassword_V2', 'post', params, signupDetails.accessToken, 'login');
		}
	}
	encryptData = async (text, key) => {
		const iv = await Aes.randomKey(16);
		const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
		return ({
			cipher,
			iv,
		});
	}
	
	onFocusCall = () => {
		this.setState({ inputBorderColor: Color.primary })
	}
	onBlurCall = () => {
		this.setState({ inputBorderColor: Color.inputdefaultBorder })
	}
	onMessage = event => {
		if (event && event.nativeEvent.data) {
		   if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
			//    this.captchaForm.hide();
			//    this.setState({showLoginBtn : true})
			//   Snackbar.show({ text: 'Please verify captcha first', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			  return;
		   } else {
			   //console.log('Verified code from Google', event.nativeEvent.data);
			   setTimeout(() => {
				   this.captchaForm.hide();
			   }, 500);
		   }
	   }
   };
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1 }}>
					<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
					<View style={{ flex: 1, margin: responsiveWidth(6), marginTop: responsiveWidth(3) }}>
						<TouchableOpacity  style={{ marginTop: responsiveHeight(3) }} >
							<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
						</TouchableOpacity>

						{/* <View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(-4) }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ height: responsiveFontSize(6), width: responsiveFontSize(6), justifyContent: 'center', alignItems: 'center' }} >
							<Image source={CrossIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} />
						</TouchableOpacity>
					</View> */}
						<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font24, color: Color.fontColor, marginTop: 10, }}>Login</Text>


						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(4) }}>Primary Phone Number</Text>
						<View style={{ backgroundColor: Color.phoneNumberBg, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(1), alignItems: 'center', height: responsiveHeight(6) }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: 10 }}>{'+91-' + signupDetails.userLoginId}</Text>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('GetStarted')}>
								<Image source={editfile} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), marginRight: 10, marginLeft: 10 }} onPress={() => this.props.navigation.navigate('GetStarted')} />
							</TouchableOpacity>
						</View>

						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(6) }}>Password</Text>

						<View style={{ marginTop: responsiveHeight(1.5) }}>
							<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(1.3), right: responsiveWidth(2.6), zIndex: 5 }} onPress={() => this.setState({ passwordShowStatus: !this.state.passwordShowStatus })} >
								<Image source={this.state.passwordShowStatus ? eye : eyeClose} style={{height:responsiveFontSize(2),width:responsiveFontSize(2),resizeMode:'contain',marginTop:responsiveHeight(.8),tintColor:Color.primary}}/>
							</TouchableOpacity>
							<TextInput returnKeyType="done" onFocus={this.onFocusCall} onBlur={this.onBlurCall} style={{
								borderColor: this.state.inputBorderColor, borderWidth: 1, borderRadius: 4, height: responsiveHeight(5.8),
								fontSize: CustomFont.font16, paddingLeft: responsiveWidth(1.5), paddingRight: responsiveWidth(10),color:Color.fontColor
							}} secureTextEntry={this.state.passwordShowStatus} onChangeText={password => {
								this.setState({ password });
								if (password.length > 0)
									this.setState({ alertTxt: '' });
							}} placeholder="Enter password" placeholderTextColor = {Color.placeHolderColor} />
							<Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.alertTxt}</Text>
						</View>

						<TouchableOpacity style={styles.loginBtn1} onPress={this.clickOnLogin}>
							<Text style={{ color: Color.white, fontWeight: 'bold', fontSize: CustomFont.font16 }}>Login</Text>
						</TouchableOpacity>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(6) }}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgetPassword')}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary }}>Forgot password?</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('LoginWithOtp')}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary }}>Login with OTP</Text>
							</TouchableOpacity>

						</View>
					</View>
					<View style = {{}}>
				<ConfirmGoogleCaptcha
                    ref={_ref => this.captchaForm = _ref}
                    siteKey={siteKey}
                    baseUrl={baseUrl}
                    languageCode='en'
                    onMessage={this.onMessage}
					cancelButtonText = ''
                />

					</View>
				</View>
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
)(Login);
