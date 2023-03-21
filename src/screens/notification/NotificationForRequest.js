import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text,
	StatusBar, Image, Alert, TouchableOpacity, BackHandler,ScrollView
} from 'react-native';
import CustomFont from '../../components/CustomFont';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import rightarrow_thin from '../../../assets/rightarrow_thin.png';
import tick from '../../../assets/tick.png';
import cross_white from '../../../assets/cross_white.png';
import arrowBack from '../../../assets/arrowBack_white.png';
let RequestStatusGuid = '',RequestedClinicGuid='',doctorGuid='';
class NotificationForRequest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			drName: '',
			speciality: '',
			requestId: '',
			status:'Pending',
		};
	}
	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		//alert(JSON.stringify(this.props.navigation.state.params.item))
		let notificationParam = this.props.navigation.state.params.item;

		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Data": { "NotificationGuid": notificationParam.notificationGuid }
		}
		actions.callLogin('V1/FuncForDrAppToGetRequestNotificationDetails', 'post', params, signupDetails.accessToken, 'getRequestDetails');

	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			//alert(JSON.stringify(newProps.responseData))
			let tagname = newProps.responseData.tag;
			if (tagname === 'getRequestDetails') {
				//console.log(JSON.stringify(newProps.responseData))
				try {
					let data = newProps.responseData.data;
					// let title = newProps.responseData.data[0].title;
					// let body = newProps.responseData.data[0].notificationMessage;
					this.setState({
						drName: data.doctorInfo.doctorName,
						speciality: data.doctorInfo.doctorSpeciality,
						requestId: data.requestGuid,
						status:data.status
					})
					RequestStatusGuid = data.requestStatusGuid;
					//RequestStatusGuid = data.requestStatusId;
					RequestedClinicGuid = data.clinicGuid;
					doctorGuid = data.doctorInfo.doctorGuid;
				} catch (e) { }
			} else if (tagname == 'acceptAndReject') {
				if(newProps.responseData.statusCode=='0'){
					Alert.alert(
						'Success',
						'Your request sent successfully',
						[
							{
								text: 'Ok',
								onPress: () => {
									this.props.navigation.goBack();
								},
							},
						],
						{ cancelable: false },
					);
				}else{
					alert(newProps.responseData.statusMessage)
				}
			}
		}
	}
	getAccept = (status) => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid, "ClinicGuid": RequestedClinicGuid, "DoctorGuid": doctorGuid, "Version": null,
			"Data": {
				"RequestGuid": this.state.requestId,

				"RequestStatusGuid": RequestStatusGuid, "Status":status , "RequestedDate": null, "DoctorInfo": null
			}
		}
		actions.callLogin('V1/FuncForDrAppToAcceptAndDenyClinicRequest', 'post', params, signupDetails.accessToken, 'acceptAndReject');
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
				<View style={{ backgroundColor: Color.primary, }}>
					<TouchableOpacity onPress={() => {
						this.props.navigation.goBack();
					}} style={{ flexDirection: 'row', alignItems: 'center', height: responsiveHeight(7) }} >
						<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2) }} />
						<Text style={{ color: Color.white, fontSize: CustomFont.font16, marginLeft: 10 }}>Request</Text>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>

					<View style={{ flex: 1, margin: responsiveWidth(3) }}>
						<ScrollView>
						{
								this.state.status=='Pending' ?
								<View>
								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font20, color: Color.fontColor, marginTop: responsiveHeight(4), textAlign: 'center' }}>You’ve received a request {'\n'} to join your clinic</Text>
								<View style={{ flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 4, marginTop: responsiveHeight(6), }}>
									<View style={{ flex: 1, margin: responsiveWidth(4) }}>
										<View style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), backgroundColor: '#ECB315', alignItems: 'center', justifyContent: 'center' }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.white, }}>PN</Text>
										</View>
									</View>
									<View style={{ flex: 7, marginTop: responsiveWidth(3), marginBottom: responsiveWidth(4), marginRight: responsiveWidth(2) }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(1), }}>{this.state.drName}</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.fontColor, marginTop: 3 }}>{this.state.speciality}</Text>

									</View>
									<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Image source={rightarrow_thin} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginRight: 10 }} />
									</View>
								</View>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(6), textAlign: 'center' }}>We will notify the person when {'\n'} you respond to this request.</Text>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(8), backgroundColor: Color.primary, marginTop: responsiveHeight(16) }} onPress={() => {
									this.getAccept("Approved");
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Accept Request </Text>
								</TouchableOpacity>

								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(8), backgroundColor: Color.white, marginTop: responsiveHeight(5), borderColor: Color.createInputBorder, borderWidth: 1 }} onPress={() => {
									this.getAccept("Rejected");
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Deny request </Text>
								</TouchableOpacity>
							</View> :this.state.status=='Rejected' ? <View style={{alignItems:'center'}}>
							<View style={{ height: responsiveFontSize(10), width: responsiveFontSize(10), borderRadius: responsiveFontSize(5), backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(7) }}>
						<Image source={cross_white} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
					</View>
								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font20, color: Color.fontColor, marginTop: responsiveHeight(4), textAlign: 'center' }}>You’ve Rejected the request {'\n'} to join your clinic</Text>
								<View style={{ flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 4, marginTop: responsiveHeight(6), }}>
									<View style={{ flex: 1, margin: responsiveWidth(4) }}>
										<View style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), backgroundColor: '#ECB315', alignItems: 'center', justifyContent: 'center' }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.white, }}>PN</Text>
										</View>
									</View>
									<View style={{ flex: 7, marginTop: responsiveWidth(3), marginBottom: responsiveWidth(4), marginRight: responsiveWidth(2) }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(1), }}>{this.state.drName}</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.fontColor, marginTop: 3 }}>{this.state.speciality}</Text>

									</View>
									<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Image source={rightarrow_thin} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginRight: 10 }} />
									</View>
								</View>
								
							</View> : <View style={{alignItems:'center'}}>
							<View style={{ height: responsiveFontSize(10), width: responsiveFontSize(10), borderRadius: responsiveFontSize(5), backgroundColor: '#1EA313', alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(7) }}>
						<Image source={tick} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
					</View>
								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font20, color: Color.fontColor, marginTop: responsiveHeight(4), textAlign: 'center' }}>You’ve Acceted the request {'\n'} to join your clinic</Text>
								<View style={{ flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 4, marginTop: responsiveHeight(6), }}>
									<View style={{ flex: 1, margin: responsiveWidth(4) }}>
										<View style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), backgroundColor: '#ECB315', alignItems: 'center', justifyContent: 'center' }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.white, }}>PN</Text>
										</View>
									</View>
									<View style={{ flex: 7, marginTop: responsiveWidth(3), marginBottom: responsiveWidth(4), marginRight: responsiveWidth(2) }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(1), }}>{this.state.drName}</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.fontColor, marginTop: 3 }}>{this.state.speciality}</Text>

									</View>
									<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Image source={rightarrow_thin} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginRight: 10 }} />
									</View>
								</View>
								
							</View>
							}
							
						</ScrollView>
					</View>


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
)(NotificationForRequest);
