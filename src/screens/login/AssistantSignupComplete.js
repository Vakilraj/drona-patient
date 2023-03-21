import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Alert
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
import { ScrollView } from 'react-native-gesture-handler';
import { setLogEvent } from '../../service/Analytics';
let AssistanceGuid = null, AssistanceUserGuid = null;
class AssistantSignupComplete extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			passwordAlert: '',
			confPasswordAlert: '',
			genderAlert: '',
			pwBorderColor: Color.inputdefaultBorder,
			cPWBorderColor: Color.inputdefaultBorder,
			emailBorderColor: Color.inputdefaultBorder,

			isMale: false,
			isFemale: false,
			isOther: false,
			emailId: '',
			keyboardAvoid:0

		};
	}

	toggleSwitch = () => {
		this.setState({ isEnabled: !this.state.isEnabled })
	}
	componentDidMount() {
		let { actions, signupDetails } = this.props;
		let params = {
			"DoctorGuid": null,
			"ClinicGuid": null,
			"UserGuid": signupDetails.UserGuid,
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetAssistantProfile', 'post', params, signupDetails.accessToken, 'getEditAssistanceDetailsOnBoarding');
		
	}
	clickOnReset = () => {
		if (!this.state.firstName) {
			this.setState({ passwordAlert: 'Please enter firstName' })
		} else if (!this.state.lastName) {
			this.setState({ confPasswordAlert: 'Please enter confirm firstName' })
		} else if (!this.state.isMale && !this.state.isFemale && !this.state.isOther) {
			this.setState({ genderAlert: 'Please select gender' })
		} else {

			let { actions, signupDetails } = this.props;
			let params = {
				"ClinicGuid": null,
				"DoctorGuid": null,
				"UserGuid": signupDetails.UserGuid,
				"Data": {
					"AssistanceFirstName": this.state.firstName.trim(),
					"AssistanceMiddleName": null,
					"AssistanceLastName": this.state.lastName.trim(),
					"Email": this.state.emailId,
					"PhoneNo": signupDetails.mobile,
					"GenderCode": this.state.isMale ? 'M' : this.state.isFemale ? 'F' : 'O',
					"AssistanceUserGuid": AssistanceUserGuid,
					"AssistanceGuid": AssistanceGuid,
				}
			}
			actions.callLogin('V1/FuncForDrAppToUpdateAssistantProfile', 'post', params, signupDetails.accessToken, 'addUpdateAssistanceDetailsOnboarding');
			setLogEvent("assistant_signUp", { "continue": "click", UserGuid: signupDetails.UserGuid, })
		}
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'addUpdateAssistanceDetailsOnboarding') {
				//console.log(JSON.stringify(newProps.responseData));
				if (newProps.responseData.statusCode == '0') {
					this.props.navigation.navigate('DoctorHome');
				} else {
					//alert(newProps.responseData.statusMessage)
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}, 500);
				}

			} else if (tagname === 'getEditAssistanceDetailsOnBoarding') {
				let data = newProps.responseData.data;
				this.setState({
					firstName: data.assistanceFirstName,
					lastName: data.assistanceLastName,
					emailId: data.email
				})
				if (data.genderCode) {
					if (data.genderCode == 'M') {
						this.setState({ isMale: true });
					} else if (data.genderCode == 'F') {
						this.setState({ isFemale: true });
					} else if (data.genderCode == 'O') {
						this.setState({ isOther: true });
					}
				}
				AssistanceGuid = data.assistanceGuid;
				AssistanceUserGuid = data.assistanceUserGuid;
			}
		}
	}

	callOnFocus = (type) => {
		if (type == 'pw') {
			this.setState({ pwBorderColor: Color.primary,keyboardAvoid:-400 })
		} else if (type == 'email') {
			this.setState({ emailBorderColor: Color.primary,keyboardAvoid:Platform.OS=='ios' ?0 : responsiveHeight(-20) })
		}
		else {
			this.setState({ cPWBorderColor: Color.primary,keyboardAvoid:-400 })
		}

	}
	callOnBlur = (type) => {
		if (type == 'pw') {
			this.setState({ pwBorderColor: Color.inputdefaultBorder })
		} else if (type == 'email') {
			this.setState({ emailBorderColor: Color.inputdefaultBorder })
		}
		else {
			this.setState({ cPWBorderColor: Color.inputdefaultBorder })
		}
	}

	clickGender = (gender) => {
		if (gender === 'male') {
			this.setState({ isMale: true, isFemale: false, isOther: false })
		} else if (gender === 'female') {
			this.setState({ isMale: false, isFemale: true, isOther: false })
		}
		else {
			this.setState({ isMale: false, isFemale: false, isOther: true })
		}
		this.setState({ genderAlert: '' });
	}

	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={this.state.keyboardAvoid}>
					<ScrollView><View style={{ flex: 1, backgroundColor: Color.white, margin: responsiveWidth(0) }}>
						<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
						<View style={{ margin: responsiveHeight(3.5) }}>
							<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 25, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font24, color: Color.fontColor }}>Create Your Profile</Text>

							<Text style={{ fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.feesHeadTxt, marginTop: responsiveHeight(3) }}>First Name*</Text>

							<View>
								<View style={{ marginTop: responsiveHeight(1) }}>

									<TextInput returnKeyType="done" onFocus={() => this.callOnFocus('pw')} onBlur={() => this.callOnBlur('pw')} style={{
										borderColor: this.state.pwBorderColor, borderWidth: 1, borderRadius: 6, height: responsiveHeight(6),
										fontSize: CustomFont.font14, paddingLeft: responsiveWidth(5), paddingRight: responsiveWidth(10), color: Color.fontColor
									}} onChangeText={firstName => {
										this.setState({ firstName });
										if (firstName.length > 0)
											this.setState({ passwordAlert: '' });
									}} placeholder="First Name"
										placeholderTextColor={Color.placeHolderColor} value={this.state.firstName} />
									<Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.passwordAlert}</Text>
								</View>

								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.feesHeadTxt, marginTop: responsiveHeight(1.4) }}>Last Name*</Text>
								<View style={{ marginTop: responsiveHeight(1) }}>

									<TextInput returnKeyType="done" onFocus={() => this.callOnFocus('cpw')} onBlur={() => this.callOnBlur('cpw')} style={{
										borderColor: this.state.cPWBorderColor, borderWidth: 1, borderRadius: 6, height: responsiveHeight(6),
										fontSize: CustomFont.font14, paddingLeft: responsiveWidth(5), paddingRight: responsiveWidth(10), color: Color.fontColor
									}} onChangeText={lastName => {
										this.setState({ lastName });
										if (lastName.length > 0)
											this.setState({ confPasswordAlert: '' });
									}} placeholder="Last Name"
										placeholderTextColor={Color.placeHolderColor} value={this.state.lastName} />
									<Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.confPasswordAlert}</Text>
								</View>

								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.feesHeadTxt, marginTop: responsiveHeight(1.4) }}>Gender*</Text>
								<View style={{ flexDirection: 'row', marginTop: 7, marginRight: responsiveWidth(10) }}>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), borderRadius: 4, borderWidth: 1, borderColor: this.state.isMale ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isMale ? Color.accountTypeSelBg : Color.white }} onPress={() => this.clickGender('male')}>
										<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14 }}>Male</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), borderRadius: 4, borderWidth: 1, borderColor: this.state.isFemale ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isFemale ? Color.accountTypeSelBg : Color.white, marginLeft: 10, marginRight: 10 }} onPress={() => this.clickGender('female')}>
										<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, }}>Female</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), borderRadius: 4, borderWidth: 1, borderColor: this.state.isOther ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isOther ? Color.accountTypeSelBg : Color.white }} onPress={() => this.clickGender('other')}>
										<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, }}>Other</Text>
									</TouchableOpacity>
								</View>
								<Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red, marginTop: 3 }}>{this.state.genderAlert}</Text>

								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.feesHeadTxt, marginTop: responsiveHeight(1.4) }}>Mobile Number</Text>
								<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(1.2), backgroundColor: Color.bgColor, padding: responsiveWidth(4), borderRadius: 6 }}>{signupDetails.mobile}</Text>

								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.feesHeadTxt, marginTop: responsiveHeight(1.4) }}>Email Id</Text>
								<View style={{ marginTop: responsiveHeight(1) }}>

									<TextInput returnKeyType="done" onFocus={() => this.callOnFocus('email')} onBlur={() => this.callOnBlur('email')} style={{
										borderColor: this.state.emailBorderColor, borderWidth: 1, borderRadius: 6, height: responsiveHeight(6),
										fontSize: CustomFont.font14, paddingLeft: responsiveWidth(5), paddingRight: responsiveWidth(10), color: Color.fontColor
									}} onChangeText={emailId => {
										this.setState({ emailId });
									}} placeholder="Email Id"
										placeholderTextColor={Color.placeHolderColor} value={this.state.emailId} />
								</View>


								<TouchableOpacity style={styles.loginBtn1} onPress={this.clickOnReset}>
									<Text style={{ color: Color.white, fontWeight: CustomFont.fontWeight600, fontSize: CustomFont.font14 }}>Continue</Text>
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
)(AssistantSignupComplete);
