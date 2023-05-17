import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    Image, TextInput, FlatList,
    TouchableOpacity, BackHandler, ScrollView, PermissionsAndroid, Modal, KeyboardAvoidingView, ActivityIndicator,Linking
} from 'react-native';
import styles from './style';
import Post from './Post';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import CustomFont from '../../../components/CustomFont';
import Modal1 from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Toolbar from '../../../customviews/Toolbar.js';
import ReplyIcon from '../../../../assets/reply.png';
import SendIcon from '../../../../assets/send.png';
import CrossIcon from '../../../../assets/cross_black.png';
import Snackbar from 'react-native-snackbar';
import Share from 'react-native-share';
//import Video from 'react-native-video';
import Moment from 'moment';
import { setApiHandle } from "../../../service/ApiHandle"

import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';
import like_0 from '../../../../assets/like_0.png';
import like_done from '../../../../assets/like_done.png';
import play from '../../../../assets/play.png';
import pause from '../../../../assets/pause.png';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationEvents } from 'react-navigation';
import SendBlueIcon from '../../../../assets/send_blue.png';
import cross_white from '../../../../assets/cross_white.png';
import download from '../../../../assets/download.png';
let selectedImageUrl = '';
let commentGuid = '', replyGuid = '', readGuid = "";
let startTime = new Date();

