import React, { useState } from 'react';
import {
	StatusBar,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	ImageBackground,
	View,
	Text,
	Alert, Platform, Image, TouchableOpacity, BackHandler, Keyboard, Linking
} from 'react-native';
import arrowBack from '../../../assets/back_blue.png';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Toolbar from '../../customviews/Toolbar.js';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import video_consult from '../../../assets/video_consult.png';
import inclinic_consult from '../../../assets/inclinic_consult.png';
import home_bg from '../../../assets/finding_patient.png';
import experience from '../../../assets/experience.png';
import reg_no from '../../../assets/reg_no.png';
import degree from '../../../assets/degree.png';
import down from '../../../assets/down.png';
import app_icon from '../../../assets/app_icon.png';
import steps from '../../../assets/steps.png';
import rupee from '../../../assets/rupees_preview.png';
import cross_white from '../../../assets/cross_white.png';
import previewBackground from '../../../assets/previewBackground.png';
import preview_bg from '../../../assets/home_bg.png';
let msiteUrl = '';

class WebPagePreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataContenTypeArr: [],
			clinicName: '',
			clinicAddress: '',
			drName: '',
			gender: '',
			speciality: '',
			virtualFee: '',
			inclinicFee: '',
			qualification: '',
			registrationNo: '',
			doctorImage:null
		};
	}
	async componentDidMount() {
		Keyboard.dismiss(0);
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())

		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"PatientGuid": null, "Version": "",
			"Data": ""
		}
		actions.callLogin('V1/FuncForDrAppToOnBoardingPriviewDoctorInfo', 'post', params, signupDetails.accessToken, 'OnBoardingPriviewDoctorInfo');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'OnBoardingPriviewDoctorInfo') {
				if (newProps.responseData.statusCode == 0) {
					let data = newProps.responseData.data;
					this.setState({
						clinicName: data.clinicName, clinicAddress: data.clinicAddress, drName: data.doctorName, gender: data.gender, speciality: data.speciality, virtualFee: data.virtualFee, inclinicFee: data.inclinicFee,
						registrationNo: data.registrationNo,doctorImage:data.doctorImage
					});
					let educationArr = data.educationDetails;
					if (educationArr && educationArr.length > 0) {
						let str = '';
						for (let i = 0; i < educationArr.length; i++) {
							if (i == 0)
								str = educationArr[i].degree;
							else
								str += ',' + educationArr[i].degree
						}
						this.setState({ qualification: str });
					}
					msiteUrl=data.shareUrl ? data.shareUrl.url:'';
				}


			}
		}
	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white,minHeight:responsiveHeight(98) }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.white }}>
					<Image source={preview_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: responsiveWidth(-4), marginTop: -10, }}>
						<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), margin: responsiveWidth(6) }} />
						<Image source={steps} style={{ height: responsiveFontSize(3), width: responsiveFontSize(4), resizeMode: 'contain', marginTop: responsiveHeight(4), marginRight: responsiveWidth(8) }} />
					</View>
					<View style={{ flex: 1, marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4), marginTop: responsiveWidth(2) }}>
						<ScrollView style={{minHeight:responsiveHeight(80)}}>
							<View>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font22, color: Color.text2, fontWeight: 'bold' }}>Your webpage is Live in{'\n'} 7 languages!</Text>
								<Text style={{ marginTop: responsiveWidth(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text2 }}>You can Add/Edit information in Settings.</Text>
								
								<View style={{ marginTop: responsiveFontSize(2), backgroundColor: Color.black, borderRadius: 30, marginLeft: 10, marginRight: 10 }}>
									<View style={{ marginTop: responsiveHeight(4), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(5), backgroundColor: Color.white, borderColor: '#EEEAF4', borderWidth: 1 }}>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ flex: 10, flexDirection: 'row' }}>
												<Image source={app_icon} style={{ marginTop: responsiveHeight(1), resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(4), width: responsiveFontSize(4), marginLeft: responsiveWidth(5) }} />
												<Text style={{ marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.black, marginLeft: responsiveWidth(2), fontWeight: 'bold' }}>DrOnA Health</Text>
											</View>
											<View style={{ flex: 4, flexDirection: 'row' }}>
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, marginTop: responsiveWidth(3), }}>English</Text>
												<Image source={down} style={{ marginTop: responsiveHeight(1.5), resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(1), width: responsiveFontSize(1), marginLeft: responsiveWidth(2) }} />
											</View>
										</View>

										<View style={{ backgroundColor: '#EEEAF4', marginTop: responsiveWidth(3), paddingLeft: responsiveWidth(3), paddingBottom: responsiveWidth(4) }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font24, color: Color.fontColor, marginTop: responsiveWidth(3), marginRight: responsiveWidth(1), fontWeight: 'bold' }}>{this.state.clinicName}</Text>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, marginTop: responsiveWidth(2), }}>{this.state.clinicAddress}</Text>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, marginTop: responsiveWidth(2), paddingBottom: responsiveWidth(4), fontWeight: 'bold' }}>Book an appointment now!</Text>
										</View>

										<View style={{ flexDirection: 'row', borderRadius: responsiveWidth(5), backgroundColor: Color.white, marginTop: responsiveWidth(-3), paddingLeft: responsiveWidth(3), paddingBottom: responsiveWidth(3) }}>
											<View style={{ flext: 4,justifyContent:'center',alignItems:'center' }}>
											{this.state.doctorImage ? <Image source={{uri:this.state.doctorImage}} style={{  height: responsiveFontSize(10), width: responsiveFontSize(10),resizeMode:'contain',borderRadius:6,marginRight:20 }} />: 
											<Image source={home_bg} style={{ marginTop: responsiveHeight(1), resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(15), width: responsiveFontSize(15) }} />}
												
											</View>
											<View style={{ flext: 8 }}>
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveWidth(3), fontWeight: 'bold', width: responsiveWidth(48) }}>{this.state.drName}</Text>
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.textGrey, marginTop: responsiveWidth(2), }}>({this.state.gender})</Text>
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, marginTop: responsiveWidth(2),width:responsiveWidth(50) }}>{this.state.speciality}</Text>
												<View style={{ flexDirection: 'row' }}>
													<Image source={video_consult} style={{ marginTop: responsiveHeight(1), resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(1.5), width: responsiveFontSize(1.5) }} />
													<Image source={rupee} style={{ marginLeft: responsiveWidth(2), marginTop: responsiveHeight(1), resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(1.5), width: responsiveFontSize(1.5) }} />
													<Text style={{ marginLeft: responsiveWidth(1), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, marginTop: responsiveWidth(2), fontWeight: 'bold' }}>{this.state.virtualFee}</Text>
													<Image source={inclinic_consult} style={{ marginLeft: responsiveWidth(4), marginTop: responsiveHeight(1), resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(1.5), width: responsiveFontSize(1.5) }} />
													<Image source={rupee} style={{ marginLeft: responsiveWidth(2), marginTop: responsiveHeight(1), resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(1.5), width: responsiveFontSize(1.5) }} />
													<Text style={{ marginLeft: responsiveWidth(1), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, marginTop: responsiveWidth(2), fontWeight: 'bold' }}>{this.state.inclinicFee}</Text>
												</View>
											</View>

										</View>

										<Text style={{ marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveWidth(3), fontWeight: 'bold' }}>About the Doctor</Text>
										<View style={{ flexDirection: 'row', marginLeft: responsiveWidth(2), alignItems: 'center', marginTop: 10 }}>
											<Image source={experience} style={{ resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
											<Text style={{ marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, }}>{this.state.qualification}</Text>
										</View>
										<View style={{ flexDirection: 'row', marginLeft: responsiveWidth(2), alignItems: 'center', marginBottom: 40, marginTop: 10 }}>
											<Image source={reg_no} style={{ resizeMode: 'contain', alignSelf: 'center', height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
											<Text style={{ marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, }}>{this.state.registrationNo}</Text>
										</View>

									</View>


								</View>

								<View style={{ backgroundColor: Color.white, marginTop: -30, zIndex: 99 }}>
									<TouchableOpacity style={{ height: responsiveHeight(5.8), alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: Color.addAppointmentBackground, }} onPress={() => {
										Linking.openURL(msiteUrl)
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font16 }}>Open My Web Page</Text>
									</TouchableOpacity>

									<TouchableOpacity style={{ height: responsiveHeight(5.8), alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: Color.primaryBlue, marginTop: responsiveHeight(1.8) }} onPress={() => {
										DRONA.setIsReloadApi(true);
										this.props.navigation.navigate('DoctorHome');
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Continue to Home</Text>
									</TouchableOpacity>
								</View>

							</View>
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
)(WebPagePreview);
