import React, { useState } from 'react';
import {
  SafeAreaView, View,
  Text,
  StatusBar, Button, TouchableOpacity, Image,
  BackHandler, PermissionsAndroid, Alert, Platform, FlatList, Dimensions
} from 'react-native';
import styles from './style';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import Moment from 'moment';
import CustomFont from '../../../components/CustomFont';
import EditIcon from '../../../../assets/edit_new_blue.png';
import PrintingIcon from '../../../../assets/print.png';
import DuplicateIcon from '../../../../assets/ic_copy.png';
import PdfIcon from '../../../../assets/pdficon.png';
import Toolbar from '../../../customviews/Toolbar.js';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from 'react-native-responsive-dimensions';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import PDFView from 'react-native-view-pdf';
import RNPrint from 'react-native-print';
import RNFetchBlob from 'rn-fetch-blob';
import Snackbar from 'react-native-snackbar';
import whatsapp_icon from '../../../../assets/whatsapp_icon.png';
import RNFS from 'react-native-fs';
import { setLogEvent } from '../../../service/Analytics';
import ImageZoom from 'react-native-image-pan-zoom';
let item = null;
import Trace from '../../../service/Trace'
let timeRange = '',prescriptionGuid= '';

class PastEncountersDetail extends React.Component {
  constructor(props) {
    super(props);
    let itemObj = props.navigation.state.params.data;
    this.state = {
      item: null,
      fileSavePathIOS: '',
      appointmentStatus: '',
      isMigratedData: itemObj.isHandwritten,
      filesArr: itemObj.imageAttachementList ? itemObj.imageAttachementList : [],
      downloadFileUrl: '',
      fileExt:false
    }
  }

  componentDidMount() {
    item = this.props.navigation.getParam("data");
    this.setState({ item: this.props.navigation.getParam("data") })
    this.setState({ appointmentStatus: this.props.navigation.getParam("item").appointmentStatus })
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
    this.clickOnShowPreview(this.state.filesArr[0])
  }

  sendSms = () => {
    let { actions, signupDetails } = this.props;
    let params = {
      "userGuid": signupDetails.UserGuid,
      "Data": {
        "PatientGuid": signupDetails.patientGuid,
        "AppointmentGuid": signupDetails.appoinmentGuid,
        "PrescriptionGuid": prescriptionGuid,
        "DoctorGuid": signupDetails.doctorGuid,
        "ClinicGuid": signupDetails.clinicGuid,
      }
    }
    actions.callLogin('V12/FuncForDrAppToSendSMSAndWhatsAppForPastprescription', 'post', params, signupDetails.accessToken, 'sendSms');
  }

  downloadFileForIos = (item) => {
    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', item.prescriptionUrl, {})
      .then((res) => {
        RNFS.readFile(res.path(), "base64").then(result => {
          this.setState({ fileSavePathIOS: result })

        })
      })
      .catch((e) => {
        //console.log(e)
      });
    this.setState({ downloadFileUrl: item.prescriptionUrl });
  }
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
      if (tagname === 'repeatVisit') {
        if (newProps.responseData.statusCode == '0') {
          //this.setState({ duplicateModal: true });
          Snackbar.show({ text: 'Duplicate Rx successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
          setTimeout(()=>{
            this.props.navigation.navigate('ConsultationTab', { data: item, from: 'Past Encounters', item: this.props.navigation.getParam("item"),tabIndex:0 })
          },1000)
        }else{
          Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
      }else if(tagname=='sendSms'){
        setTimeout(()=>{
          if (newProps.responseData.statusCode == '0') {
            Snackbar.show({ text: 'Messages sent successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
          }else{
            Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
          }
        },500)
        
      }
		}
	}
  downloadPdf = async () => {
    try {
      if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.actualDownload();
        } else {
          Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
        }
      } else {
        this.actualDownload();
      }

    } catch (err) {
      console.warn(err);
    }
  }

  clickOnShowPreview = (item) => {
    if (Platform.OS == 'ios' && item.fileExt == 'pdf') {
      this.setState({ fileExt: 'pdf' })
      this.downloadFileForIos(item);

    } else {
      if (item.fileExt != 'pdf') {
        this.setState({ fileExt: 'png', downloadFileUrl: item.prescriptionUrl })
      } else {
        this.setState({ fileExt: 'pdf', downloadFileUrl: item.prescriptionUrl })
        this.setState({
          resources: {
            url: item.prescriptionUrl
          }
        })
      }
    }
    prescriptionGuid=item.prescriptionGuid;
  }

  componentWillUnmount() {
    Trace.stopTrace()
    
}
  repeatVisit = () => {
    let { actions, signupDetails } = this.props;
    timeRange = Trace.getTimeRange();
    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +'Duplicate_rx',  signupDetails.firebaseLocation)
    Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Duplicate_rx", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })
    let params = {
      "userGuid": signupDetails.UserGuid, "DoctorGuid": signupDetails.doctorGuid
      , "ClinicGuid": signupDetails.clinicGuid,
      "Data": {
        "NewAppointmentGuid": signupDetails.appoinmentGuid,
        "OldAppointmentGuid": item.pastAppointmentGuid,
      }
    }
    setLogEvent("past_encounter", { duplicate: "click", UserGuid: signupDetails.UserGuid })
    actions.callLogin('V14/FuncForDrAppToRepeatVisit', 'post', params, signupDetails.accessToken, 'repeatVisit');
    Trace.stopTrace()
  }

  async printRemotePDF() {
    await RNPrint.print({ filePath: this.state.downloadFileUrl })
  }

