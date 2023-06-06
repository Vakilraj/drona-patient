import React, { useState } from 'react';
import {
	View,
	Text, SafeAreaView, StatusBar,
	ActivityIndicator, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, PermissionsAndroid, Linking, Platform, Keyboard
} from 'react-native';
import styles from './style';
import Modal from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CustomLoader from '../../../src/utils/CustomLoader';

import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Moment from 'moment';
import comment_0 from '../../../assets/comment_0.png';
import like_0 from '../../../assets/like_0.png';
import like_done from '../../../assets/like_done.png';
import pick_0 from '../../../assets/pick_0.png';
import save_fill from '../../../assets/save_fill.png';
import save_gray from '../../../assets/save_gray.png';
import share_0 from '../../../assets/share_0.png';
import addedTopic from '../../../assets/addedTopic.png';
import addTopic from '../../../assets/addTopic.png';

import cross_white from '../../../assets/cross_white.png';
import download from '../../../assets/download.png';

import CrossIcon from '../../../assets/cross_black.png';
import Share from 'react-native-share';
import { NavigationEvents } from 'react-navigation';
import LogoIcon from '../../../assets/app_icon.png';

import play from '../../../assets/play.png';
import pause from '../../../assets/pause.png';
import Carousel, { Pagination } from 'react-native-snap-carousel';
//import Video from 'react-native-video';
import Snackbar from 'react-native-snackbar';

import notification from '../../../assets/notification.png';
import savedPost from '../../../assets/savedPost.png';
import ic_menu from '../../../assets/ic_menu.png';
import ViewShot from 'react-native-view-shot';
let selectedImageUrl = '', selectedPostId = '';
let pageIndex = 0, selectType = '', customLoaderFlag = 0;
let isPostNotAvailable = false, shareFlag = 0;
import { setLogEvent } from '../../service/Analytics';
let n=0;
class Community extends React.Component {
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
			isPickTopics: false,
			showLoader: false,

			activeSlide: 0,
			imageArray: [],
			playPause: true,
			showLoading: false,
			likeListData: [],
			likeListPopup: false,

			commentListPopup: false,
			commentListData: [],
			viewListPopup: false,
			viewListData: [],
			selectedIndex: 0,

