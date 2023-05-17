import React, { useState } from 'react';
import {
	View,
	Text, SafeAreaView, ScrollView,
	ActivityIndicator, Image, TouchableOpacity, FlatList, Dimensions, Linking, PermissionsAndroid, StatusBar, BackHandler
} from 'react-native';
import styles from './style';
import Modal from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import CustomLoader from '../../../../src/utils/CustomLoader';
import Post from './Post';

import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';

import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../../customviews/Toolbar.js';
import Moment from 'moment';
import comment_0 from '../../../../assets/comment_0.png';
import like_0 from '../../../../assets/like_0.png';
import like_done from '../../../../assets/like_done.png';
import save_fill from '../../../../assets/save_fill.png';
import save_gray from '../../../../assets/save_gray.png';
import share_0 from '../../../../assets/share_0.png';
import CrossIcon from '../../../../assets/cross_black.png';
import cross_white from '../../../../assets/cross_white.png';
import download from '../../../../assets/download.png';
import Share from 'react-native-share';


import play from '../../../../assets/play.png';
import pause from '../../../../assets/pause.png';
import Carousel, { Pagination } from 'react-native-snap-carousel';
//import Video from 'react-native-video';
import Snackbar from 'react-native-snackbar';
//Anup
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import LogoIcon from '../../../../assets/app_icon.png';
let selectedImageUrl = '', selectedPostId = '';
let pageIndex = 0, selectType = '', customLoaderFlag = 0;
import { setLogEvent } from '../../../service/Analytics';
class SavedPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItem: null,
			buttonColor: '#1608161A',
			borderValueColor: '',
			borderValue: 0,
			dataColor: Color.fontColor,
			count: 0,
			initialPage: 0,
			dataArray: [],
			dataArrayTopic: [],
			dataArrayTopicHeader: [],
			selectedPos: '',
			isModalVisible: false,
			showLoaderBottom: false,
			dataContenTypeArr: [{ title: 'All Post' }, { title: 'Child psychology' },
			{ title: 'Coivd 19' }, { title: 'Heart Desease' }, { title: 'Custom Post' }],
			isPickTopics: false,
			showLoader: false,

			activeSlide: 0,
			imageArray: [],
			playPause: true,
			showLoading: false,
			likeListData: [],
			likeListPopup: false,
			viewListPopup: false,
			viewListData: [],


			commentListPopup: false,
			commentListData: [],

			// Anup
			showPostShareModal: false,
			postAutherName: '',
			postTime: '',
			postDescription: '',
			postImageUrl: '',
			postShareTitle: '',
			noPostAvailableMsg: '',
		};
		pageIndex = 0;
		customLoaderFlag = 0;
	}

	makeDownload = async () => {
		this.setState({ isModalVisible: false });
		if (Platform.OS === 'ios') {
			this.downloadImage()
		}
		else {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					{
						title: 'Storage Permission Required',
						message:
							'App needs access to your storage to download Photos',
					}
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					this.downloadImage();
				} else {
					// If permission denied then show alert
					alert('Storage Permission Not Granted');
				}
			} catch (err) {
				// To handle permission related exception
				alert('Please select a file to download')
				//console.warn(err);
			}
		}

	}
	getExtention = filename => {
		return /[.]/.exec(filename) ?
			/[^.]+$/.exec(filename) : undefined;
	}

	downloadImage() {
		let date = new Date();
		// Image URL which we want to download
		// let image_URL = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png'; 
		let image_URL = selectedImageUrl;
		let ext = this.getExtention(image_URL);
		ext = '.' + ext[0];
		const { config, fs } = RNFetchBlob;
		let PictureDir = fs.dirs.PictureDir;
		let options = {
			fileCache: true,
			path: PictureDir + '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) + '.png',
			addAndroidDownloads: {
				// Related to the Android only
				useDownloadManager: true,
				notification: true,
				// path:
				//   PictureDir +
				//   '/image_' + 
				//   Math.floor(date.getTime() + date.getSeconds() / 2) +
				//   ext,
				path:
					PictureDir +
					'/image_' +
					Math.floor(date.getTime() + date.getSeconds() / 2) +
					'.png',
				description: 'Image',
			},
		};
		config(options)
			.fetch('GET', image_URL)
			.then(res => {
				if(Platform.OS == 'android'){
					RNFetchBlob.android.actionViewIntent(res.path(), 'image/png');
				   }
				   else{
					RNFetchBlob.ios.previewDocument(res.path());
				   }
				alert('Image Downloaded Successfully.');
			});

	}


	clickOnSavePost = (postId, isPostSaved) => {
		selectedPostId = postId;
		let { actions, signupDetails } = this.props;
		let params = {
			"doctorGuid": signupDetails.doctorGuid,
			"userGuid": signupDetails.UserGuid,
			"data": {
				"postGuid": selectedPostId,
				"isPostSaved": isPostSaved
			}
		}
		actions.callLogin('V1/FuncForDrAppToToggleBookmarkPost', 'post', params, signupDetails.accessToken, 'savepostData');
		setLogEvent("bookmark", { userGuid: signupDetails.UserGuid, "postId": postId, screen: "savedPost" })
	}

	getViewList = (item) => {
		let { actions, signupDetails } = this.props;
		selectedPostId = item.postGuid;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.ClinicGuid,
			"Data": {
				"PostGuid": selectedPostId,
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetPostViewById', 'post', params, signupDetails.accessToken, 'viewList');
	}

	countChange = (count) => {
		if (count < 1000) {
			return count
		} else if (count >= 1000 && count < 1000000) {
			return (count / 1000).toFixed(1) + "K"
		} else if (count >= 1000000 && count < 1000000000) {
			return (count / 1000000).toFixed(1) + "M"
		} else if (count >= 1000000000 && count < 1000000000000) {
			return (count / 1000000000).toFixed(1) + "B"
		} else {
			return (count / 1000000000000).toFixed(1) + "T"
		}
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		pageIndex = 0;
		this.loadMoreData();
	}
	loadMoreData = () => {
		this.setState({ noPostAvailableMsg: '' })
		pageIndex++;
		if (customLoaderFlag == 0)
			this.setState({ showLoader: true });
		else
			this.setState({ showLoaderBottom: true });


		let { actions, signupDetails } = this.props;

		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,   // should not be blank or null
			"data":            // should not be blank or null
			{
				"isMember": true,                           // null in case of first time user
				"displaySavedPostOnly": true,                // true in case of saved post display (bookmark list)
				"sortBy": "Dr",
				"sortOrder": "",
				"pageIndex": pageIndex,
				"pageSize": "10",
				"communityTopic": null // null for first time load. Provide list when filtering (save btn click of Pick topics)

			}
		}
		actions.callLogin('V1/FuncForDrAppToGetCommunityInfo', 'post', params, signupDetails.accessToken, 'GetCommunityInfoSaved');
	};

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'GetCommunityInfoSaved') {
				if (newProps.responseData.data) {
					let res = newProps.responseData.data.communityPost;
					let resTopic = newProps.responseData.data.communityTopic;
					//if (selectType === '' || selectType === 'picker') {
					if (customLoaderFlag == 0) {
						customLoaderFlag = 1;
						this.setState({ dataArrayTopic: resTopic });
						try {
							let tempArr = [{
								"communityTopicName": "All Posts",
								"isSelected": false,
								"isActive": false
							}];
							if (resTopic && resTopic.length > 0)
								for (let i = 0; i < resTopic.length; i++) {
									if (resTopic[i].isSelected) {
										//let tempObj = Object.assign({ isActive: false }, resTopic[i]);
										tempArr.push(resTopic[i]);
										//tempArr.push(tempObj);
									}

								}
							this.setState({ dataArrayTopicHeader: tempArr });
						} catch (error) { }
					}
					if (res && res.length > 0) {
						this.setState({ dataArray: res });
					} else {
						this.setState({ noPostAvailableMsg: 'No Saved post available' })
						this.setState({ dataArray: [] });
					}

					//this.setState({ dataArray: [...this.state.dataArray, ...res] });
					this.setState({ showLoader: false, showLoaderBottom: false });
				} else {
					alert(newProps.responseData.statusMessage)
					this.setState({ showLoader: false, showLoaderBottom: false });
				}

			} else if (tagname === 'likeSave') {
				if (newProps.responseData.statusCode == '0') {
					Snackbar.show({ text: 'Like submit successfully', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				} else {
					//alert(JSON.stringify(newProps.responseData.statusMessage))
				}
			} else if (tagname === 'savepostData') {
				// setTimeout(()=>{
				// 	Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				// },300)
				// pageIndex = 0;
				// this.loadMoreData();
			} else if (tagname === 'likeList') {
				let resLikeList = newProps.responseData.data.thanksDetails;
				// this.setState({ likeListData: resLikeList });
				this.setState({ likeListData: resLikeList });
				// this.setState({ likeListData: [...this.state.dataArray, ...resLikeList] });
			} else if (tagname === 'getCommentUserList') {
				let resCommentUserList = newProps.responseData.data.comment.commentDetails;
				this.setState({ commentListData: resCommentUserList, commentListPopup: true });
			}
			//else if (tagname === "viewList") {
			// if (newProps.responseData.statusCode == 0) {
			// 	this.setState({ viewListPopup: true });
			// 	let resViewUserList = newProps.responseData.data.postViewDetails;
			// 	this.setState({ viewListData: resViewUserList });
			// } else {
			// 	Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
			// }
			//} 
		}
	}

	clickOnLike = (postId, isThanks) => {
		selectedPostId = postId;
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data":
			{
				"postGuid": selectedPostId,
				"commentGuid": "", //if like comment then fill this
				"replyGuid": "", //if like reply then fill this
				"IsLike": isThanks
			}
		}
		actions.callLogin('V1/FuncForDrAppToSaveUpdateThanks', 'post', params, signupDetails.accessToken, 'likeSave');
		setLogEvent("like", { userGuid: signupDetails.UserGuid, "postId": postId, screen: "SavedPost", likeStatus: isThanks })
	}


	getNamechar = (fname, lname) => {
		fname = fname ? fname.trim() : '';
		lname = lname ? lname.trim() : '';
		let str = '';
		try {
			if (!lname) {
				str = fname.substr(0, 2);
			} else if (fname && lname) {
				str = fname.substr(0, 1) + lname.substr(0, 1);
			}
		} catch (e) { }
		return str ? str.toUpperCase() : str;
	}



	toggleModal = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible });
	};

	ageCalculateForShare = (incomingDate) => {
		let str = '';
		let tempNotificationDate = '';
		if (incomingDate) {
			tempNotificationDate = Moment(incomingDate).format('DD MMM YY');
		}
		return tempNotificationDate;
	}



	ageCalculate1 = (incomingDate) => {
		let str = '';
		str = Moment(incomingDate).fromNow(true);
		return str;
	}
	ageCalculate = (incomingDate) => {
		// console.log("Indrajeet" + JSON.stringify(incomingDate));

		if (incomingDate != null && incomingDate != '') {
			// console.log("Indrajeet");
			// console.log(JSON.stringify(incomingDate));
			// Change date format yyyy-mm-dd hh:mm:ss TO yyyy/mm/dd hh:mm:ss
			let tempdateArray = incomingDate.split('.');
			//let tempIncomingDate = incomingDate.replace('-', '/');
			let tempIncomingDate = tempdateArray[0].replace('-', '/');
			let tempNotificationDate = tempIncomingDate.replace('-', '/');
			// Get Current Date with yyyy/mm/dd hh:mm:ss format
			var month = new Date().getMonth() + 1;
			var year = new Date().getFullYear();
			var tempHours = new Date().getHours();
			var min = new Date().getMinutes();
			var sec = new Date().getSeconds();
			var day = new Date().getDate();
			let monthStr = month.toString();
			let dayStr = day.toString();
			let yearStr = year.toString();
			let hoursStr = tempHours.toString();
			let minStr = min.toString();
			let secStr = sec.toString();
			let fullFormatedDate = yearStr + '/' + monthStr + '/' + dayStr + ' ' + hoursStr + ':' + minStr + ':' + secStr
			let diffInMilliseconds = Math.abs(new Date(fullFormatedDate) - new Date(tempNotificationDate)) / 1000 + new Date().getTimezoneOffset() * 60;

			// Calculating days
			let days = Math.floor(diffInMilliseconds / 86400);
			diffInMilliseconds -= days * 86400;
			// calculate hours
			let hours = Math.floor(diffInMilliseconds / 3600) % 24;
			diffInMilliseconds -= hours * 3600;
			// calculate minutes
			let minutes = Math.floor(diffInMilliseconds / 60) % 60;
			// diffInMilliseconds -= minutes * 60;

			let difference = '';
			if (days > 364) {
				let yr = Math.floor(days / 365);
				difference += (yr === 1) ? `${yr} year ` : `${yr} years `;
			} else if (days > 29) {
				let mnth = Math.floor(days / 30);
				difference += (mnth === 1) ? `${mnth} month ` : `${mnth} months `;
			} else if (days > 6) {
				let week = Math.floor(days / 7);
				difference += (week === 1) ? `${week} week ` : `${week} weeks `;
			} else if (days > 0) {
				difference += (days === 1) ? `${days} day ` : `${days} days `;
			} else if (hours > 0) {
				difference += (hours === 0 || hours === 1) ? `${hours} hr ` : `${hours} hrs `;
			} else if (minutes > 0) {
				difference += (minutes === 1) ? `${minutes} min` : `${minutes} mins`;
			} else {
				difference = 'just now';
			}

			return difference;
		}
	}
	onButtonPress = (id) => {
		this.setState({ selectedItem: id });
		this.setState({ buttonColor: '#E4DDF0', borderValue: 2, borderValueColor: '#A78BDF', dataColor: '#A78BDF' });
	}
	renderListHeader = ({ item, index }) => (
		<TouchableOpacity onPress={() => {
			item.isActive = !item.isActive; this.setState({ dataArrayTopicHeader: this.state.dataArrayTopicHeader }); pageIndex = 0;
			if (index == 0)
				selectType = 'allPosts';
			else
				selectType = 'header';
			this.loadMoreData();
		}} style={{
			borderWidth: item.isActive ? 2 : 0,
			borderColor: item.isActive ? '#A78BDF' : null,
			backgroundColor: item.isActive ? '#E4DDF0' : '#1608161A', height: responsiveHeight(5),
			borderRadius: 30, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2), alignItems: 'center', justifyContent: 'center', marginLeft: responsiveWidth(3)
		}}>
			<Text style={{ fontSize: CustomFont.font14, color: this.state.dataColor, marginLeft: 7, marginRight: 7 }}>
				{item.communityTopicName && item.communityTopicName != null ? item.communityTopicName : null}</Text>
		</TouchableOpacity>
	);
	_renderCustomSlider1 = (item, index, length) => {
		return (
			<View style={{ marginEnd: 16, flex: 1, height: responsiveHeight(30), width: responsiveWidth(80), alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
				<Text style={{ position: 'absolute', top: 20, right: 10, zIndex: 999, backgroundColor: Color.black, color: Color.white, fontSize: CustomFont.font12, padding: 2, paddingLeft: 7, paddingRight: 7, borderRadius: 7 }}>{index + 1 + '/' + length}</Text>
				{item.mediaAttachmentType == 'image' ? <TouchableOpacity onPress={() => {
					selectedImageUrl = item.mediaAttachmentUrl;
					this.setState({ isModalVisible: true });
					let { signupDetails } = this.props;
					setLogEvent("open_image", { userGuid: signupDetails.UserGuid, screen: "SavedPost" })
				}}>
					<Image source={{ uri: item.mediaAttachmentUrl }} style={{ resizeMode: 'stretch', alignSelf: 'center', width: responsiveWidth(80), height: responsiveHeight(25) }} />
				</TouchableOpacity> : <View style={{ height: responsiveHeight(32), width: responsiveWidth(70), alignItems: 'center', justifyContent: 'center', backgroundColor: Color.grayTxt, borderRadius: 10 }}>
					{/* <Video source={{ uri: item.mediaAttachmentUrl }}
						ref={(ref) => {
							this.player = ref
						}}
						paused={this.state.playPause}
						resizeMode="cover"                                  // Store reference
						//onBuffer={this.onBuffer}                // Callback when remote video is buffering
						//onError={this.videoError}               // Callback when video cannot be loaded
						style={{ height: responsiveHeight(26), width: responsiveWidth(70), margin: 0, padding: 0 }}
						onLoad={() => {
							//this.setState({showLoading:true})
						}}
						onEnd={() => {
							//alert('hh')
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


				</View>}

			</View>

		);
	}

	getCommentUserInfo = (postGuid) => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"userGuid": signupDetails.UserGuid,
			"Data": {
				"postGuid": postGuid,
			}
		};
		actions.callLogin('V1/FuncForDrAppToGetPostById', 'post', params, signupDetails.accessToken, 'getCommentUserList');
	}

	_renderCustomSlider = (item, index, length) => {
		return (
			<View style={{ flex: 1, height: responsiveHeight(28), alignItems: 'center' }}>
				<Text style={{ position: 'absolute', top: 20, right: 20, zIndex: 999, backgroundColor: Color.black, color: Color.white, fontSize: CustomFont.font12, padding: 2, paddingLeft: 7, paddingRight: 7, borderRadius: 7 }}>{index + 1 + '/' + length}</Text>
				{item.mediaAttachmentType == 'image' ? <TouchableOpacity onPress={() => {
					selectedImageUrl = item.mediaAttachmentUrl;
					this.setState({ isModalVisible: true });
				}}>
					<Image source={{ uri: item.mediaAttachmentUrl }} style={{ resizeMode: 'stretch', width: responsiveWidth(86), height: '100%' }} />
				</TouchableOpacity> : <View style={{ height: responsiveHeight(28), width: '100%', alignItems: 'center', justifyContent: 'center' }}>
					{/* <Video source={{ uri: item.mediaAttachmentUrl }}
						ref={(ref) => {
							this.player = ref
						}}
						paused={this.state.playPause}
						resizeMode="cover"                                  // Store reference
						//onBuffer={this.onBuffer}                // Callback when remote video is buffering
						//onError={this.videoError}               // Callback when video cannot be loaded
						style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}
						onLoad={() => {

						}}
						onEnd={() => {

						}}
					/> */}
					{this.state.showLoading ? <ActivityIndicator
						size="large"
						color={Color.red}
						style={{
							position: "absolute",
							alignSelf: "center"
						}}
					/> : <TouchableOpacity style={{ position: 'absolute', top: responsiveHeight(14), left: responsiveWidth(30) }} onPress={() => {
						this.setState({ playPause: !this.state.playPause })
					}} >
						<Image source={this.state.playPause ? play : pause} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />
					</TouchableOpacity>}


				</View>}

			</View>

		);
	}
	renderList = ({ item, index }) => {
		let mediaLength = item.mediaAttachment && item.mediaAttachment.length ? item.mediaAttachment.length : 0
		let { loading } = this.props;
		return (
			<View style={{ marginLeft: responsiveWidth(3.5), marginRight: responsiveWidth(4), marginTop: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10 }}>
				<View style={{ margin: responsiveWidth(5), marginBottom: responsiveWidth(7), }}>
					<View style={{ alignItems: 'center', height: responsiveHeight(28) }}>
						{mediaLength > 0 ? <Carousel layout={'default'}
							ref={(c) => {
								this._carousel = c;
							}}
							//style={{ backgroundColor: 'red' }}
							data={item.mediaAttachment}
							renderItem={({ item, index }) => this._renderCustomSlider(item, index, mediaLength)}
							sliderWidth={responsiveWidth(89.4)}
							itemWidth={responsiveWidth(89.4)}
							//style={{ paddingRight: 16 }}
							onSnapToItem={(index) => this.setState({ activeSlide: index })}
						/>
							: null
						}
					</View>
					<Text style={{ fontFamily: CustomFont.fontNameBold, fontWeight: 'bold', fontSize: CustomFont.font18, color: Color.text1, marginTop: responsiveHeight(3.6), marginRight: responsiveWidth(5) }}>{item.postTitle}</Text>

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(1.8), alignItems: 'center' }}>
						<View style={{ flexDirection: 'row' }}>

							<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font12, color: Color.text3 }}>By {(item.authorFirstName + ' ' + item.specialityName).replace('  ', " ").replace(null, "")}, {Moment(item.postDateTime).format('DD MMM YY')}</Text>
							<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.patientSearchHolder, marginLeft: 5, textAlign: 'center' }}>• 2 min read</Text>
						</View>

						<TouchableOpacity onPress={() => {
							item.isPostSaved = !item.isPostSaved;
							this.setState({ dataArray: this.state.dataArray })
							selectedIndex = index;
							this.state.dataArray.splice(selectedIndex, 1);
							this.clickOnSavePost(item.postGuid, item.isPostSaved)
						}} disabled={loading}>
							<Image source={item.isPostSaved ? save_fill : save_gray} style={{ height: 24, width: 24, resizeMode: 'contain' }} />
						</TouchableOpacity>
					</View>
					<Text style={{ textAlign: 'justify', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.8), opacity: 1, color: Color.yrColor, lineHeight: responsiveHeight(3.5) }}>{this.getDesc(item.postDescription, 0)} <Text style={{ color: Color.primary, fontWeight: 'bold' }} onPress={() => this.props.navigation.navigate('Comments', { item: item })}>{item.postDescription && item.postDescription.length > 100 ? ' Read More' : ''}</Text></Text>
					{/* {item.postDescription && item.postDescription.indexOf("\r\n\r\nSource:") > -1 ? <TouchableOpacity onPress={() => Linking.openURL(this.getDesc(item.postDescription, 1))} style={{ flexDirection: 'row', marginRight: responsiveWidth(15) }}>
					<Text style={{ fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2.6), marginBottom: responsiveHeight(2), fontWeight: 'bold' }} >Source: <Text style={{ color: Color.primaryBlue, }} >{this.getDesc(item.postDescription, 1)}</Text></Text>
				</TouchableOpacity> : null} */}

					{/* <TouchableOpacity onPress={() => this.props.nav.navigation.navigate('Comments', { item: item, from: '' })}>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primary, marginTop: responsiveHeight(1.6), fontWeight: CustomFont.fontWeight500 }} >Read More</Text>
				</TouchableOpacity> */}

					<View style={{ paddingBottom: responsiveHeight(1), flexDirection: 'row', marginTop: responsiveHeight(1.5), marginBottom: responsiveHeight(1), marginLeft: responsiveHeight(0), borderBottomColor: Color.grayTxt, borderBottomWidth: 0.5 }}>
						<View style={{ flex: 3, flexDirection: 'row' }}>
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: responsiveWidth(2.5) }} onPress={() => { this.setState({ likeListPopup: true }); this.getLikeList(item) }}>
								<Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.thanks ? this.countChange(item.thanks.thanksCount) : '0'} Likes</Text>
							</TouchableOpacity>
							<Text style={{ paddingTop: 6, flexDirection: 'row', marginLeft: responsiveWidth(1), fontStyle: 'italic', fontSize: 6, fontFamily: CustomFont.fontName, color: Color.grayTxt, }}>0</Text>
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { this.getCommentUserInfo(item.postGuid); this.setState({ commentListPopup: true }) }}>
								<Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(1) }}>{item.comment ? this.countChange(item.comment.commentCount) : '0'} Comments</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 3 }}>
							<Text></Text>
						</View>
						<View style={{ flex: 3, flexDirection: 'row' }}>
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: responsiveWidth(1.5) }} onPress={() => { this.getViewList(item) }}>
								<Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.view ? this.countChange(item.view.viewCount) : 0} Views</Text>
							</TouchableOpacity>
							<Text style={{ paddingTop: 7, flexDirection: 'row', fontStyle: 'italic', fontSize: 6, fontFamily: CustomFont.fontName, color: Color.grayTxt, }}>0</Text>
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: responsiveWidth(0) }}>
								<Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.share ? this.countChange(item.share.shareCount) : '0'} Shares</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ flexDirection: 'row', marginTop: responsiveHeight(1), marginLeft: responsiveHeight(0.5), marginRight: responsiveHeight(0.5), }}>

						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
							<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: responsiveWidth(0.5) }} onPress={() => {
								item.thanks.isThanks = !item.thanks.isThanks;
								if (item.thanks && !item.thanks.thanksCount)
									item.thanks.thanksCount = 0;

								if (item.thanks.isThanks)
									item.thanks.thanksCount = parseInt(item.thanks.thanksCount) + 1;
								else
									item.thanks.thanksCount = parseInt(item.thanks.thanksCount) - 1;
								this.setState({ dataArray: this.state.dataArray });
								this.clickOnLike(item.postGuid, item.thanks.isThanks);
							}}>
								<Image source={item.thanks.isThanks ? like_done : like_0} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), resizeMode: 'contain' }} />
								<Text style={{ fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: item.thanks.isThanks ? Color.primary : Color.optiontext, marginLeft: responsiveWidth(2) }}>{item.thanks && item.thanks.thanksCount ? this.countChange(item.thanks.thanksCount) : 'Likes'}</Text>
							</TouchableOpacity>

							{/* <TouchableOpacity
						onPress={() => { this.setState({ likeListPopup: true }); this.getLikeList(item) }}>
						<Text style={{ marginLeft: 7 }}>...</Text></TouchableOpacity> */}
						</View>
						<View style={{ flex: 1 }}>
							<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('Comments', { item: item })}>
								<Image source={comment_0} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), resizeMode: 'contain' }} />
								<Text style={{ fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: item.isPostSave ? Color.primary : Color.optiontext, marginLeft: responsiveWidth(2) }}>Comment</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableOpacity onPress={() => this.clickOnShare(item)} style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: responsiveWidth(0.5) }}>
								<Image source={share_0} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
								<Text style={{ fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: Color.optiontext, marginLeft: responsiveWidth(2) }}>Share</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>

		)
	};
	clickOnShare = (item) => {
		let urlString = '';
		// Anup

		this.setState({ postShareTitle: item.postTitle })
		this.setState({ postAutherName: item.authorFirstName + ' ' + item.authorLastName })
		this.setState({ postDateTime: item.postDateTime });
		this.setState({ postDescription: item.postDescription })
		this.setState({ postImageUrl: item.mediaAttachment[0].mediaAttachmentUrl })
		this.setState({ showPostShareModal: true });

		setTimeout(() => {
			this.refs.viewShot.capture().then((uri) => {
				// this.setState({ showPostShareModal: false });
				RNFS.readFile(uri, 'base64').then((res) => {
					urlString = 'data:image/jpeg;base64,' + res;
					let options = {
						subject: '',
						message: '', //Shared via DrOnA Dr app
						url: urlString,
						type: 'image/jpeg',
					}
					Share.open(options)
						.then((res) => {
							this.setState({ showPostShareModal: false })
						})
						.catch((err) => {
							this.setState({ showPostShareModal: false })
						});

				});
			});
		}, 800);

		//for share
		//    setTimeout(() => {
		// 	   let options = {
		// 		subject: '',
		// 		message: '',
		// 		url: urlString,
		// 		type: 'image/jpeg',
		// 	}
		// 	   Share.open(options)
		// 		   .then((res) => {
		// 			   this.setState({ showPostShareModal: false })
		// 		   })
		// 		   .catch((err) => {
		// 			   this.setState({ showPostShareModal: false });
		// 		   });
		//    }, 1200);


		//Anup

		// let options = {};
		// selectedPostId = item.postGuid;
		// if(Platform.OS == 'ios'){
		// 	 options = {
		// 		subject: item.postTitle + '\n',
		// 		message: this.getDesc(item.postDescription, 0) + '\n',
		// 		url: 'dronadr://https://dronadoctor.profile/' + selectedPostId + '\n\n Download the app from store https://play.google.com/store/apps/details?id=com.dronahealth.doctor'
		// 	}
		// }
		// else{
		// 	 options = {
		// 		subject: item.postTitle + '\n',
		// 		message: this.getDesc(item.postDescription, 0) + '\n',
		// 		url: 'https://dronadoctor.profile/' + selectedPostId + '\n\n Download the app from store https://play.google.com/store/apps/details?id=com.dronahealth.doctor'
		// 	}
		// }

		// Share.open(options)
		// 	.then((res) => {
		// 		console.log(res);
		// 	})
		// 	.catch((err) => {
		// 		err && console.log(err);
		// 	});

		setTimeout(() => {
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": "",
				"data": {
					"postGuid": selectedPostId,
					"shareGuid": ""
				}
			}
			actions.callLogin('V1/FuncForDrAppToSaveUpdateSharePost', 'post', params, signupDetails.accessToken, 'shareSaveUpdate');

		}, 500);
	}
	getDesc = (val, from) => {
		let returnStr = val;
		if (val.indexOf("\r\n\r\nSource:") > -1) {
			let str = val.split("\r\n\r\nSource:");
			if (from === 0) {
				if (str[0] && str[0].length > 100)
					returnStr = str[0].substr(0, 100)
				else
					returnStr = str[0];
			} else
				returnStr = str[1];
		} else {
			if (val && val.length > 100)
				returnStr = val.substr(0, 100)
			else returnStr

		}
		// else if(from==0){
		// 	returnStr=val;
		// }
		return returnStr ? returnStr.trim() : returnStr;
	}
	getLikeList = (item) => {
		let { actions, signupDetails } = this.props;
		selectedPostId = item.postGuid;
		// this.setState({ likeListData: item.thanks.thanksDetails });
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.ClinicGuid,
			"Data": {
				"PostGuid": selectedPostId,
				"commentGuid": null,
				"replyGuid": null,
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetPostThanksById', 'post', params, signupDetails.accessToken, 'likeList');
	}


	nameFormat = (name) => {
		let str = '';
		try {
			if (name.includes(' ')) {
				let strArr = name.split('  ');
				if (strArr[1]) {
					str = strArr[0].substr(0, 1) + strArr[1].substr(0, 1)
				} else {
					str = strArr[0].substr(0, 2);
				}
			} else {
				str = name.substr(1, 2)
			}
		} catch (e) { }
		return str
	}

	renderPost = ({ item, index }) => {
		return (
			<Post
				item={item}
				onSetLike={() => {
					item.thanks.isThanks = !item.thanks.isThanks;
					if (item.thanks && !item.thanks.thanksCount)
						item.thanks.thanksCount = 0;

					if (item.thanks.isThanks)
						item.thanks.thanksCount = parseInt(item.thanks.thanksCount) + 1;
					else
						item.thanks.thanksCount = parseInt(item.thanks.thanksCount) - 1;
					this.setState({ dataArray: this.state.dataArray });
					this.clickOnLike(item.postGuid, item.thanks.isThanks);
				}}
				onSave={() => {
					item.isPostSaved = !item.isPostSaved;
					this.setDataArray(dataArray)
					clickOnSavePost(item.postGuid, item.isPostSaved)
				}}
				isComment={false}
				onLikeList={() => {
					this.getLikeList(null, null)
				}}
				onViewList={() => {
					this.getViewList(item)
				}}
				onShare={() => {
					this.clickOnShare(item)
				}}
				onComment={() => { this.props.navigation.navigate('Comments', { item: item }) }}
				onReadMore={() => { this.props.navigation.navigate('Comments', { item: item, from: '' }) }}
			/>
		)
	}

	render() {
		let { responseData, loading } = this.props;
		//alert(JSON.stringify(this.state.dataArrayTopic))
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"Saved Posts"}
					onBackPress={() => this.props.navigation.goBack()} />
				{this.state.showLoader ? <CustomLoader /> :
					this.state.dataArray && this.state.dataArray.length ?
						<FlatList
							data={this.state.dataArray}
							showsVerticalScrollIndicator={false}
							renderItem={this.renderList}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()}
						//onEndReached={this.loadMoreData}
						/> : <View style={{ alignItems: 'center' }}><Text style={{ marginTop: 30, color: Color.primary, fontSize: CustomFont.font16 }}>{this.state.noPostAvailableMsg}</Text></View>
				}
				{this.state.showLoaderBottom ? <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View> : null
				}
				<Modal isVisible={this.state.likeListPopup}>
					<View style={[styles.modelViewMessage, { paddingTop: 25, height: responsiveHeight(70) }]}>
						<View style={{ flexDirection: 'row', paddingStart: 20, paddingEnd: 20 }}>
							<Text style={{ flex: 1, color: Color.primary, fontSize: CustomFont.font18 }}>People Who Reacted</Text>
							<TouchableOpacity onPress={() => this.setState({ likeListPopup: false })}>
								<Image style={styles.crossIcon} source={CrossIcon} />
							</TouchableOpacity>
						</View>

						<FlatList
							data={this.state.likeListData}
							renderItem={({ item, index }) => {
								return (<View style={{
									paddingTop: 10, paddingBottom: 10, paddingStart: 20, paddingEnd: 20, backgroundColor: Color.bgColor,
									alignItems: 'center', flexDirection: 'row', marginTop: 0, marginBottom: 10, marginEnd: 8
								}}>
									{item.memberImageUrl ? <Image source={{ uri: item.memberImageUrl }}
										style={{ marginRight: responsiveWidth(3), marginTop: 2, height: responsiveWidth(6), width: responsiveWidth(6), borderRadius: responsiveWidth(1) }} /> :
										<View style={{ marginRight: responsiveWidth(3), height: responsiveWidth(8), width: responsiveWidth(8), borderRadius: responsiveWidth(3), backgroundColor: Color.liveBg, justifyContent: 'center', alignItems: 'center' }}>
											<Text style={{ fontSize: CustomFont.font12, color: '#FFF' }}>{this.nameFormat(item.memberName)}</Text>
										</View>
									}

									<View style={{ flex: 1, }}>
										<Text style={{ fontSize: CustomFont.font16 }}>{item.memberName}</Text>
										<Text style={{ fontSize: CustomFont.font12 }}>{item.memberSpeciality}</Text>
									</View>
								</View>)
							}}
						/>
						{/* <TouchableOpacity onPress={() => {
							selectType = 'picker';
							this.setState({ likeListPopup: false })
						}} style={{ marginStart: 20, marginEnd: 20, backgroundColor: Color.primary, marginBottom: 20 }}>
							<Text style={{ fontSize: CustomFont.font16, paddingTop: 5, paddingBottom: 5, alignSelf: 'center', color: Color.white, }}>Done</Text>
						</TouchableOpacity> */}
					</View>
				</Modal>
				{/* <Modal isVisible={this.state.viewListPopup}>
					<View style={[styles.modelViewMessage, { paddingTop: 25, height: responsiveHeight(70) }]}>
						<View style={{ flexDirection: 'row', paddingStart: 20, paddingEnd: 20 }}>
							<Text style={{ flex: 1, color: Color.primary, fontSize: CustomFont.font18 }}>People Who Viewed</Text>
							<TouchableOpacity onPress={() => this.setState({ viewListPopup: false })}>
								<Image style={styles.crossIcon} source={CrossIcon} />
							</TouchableOpacity>
						</View>

						<FlatList style={{ marginTop: responsiveHeight(3) }}
							data={this.state.viewListData}
							renderItem={({ item, index }) => {
								return (<View style={{
									paddingTop: 10, paddingBottom: 10, paddingStart: 20, paddingEnd: 20, backgroundColor: Color.bgColor,
									alignItems: 'center', flexDirection: 'row', marginTop: 0, marginBottom: 10, marginEnd: 8
								}}>
									{item.memberImageUrl ? <Image source={{ uri: item.memberImageUrl }}
										style={{ marginRight: responsiveWidth(3), marginTop: 2, height: responsiveWidth(6), width: responsiveWidth(6), borderRadius: responsiveWidth(1) }} /> :
										<View style={{ marginRight: responsiveWidth(3), height: responsiveWidth(8), width: responsiveWidth(8), borderRadius: responsiveWidth(3), backgroundColor: Color.liveBg, justifyContent: 'center', alignItems: 'center' }}>
											<Text style={{ fontSize: CustomFont.font12, color: '#FFF' }}>{this.nameFormat(item.memberName)}</Text>
										</View>
									}

									<View style={{ flex: 1, }}>
										<Text style={{ fontSize: CustomFont.font16 }}>{item.memberName}</Text>
										<Text style={{ fontSize: CustomFont.font12 }}>{item.memberSpeciality}</Text>
									</View>
									<Text>{this.countChange(item.memberViewCount)} View</Text>
								</View>)
							}}
						/>
					</View>
				</Modal> */}
				<Modal
					animationType="slide"
					visible={this.state.isModalVisible}
					onRequestClose={() => {
						this.setState({ isModalVisible: false });
					}}
					style={{ backgroundColor: Color.black, marginBottom: Platform.OS == 'ios' ? responsiveHeight(-3.5) : responsiveHeight(-4.5) }}
				>
					<View style={{ flex: 1, backgroundColor: Color.black, justifyContent: 'center', alignItems: 'center', width: responsiveWidth(100), height: responsiveHeight(100), left: responsiveWidth(-5), top: responsiveHeight(-3) }}>
						<TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: Platform.OS == 'android' ? responsiveHeight(4) : responsiveHeight(10), right: 0, zIndex: 999, alignItems: 'flex-end' }} onPress={() => this.setState({ isModalVisible: false })}>
							<Image source={cross_white} style={{ height: responsiveFontSize(3.6), width: responsiveFontSize(3.6), resizeMode: 'contain', margin:10 }} />
						</TouchableOpacity>
						<TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: Platform.OS == 'android' ? responsiveHeight(4) : responsiveHeight(10), left: 0, zIndex: 999, alignItems: 'flex-end' }} onPress={this.makeDownload}>
							<Image source={download} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), resizeMode: 'contain', margin:10 }} />
						</TouchableOpacity>

						<ImageZoom cropWidth={responsiveWidth(100)}
							cropHeight={responsiveHeight(100)}
							imageWidth={responsiveWidth(100)}
							imageHeight={responsiveHeight(100)}
							enableSwipeDown='y'
							pinchToZoom='y'
							panToMove={false}>
							<Image source={{ uri: selectedImageUrl }} style={{ marginTop: 30, marginBottom: 30, width: responsiveWidth(100), height: responsiveHeight(100), resizeMode: 'contain' }} />
						</ImageZoom>
					</View>
				</Modal>
				<Modal isVisible={this.state.commentListPopup}>
					<View style={[styles.modelViewMessage, { paddingTop: 25, height: responsiveHeight(70) }]}>
						<View style={{ flexDirection: 'row', paddingStart: 20, paddingEnd: 20 }}>
							<Text style={{ flex: 1, color: Color.primary, fontSize: CustomFont.font18 }}>People Who Commented</Text>
							<TouchableOpacity onPress={() => this.setState({ commentListPopup: false })}>
								<Image style={styles.crossIcon} source={CrossIcon} />
							</TouchableOpacity>
						</View>

						<FlatList style={{ marginTop: responsiveHeight(3) }}
							data={this.state.commentListData}
							renderItem={({ item, index }) => {
								return (<View style={{
									paddingTop: 10, paddingBottom: 10, paddingStart: 20, paddingEnd: 20, backgroundColor: Color.bgColor,
									alignItems: 'center', flexDirection: 'row', marginTop: 0, marginBottom: 10, marginEnd: 8
								}}>
									{item.memberImageUrl ? <Image source={{ uri: item.memberImageUrl }}
										style={{ marginRight: responsiveWidth(3), marginTop: 2, height: responsiveWidth(6), width: responsiveWidth(6), borderRadius: responsiveWidth(1) }} /> :
										<View style={{ marginRight: responsiveWidth(3), height: responsiveWidth(8), width: responsiveWidth(8), borderRadius: responsiveWidth(3), backgroundColor: Color.liveBg, justifyContent: 'center', alignItems: 'center' }}>
											<Text style={{ fontSize: CustomFont.font12, color: '#FFF' }}>{this.nameFormat(item.memberName)}</Text>
										</View>
									}
									<View style={{ flex: 1, }}>
										<Text style={{ fontSize: CustomFont.font16, color: Color.fontColor }}>{item.memberName}</Text>
										<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor }}>{item.memberSpeciality}</Text>
									</View>
								</View>)
							}}
						/>
					</View>
				</Modal>

				<Modal style={{ height: '100%', width: '100%', margin: 0, backgroundColor: '#F6F1FC' }} isVisible={this.state.showPostShareModal}>
					<ScrollView showsVerticalScrollIndicator={false}><ViewShot
						snapshotContentContainer={true}
						style={{
							backgroundColor: '#F6F1FC',
							height: '100%', width: '100%'
						}}
						ref="viewShot"
						// captureMode = "mount"
						// onCapture = {this.callOnCapture}
						options={{ format: 'jpg', quality: 1 }}>

						<View>
							<Image source={{ uri: this.state.postImageUrl }} style={{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 8, width: responsiveWidth(92), height: responsiveHeight(25), resizeMode: 'stretch' }} />

							<View style={{
								width: responsiveWidth(100),
								marginTop: responsiveHeight(0),
								marginBottom: responsiveHeight(0),
								padding: responsiveWidth(4),
							}}>
								<Text style={{
									color: Color.black,
									fontFamily: CustomFont.fontName,
									fontWeight: CustomFont.fontWeightBold,
									marginLeft: responsiveWidth(-0.3),
									//marginRight: responsiveWidth(3),
									textAlign: 'left',
									fontSize: CustomFont.font20,
									marginTop: responsiveHeight(.1),
								}}>{this.state.postShareTitle}</Text>
								<Text style={{ marginTop: responsiveHeight(1), lineHeight: responsiveHeight(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14 }}>{this.state.postDescription}</Text>
							</View>
						</View>
						<View style={{
							backgroundColor: Color.white,
							width: responsiveWidth(100),
							//height: responsiveHeight(5),
							padding: responsiveWidth(4),
							marginBottom: 0,
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row'

						}}>
							<View style={{
								flex: 1, flexDirection: 'row',
								alignItems: 'center'
							}}>
								<Image style={{ height: responsiveHeight(3), width: responsiveHeight(3), resizeMode: 'contain' }} source={LogoIcon} />
								<Text style={{ marginLeft: 10, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.optiontext }}>DrOnA Health</Text>
							</View>

							<View style={{
								flex: 1, flexDirection: 'row',
								alignItems: 'flex-end'
							}}>
								<Text style={{ marginLeft: 10, color: Color.datecolor, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12 }}>{this.state.postAutherName},</Text>
								<Text style={{ textAlign: 'right', marginLeft: 0, color: Color.datecolor, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12 }}> {this.state.postDateTime ? this.ageCalculateForShare(this.state.postDateTime) : ''}</Text>

							</View>
						</View>

					</ViewShot></ScrollView>
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
)(SavedPost);
