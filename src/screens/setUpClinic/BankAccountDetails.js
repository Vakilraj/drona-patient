import React, { useState } from 'react';
import {
	View,
	Text, Image, TextInput, TouchableOpacity, Platform, ActivityIndicator, FlatList, ScrollView, ViewPagerAndroidComponent
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Modal from 'react-native-modal';
var axios = require('axios');
var qs = require('qs');

import Upi from '../../../assets/upi_new.png';
import bank_account from '../../../assets/bank_new.png';
import assistant from '../../../assets/assistant.png';
import Snackbar from 'react-native-snackbar';
import EditBlue from '../../../assets/edit_new_blue.png';
import CrossIcon from '../../../assets/cross_primary.png';
import plusNew from '../../../assets/increment.png';
import Validator from '../../components/Validator';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Moment from 'moment';
import { setLogEvent } from '../../service/Analytics';
import Trace from '../../service/Trace'
let timeRange = '';

var radio_props = [
	{ label: 'Savings', value: 0 },
	{ label: 'Current', value: 1 },
	{ label: 'Other', value: 2 },
];
let bankName = '', branchName = '', nickName = '', assistanceUserGuid = '', assistanceGuid = '', selectedIndexAssistantList = 0, isAssistantAddUpdateFlag = 'Add', createdOn = '', AddBankDetailsFlag = 0;
class BankAccountDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisibleBankAcc: false,
			isModalVisibleUpi: false,
			radioSelected: 0,
			accountHolderName: '',
			accountNo: '',
			confirmAccountNo: '',
			ifscCode: '',
			upiName: '',
			upiNameOnModal: '',
			nameAlert: '',
			accNoAlert: '',
			confAccNoAlert: '',
			ifscAlert: '',
			fld1: Color.inputdefaultBorder,
			fld2: Color.inputdefaultBorder,
			fld3: Color.inputdefaultBorder,
			fld4: Color.inputdefaultBorder,
			fld5: Color.inputdefaultBorder,
			bankDetailGuId: null,
			upiGuId: null,
			showProgressOnBtn: false,
			selectedIndex: 0,
			assitantArr: [],
			assitantFName: '',
			assitantlName: '',
			assitantMobileNumber: '',
		};
		selectedIndexAssistantList = 0;
		isAssistantAddUpdateFlag = 'Add';
		AddBankDetailsFlag = 0;
	}
	componentDidMount() {
		let { signupDetails } = this.props;
		timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Assistant_And_Bank_Details_Info', signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Assistant_And_Bank_Details_Info", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
		if (this.props.resData)
			this.setValueFromResponse(this.props.resData)
	}
	componentWillUnmount() {
		Trace.stopTrace()
	}
	setValueFromResponse = (data) => {
		try {
			if (data.bankDetailsList && data.bankDetailsList.length > 0) {
				let bankDetails = data.bankDetailsList[0];
				if (bankDetails) {
					try {
						this.setState({
							radioSelected: bankDetails.accountType ? parseInt(bankDetails.accountType) : 0,  // == 'Saving' ? 0 : bankDetails.accountType == 'Current' ? 1 : 2
							accountHolderName: bankDetails.nameOnAccount,
							accountNo: bankDetails.accountNumber,
							confirmAccountNo: bankDetails.accountNumber,
							ifscCode: bankDetails.ifscCode,
							bankDetailGuId: bankDetails.bankDetailGuId,
							selectedIndex: bankDetails.accountType
						})

						bankName = bankDetails.bankName;
						branchName = bankDetails.branchName;
						nickName = bankDetails.nickName;
					} catch (e) {
						//console.log("error - ", e);
					}
				}
			}

			if (data.upiDetailsList && data.upiDetailsList.length > 0) {
				let upiDetails = data.upiDetailsList[0];
				this.setState({ upiName: upiDetails.upiName, upiNameOnModal: upiDetails.upiName, upiGuId: upiDetails.upiGuId })

			}
			if (data.staffList && data.staffList.length > 0) {
				this.setState({
					assitantArr: data.staffList
				})
				try {
					this.setState({
						assitantFName: data.staffList[0].staffFirstName,
						assitantlName: data.staffList[0].staffLastName,
						assitantMobileNumber: data.staffList[0].assistantPhoneNo,
					})
					assistanceUserGuid = data.staffList[0].assistanceUserGuid;
					assistanceGuid = data.staffList[0].assistanceGuid;
				} catch (error) {

				}
			} else {
				this.setState({
					assitantArr: []
				})
			}
		} catch (e) {
			//console.log("error - - ", e);
		}
	}
	callOnFocus = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.primary })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.primary })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.primary })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.primary })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.primary })
		}
	}
	callOnBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.inputdefaultBorder })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.inputdefaultBorder })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.inputdefaultBorder })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.inputdefaultBorder })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.inputdefaultBorder })
		}
	}
	getRandom = () => {
		return Math.floor(Math.pow(10, 10 - 1) + Math.random() * 9 * Math.pow(10, 10 - 1));

	}

	checkUpiIsValid = async () => {
		this.setState({ showProgressOnBtn: true });
		let randomValue = this.getRandom()
		let { actions, signupDetails } = this.props;
		let { upiNameOnModal, upiGuId } = this.state;
		const that = this;
		var data = qs.stringify({
			'grant_type': 'client_credentials',
			'client_id': '2e7e97aa9c350a3c8db11c5c75b5e8c79b6380bb9422c88028de33aea515b216',
			'client_secret': 'bfb4f6307c4c49f47a387c2182399498dd3f48f4ef97558acf3dab8456402d74',
			'scope': 'create_payout_transactions'
		});
		var config = {
			method: 'post',
			url: 'https://accounts.payu.in/oauth/token',
			headers: {
				'cache-control': 'no-cache',
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		};
		axios(config)
			.then(function (response) {
				that.changeshowProgressOnBtn();
				let access_token = response.data.access_token
				if (access_token) {
					var data1 = qs.stringify({
						'vpa': upiNameOnModal
					});
					var config1 = {
						method: 'post',
						url: 'https://payout.payumoney.com/payout/merchant/validateVpa',
						headers: {
							'Authorization': 'Bearer ' + access_token,
							'payoutMerchantId': '1111941',
							'Content-Type': 'application/x-www-form-urlencoded',
							'Cache-Control': 'no-cache'
						},
						data: data1
					};

					axios(config1)
						.then(function (response) {
							let data = response.data;
							if (data.status === 0) {

								let params = {
									"RoleCode": signupDetails.roleCode,
									"UserGuid": signupDetails.UserGuid,
									"DoctorGuid": signupDetails.doctorGuid,
									"ClinicGuid": DRONA.getClinicGuid(),//DRONA.getClinicGuid() signupDetails.clinicGuid
									"Data": { "upiGuId": upiGuId, "UpiName": upiNameOnModal }
								};
								actions.callLogin('V15/FuncForDrAppToAddUpdateUpiDetails', 'post', params, signupDetails.accessToken, 'saveupdateUpi');
							} else {
								alert(data.data.message)
								that.changeshowProgressOnBtn();
							}
						})
						.catch(function (error) {
							that.changeshowProgressOnBtn();
						});
				} else {
					alert('Something went wrong')
					that.changeshowProgressOnBtn();
				}
			})
			.catch(function (error) {
				that.changeshowProgressOnBtn();
			});
	}

	changeshowProgressOnBtn = () => {
		this.setState({ showProgressOnBtn: false });
	}

	checkAccountNumberIsValid = async () => {
		let randomValue = this.getRandom()
		let { actions, signupDetails } = this.props;
		let { accountNo, accountHolderName, ifscCode, radioSelected, bankDetailGuId, upiGuId } = this.state;
		var data = qs.stringify({
			'grant_type': 'client_credentials',
			'client_id': '2e7e97aa9c350a3c8db11c5c75b5e8c79b6380bb9422c88028de33aea515b216',
			'client_secret': 'bfb4f6307c4c49f47a387c2182399498dd3f48f4ef97558acf3dab8456402d74',
			'scope': 'create_payout_transactions'
		});
		const that = this;
		var config = {
			method: 'post',
			url: 'https://accounts.payu.in/oauth/token',
			headers: {
				'cache-control': 'no-cache',
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		};
		//console.log('---------calling')
		axios(config)
			.then(function (response) {
				//console.log('---------1----' +JSON.stringify(response))
				that.changeshowProgressOnBtn();
				let access_token = response.data.access_token
				if (access_token) {
					var data1 = qs.stringify({
						'accountNumber': accountNo,
						'ifscCode': ifscCode,
						'merchantRefId': randomValue,
						'nameMatching': false,
						'purpose': 'penny testing'
					});
					var config1 = {
						method: 'post',
						//url: 'https://payout.payumoney.com/payout/payment/verifyAccount',
						url: 'https://oneapi.payu.in/payout/payment/verifyAccount',
						headers: {
							'Authorization': 'Bearer ' + access_token,
							'payoutMerchantId': '1118510', //1111941
							'Content-Type': 'application/x-www-form-urlencoded',
							'Cache-Control': 'no-cache'
						},
						data: data1
					};
					//console.log('---------calling 2----'+JSON.stringify(config1));
					axios(config1)
						.then(function (response) {
							//console.log('---------2----' +JSON.stringify(response))
							let data = response.data.data
							if (!data.error) { //data.accountExists == 'YES' && 

								let params = {
									"RoleCode": signupDetails.roleCode,
									"UserGuid": signupDetails.UserGuid,
									"ClinicGuid": DRONA.getClinicGuid(),//DRONA.getClinicGuid() signupDetails.clinicGuid
									"DoctorGuid": signupDetails.doctorGuid,
									"version": "null",
									"Data": {
										"BankDetailGuId": bankDetailGuId,
										"ReferenceId": "333",
										"ReferenceType": "8989",
										"BankName": bankName,
										"BranchName": branchName,
										"AccountNumber": accountNo,
										"NameOnAccount": accountHolderName,
										"IFSCCode": ifscCode,
										"AccountType": radioSelected,
										"NickName": nickName
									}
								};
								actions.callLogin('V15/FuncForDrAppToAddUpdateBank', 'post', params, signupDetails.accessToken, 'saveupdateBankAccount');
								setTimeout(()=>{
									AddBankDetailsFlag =0;
								},2000)
							} else {
								//console.log('------error---2----' +JSON.stringify(data))
								AddBankDetailsFlag =0;
								alert(data.error && data.error!='null' ? data.error:'Please try again, something went wrong!')
								that.setState({ showProgressOnBtn: false });
							}
						})
						.catch(function (error) {
							AddBankDetailsFlag =0;
							//console.log('------error---1----' +JSON.stringify(error))
							alert(error && error!='null' ? error:'Please try again, something went wrong!')
							that.setState({ showProgressOnBtn: false });
						});
				} else {
					AddBankDetailsFlag =0;
					alert('Something wend wrong')
					that.setState({ showProgressOnBtn: false });
				}
			})
			.catch(function (error) {
				AddBankDetailsFlag =0;
				that.setState({ showProgressOnBtn: false });
			});
	}

	saveBankAccount = () => {
		if (!this.state.accountHolderName) {
			Snackbar.show({ text: 'Please enter account holder name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.setState({ nameAlert: 'Please enter account holder name' });
		} else if (!Validator.isNameValidate(this.state.accountHolderName)) {
			Snackbar.show({ text: 'Name should contain only alphabets', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.accountNo) {
			Snackbar.show({ text: 'Please enter account number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.setState({ accNoAlert: 'Please enter account number' });
		} else if (!this.state.confirmAccountNo) {
			Snackbar.show({ text: 'Please enter confirm account number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.setState({ confAccNoAlert: 'Please enter confirm account number' });
		} else if (this.state.accountNo != this.state.confirmAccountNo) {
			Snackbar.show({ text: 'Account number and confirm account number not matched', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.setState({ confAccNoAlert: 'Account number and confirm account number not matched' });
		} else if (!this.state.ifscCode) {
			Snackbar.show({ text: 'Please enter ifsc code', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.setState({ ifscAlert: 'Please enter ifsc code' });
		} else {
			//this.setState({ showProgressOnBtn: true });
			AddBankDetailsFlag =1;
			this.checkAccountNumberIsValid()
			let { signupDetails } = this.props;
			setLogEvent("add_bank_detail", { "save": "click", UserGuid: signupDetails.UserGuid })
		}
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'saveupdateBankAccount') {
				setTimeout(() => {
					this.setState({ isModalVisibleBankAcc: false, showProgressOnBtn: false, bankDetailGuId: newProps.responseData.data && newProps.responseData.data.bankDetailGuId ? newProps.responseData.data.bankDetailGuId : null })
					AddBankDetailsFlag =0;
				}, 2000)
				if (newProps.responseData.statusCode == '0') {
					setLogEvent("add_bank_details")
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				} else {
					alert(newProps.responseData.statusMessage)
					this.setState({ saveupdateBankAccount: '', accountNo: '', confirmAccountNo: '', ifscCode: '' })
				}
				
				this.props.Refresh();
			} else if (tagname === 'saveupdateUpi') {
				if (newProps.responseData.statusCode == '0') {
					Trace.stopTrace()
					setTimeout(() => {
						this.setState({ isModalVisibleUpi: false, showProgressOnBtn: false, upiGuId: newProps.responseData.data.upiGuId, upiName: this.state.upiNameOnModal })
					}, 2000)
					setLogEvent("add_upi");
					Snackbar.show({ text: 'UPI updated successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				this.setState({ isModalVisibleUpi: false, showProgressOnBtn: false })
				this.props.Refresh();
				// setTimeout(() => {
				// 	this.setState({ isModalVisibleUpi: false, showProgressOnBtn: false });
				// }, 3000);
			} else if (tagname === 'clinicDetailsSettings' && newProps.responseData.statusCode == '0') {
				let data = newProps.responseData.data;
				this.setValueFromResponse(data);


			} else if (tagname == 'clinicDetailsHome') {
				if (this.props.nav.popupOpenStatus == 'BankPopup') {
					setTimeout(() => {
						this.setState({ isModalVisibleBankAcc: true });
					}, 1000)
				}

				if (this.props.nav.popupOpenStatus == 'upiPopup') {
					setTimeout(() => {
						this.setState({ isModalVisibleUpi: true });
					}, 1000)
				}
			}
		}
	}

	renderTopic = (item, index) => {
		let isSelected = index == this.state.selectedIndex
		return (
			<TouchableOpacity style={[styles.topic, { backgroundColor: isSelected ? Color.accountTypeSelBg : Color.white, borderColor: isSelected ? Color.liveBg : Color.primary }]} onPress={() => this.setState({ radioSelected: item.value, selectedIndex: index })}>
				<Text style={[styles.topicTxt, { color: Color.optiontext }]}>{item.label}</Text>
			</TouchableOpacity>
		)
	}
	nameFormat = (name, isDoctor) => {
		let shortName = '';
		if (name != null && name.length > 0) {
			let nameArr = name.split(' ')
			if (nameArr.length > 0) {
				let max = nameArr.length > 3 ? 3 : nameArr.length
				for (let i = 0; i < max; i++) {
					shortName = shortName + (isDoctor && i == 0 ? '' : nameArr[i].charAt(0).toUpperCase());
				}
			}
		}
		return shortName
	}

	renderAssitantItem = (item, index, signupDetails) => {
		return (

			<View style={{ paddingLeft: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, height: responsiveHeight(9) }}>
				<View style={{ flex: .9, alignItems: 'center' }}>
					<View style={{
						height: responsiveFontSize(5), width: responsiveFontSize(5), backgroundColor: Color.lightPurple, borderRadius: responsiveFontSize(2.5),
						alignItems: 'center', justifyContent: 'center',
					}}>
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.profileImageText, fontWeight: CustomFont.fontWeight700 }}>{this.nameFormat(item.staffName, false)}</Text>
					</View>
				</View>
				<View style={{ flex: 4, marginLeft: 5 }}>
					<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.patientSearch, fontFamily: CustomFont.fontName, textTransform: 'capitalize' }}>{item.staffName}</Text>
					<Text style={{ fontSize: CustomFont.font14, color: Color.patientSearch, marginTop: 3, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500 }}>Added on {item.createdOn ? Moment(item.createdOn).format('DD MMM YYYY') : ''}</Text>
				</View>
				{!signupDetails.isAssistantUser ?
					<TouchableOpacity style={{ flex: .8, alignItems: 'center' }}
						onPress={() => {
							selectedIndexAssistantList = index;
							isAssistantAddUpdateFlag = 'Update'
							this.props.nav.navigation.navigate("AddAssistant", {
								isEdit: true,
								assistanceUserGuid: item.assistanceUserGuid,
								assistanceGuid: item.assistanceGuid,
								isUpdate: this.isUpdate
							})
							createdOn = item.createdOn;
						}
						}>
						<Image source={EditBlue} style={{ width: responsiveFontSize(2), height: responsiveFontSize(2), resizeMode: 'contain' }} />
					</TouchableOpacity> : null}

			</View>

		)
	}
	isUpdate = (data) => {
		if (data) {
			let tmpArr = [...this.state.assitantArr];
			let obj = { assistanceGuid: data.assistanceGuid, assistanceUserGuid: data.assistanceUserGuid, assistantPhoneNo: data.phoneNo, staffName: data.assistanceFirstName + ' ' + data.assistanceLastName, staffFirstName: data.assistanceFirstName, staffLastName: data.assistanceLastName, createdOn: createdOn }
			if (isAssistantAddUpdateFlag == 'Add') {
				tmpArr.push(obj);

			} else {
				tmpArr.splice(selectedIndexAssistantList, 1, obj)
			}
			this.setState({ assitantArr: tmpArr });
			if (tmpArr.length == 1) {
				try {
					this.setState({
						assitantFName: data.assistanceFirstName,
						assitantlName: data.assistanceLastName,
						assitantMobileNumber: data.phoneNo,
					})
					assistanceUserGuid = data.assistanceUserGuid;
					assistanceGuid = data.assistanceGuid;
				} catch (error) {

				}
			}
		} else {
			let tmpArr = [...this.state.assitantArr];
			tmpArr.splice(selectedIndexAssistantList, 1);
			this.setState({ assitantArr: tmpArr });
		}
		//this.getSetupClinicDetails();
	}
	saveUPIAccount = () => {
		Trace.stopTrace();
		if (!this.state.upiNameOnModal.trim()) {
			Snackbar.show({ text: 'Please enter UPI', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			this.checkUpiIsValid()
			let { signupDetails } = this.props;
			setLogEvent("add_upi_detail", { "save": "click", UserGuid: signupDetails.UserGuid })
		}
	}
	render() {
		let { signupDetails } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: Color.newBgColor,minHeight:Platform.OS=='android'? responsiveHeight(74): responsiveHeight(70) }}>
				<ScrollView keyboardShouldPersistTaps='always'>
					<View style={{ flex: 1 }}>



						<View style={{ margin: responsiveWidth(3), backgroundColor: Color.white, borderRadius: 6 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: responsiveWidth(3), alignItems: 'center' }}>
								<View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
									<Image style={{ resizeMode: 'contain', height: responsiveFontSize(5), width: responsiveFontSize(5) }} source={bank_account} />
									<Text style={{ marginLeft: responsiveWidth(4), fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Bank Account</Text>
								</View>
								{this.state.bankDetailGuId && !signupDetails.isAssistantUser ? <TouchableOpacity onPress={() => this.setState({ isModalVisibleBankAcc: true })}>
									<Image source={EditBlue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginLeft: 10, marginBottom: 10 }} />
								</TouchableOpacity> : null}

							</View>
							{this.state.bankDetailGuId ? <View style={{ marginLeft: responsiveWidth(17), marginRight: responsiveWidth(3), marginBottom: 20 }}>
								<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor }}>{this.state.accountHolderName}</Text>
								<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor }}>{this.state.accountNo ? '***********' + this.state.accountNo.substring(this.state.accountNo.length - 4) : ''}</Text>
								<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor }}> {this.state.radioSelected == 0 ? 'Savings' : this.state.radioSelected == 1 ? 'Current' : 'Other'} Account</Text>
							</View> : <View style={{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), zIndex: 999 }}>
								<Text style={{ marginLeft: responsiveWidth(14), fontSize: CustomFont.font12, color: Color.optiontext, marginBottom: 10 }}>Patients will be able to transfer amount for fees and other bills to this account</Text>

								{!signupDetails.isAssistantUser ?
									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(1), marginLeft: responsiveWidth(14), marginBottom: 20, width: responsiveWidth(45) }} onPress={() => {
										this.setState({ isModalVisibleBankAcc: true, showProgressOnBtn: false });
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12, textAlign: 'center' }}>Add Bank Account</Text>
									</TouchableOpacity> : null}
							</View>
							}
						</View>

						<View style={{ margin: responsiveWidth(3), backgroundColor: Color.white, borderRadius: 6 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: responsiveWidth(3), alignItems: 'center' }}>
								<View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
									<Image style={{ resizeMode: 'contain', height: responsiveFontSize(5), width: responsiveFontSize(5) }} source={Upi} />
									<Text style={{ marginLeft: responsiveWidth(4), fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Add UPI</Text>
								</View>
								{this.state.upiGuId && !signupDetails.isAssistantUser ? <TouchableOpacity onPress={() => {
									let { signupDetails } = this.props;
									timeRange = Trace.getTimeRange();
									Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Add_Upi_Popup', signupDetails.firebaseLocation)
									Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Add_Upi_Popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
									this.setState({ isModalVisibleUpi: true, upiNameOnModal: this.state.upiName })
								}}>
									<Image source={EditBlue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginLeft: 10, marginBottom: 10 }} />
								</TouchableOpacity> : null}
							</View>
							{this.state.upiGuId ? <View style={{ marginLeft: responsiveWidth(17), marginRight: responsiveWidth(3), marginBottom: 20 }}>
								<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor }}>{this.state.upiName ? '*******' + this.state.upiName.substring(this.state.upiName.length - 4) : ''}</Text>
							</View> : <View style={{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
								<Text style={{ marginLeft: responsiveWidth(14), fontSize: CustomFont.font12, color: Color.optiontext, marginBottom: 10 }}>Patients will be able to pay fees and other bills to  this address through different UPI Apps</Text>
								{!signupDetails.isAssistantUser ?
									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(1), marginLeft: responsiveWidth(14), marginBottom: 20, width: responsiveWidth(45) }} onPress={() => {
										let { signupDetails } = this.props;
									timeRange = Trace.getTimeRange();
									Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Add_Upi_Popup',  signupDetails.firebaseLocation)
									Trace.setLogEventWithTrace( signupDetails.firebaseUserType + "Add_Upi_Popup", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })
										this.setState({ isModalVisibleUpi: true, showProgressOnBtn: false });
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12, textAlign: 'center' }}>Add Upi</Text>
									</TouchableOpacity> : null}
							</View>
							}
						</View>

						<View style={{ margin: responsiveWidth(3), backgroundColor: Color.white, borderRadius: 6 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: responsiveWidth(3), alignItems: 'center' }}>
								<View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
									<Image style={{ resizeMode: 'contain', height: responsiveFontSize(5), width: responsiveFontSize(5) }} source={assistant} />
									<Text style={{ marginLeft: responsiveWidth(4), fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Assistant</Text>
								</View>

								{!signupDetails.isAssistantUser ?
									<TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} onPress={() => {
										isAssistantAddUpdateFlag = 'Add';
										this.props.nav.navigation.navigate("AddAssistant", { isEdit: false, assistanceUserGuid: null, assistanceGuid: null,isUpdate: this.isUpdate })
									}}>
										<Image source={plusNew} style={{ height: responsiveFontSize(1.3), width: responsiveFontSize(1.3), resizeMode: 'contain' }} />
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight700, marginLeft: responsiveFontSize(.7) }}>Add</Text>
									</TouchableOpacity> :
									null}
							</View>
							{this.state.assitantArr && this.state.assitantArr.length > 1 ?
								<FlatList
									data={this.state.assitantArr}
									renderItem={({ item, index }) => this.renderAssitantItem(item, index, signupDetails)}
									keyExtractor={(item, index) => index.toString()}
								/>
								: this.state.assitantArr.length == 0 ? <View style={{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), paddingBottom: responsiveHeight(0) }}>
									<Text style={{ marginLeft: responsiveWidth(14), fontSize: CustomFont.font12, color: Color.fontColor }}>You can add your assistants and{'\n'}receptionists to manage your clinic</Text>
									{!signupDetails.isAssistantUser ?
										<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(2), marginLeft: responsiveWidth(14), marginBottom: 20, width: responsiveWidth(45) }}
											onPress={() => {
												isAssistantAddUpdateFlag = 'Add';
												this.props.nav.navigation.navigate("AddAssistant", { isEdit: false,assistanceUserGuid: null, assistanceGuid: null, isUpdate: this.isUpdate })
											}}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12, textAlign: 'center' }}>Add Assistant</Text>
										</TouchableOpacity> : null}





								</View> : null}
							{this.state.assitantArr && this.state.assitantArr.length == 1 && !signupDetails.isAssistantUser ? <View style={{ margin: responsiveWidth(3), borderRadius: 6, backgroundColor: Color.white }}>
								<View style={{ marginTop: responsiveWidth(-4) }}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 15 }}>First Name</Text>
										<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
											selectedIndexAssistantList = 0;
											isAssistantAddUpdateFlag = 'Update'
											this.props.nav.navigation.navigate("AddAssistant",
												{
													isEdit: true,
													assistanceUserGuid: assistanceUserGuid,
													assistanceGuid: assistanceGuid,
													isUpdate: this.isUpdate
												}
											)
										}
										}>
											<Image source={EditBlue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', margin: 7 }} />
										</TouchableOpacity>
									</View>


									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7 }}>{this.state.assitantFName}</Text>

									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 15 }}>Last Name</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7 }}>{this.state.assitantlName}</Text>

									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 15 }}>Mobile Number</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7 }}>{this.state.assitantMobileNumber}</Text>

								</View>

							</View> : null}


						</View>



					</View>



				</ScrollView>

				<Modal isVisible={this.state.isModalVisibleBankAcc} avoidKeyboard={true} onRequestClose={() => this.setState({ isModalVisibleBankAcc: false })}>
					<View style={styles.modelView}>
						<ScrollView keyboardShouldPersistTaps='always'>
							<View style={{ margin: responsiveWidth(6), flex: 1, marginBottom: Platform.OS === 'ios' ? responsiveHeight(30) : responsiveHeight(20) }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
									<Text style={{ fontWeight: '700', fontSize: CustomFont.font18, color: Color.fontColor, marginTop: 10 }}>Bank Details</Text>

									<TouchableOpacity onPress={() => this.setState({ isModalVisibleBankAcc: false, showProgressOnBtn: false })}>
										<Image source={CrossIcon} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', margin: 10 }} />
									</TouchableOpacity>

								</View>

								<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(3.6) }}>Name of Account Holder</Text>
								<TextInput returnKeyType="done"
									placeholderTextColor={Color.placeHolderColor}
									placeholder="Enter Name of Account Holder"
									onFocus={() => this.callOnFocus('1')}
									onBlur={() => this.callOnBlur('1')}
									style={{ paddingLeft: 15, marginTop: 8, borderRadius: 6, height: responsiveHeight(6.5), borderWidth: 1, borderColor: this.state.fld1, margin: 0, padding: 0, fontSize: CustomFont.font16, color: Color.fontColor }} value={this.state.accountHolderName} onChangeText={accountHolderName => {
										this.setState({ accountHolderName })
									}} maxLength={50} />
								{this.state.nameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.nameAlert}</Text> : null}
								<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(3.6) }}>Account Number</Text>
								<TextInput returnKeyType="done"
									placeholderTextColor={Color.placeHolderColor}
									placeholder="Enter Account Number"
									onFocus={() => this.callOnFocus('2')}
									onBlur={() => this.callOnBlur('2')}

									style={{ paddingLeft: 15, marginTop: 8, borderRadius: 6, height: responsiveHeight(6.5), borderWidth: 1, borderColor: this.state.fld2, margin: 0, padding: 0, fontSize: CustomFont.font16, color: Color.fontColor }} value={this.state.accountNo} onChangeText={accountNo => {
										this.setState({ accountNo })
									}} secureTextEntry={true} maxLength={30} />
								{this.state.accNoAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.accNoAlert}</Text> : null}
								<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(3.6) }}>Confirm Account Number</Text>
								<TextInput returnKeyType="done"
									placeholderTextColor={Color.placeHolderColor}
									placeholder="RE-Enter Account Number"
									onFocus={() => this.callOnFocus('3')}
									onBlur={() => this.callOnBlur('3')}
									style={{ paddingLeft: 15, marginTop: 8, borderRadius: 6, height: responsiveHeight(6.5), borderWidth: 1, borderColor: this.state.fld3, margin: 0, padding: 0, fontSize: CustomFont.font16, color: Color.fontColor }} value={this.state.confirmAccountNo} onChangeText={confirmAccountNo => {
										this.setState({ confirmAccountNo })
									}} />
								{this.state.confAccNoAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.confAccNoAlert}</Text> : null}
								<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(3.6) }}>IFSC code</Text>
								<TextInput returnKeyType="done"
									placeholderTextColor={Color.placeHolderColor}
									placeholder="Enter IFSC Code"
									onFocus={() => this.callOnFocus('4')}
									onBlur={() => this.callOnBlur('4')}
									style={{ paddingLeft: 15, marginTop: 8, borderRadius: 6, height: responsiveHeight(6.5), borderWidth: 1, borderColor: this.state.fld4, margin: 0, padding: 0, fontSize: CustomFont.font16, color: Color.fontColor }} value={this.state.ifscCode} onChangeText={ifscCode => {
										this.setState({ ifscCode })
									}} maxLength={11} />

								{/* <Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(3.6) }}>City</Text>
								<TextInput 
								placeholder = "Enter City"
								onFocus = {() => this.callOnFocus('4')}
								onBlur = {() => this.callOnBlur('4')}
								style={{ paddingLeft : 15, marginTop : 8, borderRadius : 6, height: responsiveHeight(6.5), borderWidth: 1, borderColor: Color.inputdefaultBorder , margin: 0, padding: 0, fontSize: CustomFont.font16 }} value={this.state.ifscCode} onChangeText={ifscCode => {
									this.setState({ ifscCode })
								}} /> */}
								{this.state.ifscAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.ifscAlert}</Text> : null}
								<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(3.6) }}>Account Type</Text>

								<View style={{ marginTop: responsiveHeight(3) }}>
									<FlatList
										horizontal={true}
										data={radio_props}
										ItemSeparatorComponent={() => { return (<View style={{ marginEnd: 10 }} />) }}
										renderItem={({ item, index }) => this.renderTopic(item, index)} />
								</View>

								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(4), marginBottom: 20 }} onPress={() => {
									if (AddBankDetailsFlag == 0) {
										this.saveBankAccount();
									} else {
										Snackbar.show({ text: 'Please Wait..', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
									}

								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save </Text>
									{this.state.showProgressOnBtn ? <ActivityIndicator
										size="small"
										color={Color.white}
										style={{
											marginLeft: 10,
											alignSelf: "center"
										}}
									/> : null}
								</TouchableOpacity>
							</View>

						</ScrollView>

					</View>
				</Modal>


				{/* -------------for Upi modal ---------------- */}


				<Modal isVisible={this.state.isModalVisibleUpi} avoidKeyboard={true} onRequestClose={() => this.setState({ isModalVisibleUpi: false })}>
					<View style={[styles.modelViewUpi, { margin: responsiveWidth(6) }]}>
						<View style={{ margin: responsiveWidth(6), flex: 1 }}>
							<View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>UPI Details</Text>
								<TouchableOpacity onPress={() => {
									Trace.stopTrace()
									this.setState({ isModalVisibleUpi: false, showProgressOnBtn: false }
									)
								}}>
									<Image source={CrossIcon} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
								</TouchableOpacity>

							</View>


							<Text style={{ fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(4) }}>Virtual Payment Address</Text>
							<TextInput returnKeyType="done"
								onFocus={() => this.callOnFocus('5')}
								onBlur={() => this.callOnBlur('5')}
								style={{
									marginTop: 8, paddingLeft: 15, borderWidth: 1, borderRadius: 6,
									borderColor: this.state.fld5, height: responsiveHeight(6.5), color: Color.textGrey,
									margin: 0, padding: 0, fontSize: CustomFont.font14
								}} value={this.state.upiNameOnModal} onChangeText={upiNameOnModal => {
									this.setState({ upiNameOnModal })
								}} placeholder="example@upi"
								placeholderTextColor={Color.placeHolderColor} />

							<Text style={{ fontSize: CustomFont.font14, color: Color.textGrey, marginTop: responsiveHeight(4), color: Color.fontColor }}>Please enter UPI Id linked to your registered {'\n'}mobile number</Text>

							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(6), marginBottom: 20, flexDirection: 'row' }} onPress={() => {
								this.saveUPIAccount();
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save </Text>
								{this.state.showProgressOnBtn ? <ActivityIndicator
									size="small"
									color={Color.white}
									style={{
										marginLeft: 10,
										alignSelf: "center"
									}}
								/> : null}

							</TouchableOpacity>
						</View>
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
)(BankAccountDetails);
