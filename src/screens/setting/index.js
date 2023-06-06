import React from 'react';
import {
	Image, FlatList, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View, Platform, BackHandler
} from 'react-native';
import Modal from 'react-native-modal';
import RNPrint from 'react-native-print';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNFetchBlob from 'rn-fetch-blob';
import eye from '../../../assets/eye.png';
import eyeClose from '../../../assets/eyeClose.png';
import cross from '../../../assets/cross_blue.png';
import edit_blue from '../../../assets/edit_new_blue.png';
import ic_timing from '../../../assets/new_appointment.png';
import new_notification from '../../../assets/new_notification.png';
import prescription_template from '../../../assets/prescription_template.png';
import print_prescription from '../../../assets/print_prescription.png';
import arrow_right from '../../../assets/right_arrow_new.png';
import whatsapp_logo from '../../../assets/whatsapp_logo.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont'
import CommonStyle from '../../components/CommonStyle.js';
import Validator from '../../components/Validator';
import Toolbar from '../../customviews/Toolbar.js';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import styles from './style';
import { NavigationEvents } from 'react-navigation';
import Snackbar from 'react-native-snackbar';
import virtual_signature from '../../../assets/esignature/virtual_img.png';
import qr_code from '../../../assets/qrcodeicon.png';
import AsyncStorage from 'react-native-encrypted-storage';
import Language from '../../utils/Language.js';
import { sha256 } from 'js-sha256';
import Trace from '../../service/Trace'
const resources = {
	file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
	// url: 'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/d643459d-c62f-11eb-b68b-0022486b91c8.pdf?sv=2018-03-28&sr=f&sig=8u9Rr80lMSA6uVVFvaOR%2BRTdQlc%2B%2FaxqKodlkrpL8Kw%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637585163757322307',
	url: 'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/d643459d-c62f-11eb-b68b-0022486b91c8.pdf?sv=2018-03-28&sr=f&sig=8u9Rr80lMSA6uVVFvaOR%2BRTdQlc%2B%2FaxqKodlkrpL8Kw%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637585163757322307',
	// url:'http://www.linkingnodes.com/files/letusc.pdf',
	base64: 'JVBERi0xLjMKJcfs...',
};
let prescriptionTemplates = '';
let qrcodeurl = '';
let selectedIndex = 0, tempSelectedIndex = 0;

