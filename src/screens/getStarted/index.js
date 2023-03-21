import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, ActivityIndicator, Platform
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Splash from '../../splashscreen';
import Validator from '../../components/Validator';
import Loader from '../../components/Loader';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import cross_txt from '../../../assets/cross_txt.png';

import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import RNExitApp from 'react-native-exit-app';
import Modal from 'react-native-modal';
//import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from 'react-native-encrypted-storage';
import CryptoJS from "react-native-crypto-js";
class GetStarted extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileOrEmail: '',
			closeIconShow: false,
			alertTxt: '',
			isButtonEnable: false,
			isModalVisible: false,
			borderColor: Color.inputdefaultBorder,
			showSplash: true,
			//isloadingLocal: false
		};

	}
	async componentDidMount() {
		
		const profile_complete = await AsyncStorage.getItem('profile_complete');
		//alert(profile_complete)
		if (profile_complete === 'profile_complete') {
			const userGuid = await AsyncStorage.getItem('userGuid');
			const accessToken = await AsyncStorage.getItem('accessToken');
			//console.log('--------'+userGuid)
			let { actions, signupDetails } = this.props;
			let userIdAfterDecrypt='';
			let accessTokenAfterDecrept='';
			try {
				 userIdAfterDecrypt=CryptoJS.AES.decrypt(userGuid,'MNKU').toString(CryptoJS.enc.Utf8);
				 accessTokenAfterDecrept=CryptoJS.AES.decrypt(accessToken,'MNKU').toString(CryptoJS.enc.Utf8);
			} catch (error) {
				
			}
			signupDetails.UserGuid = userIdAfterDecrypt ? userIdAfterDecrypt : userGuid;
			signupDetails.accessToken = accessTokenAfterDecrept ? accessTokenAfterDecrept :accessToken;
			signupDetails.clinicGuid = await AsyncStorage.getItem('clinicGuid');
			signupDetails.doctorGuid =await AsyncStorage.getItem('doctorGuid');
			signupDetails.roleCode = await AsyncStorage.getItem('roleCode');
			actions.setSignupDetails(signupDetails);
			this.props.navigation.navigate('DoctorHome');
			this.setState({ showSplash: false })
		} else {
			this.setState({ showSplash: false })
		}

	}
	editPhone = (text) => {
		text = text.trim()
		if (text) {
			this.setState({ closeIconShow: true });
				if (Validator.isDecimal(text)) {
					//this.setState({ isButtonEnable: true });
					this.setState({ alertTxt: '' });
					this.setState({mobileOrEmail: text});
					if (text.length == 10) {
						this.setState({ isButtonEnable: true });
					} else {
						this.setState({ isButtonEnable: false });
					}
				} else {
					this.setState({ alertTxt: 'Please enter numbers only' });
					this.setState({ isButtonEnable: false });
				}
		} else {
			this.setState({mobileOrEmail: text});
			this.setState({ closeIconShow: false, isButtonEnable: false });
		}
		//this.setState({ mobileOrEmail: text, alertTxt: '' });
	}
	continueBtn = () => {
		if (!this.state.mobileOrEmail) {
			this.setState({ borderColor: Color.inputErrorBorder })
			this.setState({ alertTxt: 'Please enter mobile number ' });
		}else if (!Validator.isMobileValidate(this.state.mobileOrEmail)) {
			this.setState({ alertTxt: 'Please enter 10 digit valid mobile number' });
		}else if (this.state.mobileOrEmail.length != 10) {
			this.setState({ alertTxt: 'Please enter 10 digit valid mobile number' });
		}else{
			this.GoToNextScreen('normal', '', 'mobile');
		}
		// if (this.state.mobileOrEmail) {
		// 	if (this.state.mobileOrEmail.length == 10) {
		// 		this.GoToNextScreen();
		// 	} else {
		// 		this.setState({ alertTxt: 'Please enter 10 digit valid mobile number' });
		// 	}
		// 	//}
		// } else {
		// 	this.setState({ borderColor: Color.inputErrorBorder })
		// 	this.setState({ alertTxt: 'Please enter email or mobile number ' });
		// }

	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			//this.refs.loadingRef.hide();
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			// if(loading){
			// 	setTimeout(()=>{
			// 		this.setState({ isloadingLocal: !this.state.isloadingLocal });
			// 		setTimeout(() => {
			// 			if (this.state.isloadingLocal)
			// 				this.setState({ isloadingLocal: false });
			// 		}, 2000)
			// 	},2000)
				
			// }else{
			// 	this.setState({ isloadingLocal: false });
			// }
			if (tagname === 'getStarted') {
				let roleCode = newProps.responseData.data.roleCode;

				try {
					signupDetails.salt = newProps.responseData.data.passwordSalt;
					signupDetails.roleCode = roleCode;
					signupDetails.UserGuid = newProps.responseData.data.userGuid;
					signupDetails.mobile = newProps.responseData.data.mobileNo;
					actions.setSignupDetails(signupDetails);
				} catch (e) { }
				if (roleCode == 10) {  // 10 for dr. And 70 for assistant
					let isRegistered = newProps.responseData.data.isRegistered;
					let isActive = newProps.responseData.data.isActive;
					let isSubscribed = newProps.responseData.data.isSubscribed;
					let isOnBoardingComplete = newProps.responseData.data.isOnBoardingComplete; //true;//

					if (!isRegistered) {
						this.props.navigation.navigate('createAccount');
					} else if (!isActive) {
						this.props.navigation.navigate('OtpVerification', { from: 'normal' });
					} else if (!isSubscribed) {
						this.props.navigation.navigate('OtpVerification', { from: 'member' });
					}
					else if (!isOnBoardingComplete) {
						this.props.navigation.navigate('OtpVerification', { from: 'clinicSetup' });
					} else {
						this.props.navigation.navigate('LoginWithOtp'); //BecomeAMember LoginWithOtp
					}
				} else {
					// For Assistant
					let isFirstTimeLogin = newProps.responseData.data.isFirstTimeLogin;
					signupDetails.isAssistantUser = true;
					actions.setSignupDetails(signupDetails);
					if (isFirstTimeLogin) { //true means first time
						this.props.navigation.navigate('OtpVerification', { from: 'assistant' });
					} else {
						this.props.navigation.navigate('LoginWithOtp');  //'Login'
					}
				}



			}
		}

	}

	GoToNextScreen = () => {
		//this.refs.loadingRef.show();
		let { actions, signupDetails } = this.props;
		signupDetails.userLoginId = this.state.mobileOrEmail;
		signupDetails.fname = '';
		signupDetails.lname = '';
		signupDetails.profilePhoto = '';
		signupDetails.mobile = this.state.mobileOrEmail;;
		actions.setSignupDetails(signupDetails);
		let params = {
			"UserGuid": '',
			"Version": "",
			"Data":
			{
				"username": this.state.mobileOrEmail,
				"isGoogleSignIn": false,
			}
		};
		actions.callLogin('V11/FuncForDrAppToCheckIfAlreadyRegistered', 'post', params, signupDetails.accessToken, 'getStarted');
	}
	callIsFucused = () => {
		this.setState({ borderColor: Color.primary })
	}
	callIsBlur = () => {
		this.setState({ borderColor: Color.inputdefaultBorder })
	}
	render() {
		let { loading } = this.props;
		if (this.state.showSplash)
			return (<View style={{ flex: 1 }}>
				<Splash />
			</View>

			)
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
			{/* <Loader ref="loadingRef" /> */}
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				{loading ? (<Modal transparent={true} animationType="none" visible={loading} style={{ alignItems: 'center' }}>
					<ActivityIndicator size="large" color="#0000ff" style={CommonStyle.loaderStyle} />
				</Modal>
				) : null}
				<View style={{ flex: 1 }}>
					<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
					<View style={{ margin: responsiveWidth(6), flex: 1, marginTop: responsiveWidth(3) }}>

						<TouchableOpacity style={{ marginTop: responsiveHeight(3) }} >
							<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
						</TouchableOpacity>
						<Text style={styles.getstartedTxt}>Welcome Doctor!</Text>
						<Text style={styles.inputlabel}>Enter your mobile number </Text>
						<View style={{ marginTop: responsiveHeight(2) }}>
							<TextInput returnKeyType="done" style={[styles.inputStyle, { borderColor: this.state.borderColor }]}
								placeholder="Enter Mobile Number"
								placeholderTextColor={Color.placeHolderColor}
								onFocus={this.callIsFucused}
								onBlur={this.callIsBlur}
								onChangeText={this.editPhone}
								value={this.state.mobileOrEmail}
								keyboardType={'phone-pad'}
								maxLength={10} />
							{this.state.closeIconShow ? <TouchableOpacity style={{ position: 'absolute', right: responsiveWidth(2.6), top: responsiveHeight(1.5) }} onPress={() => this.setState({ mobileOrEmail: '', closeIconShow: false, alertTxt: '' })}>
								<Image source={cross_txt} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), resizeMode: 'contain', tintColor: Color.primary }} />
							</TouchableOpacity> : null}
							<Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.alertTxt}</Text>
						</View>
						<View style={{alignItems:'center',flexDirection:'row'}}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, marginTop: responsiveHeight(1), color: Color.optiontext }}>By continuing, you agree to the </Text>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('TermsofUseDetails', { item: null })}>
							<Text style={{fontFamily: CustomFont.fontName, fontSize: CustomFont.font11, marginTop: responsiveHeight(1), color: Color.primary, fontWeight: 'bold' }}>Terms & Conditions</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={[styles.continueBtn, { backgroundColor: this.state.isButtonEnable ? Color.primary : Color.lightgray }]} onPress={this.continueBtn}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Continue</Text>
						</TouchableOpacity>
						
{/* <TouchableOpacity style={styles.googleLogin} onPress={() =>this.props.navigation.navigate("CN")}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.googleBorder, fontSize: CustomFont.font16, marginLeft: responsiveWidth(5) }}>Continue to Consult Now Static Design</Text>
						</TouchableOpacity> */}
					</View>
				</View>

				<Modal isVisible={this.state.isModalVisible} >
					<View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Exit DrOnA Health </Text>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Are you sure want to exit? </Text>
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
									RNExitApp.exitApp();
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>OK </Text>
								</TouchableOpacity>
							</View>
						</View>
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
)(GetStarted);