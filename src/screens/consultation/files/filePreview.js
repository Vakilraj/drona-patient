
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar, BackHandler, TouchableOpacity, TextInput, Image, Platform,
  Dimensions, PermissionsAndroid, FlatList, Alert
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import CommonStyle from '../../../components/CommonStyle.js';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import PdfIcon from '../../../../assets/pdficon.png';
import styles from './style.js';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PDFView from 'react-native-view-pdf';
import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Toolbar from '../../../customviews/Toolbar.js';
import { setLogEvent } from '../../../service/Analytics';
import ViewShot from 'react-native-view-shot';
import CameraRoll from "@react-native-community/cameraroll";
import FastImage from 'react-native-fast-image'
let recordGuid;
let dataShow = [];

class FilePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileSavePathIOS: '',
      name: '',
      attchment: '',
      fileExt: '',
      downloadPdfUrl: '',
      data: [{ type: 'image', name: 'Prescription 1', url: 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/plus.png' },
      { type: 'pdf', name: 'Prescription 2', url: 'https://campustecnologicoalgeciras.es/wp-content/uploads/2017/07/OoPdfFormExample.pdf' }],
      resources: {
        file: Platform.OS === 'ios' ? 'test-pdf.pdf' : '/sdcard/Download/test-pdf.pdf',
        url: 'https://campustecnologicoalgeciras.es/wp-content/uploads/2017/07/',
        base64: 'data:application/pdf;base64,JVBERi0xLjMKJcfs...',
      }
    };
  }
  componentDidMount() {
    // this.setState({data : this.props.navigation.state.params.selecteditems.listOfAttachments})
    // console.log('attachemnts ' +  JSON.stringify(this.props.navigation.state.params.selecteditems.listOfAttachments))
    recordGuid = this.props.navigation.state.params.selecteditem.recordGuid;
    // alert(JSON.stringify(recordGuid))
    this.callReadApi(recordGuid);
    this.callAPIForEditRecordDetails();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }
  callReadApi = (recordGuid) => {
    let { actions,signupDetails } = this.props;
    let params = {
			"UserGuid": signupDetails.UserGuid,
      "Data": {
        "RecordGuid": recordGuid
      }
    }
    actions.callLogin('V1/FuncForDrAppToIsDoctorReadDocument', 'post', params, signupDetails.accessToken, 'changereadstatus');

  }

  getBase64=()=>{
    if (this.state.attchment === '') {
      alert('Please select a file to download')
    }else{
      this.refs.viewShot.capture().then((uri) => {
        this.downloadQrCode(uri)
      });
    }
		
	}


  downloadQrCode = async (uri) => {
		if (Platform.OS == 'ios') {
			CameraRoll.save(uri, { type: 'photo' });
			Snackbar.show({ text: 'File Downloaded Successfully.', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
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
			 	Snackbar.show({ text: 'File Downloaded Successfully.', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
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

  callAPIForEditRecordDetails = () => {
    let { actions, signupDetails } = this.props;
    let params = {
      "UserGuid": signupDetails.UserGuid,
      "DoctorGuid": signupDetails.doctorGuid,
      "ClinicGuid": null,
      "Version": "",
      "Data": {
        "AppointmentGuid": signupDetails.appoinmentGuid,
        "RecordGuid": recordGuid
      }
    };
    actions.callLogin('V1/FuncForDrAppToGetEditPatientRecord', 'post', params, signupDetails.accessToken, 'filepreview');
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.responseData && newProps.responseData.tag) {
      let tagname = newProps.responseData.tag;
      
      let data = newProps.responseData.data;
      

      if (tagname === 'changereadstatus') {
        if (newProps.responseData.statusCode === '0') {
          // this.setState({data : this.props.navigation.state.params.selecteditems.listOfAttachments})
        }
      }

      else if (tagname === 'filepreview') {
        if(data.attachment.length == 1)
        {
          this.clickOnShowPreview(data.attachment[0]);

        //   this.setState({ fileExt: '.pdf' })
        //   this.setState({ downloadPdfUrl: data.attachment[0].attachmentUrl })
        //   this.setState({
        //   resources: {
        //     url: data.attachment.attachmentUrl
        //   }
        // })

        }

        this.setState({ data: data.attachment })
      }
    }
  }

  getExtention = filename => {
    return /[.]/.exec(filename) ?
      /[^.]+$/.exec(filename) : undefined;
  }
  downloadImage() {
    

    if (this.state.attchment === '') {
      alert('Please select a file to download')
    }
    else {
      let date = new Date();
      // Image URL which we want to download
      // let image_URL = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png'; 
      let image_URL = this.state.attchment;
      let ext = this.getExtention(image_URL);
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
  }
  makeDownload = async (fileType) => {
    let { signupDetails } = this.props;
    setLogEvent("files", { "download_files": "click", UserGuid: signupDetails.UserGuid, })
    if (Platform.OS === 'ios') {
      if(fileType!= '.pdf')
      this.downloadImage()
      else
      this.downloadPdfFromUrl();
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if(fileType!= '.pdf')
      this.downloadImage()
      else
      this.downloadPdfFromUrl();
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
  downloadPdfFromUrl = () => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    let fileName = "filePreview" + (new Date()).getTime() + '.pdf'
    const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: 'test',
        path: `${dirToSave}/` + fileName,
    }
    const configOptions = Platform.select({
        ios: {
            fileCache: configfb.fileCache,
            title: configfb.title,
            path: configfb.path,
            appendExt: 'pdf',
        },
        android: configfb,
    });

    //console.log('The file saved to 23233', configfb, dirs);
    RNFetchBlob.config(configOptions)
        .fetch('GET', this.state.downloadPdfUrl, {})
        .then((res) => {
            if (Platform.OS === "ios") {
              RNFetchBlob.ios.openDocument(res.data);
                // RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                // RNFetchBlob.ios.previewDocument(configfb.path);
            }
            //setisdownloaded(false)
            if (Platform.OS == 'android') {
              Snackbar.show({ text: 'File downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            //console.log('The file saved to ', res);
        })
        .catch((e) => {
            //console.log('The file saved to ERROR', e.message)
        });
}
  // makeDownload1 = async () => {
  //   let { signupDetails } = this.props;
  //   setLogEvent("files", { "download_files": "click", UserGuid: signupDetails.UserGuid, })
  //   if (Platform.OS === 'ios') {
  //     this.downloadImage()
  //   }
  //   else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission Required',
  //           message:
  //             'App needs access to your storage to download Photos',
  //         }
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         this.downloadImage();
  //       } else {
  //         // If permission denied then show alert
  //         alert('Storage Permission Not Granted');
  //       }
  //     } catch (err) {
  //       // To handle permission related exception
  //       alert('Please select a file to download')
  //     }
  //   }

  // }
  // downloadPdf = async () => {
  //   let { signupDetails } = this.props;
  //   setLogEvent("files", { "download_files": "click", UserGuid: signupDetails.UserGuid, })
  //   if(Platform.OS == 'ios'){
  //     this.actualDownload();
  //   }
  //   else{
  //     try {
  //       const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         this.actualDownload();
  //       } else {
  //         Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // }

  // actualDownload1 = () => {
  //   //  var RandomNumber = Math.floor(Math.random() * 100) + 1 ;
  //   const { dirs } = RNFetchBlob.fs;
  //   RNFetchBlob.config({
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       mediaScannable: true,
  //       //  title: RandomNumber.toString() + `test.pdf`,
  //       title: `prescription.pdf`,
  //       path: `${dirs.DownloadDir}/test.pdf`,
  //     },
  //   })
  //     .fetch('GET', this.state.downloadPdfUrl, {})
  //     .then((res) => {
  //       // console.log('The file saved to ', res.path());
  //       alert('File successfully downloaded')
  //     })
  //     .catch((e) => {
  //       //console.log(e)
  //     });
  // }
//   actualDownload = () => {
//     const { dirs } = RNFetchBlob.fs;
//     const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
//     let fileName = "filePreview" + (new Date()).getTime() + '.pdf'
//     const configfb = {
//         fileCache: true,
//         useDownloadManager: true,
//         notification: true,
//         mediaScannable: true,
//         title: 'test',
//         path: `${dirToSave}/` + fileName,
//     }
//     const configOptions = Platform.select({
//         ios: {
//             fileCache: configfb.fileCache,
//             title: configfb.title,
//             path: configfb.path,
//             appendExt: 'pdf',
//         },
//         android: configfb,
//     });

//     //console.log('The file saved to 23233', configfb, dirs);
//     RNFetchBlob.config(configOptions)
//         .fetch('GET', this.state.downloadPdfUrl, {})
//         .then((res) => {
//             if (Platform.OS === "ios") {
//               RNFetchBlob.ios.openDocument(res.data);
//                 // RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
//                 // RNFetchBlob.ios.previewDocument(configfb.path);
//             }
//             //setisdownloaded(false)
//             if (Platform.OS == 'android') {
//               Snackbar.show({ text: 'File downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
//             }
//             //console.log('The file saved to ', res);
//         })
//         .catch((e) => {
//             //console.log('The file saved to ERROR', e.message)
//         });
// }
  clickOnShowPreview = (item) => {
    // alert(JSON.stringify(item))
    if (Platform.OS == 'ios' && item.orgFileExt == '.pdf') {
      this.setState({ fileExt: '.pdf' })
      this.setState({ downloadPdfUrl: item.attachmentUrl })
      this.downloadFileForIos(item);

    } else {
      if (item.orgFileExt != '.pdf') {
        this.setState({ attchment: item.attachmentUrl })
        this.setState({ fileExt: '.png' })
      } else {
        this.setState({ fileExt: '.pdf' })
        this.setState({ downloadPdfUrl: item.attachmentUrl })
        this.setState({
          resources: {
            url: item.attachmentUrl
          }
        })
      }
    }

  }

  downloadFileForIos = (item) => {
    //console.log('popop ' + JSON.stringify(item.sysFilePath))
    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', item.attachmentUrl, {})
      .then((res) => {
        RNFS.readFile(res.path(), "base64").then(result => {
         // alert(JSON.stringify(result))
          this.setState({ fileSavePathIOS: result })

        })
      })
      .catch((e) => {
      });

  }

  render() {
    const resourceType = 'url';
    return (
      <SafeAreaView style={[CommonStyle.safeArea,{backgroundColor: Color.bgColor}]}>
        <View style={{ flex: 1, backgroundColor: Color.bgColor }}>
          <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
          {/* <View style={{ flexDirection: 'row', marginTop: 0, backgroundColor: Color.primary, alignItems: 'center', height: Platform.OS === 'ios' ? 40 : responsiveHeight(7.5) }}>
            <TouchableOpacity style={{ marginLeft: responsiveWidth(2.5) }} onPress={() => this.props.navigation.goBack()}>
              <Image source={arrowBack} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 20, fontFamily: CustomFont.fontNameBold, fontWeight: CustomFont.fontWeight500, fontSize: CustomFont.font16, color: Color.white }}>Preview</Text>
          </View> */}
          <Toolbar
            title={this.props.navigation.state.params.selecteditem.recordTitle}
            onBackPress={() => {
              this.handleBackPress()
            }} />
          {/* <View style={{ flex: 1.5 }}> */}
          <View style={{ flex: 1.5,backfaceVisibility:Color.bgColor }}>
              <FlatList
                data={this.state.data}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: 2, paddingTop: 5 }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={styles.preview} onPress={() => this.clickOnShowPreview(item)}>
                    {/* <Image source={{ uri: item.url }} style={{ height: 57, width: 57, backgroundColor: 'red' }} /> */}
                    {item.orgFileExt != '.pdf' ? <Image source={{ uri: item.attachmentUrl }} style={{ height: 60, width: 60 }} /> : <Image source={PdfIcon} style={{ height: 60, width: 60 }} />}
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

            <View style={{ flex: 12 ,backgroundColor: Color.bgColor}}>
              {this.state.fileExt != '.png' ?
                <PDFView
                  fadeInDuration={250.0}
                  style={{ flex: 1,backgroundColor: Color.bgColor }}
                  resource={Platform.OS == 'android' ? this.state.resources[resourceType] : this.state.fileSavePathIOS}
                  resourceType={Platform.OS == 'android' ? resourceType : 'base64'}
                />
                :
                <ViewShot
                style={{flex:1}}
					  	ref="viewShot"
					  	options={{ format: 'jpg', quality: 0.9 }}>
                <ImageZoom cropWidth={Dimensions.get('window').width}
                  cropHeight={Dimensions.get('window').height}
                  imageWidth={responsiveWidth(100)}
                  imageHeight={responsiveHeight(100)}>
                    <FastImage
        style={{width: responsiveWidth(100), height: Platform.OS=='android'? responsiveHeight(70): responsiveHeight(68)}}
        source={{
            uri: this.state.attchment,
            //headers: { Authorization: signupDetails.accessToken },
            priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
    />
                  {/* <Image style={{ resizeMode: 'contain', width: responsiveWidth(100), height: responsiveHeight(80) }}
                    source={{ uri: this.state.attchment }} /> */}

                </ImageZoom>
                </ViewShot>
              }
            </View>
          </View>

          {/* {this.state.fileExt != '.pdf' ?
            <TouchableOpacity onPress={this.makeDownload}
              style={{ paddingLeft: 0, paddingRight: 10, borderRadius: 20, position: 'absolute', alignItems: 'center', justifyContent: 'center', bottom: 50, right: 40, backgroundColor: Color.lightBlue, height: responsiveHeight(5), flexDirection: 'row' }}>
              <Image style={{ flex: 0 }} source={downloadIcon}></Image>
              <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16 }}>Download</Text>
            </TouchableOpacity> :
            <TouchableOpacity onPress={this.downloadPdf}
              style={{ paddingLeft: 0, paddingRight: 10, borderRadius: 20, position: 'absolute', alignItems: 'center', justifyContent: 'center', bottom: 50, right: 40, backgroundColor: Color.lightBlue, height: responsiveHeight(5), flexDirection: 'row' }}>
              <Image style={{ flex: 0 }} source={downloadIcon}></Image>
              <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16 }}>Download</Text>
            </TouchableOpacity>} */}


          <View style={styles.bottomBtnView} >
            <TouchableOpacity onPress={()=>this.makeDownload(this.state.fileExt)} style={styles.submitbtn}>
              <Text style={styles.submittxt}>Download File</Text>
            </TouchableOpacity>
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
)(FilePreview);
