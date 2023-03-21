import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text, StatusBar,  TouchableOpacity,BackHandler
} from 'react-native';
import styles from './style';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../customviews/Toolbar.js';
import RNQRGenerator from 'rn-qr-generator';
class GenerateQrCode extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			doctorName  :'',
			clinicName  :'',
			qrcodeUrl : ''
		};
	}
	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack();
			try {
				this.props.navigation.state.params.Refresh();
			} catch (error) {
				
			}
            
        })
		let tempClinicName  = this.props.navigation.getParam("cName");
		let tempDoctorName  = this.props.navigation.getParam("dName");
	    this.setState({doctorName : tempDoctorName});
	    this.setState({clinicName : tempClinicName});

		let tempUrl =  this.props.navigation.getParam("codeurl");
		this.setState({qrcodeUrl : tempUrl});
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'saveqrcode') {
				//console.log('Save QRCODE : ' + JSON.stringify(newProps.responseData.data))
				if (newProps.responseData.statusCode == '-1') {
					let data = newProps.responseData.data;
					this.props.navigation.navigate('DisplayQrCode', {qrcode : data.qrCodeImgPath,
						 qrCodeId : data.qrCodeGuid,
						 dName : this.state.doctorName, 
						 cName : this.state.clinicName,
						 qrUrl : this.state.qrcodeUrl,
						 Refresh:null
					})

				}

			}
		}
	}

	generateQRCode = () =>
	{
		RNQRGenerator.generate({
			value: this.state.qrcodeUrl,
			height: 100,
			width: 100,
			base64  :true
		  })
			.then(response => {
			  const { uri, width, height, base64 } = response;
             // qrCodeStr = { uri: 'data:image/jpeg;base64,' + base64 };
			 // this.props.navigation.navigate('DisplayQrCode', {qrcode : 'data:image/jpeg;base64,' + base64})
			 this.callAPIToSaveQRCode(base64);
			})
			.catch(error => console.log('Cannot create QR code', error));
	}
	callAPIToSaveQRCode = (base64) =>{
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid":signupDetails.doctorGuid,
			"Data": {
				"QRCodeImgPath": '',
				"QRCodeGuid": '', 
				"FileBytes": base64, 
			}
		}
		// console.log('Token : ' + signupDetails.accessToken )
		// console.log('Ishan : ' + JSON.stringify(params))
		actions.callLogin('V1/FuncForResetOrSaveGeneratedQRCode', 'post', params, signupDetails.accessToken, 'saveqrcode');
	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"QR Code"}
					onBackPress={() => {
						this.props.navigation.goBack();
						try {
							this.props.navigation.state.params.Refresh();
						} catch (error) {
							
						}
					}}
					isReset={false}
				// onReset={() => this.clickReset()}
				/>
				<View style={{ padding : 15, backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(4), marginBottom: responsiveWidth(.5), borderRadius: 6 }}>
								<View style={{  marginRight: 10 }}>
									<Text style={{ width : responsiveWidth(70), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, }}>Generate a QR code and print it out so that your patients can scan the code for check-in when they visit your clinic.</Text>
									<TouchableOpacity style={{ height: responsiveHeight(5), width: responsiveWidth(50), alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary, marginTop: responsiveHeight(3), marginBottom: responsiveHeight(1) }} 
										onPress={() =>   this.generateQRCode() }
									>
										<Text style={{ fontWeight :CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12 }}>Generate QR Code</Text>
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
)(GenerateQrCode);