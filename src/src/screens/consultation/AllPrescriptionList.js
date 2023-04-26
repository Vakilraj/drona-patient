import React from 'react';
import {
	SafeAreaView, View,
	Text, Image, Platform, TouchableOpacity, FlatList, StatusBar, ScrollView,
} from 'react-native';
import styles from './style';
import CustomFont from '../../components/CustomFont';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../customviews/Toolbar.js';


import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import uparrow from '../../../assets/uparrow.png';
import PDFView from 'react-native-view-pdf';
import RNPrint from 'react-native-print';
import RNFetchBlob from 'rn-fetch-blob';
import downarrow from '../../../assets/downarrow.png';
import clinic_image from '../../../assets/clinic_image.png';
import arrow_right_clinic from '../../../assets/arrow_right_clinic.png';
import edit_primary from '../../../assets/edit_primary.png';
import inclinic_consult from '../../../assets/inclinic_consult.png';
import { NavigationEvents } from 'react-navigation';
let prevIndex=0;
class AllPrescriptionList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fromNavigate: 'login',
			dataArray: [
				{date:'21 Nov Jun ‘22',visitType:'Clinic Visit',isExpand:false,fileExt:'pdf', pdfurl:'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/1e0f2e1e-a932-11ed-88d2-563711b03f2a.pdf?sv=2018-03-28&sr=f&sig=ot1sT1k%2FdFIEXdvTDhwYaDuVYAP5b1mrOpInmDjvWms%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&638116244226570625' },
				{date:'21 Nov Jun ‘22',visitType:'Clinic Visit',isExpand:false,fileExt:'pdf',pdfurl:'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/1e0f2e1e-a932-11ed-88d2-563711b03f2a.pdf?sv=2018-03-28&sr=f&sig=ot1sT1k%2FdFIEXdvTDhwYaDuVYAP5b1mrOpInmDjvWms%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&638116244226570625' },
				{date:'21 Nov Jun ‘22',visitType:'Clinic Visit',isExpand:false,fileExt:'pdf',pdfurl:'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/1e0f2e1e-a932-11ed-88d2-563711b03f2a.pdf?sv=2018-03-28&sr=f&sig=ot1sT1k%2FdFIEXdvTDhwYaDuVYAP5b1mrOpInmDjvWms%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&638116244226570625' },
				{date:'21 Nov Jun ‘22',visitType:'Clinic Visit',isExpand:false,fileExt:'pdf',pdfurl:'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/1e0f2e1e-a932-11ed-88d2-563711b03f2a.pdf?sv=2018-03-28&sr=f&sig=ot1sT1k%2FdFIEXdvTDhwYaDuVYAP5b1mrOpInmDjvWms%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&638116244226570625' },
				{date:'21 Nov Jun ‘22',visitType:'Clinic Visit',isExpand:false,fileExt:'pdf',pdfurl:'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/1e0f2e1e-a932-11ed-88d2-563711b03f2a.pdf?sv=2018-03-28&sr=f&sig=ot1sT1k%2FdFIEXdvTDhwYaDuVYAP5b1mrOpInmDjvWms%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&638116244226570625' },],
				downloadFileUrl:'https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/1e0f2e1e-a932-11ed-88d2-563711b03f2a.pdf?sv=2018-03-28&sr=f&sig=ot1sT1k%2FdFIEXdvTDhwYaDuVYAP5b1mrOpInmDjvWms%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&638116244226570625'
		};
	}
	componentDidMount() {
		// from=this.props.navigation.state.params.from;
		// console.log('---------++++++'+from);
		// alert(from)
		//this.resentOTP();
		this.clickOnShowPreview(this.state.dataArray[0])
	}
	clickOnShowPreview = (item) => {
		// alert(JSON.stringify(item))
		if (Platform.OS == 'ios' && item.fileExt == 'pdf') {
		  this.setState({ fileExt: 'pdf' })
		  this.downloadFileForIos(item);
	
		} else {
		  if (item.fileExt != 'pdf') {
			this.setState({ fileExt: 'png', downloadFileUrl: item.pdfurl })
		  } else {
			this.setState({ fileExt: 'pdf', downloadFileUrl: item.pdfurl })
			this.setState({
			  resources: {
				url: item.pdfurl
			  }
			})
		  }
		}
	  }
	  
  downloadFileForIos = (item) => {
    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', item.pdfurl, {})
      .then((res) => {
        RNFS.readFile(res.path(), "base64").then(result => {
          this.setState({ fileSavePathIOS: result })

        })
      })
      .catch((e) => {
        //console.log(e)
      });
    this.setState({ downloadFileUrl: item.pdfurl });
  }
	resentOTP = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			userGuid: null,
			version: null,

			Data: {
				"Reference": signupDetails.mobile,
				"UserGuid": signupDetails.UserGuid
			}
		};
		actions.callLogin('V11/FuncForDrAppToSaveAndSendOTP', 'post', params, 'token', 'ResentOtpForLogin');
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'verifyOtpForLogin') {

			}
		}

	}
	expandCollapse=(item, index )=>{
		let tmpArr=[...this.state.dataArray];
		//tmpArr[prevIndex].isExpand=false;
		tmpArr[index].isExpand=!tmpArr[index].isExpand;
		//item.isExpand=!item.isExpand;
		this.setState({dataArray:tmpArr});
		//prevIndex=index;
	}
	renderList = ({ item, index }) => (
		<View style={{marginTop:responsiveHeight(2),marginBottom:responsiveHeight(2)}}>
			<TouchableOpacity style={{ flexDirection: 'row',}} onPress={()=>this.expandCollapse(item, index )}>
			<View style={{ flex: 1,justifyContent:'center' }}>
			<Text style={{ fontFamily: CustomFont.fontName, fontWeight: '500', fontSize: CustomFont.font14, color: Color.patientSearchName }}>21 Nov Jun ‘22</Text>
			<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'normal', fontSize: CustomFont.font12, color: Color.textGrey,marginTop:responsiveHeight(1) }}>Clinic Visit</Text>
				
			</View>
			<View style={{ flex: 2, flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
				<View>
				<Image source={uparrow} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), resizeMode: 'contain' }} />
				</View>

				<TouchableOpacity style={{backgroundColor: Color.primary,borderRadius:6,alignItems:'center',justifyContent:'center',zIndex:999}} onPress={()=>alert('under development')}>
				<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.white,marginLeft:20,marginRight:20,marginTop:15,marginBottom:15  }}>Duplicate</Text>
				</TouchableOpacity>
			</View>
			</TouchableOpacity>
			{item.isExpand? <PDFView
                      fadeInDuration={250.0}
                      style={{ flex: 1, margin: responsiveWidth(4),height:responsiveHeight(40) }}
                      resource={Platform.OS == 'android' ? this.state.downloadFileUrl : this.state.fileSavePathIOS}
                      resourceType={Platform.OS == 'android' ? resourceType : 'base64'}
                    /> :null
			}
		</View>
	);
	renderSeparator = () => {
		return <View style={{height: 1, width: '100%', backgroundColor: Color.lineColor,}} />;
	};
	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar title={"All Prescriptions"} onBackPress={() => this.props.navigation.goBack()} />
				<View style={{ flex: 1,margin: responsiveWidth(6) }}>
					
						<FlatList
							data={this.state.dataArray}
							renderItem={this.renderList}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()}
							ItemSeparatorComponent={this.renderSeparator}
						/>
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
)(AllPrescriptionList);