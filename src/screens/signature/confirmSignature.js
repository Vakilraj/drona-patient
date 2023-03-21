import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	StatusBar, Image, TouchableOpacity, Text,Alert
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
let messageDetailsFullArray = [];
import { setApiHandle } from "../../service/ApiHandle"

let prevScreen = '';
class ConfirmSignature extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messageHistoryDetails: [],
			isModalVisible: false,
			signatureImage: ''
		};
	}
	async componentDidMount() {
		let tempImg = this.props.navigation.getParam("imageSource");
		prevScreen =  this.props.navigation.getParam("from");
		this.setState({ signatureImage: tempImg });
	}

	saveSignature = () => {
		let guid = this.props.navigation.getParam("eSignatureGuid");
		let img = this.state.signatureImage.uri.replace("data:image/jpeg;base64,","")
		let fileExtFromBase64 = img && img.startsWith("iV") ? '.png' : '.jpeg'
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"PatientGuid": null,
			"Data": {
				"Attachment": {
					"ESignatureGuid": guid,
					AttachmentUrl: null,
					OrgFileName: "e_sign",
					OrgFileExt: fileExtFromBase64,
					SysFileName: "",
					SysFileExt: "",
					FileBytes:  img,
					"SysFilePath": null,
					"DelMark": 0,
					"UploadedOnCloud": 0,
					"DoctorGuid": null,
					"UserGuid": null
				}
			}

		}
		actions.callLogin('V11/FuncForDrAppToAddDoctorESignature', 'post', params, signupDetails.accessToken, 'ESignatureSave');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			setApiHandle(this.handleApi, newProps)
		}
	}

	handleApi = (response, tag, statusMessage) => {
		if (tag === 'ESignatureSave') {
			let { actions, signupDetails } = this.props;
			signupDetails.iseSignatureAvailable = true;
			actions.setSignupDetails(signupDetails);
			Alert.alert(
				'Success',
				statusMessage,
				[
					{
						text: 'Ok',
						onPress: () => {
							//this.props.navigation.navigate('SignatureSettings');
							if(prevScreen == 'draw'){
								this.props.navigation.goBack(null)
								this.props.navigation.goBack(null)
							}
							else{
								this.props.navigation.goBack()
							}
							
							//this.props.navigation.goBack(null)
						},
					},
				],
				{ cancelable: false },
			);
		}
	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"Confirm e-Signature"}
					onBackPress={() => this.props.navigation.goBack()}
					isNotification={false}
					onNotification={() => this.props.navigation.navigate('Notification')} />
				<View style={{ flex: 1, margin: responsiveHeight(1.5) }}>
					<View style={{ flex: 1 }}>
						<View style={{ borderColor: Color.primary, borderWidth: 1, height: responsiveHeight(50), padding: 2, backgroundColor: Color.white, }}>
							<Image source={this.state.signatureImage} style={{ flex: 1, resizeMode: 'contain' }} />
						</View>
					</View>
					<TouchableOpacity style={{ height: responsiveHeight(5), alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary, marginTop: responsiveHeight(4), marginBottom: responsiveHeight(1) }}
						onPress={() => this.saveSignature()}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12 }}>Confirm</Text>
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
)(ConfirmSignature);