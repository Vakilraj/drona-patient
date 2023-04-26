import React from 'react';
import { BackHandler, FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View ,Linking} from 'react-native';
import Modal from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../assets/back_blue.png';
import call_pink from '../../../assets/call_pink.png';
import arrow_right from '../../../assets/chevron_right.png';
import cross_txt from '../../../assets/cross_new.png';
import mail_pink from '../../../assets/mail_pink.png';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import closeIcon from '../../../assets/cross_blue.png';
import styles from './style';


var _ = require('lodash');
let fullArrayQuestions = [], fullArrayTopic = [];

class ClinicSetupIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataArrayQuestions: props.navigation.state.params.dataArrayFaq,
			searchTxt: '',
			topicArray: props.navigation.state.params.dataArrayTopic,
			isModalVisible: false,
		};
		//alert(JSON.stringify(props.navigation.state.params));
	}
	callingOnNumber = () => {
		// const args = {
		// 	number: '9354013224', // String value with the number to call
		// 	prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
		//   }	 
		Linking.openURL(`tel:${'+91'+DRONA.getCustomerCareNo()}`) 
		//Communications.phonecall('+91'+DRONA.getCustomerCareNo(), true)
		this.setState({ isModalVisible: false })
	}

	async componentDidMount() {
		//alert(JSON.stringify(this.props.navigation.state.params));
		fullArrayQuestions = [...this.state.dataArrayQuestions];
		fullArrayTopic = [...this.state.topicArray];

		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'clinicDetailsHome') {
				let data = newProps.responseData.data;

			}
		}

	}
	renderList = ({ item, index }) => (
		<View>
			{/* <TouchableOpacity style={{ margin: responsiveWidth(2), flexDirection: 'row', justifyContent: 'space-between', borderRadius: 3, backgroundColor: Color.white }}
				onPress={() => {
					DRONA.setAnswerDetailsHeader('FAQ');
					this.props.navigation.navigate('AnswerDetails', { item: item })
				}}
			>
				<View style={{ flex: 1, flexDirection: 'row', }}>
					<View style={{ flex: 10, }}>
						<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, margin: responsiveWidth(4) }}>{item.helpTopicQuestion}</Text>
					</View>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<Image source={arrow_right} style={{ height: responsiveFontSize(1.8), width: responsiveFontSize(1.8), resizeMode: 'center' }} />
					</View>
				</View>
			</TouchableOpacity> */}



			<TouchableOpacity style={{ marginLeft: responsiveWidth(4), marginEnd: responsiveWidth(4), marginTop: responsiveWidth(3), flexDirection: 'row', justifyContent: 'space-between', borderRadius: 10, backgroundColor: Color.white }}
				onPress={() => {
					DRONA.setAnswerDetailsHeader('FAQ');
					this.props.navigation.navigate('AnswerDetails', { item: item })
				}}>
				<View style={{ padding: 10, flex: 1, flexDirection: 'row', }}>
					<View style={{ flex: 10, marginTop: responsiveHeight(1), marginBottom: responsiveHeight(1), marginLeft: responsiveHeight(1) }}>
						<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName }}>{item.helpTopicQuestion}</Text>
					</View>
					<View style={{ flex: .5, alignItems: 'center', justifyContent: 'center' }}>
						<Image source={arrow_right} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain', tintColor: Color.black }} />
					</View>
				</View>
			</TouchableOpacity>




			{index == this.state.dataArrayQuestions.length - 1 ?
				<View style={{ alignItems: 'center', height: responsiveHeight(16), backgroundColor: Color.white, margin: responsiveWidth(4), borderRadius: 10 }}>
					<Text style={{ flex: 1, width: '100%', textAlign: 'left', fontSize: CustomFont.font14, marginLeft: responsiveWidth(7), color: Color.patientSearchAge, marginTop: responsiveWidth(5), fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName }}>Didn’t find what you’re looking for?</Text>
					{/* <View style={{ height: responsiveHeight(5.4), width: responsiveWidth(36), marginBottom: responsiveHeight(6), marginTop: responsiveHeight(16) }}>
						<ContactUs />
					</View> */}

					<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(85), backgroundColor: Color.primary, marginBottom: responsiveWidth(5) }} onPress={() => {
						this.setState({ isModalVisible: true })
					}}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName }}>Contact Us</Text>
					</TouchableOpacity>
				</View>
				: null}

			{/* {index == this.state.dataArrayQuestions.length - 1 ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ fontSize: CustomFont.font14, color: Color.mediumGrayTxt, marginTop: 15 }}>Didn’t find what you’re looking for?</Text>
				<View style={{ height: responsiveHeight(5.4), width: responsiveWidth(36), marginBottom: responsiveHeight(6), marginTop: responsiveHeight(16) }}>
					<ContactUs />
				</View>

			</View> : null} */}
		</View>


	);
	SearchFilterFunction = (text) => {
		var searchResult = _.filter(fullArrayQuestions, function (item) {
			return item.helpTopicQuestion.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.helpTopicAnswer.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		this.setState({ dataArrayQuestions: searchResult ? searchResult : null, searchTxt: text });

		var searchResultTopic = _.filter(fullArrayTopic, function (item) {
			return item.helpTopicDiscription.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		this.setState({ topicArray: searchResultTopic ? searchResultTopic : null });
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<View style={{ padding: 10, backgroundColor: Color.white, flexDirection: 'row', alignItems: 'center', }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
							<Image source={arrowBack} style={{marginLeft: responsiveWidth(3),  width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1),  resizeMode:'contain'}} />
						</TouchableOpacity>
						<TextInput returnKeyType="done" style={{ marginLeft: responsiveWidth(2), backgroundColor: Color.gray_F7F3FD, height: responsiveHeight(5.5), borderRadius: 6, paddingLeft: responsiveWidth(4), paddingRight: 10, paddingTop: 0, paddingBottom: 0, flex: 1, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14,color:Color.fontColor }}  placeholderTextColor = {Color.placeHolderColor} placeholder="Search for topics or questions"
							onChangeText={(searchTxt) => { return this.SearchFilterFunction(searchTxt); }} value={this.state.searchTxt} />

						{this.state.searchTxt.length > 0 ?
							<TouchableOpacity style={{ position: 'absolute', right: responsiveWidth(7), top: responsiveHeight(3) }} onPress={() => {
								this.setState({ searchTxt: '' })
								this.SearchFilterFunction('')
							}}>
								<Image source={cross_txt} style={{ tintColor: Color.primary, height: responsiveWidth(6), width: responsiveWidth(6), margin: 3 }} />
							</TouchableOpacity> : null}

					</View>
					<View style={{ maxHeight: responsiveHeight(33) }}>
						<ScrollView>
							{this.state.topicArray ? this.state.topicArray.map((item, d) => {
								return (
									// <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(2) }} onPress={() => {
									// 	DRONA.setQuestionListHeader(item.helpTopicDiscription);
									// 	DRONA.setAnswerDetailsHeader('Article View');
									// 	this.props.navigation.navigate('QuestionList', { item: item.helpTopicsQuesAns })
									// }}>
									// 	<View style={{ borderRadius: 3, backgroundColor: Color.white, marginLeft: responsiveWidth(3) }}>
									// 		<Image source={manage} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), margin: 3 }} />
									// 	</View>
									// 	<Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontWeight: 'bold' }}> {item.helpTopicDiscription}</Text>
									// 	{/* <Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font12 }}>Managing <Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontWeight: 'bold' }}> Patients</Text> </Text> */}
									// </TouchableOpacity>

									<View style={{ marginLeft: responsiveWidth(4), marginEnd: responsiveWidth(4), marginTop: responsiveWidth(3), borderRadius: 10 }}>
										<TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(9), alignItems: 'center', borderRadius: 6, justifyContent: 'space-between' }} onPress={() => {
											DRONA.setQuestionListHeader(item.helpTopicDiscription);
											DRONA.setAnswerDetailsHeader('Article View');
											this.props.navigation.navigate('QuestionList', { item: item.helpTopicsQuesAns })
										}}>
											<View style={{ flex: 9, alignItems: 'center', flexDirection: 'row' }}>

												<View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: responsiveFontSize(1.0), marginLeft: 10 }}>
													<Image source={{uri:item.helpTopicIconUrl}} style={{ height: responsiveHeight(5), width: responsiveHeight(5), resizeMode: 'contain' }} />
												</View>

												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight500, marginLeft: 20, marginEnd: responsiveFontSize(4.5),  }}>{item.helpTopicDiscription}</Text>
											</View>
											<View style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), justifyContent: 'center', alignItems: 'center' }}>
												<Image source={arrow_right} style={{ tintColor: Color.black, height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain', }} />

											</View>

										</TouchableOpacity>
									</View>

								);
							}, this) : null}
						</ScrollView>
					</View>
					<Text style={{ marginTop: responsiveHeight(2), color: Color.yrColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName }}>FAQs</Text>
					<FlatList
						data={this.state.dataArrayQuestions}
						renderItem={this.renderList}
						extraData={this.state}
						keyExtractor={(item, index) => index.toString()}
						style={{ flex: 1, marginTop: responsiveHeight(1.6) }}
					/>
				</View>
				<Modal isVisible={this.state.isModalVisible}
					onRequestClose={() => this.setState({ isModalVisible: false })}
					avoidKeyboard={true}>
					<View style={styles.modelView}>
						<View style={{ margin: responsiveHeight(2), justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text style={{ fontFamily: CustomFont.fontNameBold, color: Color.black, fontWeight: 'bold', fontSize: CustomFont.font18, marginLeft: responsiveWidth(3), marginTop: responsiveHeight(1.6), }} />
							<TouchableOpacity style={{ position: 'absolute', right: 0, justifyContent: 'center', flexDirection: 'row', zIndex: 999 }} onPress={() => this.setState({ isModalVisible: false })}>
								<Image style={{ height: responsiveHeight(4), width: responsiveWidth(4), marginRight: responsiveWidth(4), marginTop: responsiveHeight(1.6), resizeMode: 'contain', tintColor: Color.fontColor }} source={closeIcon} />
							</TouchableOpacity>
						</View>


						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: responsiveHeight(6), zIndex: -999, }} onPress={() => this.callingOnNumber()}>
							<View style={styles.iconView}>
								<Image source={call_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: CustomFont.fontWeight500 }}>Call Us</Text>
						</TouchableOpacity>
						<View style={{ backgroundColor: Color.lineColor, height: .5, marginTop: responsiveHeight(1.5) }} />
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