//Anup 
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import LogoIcon from '../../../../assets/app_icon.png';
let postAuthorName = '', postShareTitle = '';
let postTime = '', postDescrip = '', postImageUrl = '', urlString  = '';
import { setLogEvent } from '../../../service/Analytics';
const Comments = (props) => {
    const [item, setItem] = useState(null)
    const [postList, setPostList] = useState([])

    const [text, onChangeText] = React.useState("");
    const [consultList, setConsultList] = useState([])
    const [count, setCount] = useState([0])
    const [dataArray, setDataArray] = useState([])
    const [selectedPos, setSelectedPos] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [likeStatus, setLikeStatus] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [saveStatus, setSaveStatus] = useState(false)
    const [thanksListArray, setThanksListArray] = useState([])
    const [isThanksListOpen, setIsThanksListOpen] = useState(false)
    const [replyDrName, setReplyDrName] = useState('')
    const [activeSlide, setActiveSlide] = useState(0);
    const [playPause, setPlayPause] = useState(true)
    const [showLoading, setShowLoading] = useState(false)
    const [viewListPopup, setViewListPopup] = useState(false)
    const [viewListData, setViewListData] = useState([])
    // Anup
    const viewShotRef =  useRef();
    const [showPostShareModal, setshowPostShareModal] = useState(false)
    

    // const [likeListPopup, setlikeListPopup] = useState(false)
    // const [likeListData, setlikeListData] = useState([])

    let { actions, signupDetails } = props
    //let postGuid = props.navigation.state.params.item.postGuid
    let postGuid = ''
    if (props.navigation.state.params.from === 'deeplink') {
        postGuid = props.navigation.state.params.postGuid
    }
    else {
        postGuid = props.navigation.state.params.item.postGuid;
        // Anup 
        postShareTitle = props.navigation.state.params.item.postTitle;
        postAuthorName = props.navigation.state.params.item.authorFirstName 
         + ' ' + props.navigation.state.params.item.authorLastName;
        postTime =  props.navigation.state.params.item.postDateTime;
        postDescrip = props.navigation.state.params.item.postDescription;
        postImageUrl = props.navigation.state.params.item.mediaAttachment[0].mediaAttachmentUrl;
        // alert(props.navigation.state.params.item.authorFirstName  + '  ' + 
        // props.navigation.state.params.item.authorLastName +
        //  '  ' +  props.navigation.state.params.item.postDateTime +
        //   '  ' + props.navigation.state.params.item.postDescription + 
        //    '  ' +  props.navigation.state.params.item.mediaAttachment[0].mediaAttachmentUrl)
     // Anup
    }
    // let item = props.navigation.state.params.item


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

        // for unmount
        return function cleanUp() {
            backHandler.remove();
        }
    }, []);

    const handleBackPress = () => {
        readPost()
        setTimeout(()=>{
            props.navigation.goBack();
        },1000)
        
        return true;
    }

    useEffect(() => {
       // readPost(true)
    }, []);

    const getData = () => {
        let params = {
            "DoctorGuid": signupDetails.doctorGuid,
            "userGuid": signupDetails.UserGuid,
            "Data": {
                "postGuid": postGuid,
            }
        };
        actions.callLogin('V1/FuncForDrAppToGetPostById', 'post', params, signupDetails.accessToken, 'getCommentList');
        setLogEvent("share_post", { userGuid: signupDetails.UserGuid, screen: "Comment" })
    }

    const nameFormat = (name) => {
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

    const postComment = () => {
        let params = {
            "DoctorGuid": signupDetails.doctorGuid,
            "userGuid": signupDetails.UserGuid,
            "Data": {
                "postGuid": postGuid,
                // "postGuid": '2d92e5f3-87bc-11eb-996a-0022486b91c8',
                "commentGuid": commentGuid ? commentGuid : null,
                "replyGuid": replyGuid === '' ? null : replyGuid,
                "discussionText": text,
                "discussionType": commentGuid ? "reply" : "comment"
                // "comment" in case of comment to Post and "reply" in case of reply to comment.
            }
        };
        actions.callLogin('V1/FuncForDrAppToSaveUpdateComment', 'post', params, signupDetails.accessToken, 'PostComment');
        setLogEvent(replyGuid != "" ? "reply_on_comment" : "comment", { userGuid: signupDetails.UserGuid, screen: "Comment" })
    }

    const getLikeList = (commentGuid, replyGuid) => {
        let params = {
			"UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.ClinicGuid,
            "Data": {
                "PostGuid": postGuid,
                "commentGuid": commentGuid ? commentGuid : null, // when get details on comment level then fill this value
                "replyGuid": replyGuid === '' ? null : replyGuid, //when get details on reply level then fill this value 
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetPostThanksById', 'post', params, signupDetails.accessToken, 'likeList');
    }

    const getViewList = () => {
        let params = {
			"UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.ClinicGuid,
            "Data": {
                "PostGuid": item.postGuid,
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetPostViewById', 'post', params, signupDetails.accessToken, 'viewList');
    }

    const readPost = () => {
        let params = {
			"UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.ClinicGuid,
            "Data": {
                "postGuid": postGuid,
                "ReadGuid": "",
                "StartTime": Moment(startTime).format('YYYY-MM-DD HH:mm:ss') ,
                "EndTime": Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            }
        }
        actions.callLogin('V1/FuncForDrAppToPushUserReadPost', 'post', params, signupDetails.accessToken, 'readPost');
    }

    useEffect(() => {
        setApiHandle(handleApi, props)
    }, [props.responseData]);

    const handleApi = (response, tag,statusMessage) => {
        if (tag === 'getCommentList') {
            if (response != null) {
                setItem(response)
                setPostList(response.postThreads)
            }
        } else if (tag === 'PostComment') {
            commentGuid = null;
            setReplyDrName('')
            getData()
        } else if (tag === 'likeSaveInComment') {
            Snackbar.show({ text: statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
            // setLikeStatus(!likeStatus)
            // setLikeCount(response.totalCount)
        } else if (tag === 'savepost') {
            setSaveStatus(!saveStatus)
        } else if (tag === 'likeList') {
            if (response.thanksDetails.length) {
                setThanksListArray(response.thanksDetails)
                setIsThanksListOpen(true);
            }
        } else if (tag === "readPost") {
            readGuid = response.readGuid
        }
        //  else if (tag === "viewList") {
        //     console.log('-------------viewList')
        //     if(!viewListPopup)
        //     setViewListPopup(true)
        //     setViewListData(response.postViewDetails)
        // }
    }


    const makeDownload = async () => {
        if (Platform.OS === 'ios') {
            downloadImage()
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
                    downloadImage();
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
    const getExtention = filename => {
        return /[.]/.exec(filename) ?
            /[^.]+$/.exec(filename) : undefined;
    }

    const downloadImage = () => {
        let date = new Date();
        // Image URL which we want to download
        // let image_URL = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png'; 
        let image_URL = selectedImageUrl;
        let ext = getExtention(image_URL);
        ext = '.' + ext[0];
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
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
                alert('Image Downloaded Successfully.');
            });

    }

    const clickOnSavePost = (postId, isPostSaved) => {
        let params = {
			"UserGuid": signupDetails.UserGuid,
            "doctorGuid": signupDetails.doctorGuid,
            "userGuid": signupDetails.UserGuid,
            "data": {
                "postGuid": postGuid,
                "isPostSaved": isPostSaved
            }
        }
        actions.callLogin('V1/FuncForDrAppToToggleBookmarkPost', 'post', params, signupDetails.accessToken, 'savepostData');
        setLogEvent("bookmark", { userGuid: signupDetails.UserGuid, "postId": postId, screen: "comments" })
        // let params = {
        //     "UserGuid": "91B118F2-A60F-4502-B40B-007D2DE3EB9B",
        //     "Version": null,
        //     "Data": {
        //         "PostGuid": "85D99F9B-BF3E-EB11-A607-0003FF91555B",
        //         "BookmarkGuid": null,
        //         "CommentGuid": null,
        //         "LikeGuId": null,
        //         "ShareGuId": null,
        //         "PostComment": null
        //     }
        // }
        // actions.callLogin('V1/FuncAppForPushUserPostBookMark', 'post', params, signupDetails.accessToken, 'savepost');
    }
    const toggleModal = () => {
        //alert('dfds')
        setIsModalVisible(!isModalVisible)
    };
   const ageCalculateForShare = (incomingDate) =>{
       let str = '';
	   let tempNotificationDate = '';
		if (incomingDate) {
			 tempNotificationDate = Moment(incomingDate).format('DD MMM YY');
		}
		return tempNotificationDate;

}


    const ageCalculate = (incomingDate) => {
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

    const getNamechar = (fname, lname) => {
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

    const clickOnLike = (postId,isThanks) => {
        let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
            "Data": {
                "postGuid": postGuid,
                "commentGuid": commentGuid ? commentGuid : null,
                "replyGuid": replyGuid === '' ? null : replyGuid,
                "IsLike": isThanks
            }
        }
        actions.callLogin('V1/FuncForDrAppToSaveUpdateThanks', 'post', params, signupDetails.accessToken, 'likeSaveInComment');
        setLogEvent(replyGuid != "" ? "comment_like" : "like", { userGuid: signupDetails.UserGuid, "postId": postId, screen: "Comment", likeStatus: isThanks })
    }

    const clickOnShare = (item) => {
      
          //Anup
          setshowPostShareModal(true)
					setTimeout(() => {
                        viewShotRef.current.capture().then((uri) => {
                           // setshowPostShareModal(false)
							RNFS.readFile(uri, 'base64').then((res) => {
								urlString = 'data:image/jpeg;base64,' + res;
                                let options = {
                                    subject: '',
                                    message: '',
                                    url: urlString,
                                    type: 'image/jpeg',
                                };
                            
                            Share.open(options)
                                .then((res) => {
                                    setshowPostShareModal(false)
                                
                                })
                                .catch((err) => {
                                    setshowPostShareModal(false)
                                });

							});
						});
					}, 800);
        //for share
					// setTimeout(() => {
					// 	let options = {
					// 			subject: '',
					// 			message: '',
					// 			url: urlString,
					// 			type: 'image/jpeg',
					// 		};
						
					// 	Share.open(options)
					// 		.then((res) => {
                    //             setshowPostShareModal(false)
							
					// 		})
					// 		.catch((err) => {
                    //             setshowPostShareModal(false)
					// 		});
					// }, 1200);
                  
        setTimeout(() => {
            let params = {
                "UserGuid": signupDetails.UserGuid,
                "DoctorGuid": signupDetails.doctorGuid,
                "ClinicGuid": "",
                "data": {
                    "postGuid": postGuid,
                    "shareGuid": ""
                }
            }
            actions.callLogin('V1/FuncForDrAppToSaveUpdateSharePost', 'post', params, signupDetails.accessToken, 'shareSaveUpdate');
        }, 500);
    }

    const getDesc = (val, from) => {
        let returnStr = val;
        if (val.indexOf("\r\n\r\nSource:")) {
            let str = val.split("\r\n\r\nSource:");
            if (from === 0) {
                returnStr = str[0];
            } else
                returnStr = str[1];
        }
        // else if(from==0){
        // 	returnStr=val;
        // }
        return returnStr ? returnStr.trim() : returnStr;
    }

    const onBuffer = (e) => {
        //console.log("buffering" + e)
    }

    const videoError = (e) => {
        //console.log("videoError" + e)
    }

    const _renderCustomSlider = ({ item, index }) => {
        return (
            <View style={{ flex: 1, height: responsiveHeight(30), alignItems: 'center', justifyContent: 'center', }}>
                {item.mediaAttachmentType == 'image' ? <TouchableOpacity onPress={() => {
                    selectedImageUrl = item.mediaAttachmentUrl;
                    setIsModalVisible(true);
                }}>
                    <Image source={{ uri: item.mediaAttachmentUrl }} style={{resizeMode  :'stretch', width: responsiveWidth(100), height: responsiveHeight(30) }} />
                </TouchableOpacity> : <View style={{ height: responsiveHeight(32), width: responsiveWidth(70), alignItems: 'center', justifyContent: 'center', backgroundColor: Color.grayTxt, borderRadius: 10 }}>
                    {/* <Video source={{ uri: item.mediaAttachmentUrl }}
                        // ref={(ref) => { player = ref }}
                        paused={playPause}
                        resizeMode="cover"                                  // Store reference
                        onBuffer={onBuffer}                // Callback when remote video is buffering
                        onError={videoError}               // Callback when video cannot be loaded
                        style={{ height: responsiveHeight(26), width: responsiveWidth(70), margin: 0, padding: 0 }}
                        onLoad={() => {
                            //this.setState({showLoading:true})
                        }}
                        onEnd={() => {
                            //alert('hh')
                            //this.setState({showLoading:false})
                        }}
                    /> */}
                    {showLoading ? <ActivityIndicator
                        size="large"
                        color={Color.primary}
                        style={{
                            position: "absolute",
                            alignSelf: "center"
                        }}
                    /> : <TouchableOpacity style={{ position: 'absolute', top: responsiveHeight(14), left: responsiveWidth(30) }} onPress={() => {
                        setPlayPause(!playPause)
                    }} >
                        <Image source={playPause ? play : pause} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />
                    </TouchableOpacity>}


                </View>}

            </View>

        );
    }

    const replyItem = (item, index, commntGuid) => {
        return (
            <View style={{ marginStart: responsiveWidth(10), marginTop: 7, marginEnd: 14, padding: 0 }}>
                <View style={{ flexDirection: 'row' }}>
                    {/* <View style={{ height: 24, width: 24, borderRadius: 10, backgroundColor: Color.skyBlue }}>
                        <Image style={{}} />
                    </View> */}
                    <View style={[styles.profileRoundImgCommunity, { height: 32, width: 32, borderRadius: 16 }]} >
                        {item.replyAuthorImageUrl != null && item.replyAuthorImageUrl != '' ? <Image source={{ uri: item.replyAuthorImageUrl }} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), borderRadius: responsiveFontSize(2) }} />
                            : <Text style={{ fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: Color.profileImageText, fontWeight: CustomFont.fontWeight500 }}>{getNamechar(item.replyAuthorFirstName, item.replyAuthorLastName)}</Text>}
                    </View>
                    <View style={{ marginStart: 12, flex: 1, }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, color: Color.yrColor }}>
                                    {item.replyAuthorPrefix + " " + item.replyAuthorFirstName + " " +
                                        item.replyAuthorMiddleName + " " + item.replyAuthorLastName}</Text>
                                <Text style={styles.speciality}>{item.replyAuthorSpeciality}</Text>
                            </View>
                            <Text style={styles.age}>{ageCalculate(item.repliedOn)}</Text>
                        </View>
                        <Text style={{ marginTop: responsiveWidth(1.5), fontSize: CustomFont.font12, color: Color.yrColor, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, }}>{item.replyText}</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 16 }}>
                            <TouchableOpacity onPress={() => {
                                setLike(item, commntGuid, 3)
                            }}>
                                <Image style={[styles.likeIcon, { marginEnd: responsiveWidth(1) }]} source={item.thanks.isThanks ? like_done : like_0} />
                            </TouchableOpacity>

                            <Text onPress={() => {
                                if (item.thanks.thanksCount != "0") getLikeList(commntGuid, item.replyGuid)
                            }} style={{ paddingStart: responsiveWidth(1), paddingEnd: responsiveWidth(1), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: Color.optiontext, }} >{item.thanks.thanksCount}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const renderItem = (item, index) => {
        let guid = item.commentGuid;
        return (
            <View style={{ backgroundColor: Color.white, marginBottom: 8, borderRadius: 10, padding: 16 }}>
                <View style={{ marginTop: 7 }}>
                    <View style={{ flexDirection: 'row', }}>
                        {/* <View style={{ height: 24, width: 24, borderRadius: 10, backgroundColor: Color.weekdaycellPink }}>
                        <Image style={{}} />
                    </View> */}
                        <View style={[styles.profileRoundImgCommunity, { height: 32, width: 32 }]} >
                            {item.commentAuthorImageUrl ? <Image source={{ uri: item.commentAuthorImageUrl }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                                : <Text style={{ fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: Color.profileImageText, fontWeight: CustomFont.fontWeight500 }}>{getNamechar(item.commentAuthorFirstName, item.commentAuthorLastName)}</Text>}
                        </View>
                        <View style={{ marginStart: 12, flex: 1 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, marginStart: 0 }}>
                                    <Text style={{ fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, color: Color.yrColor }}>
                                        {item.commentAuthorPrefix + " " + item.commentAuthorFirstName + " " +
                                            item.commentAuthorMiddleName + " " + item.commentAuthorLastName}</Text>
                                    <Text style={styles.speciality}>{item.commentAuthorSpeciality}</Text>
                                </View>
                                <Text style={styles.age}>{ageCalculate(item.commentedOn)}</Text>
                            </View>
                            <Text style={{ marginTop: responsiveWidth(1.5), fontSize: CustomFont.font12, color: Color.yrColor, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, }}>{item.commentText}</Text>
                            <View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 0, alignItems: 'center' }}>
                                {/* <View style={{ flex: 1 }} /> */}
                                <TouchableOpacity onPress={() => {
                                    setLike(item, item.commentGuid, 2)
                                }} style={{ flexDirection: 'row' }} >
                                    <Image style={[styles.likeIcon, { marginEnd: responsiveWidth(1) }]} source={item.thanks.isThanks ? like_done : like_0} />
                                </TouchableOpacity>
                                <Text onPress={() => { if (item.thanks.thanksCount != "0") getLikeList(item.commentGuid, null) }} style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.optiontext, paddingStart: responsiveWidth(1), paddingEnd: responsiveWidth(1), }}>{item.thanks ? item.thanks.thanksCount : null}</Text>
                                <TouchableOpacity onPress={() => {
                                    commentGuid = item.commentGuid;
                                    setReplyDrName(item.commentAuthorFirstName)
                                }} style={{ flexDirection: 'row', marginStart: 16 }}>
                                    <Image style={styles.likeIcon} source={ReplyIcon} />
                                    <Text style={{ marginLeft: responsiveWidth(2), fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.optiontext, marginRight: responsiveWidth(8) }}>Reply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                    </View>

                </View>
                {
                    item.replyThreads == null || item.replyThreads.length == 0 ? null :
                        <View style={{ marginTop: 10, height: 1, backgroundColor: Color.shadowBg, opacity: 0.6 }} />
                }
                <FlatList
                    data={item.replyThreads}
                    ItemSeparatorComponent={separatorTag}
                    renderItem={({ item, index }) => replyItem(item, index, guid)} />
                {
                    item.replyThreads == null || item.replyThreads.length == 0 ? null :
                        <View style={{ marginTop: 10, height: 1, backgroundColor: Color.shadowBg, opacity: 0.6 }} />
                }
            </View >
        )
    }

    const separatorTag = () => {
        return <View style={{ height: 1, backgroundColor: Color.createInputBorder, opacity: 0.6, marginTop: 7 }} />;
    };

    const renderSeparatorTag = () => {
        return <View style={{ marginTop: 10, height: 1, backgroundColor: Color.shadowBg, opacity: 0.6 }} />;
    };

    const clearCommentReply = () => {
        replyGuid = ''
        setReplyDrName("")
        commentGuid = null
    }

    const setLike = (item, commntGuid, type) => {
        clearCommentReply()
        item.thanks.isThanks = !item.thanks.isThanks;
        if (item.thanks && !item.thanks.thanksCount)
            item.thanks.thanksCount = 0;

        let thanksCount = parseInt(item.thanks.thanksCount)
        item.thanks.thanksCount = item.thanks.isThanks ? thanksCount + 1 : thanksCount - 1;
        if (commntGuid != null) commentGuid = commntGuid;

        if (type == 3 || type == 2) {
            if (type == 3) replyGuid = item.replyGuid;
            setPostList(postList)
        } else {
            setDataArray(dataArray)
        }
        clickOnLike(item.postGuid,item.thanks.isThanks)
    }

    const countChange = (count) => {
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

    return (
        <SafeAreaView style={CommonStyle.safeArea}>
            <View style={styles.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
                <NavigationEvents onDidFocus={() => { getData() }} />
                {/* <Loader ref={refs} /> */}
                <Toolbar
                    title={""}
                    isOpenSavePost={true}
                    onOpenSavePost={() => props.navigation.navigate('SavedPost')}
                    onBackPress={() => {
                        readPost()
                        setTimeout(()=>{
                            props.navigation.goBack();
                        },1000)
                        
                    }} />
                <View >
                    { !item ? null :
                            <View>
                                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null}>
                                <ScrollView style={{ marginBottom: replyDrName === '' ? responsiveHeight(2) : responsiveHeight(2) }}>
                                    <View>
                                        <View style={{ marginStart: 0 }}>
                                            <Post
                                                item={item}
                                                onSetLike={() => { setLike(item, commentGuid, 2) }}
                                                onSave={() => {
                                                    item.isPostSaved = !item.isPostSaved;
                                                    setDataArray(dataArray)
                                                    clickOnSavePost(item.postGuid, item.isPostSaved)
                                                }}
                                                isComment={true}
                                                onLikeList={() => {
                                                    getLikeList(null, null)
                                                }}
                                                onViewList={() => {
                                                    getViewList()
                                                }}
                                                onShare={() => {
                                                    clickOnShare(item)
                                                }}
                                                onComment={() => {
                                                    commentGuid = null;
                                                    setReplyDrName('')
                                                }}
                                                onReadMore={() => { this.props.nav.navigation.navigate('Comments', { item: item, from: '' }) }}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                renderItem={({ item, index }) => renderItem(item, index)}
                                                data={postList}
                                                style={{ marginTop: 10, marginStart: 16, marginEnd: 16,marginBottom:responsiveHeight(7) }}
                                            />
                                        </View>

                                        <View style={{ backgroundColor: Color.white, width: responsiveWidth(102), bottom: 50, borderTopStartRadius: 20, borderTopEndRadius: 20, marginBottom: -10, marginLeft: -3 }}>
                                   
                                    <View>
                                        {replyDrName && commentGuid ? <Text style={{ marginStart: 20, marginTop: 2, fontSize: 12, color: '#212B36', fontFamily: CustomFont.fontName }}>Replying to <Text style={{ fontWeight: 'bold' }}>{"Dr. " + replyDrName}</Text></Text>:null}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginStart: 10 }}>
                                            <View style={[styles.profileRoundImgCommunity, , { height: 32, width: 32, borderRadius: 16 }]} >
                                                {signupDetails.profileImgUrl ? <Image source={{ uri: signupDetails.profileImgUrl }} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), borderRadius: responsiveFontSize(2) }} />
                                                    : <Text style={{ fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: Color.profileImageText, fontWeight: CustomFont.fontWeight500 }}>{getNamechar(signupDetails.fname, signupDetails.lname)}</Text>}
                                            </View>
                                            <View style={{ flex: 1, marginTop: 12, marginBottom: responsiveHeight(2), borderColor: Color.borderColor, borderWidth: 1, borderRadius: 5, marginStart: 12, marginEnd: 12 }}>
                                                <TextInput returnKeyType="done"
                                                    onChangeText={onChangeText}
                                                    placeholderTextColor = {Color.placeHolderColor}
                                                    value={text}
                                                    // autoFocus={true}
                                                    style={{ marginStart: 10, marginEnd: 0, height: responsiveHeight(6),color:Color.fontColor }}
                                                    placeholder="Add a comment" />
                                            </View>
                                            <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => {
                                                onChangeText('');
                                                if (text)
                                                    postComment();
                                                else
                                                    Snackbar.show({ text: 'Please write something', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                                            }}>
                                                <Image style={{ height: 24, width: 24, marginEnd: 16 }} source={text && text.length ? SendBlueIcon : SendIcon} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                    </View>
                                </ScrollView>
</KeyboardAvoidingView>
                                
                            </View>
                    }
                </View>
                <Modal
                    animationType="slide"
                    visible={isModalVisible}
                    onRequestClose={() => {
                        setIsModalVisible(false)
                    }}
                    style={{ backgroundColor: Color.black }} >
                    <View style={{ flex: 1, backgroundColor: Color.black, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: responsiveHeight(10), right: 10, zIndex: 999, alignItems: 'flex-end' }} onPress={() => setIsModalVisible(false)}>
                        <Image source={cross_white} style={{height:responsiveFontSize(2.6),width:responsiveFontSize(2.6),resizeMode:'contain',padding:responsiveHeight(1)}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: responsiveHeight(10), left: 0, zIndex: 999, alignItems: 'flex-end' }} onPress={makeDownload}>
                        <Image source={download} style={{height:responsiveFontSize(2.6),width:responsiveFontSize(2.6),resizeMode:'contain',padding:responsiveHeight(1)}}/>
                        </TouchableOpacity>

                        <ImageZoom cropWidth={responsiveWidth(100)}
                            cropHeight={responsiveHeight(100)}
                            imageWidth={responsiveWidth(100)}
                            imageHeight={responsiveHeight(100)}
                            panToMove={false}
                            enableSwipeDown='y'
                            pinchToZoom='y'>
                            <Image source={{ uri: selectedImageUrl }} style={{ marginTop: 30, marginBottom: 30, width: responsiveWidth(100), height: responsiveHeight(100), resizeMode: 'contain' }} />
                        </ImageZoom>
                    </View>
                </Modal>
                <Modal1 isVisible={isThanksListOpen}>
                    <View style={[styles.modelViewMessage, { paddingTop: 25, height: responsiveHeight(70) }]}>
                        <View style={{ flexDirection: 'row', paddingStart: 20, paddingEnd: 20 }}>
                            <Text style={{ flex: 1, color: Color.primary, fontSize: CustomFont.font18 }}>People Who Reacted</Text>
                            <TouchableOpacity onPress={() => setIsThanksListOpen(false)}>
                                <Image style={styles.crossIcon} source={CrossIcon} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={thanksListArray}
                            style={{ marginTop: 20, height: 10 }}
                            renderItem={({ item, index }) => {
                                return (<View style={{
                                    paddingTop: 10, paddingBottom: 10, paddingStart: 20, paddingEnd: 20, backgroundColor: Color.bgColor,
                                    alignItems: 'center', flexDirection: 'row', marginTop: 0, marginBottom: 10, marginEnd: 8
                                }}>
                                    {item.memberImageUrl ? <Image source={{ uri: item.memberImageUrl }}
                                        style={{ marginRight: responsiveWidth(3), marginTop: 2, height: responsiveWidth(6), width: responsiveWidth(6), borderRadius: responsiveWidth(1) }} /> :
                                        <View style={{ marginRight: responsiveWidth(3), height: responsiveWidth(8), width: responsiveWidth(8), borderRadius: responsiveWidth(3), backgroundColor: Color.liveBg, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: CustomFont.font12, color: '#FFF' }}>{nameFormat(item.memberName)}</Text>
                                        </View>
                                    }

                                    <View style={{ flex: 1, marginStart: 0 }}>
                                        <Text style={{ fontSize: CustomFont.font16,color:Color.fontColor }}>{item.memberName}</Text>
                                        <Text style={{ fontSize: CustomFont.font12,color:Color.fontColor }}>{item.memberSpeciality}</Text>
                                    </View>
                                </View>)
                            }}
                        />
                    </View>
                </Modal1>

                <Modal1 style={{height: '100%',width:'100%',margin: 0,backgroundColor: '#F6F1FC' }} isVisible={showPostShareModal}>
							<ScrollView showsVerticalScrollIndicator={false}><ViewShot
								snapshotContentContainer={true}
								style={{
									backgroundColor: '#F6F1FC',
									height: '100%',width:'100%'}}
                                    ref={viewShotRef}
								//ref="viewShot"
								// captureMode = "mount"
								// onCapture = {this.callOnCapture}
								options={{ format: 'jpg', quality: 1 }}>
								<View>
									<Image source={{ uri: postImageUrl }} style={{  marginLeft : responsiveWidth(3), marginRight : responsiveWidth(3), borderRadius : 8, width: responsiveWidth(92), height: responsiveHeight(25), resizeMode:'stretch'}} />
									
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
										textAlign  :'left',
										fontSize: CustomFont.font20,
									    marginTop: responsiveHeight(.1),
									}}>{postShareTitle}</Text>
										<Text style = {{ marginTop  :responsiveHeight(1), lineHeight : responsiveHeight(3), fontFamily  :CustomFont.fontName, fontSize : CustomFont.font14 ,color:Color.fontColor}}>{postDescrip}</Text>
									</View>
									</View>
									<View style={{
										backgroundColor: Color.white,
										width: responsiveWidth(100),
										//height: responsiveHeight(5),
										padding: responsiveWidth(4),
										marginBottom : 0,
										justifyContent : 'center',
										alignItems  :'center',
										flexDirection  :'row'
 
									}}>
									<View style = {{ flex : 1, flexDirection : 'row',
										alignItems  :'center'}}> 
										<Image style = {{height  : responsiveHeight(3), width : responsiveHeight(3), resizeMode : 'contain'}} source = {LogoIcon}/>
									<Text style = {{marginLeft : 10, fontSize : CustomFont.font14, fontFamily  :CustomFont.fontName, color : Color.optiontext}}>DrOnA Health</Text>
									</View>

									<View style = {{flex : 1,   flexDirection : 'row',
										alignItems  :'flex-end'}}> 
										<Text style={{marginLeft  : 10, color  : Color.datecolor, fontWeight : CustomFont.fontWeight400, fontSize:CustomFont.font12}}>{postAuthorName},</Text>	
										<Text style={{ textAlign : 'right', marginLeft  : 0, color  : Color.datecolor,  fontWeight : CustomFont.fontWeight400, fontSize:CustomFont.font12}}> {postTime ? ageCalculateForShare(postTime): ''}</Text>
										{/* <Text style={{ textAlign : 'right', marginLeft  : 0, color  : Color.datecolor,  fontWeight : CustomFont.fontWeight400, fontSize:CustomFont.font12}}> {this.state.postTime}</Text> */}
									</View>
									</View>
							</ViewShot></ScrollView>
						</Modal1>


            </View>
        </SafeAreaView>
    );
}
// export default AboutUs
const mapStateToProps = state => ({
    signupDetails: state.signupReducerConfig.signupDetails,
    responseData: state.apiResponseDataConfig.responseData,
    loading: state.apiResponseDataConfig.loading,
});
const ActionCreators = Object.assign({}, apiActions, signupActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch), });
export default connect(mapStateToProps, mapDispatchToProps,)(Comments);
