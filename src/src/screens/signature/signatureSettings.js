import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text, StatusBar, Image, TouchableOpacity
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../customviews/Toolbar.js';
import ImagePicker from 'react-native-image-crop-picker';
import UploadfromGal from '../../../assets/esignature/uploadfromgal.png';
import Modal from 'react-native-modal';
import DrawonscreenIcon from '../../../assets/esignature/drawonscreen.png';
import TakeAPicIcon from '../../../assets/esignature/takeapic.png';
import closeIcon from '../../../assets/cross.png';
import { setApiHandle } from "../../service/ApiHandle"
import { NavigationEvents } from 'react-navigation';

let messageDetailsFullArray = [];
let eSignatureGuid = null
let tempSigStatus = true;
class SignatureSetting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			badgeShowStaus: false,
			historyFound: false,
			messageHistoryDetails: [],
			isModalVisible: false,
			isResetModalVisible: false,
			image: null,
			isSignatureDone : true
		};
	}
	async componentDidMount() {
		tempSigStatus = this.props.navigation.getParam("sigAvailable")
		//alert("Signature settings" + '   ' + tempSigStatus)
		this.setState({isSignatureDone:tempSigStatus })
		//alert("Signature settings" + '   ' + this.state.isSignatureDone)
		//this.getMessageHistoryList();
		//this.getSignature()

	}

	// async UNSAFE_componentWillReceiveProps(newProps) {
	// 	if (newProps.responseData && newProps.responseData.tag) {
	// 		let tagname = newProps.responseData.tag;
	// 		if (tagname === 'MessageHistoryList') {
	// 			let data = newProps.responseData.data;
	// 			messageDetailsFullArray = data.deliveryHistory;
	// 			this.setState({ messageHistoryDetails: messageDetailsFullArray });
	// 			console.log('data is', JSON.stringify(data));

	// 		}
	// 	}
	// }

	getMessageHistoryList = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"DoctorGuid": signupDetails.doctorGuid,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
		}
		actions.callLogin('V1/', 'post', params, signupDetails.accessToken, 'MessageHistoryList');
	}

	openCamera = () => {
		ImagePicker.openCamera({
			cropping: true,
			includeBase64: true,
			compressImageQuality: .5,	
		}).then(image => {
			// this.setState({ isAddImage: false })
			this.handleCameraGalleryImage(image)
		});
	}
	openGallery = () => {
		// this.setState({ isAddImage: false })
		ImagePicker.openPicker({
			cropping: true,
			includeBase64: true,
			compressImageQuality: .5,	
		}).then(image => {
			this.handleCameraGalleryImage(image)
		});
	}
	handleCameraGalleryImage = (image) => {

		this.setState({ isModalVisible: false })
		const source = { uri: 'data:image/jpeg;base64,' + image.data };
		// this.setState({ imageSource: source })
		// this.goToPureview(true, source, image.fileName)
		//let sizeInMb=image.size > 0 ? image.size/1000000 :0;
		//alert('---'+sizeInMb)
		// if(sizeInMb > 10) {
		// 	alert('Maximum file upload size allowed is 10 MB')
        // }else{
			this.props.navigation.navigate('ConfirmSignature', { imageSource: source, eSignatureGuid: eSignatureGuid, from : 'nodraw' })
		//}
	}

	removeSign = () => {
		// alert('Coming Soon');
		this.setState({ isResetModalVisible: false })

		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			Data: {
				ESignatureGuid: eSignatureGuid
			}
		}

		actions.callLogin('V1/FuncForDrAppToRemoveDoctorESignature', 'post', params, signupDetails.accessToken, 'ESignatureRemove');
	}

	getSignature = () => {
		let { actions, signupDetails } = this.props;
		tempSigStatus = signupDetails.iseSignatureAvailable;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
		}

		actions.callLogin('V1/FuncForDrAppToGetDoctorESignature', 'post', params, signupDetails.accessToken, 'ESignatureGet');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			setApiHandle(this.handleApi, newProps)
		}
	}

	handleApi = (response, tag, statusMessage) => {
		if (tag === 'ESignatureGet') {
			if (response.eSignatureGuid) {
				eSignatureGuid = response.eSignatureGuid
				this.setState({ image: { uri: response.attachmentUrl } })
			}

		} else if (tag === 'MessageHistoryList') {
			messageDetailsFullArray = response.deliveryHistory;
			this.setState({ messageHistoryDetails: messageDetailsFullArray });
		} else if (tag === 'ESignatureRemove') {
			alert(statusMessage)
			this.setState({image:null})
			let { actions, signupDetails } = this.props;
			signupDetails.iseSignatureAvailable = false;
			actions.setSignupDetails(signupDetails);
			this.props.navigation.navigate('Setting');
		}
	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<NavigationEvents onDidFocus={() => this.getSignature()} />
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"e-Signature"}
					onBackPress={() => this.props.navigation.navigate('Setting')}
					isReset={false}
				// onReset={() => this.clickReset()}
				/>
				{
					tempSigStatus?
					<View>
					<View style={{ borderStyle: 'dashed', borderColor: Color.primary, borderWidth: 1, height: responsiveHeight(50), padding: 15, backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(4), borderRadius: 6 }}>
						<Text style={{ marginTop: responsiveWidth(4), marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, }}>Your signature will be appended in the e-prescriptions generated after each consultation.</Text>
						<Image source={this.state.image ? this.state.image : UploadfromGal} style={{ marginTop: responsiveHeight(2), flex: 1, width: '100%', resizeMode: 'contain' }} />

						<TouchableOpacity style={{ marginTop: responsiveHeight(1), height: responsiveHeight(5), marginLeft: 5, marginRight: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary }}
							onPress={() => this.setState({ isModalVisible: true })}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12 }}>Replace Signature</Text>
						</TouchableOpacity>

						<TouchableOpacity style={{ marginTop: responsiveHeight(1), height: responsiveHeight(5), marginLeft: 5, marginRight: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.lightPurple }}
							onPress={() => this.setState({ isResetModalVisible: true })}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font12 }}>Remove Signature</Text>
						</TouchableOpacity>

					</View>

					<Modal isVisible={this.state.isModalVisible} avoidKeyboard={true}>
						<View style={styles.modelMessageChoose}>
							<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), alignItems: 'center', justifyContent: 'space-between' }}>
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: '700' }}>Replace e-Signature</Text>
								<TouchableOpacity onPress={() => this.setState({ isModalVisible: false })}>
									<Image source={closeIcon} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), marginRight: 20, marginLeft: 20 }} />
								</TouchableOpacity>
							</View>


							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
								onPress={() => {
									this.setState({ isModalVisible: false })
									//this.props.navigation.goBack()
									//this.props.navigation.goBack()
									this.props.navigation.navigate('DrawSignature', { imageSource: null, eSignatureGuid: eSignatureGuid })
								}}>
								<View style={styles.iconViewPop}>
									<Image source={DrawonscreenIcon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain', }} />
								</View>
								<View style={{ flexDirection: 'column', marginRight: 50 }}>
									<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Draw on Screen </Text>
								</View>

							</TouchableOpacity>
							<View style={styles.divider}></View>
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
								onPress={() => {
									//	this.setState({ isModalVisible: false })
									this.openCamera()
								}}>
								<View style={styles.iconViewPop}>
									<Image source={TakeAPicIcon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
								</View>
								<View style={{ flexDirection: 'column', marginRight: 60 }}>
									<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Take A Picture</Text>
								</View>
							</TouchableOpacity>
							<View style={styles.divider}></View>
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}
								onPress={() => {
									//this.setState({ isModalVisible: false })
									this.openGallery()
								}}>
								<View style={styles.iconViewPop}>
									<Image source={UploadfromGal} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
								</View>
								<View style={{ flexDirection: 'column', marginRight: 50 }}>
									<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Upload From Gallery </Text>
								</View>
							</TouchableOpacity>
						</View>
					</Modal>

					<Modal isVisible={this.state.isResetModalVisible} avoidKeyboard={true} >
						<View style={styles.resetModal}>
							<View style={{ flex: 1 }}>
								<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
									<View style={{ flex: 3 }}>
										<Text style={styles.removeText}>Remove Signature?</Text>
									</View>
									<TouchableOpacity style={{ alignItems: 'flex-end', marginRight: 10, }} onPress={() => this.setState({ isResetModalVisible: false })}>
										<Image source={closeIcon}
											style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
									</TouchableOpacity>
								</View>
								<View style={{ marginTop: responsiveHeight(2) }}>
									<Text style={styles.delMsg}>Are you sure you want to remove your signature? Credibility of your prescriptions will be reduced by this.</Text>
								</View>
								<View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: responsiveHeight(2), marginBottom: 20 }}>
									<TouchableOpacity onPress={() => this.setState({ isResetModalVisible: false })} style={{ width: responsiveWidth(40), alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5), borderRadius: 4, borderColor: Color.primary, borderWidth: 1 }}>
										<Text style={[styles.cancelremovetxt, { color: Color.primary }]}>Cancel</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.removeSign()} style={{ width: responsiveWidth(40), alignItems: 'center', borderRadius: 4, justifyContent: 'center', height: responsiveHeight(5), backgroundColor: Color.primary }}>
										<Text style={[styles.cancelremovetxt, { color: Color.white }]}>Remove</Text>
									</TouchableOpacity>
								</View>
							</View>

						</View>
					</Modal>
				</View>
					 :
					 <View>
					 <View style={{ padding: 15, backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(4), marginBottom: responsiveWidth(.5), borderRadius: 6 }}>
						 <View style={{ marginRight: 10 }}>
							 <Text style={{ width: responsiveWidth(70), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, }}>Your signature will be appended in the e-prescriptions generated after each consultation.</Text>
							 <TouchableOpacity style={{ height: responsiveHeight(5), width: responsiveWidth(50), alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary, marginTop: responsiveHeight(3), marginBottom: responsiveHeight(1) }}
								 onPress={() => this.setState({ isModalVisible: true })}
							 >
								 <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12 }}>Add e-Signature</Text>
							 </TouchableOpacity>
						 </View>
					 </View>
 
					 <Modal isVisible={this.state.isModalVisible} avoidKeyboard={true}>
						 <View style={styles.modelMessageChoose}>
							 <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }} onPress={() => this.setState({ isModalVisible: false })}>
								 <Text style={{ marginLeft: 20, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: '700' }}>Add e-Signature</Text>
 
								 <View style={{ marginLeft: responsiveWidth(48) }}>
									 <Image source={closeIcon} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
								 </View>
							 </TouchableOpacity>
 
							 <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
								 onPress={() => {
									 this.setState({ isModalVisible: false })
									 this.props.navigation.navigate('DrawSignature')
								 }}>
								 <View style={styles.iconViewPop}>
									 <Image source={DrawonscreenIcon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain', }} />
								 </View>
								 <View style={{ flexDirection: 'column', marginRight: 50 }}>
									 <Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Draw on Screen </Text>
								 </View>
 
							 </TouchableOpacity>
							 <View style={styles.divider}></View>
							 <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
								 onPress={() => {
									 this.openCamera()
								 }}>
								 <View style={styles.iconViewPop}>
									 <Image source={TakeAPicIcon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
								 </View>
								 <View style={{ flexDirection: 'column', marginRight: 60 }}>
									 <Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Take A Picture</Text>
								 </View>
							 </TouchableOpacity>
							 <View style={styles.divider}></View>
							 <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}
								 onPress={() => {
									 this.openGallery()
								 }}>
								 <View style={styles.iconViewPop}>
									 <Image source={UploadfromGal} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
								 </View>
								 <View style={{ flexDirection: 'column', marginRight: 50 }}>
									 <Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Upload From Gallery </Text>
								 </View>
							 </TouchableOpacity>
						 </View>
					 </Modal>
				 </View>

					
				}
				

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
)(SignatureSetting);