class Setting extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			notificationSettingData: [],
			appointmentSettingData: [],
			whatsappSettingDate: [],
			isChangePasswordModal: false,
			currPasswordShowStatus: true,
			newPasswordShowStatus: true,
			confirmPasswordShowStatus: true,
			keyboardAvoiding: 0,
			oldPassword: '',
			newPassword: '',
			confirmNewPassword: '',
			isPasswordChanged: false,
			assistantProfileData: {},
			isSignatureExist: true,

			isQrCodeExist: false,
			clinicName: '',
			doctorName: '',
			qrCodeImageUrl: '',
			qrCodeId: '',
			isLanguage: false,
			languageArr: [
				{ value: 'en', index: 0, label: 'English', isTempSelected: false },
				{ value: 'be', index: 1, label: 'Bengali', isTempSelected: false },
				{ value: 'hi', index: 2, label: 'Hindi', isTempSelected: false },
				{ value: 'ma', index: 3, label: 'Marathi', isTempSelected: false },
				{ value: 'ta', index: 4, label: 'Tamil', isTempSelected: false },
				{ value: 'te', index: 5, label: 'Telugu', isTempSelected: false },
				{ value: 'gu', index: 6, label: 'Gujarati', isTempSelected: false },
			],
		}
	}
	async componentDidMount() {
		//
		let tempIndex = await AsyncStorage.getItem('lanIndex');
		selectedIndex = tempIndex == null ? 0 : tempIndex
		this.setLanguage(selectedIndex)
		this.setState({ selectedIndex: tempIndex == null ? 0 : tempIndex });
		//
		//this.Refresh();
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
	}
	Refresh = () => {
		let { signupDetails } = this.props;
		if (signupDetails.isAssistantUser) {
			this.getAssistantProfile()
		}
		else {
			this.getListofSettings();
		}
		//alert('ll')
	}
	getListofSettings = () => {
		let { actions, signupDetails } = this.props;
		this.setState({ isSignatureExist: signupDetails.iseSignatureAvailable });
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
		}
		actions.callLogin('V1/FuncForDrAppToGetListofSettings', 'post', params, signupDetails.accessToken, 'ListofSettings');
	}

	getAssistantProfile = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Data": {}
		}
		actions.callLogin('V1/FuncForDrAppToGetAssistantProfile', 'post', params, signupDetails.accessToken, 'assistantProfile');
	}

	passwordChange = () => {
		let { actions, signupDetails } = this.props;

		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Data": {
				"MobileNo": signupDetails.assistantMobile,
				"UserName": signupDetails.assistantMobile,
				"OldPassword": sha256(this.state.oldPassword),
				"NewPassword": sha256(this.state.newPassword),
				"ConfirmPassword": sha256(this.state.confirmNewPassword),
				"UpdatedBy": "1"
			}
		}
		actions.callLogin('V1/FuncForDrAppToAssistantChangePassword', 'post', params, signupDetails.accessToken, 'assistantChangePasswords');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname == "ListofSettings") {
				let data = newProps.responseData.data;
				let tempNotificationSettingData = data.notificationSetting;
				tempNotificationSettingData = tempNotificationSettingData.filter(function (el) { return el.applicationSettingName != "Desktop Notification"; });
				let tempAppointmentSettingData = data.appointmentSetting;

				this.setState({
					notificationSettingData: tempNotificationSettingData,
					appointmentSettingData: tempAppointmentSettingData,
					whatsappSettingDate: data.whatsappSetting
				})

				if (data.prescriptionTemplate && data.prescriptionTemplate.length) {
					prescriptionTemplates = data.prescriptionTemplate
					resources.url = data.prescriptionTemplate[0].templateUrl
				}
				if (data.qrCode != null) {
					if (data.qrCode[0].statusOfQRCode != null) {

						this.setState({ isQrCodeExist: true })
						this.setState({ clinicName: data.qrCode[0].clinicName })
						this.setState({ doctorName: data.qrCode[0].doctorName })
						this.setState({ qrCodeImageUrl: data.qrCode[0].statusOfQRCode.qrCodeImgPath })
						this.setState({ qrCodeId: data.qrCode[0].statusOfQRCode.qrCodeGuid })
						qrcodeurl = data.qrCode[0].qrCodeUrl;
					}
					else {
						if (data.qrCode[0].qrCodeUrl != '') {
							qrcodeurl = data.qrCode[0].qrCodeUrl;
						}

						this.setState({ clinicName: data.qrCode[0].clinicName })
						this.setState({ doctorName: data.qrCode[0].doctorName })
						this.setState({ isQrCodeExist: false });

					}
				}


			}
			else if (tagname == "assistantChangePasswords") {
				let meg = newProps.responseData.statusMessage;
				let codeCross = newProps.responseData.statusCode;
				if (codeCross === "-1") {
					this.setState({ isChangePasswordModal: false })
					setTimeout(() => {
						this.props.navigation.navigate('AssistantPasswordChangeSuccess')
					}, 200)
				} else {
					Snackbar.show({ text: meg, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			} else if (tagname == "assistantProfile") {
				let data = newProps.responseData.data;
				this.setState({ assistantProfileData: data })
				this.getListofSettings();
				if (this.props.navigation.state.params.from == 'completeProfile' && !data.assistanceFirstName) {
					setTimeout(() => {
						this.props.navigation.navigate("AssistantProfile", { assistantProfileData: data, Refresh: this.Refresh })
					}, 200)


				}
			}
		}
	}

	onNotificationDataHandle = (response) => {
		this.setState({
			notificationSettingData: response
		})
	}
	onAppointmentsDataHandle = (response) => {
		this.setState({
			appointmentSettingData: response
		})
	}

	renderItem = ({ item, index }) => {
		let isSelected = item.isTempSelected;
		return (
			<TouchableOpacity style={{
				flexDirection: 'row', marginEnd: 8, marginTop: 8,
				width: responsiveWidth(27.4),
				backgroundColor: isSelected ? Color.lightpinkbg : Color.white,
				height: responsiveHeight(7),
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 10,
				justifyContent: 'center',
				alignItems: 'center',
				borderColor: isSelected ? Color.pink : Color.lightBlue,
				borderWidth: 1
			}}
				onPress={() => {
					Trace.stopTrace();
					 this.setLanguage(index) }}>
				<Text zIndex={999} style={{ color: Color.darkGray, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700 }}>{item.label}</Text>
			</TouchableOpacity>
		);
	};
	setLanguage = (index) => {
		tempSelectedIndex = index;
		//alert(tempSelectedIndex)
		try {
			AsyncStorage.setItem('lanIndex', tempSelectedIndex.toString())
		} catch (e) { }
		for (let i = 0; i < this.state.languageArr.length; i++) {
			this.state.languageArr[i].isTempSelected = i == index;
		}
		this.setState({ languageArr: this.state.languageArr, isLanguage: false })
		Language.language.setLanguage(this.state.languageArr[index].value)
	}

	downloadPdf = async () => {
		try {
			if (Platform.OS == 'android') {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					this.actualDownload();
				} else {
					Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
				}
			} else {
				this.actualDownload();
			}
		} catch (err) {
			console.warn(err);
		}
	}

	actualDownload1 = () => {
		//  var RandomNumber = Math.floor(Math.random() * 100) + 1 ;
		const { dirs } = RNFetchBlob.fs;
		RNFetchBlob.config({
			fileCache: true,
			addAndroidDownloads: {
				useDownloadManager: true,
				notification: true,
				mediaScannable: true,
				//  title: RandomNumber.toString() + `test.pdf`,
				title: `prescription.pdf`,
				path: `${dirs.DownloadDir}/test.pdf`,
			},
		}).fetch('GET', resources.url, {})
			.then((res) => {
				// console.log('The file saved to ', res.path());
				alert('File successfully downloaded')
			})
			.catch((e) => {
				//console.log(e)
			});
	}
	actualDownload = () => {
		const { dirs } = RNFetchBlob.fs;
		const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
		let fileName = "pastEncounter" + (new Date()).getTime() + '.pdf'
		const configfb = {
			fileCache: true,
			useDownloadManager: true,
			notification: true,
			mediaScannable: true,
			title: 'test',
			path: `${dirToSave}/` + fileName,
		}
		const configOptions = Platform.select({
			ios: {
				fileCache: configfb.fileCache,
				title: configfb.title,
				path: configfb.path,
				appendExt: 'pdf',
			},
			android: configfb,
		});

		RNFetchBlob.config(configOptions)
			.fetch('GET', resources.url, {})
			.then((res) => {
				if (Platform.OS === "ios") {
					RNFetchBlob.ios.openDocument(res.data);
					// RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
					// RNFetchBlob.ios.previewDocument(configfb.path);
				}
				//setisdownloaded(false)
				if (Platform.OS == 'android') {
					Snackbar.show({ text: 'File downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				//console.log('The file saved to ', res);
			})
			.catch((e) => {
				//console.log('The file saved to ERROR', e.message)
			});
	}
	async printRemotePDF() {
		await RNPrint.print({ filePath: resources.url })
	}

	render() {
		let { signupDetails } = this.props;

		const notificationSetting = () => {
			return (
				<View style={{ borderBottomWidth: 1, borderColor: '#e8e1FF' }}>
					<TouchableOpacity style={styles.container}
						onPress={() => {
							this.props.navigation.navigate('NotificationSetting', { onNotificationDataHandle: this.onNotificationDataHandle, notificationSettingData: this.state.notificationSettingData })
						}}>
						<View style={styles.viewContainer}>
							<View style={styles.imageContainer}>
								<Image source={new_notification} style={styles.iconView} />
							</View>
							<View style={styles.lableContainer}>
								<Text style={styles.lable}>Notifications</Text>
							</View>
							<View style={styles.arrowContainer}>
								<Image source={arrow_right} style={styles.arrowView} />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		}

		const settingAppointments = () => {
			return (
				<View style={{ borderBottomWidth: 1, borderColor: '#e8e1FF' }}>
					<TouchableOpacity style={styles.container}
						onPress={() => {
							this.props.navigation.navigate('SettingAppointments', { onAppointmentsDataHandle: this.onAppointmentsDataHandle, appointmentSettingData: this.state.appointmentSettingData, from: 'appointment' })
						}}>
						<View style={styles.viewContainer}>
							<View style={styles.imageContainer}>
								<Image source={ic_timing} style={styles.iconView} />
							</View>
							<View style={styles.lableContainer}>
								<Text style={styles.lable}>Appointments</Text>
							</View>
							<View style={styles.arrowContainer}>
								<Image source={arrow_right} style={styles.arrowView} />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		}

		const settingQrCode = () => {
			return (
				<View style={{ borderBottomWidth: 1, borderColor: '#e8e1FF' }}>
					<TouchableOpacity style={styles.container}
						onPress={() => {
							if (this.state.isQrCodeExist) {
								this.props.navigation.navigate('DisplayQrCode', {
									qrcode: this.state.qrCodeImageUrl,
									qrCodeId: this.state.qrCodeId,
									dName: this.state.doctorName,
									cName: this.state.clinicName,
									qrUrl: qrcodeurl, Refresh: this.Refresh
								})
							}
							else {
								if (qrcodeurl != '') {
									this.props.navigation.navigate('GenerateQrCode', {
										dName: this.state.doctorName,
										cName: this.state.clinicName, codeurl: qrcodeurl, Refresh: this.Refresh
									})
								}
								else {
									Snackbar.show({ text: 'QR code does not exist', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								}

							}

						}}>

						<View style={styles.viewContainer}>
							<View style={styles.imageContainer}>
								<Image source={qr_code} style={styles.iconView} />
							</View>
							<View style={styles.lableContainer}>
								<Text style={styles.lable}>QR Code</Text>
							</View>
							<View style={styles.arrowContainer}>
								<Image source={arrow_right} style={styles.arrowView} />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		}

		const settingWhatsApp = () => {
			return (
				<TouchableOpacity style={styles.container}
					onPress={() => {
						this.props.navigation.navigate('SettingAppointments', { onAppointmentsDataHandle: this.onAppointmentsDataHandle, appointmentSettingData: this.state.whatsappSettingDate, from: 'whatsapp' })
					}}>

					<View style={styles.viewContainer}>
						<View style={styles.imageContainer}>
							<Image source={whatsapp_logo} style={styles.iconView} />
						</View>
						<View style={styles.lableContainer}>
							<Text style={styles.lable}>Receive Updates on WhatsApp</Text>
						</View>
						<View style={styles.arrowContainer}>
							<Image source={arrow_right} style={styles.arrowView} />
						</View>
					</View>
				</TouchableOpacity>

			)
		}
		const eSignatureView = () => {
			return (
				// iseSignatureAvailable
				<View style={{ borderBottomWidth: 1, borderColor: '#e8e1FF' }}>
					<TouchableOpacity style={styles.container}
						onPress={() => {
							this.props.navigation.navigate('SignatureSettings', {sigAvailable : this.state.isSignatureExist, Refresh: this.Refresh })
							// if (this.state.isSignatureExist) {
							// 	this.props.navigation.navigate('SignatureSettings', { Refresh: this.Refresh })
							// }
							// else {
							// 	this.props.navigation.navigate('Signature', { Refresh: this.Refresh })
							// }

						}}>
						<View style={styles.viewContainer}>
							<View style={styles.imageContainer}>
								<Image source={virtual_signature} style={{ height: responsiveHeight(2), width: responsiveHeight(2), resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center' }} />
							</View>
							<View style={styles.lableContainer}>
								<Text style={styles.lable}>e-Signature</Text>
							</View>
							<View style={styles.arrowContainer}>
								<Image source={arrow_right} style={styles.arrowView} />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		}

		const prescriptionView = () => {
			return (
				<View style={{ borderBottomWidth: 1, borderColor: '#e8e1FF' }}>
					<TouchableOpacity style={styles.container}
						onPress={() => {
							this.props.navigation.navigate('PrescriptionTemplate', { list: prescriptionTemplates })
						}}>
						<View style={styles.viewContainer}>
							<View style={styles.imageContainer}>
								<Image source={prescription_template} style={styles.iconView} />
							</View>
							<View style={styles.lableContainer}>
								<Text style={styles.lable}>Prescription Template</Text>
							</View>
							<View style={styles.arrowContainer}>
								<Image source={arrow_right} style={styles.arrowView} />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)
		}

		const samplePrescriptionView = () => {
			return (
				<View style={{ borderBottomWidth: 1, borderColor: '#e8e1FF' }}>
					<TouchableOpacity style={styles.container}
						onPress={() => { this.printRemotePDF() }}>
						<View style={styles.viewContainer}>
							<View style={styles.imageContainer}>
								<Image source={print_prescription} style={styles.iconView} />
							</View>
							<View style={styles.lableContainer}>
								<Text style={styles.lable}>Print a sample prescription</Text>
							</View>
							<View style={styles.arrowContainer}>
								<Image source={arrow_right} style={styles.arrowView} />
							</View>

						</View>
					</TouchableOpacity>
				</View>
			)
		}

		const laguageView = () => {
			return (
				<TouchableOpacity style={styles.container}
					onPress={() => {
						let { signupDetails } = this.props;
						let timeRange = Trace.getTimeRange();
		                Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality,signupDetails.firebaseUserType +'Choose_Prescription_Language', signupDetails.firebaseLocation );
				        Trace.setLogEventWithTrace( signupDetails.firebaseUserType + "Choose_Prescription_Language", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
						this.setState({ isLanguage: true }) }}>
					<View style={styles.viewContainer}>
						<View style={styles.imageContainer}>
							<Image source={print_prescription} style={styles.iconView} />
						</View>
						<View style={styles.lableContainer}>
							<Text style={styles.lable}>Choose Prescription Language</Text>
						</View>
						<View style={styles.arrowContainer}>
							<Image source={arrow_right} style={styles.arrowView} />
						</View>

					</View>
				</TouchableOpacity>
			)
		}

		return (
			<SafeAreaView style={CommonStyle.container}>
				<NavigationEvents onDidFocus={() => {
					if (signupDetails.isAssistantUser) {
						this.getAssistantProfile()
					}
					else {
						this.getListofSettings();
					}
				}} />
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"Settings"}
					onBackPress={() => this.props.navigation.goBack()} />
				<ScrollView style={{ flex: 1, backgroundColor: Color.newBgColor }}>
					{signupDetails.isAssistantUser ?
						<View style={{ backgroundColor: Color.white, borderRadius: 10, marginTop: responsiveHeight(2), marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4) }}>
							<View style={{ margin: responsiveWidth(3) }}>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
									<View style={styles.headingContainer}>
										<Text style={styles.headingView}>Profile</Text>
									</View>
									<TouchableOpacity style={{ margin: responsiveWidth(1.5) }} onPress={() => this.props.navigation.navigate("AssistantProfile", { assistantProfileData: this.state.assistantProfileData, Refresh: this.Refresh })}>
										<Image source={edit_blue} style={{ height: responsiveHeight(4), width: responsiveWidth(4), resizeMode: 'contain' }} />
									</TouchableOpacity>

								</View>

								<Text style={{ ...styles.profileTitle, marginTop: 0 }}>Name</Text>
								<Text style={styles.profileTxt}>{Object.keys(this.state.assistantProfileData).length != 0 ? this.state.assistantProfileData.assistanceFirstName + " " + this.state.assistantProfileData.assistanceLastName : ''}</Text>

								<Text style={styles.profileTitle}>Phone Number</Text>
								<Text style={styles.profileTxt}>+91 {Object.keys(this.state.assistantProfileData).length != 0 ? this.state.assistantProfileData.phoneNo : ''}</Text>

								<Text style={styles.profileTitle}>Email address</Text>
								<Text style={styles.profileTxt}>{Object.keys(this.state.assistantProfileData).length != 0 ? this.state.assistantProfileData.email : ''}</Text>

							</View>
						</View>
						: null}
					<View style={{ backgroundColor: Color.white, borderRadius: 10, marginTop: responsiveHeight(2), marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4) }}>
						<View style={styles.headingContainer}>
							<Text style={styles.headingView}>General</Text>
						</View>

						{settingQrCode()}
						{notificationSetting()}
						{settingAppointments()}
						{settingWhatsApp()}


					</View>

					<View style={{ backgroundColor: Color.white, borderRadius: 10, marginTop: responsiveHeight(2), marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4) }}>
						<View style={styles.headingContainer}>
							<Text style={styles.headingView}>Prescriptions</Text>
						</View>

						{prescriptionView()}
						{samplePrescriptionView()}
						{signupDetails.isAssistantUser ? null : eSignatureView()}
						{laguageView()}
					</View>
					{signupDetails.isAssistantUser ?
						<View style={{ backgroundColor: Color.white, borderRadius: 10, marginTop: responsiveHeight(2), marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4), marginBottom: responsiveHeight(4) }}>
							<View style={{ margin: responsiveWidth(3) }}>
								<View style={styles.headingContainer}>
									<Text style={styles.headingView}>Security</Text>
								</View>

								<TouchableOpacity style={{ marginTop: responsiveHeight(2) }} onPress={() =>{
									let timeRange = Trace.getTimeRange();
									Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +"Change_Password",  signupDetails.firebaseLocation);
									Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Change_Password", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
									this.setState({ isChangePasswordModal: true })
								} } >
									<Text style={[styles.profileTxt, { color: Color.primary }]}>Change Password</Text>
								</TouchableOpacity>

							</View>
						</View> : null}

					<Modal isVisible={this.state.isChangePasswordModal} avoidKeyboard={true}>
						<View style={[styles.modelViewAbout, { height: responsiveHeight(80) }]}>
							<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={this.state.keyboardAvoiding}>
								<ScrollView>
									<View style={{ margin: responsiveWidth(5) }}>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
											<Text style={styles.modelMainTitle}>Change Password</Text>
											<TouchableOpacity style={{ padding: 10 }} onPress={() =>{
												Trace.stopTrace();
												this.setState({ isChangePasswordModal: false })
											} }>
												<Image source={cross} style={styles.crossIcon} />
											</TouchableOpacity>
										</View>

										<Text style={styles.tiTitle}>Current Password</Text>
										<View>
											<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(2.5), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ currPasswordShowStatus: !this.state.currPasswordShowStatus })} >
												<Image source={this.state.currPasswordShowStatus ? eye : eyeClose} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginTop: responsiveHeight(.8), tintColor: Color.primary }} />
											</TouchableOpacity>
											<TextInput returnKeyType="done" style={[styles.createInputStyle, { borderColor: this.state.fld1, }]}
												placeholder="Enter current password"
												autoCapitalize="none"
												autoCorrect={false}
												secureTextEntry={this.state.currPasswordShowStatus}
												value={this.state.oldPassword}
												onChangeText={text => {
													this.setState({ oldPassword: text });
												}}
												placeholderTextColor={Color.placeHolderColor}
												onBlur={() => this.setState({ fld1: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1: Color.primary })} onSubmitEditing={() => this.refs.ref1.focus()} />

										</View>


										<Text style={styles.tiTitle}>New Password</Text>
										<View>
											<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(2.5), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ newPasswordShowStatus: !this.state.newPasswordShowStatus })} >
												<Image source={this.state.newPasswordShowStatus ? eye : eyeClose} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginTop: responsiveHeight(.8), tintColor: Color.primary }} />
											</TouchableOpacity>
											<TextInput returnKeyType="done" style={[styles.createInputStyle, { borderColor: this.state.fld2, }]}
												placeholder="Enter new password"
												autoCapitalize="none"
												autoCorrect={false}
												secureTextEntry={this.state.newPasswordShowStatus}
												value={this.state.newPassword}
												placeholderTextColor={Color.placeHolderColor}
												//onSubmitEditing={() => this.refs.age.focus()}
												onChangeText={text => {
													this.setState({ newPassword: text });
												}}
												onBlur={() => this.setState({ fld2: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld2: Color.primary })}
												ref='ref1' onSubmitEditing={() => this.refs.ref2.focus()} />
										</View>



										<View style={{ flex: 4 }}>
											<Text style={styles.tiTitle}>Confirm New Password</Text>
											<View>
												<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(2.5), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ confirmPasswordShowStatus: !this.state.confirmPasswordShowStatus })} >
													<Image source={this.state.confirmPasswordShowStatus ? eye : eyeClose} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginTop: responsiveHeight(.8), tintColor: Color.primary }} />
												</TouchableOpacity>
												<TextInput returnKeyType="done" onBlur={() => this.setState({ fld3: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld3: Color.primary })} style={[styles.createInputStyle, { borderColor: this.state.fld3, }]}
													placeholder="Re-enter new password"
													autoCapitalize="none"
													autoCorrect={false}
													secureTextEntry={this.state.confirmPasswordShowStatus}
													value={this.state.confirmNewPassword}
													onChangeText={text => {
														this.setState({ confirmNewPassword: text });
													}}
													placeholderTextColor={Color.placeHolderColor}
													ref='ref2' />
											</View>
										</View>
										<TouchableOpacity style={styles.modalBtn} onPress={() => {
											if (this.state.oldPassword.length == 0) {
												Snackbar.show({ text: "Please enter old password", duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											} else if (this.state.newPassword.length == 0) {
												Snackbar.show({ text: "Please enter new password", duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											} else if (this.state.newPassword.length < 8) {
												Snackbar.show({ text: "New password length must be atleast 8", duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											}else if (!Validator.isStrongPassword(this.state.newPassword)) {
												Snackbar.show({ text: 'New Password must be contain 1 uppercase, 1 lowercase, 1 numeric and 1 special characters', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											} else if (this.state.oldPassword == this.state.newPassword) {
												Snackbar.show({ text: "New password length must not be same as old password", duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											} else if (this.state.newPassword != this.state.confirmNewPassword) {
												Snackbar.show({ text: "confirmNewPassword must be same as New password", duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											} else {
												this.passwordChange();
												Trace.stopTrace();
											}
										}}>
											<Text style={styles.modalBtnTxt}>Save New Password</Text>
										</TouchableOpacity>
									</View>
								</ScrollView>
							</KeyboardAvoidingView>
						</View>
					</Modal>

					<Modal isVisible={this.state.isLanguage} avoidKeyboard={true}>
						<View style={styles.modelView1}>
							<View style={[{ flexDirection: 'row', marginStart: 24, marginEnd: 24, marginTop: 0, }]}>
								<Text style={{ ...styles.modalHeading, fontWeight: CustomFont.fontWeight700 }}>Choose Language</Text>
								<TouchableOpacity style={{ paddingLeft: 20, paddingRight: 10, justifyContent: 'center', marginTop: responsiveHeight(-.5), marginStart: 10 }} onPress={() =>{
									Trace.stopTrace();
									this.setState({ isLanguage: false })
								}}>

									<Image style={{ height: responsiveHeight(4), width: responsiveWidth(4), resizeMode: 'contain' }} source={cross} />
								</TouchableOpacity>
							</View>

							<FlatList
								data={this.state.languageArr}
								renderItem={this.renderItem}
								style={[{ marginStart: 24, marginEnd: 24, marginTop: 24, }]}
								numColumns={3}
							/>
							{/* <Text>d,b,</Text> */}
						</View>
					</Modal>


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
)(Setting);
