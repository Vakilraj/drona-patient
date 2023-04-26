import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, ActivityIndicator, BackHandler, ScrollView, Alert
} from 'react-native';
import styles from './style';
import HTML from "react-native-render-html";
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import play from '../../../assets/play.png';
import pause from '../../../assets/pause.png';
import Carousel, { Pagination } from 'react-native-snap-carousel';
//import Video from 'react-native-video';
import { SliderBox } from "react-native-image-slider-box";
import Snackbar from 'react-native-snackbar';
import { setLogEvent } from '../../service/Analytics';
class AnswerDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			videoArray: [],
			entries: [{ title: 'hh' }],
			activeSlide: 0,
			imageArray: [],
			playPause: true,
			showLoading: false
		};
	}
	async componentDidMount() {
		try {
			let descriptionImg = this.props.navigation.state.params.item.descriptionImg;
			if (descriptionImg && descriptionImg.length > 0) {
				let tempArr = [];
				for (let i = 0; i < descriptionImg.length; i++) {
					tempArr.push({ fullImageUrl: descriptionImg[i].descriptionImgurl })
				}
				this.setState({ imageArray: tempArr });
			}
		} catch (error) { }

		try {
			let descriptionVideo = this.props.navigation.state.params.item.descriptionVideo;
			if (descriptionVideo && descriptionVideo.length > 0) {
				let tempArr = [];
				for (let i = 0; i < descriptionVideo.length; i++) {
					tempArr.push(descriptionVideo[i].descriptionVideourl)
				}
				this.setState({ videoArray: tempArr });
			}
		} catch (e) { }



		//alert(JSON.stringify(this.props.navigation.state.params.item));
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}

	renderList = ({ item, index }) => (
		<TouchableOpacity style={{ margin: responsiveWidth(2), flexDirection: 'row', justifyContent: 'space-between', borderRadius: 3, backgroundColor: Color.white }}
		>
			<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, margin: 7 }}>Are there any additional features I have access to with this app?</Text>
			<Text style={{ fontSize: CustomFont.font12, color: Color.mediumGrayTxt }}>{'>'}</Text>
		</TouchableOpacity>

	);
	onBuffer = (val) => {
		//alert(JSON.stringify(val));
	}
	_renderItem = ({ item, index }) => {
		return (
			<View style={{ flex: 1, height: responsiveHeight(30), alignItems: 'center', justifyContent: 'center', }}>
				<View style={{ height: responsiveHeight(32), width: responsiveWidth(70), alignItems: 'center', justifyContent: 'center', backgroundColor: Color.grayTxt, borderRadius: 10 }}>
					{/* <Video source={{ uri: item }}
						ref={(ref) => {
							this.player = ref
						}}
						paused={this.state.playPause}
						resizeMode="cover"                                  // Store reference
						onBuffer={this.onBuffer}                // Callback when remote video is buffering
						//onError={this.videoError}               // Callback when video cannot be loaded
						style={{ height: responsiveHeight(26), width: responsiveWidth(70), margin: 0, padding: 0 }}
						onLoad={() => {
							//this.setState({showLoading:true})
						}}
						onEnd={() => {
							//this.setState({showLoading:false})
						}}
					/> */}
					{this.state.showLoading ? <ActivityIndicator
						size="large"
						color={Color.primary}
						style={{
							position: "absolute",
							alignSelf: "center"
						}}
					/> : <TouchableOpacity style={{ position: 'absolute', top: responsiveHeight(14), left: responsiveWidth(30) }} onPress={() => {
						this.setState({ playPause: !this.state.playPause })
					}} >
						<Image source={this.state.playPause ? play : pause} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />
					</TouchableOpacity>}


				</View>
			</View>

		);
	}

	yesNoReviewSubmit = (statusReview) => {
		let { actions, signupDetails } = this.props;
		let answerDetails = this.props.navigation.state.params.item;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data": {
				"TopicQuesAnsGuid": answerDetails.questionGuid,
				"IsHelpful": statusReview
			}
		}
		actions.callLogin('V11/FuncForDrAppToAddUserReviewDetails', 'post', params, signupDetails.accessToken, 'yesNo');
		setLogEvent("is_this_helpful", {"UserGuid": signupDetails.UserGuid, "screen": "ArticleView", "yesNoReviewSubmit": statusReview })
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'yesNo') {
				if (newProps.responseData.statusCode == '0') {
					Alert.alert(
						'Success',
						'Your review submitted successfully',
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
					//Snackbar.show({ text: 'Your review submitted successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
					// setTimeout(() => {
					// 	this.props.navigation.goBack();
					// }, 2000)
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				}
			}
		}
	}


	render() {

		let answerDetails = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} >
							<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
						</TouchableOpacity>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight500, marginLeft: responsiveWidth(4) }}>{DRONA.getAnswerDetailsHeader()}</Text>
					</TouchableOpacity>
					<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>

						<ScrollView>
							<View style={{ flex: 1, padding: responsiveWidth(4), margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10, height: '100%' }}>
								{this.state.imageArray && this.state.imageArray.length > 0 ?
									<View style={{ alignItems: 'center', height: responsiveHeight(30) }}>
										<SliderBox
											images={this.state.imageArray}
											ImageComponentStyle={{ width: "85%", borderRadius: 10 }}
										/>
									</View> : null}
								<Text style={{ fontSize: CustomFont.font18, fontWeight: 'bold', color: Color.fontColor, marginTop: responsiveHeight(2) }}>{answerDetails.helpTopicQuestion}</Text>
								{/* <Text style={{ fontSize: CustomFont.font14, color: Color.mediumGrayTxt, marginTop: responsiveHeight(2) }}>{answerDetails.helpTopicAnswer}</Text> */}
								<HTML source={{ html: answerDetails.helpTopicAnswer }} />

								{answerDetails.descriptionVideo && answerDetails.descriptionVideo.length > 0 ? <View style={{ alignItems: 'center', marginTop: responsiveHeight(2) }}>
									<View style={{ flex: 1, alignItems: 'center' }}>
										<Carousel layout={'default'}
											ref={(c) => {
												this._carousel = c;
											}}
											style={{ position: 'absolute' }}
											data={this.state.videoArray}
											renderItem={this._renderItem}
											sliderWidth={responsiveWidth(90)}
											itemWidth={responsiveWidth(90)}
											onSnapToItem={(index) => this.setState({ activeSlide: index })}
										/>
									</View>

									<Pagination
										dotsLength={this.state.videoArray.length}
										activeDotIndex={this.state.activeSlide}
										//containerStyle={{backgroundColor: '#FFFFFF'}}
										dotStyle={{ height: responsiveFontSize(1.6), width: responsiveFontSize(1.6), borderRadius: responsiveFontSize(.9) }}
										inactiveDotOpacity={0.4}
										inactiveDotScale={1}
										carouselRef={this._carousel}
										tappableDots={!!this._carousel} />
								</View> : null}



							</View>
						</ScrollView>

						<View style={{ alignItems: 'center', backgroundColor: 'red', flexDirection: 'row', margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10, marginTop: responsiveWidth(12) }}>
							<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400, color: Color.textGrey, marginLeft: responsiveWidth(4) }}> Was this helpful? </Text>
							<View style={{ flexDirection: 'row', marginLeft: responsiveWidth(4) }}>

								<TouchableOpacity style={styles.yesNoStyle} onPress={() =>
									this.yesNoReviewSubmit(false)
								}>
									<Text style={{ fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font16 }}>No</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.yesNoStyle} onPress={() =>
									this.yesNoReviewSubmit(true)
								}>
									<Text style={{ fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font16 }}>Yes</Text>
								</TouchableOpacity>

							</View>
						</View>

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
)(AnswerDetails);