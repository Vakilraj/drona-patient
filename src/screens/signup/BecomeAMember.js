import React, { useState } from 'react';
import { View, Text, Keyboard, TouchableOpacity, Image, BackHandler, SafeAreaView, StatusBar, ScrollView, TextInput, Linking } from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import become_a_member from '../../../assets/become_a_member.png';
import ContactUs from './ContactUs';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import { setLogEvent } from '../../service/Analytics';

import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import steps2 from '../../../assets/steps2.png';
import promoApplied from '../../../assets/promoApplied.png';
import promoError from '../../../assets/promoError.png';
import cross_txt from '../../../assets/cross_txt.png';
import Snackbar from 'react-native-snackbar';

let activationPeriodGuid = '',customerCareNo='';
class BecomeAMember extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			InpborderColor1: Color.inputdefaultBorder,
			closeIconShow: false,
			txtPromocode: '',
			isPromoApplyed: null,

			period: '',
			price: '0',
			netPayprice: '0',
			isBtnEnable:true
		};
	}
	componentDidMount() {
		Keyboard.dismiss(0);
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		let { actions, signupDetails } = this.props;
		let params = {
			"Data": {
				"ListOfFilter": [
					{ "Key": "ActivationPeriodGuid", "Value": null }
				]
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetActivationPackages', 'post', params, signupDetails.accessToken, 'GetActivationPackages');
	}
	callIsFucused1 = () => {
		this.setState({ InpborderColor1: Color.primary })
	}
	callIsBlur1 = () => {
		this.setState({ InpborderColor1: Color.inputdefaultBorder })
	}
	editPhone = (text) => {
		text = text.trim()
		if (text.length > 0) {
			this.setState({ closeIconShow: true });

		} else {
			this.setState({ closeIconShow: false });
		}
		this.setState({ txtPromocode: text });
	}
	ApplyPromoCode = () => {
		this.setState({isBtnEnable:false})
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Data":
			{
				"PromoCode": this.state.txtPromocode
			}
		}
		actions.callLogin('V1/funcfordrapptoapplyactivationcode', 'post', params, signupDetails.accessToken, 'ApplyPromoCode');
	}
	payBtnClick = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Data":
			{
				"PromoCode": this.state.txtPromocode,
				"ActivationPeriodGuid": activationPeriodGuid,
				"SubscriptionPrice": this.state.price,
				"IsSubscribed": true,
				"ProfileActivationGuid": null,
				"Amount": this.state.netPayprice,
				"PaymentMode": "Online",
				"PaymentStatus": "Success",
				"TransactionId": "b9057240-be10-11eb-b68b-0022486b91c8",
				"PaymentSource": "CCAvenue",
				"ReferenceId": "b9057240-be10-11eb-b68b-0022486b91c8",
				"ErrorCode": null,
				"ErrorMessage": null,
				"Description": null,
			}
		}
		//console.log(JSON.stringify(params));
		actions.callLogin('V1/FuncForDrAppToSaveSubscriptionDetails', 'post', params, signupDetails.accessToken, 'SaveSubscriptionDetails');
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'GetActivationPackages') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;

					this.setState({ period: data.period, price: data.price, netPayprice: data.price });
					activationPeriodGuid = data.activationPeriodGuid;

				let params = {
			  "Data": { "UserType": "Dr" } }
				actions.callLogin('V1/FuncForDrAppToGetCustomerSupportDetails', 'post', params, signupDetails.accessToken, 'CustomerSupportDetails');

				} else {
					Snackbar.show({ text: 'Something went wrong. Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			} else if (tagname === 'ApplyPromoCode') {
				let data = newProps.responseData.data;
				if (newProps.responseData.statusCode == '0') {
					if (data.isCodeValid) {
						this.setState({ isPromoApplyed: 'right', netPayprice: '0' });
					}
					setTimeout(() => {
						if (this.state.isPromoApplyed) {
							this.payBtnClick()
						} else {
							//Snackbar.show({ text: 'Please validate promocode', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary })
						}
					}, 3000)
				} else {
					this.setState({isBtnEnable:true, isPromoApplyed: 'wrong', netPayprice: this.state.price });
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}, 300)
					
					
				}
			} else if (tagname === 'SaveSubscriptionDetails') {
				if (newProps.responseData.statusCode == '0') {
					Snackbar.show({ text: 'Your subscription sent successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					setTimeout(() => {
						this.props.navigation.navigate('AccountActivatedMessage', { from: this.props.navigation.getParam("from") });
						this.setState({isBtnEnable:true})
					}, 2000);
				} else {
					this.setState({isBtnEnable:true})
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}, 300)
				}
			}else if (tagname === 'CustomerSupportDetails') {
				let data = newProps.responseData.data;
				try {
					customerCareNo=data.supportNumber;
				} catch (e) { }
			}
		}
	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<ScrollView keyboardShouldPersistTaps='always'>
					<View style={{ flex: 1 }}>
						<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
						<View style={{ flex: 1, margin: responsiveWidth(4), }}>
							<View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(1), marginTop: responsiveHeight(1) }}>
								<Image source={steps2} style={{ height: responsiveFontSize(3), width: responsiveFontSize(4), resizeMode: 'contain' }} />
							</View>

							<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

							<Text style={styles.getstartedTxt}>Become A Member</Text>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2), }}>DrOnA is an exclusive platform for doctors{'\n'}
								and is currently open for members only</Text>

								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2.5), }}>Let's digitize your practice today! </Text>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2.5), }}>Enter DrOnA exclusive code</Text>

							<View style={{ marginTop: responsiveHeight(1) }}>
								<TextInput returnKeyType="done" style={[styles.inputStyle, { borderColor: this.state.InpborderColor1 }]}
									placeholder="Enter Promo Code"
									placeholderTextColor={Color.placeHolderColor}
									onBlur={this.callIsBlur1} onFocus={this.callIsFucused1}
									onChangeText={this.editPhone}
									value={this.state.txtPromocode}
									maxLength={20} />
								{this.state.closeIconShow ? <TouchableOpacity style={{ position: 'absolute', right: responsiveWidth(3), top: responsiveHeight(1.4) }} onPress={() => this.setState({ txtPromocode: '', closeIconShow: false, })}>
									<Image source={this.state.isPromoApplyed == 'right' ? promoApplied : this.state.isPromoApplyed == 'right' ? promoError : cross_txt} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
								</TouchableOpacity> : null}
							</View>



							<View style={{ flex: 1.5, alignItems: 'center' }}>
								<TouchableOpacity style={[styles.becomeamember,{backgroundColor:this.state.isBtnEnable ? Color.primary:Color.lightgray}]} onPress={() => {
									if (this.state.txtPromocode) {
										if(this.state.isBtnEnable)
										this.ApplyPromoCode();
										setLogEvent("Apply_Promo_code")
									} else {
										Snackbar.show({ text: 'Please enter promo code', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
									}
								}} disabled={!this.state.isBtnEnable}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Apply</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.restore} onPress={() => {
									Linking.openURL(`tel:${'+91' + customerCareNo}`)
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font14, fontWeight: 'bold', marginLeft: 7 }}>Get Help</Text>
								</TouchableOpacity>
								{/* <ContactUs /> */}
							</View>
						</View>
					</View>
				</ScrollView>

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
)(BecomeAMember);