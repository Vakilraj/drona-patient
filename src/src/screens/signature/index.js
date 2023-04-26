import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text, StatusBar, Image, TouchableOpacity, BackHandler
} from 'react-native';
import Modal from 'react-native-modal';
import closeIcon from '../../../assets/cross.png';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../customviews/Toolbar.js';

import DrawonscreenIcon from '../../../assets/esignature/drawonscreen.png';
import TakeAPicIcon from '../../../assets/esignature/takeapic.png';
import UploadfromGal from '../../../assets/esignature/uploadfromgal.png';
import ImagePicker from 'react-native-image-crop-picker';
import { setApiHandle } from "../../service/ApiHandle"
import Snackbar from 'react-native-snackbar';


let messageDetailsFullArray = [];

class Signature extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false
		};
	}
	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () =>{
			this.props.navigation.goBack();
			try {
				this.props.navigation.state.params.Refresh();
			} catch (error) {
				
			}
		} );
		this.getSignature();
	}

	openCamera = () => {
		ImagePicker.openCamera({
			cropping: true,
			includeBase64: true,
			compressImageQuality: .5,	
		}).then(image => {
			this.handleCameraGalleryImage(image)
		});
	}
	openGallery = () => {
		ImagePicker.openPicker({
			cropping: true,
			includeBase64: true,
			compressImageQuality: .5,	
		}).then(image => {
			this.handleCameraGalleryImage(image)
		});
	}
	handleCameraGalleryImage = (image) => {
		//console.log('----------------------->>--'+JSON.stringify(image))
		const source = { uri: 'data:image/jpeg;base64,' + image.data };
		this.setState({ isModalVisible: false })
		// let sizeInMb=image.size > 0 ? image.size/1000000 :0;
		// alert('--++-'+sizeInMb)
		// if(sizeInMb > 10) {
		// 	alert('Maximum file upload size allowed is 10 MB')
        // }else{
			this.props.navigation.navigate('ConfirmSignature', { imageSource: source })
		//}
		
	}

	getSignature = () => {
		let { actions, signupDetails } = this.props;
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
			//alert(statusMessage)
		}
	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"e-Signature"}
					onBackPress={() =>{
						this.props.navigation.goBack();
						try {
							this.props.navigation.state.params.Refresh();
						} catch (error) {
							
						}
					}}
					isNotification={false}
					onNotification={() => this.props.navigation.navigate('Notification')} />
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
)(Signature);
