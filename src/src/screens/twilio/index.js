import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text, TouchableOpacity,
  PermissionsAndroid,
  Platform, Image, BackHandler
} from 'react-native';

import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc';
import KeepAwake from 'react-native-keep-awake';
import Color from '../../../src/components/Colors';
import CustomFont from '../../../src/components/CustomFont';

import styles from './style.js'
import cross_white from '../../../assets/cross_white.png';
import mike_off from '../../../assets/mike_off.png';
import mike_on from '../../../assets/mike_on.png';

import video_off from '../../../assets/video_off.png';
import video_on from '../../../assets/video_on.png';
import error from '../../../assets/error.png';
import minimize_video from '../../../assets/minimize_video.png';

import mic_minimize from '../../../assets/mic_minimize.png';
import mic_off_minimize from '../../../assets/mic_off_minimize.png';
import video_minimize from '../../../assets/video_minimize.png';
import video_off_minimize from '../../../assets/video_off_minimize.png';
import dentist_complete from '../../../assets/dentist_complete.png';
import close from '../../../assets/close.png';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setApiHandle } from "./ApiHandleTwilio";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import Tooltip from 'react-native-walkthrough-tooltip';

import NetInfo from "@react-native-community/netinfo";
import { measureConnectionSpeed } from 'react-native-network-bandwith-speed';
let isCallConnected = false;
import Moment from 'moment';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from 'react-native-encrypted-storage';
let interval=null;
let openModalFlag = 0 ,tokenTwilio='',chanelNameTwilio='';
const App = (props) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isLoudSpeaker, setIsLoudSpeaker] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState('');
  const [chanelName, setChanelName] = useState('');
  const twilioRef = useRef(null);
  const refs = useRef(null)
  const [patientName, setPatientName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [sortName, setSortName] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [statusVideoStop, setStatusVideoStop] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [isModalForNetworkQuality, setIsModalForNetworkQuality] = useState(false);
  const [isModalVideoComplete, setIsModalVideoComplete] = useState(false);

  const getToken = async () => {
    //let { signupDetails } = props;
    try {
        if(!tokenTwilio) {
        let { actions, signupDetails } = props;
        let params = {
          "UserGuid": signupDetails.UserGuid,
          Data: {
            appointmentGuid: signupDetails.appoinmentGuid 
          }
        }
        actions.callLogin('V1/FuncForDrAppToGetJwtTokenForVideoCall', 'post', params, signupDetails.accessToken, 'twilio');
      }
      else{
        _onConnectButtonPressValidation();
      }
    }  catch (e){
      console.error(e);
    }
  }
  useEffect(() => {
    openModalFlag = 0;
    tokenTwilio=''
     interval = setInterval(() => {
      try {
        measureConnectionSpeed().then((NetworkBandwidthTestResults)=>{
          //console.log('----timer--'+NetworkBandwidthTestResults.speed);
          if(NetworkBandwidthTestResults.speed < 1 && openModalFlag==0){
            openModalFlag=1;
            setIsModalForNetworkQuality(true)
            clearInterval(interval);
          }
          
        }).catch(e=>console.log(e));
      } catch (err) {
      }

    }, 3000);

    return () => {
      clearInterval(interval);
     }

  }, []);

  useEffect(() => {
    let item = props.nav.item;
    if (item) {
      setApiHandle(handleApi, props)
      setPatientName(item.patientName.replace('  ', ' '))
      setGender(item.gender == 'Male' ? 'M' : 'F')
      setAge(item.age)
      try {
        let name = item.patientName;
        if (name) {
          setSortName(nameFormat(name));
        }
      } catch (error) {
      }
      setScheduleTime(item.appointmentStartTime);
    }
    if (!props.nav.isFullScreenVideo) {
      setTimeout(() => {
        //_onConnectButtonPress();
        //twilioRef.current.connect({ accessToken: DRONA.getTwilioToken(), roomName: DRONA.getRoomName(), enableVideo: isVideoEnabled, enableAudio: isAudioEnabled });
        setStatus('connected');
      }, 2000);
      //isCallConnected = true;
      setStatus('disconnected');
    }
    //console.log('---------'+props.nav.hardWareBackEvent);
    if (props.nav.hardWareBackEvent) {
      _onEndButtonPress();
    }

  }, [props.responseData]);
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
    return str.toUpperCase()
  }
 const handleApi =  async (response, tag) => {
    if (tag === 'twilio') {
      let { signupDetails } = props;
      try {
        // setChanelName(response.channelName);
        // setToken(response.token);
        tokenTwilio=response.token;
        chanelNameTwilio=response.channelName;
        setTimeout(()=>{
          _onConnectButtonPressValidation();
        },1000)
        
      }
      catch (e){
        console.error(e);
      }
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    // for unmount
    return function cleanUp() {
      backHandler.remove();
    }
  });

  const handleBackPress = () => {
    if (status == 'disconnected') {
      props.Refresh('cross');
      KeepAwake.deactivate();
    } else {
      setIsModalVisible(true)
    }
    //clearInterval(interval);
    return true;
  }

  const _onConnectButtonPressValidation = async () => {
    let callStartTime=props.nav.item.appointmentStartTime;
    let callEndTime=props.nav.item.appointmentEndTime;

    let chkIn = Moment(callStartTime, ["h:mm A"]).format("HH:mm") // 24 hrs
    let chkOut = Moment(callEndTime, ["h:mm A"]).format("HH:mm")

    var startCallDateFormat =props.nav.date +' '+chkIn;// "2017-04-14 23:07:15"; 
    var endCallDateFormat =props.nav.date +' '+chkOut; 
var endCall8HrsLaterInMilisecond = Moment(startCallDateFormat).add(8, 'hours').valueOf();

var startCallInMilisecond = Moment(startCallDateFormat).valueOf();

        var slotStartBefore5minTime = Moment(callStartTime, 'hh:mm A').subtract(5, "minutes").format('hh:mm A');

    if(Moment().isBefore(startCallInMilisecond-300000)){ // 5 min in milisecond
      Snackbar.show({ text: 'You can join/start your consultation at '+slotStartBefore5minTime, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
    }else if(Moment().isAfter(endCall8HrsLaterInMilisecond)){
      Snackbar.show({ text: 'Your consultation link has expired.' , duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
    }else{
    _onConnectButtonPress();
      setToolTipVisible(true)
    }
    
  }
  const _onConnectButtonPress = async () => {
    KeepAwake.activate();
    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'DrOnADoctor App Camera Permission',
          message: 'DrOnADoctor App needs access to your camera',
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission Granted

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'DrOnADoctor App Record Permission',
            message: 'DrOnADoctor App needs access to your microphone',
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          twilioRef.current.connect({ accessToken: tokenTwilio, roomName: chanelNameTwilio, enableVideo: isVideoEnabled, enableAudio: isAudioEnabled });
          //twilioRef.current.connect({ accessToken: DRONA.getTwilioToken(), roomName: DRONA.getRoomName(), enableVideo: isVideoEnabled, enableAudio: isAudioEnabled });
          setStatus('connecting');

        } else {
          // Permission Denied
          alert('CAMERA Permission Denied');
        }

        //

      } else {
        // Permission Denied
        alert('CAMERA Permission Denied');
      }
    }
    else {
      twilioRef.current.connect({ accessToken: tokenTwilio, roomName: chanelNameTwilio, enableVideo: isVideoEnabled, enableAudio: isAudioEnabled });
      setStatus('connecting');
    }
  }
  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    setStatus('disconnected');
    KeepAwake.deactivate();
  };

  const _onMuteButtonPress = () => {
    if (isCallConnected) {
      twilioRef.current
        .setLocalAudioEnabled(!isAudioEnabled)
        .then(isEnabled => setIsAudioEnabled(isEnabled));
    }
    else {
      if (isAudioEnabled) {
        setIsAudioEnabled(false)
      }
      else {
        setIsAudioEnabled(true)
      }
    }
  };

  const _onFlipButtonPress = () => {
    //twilioRef.current.flipCamera();
    twilioRef.current.toggleSoundSetup(isLoudSpeaker);
    setIsLoudSpeaker(!isLoudSpeaker);
  };

  const _onFlipVideoButtonPress = () => {
    if (isCallConnected) {
      twilioRef.current
        .setLocalVideoEnabled(!isVideoEnabled)
        .then(isEnabled => setIsVideoEnabled(isEnabled));
    }
    else {
      if (isVideoEnabled) {
        setIsVideoEnabled(false)
      }
      else {
        setIsVideoEnabled(true)
      }
    }
  };



  const _onRoomDidConnect = ({ roomName, error }) => {
    //console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
    isCallConnected = true;
    KeepAwake.activate();
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    setStatus('disconnected');
    KeepAwake.deactivate();
  };

  const _onRoomDidFailToConnect = error => {
    //console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    //console.log('------added  '+JSON.stringify(track))

    setStatusVideoStop(true);
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
     //console.log(isVideoEnabled+'------remove track  '+JSON.stringify(track))
    // if(track.enabled && isVideoEnabled){
    //   _onEndButtonPress();
    // }
    

    setStatusVideoStop(false);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);
    setVideoTracks(videoTracksLocal);
  };
  const _onParticipantDisabledVideoTrack = ({ participant, track }) => {
    //console.log('------disable  '+JSON.stringify(track))
    setStatusVideoStop(false);
  };
  const _onParticipantEnabledVideoTrack = ({ participant, track }) => {
    //console.log("-------Enabled " + JSON.stringify(track)) 
    setStatusVideoStop(true);
  };
  // const _onRoomParticipantDidDisconnect = ({ participant, track }) => {
  //   console.log("-------paricipant disconnect ") 
    
  // };
  return (
    <View style={{ flex: 1, backgroundColor: '#160817' }}>
      <View style={{ flex: 1, marginTop: Platform.OS == 'ios' ? 50 : 0 }}>

        {status === 'disconnected' && props.nav.isFullScreenVideo ?
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '100%', marginLeft: responsiveWidth(30) }}>
              <Text style={{ fontSize: CustomFont.font14, color: Color.white, marginTop: responsiveHeight(2) }}>{patientName}</Text>
              <Text style={{ fontSize: CustomFont.font12, color: Color.white }}><Text style={{ fontWeight: 'bold' }}>{gender}  </Text>{age}</Text>
            </View>


            <TouchableOpacity style={{ height: responsiveFontSize(6), width: responsiveFontSize(6), resizeMode: 'contain', position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                //clearInterval(interval);
                props.Refresh('cross');
              }}>
              <Image source={cross_white} />
            </TouchableOpacity>

            <View style={{ height: responsiveFontSize(8), width: responsiveFontSize(8), borderRadius: responsiveFontSize(6), backgroundColor: '#EEE8FB', alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(20) }}>
              <Text style={{ fontSize: CustomFont.font16, color: '#5E637A', fontFamily: CustomFont.fontNameBold, fontWeight: 'bold' }}>{sortName}</Text>
            </View>
            <Text style={{ fontSize: CustomFont.font12, color: Color.white, marginTop: responsiveHeight(3) }}>Scheduled: {scheduleTime}</Text>

            <TouchableOpacity
              style={styles.button}
              //onPress={_onConnectButtonPressValidation} getToken
              onPress={() => getToken()}
            ><Text style={{ color: 'white', fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, fontWeight: 'bold' }}>Join Call</Text></TouchableOpacity>
          </View> : props.nav.isFullScreenVideo ?
            <View style={{ alignItems: 'center', zIndex: 999 }}>
              <View style={{ width: '100%', marginLeft: responsiveWidth(9) }}>
                <Text style={{ fontSize: CustomFont.font14, color: Color.white, marginTop: responsiveHeight(2) }}>{patientName}</Text>
                <Text style={{ fontSize: CustomFont.font12, color: Color.white }}><Text style={{ fontWeight: 'bold' }}>{gender}  </Text>{age}</Text>
              </View>


              {/* <TouchableOpacity style={{ height: responsiveFontSize(6), width: responsiveFontSize(6), resizeMode: 'contain', position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  setTimeout(() => {
                    props.Refresh('minimize');
                  }, 500);

                }}>
                <Image source={downKey} />
              </TouchableOpacity> */}

              {/* <Text style={{ color: Color.white, fontSize: CustomFont.font14, marginTop: responsiveHeight(3), backgroundColor: '#000', borderRadius: 4, paddingLeft: 3, paddingRight: 3 }}>{showCallTime}</Text> */}
              <TouchableOpacity style={{ right: responsiveWidth(3), top: responsiveHeight(2), justifyContent: 'center', alignItems: 'center', backgroundColor: '#E14942', height: responsiveHeight(5), width: responsiveWidth(22), borderRadius: 5, position: 'absolute' }}
                onPress={()=>{
                  _onEndButtonPress();
    setIsModalVideoComplete(true)
                } 
                }
              >
                <Text style={{ fontSize: CustomFont.font14, color: Color.white }}>End Call</Text>
              </TouchableOpacity>
{isModalForNetworkQuality ? <TouchableOpacity style={{ left: responsiveWidth(10),right: responsiveWidth(10),flexDirection:'row', top: responsiveHeight(13), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.white, borderRadius: 20, position: 'absolute' }}
                onPress={()=>{
                  setIsModalForNetworkQuality(false)
                }}
              >
                <Image source={error} style={{height:responsiveFontSize(4),width:responsiveFontSize(4),resizeMode:'contain',marginLeft:responsiveWidth(14)}}/>
                <Text style={{ fontSize: CustomFont.font14, color: Color.red,margin:16, marginRight:responsiveWidth(14) }}>Signal Strength is low. Please check your connection or move to an area with better connection</Text>
              </TouchableOpacity> : null

}
              
            </View> : null
        }

        {
          (status === 'connected' || status === 'connecting') &&
          <View style={styles.callContainer}>
            {
              status === 'connected' ?
                <View style={styles.remoteGrid}>
                  {statusVideoStop ?
                    Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                      return (
                        <TwilioVideoParticipantView
                          style={props.nav.isFullScreenVideo ? styles.remoteVideo : styles.remoteVideoMinimize}
                          key={trackSid}
                          trackIdentifier={trackIdentifier}
                          scaleType='fill'
                        />
                      )
                    }) : <View style={{ flex: 1, backgroundColor: '#000' }}></View>
                  }
                  {!props.nav.isFullScreenVideo ? <View style={{ position: 'absolute', bottom: 0, zIndex: 999, width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6) }}>
                      <TouchableOpacity onPress={_onMuteButtonPress} >
                        <Image source={isAudioEnabled ? mic_minimize : mic_off_minimize} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain', margin: 7 }} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={_onFlipVideoButtonPress} >
                        <Image source={isVideoEnabled ? video_minimize : video_off_minimize} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain', margin: 7 }} />
                      </TouchableOpacity>
                    </View>
                  </View> : null}
                </View> : null
            }
            <View
              style={styles.optionsContainer}>
              {
                isVideoEnabled && props.nav.isFullScreenVideo ? <TwilioVideoLocalView
                  enabled={true}
                  applyZOrder ={true}
                  style={styles.localVideo}
                /> : null
              }

            </View>

          </View>
        }

        {props.nav.isFullScreenVideo ? <View style={styles.optionsContainer1}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}
            >
              <Image source={isAudioEnabled ? mike_on : mike_off} style={{ height: responsiveFontSize(4.5), width: responsiveFontSize(4.5) }} />

              <Text style={{ fontSize: CustomFont.font12, color: '#50485F', marginTop: 3 }}>
                {isAudioEnabled ? "Turn Off Mic" : "Turn On Mic"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipVideoButtonPress}
            >
              <Image source={isVideoEnabled ? video_on : video_off} style={{ height: responsiveFontSize(4.5), width: responsiveFontSize(4.5) }} />

              <Text style={{ fontSize: CustomFont.font10, color: '#50485F', marginTop: 7 }}>{isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}</Text>
            </TouchableOpacity>
          </View>
          {status === 'connected' || status === 'connecting' ? <View style={{ alignItems: 'center', flex: 1 }}>

            <Tooltip
              isVisible={toolTipVisible}
              content={<View style={{ backgroundColor: Color.primary,margin:responsiveWidth(-4),borderRadius:10 }}>
                <Text style={{ margin: responsiveWidth(7), color: Color.white, fontSize: CustomFont.font16 }}>Minimise screen to view & fill the prescription.</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity style={{ height: responsiveHeight(4.5), width: responsiveWidth(13), backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: responsiveWidth(7), marginRight: responsiveWidth(7), borderRadius: 6 }}  onPress={() => {
                  setToolTipVisible(false)
                }}>
                    <Text style={{ margin: 7, color: Color.primary }}>Ok</Text>
                  </TouchableOpacity>
                </View>

              </View>}
              // placement="top"
              onClose={() => setToolTipVisible(false)}
            >
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  setTimeout(() => {
                    props.Refresh('minimize');
                    //setToolTipVisible(true)
                  }, 500);
                }}
              >
                <View style={{ height: responsiveFontSize(4.5), width: responsiveFontSize(4.5), borderRadius: responsiveFontSize(2.3), backgroundColor: '#5ec282', justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={minimize_video} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), tintColor: Color.white }} />
                </View>


                <Text style={{ fontSize: CustomFont.font10, color: '#50485F', marginTop: 7 }}>Minimise Screen</Text>
              </TouchableOpacity>
            </Tooltip>
          </View> : null}




        </View> : null}



        <TwilioVideo
          ref={twilioRef}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          onRoomDidConnect={_onRoomDidConnect}
          onRoomDidDisconnect={_onRoomDidDisconnect}
          onRoomDidFailToConnect={_onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
          onParticipantDisabledVideoTrack={_onParticipantDisabledVideoTrack}
          onParticipantEnabledVideoTrack = {_onParticipantEnabledVideoTrack}
          //onRoomParticipantDidDisconnect = {_onRoomParticipantDidDisconnect}
        //onRoomParticipantDidConnect={() => alert('llllll')}
        //onParticipantAddedDataTrack={() => alert('onParticipantAddedDataTrack')}
        //onParticipantEnabledAudioTrack={() => alert('onParticipantEnabledAudioTrack')}
        //onStatsReceived={() => alert('onStatsReceived')}
        />
      </View>
      <Modal isVisible={isModalVisible} >
        <View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Exit Video Call </Text>
            <Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Are you sure want to exit from video call? </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => setIsModalVisible(false)}>
                <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primary }} onPress={() => {
                _onEndButtonPress();
                setIsModalVisible(false);
                //clearInterval(interval);
                props.Refresh('back');
              }}>
                <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isModalVideoComplete} avoidKeyboard={true} onRequestClose={() => setIsModalForNetworkQuality(false)}>
                    <View style={styles.modelView}>
                        <View style={{ margin: 25, marginBottom: responsiveHeight(26) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Text style={styles.addtxt}>Generate E-Prescription</Text>
                               
                                <TouchableOpacity onPress={()=>setIsModalVideoComplete(false)}>
                                  <Image source={close} style={{height:responsiveFontSize(4),width:responsiveFontSize(4),resizeMode:'contain'}}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.compIcon}>
                                <Image style={{ resizeMode: 'contain', height: responsiveFontSize(14), width: responsiveFontSize(14), }} source={dentist_complete} />
                            </View>

                            <Text style={styles.compMessage}>Do you want to generate an e-prescription for this consultation ?</Text>

                            <TouchableOpacity
                                onPress={() => {
                                 // props.nav.context.navigation.navigate('AddPrescription', { imageArr: [], isAddOrEdit : 'add' }) 
                                  props.Refresh('back');
                                  setIsModalVideoComplete(false)
                                }}
                                style={styles.markComp}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '600' }}>Yes, generate e-prescription</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                  props.nav.context.navigation.navigate('AddPrescription', { imageArr: [], isAddOrEdit : 'add' }) 
                                  props.Refresh('back');
                                  setIsModalVideoComplete(false)
                                }}
                                style={styles.markCancel}>
                                <Text style={{ color: Color.primary, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '600' }}>No, upload handwritten prescription</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
    </View>
  );
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
)(App);




//export default App;
