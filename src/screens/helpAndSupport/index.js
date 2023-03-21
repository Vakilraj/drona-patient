import React from 'react';
import { BackHandler, FlatList, Image, ImageBackground, SafeAreaView, StatusBar, Text, TouchableOpacity, View, Linking } from 'react-native';
import Modal from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../assets/back_blue.png';
import call_pink from '../../../assets/call_pink.png';
import arrow_right from '../../../assets/chevron_right.png';
import closeIcon from '../../../assets/cross_blue.png';
import finding_patient from '../../../assets/finding_patient.png';
import mail_pink from '../../../assets/mail_pink.png';
import patient_background from '../../../assets/patient_background.png';
import sms from '../../../assets/sms.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import styles from './style';
import { setLogEvent } from '../../service/Analytics';
var _ = require('lodash');

class ClinicSetupIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataArrayFaq: [],
			dataArrayTopic: [],
			isModalVisible: false,
		};
	}
	callingOnNumber = () => {
		// const args = {
		// 	number: '9354013224', // String value with the number to call
		// 	prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
		//   }	 
		Linking.openURL(`tel:${'+91' + DRONA.getCustomerCareNo()}`)
		//Communications.phonecall('+91'+DRONA.getCustomerCareNo(), true)
		this.setState({ isModalVisible: false })
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data": { "UserType": "Dr" }
		}
		actions.callLogin('V1/FuncForDrAppToGetHelpAndSupport', 'post', params, signupDetails.accessToken, 'helpAndSupport');
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'helpAndSupport') {
				let data = newProps.responseData.data;
				//console.log(JSON.stringify(data));
				try {
					DRONA.setCustomerCareNo(data.contactUs.supportNumber);
					DRONA.setCustomerCareEmail(data.contactUs.supportEmail);
				} catch (e) { }

				try {
					this.setState({ dataArrayTopic: data.helpTopicsList, dataArrayFaq: data.helpTopicsQuesAns });

				} catch (e) { }

			}
		}

	}
	renderList = ({ item, index }) => (
		<TouchableOpacity style={{ backgroundColor: Color.white, height: responsiveHeight(20), width: responsiveHeight(20), marginTop: responsiveHeight(1.6), marginLeft: responsiveWidth(4), borderRadius: 8, }}
			onPress={() => {
				DRONA.setAnswerDetailsHeader('FAQ');
				this.props.navigation.navigate('AnswerDetails', { item: item })
			}}>
			<Text style={{ lineHeight: 23, fontSize: CustomFont.font14, color: Color.fontColor, margin: 10, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, padding: 10 }}>{item.helpTopicQuestion}</Text>
		</TouchableOpacity>

	);
	renderListForTopic = ({ item, index }) => (


		<View style={{ marginLeft: responsiveWidth(4), marginEnd: responsiveWidth(4), marginTop: responsiveWidth(3), borderRadius: 10 }}>
			<TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(9), alignItems: 'center', borderRadius: 6, justifyContent: 'space-between' }} onPress={() => {
				DRONA.setQuestionListHeader(item.helpTopicDiscription);
				DRONA.setAnswerDetailsHeader('Article View');
				this.props.navigation.navigate('QuestionList', { item: item.helpTopicsQuesAns })
				let { signupDetails } = this.props;
				setLogEvent("detail_page", { "UserGuid": signupDetails.UserGuid, screen: "helpSupport" })
			}}>
				<View style={{ flex: 9, alignItems: 'center', flexDirection: 'row' }}>
					{/* <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: responsiveFontSize(1.0), marginLeft: 20 }}>
						<Image source={{uri:item.helpTopicIconUrl}} style={{ height: responsiveHeight(5), width: responsiveHeight(5), resizeMode: 'contain' }} />
					</View> */}
					<Image source={{ uri: item.helpTopicIconUrl }} style={{ height: responsiveHeight(5), width: responsiveHeight(5), marginLeft: 20, borderRadius: 20, resizeMode: 'contain' }} />

					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight500, marginLeft: 20, marginEnd: responsiveFontSize(4.5), }}>{item.helpTopicDiscription}</Text>
				</View>
				<View style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), justifyContent: 'center', alignItems: 'center' }}>
					<Image source={arrow_right} style={{ tintColor: Color.black, height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain', }} />

				</View>

			</TouchableOpacity>
		</View>


	);
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<View style={{ backgroundColor: Color.white, height: responsiveHeight(20) }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
							<TouchableOpacity onPress={() => {
								setLogEvent("go_back", { "UserGuid": signupDetails.UserGuid, screen: "helpSupport" })
								this.props.navigation.goBack()
							}}>
								<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
							</TouchableOpacity>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight500, marginLeft: responsiveWidth(4), fontWeight: CustomFont.fontWeight700 }}>How can we help?</Text>
						</View>
						{/* <TextInput style={{ margin: responsiveWidth(4), backgroundColor: Color.white, height: responsiveHeight(6), borderRadius: 6, paddingLeft: responsiveWidth(4), paddingRight: 10, paddingTop: 0, paddingBottom: 0 }} placeholder="Search for topics or questions" /> */}

					</View>

					<ImageBackground source={patient_background} style={{ height: responsiveFontSize(20), width: responsiveFontSize(20), justifyContent: 'center', alignItems: 'center', resizeMode: 'cover', position: 'absolute', right: 10 }}>

						<Image source={finding_patient} style={{ height: responsiveFontSize(16), width: responsiveFontSize(16), resizeMode: 'cover', marginEnd: responsiveWidth(5) }} />

					</ImageBackground>

					<TouchableOpacity style={{ width: '80%', backgroundColor: Color.gray_F7F3FD, height: responsiveHeight(6.5), borderRadius: 6, justifyContent: 'center', position: 'absolute', top: responsiveHeight(10), left: responsiveWidth(10), right: responsiveWidth(10) }}
						onPress={() => this.props.navigation.navigate('SearchQuestion', { dataArrayFaq: this.state.dataArrayFaq, dataArrayTopic: this.state.dataArrayTopic })}>
						<Text style={{ fontSize: CustomFont.font14, color: Color.textGrey, marginLeft: 10, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName }}>Search for Topic , Question</Text>
					</TouchableOpacity>

					<View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: responsiveHeight(3) }}>
						<Text style={{ color: Color.yrColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName }}>FAQs</Text>
						<TouchableOpacity onPress={() => {
							DRONA.setQuestionListHeader('All FAQs');
							DRONA.setAnswerDetailsHeader('FAQ');
							this.props.navigation.navigate('QuestionList', { item: this.state.dataArrayFaq });
						}}>
							<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600, color: Color.primary, fontSize: CustomFont.font14, marginRight: responsiveWidth(4) }}>Read all</Text>
						</TouchableOpacity>
					</View>
					<View style={{ height: responsiveHeight(22) }}>
						<FlatList
							horizontal={true}
							data={this.state.dataArrayFaq}
							renderItem={this.renderList}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()}
							showsHorizontalScrollIndicator={false}
						/>
					</View>

					<Text style={{ color: Color.yrColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, marginTop: responsiveHeight(2) }}>Topics</Text>

					<FlatList
						style={{ marginTop: responsiveHeight(1), marginBottom: responsiveHeight(11.5) }}
						data={this.state.dataArrayTopic}
						renderItem={this.renderListForTopic}
						extraData={this.state}
						keyExtractor={(item, index) => index.toString()}
					/>

					<View style={{ position: 'absolute', bottom: 0, width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(10), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
						<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 30 }} onPress={() => this.setState({ isModalVisible: true })}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Contact Us</Text>
						</TouchableOpacity>
					</View>
				</View>
				{/* <Modal isVisible={this.state.isModalVisible}
					onRequestClose={() => this.setState({ isModalVisible: false })}
					avoidKeyboard={true}>
					<View style={styles.contactModelView}>
						<View style={{ alignItems: 'flex-end', zIndex: 999 }}>
							<TouchableOpacity onPress={() => this.setState({ isModalVisible: false })}>
								<Image source={closeIcon} style={{ height: 20, width: 20, marginRight: responsiveWidth(7), margin: responsiveHeight(2.5), resizeMode: 'contain' }} />
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: responsiveHeight(6),zIndex:-999,}} onPress={() => this.callingOnNumber()}>
							<View style={styles.iconView}>
								<Image source={call_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: CustomFont.fontWeight500 }}>Call Us</Text>
						</TouchableOpacity>
						<View style={{ backgroundColor: Color.lineColor, height: .5, marginTop: responsiveHeight(1.5) }}/>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: responsiveHeight(8) }} onPress={() => {
							Linking.openURL('mailto:' + DRONA.getCustomerCareEmail() + '?subject=DrOnA Support Center&body=Hi Team,');
							//Communications.email([DRONA.getCustomerCareEmail()], null, null, 'DrOnA Support Center', 'Hi Team, ')
							this.setState({ isModalVisible: false });

						}}
						>
							<View style={styles.iconView}>
								<Image source={mail_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: CustomFont.fontWeight500 }} >Email Us</Text>
						</TouchableOpacity>
					</View>
				</Modal> */}


				<Modal isVisible={this.state.isModalVisible}
					onRequestClose={() => this.setState({ isModalVisible: false })}
					avoidKeyboard={true}>
					<View style={styles.modelView}>
						<View style={{ margin: responsiveHeight(2), justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text style={{ fontFamily: CustomFont.fontNameBold, color: Color.black, fontWeight: 'bold', fontSize: CustomFont.font18, marginLeft: responsiveWidth(3), marginTop: responsiveHeight(1.6), }}/>
							<TouchableOpacity style={{ position: 'absolute', right: 0, justifyContent: 'center', flexDirection: 'row',zIndex:999 }} onPress={() => this.setState({ isModalVisible: false })}>
								<Image style={{ height: responsiveHeight(4), width: responsiveWidth(4), marginRight: responsiveWidth(4), marginTop: responsiveHeight(1.6), resizeMode: 'contain',tintColor:Color.fontColor }} source={closeIcon} />
							</TouchableOpacity>
						</View>


						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: responsiveHeight(6),zIndex:-999,}} onPress={() => this.callingOnNumber()}>
							<View style={styles.iconView}>
								<Image source={call_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: CustomFont.fontWeight500 }}>Call Us</Text>
						</TouchableOpacity>
						<View style={{ backgroundColor: Color.lineColor, height: .5, marginTop: responsiveHeight(1.5) }}/>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: responsiveHeight(8) }} onPress={() => {
							Linking.openURL('mailto:' + DRONA.getCustomerCareEmail() + '?subject=DrOnA Support Center&body=Hi Team,');
							this.setState({ isModalVisible: false });

						}}
						>
							<View style={styles.iconView}>
								<Image source={mail_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: CustomFont.fontWeight500 }} >Email Us</Text>
						</TouchableOpacity>

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
)(ClinicSetupIndex);