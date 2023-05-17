import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform, Modal, PermissionsAndroid, ActivityIndicator, FlatList, Linking
} from 'react-native';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import comment_0 from '../../../../assets/comment_0.png';
import like_0 from '../../../../assets/like_0.png';
import like_done from '../../../../assets/like_done.png';
import pick_0 from '../../../../assets/pick_0.png';
import save_fill from '../../../../assets/save_fill.png';
import save_gray from '../../../../assets/save_gray.png';
import share_0 from '../../../../assets/share_0.png';
import play from '../../../../assets/play.png';
import pause from '../../../../assets/pause.png';
import cross_white from '../../../../assets/cross_white.png';
import download from '../../../../assets/download.png';
import Moment from 'moment';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import styles from './style';
import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';
//import Video from 'react-native-video';


let selectedImageUrl = '';
const Post = (props) => {
    let item = props.item
    const [activeSlide, setActiveSlide] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [playPause, setPlayPause] = useState(true)
    const [showLoading, setShowLoading] = useState(false)


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
    const ageCalculate1 = (incomingDate) => {
        let str = '';
        str = Moment(incomingDate).fromNow(true);
        return str;
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

    const makeDownload = async () => {
        setIsModalVisible(false)
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
                    // Once user grant the permission start downloading
                    downloadImage();
                } else {
                    // If permission denied then show alert
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                alert('Please select a file to download')
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

    const _renderCustomSlider = ({ item, index }) => {
        return (
            <View style={{ flex: 1, height: responsiveHeight(28), alignItems: 'center' }}>
                {item.mediaAttachmentType == 'image' ? <TouchableOpacity onPress={() => {
                    selectedImageUrl = item.mediaAttachmentUrl;
                    setIsModalVisible(true);
                }}>
                    <Image source={{ uri: item.mediaAttachmentUrl }} style={{ alignSelf: 'center', width: responsiveWidth(84), height: responsiveHeight(25), resizeMode: 'stretch', }} />
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

    return (
        <View>
            <View style={{ marginLeft: responsiveWidth(3.5), marginRight: responsiveWidth(4), marginTop: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10 }}>
                <View style={{ margin: responsiveWidth(5), marginBottom: responsiveWidth(7), }}>
                    <View style={{ alignItems: 'center', height: responsiveHeight(28) }}>
                        {item.mediaAttachment && item.mediaAttachment.length > 0 ?
                            <Text style={{ position: 'absolute', top: 10, right: 10, zIndex: 999, backgroundColor: Color.black, color: Color.white, fontSize: CustomFont.font12, padding: 2, paddingLeft: 7, paddingRight: 7, borderRadius: 7 }}>{activeSlide + 1 + '/' + item.mediaAttachment.length}</Text>
                            : null}
                        {item.mediaAttachment && item.mediaAttachment.length > 0 ?
                            // <SliderBox
                            // 	images={item.mediaAttachment}
                            // 	onCurrentImagePressed={index => {
                            // 		// 	selectedImageUrl = item.postAttachment[index].attachmentUrl;
                            // 		this.setState({ isModalVisible: true });
                            // 	}}
                            // 	currentImageEmitter={index => this.setState({ selectedPos: 0 + '/' + item.mediaAttachment.length })}
                            // /> :
                            //null
                            <Carousel layout={'default'}
                                // ref={(c) => {
                                //     this._carousel = c;
                                // }}
                                //style={{ position: 'absolute' }}
                                data={item.mediaAttachment}
                                renderItem={_renderCustomSlider}
                                sliderWidth={responsiveWidth(92)}
                                itemWidth={responsiveWidth(92)}
                                onSnapToItem={(index) => setActiveSlide(index)}
                            />
                            : null
                        }
                        {item.mediaAttachment && item.mediaAttachment.length ? <Pagination
                            dotsLength={item.mediaAttachment.length}
                            activeDotIndex={activeSlide}
                            containerStyle={{ zIndex: 999, marginTop: responsiveHeight(-10.5) }}
                            dotStyle={{ height: responsiveFontSize(1.2), width: responsiveFontSize(1.2), borderRadius: responsiveFontSize(.6) }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={1}
                        // carouselRef={this._carousel}
                        // tappableDots={!!this._carousel} 
                        /> : null}

                    </View>
                    <Text style={{ fontFamily: CustomFont.fontNameBold, fontWeight: 'bold', fontSize: CustomFont.font18, color: Color.text1, marginTop: responsiveHeight(.5), marginRight: responsiveWidth(5) }}>{item.postTitle}</Text>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(1.8), alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font12, color: Color.text3 }}>By {(item.authorFirstName + ' ' + item.specialityName).replace('  ', " ").replace(null, "")}, {Moment(item.postDateTime).format('DD MMM YY')}</Text>
                            <Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.patientSearchHolder, marginLeft: 5, textAlign: 'center' }}>• 2 min read</Text>
                        </View>

                        <TouchableOpacity onPress={props.onSave}>
                            <Image source={item.isPostSaved ? save_fill : save_gray} style={{ height: 24, width: 24, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ textAlign: 'justify', fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.8), opacity: 1, color: Color.yrColor, lineHeight: responsiveHeight(3.5) }}>{getDesc(item.postDescription, 0)}</Text>
                    {item.postDescription && item.postDescription.indexOf("\r\n\r\nSource:") > -1 ? <TouchableOpacity onPress={() => Linking.openURL(getDesc(item.postDescription, 1))} style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Text style={{ fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(.6), marginBottom: responsiveHeight(2), fontWeight: 'bold' }} >Source: </Text>
                        <View style={{ flexShrink: 1 }}>
                            <Text style={{ fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font14, color: Color.primary, marginTop: responsiveHeight(.6), textAlign: 'justify' }} >{getDesc(item.postDescription, 1)}</Text>
                        </View>

                    </TouchableOpacity> : null}

                    <View style={{ paddingBottom: responsiveHeight(1), flexDirection: 'row', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(1), marginLeft: responsiveHeight(0), borderBottomColor: Color.grayTxt, borderBottomWidth: 0.5 }}>
                        <View style={{ flex: 3, flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: responsiveWidth(2.5) }} onPress={props.onLikeList}>
                                <Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.thanks ? countChange(item.thanks.thanksCount) : '0'} Likes</Text>
                            </TouchableOpacity>
                            <Text style={{ paddingTop: 6, flexDirection: 'row', marginLeft: responsiveWidth(1), fontStyle: 'italic', fontSize: 6, fontFamily: CustomFont.fontName, color: Color.grayTxt, }}>0</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                                <Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(1) }}>{item.comment ? countChange(item.comment.commentCount) : '0'} Comments</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 3 }}>
                            <Text></Text>
                        </View>
                        <View style={{ flex: 3, flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: responsiveWidth(1.5) }} onPress={props.onViewList}>
                                <Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.view ? countChange(item.view.viewCount) : 0} Views</Text>
                            </TouchableOpacity>
                            <Text style={{ paddingTop: 7, flexDirection: 'row', fontStyle: 'italic', fontSize: 6, fontFamily: CustomFont.fontName, color: Color.grayTxt, }}>0</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: responsiveWidth(0) }}>
                                <Text style={{ fontStyle: 'italic', fontSize: CustomFont.font10, fontFamily: CustomFont.fontName, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{item.share ? countChange(item.share.shareCount) : '0'} Shares</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: responsiveHeight(1), marginBottom: responsiveHeight(0), marginLeft: responsiveHeight(.5), marginRight: responsiveHeight(.5), }}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: responsiveWidth(2.5) }} onPress={props.onSetLike}>
                                {/* <Icon type="FontAwesome" name='thumbs-up' style={{ fontSize: responsiveFontSize(1.8), color: item.islike ? Color.primary : Color.fontColor }} /> */}
                                <Image source={item.thanks.isThanks ? like_done : like_0} style={styles.likeIcon} />
                                <Text style={styles.likeTxt}>Like</Text>
                                {/* <Text style={{ fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, color: item.thanks.isThanks ? Color.primary : Color.fontColor, marginLeft: responsiveWidth(2) }}>Thanks</Text> */}
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                                        onPress={() => { this.setState({ likeListPopup: true }); getLikeList(item.postGuid) }}>
                                                        <Text>...</Text></TouchableOpacity> */}
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={props.onComment}>
                                <Image source={comment_0} style={styles.likeIcon} />
                                {/* <Icon type="FontAwesome" name='bookmark' style={{ fontSize: responsiveFontSize(1.8), color: item.isPostSave ? Color.primary : Color.fontColor }} /> */}
                                <Text style={styles.likeTxt}>Comment</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={props.onShare} style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: responsiveWidth(0.5) }}>
                                <Image source={share_0} style={styles.likeIcon} />
                                {/* <Icon type="FontAwesome" name='comment' style={{ fontSize: responsiveFontSize(2), color: Color.fontColor }} /> */}
                                <Text style={styles.likeTxt}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>







                </View>

            </View>
            <Modal
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false)
                }}
                style={{ backgroundColor: Color.black, marginBottom: Platform.OS == 'ios' ? responsiveHeight(-3.5) : responsiveHeight(-4.5) }} >
                <View style={{ flex: 1, backgroundColor: Color.black, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: Platform.OS == 'android' ? responsiveHeight(4) : responsiveHeight(10), right: 0, zIndex: 999, alignItems: 'flex-end' }} onPress={() => setIsModalVisible(false)}>
                        <Image source={cross_white} style={{ height: responsiveFontSize(3.6), width: responsiveFontSize(3.6), resizeMode: 'contain', margin: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: responsiveWidth(15), position: 'absolute', top: Platform.OS == 'android' ? responsiveHeight(4) : responsiveHeight(10), left: 0, zIndex: 999, alignItems: 'flex-end' }} onPress={makeDownload}>
                        <Image source={download} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), resizeMode: 'contain', margin: 10 }} />
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
        </View>
    )
}
export default Post