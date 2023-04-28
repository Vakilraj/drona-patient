import React from 'react';
import {
    FlatList, Image, SafeAreaView,
    StatusBar, Text,
    TouchableOpacity, View, BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../../assets/back_blue.png';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import styles from './style';
import PDFView from 'react-native-view-pdf';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import { setLogEvent } from '../../../service/Analytics';
let trace;
import Trace from '../../../service/Trace'
let timeRange = '';
let staticUrl='https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/d643459d-c62f-11eb-b68b-0022486b91c8.pdf?sv=2018-03-28&sr=f&sig=8u9Rr80lMSA6uVVFvaOR%2BRTdQlc%2B%2FaxqKodlkrpL8Kw%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637585163757322307';
 class NotificationSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            fileSavePathIOS : '',
            resources: {
                url: staticUrl,
                //url: 'https://campustecnologicoalgeciras.es/wp-content/uploads/2017/07/OoPdfFormExample.pdf',
            },
        };
    } 
  
  componentDidMount() {
    let { signupDetails } = this.props;
   
    timeRange = Trace.getTimeRange();
    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Preview_Print_Out_Template',  signupDetails.firebaseLocation )
    Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Preview_Print_Out_Template", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
   
    let item = this.props.navigation.getParam("item")
    if (item && item.length) {
        this.state.resources.url = staticUrl;//item[0].templateUrl;
        this.setState({ resources: this.state.resources })
    }
    if(Platform.OS==='ios')
    this.downloadFileForIos(staticUrl); //item[0].templateUrl
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    // this.props.navigation.goBack(null);
    Trace.stopTrace()
    this.props.navigation.goBack();
    return true;
 }
  componentWillUnmount  = async () =>{
    // Stop the trace
    Trace.stopTrace()
    this.backHandler.remove();
  } 
  downloadFileForIos = (url) =>{
    //alert(item.sysFilePath)
    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', url, {})
      .then((res) => {
       RNFS.readFile(res.path(), "base64").then(result => {
       this.setState({fileSavePathIOS : result})
    
    })
      })
      .catch((e) => {
        //console.log(e)
      });
  
  }
    render() {
        const resourceType = 'url';
        return (
            <SafeAreaView style={CommonStyle.container}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            {/* <Image source={arrowBack} style={styles.backImage} /> */}
                            <Image source={arrowBack} style={{marginLeft:responsiveWidth(3), height: responsiveWidth(4.5), width: responsiveWidth(5.5),paddingTop:responsiveWidth(2) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Prescription Template</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: Color.newBgColor, marginTop:responsiveWidth(1), flex:1 }}>
                    <View style={{ flex: 12 }}>
                    <PDFView
              fadeInDuration={250.0}
              style={{ flex: 1, }}
              resource={ Platform.OS == 'android'? this.state.resources[resourceType] : this.state.fileSavePathIOS }
              resourceType={Platform.OS == 'android'? resourceType : 'base64'}
            />
                      {/* <PDFView
                        fadeInDuration={250.0}
                        style={{ flex: 1 }}
                        resource={this.state.resources[resourceType]}
                        resourceType={resourceType}
                        onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                        onError={(error) => console.log('Cannot render PDF', error)}
                        /> */}
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
)(NotificationSetting);
