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
import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import eye from '../../../assets/eye.png';
import eyeClose from '../../../assets/eyeClose.png';
import { setLogEvent } from '../../service/Analytics';
let weekPasssList=[{weekPasswordGuid:'', weekPasswordName:'Test@123'},];
import { sha256 } from 'js-sha256';
let getOtp=''
class AssistantPasswordSetup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			confPassword: '',
			passwordShowStatus: true,
			passwordShowStatusConf: true,
			passwordAlert: '',
			confPasswordAlert: '',
			pwBorderColor: Color.inputdefaultBorder,
			cPWBorderColor: Color.inputdefaultBorder,

		};
	}

	toggleSwitch = () => {
		this.setState({ isEnabled: !this.state.isEnabled })
	}
	componentDidMount() {
		let { actions, signupDetails } = this.props;
		getOtp = this.props.navigation.state.params.otp;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": null,
			"ClinicGuid": null,
			version: null,
			Data: null
		};
		actions.callLogin('V1/FuncForDrAppToGetWeekPasswordList', 'post', params, 'token', 'GetWeekPass');
	}
	clickOnReset = () => {

		if (!this.state.password) {
			this.setState({ passwordAlert: 'Please enter password' })
		} else if (!this.state.confPassword) {
			this.setState({ confPasswordAlert: 'Please enter confirm password' })
		} else if (this.state.password != this.state.confPassword) {
			this.setState({ confPasswordAlert: 'Passwords do not match' })
		}else if (weekPasssList.some(item => item.weekPasswordName == this.state.password)) {
			this.setState({ confPasswordAlert: 'Please do not use common password' })
		} else {
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"Data": {
					"userGuid": signupDetails.UserGuid,
					"userName": signupDetails.mobile,    // Only mobile number is required. It will not work if email passed.
					"password": sha256(this.state.password),
					"confirmPassword": sha256(this.state.password),
					"mobileNo": signupDetails.mobile,
					"isGoogleSignIn": false,
					"isRegistered": true,
					"isActive": true,
					"userInfo": '',
					"otp":sha256(getOtp)
				}
			};
			//console.log(JSON.stringify(params));
			actions.callLogin('V11/FuncForDrAppToResetPassword', 'post', params, signupDetails.accessToken, 'setPasswordAssistant');
			setLogEvent("assistant_change_password", { "reset_password": "click", UserGuid: signupDetails.UserGuid, })

		}
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'setPasswordAssistant') {
				//console.log(JSON.stringify(newProps.responseData));
				if (newProps.responseData.statusCode == '-1') {
					this.props.navigation.navigate('AssistantSignupComplete');
				} else {
					//alert(newProps.responseData.statusMessage)
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}, 500);
				}

			}else if(tagname=='GetWeekPass'){
				if(newProps.responseData.data)
				weekPasssList=newProps.responseData.data;
			}
		}
	}

	callOnFocus = (type) => {
		if (type == 'pw') {
			this.setState({ pwBorderColor: Color.primary })
		}
		else {
			this.setState({ cPWBorderColor: Color.primary })
		}

	}
	callOnBlur = (type) => {
		if (type == 'pw') {
			this.setState({ pwBorderColor: Color.inputdefaultBorder })
		}
		else {
			this.setState({ cPWBorderColor: Color.inputdefaultBorder })
		}
	}
	checkConfpass = (text) =>
	{
		if (this.state.password != text)
		{
			this.setState({confPasswordAlert: 'Password do not match'})
		}
		else{
			this.setState({confPasswordAlert: ''});
		}
		this.setState({confPassword:text});
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.white, margin: responsiveWidth(0) }}>
					<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
					<View style={{ margin: responsiveHeight(3.5) }}>
						<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

						<Text style={{ fontFamily: CustomFont.fontName, marginTop: 25, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font24, color: Color.fontColor }}>Setup Password</Text>
						
						<Text style={{ fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.patientTextColor, marginTop: responsiveHeight(3) }}>New Password</Text>

						<View style={{ marginTop: responsiveHeight(1.5) }}>
						<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(1.3), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ passwordShowStatus: !this.state.passwordShowStatus })} >
						<Image source={this.state.passwordShowStatus ? eye : eyeClose} style={{height:responsiveFontSize(2),width:responsiveFontSize(2),resizeMode:'contain',marginTop:responsiveHeight(.8),tintColor:Color.primary}}/>
							</TouchableOpacity>

							<TextInput returnKeyType="done" onFocus={() => this.callOnFocus('pw')} onBlur={() => this.callOnBlur('pw')} style={{
								borderColor: this.state.pwBorderColor, borderWidth: 1, borderRadius: 6, height: responsiveHeight(6),
								fontSize: CustomFont.font14, paddingLeft: responsiveWidth(5), paddingRight: responsiveWidth(10),color:Color.feesHeadTxt,color:Color.fontColor
							}} secureTextEntry={this.state.passwordShowStatus} onChangeText={password => {
								this.setState({ password });
								if (password.length > 0)
									this.setState({ passwordAlert: '' });
							}} placeholder="New Password"
								placeholderTextColor={Color.placeHolderColor} />
							<Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.passwordAlert}</Text>
						</View>
						<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(2) }}>Confirm New Password</Text>

						<View style={{ marginTop: responsiveHeight(1.5) }}>
						<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(1.3), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ passwordShowStatusConf: !this.state.passwordShowStatusConf })} >
						<Image source={this.state.passwordShowStatusConf ? eye : eyeClose} style={{height:responsiveFontSize(2),width:responsiveFontSize(2),resizeMode:'contain',marginTop:responsiveHeight(.8),tintColor:Color.primary}}/>
							</TouchableOpacity>
							<TextInput returnKeyType="done" onFocus={() => this.callOnFocus('cpw')} onBlur={() => this.callOnBlur('cpw')} style={{
								borderColor: this.state.cPWBorderColor, borderWidth: 1, borderRadius: 6, height: responsiveHeight(6),
								fontSize: CustomFont.font14, paddingLeft: responsiveWidth(5), paddingRight: responsiveWidth(10),color:Color.feesHeadTxt
							}} secureTextEntry={this.state.passwordShowStatusConf} onChangeText={text => this.checkConfpass(text)}
							 placeholder="Re-enter New Password"
								placeholderTextColor={Color.placeHolderColor} />
							<Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.confPasswordAlert}</Text>
						</View>

						{/* <TouchableOpacity onPress={() => this.props.navigation.navigate('TermsofUseDetails', { item: null })}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, marginTop: responsiveHeight(1), color: Color.optiontext }}>By continuing, you agree to the <Text style={{ color: Color.primary, fontWeight: 'bold' }}>Terms & Conditions</Text>  </Text>
						</TouchableOpacity> */}

						<TouchableOpacity style={styles.loginBtn1} onPress={this.clickOnReset}>
							<Text style={{ color: Color.white, fontWeight: CustomFont.fontWeight600, fontSize: CustomFont.font14 }}>Continue</Text>
						</TouchableOpacity>
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
)(AssistantPasswordSetup);
