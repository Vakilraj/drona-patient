import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Dimensions,
	Text, Image, TouchableOpacity, Platform, BackHandler
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import arrowBack from '../../../assets/back_blue.png';
import vector_phone from '../../../assets/vector_phone.png';
import fullscreen from '../../../assets/fullscreen.png';
import close from '../../../assets/close.png';
import dentist_complete from '../../../assets/dentist_complete.png';

import Modal from 'react-native-modal';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'

import Draggable from 'react-native-draggable';
import _ from 'lodash';
import Consultation from './Consultation'
import MedicalHistory from './MedicalHistory'
import TreatmentPlanTab from './TreatmentPlanTab'
import BillingBlankTab from './billing/billingBlankTab'
import PrescriptionCopyPad from './PrescriptionCopyPad'
import Files from './files/index'
import Twilio from '../twilio'
let item = null, from = '',fromTab=0, pastAppointGuid='';
class ConsultationTab extends React.Component {

	constructor(props) {
		super(props);
		let tabIndex = props.navigation.state.params.tabIndex; //Dentistry
		this.state = {
			dataArray: [],
			dateTab: [],
			isModalVisible: false,
			imageSource: null,
			showCall: false,
			initialPage: tabIndex ? tabIndex : 0,
			//initialPage: from == 'medical' ? 1 : from == 'files' ? props.signupDetails.isAssistantUser && !props.signupDetails.isAllowMedicalHistoryAssistant ? 1 : 2 : 0,
			gotoPage:0,
			patientName: '',
			patientGender: '',
			patientAge: '',
			isFullScreenVideo: true,
			hardWareBackEvent: false,
			xAxis: 0,
			yAxis: 0,
			responseDataVisitInfo: null,
			isSaveTabDataModal:false,
			pageChangeIndex:0,
			isDataSaved: false,
		};
		DRONA.setIsConsultationChange(false)
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
	getAdditionalInfo = () => {
		let { actions, signupDetails } = this.props;
		signupDetails.returnValueFromTwilio=false;
		actions.setSignupDetails(signupDetails)
		pastAppointGuid='';
		if(from=='Past Encounters'){
			pastAppointGuid=this.props.navigation.state.params.data.pastAppointmentGuid;
		}
		let params = {
			"RoleCode": signupDetails.roleCode,
			"userGuid": signupDetails.UserGuid,
			 "DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Version": "",
			//"Data": { "AppointmentGuid": signupDetails.appoinmentGuid }
			"Data": { "AppointmentGuid": from =='Past Encounters' ? pastAppointGuid: signupDetails.appoinmentGuid }
		}
		//V11/FuncForDrAppToGetVisitInfo
		actions.callLogin('V14/FuncForDrAppToGetPatientConsultationData', 'post', params, signupDetails.accessToken, 'GetVisitInfoIndex');

	}
	componentDidMount() {


		from = this.props.navigation.state.params.from;
		item = this.props.navigation.state.params.item;
		if (item) {
			if (item.patientImageUrl != null && item.patientImageUrl != "")
				this.setState({ imageSource: { uri: item.patientImageUrl } })

			this.setState({
				patientName: item.patientName,
				patientGender: item.gender
			})
		}

		this.getAdditionalInfo();
		if (from === 'consultation' && item.consultationType === 'Virtual' && item.appointmentStatus == 'booked') {
			this.setState({ initialPage: 0, showCall: true })
			// let { actions, signupDetails } = this.props;
			// let params = {
			// 	Data: {
			// 		appointmentGuid: item.appointmentGuid  //signupDetails.appointmentGuid 
			// 	}
			// }
			//actions.callLogin('V1/FuncForDrAppToGetJwtTokenForVideoCall', 'post', params, signupDetails.accessToken, 'twilioToken');
			this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
				if (this.state.showCall)
					this.setState({ isModalVisible: true })
				else
					this.props.navigation.goBack();
				return true;
			})
		} else {
			this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		}
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'twilioToken') {
				if (newProps.responseData.statusCode === '0') {
					let data = newProps.responseData.data;
					DRONA.setTwilioToken(data.token);
					DRONA.setRoomName(data.channelName);

					if (from === 'consultation' && item.consultationType === 'Virtual' && item.appointmentStatus == 'booked') {
						this.setState({ initialPage: 0, showCall: true })
					}
				}
			} else if (tagname === 'GetVisitInfoIndex') {
				if (newProps.responseData.statusCode == '0') {
					this.setState({ responseDataVisitInfo: newProps.responseData.data });
				}
			}
		}
	}
	RefreshPatient = (val) => {
		this.setState({
			patientName: val.patientName,
			patientGender: val.gender,
			//patientAge:val.patientName,
		})
	}
	TabChangeFromRx = (val) => {
		DRONA.setIsNeedForTabChane(true);
		this.setState({pageChangeIndex:0,initialPage:0 });
		//alert(val)
	}
	refreshData = (val) => {
		if (val == 'minimize') {
			this.setState({ isFullScreenVideo: false, xAxis: responsiveWidth(60), yAxis: responsiveHeight(65) })
		} else if (val === 'back' || val === 'cross') {
			this.setState({ showCall: false })
			let { actions, signupDetails } = this.props;
			if(val=='cross')
				signupDetails.returnValueFromTwilio=true;
				else
				signupDetails.returnValueFromTwilio=false;
				actions.setSignupDetails(signupDetails)
		}

	}
	render() {
		let { loading, signupDetails } = this.props;
		let item = this.props.navigation.state.params.item;
		let date = this.props.navigation.state.params.date;
		return (
			<SafeAreaView style={{ flex: 1 }}>
				{this.state.showCall ? <Draggable x={this.state.xAxis} y={this.state.yAxis} disabled={this.state.isFullScreenVideo} style={{ position: 'absolute', top: this.state.yAxis, left: this.state.xAxis }}
					shouldReverse={this.state.isFullScreenVideo}>
					<View style={{ height: this.state.isFullScreenVideo ? responsiveHeight(100) : responsiveWidth(40), width: this.state.isFullScreenVideo ? responsiveWidth(100) : responsiveWidth(30), borderRadius: 10 }}>
						{this.state.isFullScreenVideo ? null : <TouchableOpacity onPress={() => {
							this.setState({ isFullScreenVideo: true });
							setTimeout(() => {
								this.setState({ xAxis: 0, yAxis: 0 });
							}, 200)
						}}
							style={{ position: 'absolute', top: 10, right: 10, zIndex: 999 }}>
							<Image source={fullscreen} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
						</TouchableOpacity>}

						<Twilio Refresh={this.refreshData} nav={{ item: item, date: date, isFullScreenVideo: this.state.isFullScreenVideo, hardWareBackEvent: this.state.hardWareBackEvent, context: this.props }} />

					</View>
				</Draggable> : null}


				<View style={{ flex: 1, zIndex: -999, }}>

					<View style={styles.container}>

						<View style={{ flex: 1 }}>
							<View style={{ flexDirection: 'row', backgroundColor: Color.white, padding: 10 }}>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									if (this.state.showCall)
										this.setState({ isModalVisible: true })
									else
										this.props.navigation.goBack();
									// this.setState({hardWareBackEvent:true });
									// this.props.navigation.goBack();
								}}>
									<Image source={arrowBack} style={{ width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
								</TouchableOpacity>

								<View style={{ marginLeft: 5, marginRight: 10 }}>
									{!this.state.imageSource ?
										<View style={{
											height: responsiveFontSize(5), width: responsiveFontSize(5), backgroundColor: '#84E4E2', borderRadius: responsiveFontSize(2.5),
											alignItems: 'center', justifyContent: 'center',
										}}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.white }}>{this.nameFormat(this.state.patientName, false)}</Text>
										</View>
										:
										<Image source={this.state.imageSource} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), }} />
									}

								</View>

								<View style={{ flex: 5, marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1), marginBottom: 10 }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.patientSearchName, marginRight: responsiveWidth(1), textTransform: 'capitalize' }}>{this.state.patientName.replace('  ', " ")}</Text>

									<View style={{ flexDirection: 'row', marginTop: 3 }}>
										<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '700' }}>{this.state.patientGender ? this.state.patientGender.charAt(0) + " " : ''}</Text>
										<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '500' }}>{item.age ? item.age : ''} </Text>
										<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
										<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{item.phoneNumber ? item.phoneNumber : ''}</Text>

									</View>

								</View>

							</View>
							{this.state.responseDataVisitInfo ? <ScrollableTabView

								renderTabBar={() => (
									<ScrollableTabBar />
								)}
								tabBarTextStyle={{ fontSize: CustomFont.font16 }}
								tabBarInactiveTextColor={Color.optiontext}
								tabBarActiveTextColor={Color.primary}
								tabBarUnderlineStyle={{ backgroundColor: Color.primary, width: responsiveWidth(10), borderRadius: 4 }}
								initialPage={this.state.initialPage}
								ramPage={this.state.pageChangeIndex}
								onChangeTab={(res) => {
									//console.log(res.i+'-----+++++++++-----'+res.from)
									if(DRONA.getIsConsultationChange() && signupDetails.roleCode==10 && !loading){ // && !this.state.isDataSaved
										setTimeout(()=>{
											this.setState({ isSaveTabDataModal:true });
										},1000)	
										
									}
									if(res.i!= res.from)
									fromTab=res.from;
								}}
							>
								<Consultation showCall={this.state.showCall} responseDataVisitInfo={this.state.responseDataVisitInfo} tabLabel={'Consultation'} style={{ flex: 1 }} data={this.props.navigation.getParam("data", null)} VitalStatus={this.props.navigation.getParam("vitalMasterStatus")} nav={{ navigation: this.props.navigation }} from={from} item={item} RefreshPatient={this.RefreshPatient} />
								{/* {!signupDetails.isAssistantUser ? <PrescriptionCopyPad tabLabel={'Past Rx'} style={{ flex: 1 }} data={this.props.navigation.getParam("data", null)} nav={{ navigation: this.props.navigation }} item={item} TabChangeFromRx={this.TabChangeFromRx}/> : null} */}
								{!signupDetails.isAssistantUser && (signupDetails.drSpeciality == 'Dentistry' || signupDetails.drSpeciality == 'Pedodontics and Preventive Dentistry'|| signupDetails.drSpeciality == 'Conservative dentistry & endodontics') ? <TreatmentPlanTab tabLabel={'Treatment Plan'} style={{ flex: 1 }} data={this.props.navigation.getParam("data", null)} nav={{ navigation: this.props.navigation }} item={item} RefreshPatient={this.RefreshPatient} /> : null}
								{signupDetails.isAssistantUser && !signupDetails.isAllowMedicalHistoryAssistant ? null : <MedicalHistory showCall={this.state.showCall} pastAppointGuid={pastAppointGuid} tabLabel={'Medical History'} style={{ flex: 1 }} data={this.props.navigation.getParam("data", null)} nav={{ navigation: this.props.navigation }} item={item} RefreshPatient={this.RefreshPatient} />}
								{signupDetails.isAssistantUser && !signupDetails.isAllowPatientFilesAssistant ? null : <Files tabLabel={'Files'} style={{ flex: 1 }} data={this.props.navigation.getParam("data", null)} nav={{ navigation: this.props.navigation }} item={item} />}
								{signupDetails.isAssistantUser && !signupDetails.isAllowBillingAssistant ? null : <BillingBlankTab tabLabel={'Billing'} style={{ flex: 1 }}  nav={{ navigation: this.props.navigation }} item={item} />}
							</ScrollableTabView> : null}


							{/* <Tabs tabBarUnderlineStyle={{
								height: responsiveHeight(.8),
								backgroundColor: Color.primary,
								marginHorizontal: signupDetails.isAssistantUser && (!signupDetails.isAllowMedicalHistoryAssistant || !signupDetails.isAllowPatientFilesAssistant) ? responsiveWidth(20): Dimensions.get('window').width / 7.5,
								width: 25
							}} tabContainerStyle={{
								elevation: 1,

							}} initialPage={this.state.initialPage} >
								<Tab heading="Consultation" tabStyle={{ backgroundColor: Color.white }} activeTabStyle={{ backgroundColor: Color.white }} textStyle={{ color: Color.optiontext, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight400 }} activeTextStyle={{ color: Color.primary, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight600 }}>
									<Consultation data={this.props.navigation.getParam("data", null)} VitalStatus={this.props.navigation.getParam("vitalMasterStatus")} nav={{ navigation: this.props.navigation }} from={this.props.navigation.state.params.from} item={item} RefreshPatient={this.RefreshPatient} />
								</Tab>
								{signupDetails.isAssistantUser && !signupDetails.isAllowMedicalHistoryAssistant ? null : <Tab heading="Medical History" tabStyle={{ backgroundColor: Color.white }} activeTabStyle={{ backgroundColor: Color.white }} textStyle={{ color: Color.optiontext, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight400 }} activeTextStyle={{ color: Color.primary, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight600 }}>
									<MedicalHistory data={this.props.navigation.getParam("data", null)} nav={{ navigation: this.props.navigation }} item={item} RefreshPatient={this.RefreshPatient} />
								</Tab>}
								{signupDetails.isAssistantUser && !signupDetails.isAllowPatientFilesAssistant ? null : <Tab heading="Files" tabStyle={{ backgroundColor: Color.white }} activeTabStyle={{ backgroundColor: Color.white }} textStyle={{ color: Color.optiontext, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight400 }} activeTextStyle={{ color: Color.primary, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight600 }}>
									<Files data={this.props.navigation.getParam("data", null)} nav={{ navigation: this.props.navigation }} />
								</Tab>}
							</Tabs> */}
						</View>
					</View>
				</View>

				<Modal isVisible={this.state.isModalVisible} >
					<View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Exit Video Call </Text>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Are you sure want to exit from video call? </Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false })}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
								</TouchableOpacity>
							</View>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primary }} onPress={() => {
									this.setState({ isModalVisible: false, hardWareBackEvent: true });
									this.props.navigation.goBack();
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Yes</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				<Modal isVisible={this.state.isSaveTabDataModal} avoidKeyboard={true} onRequestClose={() =>{
					DRONA.setIsConsultationChange(false);
					this.setState({isSaveTabDataModal:false})
				} }>
                    <View style={styles.modelView}>
                        <View style={{ margin: 25, marginBottom: responsiveHeight(40) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Text style={styles.addtxt}>Save Changes</Text>
                               
                                <TouchableOpacity onPress={()=>{
									DRONA.setIsConsultationChange(false);
									this.setState({isSaveTabDataModal:false})
								} }>
                                  <Image source={close} style={{height:responsiveFontSize(4),width:responsiveFontSize(4),resizeMode:'contain'}}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.compIcon}>
                                <Image style={{ resizeMode: 'contain', height: responsiveFontSize(14), width: responsiveFontSize(14), }} source={dentist_complete} />
                            </View>

                            <Text style={styles.compMessage}>Changes made were not saved. Would you like to save these changes?</Text>

                            <TouchableOpacity
                                onPress={() => {
									DRONA.setIsNeedForTabChane(true);
                                  this.setState({isSaveTabDataModal:false,pageChangeIndex: fromTab, isDataSaved: true });
                                }}
                                style={styles.markComp}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '600' }}>Yes, save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
									DRONA.setIsConsultationChange(false);
                                  this.setState({isSaveTabDataModal:false})
                                }}
                                style={styles.markCancel}>
                                <Text style={{ color: Color.primary, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
)(ConsultationTab);
