import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text, StatusBar, ImageBackground, Image, TouchableOpacity, Platform, Dimensions, PermissionsAndroid,
} from 'react-native';
import styles from './style';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../customviews/Toolbar.js';
import RNQRGenerator from 'rn-qr-generator';
let tempImg = '';
import CameraRoll from "@react-native-community/cameraroll";
import QRCodeBgIcon from '../../../assets/qrcodebg.png'
import ViewShot from 'react-native-view-shot';
import Snackbar from 'react-native-snackbar';
import { setLogEvent } from '../../service/Analytics';
class DisplayQrCode extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			qrCodeImageContent: '',
			QRCodeGuid: '',
			doctorName: '',
			clinicName: '',
			urcodeUrl : '',
		};
	}
	async componentDidMount() {
		tempImg = this.props.navigation.getParam("qrcode");
		let qrId = this.props.navigation.getParam("qrCodeId");
		let tempClinicName = this.props.navigation.getParam("cName");
		let tempDoctorName = this.props.navigation.getParam("dName");
		this.setState({ qrCodeImageContent: tempImg });
		this.setState({ QRCodeGuid: qrId });
		this.setState({ doctorName: tempDoctorName });
		this.setState({ clinicName: tempClinicName });

		let temp = this.props.navigation.getParam("qrUrl"); 
		this.setState({urcodeUrl : temp});
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'resetqrcode') {
				if (newProps.responseData.statusCode == '-1') {
					let data = newProps.responseData.data;
					this.setState({ qrCodeImageContent: data.qrCodeImgPath })
					this.setState({ QRCodeGuid: data.qrCodeGuid })
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
						//alert(newProps.responseData.statusMessage)
					}, 400);
				}
			}
		}
	}

	resetQrCode = () => {
		this.generateQRCode();
	}
	generateQRCode = () => {
		RNQRGenerator.generate({
			value: this.state.urcodeUrl,
			height: 100,
			width: 100,
			base64: true
		})
			.then(response => {
				const { uri, width, height, base64 } = response;
				//console.log(JSON.stringify(base64))
				// qrCodeStr = { uri: 'data:image/jpeg;base64,' + base64 };
				// this.setState({qrCodeImageContent : 'data:image/jpeg;base64,' + base64});
				this.callAPIResetQRCode(base64);

			})
			.catch(error => {});
	}

	callAPIResetQRCode = (base64) => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Data": {
				"QRCodeImgPath": '',
				"QRCodeGuid": this.state.QRCodeGuid,
				"FileBytes": base64,
			}
		}
		// console.log('Token : ' + signupDetails.accessToken )
		// console.log('Ishan : ' + JSON.stringify(params))
		actions.callLogin('V1/FuncForResetOrSaveGeneratedQRCode', 'post', params, signupDetails.accessToken, 'resetqrcode');

	}
	getBase64=()=>{
		this.refs.viewShot.capture().then((uri) => {
			this.downloadQrCode(uri)
		});
	}
	downloadQrCode = async (uri) => {
		if (Platform.OS == 'ios') {
			CameraRoll.save(uri, { type: 'photo' });
			Snackbar.show({ text: 'Qr code downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					{
						title: 'Storage Permission Required',
						message:
							'App needs access to your storage to download Photos',
					}
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					CameraRoll.save(uri, { type: 'photo' });
			 	Snackbar.show({ text: 'Qr code downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				} else {
					// If permission denied then show alert
					alert('Storage Permission Not Granted');
				}
			} catch (err) {
				//console.warn(err);
			}
		}
	//
	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"QR Code"}
					onBackPress={() => this.props.navigation.navigate('Setting')}
					isQrReset={signupDetails.isAssistantUser ? false:true}
					onResetQrCode={() => {
						let { signupDetails } = this.props;
						setLogEvent("setting", { "resetQR": "click", UserGuid: signupDetails.UserGuid })
						this.resetQrCode()
					}} />
				<View style={{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(4), marginBottom: responsiveWidth(.5), }}>
					<Text style={{ width: responsiveWidth(90), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.black, }}>Generate and print out the below QR code and place it in your clinic for your patients to scan for check-in when they visit your clinic.</Text>
					<ViewShot
						style={styles.viewshot}
						ref="viewShot"
						options={{ format: 'jpg', quality: 0.9 }}>

						<ImageBackground source={QRCodeBgIcon}
							imageStyle={{ borderRadius: 10 }}
							resizeMode="cover" style={{
								alignItems: 'center', padding: 15, paddingTop: 40,
								marginTop: responsiveWidth(4),
								marginBottom: responsiveWidth(.5), borderRadius: 10
							}}>
							<Text style={{ textAlign: 'center', fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font24, color: Color.fontColor, }}>
								{this.state.clinicName}
							</Text>
							<Text style={{ textAlign: 'center', fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.2), color: Color.darkText }}> {this.state.doctorName.replace('  ',' ')}</Text>
							<Text style={{ textAlign: 'center', width: responsiveWidth(90), fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font16, marginTop: responsiveHeight(3.5), color: Color.primary }}>Scan the QR Code to Check-In or Register</Text>

							<View style={{
								shadowOffset: { width: 0, height: 2 }, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), alignItems: 'center', padding: 30, backgroundColor: Color.white,
								marginTop: responsiveHeight(4.5), marginBottom: responsiveWidth(.5), borderWidth: .5, borderColor: '#ddd',
								borderRadius: 10, shadowColor: Color.white, shadowOpacity: 0.9
							}}>

								<Image source={{ uri: this.state.qrCodeImageContent }}
									style={{
										height: responsiveHeight(30), width: responsiveHeight(28),
										resizeMode: 'contain'
									}} />
							</View>
						</ImageBackground>
					</ViewShot>
				</View>
				<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: responsiveHeight(10), backgroundColor: Color.white, position: 'absolute', bottom: 0, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
					<TouchableOpacity style={{ height: responsiveHeight(5), width: responsiveWidth(90), alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: Color.primary }}
						onPress={() => this.getBase64()}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font12 }}>Download QR Code</Text>
					</TouchableOpacity>
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
)(DisplayQrCode);