  render() {
    const resourceType = 'url';
    let { actions, signupDetails } = this.props;
    item = this.props.navigation.getParam("data");
    return (
      <SafeAreaView style={CommonStyle.containerlightBg}>
        <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
        {/* <NavigationEvents onDidFocus={() => this.getBillingHistoryList()} /> */}

        <View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
          <Toolbar
            title={item && item.prescriptionDate ? Moment(item.prescriptionDate).format('DD MMM YYYY') : "Prescription Details"}
            isDownload={item}
            download={() => this.downloadPdf()}
            onBackPress={() => this.props.navigation.goBack()} />
          <View style={{ flex: 1 }} >
            {
              this.state.filesArr && this.state.filesArr.length > 1 ? <View style={{ flex: 1.5, backfaceVisibility: 'visible' }}>
                <FlatList
                  data={this.state.filesArr}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{ paddingBottom: 2, paddingTop: 5 }}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.preview} onPress={() => this.clickOnShowPreview(item)}>
                      {item.fileExt != 'pdf' ? <Image source={{ uri: item.prescriptionUrl }} style={{ height: 60, width: 60 }} /> : <Image source={PdfIcon} style={{ height: 60, width: 60 }} />}
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                /></View> : null
            }




            {
              this.state.fileExt =='pdf'?
                <View style={{ flex: 12 }}>
                  {(Platform.OS == 'android' && this.state.downloadFileUrl) || (Platform.OS == 'ios' && this.state.fileSavePathIOS) ?
                    <PDFView
                      fadeInDuration={250.0}
                      style={{ flex: 1, margin: responsiveWidth(4) }}
                      resource={Platform.OS == 'android' ? this.state.downloadFileUrl : this.state.fileSavePathIOS}
                      resourceType={Platform.OS == 'android' ? resourceType : 'base64'}
                    /> : null}
                </View> :
                <View style={{ flex: 12 }}>
                  <ImageZoom cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={responsiveWidth(100)}
                    imageHeight={responsiveHeight(100)}>
                    <Image style={{ resizeMode: 'contain', width: responsiveWidth(100), height: responsiveHeight(80) }}
                      source={{ uri: this.state.downloadFileUrl }} />

                  </ImageZoom>
                </View>
            }

           
                <View style={{ marginLeft: -0.5, flexDirection: "row", position: 'absolute', bottom: responsiveHeight(0), marginBottom: responsiveHeight(0), height: responsiveHeight(10), width: '100%', backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                  {signupDetails.isAssistantUser || !signupDetails.appoinmentGuid || this.state.isMigratedData || this.state.appointmentStatus == "Completed"? null : <TouchableOpacity onPress={() => {
                    setLogEvent("past_encounter", { edit: "click", UserGuid: signupDetails.UserGuid })

                    if (item && item.isHandwritten) {
                      if (this.state.appointmentStatus != "Completed") {
                        this.props.navigation.navigate('AddPrescription', { imageArr: item.imageAttachementList, isAddOrEdit: 'edit', appStatus: this.state.appointmentStatus })
                      }
                    }
                    else {
                      this.props.navigation.navigate('ConsultationTab', { data: item, from: 'Past Encounters', item: this.props.navigation.getParam("item"), tabIndex: 0 })
                    }
                  }}
                    style={{ paddingTop: 15, paddingBottom: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={EditIcon} style={{ width: responsiveWidth(4.5), height: responsiveHeight(4.5), resizeMode: 'contain', tintColor: item && item.isHandwritten && this.state.appointmentStatus == "Completed" ? Color.grayTxt : Color.primary }} />
                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: item && item.isHandwritten && this.state.appointmentStatus == "Completed" ? Color.grayTxt : Color.primary, fontWeight: CustomFont.fontWeight600 }}>Edit</Text>
                  </TouchableOpacity>}

                  <TouchableOpacity onPress={() => {
                    setLogEvent("past_encounter", { print: "click", UserGuid: signupDetails.UserGuid })
                    this.printRemotePDF()
                  }} style={{ paddingTop: 15, paddingBottom: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={PrintingIcon} style={{ width: responsiveWidth(4.5), height: responsiveHeight(4.5), resizeMode: 'contain', tintColor: Color.primary }} />
                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.primary, fontWeight: CustomFont.fontWeight600 }}>Print</Text>
                  </TouchableOpacity>
                  {signupDetails.isAssistantUser || !signupDetails.appoinmentGuid || this.state.isMigratedData || this.state.appointmentStatus == "Completed"? null :
                    <TouchableOpacity onPress={() => {
                      if (item && item.isHandwritten) {
                        Snackbar.show({ text: 'Hand-Written prescriptions cannot be duplicated.', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                      } else {
                        this.repeatVisit()
                      }
                    }} style={{ paddingTop: 15, paddingBottom: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={DuplicateIcon} style={{ width: responsiveWidth(4.5), height: responsiveHeight(4.5), resizeMode: 'contain' }} />
                      <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.primary, fontWeight: CustomFont.fontWeight600 }}>Duplicate</Text>
                    </TouchableOpacity>}

                  <TouchableOpacity onPress={() => this.sendSms()} style={{ paddingTop: 15, paddingBottom: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={whatsapp_icon} style={{ width: responsiveWidth(5), height: responsiveHeight(5), resizeMode: 'contain' }} />
                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.primary, fontWeight: CustomFont.fontWeight600 }}>Send</Text>
                  </TouchableOpacity>


                </View>

          </View>

          {/* <Modal isVisible={this.state.duplicateModal}>
            <View style={[styles.modelViewMessage2]}>
              <Image source={OK} style={{ height: 65, width: 65, marginTop: 30 }} />
              <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>
                Duplicate Rx Done
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ duplicateModal: false });
                }}
                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
              </TouchableOpacity>
            </View>
          </Modal> */}
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

const ActionCreators = Object.assign({}, apiActions, signupActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch), });
export default connect(mapStateToProps, mapDispatchToProps,)(PastEncountersDetail);
