import React, { useState } from 'react';
import { View, Text, Keyboard, TouchableOpacity, Image, TextInput, BackHandler, StatusBar, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import styles from './style';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

import Toolbar from '../../customviews/Toolbar.js';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import promo_code from '../../../assets/promo_code.png';
import cross_new from '../../../assets/cross_blue.png';
import remove_promo from '../../../assets/remove_promo.png';
import delete_red from '../../../assets/delete_red.png';
import { setLogEvent } from '../../service/Analytics';
import home_bg from '../../../assets/home_bg.png';
import steps2 from '../../../assets/steps.png';
import app_icon from '../../../assets/app_icon.png';
import TextFieldInput from '../../customviews/TextFieldInput';
import CustomButton from '../../customviews/CustomButton';


let activationPeriodGuid = '';
class PayForMemberShip extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isPromoApply: false,
			isPromoModalOpen: false,
			txtPromocode: '',
			period: '',
			price: '0',
			netPayprice: '0',
			borderColor: Color.inputdefaultBorder,
			buttonBoderWidth: 0,
			dynamicTop: 0,
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
	ApplyPromoCode = () => {
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
		this.setState({ buttonBoderWidth: 0 });
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
				} else {
					Snackbar.show({ text: 'Something went wrong. Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			} else if (tagname === 'ApplyPromoCode') {
				let data = newProps.responseData.data;
				if (newProps.responseData.statusCode == '0') {
					if (data.isCodeValid) {
						this.setState({ isPromoApply: true, netPayprice: '0' });
					}
					isCodeValid = data.isCodeValid;
				} else {
					this.setState({ isPromoApply: false, netPayprice: this.state.price });
					alert(newProps.responseData.statusMessage);
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				}
			} else if (tagname === 'SaveSubscriptionDetails') {
				if (newProps.responseData.statusCode == '0') {
					Snackbar.show({ text: 'Your subscription sent successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					setTimeout(() => {
						this.props.navigation.navigate('AccountActivatedMessage', { from: this.props.navigation.getParam("from") });
					}, 2000);
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			}
		}
	}
	callIsFucused = () => {
		this.setState({ borderColor: Color.primary })
	}
	callIsBlur = () => {
		this.setState({ borderColor: Color.inputdefaultBorder })
	}
	validateIndianRupees = (x) => {
		let res = '';
		try {
			x = x.toString();
			var lastThree = x.substring(x.length - 3);
			var otherNumbers = x.substring(0, x.length - 3);
			if (otherNumbers != '')
				lastThree = ',' + lastThree;
			res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
		} catch (e) {
			res = x;
		}

		return res;
	}

	changeText = (text) => {

	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white, minHeight: responsiveHeight(98) }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<KeyboardAvoidingView behavior={'padding'}>
					<ScrollView style={{ backgroundColor: Color.white }} keyboardShouldPersistTaps='always'>
						<View style={{ flex: 1, marginTop: this.state.dynamicTop }}>
							<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
							<View style={{ flex: 1, margin: responsiveWidth(4), }}>
								<View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(1), marginTop: responsiveHeight(1) }}>
									<Image source={steps2} style={{ height: responsiveFontSize(3), width: responsiveFontSize(4), resizeMode: 'contain' }} />
								</View>

								<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

								<Text style={styles.getstartedTxt}>Membership Payment</Text>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2), lineHeight: responsiveHeight(3) }}>DrOnA is an exclusive platform for doctors {'\n'}
									and is open currently for members</Text>


								<View style={{ margin: responsiveWidth(3), marginTop: responsiveWidth(3), borderRadius: 6, backgroundColor: '#fbfbfb' }}>
									<View style={{ margin: responsiveWidth(4) }}>
										<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Order Summary</Text>
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(3) }}>
											<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext }}>Membership Period</Text>
											<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor }}>{this.state.period}</Text>
										</View>
										{this.state.isPromoApply ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(3) }}>
											<Text style={{ fontSize: CustomFont.font14, color: Color.primary }}>Promo Discount</Text>
											<Text style={{ fontSize: CustomFont.font14, color: Color.primary }}>- ₹{this.validateIndianRupees(this.state.price)} </Text>
										</View> : null}
										<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(2) }}>
											<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext }}>Total Price</Text>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>₹{this.state.isPromoApply ? '0' : this.validateIndianRupees(this.state.price)}</Text>
										</View>
										<View>
											<Text style={{ fontSize: CustomFont.font9, color: Color.optiontext, textAlign: 'right', marginTop: 5 }}>Inclusive of all Taxes</Text>
										</View>

										<Text style={{ marginTop: 24, fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Promocode</Text>
										{this.state.isPromoApply ?
											<View style={{ flexDirection: 'row', backgroundColor: Color.lightBlue, borderRadius: 4, height: responsiveHeight(6), marginTop: responsiveHeight(1.8), marginBottom: 24 }}>
												<View style={{ flexDirection: 'row', alignItems: 'center', flex: 2.6 }}>
													<Image source={promo_code} style={{ marginLeft: 7, resizeMode: 'contain', height: responsiveFontSize(2.6), width: responsiveFontSize(2.6) }} />
													{/* <Image source={remove_promo} style={{ resizeMode: 'contain', height: responsiveFontSize(2.8), width: responsiveFontSize(2.8), marginLeft: 7 }} /> */}
													<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: '700', marginLeft: 7 }}>{this.state.txtPromocode} </Text>
												</View>
												<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => this.setState({ isPromoApply: false })}>
													<Image source={delete_red} style={{ height: responsiveFontSize(1.8), width: responsiveFontSize(1.8), resizeMode: 'contain' }} />
													<Text style={{ fontSize: CustomFont.font12, color: Color.textDue, marginLeft: 10, fontFamily: CustomFont.fontName, }}>Remove </Text>
												</TouchableOpacity>
											</View> : <View style={{ marginBottom: 30 }}>
												{/* <Image source={promo_code} style={{ resizeMode: 'contain', height: responsiveFontSize(2.6), width: responsiveFontSize(2.6) }} /> 
										<Text style={{ fontSize: CustomFont.font14, fontWeight: '700', color: this.state.isPromoApply ? Color.fontColor : Color.primary,  }}>{this.state.isPromoApply ? this.state.txtPromocode + ' Applied' : 'Apply Promocode'} </Text>*/}

												<TextFieldInput
													onChangeText={(value) => this.setState({ txtPromocode: value })}
													placeholder={"Enter Promocode"}
													isBorder={!this.state.isPromoApply}
													editable={!this.state.isPromoApply}
													isPromo={this.state.isPromoApply}
													style={{ marginTop: 10, color: Color.fontColor, fontFamily: CustomFont.fontNameBold }}
													onRemovePromo={() => {
														this.setState({ isPromoApply: false })
													}}
													onFocus={() => {
														this.setState({ dynamicTop: responsiveHeight(-7) })
													}}
													onBlur={() => {
														this.setState({ dynamicTop: 0 })
													}}
												/>
												<TouchableOpacity onPress={() => {
													if (this.state.txtPromocode) {
														setLogEvent("Apply_Promo_code")
														this.ApplyPromoCode();
														this.setState({ isPromoModalOpen: false })
													} else {
														Snackbar.show({ text: 'Please enter promocode', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
													}
												}}>
													{this.state.isPromoApply ? null : <Text style={{ marginTop: 24, fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.primary }}>Apply Promocode</Text>}
												</TouchableOpacity>
											</View>}






									</View>
								</View>
							</View>


						</View>
					</ScrollView>
				</KeyboardAvoidingView>
				<CustomButton
					title={this.state.isPromoApply ? 'Submit' : "Pay  ₹" + this.validateIndianRupees(this.state.price)}
					// isBottom={true}
					style={{ marginBottom: 20, marginStart: 20, marginEnd: 20 }}
					isInactive={!this.state.isPromoApply}
					onPress={() => {
						setLogEvent("Submit_button");
						if (this.state.isPromoApply) {
							this.payBtnClick()
						} else {
							this.setState({ buttonBoderWidth: 0 })
							Snackbar.show({ text: 'Please validate promocode', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary })
						}
					}
					} />

				{/* <Toolbar
					title={"Pay for Membership"}
					onBackPress={() => this.props.navigation.goBack()} />
				<View style={{ flex: 7 }}>
					<View style={{ marginTop: responsiveWidth(3), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 6, backgroundColor: Color.white }}>
						<View style={{ margin: responsiveWidth(4) }}>
							<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Order Summary</Text>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(3.5) }}>
								<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext }}>Membership Period</Text>
								<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext }}>{this.state.period}</Text>
							</View>
							{this.state.isPromoApply ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(3) }}>
								<Text style={{ fontSize: CustomFont.font14, color: Color.primary }}>Promo Discount</Text>
								<Text style={{ fontSize: CustomFont.font14, color: Color.primary }}>- ₹{this.validateIndianRupees(this.state.price)} </Text>
							</View> : null}
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(2.6) }}>
								<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext }}>Total Price</Text>
								<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>₹{this.state.isPromoApply ? '0' : this.validateIndianRupees(this.state.price)}</Text>
							</View>
							<View>
								<Text style={{ fontSize: CustomFont.font9, color: Color.optiontext, textAlign: 'right', marginTop: 5 }}>Inclusive of all Taxes</Text>
							</View>

						</View>
					</View>
					<View style={{ marginTop: responsiveWidth(3), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 6, backgroundColor: Color.white }}>
						<View style={{ margin: responsiveWidth(4) }}>
							<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Promocode</Text>
							<TouchableOpacity style={{ marginTop: responsiveWidth(2) }} onPress={() => this.setState({ isPromoModalOpen: true })}>

								{this.state.isPromoApply ?
									<View style={{ flexDirection: 'row', backgroundColor: Color.lightBlue, borderRadius: 4, height: responsiveHeight(6) }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', flex: 2.6 }}>
											<Image source={remove_promo} style={{ resizeMode: 'contain', height: responsiveFontSize(2.8), width: responsiveFontSize(2.8), marginLeft: 7 }} />
											<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: '700', marginLeft: 7 }}>{this.state.txtPromocode} </Text>
										</View>
										<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={()=>{
											setLogEvent("Remove_button")
											this.setState({isPromoApply:false})
										} }>
											<Image source={delete_red} style={{ height: responsiveFontSize(1.8), width: responsiveFontSize(1.8),resizeMode:'contain' }} />
											<Text style={{ fontSize: CustomFont.font12, color: Color.textDue,marginLeft:10,fontFamily: CustomFont.fontName, }}>Remove </Text>
										</TouchableOpacity>
									</View> : <View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Image source={promo_code} style={{ resizeMode: 'contain', height: responsiveFontSize(2.6), width: responsiveFontSize(2.6) }} />
										<Text style={{ fontSize: CustomFont.font14, fontWeight: '700', color: this.state.isPromoApply ? Color.fontColor : Color.primary, marginLeft: responsiveWidth(2) }}>{this.state.isPromoApply ? this.state.txtPromocode + ' Applied' : 'Apply Promocode'} </Text>
									</View>}

							</TouchableOpacity>
						</View>
					</View>
				</View> 

			
				<View style={{ flex: 1, alignItems: 'center' }}>
					<TouchableOpacity style={[styles.becomeamember, { borderColor: Color.buttonBorderColor, borderWidth: this.state.buttonBoderWidth, backgroundColor: this.state.isPromoApply ? Color.primary : Color.lightgray }]} onPress={() => {
						this.setState({ buttonBoderWidth: 1 })
						setLogEvent("Submit_button")
						if (this.state.isPromoApply)
							this.payBtnClick()
						else {
							this.setState({ buttonBoderWidth: 0 });
							Snackbar.show({ text: 'Please validate promocode', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
						}

					}} >
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Submit</Text>
					</TouchableOpacity>
				</View> 
				<Modal isVisible={this.state.isPromoModalOpen} onRequestClose={() => this.setState({ isPromoModalOpen: false })}>
					<View style={[styles.modelViewMessage]}>
						<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={240}>
							<ScrollView>
								<View style={{
									margin: responsiveWidth(3), marginBottom: responsiveHeight(10), backgroundColor: Color.white,
									borderTopStartRadius: 20,
									borderTopEndRadius: 20,
									width: responsiveWidth(101),
									marginStart: responsiveWidth(-.6)
								}}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.fontColor, marginLeft: responsiveWidth(5.5), fontWeight: CustomFont.fontWeight700 }}>Apply Code</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isPromoModalOpen: false, findingSearchTxt: '' })}>
											<Image source={cross_new} style={{ resizeMode: 'contain', height: responsiveFontSize(2), width: responsiveFontSize(2), marginRight: responsiveWidth(5) }} />
										</TouchableOpacity>
									</View>

									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: '#707070', marginTop: responsiveHeight(5), marginLeft: responsiveWidth(5), fontWeight: CustomFont.fontWeight400 }}>Enter activation or promocode</Text>
									<TextInput onFocus={this.callIsFucused}
										onBlur={this.callIsBlur} style={[styles.searchInput, { borderColor: this.state.borderColor }]} placeholder="Enter Promo code" placeholderTextColor={Color.placeHolderColor} value={this.state.txtPromocode}
										onChangeText={(txtPromocode) => this.setState({ txtPromocode })} />

									<TouchableOpacity style={{ height: responsiveHeight(6), alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: Color.primary, marginLeft: responsiveWidth(5), marginRight: responsiveWidth(7), marginTop: responsiveHeight(4) }} onPress={() => {
										if (this.state.txtPromocode) {
											setLogEvent("Apply_promo_code")
											this.ApplyPromoCode();
											this.setState({ isPromoModalOpen: false })
										} else {
											Snackbar.show({ text: 'Please enter promocode', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
										}

									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Apply</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</KeyboardAvoidingView>
					</View>
				</Modal> */}
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
)(PayForMemberShip);