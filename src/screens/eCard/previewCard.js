import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text, TouchableOpacity,
  Image,
  Platform, BackHandler,PermissionsAndroid
} from 'react-native';
import styles from './style';
import Modal from 'react-native-modal';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import arrowBack from '../../../assets/back_blue.png';

import TickIcon from '../../../assets/green_tick.png';

import CameraRoll from "@react-native-community/cameraroll";
import Snackbar from 'react-native-snackbar';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import { setLogEvent, setLogShare } from '../../service/Analytics';
import Trace from '../../service/Trace';
class PreviewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      cityArr: [],
      clinicViewShowStatus: true,
      listShowStatusCity: false,
      listShowStatusClinic: false,
      clinicArray: [],
      clinicName: '',
      btnText: 'Next',
      selectedCards: 0,
      activeSlide: 0,
      dName: '',
      imageSource: '',
      previewCardUrl: '',
      doctorName: '',
      downLoadBtnBcColor: '#FFFFFF',
      isdownloadClicked: false,
      doctorImageUrl: '',
      successPdfDownload: false,
      drImageinAssistant: '',
    };
  }
  componentDidMount() {
    let { actions, signupDetails } = this.props;
    let timeRange = Trace.getTimeRange();
    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +'Preview_E_Card',  signupDetails.firebaseLocation)
    Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Preview_E_Card", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })
    
    this.setState({ previewCardUrl: this.props.navigation.state.params.res.cardImage });
    this.setState({ doctorName: this.props.navigation.state.params.res.dName });
    this.setState({ doctorImageUrl: this.props.navigation.state.params.res.doctorImage });
    
    this.setState({ drImageinAssistant: { uri: signupDetails.profileImgUrl } });

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    setLogEvent("generate_ecard")
  }
  componentWillUnmount(){
    Trace.stopTrace()
  }


  captureAndShareScreenshot = () => {
    let { actions, signupDetails } = this.props;
    this.refs.viewShot.capture().then((uri) => {
      RNFS.readFile(uri, 'base64').then((res) => {
        let urlString = 'data:image/jpeg;base64,' + res;
        let options = {
          title: 'Share Title',
          message: 'Hello! For teleconsultation with ' +
            this.state.doctorName + '  at his virtual clinic, ' + signupDetails.clinicName + ' Click to below link \n\n' + signupDetails.shareLinkUrl,
          url: urlString,
          type: 'text',
        };
        Share.open(options)
          .then((res) => {
            //console.log('YES ' + JSON.stringify(res));
          })
          .catch((err) => {
            //err && console.log(err);
          });
      });
    });
    setLogShare({content_type: 'e_card'})
  };

  getExtention = filename => {
    return /[.]/.exec(filename) ?
      /[^.]+$/.exec(filename) : undefined;
  }

  pressDownLoad = async () => {
    this.setState({ isdownloadClicked: true })
  
    this.refs.viewShot.capture().then((uri) => {
      //if(Platform.OS=='android'){
      RNFS.readFile(uri, 'base64').then((res) => {
        var text = "";
        var ramdomstr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
          text += ramdomstr.charAt(Math.floor(Math.random() * ramdomstr.length));
        let imgName = text + '.png'
        const dirs = RNFetchBlob.fs.dirs;
        // var path = dirs.DCIMDir + "/image.png";
        //var path = dirs.DCIMDir + imgName;
        var path = dirs.DocumentDir + imgName;
        if (Platform.OS == 'android') {
          RNFetchBlob.fs.writeFile(path, res, 'base64')
            .then((res) => {
              this.setState({ isdownloadClicked: false })
              this.setState({ successPdfDownload: true })

            });
        } else {
          RNFetchBlob.ios.previewDocument(res);
        }

      });

    });
  }
  getBase64=()=>{
		this.refs.viewShot.capture().then((uri) => {
			this.downloadQrCode(uri)
		});
	}
	downloadQrCode = async (uri) => {
		if (Platform.OS == 'ios') {
			CameraRoll.save(uri, { type: 'photo' });
			Snackbar.show({ text: 'e-Card downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
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
					CameraRoll.save(uri, { type: 'photo' });
			 	Snackbar.show({ text: 'e-Card downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				} else {
					// If permission denied then show alert
					alert('Storage Permission Not Granted');
				}
			} catch (err) {
				//console.warn(err);
			}
		}
	//
	}
  render() {
    let { actions, signupDetails } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.patientBackground }}>
        <View style={{ paddingLeft: responsiveWidth(4), paddingRight: responsiveWidth(4), height: Platform.OS == 'ios' ? 40 : responsiveHeight(7.5), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: Color.white, width: '100%' }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
              <Image source={arrowBack} style={{ width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
            </TouchableOpacity>
            <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>Preview Card</Text>
          </View>
        </View>
        <View style={{ flex: 1, margin: responsiveWidth(0), }}>
          <View style={styles.cardpreview}>
            <ViewShot
              style={{flex:1,backgroundColor:Color.white}}
              ref="viewShot"
              options={{ format: 'jpg', quality: 0.9 }}>
              <View style={{ flex: 5,alignItems:'center'}}>
                <Image style={{flex:1, width: '98%',  borderRadius: 6, resizeMode: 'contain', marginTop: 5,marginLeft:5,marginRight:5 }} source={{ uri: this.state.previewCardUrl }} />
              </View>
              <View style={{flex:.6, flexDirection: 'row',backgroundColor:'#f9f9f9', alignItems: 'center', marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), marginBottom:responsiveHeight(1),borderRadius:5}}>
                <View style={{flex: 9,}}>
                <Text style={{ color: Color.fontColor, fontFamily: CustomFont.fontName,fontWeight:'bold',
                  fontSize: CustomFont.font20, marginLeft: responsiveWidth(3),
                }}>
                  {this.state.doctorName }
                </Text>
                </View>
                <View style={{flex: 3, alignItems: 'center', marginLeft: responsiveWidth(5) }}>
                {/* {signupDetails.isAssistantUser ? */}
                <Image source={signupDetails.isAssistantUser ? this.state.drImageinAssistant : this.state.doctorImageUrl} style={{ height: responsiveHeight(13), width: responsiveHeight(13), borderRadius: responsiveHeight(6.5), borderColor: Color.primary, borderWidth: 1.8,position:'absolute',right:5,bottom:responsiveHeight(-3) }} />                  
                
                {/* <Image source={this.state.doctorImageUrl} style={{ height: responsiveHeight(13), width: responsiveHeight(13), borderRadius: 50, borderColor: Color.primary, borderWidth: 1.8,position:'absolute',right:5,bottom:responsiveHeight(-3) }} />                     */}
                
                    
                </View>
              </View>
            </ViewShot>
          </View>

          <View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(11), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, flexDirection: 'row' }}>
            <TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(44), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.cancelButtonBg, borderRadius: 5, marginRight: 10 }}
              onPress={() => this.getBase64()}>
              <Text style={{ color: Color.primaryBlue, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName }}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.captureAndShareScreenshot} style={{ height: responsiveHeight(6), width: responsiveWidth(44), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, borderRadius: 5 }}>
              <View style={{ borderRadius: responsiveWidth(2.5) }}>
                <Text style={{ color: Color.white, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName }}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Modal isVisible={this.state.successPdfDownload}>
            <View style={[styles.modelViewMessage2]}>
              <Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
              <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                Image Downloaded Successfully
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ successPdfDownload: false })
                }}
                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
              </TouchableOpacity>
            </View>
          </Modal>

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
)(PreviewCard);
