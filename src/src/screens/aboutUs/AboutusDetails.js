import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TouchableOpacity, ActivityIndicator, BackHandler, ScrollView, Alert
} from 'react-native';

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
import HTML from "react-native-render-html";
class AboutusDetails extends React.Component {
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
			let descriptionImg = this.props.navigation.state.params.item.images;
			if (descriptionImg && descriptionImg.length > 0) {
				let tempArr = [];
				for (let i = 0; i < descriptionImg.length; i++) {
					tempArr.push(descriptionImg[i].imageurl)
					//tempArr.push({ fullImageUrl: descriptionImg[i].imageurl })
				}
				this.setState({ imageArray: tempArr });
			}
		} catch (error) { }

		try {
			let descriptionVideo = this.props.navigation.state.params.item.videos;
			if (descriptionVideo && descriptionVideo.length > 0) {
				let tempArr = [];
				for (let i = 0; i < descriptionVideo.length; i++) {
					tempArr.push(descriptionVideo[i].videourl)
				}

				this.setState({ videoArray: tempArr });
			}
		} catch (e) { }



		//alert(JSON.stringify(this.props.navigation.state.params.item));
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}

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
		let { actions, signupDetails, loading } = this.props;
		let answerDetails = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>


					<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} >
							<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3),  width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1),  resizeMode:'contain' }} />
						</TouchableOpacity>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>About DrOnA Health</Text>
					</TouchableOpacity>
					<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>

						<ScrollView>
							<View style={{ margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10, padding: responsiveWidth(4) }}>
								{this.state.imageArray && this.state.imageArray.length > 0 ?
									<View style={{ alignItems: 'center', height: responsiveHeight(28) }}>
										<SliderBox
											images={this.state.imageArray}
											ImageComponentStyle={{ width: "85%", height: responsiveHeight(28), borderRadius: 10 }}
										/>
									</View> : null}
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, color: Color.fontColor, marginTop: responsiveHeight(2) }}>{answerDetails.dronaHeader}</Text>
								<HTML source={{ html: answerDetails.dronaContent }} />
								{/* <Text style={{ fontFamily : CustomFont.fontName, fontSize: CustomFont.font14, color: Color.mediumGrayTxt, marginTop: responsiveHeight(2) }}>{answerDetails.dronaContent}</Text> */}

								{this.state.videoArray && this.state.videoArray.length > 0 ? <View style={{ alignItems: 'center', marginTop: responsiveHeight(2) }}>
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
)(AboutusDetails);