			showPostShareModal: false,
			postTitle: '',
			postDes: '',
			autherName: '',
			postTime: '',
			postImg: '',
			noPostAvailableMsg: '',
			isRefreshing: false,
		};
		pageIndex = 0;
		customLoaderFlag = 0;
		shareFlag = 0;
		n=0;
	}
	componentDidMount() {
		Keyboard.dismiss(0);
		pageIndex = 0;
		this.loadMoreData();
	}

	getCommentUserInfo = (postGuid) => {
		let { actions, signupDetails } = this.props;
		let params = {
			"DoctorGuid": signupDetails.doctorGuid,
			"userGuid": signupDetails.UserGuid,
			"Data": {
				"postGuid": postGuid,
			}
		};
		actions.callLogin('V1/FuncForDrAppToGetPostById', 'post', params, signupDetails.accessToken, 'getCommentUserList');
	}

	onRefresh = () => {
		this.setState({ isRefreshing: true })
		//alert('dfjgfjdgj')
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,    // should not be blank or null
			"data":            // should not be blank or null
			{
				"isMember": true,                           // null in case of first time user
				"displaySavedPostOnly": false,                // true in case of saved post display (bookmark list)
				"sortBy": "Dr",
				"sortOrder": "",
				"pageIndex": 1,
				"pageSize": "10",
				"communityTopic": null  // null for first time load. Provide list when filtering (save btn click of Pick topics)

			}
		}
		//console.log("communityList Params" + JSON.stringify(params));
		actions.callLogin('V1/FuncForDrAppToGetCommunityInfo', 'post', params, signupDetails.accessToken, 'GetCommunityInfopulltoreferesh');
	}


	clickOnSavePost = (postId, isPostSaved) => {
		// if(isPostSaved)
		// 	Snackbar.show({ text: 'Post Saved successfully.', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		// else
		// Snackbar.show({ text: 'Post Unsaved successfully.', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
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
		setTimeout(()=>{
			actions.callLogin('V1/FuncForDrAppToToggleBookmarkPost', 'post', params, signupDetails.accessToken, 'savepostData');
			setLogEvent("bookmark", { userGuid: signupDetails.UserGuid, "postId": postId, screen: "medical news" })
		},300)
		
	}

	postView = (postId) => {
		selectedPostId = postId;
		let { actions, signupDetails } = this.props;
		let params = {
			"doctorGuid": signupDetails.doctorGuid,
			"UserGuid": signupDetails.UserGuid,
			"data": {
				"postGuid": selectedPostId,
			}
		}
		actions.callLogin('V1/FuncForDrAppToPushUserPostView', 'post', params, signupDetails.accessToken, 'viewpost');
	}

	loadMoreData = () => {
		this.setState({ noPostAvailableMsg: '' });
		pageIndex++;
		if (customLoaderFlag == 0)
			this.setState({ showLoader: true });
		else
			this.setState({ showLoaderBottom: true });

		let { actions, signupDetails } = this.props;
		let topicInput = null;
		if (selectType === 'picker')
			topicInput = this.state.dataArrayTopic && this.state.dataArrayTopic.length > 0 ? this.state.dataArrayTopic : null;
		else if (selectType === 'allPosts') {
			if (this.state.dataArrayTopicHeader[0].isActive) {
				let tmp = [...this.state.dataArrayTopicHeader];
				tmp.splice(0, 1);
				if (tmp && tmp.length > 0) {
					topicInput = tmp
				} else {
					topicInput = null;
				}
			} else {
				topicInput = null;
			}

		}
		else if (selectType === 'header') {
			let tmpArr = [];
			if (this.state.dataArrayTopicHeader && this.state.dataArrayTopicHeader.length > 0) {
				for (let i = 0; i < this.state.dataArrayTopicHeader.length; i++) {
					if (this.state.dataArrayTopicHeader[i].isActive)
						tmpArr.push(this.state.dataArrayTopicHeader[i])
				}
				topicInput = tmpArr && tmpArr.length > 0 ? tmpArr : null;
			} else {
				topicInput = null;
			}
		} else {
			topicInput = null;
		}
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,    // should not be blank or null
			"data":            // should not be blank or null
			{
				"isMember": true,                           // null in case of first time user
				"displaySavedPostOnly": false,                // true in case of saved post display (bookmark list)
				"sortBy": "Dr",
				"sortOrder": "",
				"pageIndex": pageIndex,
				"pageSize": "10",
				"communityTopic": topicInput  // null for first time load. Provide list when filtering (save btn click of Pick topics)

			}
		}
		//console.log("communityList Params" + JSON.stringify(params));
		actions.callLogin('V1/FuncForDrAppToGetCommunityInfo', 'post', params, signupDetails.accessToken, 'GetCommunityInfo');
	};

	getFilter = (item) => {
		this.setState({ noPostAvailableMsg: '', showLoaderBottom: true });
		let { actions, signupDetails } = this.props;
		let params = {
			"doctorGuid": signupDetails.doctorGuid,  // should not be blank or null
			"userGuid": signupDetails.UserGuid,    // should not be blank or null
			"data":            // should not be blank or null
			{
				"isMember": true,                           // null in case of first time user
				"displaySavedPostOnly": false,                // true in case of saved post display (bookmark list)
				"sortBy": "Dr",
				"sortOrder": "",
				"pageIndex": pageIndex,
				"pageSize": "10",
				"communityTopic": [item]  // null for first time load. Provide list when filtering (save btn click of Pick topics)
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetPostByTopics', 'post', params, signupDetails.accessToken, 'GetFilter');
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

	getViewList = (item) => {
		let { actions, signupDetails } = this.props;
		selectedPostId = item.postGuid;
		// this.setState({ likeListData: item.thanks.thanksDetails });
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

	getLikeListss = (item) => {
		selectedPostId = item.postGuid;
		this.setState({ likeListData: item.thanks.thanksDetails });

		// let { actions, signupDetails } = this.props;
		// let params = {
		// 	"DoctorGuid":signupDetails.doctorGuid,
		// 	"ClinicGuid":signupDetails.ClinicGuid,
		// 	"Data": {
		// 		"PostGuid": selectedPostId,
		// 		"commentGuid":"", // when get details on comment level then fill this value
		// 		"replyGuid":"", //when get details on reply level then fill this value 
		// 	}
		// }
		// console.log(JSON.stringify(params));
		// actions.callLogin('V1/FuncForDrAppToGetPostThanksById', 'post', params, signupDetails.accessToken, 'likeList');
	}

	clickOnShare = (item) => {
		shareFlag = 1;
		this.setState({ postImg: item.mediaAttachment[0].mediaAttachmentUrl });
		let options = {};
		selectedPostId = item.postGuid;
		//alert(selectedPostId)

		//	this.props.nav.navigation.navigate("ShareMedicalNews", {postid : selectedPostId});


		let { actions, signupDetails } = this.props;
		let params = {
			"DoctorGuid": signupDetails.doctorGuid,
			"userGuid": signupDetails.UserGuid,
			"Data": {
				"postGuid": selectedPostId,
			}
		};
		//console.log("--------get post req ------" + JSON.stringify(params))
		actions.callLogin('V1/FuncForDrAppToGetPostById', 'post', params, signupDetails.accessToken, 'sharepostby');
		setLogEvent("share_post", { userGuid: signupDetails.UserGuid, screen: "Comment" })
		// const htmlCode = `<div>
		// <h1>This is a Heading</h1>
		// <p>This is a paragraph.</p>
		// </div>`;
		// if(Platform.OS == 'ios'){
		// 	 options = {
		// 		subject: item.postTitle + '\n',
		// 		message: this.getDesc(item.postDescription, 0) + '\n',
		// 	//	message: htmlCode,

		// 		url: 'dronadr://https://dronadoctor.profile/' + selectedPostId + '\n\n Download the app from store https://play.google.com/store/apps/details?id=com.dronahealth.doctor'
		// 	}
		// }
		// else{
		// 	 options = {
		// 		subject: item.postTitle + '\n',
		// 		message: this.getDesc(item.postDescription, 0) + '\n',
		// 		//message: htmlCode,
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
		// setTimeout(() => {
		// 	let { actions, signupDetails } = this.props;
		// 	let params = {
		// 		"DoctorGuid": signupDetails.doctorGuid,
		// 		"ClinicGuid": "",
		// 		"data": {
		// 			"postGuid": selectedPostId,
		// 			"shareGuid": ""
		// 		}
		// 	}
		// 	//actions.callLogin('V1/FuncForDrAppToSaveUpdateSharePost', 'post', params, signupDetails.accessToken, 'shareSaveUpdate');
		// }, 1000);
		//setLogShare({ content_type: 'medical_news' })
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
				"commentGuid": null, //if like comment then fill this
				"replyGuid": null, //if like reply then fill this
				"IsLike": isThanks
			}
		}
		actions.callLogin('V1/FuncForDrAppToSaveUpdateThanks', 'post', params, signupDetails.accessToken, 'likeSave');
		setLogEvent("like", { userGuid: signupDetails.UserGuid, "postId": postId, screen: "Community", likeStatus: isThanks })
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

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'GetCommunityInfo' || tagname === "GetFilter") {
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
								"isActive": true,
							},];
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
						this.setState({ dataArray: [...this.state.dataArray, ...res] });

						//this.setState({ dataArray: res });
					} else {
						isPostNotAvailable = true
						Snackbar.show({ text: 'No post available', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
						this.setState({ noPostAvailableMsg: 'No post available' });
					}

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
				// 	//Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				// },500)
				
			} else if (tagname === 'likeList') {
				let resLikeList = newProps.responseData.data.thanksDetails;
				// this.setState({ likeListData: resLikeList });
				this.setState({ likeListData: resLikeList });
				// this.setState({ likeListData: [...this.state.dataArray, ...resLikeList] });
			}
			else if (tagname === 'getCommentUserList') {
				let resCommentUserList = newProps.responseData.data.comment.commentDetails;
				this.setState({ commentListData: resCommentUserList });
			} else if (tagname === "viewList") {
				if (newProps.responseData.statusCode == 0) {
					this.setState({ viewListPopup: true });
					let resViewUserList = newProps.responseData.data.postViewDetails;
					this.setState({ viewListData: resViewUserList });
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				}
			}

			else if (tagname == 'GetCommunityInfopulltoreferesh') {

				if (newProps.responseData.data) {
					this.setState({ isRefreshing: false });
					let res = newProps.responseData.data.communityPost;
					if (res && res.length > 0) {
						this.setState({ dataArray: res });
					} else {
						isPostNotAvailable = true
						Snackbar.show({ text: 'No post available', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
						this.setState({ noPostAvailableMsg: 'No post available' });
					}

					this.setState({ showLoader: false, showLoaderBottom: false });
				} else {
					alert(newProps.responseData.statusMessage)
					this.setState({ showLoader: false, showLoaderBottom: false });
				}

			}
			if (tagname === 'sharepostby' && shareFlag == 1) {
				if (newProps.responseData.data) {
					let urlString = '';
					let data = newProps.responseData.data;
					this.setState({ postTitle: data.postTitle });
					this.setState({ postDes: data.postDescription })
					this.setState({ autherName: 'by ' + data.authorFirstName + ' ' + data.authorLastName })
					this.setState({ postTime: data.postDateTime })
					//this.setState({postImg: data.mediaAttachment[0].mediaAttachmentUrl })
					this.setState({ showPostShareModal: true });
					setTimeout(() => {
						this.refs.viewShot.capture().then((uri) => {
							//	this.setState({ showPostShareModal: false });
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
										shareFlag = 0;
										this.setState({ showPostShareModal: false })
									})
									.catch((err) => {
										shareFlag = 0;
										this.setState({ showPostShareModal: false })
									});


							});
						});
					}, 800);


					//	for share
					//setTimeout(() => {
					// let options = {
					// 	subject: '',
					// 	message: '', //Shared via DrOnA Dr app
					// 	url: urlString,
					// 	type: 'image/jpeg',
					// }
					// console.log('--------------++++'+);
					// Share.open(options)
					// 	.then((res) => {
					// 		shareFlag = 0;
					// 		this.setState({ showPostShareModal: false })
					// 	})
					// 	.catch((err) => {
					// 		console.log('--------------++++'+JSON.stringify(err));
					// 		shareFlag = 0;
					// 		this.setState({ showPostShareModal: false })
					// 	});
					//}, 1200);


				}

			}

		}
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


	ageCalculateForShare = (incomingDate) => {
		let str = '';
		let tempNotificationDate = '';
		if (incomingDate) {
			tempNotificationDate = Moment(incomingDate).format('DD MMM YY');
		}
		return tempNotificationDate;

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
	ageCalculate1 = (incomingDate) => {
		let str = '';
		str = Moment(incomingDate).fromNow(true);
		return str;
	}

	setActiveHeader(index) {
		for (let i = 0; i < this.state.dataArrayTopicHeader.length; i++) {
			this.state.dataArrayTopicHeader[i].isActive = i == index
		}
		this.setState({ dataArrayTopicHeader: this.state.dataArrayTopicHeader })
	}

	renderListHeader = ({ item, index }) => (
		<TouchableOpacity onPress={() => {
			// alert('Post not available')
			pageIndex = 0;
			this.setState({ dataArray: [] })
			if (index == 0) {
				isPostNotAvailable = false;
				this.loadMoreData()
			}
			else this.getFilter(item)
			this.setActiveHeader(index)
			// item.isActive = !item.isActive; this.setState({ dataArrayTopicHeader: this.state.dataArrayTopicHeader }); pageIndex = 0;
			// if (index == 0)
			// 	selectType = 'allPosts';
			// else
			// 	selectType = 'header';
			// this.loadMoreData();
		}} style={{
			borderWidth: 1,
			borderColor: item.isActive ? Color.weekdaycellPink : Color.newBorder,
			padding: 12,
			backgroundColor: item.isActive ? Color.goldPink : null,
			// height: responsiveHeight(5),
			borderRadius: 5, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2), alignItems: 'center', justifyContent: 'center', marginLeft: responsiveWidth(3)
		}}>
			<Text style={{ fontSize: CustomFont.font14, color: this.state.dataColor, marginLeft: 7, marginRight: 7 }}>
				{item.communityTopicName && item.communityTopicName != null ? item.communityTopicName : null}</Text>
		</TouchableOpacity>
	);
	
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
						{mediaLength > 0 ? <Pagination
							dotsLength={item.mediaAttachment.length}
							activeDotIndex={this.state.activeSlide}
							containerStyle={{ zIndex: 999, marginTop: responsiveHeight(-10.5) }}
							dotStyle={{ height: responsiveFontSize(1.2), width: responsiveFontSize(1.2), borderRadius: responsiveFontSize(.6) }}
							inactiveDotOpacity={0.4}
							inactiveDotScale={1}
							carouselRef={this._carousel}
							tappableDots={!!this._carousel} /> : null}
					</View>

					<Text style={{ fontFamily: CustomFont.fontNameBold, fontWeight: 'bold', fontSize: CustomFont.font18, color: Color.text1, marginTop: responsiveHeight(3.6), marginRight: responsiveWidth(5) }}>{item.postTitle}</Text>


					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(1.8), alignItems: 'center' }}>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font12, color: Color.text3 }}>By {(item.authorFirstName +' '+ item.specialityName).replace('  ', " ").replace(null, "")}, {Moment(item.postDateTime).format('DD MMM YY')}</Text>
							<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.patientSearchHolder, marginLeft: 5, textAlign: 'center' }}>• 2 min read</Text>
						</View>

						<TouchableOpacity onPress={() => {
							item.isPostSaved = !item.isPostSaved;
							this.setState({ dataArray: this.state.dataArray })
							this.clickOnSavePost(item.postGuid, item.isPostSaved)
						}}>
							<Image source={item.isPostSaved ? save_fill : save_gray} style={{ height: 24, width: 24, resizeMode: 'contain' }} />
						</TouchableOpacity>
					</View>
						<Text style={{ textAlign: 'justify', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.8), opacity: 1, color: Color.yrColor, lineHeight: responsiveHeight(3.5) }}>{this.getDesc(item.postDescription, 0)} <Text style={{ color: Color.primary, fontWeight:'bold' }} onPress={() => this.props.nav.navigation.navigate('Comments', { item: item })}>{item.postDescription && item.postDescription.length > 100 ? ' Read More' : ''}</Text></Text>
					
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
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: responsiveWidth(1.5)}} onPress={() => { this.getViewList(item) }}>
								<Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.view ? this.countChange(item.view.viewCount) : 0} Views</Text>
							</TouchableOpacity>
							<Text style={{ paddingTop: 7, flexDirection: 'row', fontStyle: 'italic', fontSize: 6, fontFamily: CustomFont.fontName, color: Color.grayTxt, }}>0</Text>
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: responsiveWidth(0) }}>
								<Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.share ? this.countChange(item.share.shareCount) : '0'} Shares</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ flexDirection: 'row', marginTop: responsiveHeight(1), marginLeft: responsiveHeight(0.5), marginRight: responsiveHeight(0.5) }}>

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
								<Text style={{ fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: item.thanks.isThanks ? Color.primary : Color.optiontext, marginLeft: responsiveWidth(2) }}>Likes</Text>
							</TouchableOpacity>

							{/* <TouchableOpacity
						onPress={() => { this.setState({ likeListPopup: true }); this.getLikeList(item) }}>
						<Text style={{ marginLeft: 7 }}>...</Text></TouchableOpacity> */}
						</View>
						<View style={{ flex: 1, }}>
							<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.props.nav.navigation.navigate('Comments', { item: item })}>
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

	checkPermission = async () => {
		// Function to check the platform
		// If iOS then start downloading
		// If Android then ask for permission
		if (Platform.OS === 'ios') {
			this.makeDownload();
		} else {
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
					// Once user grant the permission start downloading
					//console.log('Storage Permission Granted.');
					this.makeDownload();
				} else {
					// If permission denied then show alert
					alert('Storage Permission Not Granted');
				}
			} catch (err) {
				// To handle permission related exception
				//console.warn(err);
			}
		}
	};

	makeDownload = async () => {
		this.setState({ isModalVisible: false });
		if (Platform.OS === 'ios') {
			this.downloadImage()
		} else {
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
	callOnCapture = () => {
		//alert('Call')
	}

	downloadImage() {
		let date = new Date();
		// Image URL which we want to download
		// let image_URL = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png'; 
		let image_URL = selectedImageUrl;
		let ext = this.getExtention(image_URL);
		ext = '.' + ext[0];
		const { config, fs } = RNFetchBlob;
		//let PictureDir = fs.dirs.PictureDir;
		let PictureDir = Platform.OS == 'ios'? fs.dirs.DocumentDir: fs.dirs.PictureDir;
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

	getDesc = (val, from) => {
		let returnStr = val;
		if (val && val.indexOf("\r\n\r\nSource:") > -1) {
			let str = val.split("\r\n\r\nSource:");
			if (from === 0) {
				if (str[0] && str[0].length > 100)
					returnStr = str[0].substr(0, 100) + '' //...
				else
					returnStr = str[0];
			} else
				returnStr = str[1];
		} else {
			if (val && val.length > 100)
				returnStr = val.substr(0, 100) + '' //...
			else returnStr

		}
		// else if(from==0){
		// 	returnStr=val;
		// }
		return returnStr ? returnStr.trim() : returnStr;
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

	handleViewableItemsChanged = (viewableItems, changed) => {
		if (viewableItems.viewableItems.length > 0) {
			//console.log(n+'------'+viewableItems.viewableItems[0].item.postGuid)
			this.postView(viewableItems.viewableItems[0].item.postGuid)
		}
	}
	onScrollEndDrag = () => {
		setTimeout(()=>{
//call api from this block.
		},1000)
	}

	render() {
		return (
			<View style={Platform.OS == 'android' ? styles.containerAndroid: styles.container}>
				<NavigationEvents onDidFocus={() => {
					pageIndex = 0;
					//this.loadMoreData();
					this.onRefresh();

				}} />
				<View style={{ flex: 1 }}>
					<View style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(7) }}>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<TouchableOpacity onPress={() => this.props.nav.navigation.openDrawer()} >
								<Image style={{ resizeMode: 'contain', height: responsiveWidth(6), width: responsiveWidth(6), padding: responsiveHeight(1), marginLeft: responsiveWidth(2.1), marginTop: responsiveHeight(.35) }} source={ic_menu} />
							</TouchableOpacity>
						</View>
						<TouchableOpacity style={{ flex: 5.2, flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ fontSize: CustomFont.font16, color: Color.text2, marginLeft: responsiveWidth(2), fontWeight: '700' }}>Medical News</Text>
						</TouchableOpacity>
						<View style={{ flex: 1.8, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }} >
							<TouchableOpacity onPress={() => this.props.nav.navigation.navigate('SavedPost')}>
								<Image source={savedPost} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), margin: 7, marginRight: 10 }} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.props.nav.navigation.navigate('Notification')}>
								<Image source={notification} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), margin: 7, marginRight: 10 }} />
							</TouchableOpacity>
						</View>
					</View>

					{this.state.showLoader ? <CustomLoader /> : <View style={{ flex: 1, }}>
						{/* <View style={{ flexDirection: 'row', alignItems: 'center', }}>
							<TouchableOpacity onPress={() => this.setState({ isPickTopics: true })} style={{
								marginLeft: responsiveWidth(4), marginRight: responsiveWidth(2)
							}}>
								<Image source={pick_0} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), }} />
							</TouchableOpacity>
							<FlatList
								extraData={this.state}
								data={this.state.dataArrayTopicHeader}
								renderItem={this.renderListHeader}
								horizontal={true}
								extraData={this.state}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View> */}
						{this.state.dataArray && this.state.dataArray.length > 0 ?
							<FlatList
								data={this.state.dataArray}
								refreshing={this.state.isRefreshing}
								onRefresh={() => this.onRefresh()}
								showsVerticalScrollIndicator={false}
								renderItem={this.renderList}
								extraData={this.state}
								viewabilityConfig={{
									itemVisiblePercentThreshold: 50
								}}
								//style={{ marginStart: 16, marginEnd: 16, marginTop: 16 }}
								// viewabilityConfig={this.viewabilityConfig}
								onViewableItemsChanged={this.handleViewableItemsChanged}
								keyExtractor={(item, index) => index.toString()}
								onScrollEndDrag={this.onScrollEndDrag}
								onEndReached={() => this.loadMoreData()}
							/> :
							<View style={{ alignItems: 'center' }}><Text style={{ marginTop: 30, color: Color.primary, fontSize: CustomFont.font16 }}>{this.state.noPostAvailableMsg}</Text></View>}


						{this.state.showLoaderBottom ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<ActivityIndicator size="large" color={Color.primary} />
						</View> : null
						}


					</View>}

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
											<Text style={{ fontSize: CustomFont.font16 }}>{item.memberName}</Text>
											<Text style={{ fontSize: CustomFont.font12 }}>{item.memberSpeciality}</Text>
										</View>
									</View>)
								}}
							/>
						</View>
					</Modal>

					<Modal isVisible={this.state.likeListPopup}>
						<View style={[styles.modelViewMessage, { paddingTop: 25, height: responsiveHeight(70) }]}>
							<View style={{ flexDirection: 'row', paddingStart: 20, paddingEnd: 20 }}>
								<Text style={{ flex: 1, color: Color.primary, fontSize: CustomFont.font18 }}>People Who Reacted</Text>
								<TouchableOpacity onPress={() => this.setState({ likeListPopup: false })}>
									<Image style={styles.crossIcon} source={CrossIcon} />
								</TouchableOpacity>
							</View>

							<FlatList style={{ marginTop: responsiveHeight(3) }}
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
					<Modal isVisible={this.state.viewListPopup}>
						<View  style={[styles.modelViewMessage,{paddingTop: 25}]} >
							<View style={{ flexDirection: 'row', paddingStart: 20, paddingEnd: 20 }}>
								<Text style={{ flex: 1, color: Color.primary, fontSize: CustomFont.font18 }}>People Who Viewed</Text>
								<TouchableOpacity onPress={() => this.setState({ viewListPopup: false })}>
									<Image style={styles.crossIcon} source={CrossIcon} />
								</TouchableOpacity>
							</View>

							<FlatList style={{ marginTop: responsiveHeight(3),marginBottom:responsiveHeight(25) }}
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
											<Text style={{ fontSize: CustomFont.font16,color:Color.fontColor }}>{item.memberName}</Text>
											<Text style={{ fontSize: CustomFont.font12,color:Color.fontColor }}>{item.memberSpeciality}</Text>
										</View>
										<Text>{this.countChange(item.memberViewCount)} View</Text>
									</View>)
								}}
							/>
						</View>
					</Modal>

					<Modal
						animationType="slide"
						visible={this.state.isModalVisible}
						onRequestClose={() => {
							this.setState({ isModalVisible: false });
						}}
						style={{ marginBottom: Platform.OS == 'ios' ? responsiveHeight(-3.5) : responsiveHeight(-4.5) }}
					>
						<View style={{ flex: 1, backgroundColor: Color.black, justifyContent: 'center', alignItems: 'center', width: responsiveWidth(100), height: responsiveHeight(100), left: responsiveWidth(-5), top: responsiveHeight(-3) }}>
							<TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: Platform.OS == 'android' ? responsiveHeight(4) : responsiveHeight(10), right: 0, zIndex: 999, alignItems: 'flex-end' }} onPress={() => this.setState({ isModalVisible: false })}>
								<Image source={cross_white} style={{ height: responsiveFontSize(3.6), width: responsiveFontSize(3.6), resizeMode: 'contain',  margin: 10  }} />
							</TouchableOpacity>
							<TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: Platform.OS == 'android' ? responsiveHeight(4) : responsiveHeight(10), left: 0, zIndex: 999, alignItems: 'flex-end' }} onPress={this.makeDownload}>
								<Image source={download} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), resizeMode: 'contain', margin: 10 }} />
							</TouchableOpacity>

							<ImageZoom cropWidth={responsiveWidth(100)}
								cropHeight={responsiveHeight(100)}
								imageWidth={responsiveWidth(100)}
								imageHeight={responsiveHeight(100)}
								panToMove='y'
								enableSwipeDown='y'
								pinchToZoom='y'
								panToMove={false}
								>
								<Image source={{ uri: selectedImageUrl }} style={{ marginTop: 30, marginBottom: 30, width: responsiveWidth(100), height: responsiveHeight(100), resizeMode: 'contain' }} />
							</ImageZoom>
						</View>
					</Modal>

					<Modal isVisible={this.state.isPickTopics}>
						<View style={[styles.modelViewMessage, { paddingTop: 15 }]}>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
								<Text style={{ flex: 1, fontFamily: CustomFont.fontName, fontWeight: 'bold', color: Color.black, fontSize: CustomFont.font18, marginLeft: 16 }}>Filter Topics</Text>
								<TouchableOpacity onPress={() => this.setState({ isPickTopics: false })} style={{ marginRight: 35 }}>
									<Image style={[styles.crossIcon]} source={CrossIcon} />
								</TouchableOpacity>
							</View>
							<FlatList
								data={this.state.dataArrayTopic}
								style={{ marginTop: 30 }}
								renderItem={({ item, index }) => {
									return (<TouchableOpacity onPress={() => {
										if (item.isSpeciality) item.isSelected = true;
										else item.isSelected = !item.isSelected;
										this.setState({ dataArrayTopic: this.state.dataArrayTopic })
									}} style={{
										paddingTop: 10, paddingBottom: 10, paddingStart: 20, paddingEnd: 20, backgroundColor: Color.white,
										alignItems: 'center', flexDirection: 'row', marginTop: 0,
										marginBottom: 0,
									}}>
										<View style={{ flex: 1, }}>
											<Text style={{ fontSize: CustomFont.font14, color: Color.yrColor, fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName }}>{item.communityTopicName}</Text>
											{/* <Text style={{ fontSize: CustomFont.font12, color: '#160816', opacity: 0.8 }}>{item.communityTopicDesc}</Text> */}
										</View>
										<View style={{
											marginRight: responsiveWidth(4)
											// opacity: item.isSpeciality ? .2 : 1,
											// paddingRight: 5,
											// borderRadius: 5, borderColor: item.isSelected ? Color.weekdaycellPink : Color.lightPrimary, backgroundColor: item.isSelected ? Color.goldPink : Color.white, borderWidth: 1
										}}>
											<Image source={item.isSelected ? addedTopic : addTopic} style={{ height: 32, width: 32 }} />
										</View>
									</TouchableOpacity>)
								}}
								ItemSeparatorComponent={() => { return (<View style={{ marginStart: 16, marginEnd: 20, height: 1, backgroundColor: Color.primary, opacity: .1 }} />) }}
							/>
							<TouchableOpacity onPress={() => {
								this.setState({ isPickTopics: false });
								pageIndex = 0;
								customLoaderFlag = 0;
								selectType = 'picker';
								this.setState({ dataArray: [] })
								this.loadMoreData();
							}} style={{ borderRadius: 5, marginStart: 20, marginEnd: 20, marginBottom: responsiveHeight(15), backgroundColor: Color.primary }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600, fontSize: CustomFont.font14, paddingTop: 8, paddingBottom: 8, alignSelf: 'center', color: Color.white, }}>Save</Text>
							</TouchableOpacity>
						</View>
					</Modal>
					<Modal style={{ height: '100%', width: '100%', margin: 0, backgroundColor: Color.white }} isVisible={this.state.showPostShareModal}>
						<ScrollView showsVerticalScrollIndicator={false}><ViewShot
							snapshotContentContainer={true}
							style={{
								backgroundColor: Color.white,
								height: '100%', width: '100%'
							}}
							ref="viewShot"
							// captureMode = "mount"
							// onCapture = {this.callOnCapture}
							options={{ format: 'jpg', quality: 1 }}>
							<View>
							<Image source={{ uri: this.state.postImg }} style={{ marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 8, alignSelf: 'center', width: responsiveWidth(92), height: responsiveHeight(25), resizeMode: 'stretch' }} />

								<View style={{
									width: responsiveWidth(100),
									paddingLeft: responsiveWidth(4),
									paddingRight: responsiveWidth(4),
								}}><Text style={{
										color: Color.black,
										fontFamily: CustomFont.fontName,
										fontWeight: CustomFont.fontWeightBold,
										marginLeft: responsiveWidth(-0.3),
										//marginRight: responsiveWidth(3),
										textAlign: 'left',
										fontSize: CustomFont.font20,
										marginTop: responsiveHeight(1.6),
									}}>{this.state.postTitle}</Text>
									<Text style={{ marginTop: responsiveHeight(1), lineHeight: responsiveHeight(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor }}>{this.state.postDes}</Text>
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
									<Text style={{ marginLeft: 10, color: Color.datecolor, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12 }}>{this.state.autherName},</Text>
									<Text style={{ textAlign: 'right', marginLeft: 0, color: Color.datecolor, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12 }}> {this.state.postTime ? this.ageCalculateForShare(this.state.postTime) : ''}</Text>
									{/* <Text style={{ textAlign : 'right', marginLeft  : 0, color  : Color.datecolor,  fontWeight : CustomFont.fontWeight400, fontSize:CustomFont.font12}}> {this.state.postTime}</Text> */}
								</View>
							</View>
						</ViewShot></ScrollView>
					</Modal>
				</View>
			</View>
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
)(Community);
