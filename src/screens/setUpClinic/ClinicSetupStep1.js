import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	Alert,
	StatusBar, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, FlatList, Platform, BackHandler, Linking
} from 'react-native';
import styles from './style';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import Validator from '../../components/Validator';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import camera from '../../../assets/clinic_primary.png';
import assistantWarning from '../../../assets/assistant_warning.png';
import Snackbar from 'react-native-snackbar';
import ImagePicker from 'react-native-image-crop-picker';
let base64 = null, filename = '';
let slectedCity = '';
import Modal from 'react-native-modal';
import CloseIcon from '../../../assets/cross_blue.png';
import TakeAPhotoIcon from '../../../assets/ic_camera.png';
import UploadPhotoIcon from '../../../assets/ic_gallery.png';

let fullArrayForCity = [], clinicGuid = null,from='';

class ClinicSetupStep1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSource: null,
			clinicName: '',
			primaryNumber: '',
			cityName: '',
			keyboardAvoiding: 0,
			actionArr: [],
			fld1: Color.newBorder,
			fld2: Color.newBorder,
			fld3: Color.newBorder,
			fld4: Color.newBorder,
			fld5: Color.newBorder,
			fld6: Color.newBorder,
			fld7: Color.newBorder,
			cityArr: ['del'],
			listShowStatusCity: false,
			assistantNumber: '',
			isModalShowBrowseImage:false
		};
		base64 = null;
		filename = '';
	}
	async componentDidMount() {
		from=this.props.navigation.state.params.from;
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Version": "",
			"Data": {
				"stateGuId": null,
				//CityName:'de'
				//"stateGuId": this.props.navigation.state.params.selectedState,
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetCityList', 'post', params, signupDetails.accessToken, 'cityListForClinic');
		console.log('++++++++'+from)
		if(from=='add'){
			clinicGuid=null;
			slectedCity=null;
			base64=null;
			this.setState({clinicName:'',assistantNumber:'',cityName:''});
		}else{
			actions.callLogin('V1/FuncForDrAppToGetClinicDetailsStep1', 'post', params, signupDetails.accessToken, 'GetClinicAccessMasterStep1');
		}
		
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'cityListForClinic') {
				let speciaArr = newProps.responseData.data;
				let tempArr = [];
				for (let i = 0; i < speciaArr.length; i++) {
					tempArr.push({ label: speciaArr[i].cityName, value: speciaArr[i].cityGuId })
				}
				fullArrayForCity = speciaArr;
				this.setState({ cityArr: tempArr });

			} else if (tagname == 'GetClinicAccessMasterStep1') {
				let clinicData = newProps.responseData.data;
				clinicGuid = clinicData.clinicGuid;
				slectedCity = clinicData.cityGuid;
				this.setState({ actionArr: clinicData.staffAccessMaster });
				if (clinicData.clinicImageUrl)
					this.setState({ imageSource: clinicData.clinicImageUrl });
				this.setState({ clinicName: clinicData.clinicName, cityName: clinicData.clinicCity, assistantNumber: clinicData.assistantPhoneNumber });
			} else if (tagname == 'AddStep1ClinicDetails') {
				if (newProps.responseData.statusCode == -1 || newProps.responseData.statusCode == 0) {
					let { actions, signupDetails } = this.props;
					signupDetails.clinicGuid = newProps.responseData.data.clinicGuid;
					signupDetails.doctorGuid = newProps.responseData.data.doctorGuid;
					actions.setSignupDetails(signupDetails);
					DRONA.setClinicGuid(newProps.responseData.data.clinicGuid);
					clinicGuid=newProps.responseData.data.clinicGuid; // if user back and save again
					this.props.navigation.pop(); //for remove endless loop issue
					this.props.navigation.navigate('ClinicSetupStep2', { from: 'first' }); //from=='add' ? 'add':
				} else {
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
					}, 1000)
				}

			}
		}
	}
	callOnFocus = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.primary })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.primary })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.primary })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.primary })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.primary })
		}
		else if (type == '6') {
			this.setState({ fld6: Color.primary })
		}
		else if (type == '7') {
			this.setState({ fld6: Color.primary })
		}

	}
	callOnBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.inputdefaultBorder })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.inputdefaultBorder })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.inputdefaultBorder })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.inputdefaultBorder })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.inputdefaultBorder })
		}
		else if (type == '6') {
			this.setState({ fld6: Color.inputdefaultBorder })
		}
		else if (type == '7') {
			this.setState({ fld6: Color.inputdefaultBorder })
		}

	}


	handleBackPress = () => {
		return true;
	}
	BrowseImage() {
		this.setState({isModalShowBrowseImage:true})
		// var options = {
		// 	title: 'Select Profile Picture',
		// 	storageOptions: {
		// 		skipBackup: true,
		// 		path: 'images',
		// 	},
		// };
		// ImagePicker.showImagePicker(options, response => {
		// 	if (response.didCancel) {
		// 		//console.log('User cancelled image picker');
		// 	} else if (response.error) {
		// 		//console.log('ImagePicker Error: ', response.error);
		// 	} else if (response.customButton) {
		// 		//console.log('User tapped custom button: ', response.customButton);
		// 	} else {
		// 		//let sizeInMb=response.fileSize > 0 ? response.fileSize/1000000 :0;
		// 		//alert(sizeInMb)
		// 		// if(sizeInMb > 10) {
		// 		// 	alert('Maximum file upload size allowed is 10 MB')
		// 		// }else{
		// 			base64 = response.data;
		// 			filename = response.fileName;
		// 			//fileType = response.type;
		// 			//imagArr.push(source)
		// 			this.setState({ imageSource: response.uri });
		// 		//}
		// 		//const source = { uri: response.uri };
				
		// 	}
		// });
	}
	openCamera = () => {
        // this.setState({ isAddImage: false })
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
			compressImageQuality: .5,	
        }).then(image => {
            this.handleCameraGalleryImage(image);
            
        });
    }
    openGallery = () => {

        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
            // multiple : true,
            compressImageQuality: .5
        }).then(image => {
            this.handleCameraGalleryImage(image)
        });
    }

    handleCameraGalleryImage = (image) => {
        const source = { uri: 'data:image/jpeg;base64,' + image.data };
		this.setState({ imageSource: source.uri });
		base64 = image.data;

		let fileExtFromBase64=base64 && base64.startsWith("iV") ?'.png':'.jpeg'
		filename='Clinic'+new Date().getTime()+fileExtFromBase64;

				this.setState({ isModalShowBrowseImage: false })
    }
	gotoNext = () => {
		let { actions, signupDetails } = this.props;
		if (!this.state.clinicName) {
			Snackbar.show({ text: 'Please enter clinic name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!slectedCity) {
			Snackbar.show({ text: 'Please select city', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}else if (this.state.assistantNumber && signupDetails.mobile == this.state.assistantNumber) {
			Snackbar.show({ text: 'Primary phone number and Assistant no. should not be same', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (this.state.assistantNumber && this.state.assistantNumber.length!=10) {
			Snackbar.show({ text: 'Assistant mobile number should be 10 digit', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			let { actions, signupDetails } = this.props;
			let fileExtFromBase64=base64 && base64.startsWith("iV") ?'.png':'.jpeg'
			let fileNameCustom='Clinic'+new Date().getTime()+fileExtFromBase64;
			
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": null,
				"Data": {
					"ClinicGuid": clinicGuid,
					"CityGuid": slectedCity,
					"ClinicName": this.state.clinicName.trim(),
					"PrimaryNumber": signupDetails.mobile,
					"AssistantPhoneNumber": this.state.assistantNumber,
					"ClinicCity": this.state.cityName,
					"Attachment": {
						"FileGuid": null,
						"OrgFileName": fileNameCustom,
						"OrgFileExt": fileExtFromBase64,
						"SysFileName": null,
						"SysFileExt": null,
						"FileBytes": base64 ? base64 : null,
						"RefType": null,
						"RefId": null,
						"SysFilePath": null,
						"DelMark": 0,
						"UploadedOnCloud": 0
					}
				}
			}
			//console.log(JSON.stringify(params));
			actions.callLogin('V11/FuncForDrAppToAddStep1ClinicDetails', 'post', params, signupDetails.accessToken, 'AddStep1ClinicDetails');
		}

	}
	clickOnCity = (item) => {
		slectedCity = item.cityGuId;
		this.setState({ cityName: item.cityName, listShowStatusCity: false });
	}
	SearchFilterFunctionForCity = (text) => {
		var searchResult = _.filter(fullArrayForCity, function (item) {
			return item.cityName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		this.setState({
			cityArr: searchResult, cityName: text, listShowStatusCity: true
		});
	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={[CommonStyle.container, { backgroundColor: Color.newBgColor }]}>
				{/* <NavigationEvents onDidFocus={() => this.getPatientData()} /> */}
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Color.white, alignItems: 'center', zIndex: 999, }} onPress={() =>{
					if(from=='add')
					this.props.navigation.navigate('ChooseClinicBeforeEdit');
					} }>
						{from=='add' ? 
				<Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5), tintColor: Color.primary,marginTop:20,marginLeft:10 }} />:null}
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: responsiveWidth(3), fontWeight: Platform.OS == 'ios' ? CustomFont.fontWeight600 : '700',marginTop:20 }}>Clinic Setup</Text>
					
				</TouchableOpacity>
				<View style={{ flexDirection: 'row', backgroundColor: Color.white,paddingTop:7 }}>
					<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: Color.primary, borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(8) }}>
						<Text style={{ color: Color.white, textAlign: 'center', fontSize: CustomFont.font16 }}>1</Text>
					</View>
					<View style={{ flex: 4, justifyContent: 'center' }}>
						<View style={{ width: '100%', height: responsiveWidth(.2), backgroundColor: '#CCC8CF' }} />
					</View>
					<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: '#CCC8CF', borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ color: Color.white, textAlign: 'center', fontSize: CustomFont.font16 }}>2</Text>
					</View>
					<View style={{ flex: 4, justifyContent: 'center' }}>
						<View style={{ width: '100%', height: responsiveWidth(.2), backgroundColor: '#CCC8CF' }} />
					</View>
					<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: '#CCC8CF', borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(7) }}>
						<Text style={{ color: Color.white, textAlign: 'center', fontSize: CustomFont.font16 }}>3</Text>
					</View>
				</View>
				<View style={{ flexDirection: 'row', backgroundColor: Color.white, paddingTop: 5, paddingBottom: 15, justifyContent: 'space-between' }}>
					<Text style={{ color: Color.primary, fontSize: CustomFont.font12,marginLeft: responsiveWidth(3)}}>Clinic Details</Text>
					<Text style={{ color: '#CCC8CF', fontSize: CustomFont.font12 }}>Consultation Timings</Text>
					<Text style={{ color: '#CCC8CF', fontSize: CustomFont.font12, marginRight: responsiveWidth(8) }}>Fees</Text>
				</View>
				<View style={{ flex: 1, paddingBottom: 10, paddingTop: 10, borderRadius: 10, margin: responsiveWidth(4), marginBottom: responsiveHeight(8), backgroundColor: Color.white }}>
					<ScrollView keyboardShouldPersistTaps='always'>
						<View style={{ flex: 1, borderRadius: 10, paddingBottom: 10, backgroundColor: Color.white }}>


							<View style={{ margin: responsiveWidth(4) }}>
								<Text style={{
									fontFamily: CustomFont.fontName,
									fontSize: CustomFont.font14,
									fontWeight: CustomFont.fontWeight700, color: Color.fontColor
								}} onPress={() => this.BrowseImage()}>Clinic Details</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(4) }}>
									<View style={{ flex: 1.5, }}>
										{!this.state.imageSource ? <TouchableOpacity style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), borderColor: Color.grayBorder, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.lightPurple, }}
											onPress={() => this.BrowseImage()}>
											<Image source={camera} style={{ resizeMode: 'contain', height: responsiveFontSize(3), width: responsiveFontSize(3) }} />
										</TouchableOpacity> : <TouchableOpacity onPress={() => this.BrowseImage()}>
											<Image source={{ uri: this.state.imageSource }} style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8) }} />


										</TouchableOpacity>}
									</View>
									<View style={{ flex: 7, marginLeft: 30 }}>
										<Text style={{
											fontFamily: CustomFont.fontName,
											fontSize: CustomFont.font14,
											fontWeight: CustomFont.fontWeight700, color: Color.primary, marginTop: 0
										}} onPress={() => this.BrowseImage()}>Add Clinic Photo</Text>

									</View>
								</View>

								<Text style={styles.inputHeader}>Clinic Name *</Text>
								<TextInput returnKeyType="done"
									maxLength={50}
									onBlur={() => this.callOnBlur('1')}
									placeholderTextColor={Color.placeHolderColor}
									style={[styles.createInputStyle, { borderColor: this.state.fld1, }]} placeholder="Enter Name" onChangeText={clinicName => {
										this.setState({ clinicName })
									}} onSubmitEditing={() => this.refs.city.focus()} value={this.state.clinicName} ref='cname' onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-100), fld1: Color.primary })} />

								<Text style={styles.inputHeader}>City *</Text>
								<TextInput returnKeyType="done"

									onBlur={() => this.callOnBlur('6')}
									placeholderTextColor={Color.placeHolderColor}
									style={[styles.createInputStyle, { borderColor: this.state.fld6, }]} placeholder="Enter city" onChangeText={(cityName) => { return this.SearchFilterFunctionForCity(cityName); }} ref='city' onSubmitEditing={() => this.refs.assistant.focus()} value={this.state.cityName} onFocus={() => this.setState({ keyboardAvoiding: -50, fld6: Color.primary })} />
								<View style={{ flexDirection: 'column', borderRadius: 7 }}>
									{this.state.listShowStatusCity ? <View>
										<FlatList style={{ marginTop: responsiveHeight(1.3), backgroundColor: '#fafafa' }}
											data={this.state.cityArr}
											renderItem={({ item, index }) => (
												<TouchableOpacity style={{ justifyContent: 'flex-start', }}
													onPress={() => this.clickOnCity(item)}>
													<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: 20, marginBottom: responsiveHeight(1.3) }}>{item.cityName}</Text>
												</TouchableOpacity>
											)}
											keyExtractor={(item, index) => index.toString()}
										/>
									</View> : null}
								</View>

								<Text style={styles.inputHeader}>Primary Phone Number *</Text>
								<Text style={styles.createInputStyleMobile}>+91 {signupDetails.mobile}</Text>

								<Text style={styles.inputHeader}>Assistant Phone Number</Text>
								<View style={{height:responsiveHeight(6), flexDirection:'row',alignItems:'center' , borderColor: this.state.fld2 , borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2)}}>
									<Text style={{ fontSize: CustomFont.font12, color: Color.headingTxtClr, zIndex: 99, marginLeft: 10 }}>+91</Text>
									<TextInput 
										onChangeText={(text) => {
											if (text) {
												if (Validator.isMobileValidate(text)) {
													this.setState({ assistantNumber:text.toString() });
												}else{
													this.setState({ assistantNumber:''});
												}
											} else
												this.setState({ assistantNumber:'' });
										}}
										value={this.state.assistantNumber}
										keyboardType={'phone-pad'}
										returnKeyType="done"
										onBlur={() => this.callOnBlur('2')}
										placeholderTextColor={Color.placeHolderColor}
										style={{height: responsiveHeight(6), fontSize: CustomFont.font14, color: Color.headingTxtClr, paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0, opacity: .7,width:'100%'}} placeholder="Enter Assistant Phone Number" ref='assistant' maxLength={10} />

								</View>

								{this.state.actionArr && this.state.actionArr.length > 0 ?
									<View style={{ borderRadius: 10, backgroundColor: Color.profileBg, marginTop: responsiveHeight(3), paddingBottom: responsiveHeight(2) }}>

										<View style={{ flexDirection: 'row', margin: responsiveWidth(3), marginBottom: responsiveWidth(1), alignItems: 'center' }}>

											<Image source={assistantWarning} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />

											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: '400', marginLeft: 10 }}>Your assistants can always perform{'\n'}the following actions:</Text>

										</View>

										{this.state.actionArr.map((value, index) => {
											return <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: responsiveWidth(10), marginTop: responsiveWidth(2) }}>
												<View style={{
													borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
													width: 5,
													height: 5,
													backgroundColor: Color.optiontext,
													justifyContent: 'center',
													alignItems: 'center'
												}}></View>
												<Text style={styles.actionTitle}>{value.accessFunction}</Text>
											</View>
										})}
									</View> : null}
							</View>


						</View>

					</ScrollView>
				</View>
				<View style={{ marginLeft: responsiveWidth(-1), borderTopLeftRadius: 10, borderTopRightRadius: 10, position: 'absolute', bottom: -5, alignItems: 'center', justifyContent: 'center', width: responsiveWidth(101), backgroundColor: Color.white }}>
					<TouchableOpacity style={{ width: responsiveWidth(93), alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.5), backgroundColor: Color.primary, marginBottom: responsiveHeight(4), marginTop: responsiveHeight(2) }} onPress={() => {
						//this.props.navigation.goBack()
						this.gotoNext();
					}}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save & Continue</Text>
					</TouchableOpacity>
				</View>

				<Modal isVisible={this.state.isModalShowBrowseImage} avoidKeyboard={true}>
                            <View style={CommonStyle.modelViewBrowse}>
						<View style={{ marginBottom: responsiveHeight(20) }}>
                                <View style={{ marginBottom: 22, flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, }}>
                                    <Text style={CommonStyle.addtxt}>Browse Image</Text>
                                    <TouchableOpacity style={CommonStyle.crossbtn} onPress={() => this.setState({ isModalShowBrowseImage: false })}>
                                        <Image style={CommonStyle.closeIcon} source={CloseIcon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={CommonStyle.rowShare}>
                                    <TouchableOpacity style={CommonStyle.btn} onPress={this.openCamera}>
                                        <Image style={CommonStyle.optionimg} source={TakeAPhotoIcon} />
                                        <Text style={CommonStyle.optiontxt}>Take a photo</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={CommonStyle.divider} />

                                <View style={CommonStyle.rowShare}>
                                    <TouchableOpacity style={CommonStyle.btn} onPress={this.openGallery}>
                                        <Image style={CommonStyle.optionimg} source={UploadPhotoIcon} />
                                        <Text style={CommonStyle.optiontxt}>Upload from gallery</Text>
                                    </TouchableOpacity>
                                </View>
                               </View>
                            </View>
                        </Modal>
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
)(ClinicSetupStep1);
