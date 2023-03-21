import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text, Image, TextInput, TouchableOpacity, BackHandler, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Modal from 'react-native-modal';
import cross_txt from '../../../assets/cross_primary.png';
import edit_new_blue from '../../../assets/edit_new_blue.png';
import Snackbar from 'react-native-snackbar';
import location from '../../../assets/location.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Validator from '../../components/Validator';
let pinCodeValid = true;
class AddressDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisibleAddr: false,
			pin: '',
			stateName: '',
			city: '',
			addressLine1: '',
			addressLine2: '',
			landMark: '',
			pinAlert: '',
			stateNameAlert: '',
			cityAlert: '',
			addressLine1Alert: '',
			addressLine2Alert: '',
			landMarkAlert: '',
			address: 'Add Address',
			keyboardAvoiding: 0,

			fld1 : Color.borderColor,
			fld2 : Color.borderColor,
			fld3 : Color.borderColor,
			fld4 : Color.borderColor,
			fld5 : Color.borderColor,
			fld6 : Color.borderColor,
		};
		//alert(JSON.stringify(props.nav.bankDetails));
	}

	callOnFocus = (type) =>{
		if(type == '1'){
		  this.setState({fld1 : Color.primary})
		}
		else if(type == '2'){
			this.setState({fld2 : Color.primary})
		}
		else if(type == '3'){
			this.setState({fld3 : Color.primary})
		}
		else if(type == '4'){
			this.setState({fld4 : Color.primary})
		}
		else if(type == '5'){
			this.setState({fld5 : Color.primary})
		}
		else if(type == '6'){
			this.setState({fld6 : Color.primary})
		}
		
	}
	callOnBlur= (type) =>{
		if(type == '1'){
			this.setState({fld1 : Color.borderColor})
		  }
		  else if(type == '2'){
			  this.setState({fld2 : Color.borderColor})
		  }
		  else if(type == '3'){
			  this.setState({fld3 : Color.borderColor})
		  }
		  else if(type == '4'){
			  this.setState({fld4 : Color.borderColor})
		  }
		  else if(type == '5'){
			  this.setState({fld5 : Color.borderColor})
		  }
		  else if(type == '6'){
			  this.setState({fld6 : Color.borderColor})
		  }
		  
	}
	componentDidMount() {
		try {
			let item = this.props.nav.item ? this.props.nav.item : '';
			let from = this.props.nav.from ? this.props.nav.from : '';
			if (item && from == 'edit') {
				let addr = '';
				if (item.address1) {
					addr = item.address1;
				} else if (item.patientAddress1) {
					addr = item.patientAddress1
				}

				if (item.address2) {
					addr += ', ' + item.address1;
				} else if (item.patientAddress2) {
					addr += ', ' + item.patientAddress2;
				}

				if (item.pincode) {
					addr += ', ' + item.pincode;
				} else if (item.pinCode) {
					addr += ', ' + item.pinCode;
				}

				if (item.distance) {
					addr += ', ' + item.distance;
				} else if (item.city) {
					addr += ', ' + item.city;
				}

				if (item.description) {
					addr += ', ' + item.description;
				} else if (item.state) {
					addr += ', ' + item.state;
				}
				if(addr && addr.length >0){
					if(addr.charAt(0)==',')
					addr=addr.substring(1)
				}
				
				DRONA.setAddress(addr);
				this.setState({
					pin: item.pincode ? item.pincode : item.pinCode,
					stateName: item.description ? item.description : item.state,
					city: item.distance ? item.distance : item.city,
					addressLine1: item.address1 ? item.address1 : item.patientAddress1,
					addressLine2: item.address2 ? item.address2 : item.patientAddress2,
					landMark: item.landmark,
					address: addr ? addr : '+ Add Address',
				});
                if(item.pincode){
					let { actions, signupDetails } = this.props;
					actions.callLogin(item.pincode ? item.pincode : '221505', 'get', 'params', signupDetails.accessToken, 'getAddressBypinCode');	
				} 
			}
		} catch (e) { }
	}
	saveAddress = () => {
		if (!this.state.pin) {
			this.setState({ pinAlert: 'Please enter 6 digit Pin code' });
		} else if (!Validator.isMobileValidate(this.state.pin)) {
			this.setState({ pinAlert: 'Pin code should contain only number' });
		} else if (this.state.pin.length != 6) {
			this.setState({ pinAlert: 'Pin code must be 6 digit' });
		} else if (!pinCodeValid) {
			this.setState({ pinAlert: 'Please enter valid Pin code ' });
		}
		// else if (!this.state.stateName) {
		// 	this.setState({ stateNameAlert: 'Please enter state' });
		// } else if (!Validator.isNameValidate(this.state.stateName)) {
		// 	this.setState({ stateNameAlert: 'State name should contain only alphabets' });
		// } else if (!this.state.city) {
		// 	this.setState({ cityAlert: 'Please enter City name' });
		// 	//Snackbar.show({ text: 'Please enter City name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 	//this.setState({ confAccNoAlert: 'Please enter confirm account number' });
		// } else if (!Validator.isNameValidate(this.state.city)) {
		// 	this.setState({ cityAlert: 'City name should contain only alphabets' });
		// }
		// //  else if (!this.state.addressLine1) {
		// // 	this.setState({ addressLine1Alert: 'Please enter address line1' });
		// // } 
		 else {
			let addr = '';
			if (this.state.addressLine1) {
				addr = this.state.addressLine1;
			}
			if (this.state.addressLine2) {
				addr += ',' + this.state.addressLine2;
			}
			if (this.state.city) {
				addr += ',' + this.state.city;
			}
			if (this.state.stateName) {
				addr += ',' + this.state.stateName;
			}
			if (this.state.pin) {
				addr += ',Pin - ' + this.state.pin;
			}
			if (this.state.landMark) {
				addr += ',Landmark - ' + this.state.landMark;
			}
			if(addr && addr.length >0){
				if(addr.charAt(0)==',')
				addr=addr.substring(1)
			}
			DRONA.setAddress(addr);
			this.props.Refresh(this.state);
			this.setState({ address: addr, isModalVisibleAddr: false });
		}
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'getAddressBypinCode') {
				if (newProps.responseData && newProps.responseData.length > 0) {
					try {
						if (newProps.responseData[0].Status == 'Success') {
							pinCodeValid = true;
							let postal = newProps.responseData[0].PostOffice;
							if (postal) {
								let state = postal[0].State
								let city='';
								if(postal[0].Block !='NA'){
									city = postal[0].Block;
								}else{
									if(postal[0].Region !='NA'){
										city = postal[0].Region;
									}else{
										city = postal[0].Division;
									}
								}
								this.setState({ city: city, stateName: state });
							} else {
								this.setState({ city: '', stateName: '' });
							}
						} else {
							pinCodeValid = false;
							Snackbar.show({ text: 'Invalid Pincode', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
						}
					} catch (e) { }
				} else {
					this.setState({ city: '', stateName: '' });
				}
			}
		}
	}

	render() {

		return (
			<View>
				{this.state.address!='Add Address' ? <Text style={{ fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 5 }}>Address</Text> :null}
				<TouchableOpacity style={{ flexDirection: 'row', marginBottom: responsiveHeight(2), marginTop: responsiveHeight(1),  borderRadius: 4, alignItems: 'center', backgroundColor: this.state.address == 'Add Address' ?'#FFF': '#EEEEEE' }} onPress={() => this.setState({ isModalVisibleAddr: true })}>
					<Image source={location} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), margin: responsiveHeight(1.7) }} />
					{this.state.address == 'Add Address' ? <Text style={{ fontSize: CustomFont.font14, color: Color.primary, marginTop: 5, marginBottom: 5,fontWeight:'700' }}>{this.state.address}</Text> :
					<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 5, marginBottom: 5, marginRight: responsiveWidth(20) }}>{this.state.address}</Text> }
					{this.state.address == 'Add Address' ? null : <Image source={edit_new_blue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), margin: responsiveHeight(1.7), position: 'absolute', right: 0, top: 0 }} />}

				</TouchableOpacity>


				<Modal isVisible={this.state.isModalVisibleAddr} avoidKeyboard={true}>
					<View style={styles.modelViewAddress}>
						<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={this.state.keyboardAvoiding}>
							<ScrollView keyboardShouldPersistTaps='always'>
								<View style={{ margin:responsiveWidth(5.5),  flex: 1, marginBottom: responsiveHeight(22) }}>
									<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
										<Text style={{ fontSize: CustomFont.font18, fontWeight: CustomFont.fontWeight700, color: Color.black, fontFamily:CustomFont.fontName, }}>Add Address</Text>
										<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => { this.setState({ isModalVisibleAddr: false }) }}>
											<Image source={cross_txt} style={{width:30,height:30}}/>
										</TouchableOpacity>
									</View>
									<Text style={styles.inputHeader}>PIN Code*</Text>
									<TextInput returnKeyType="done"
									//onFocus = {() => this.callOnFocus('3')}
									onBlur = {() => this.callOnBlur('1')}
									placeholderTextColor = {Color.placeHolderColor}
									style={[styles.createInputStyle, {  borderColor : this.state.fld1 }]} placeholder="Enter Pincode" value={this.state.pin} onChangeText={pin => {
										this.setState({ pin })
										if (!pin || Validator.isMobileValidate(pin)) {
											this.setState({ pinAlert: '' })
										} else {
											this.setState({ pinAlert: 'Pin code should contain only numeric' ,  fld1 : Color.inputErrorBorder})
										}
										if (pin.length === 6) {
											let { actions, signupDetails } = this.props;
											actions.callLogin(pin, 'get', 'params', signupDetails.accessToken, 'getAddressBypinCode');
										} else {
											this.setState({ city: '', stateName: '' });
										}
									}} keyboardType={'phone-pad'} maxLength={6} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-30), fld1 : Color.primary })}  returnKeyType="done"/>
									{this.state.pinAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.pinAlert}</Text> : null}
									
									<Text style={styles.inputHeader}>Address Line 1*</Text>
									<TextInput returnKeyType="done"
									onFocus = {() => this.callOnFocus('4')}
									onBlur = {() => this.callOnBlur('4')}
									placeholderTextColor = {Color.placeHolderColor}
									style={[styles.createInputStyle, {borderColor : this.state.fld4}]} placeholder="Enter House No./ Street Name" value={this.state.addressLine1} onChangeText={addressLine1 => {
										this.setState({ addressLine1 })
										if (addressLine1) {
											this.setState({ addressLine1Alert: '' })
										}
									}} />
									{this.state.addressLine1Alert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.addressLine1Alert}</Text> : null}
									
									<Text style={styles.inputHeader}>Address Line 2</Text>
									<TextInput returnKeyType="done"
									onFocus = {() => this.callOnFocus('5')}
									onBlur = {() => this.callOnBlur('5')}
									placeholderTextColor = {Color.placeHolderColor}
									style={[styles.createInputStyle, {borderColor : this.state.fld5}]} placeholder="Enter Locality /Area" value={this.state.addressLine2} onChangeText={addressLine2 => {
										this.setState({ addressLine2 })
									}} />
									
									<Text style={styles.inputHeader}>Landmark (optional)</Text>
									<TextInput returnKeyType="done"
									//onFocus = {() => this.callOnFocus('6')}
									onBlur = {() => this.callOnBlur('6')}
									placeholderTextColor = {Color.placeHolderColor}
									style={[styles.createInputStyle, {borderColor : this.state.fld6}]} placeholder="Enter Landmark" value={this.state.landMark} onChangeText={landMark => {
										this.setState({ landMark })
									}} onFocus={() => this.setState({ keyboardAvoiding: 0, fld6 : Color.primary })} />


									
								
									<Text style={styles.inputHeader}>City *</Text>
									<TextInput returnKeyType="done"
									//onFocus = {() => this.callOnFocus('3')}
									onBlur = {() => this.callOnBlur('3')}
									placeholderTextColor = {Color.placeHolderColor}
									style={[styles.createInputStyle, {borderColor : this.state.fld3}]} placeholder="Enter City" value={this.state.city} onChangeText={city => {
										this.setState({ city })
										if (!city || Validator.isNameValidate(city)) {
											this.setState({ cityAlert: '' })
										} else {
											this.setState({ cityAlert: 'City name should contain only alphabets' , fld3 : Color.inputErrorBorder})
										}
									}} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-10), fld3 : Color.primary })} />
									{this.state.cityAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.cityAlert}</Text> : null}
								
									<Text style={styles.inputHeader}>State *</Text>
									<TextInput returnKeyType="done"
									//onFocus = {() => this.callOnFocus('3')}
									onBlur = {() => this.callOnBlur('2')}
									placeholderTextColor = {Color.placeHolderColor}
									style={[styles.createInputStyle, {borderColor : this.state.fld2}]} placeholder="State" value={this.state.stateName} onChangeText={stateName => {
										this.setState({ stateName })
										if (!stateName || Validator.isNameValidate(stateName)) {
											this.setState({ stateNameAlert: '' })
										} else {
											this.setState({ stateNameAlert: 'State name should contain only alphabets', fld2 : Color.inputErrorBorder })
										}
									}} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-25), fld2 : Color.primary })} />
									{this.state.stateNameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.stateNameAlert}</Text> : null}
								
									
									
									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(5), marginBottom: 20 }} onPress={() => {
										this.saveAddress();
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save </Text>
									</TouchableOpacity>
								</View>

							</ScrollView>
						</KeyboardAvoidingView>
					</View>
				</Modal>

			</View>
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
)(AddressDetails);
