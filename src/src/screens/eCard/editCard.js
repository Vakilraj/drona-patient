import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text, TextInput, TouchableOpacity, FlatList, Image, BackHandler, Platform
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import arrowBack from '../../../assets/back_blue.png';
import downKey from '../../../assets/downKey.png';

import cameraIcon from '../../../assets/cam.png';
import crossIcon from '../../../assets/cross.png';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import ImagePicker from 'react-native-image-crop-picker';
import CommonStyle from '../../components/CommonStyle.js';
			import CloseIcon from '../../../assets/cross_blue.png';
			import TakeAPhotoIcon from '../../../assets/ic_camera.png';
			import UploadPhotoIcon from '../../../assets/ic_gallery.png';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
let cardLanguageGuid = '';
let staticImageUrl = '';
class EditCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            selectedLanguageNumber: 0,
            dName: '',
            cardImage: '',
            dCode: 'dro.na/KritiK',
            imageSource: '',
            languageArr: [],
            curentLanguage: 'English',
            drImageinAssistantEdit: '',
            isModalShowBrowseImage:false

        };
    }
    componentDidMount() {
        cardLanguageGuid = this.props.navigation.state.params.cardLanguageGuid;
        let eCardGuid = this.props.navigation.state.params.eCardsGuid;
        // console.log('cardLanguageGuid--------'+JSON.stringify(cardLanguageGuid));
        // console.log('eCardLanguageGuid--------'+JSON.stringify(eCardLanguageGuid));

        let { actions, signupDetails } = this.props;
        this.setState({ dName: 'Dr. ' + signupDetails.fname + ' ' + signupDetails.lname });
        this.setState({ imageSource: { uri: signupDetails.profileImgUrl } });
        this.setState({ drImageinAssistantEdit: { uri: signupDetails.drProfileImgUrlinAssistantLogin } });

        let params = {
            "RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
            "Version": null,
            "Data": {
                "CardLanguageGuid": cardLanguageGuid,
                "EcardGuid": eCardGuid,
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetEcardDetails_V1', 'post', params, signupDetails.accessToken, 'ecarddetails');
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let data = newProps.responseData.data;
            if (tagname === 'ecarddetails') {
                if (newProps.responseData.statusCode === '0') {
                    // alert(JSON.stringify(data))
                    if (data != null) {
                        this.setState({ cardImage: data.fullImageUrl });
                        // this.setState({dName : data.doctorName})
                        this.setState({ languageArr: data.languageList ? data.languageList : [] });
                        cardLanguageGuid = data.languageList[0].languageGuid;

                        staticImageUrl = data.fullImageUrl;
                    }
                }

            }
        }
    }

    openCamera = () => {
        // this.setState({ isAddImage: false })
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
            compressImageQuality: .5
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
		this.setState({ imageSource: source });
		base64 = image.data;

		let fileExtFromBase64=base64 && base64.startsWith("iV") ?'.png':'.jpeg'
		filename='Clinic'+new Date().getTime()+fileExtFromBase64;

				this.setState({ isModalShowBrowseImage: false })
    }
    typeDName = (text) => {
        this.setState({ dName: text })
    }
    changeLanguageClk = () => {
        this.setState({ isModalVisible: true })
    }
    selectLanguage = (item, index) => {
        cardLanguageGuid = item.languageGuid;
        this.setState({ selectedLanguageNumber: index, curentLanguage: item.languageName })
        // this.changeLanguageAPICall()
    }
    callLanguageAPI = () => {
        if (cardLanguageGuid) {
            this.setState({
                isModalVisible: false,
            })
            this.changeLanguageAPICall()
        } else {
            Snackbar.show({ text: 'Please select language', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });

        }

    }
    changeLanguageAPICall = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "ClinicGuid": null,
            "DoctorGuid": signupDetails.doctorGuid,
            "Version": null,
            "Data": {
                "CardLanguageGuid": cardLanguageGuid,
                "LanguageGuid": cardLanguageGuid,
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetEcardDetails', 'post', params, signupDetails.accessToken, 'ecarddetails');


    }

    renderList = (item, index) => {
        return (

            <TouchableOpacity style={[styles.lRowView, {
                borderWidth: 1, borderColor: this.state.selectedLanguageNumber === index ? Color.liveBg : Color.borderColor,
                backgroundColor: this.state.selectedLanguageNumber === index ? Color.genderSelection : Color.white
            }]} onPress={() => this.selectLanguage(item, index)}>
                {/* <Image style={{ height: responsiveWidth(4), width: responsiveWidth(3) }} source={this.state.selectedLanguageNumber === index ? blueTickIcon : tickIcon} />
                */}
                <Text style={[styles.languageName, { fontSize: this.state.selectedLanguageNumber === index ? CustomFont.font14 : CustomFont.font16 }]}>{item.languageName}</Text>
            </TouchableOpacity>

        )
    }
    closeLanguagePopup = () => {
        this.setState({ isModalVisible: false })
    }
    saveECard = () => {

        if (this.state.dName == '') {
            Snackbar.show({ text: 'Please Enter Your Name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if (this.state.imageSource == '') {
            Snackbar.show({ text: 'Please Select Your Image', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else {
            let tempObj = {};
            tempObj.dName = this.state.dName;
            tempObj.cardImage = staticImageUrl;
            tempObj.doctorImage = this.state.imageSource;
console.log('-------'+JSON.stringify(tempObj))
            this.props.navigation.navigate('PreviewCard', { res: tempObj });
            //     let { actions, signupDetails } = this.props;
            // let tempObj = {};
            // if(base64 != ''){
            //     tempObj.AttachmentGuid = null;
            //     tempObj.OrgFileExt = '.png';
            //     tempObj.OrgFileName = 'testimg';
            //     tempObj.SysFileName = null;
            //     tempObj.SysFileExt = null;
            //     tempObj.FileBytes = base64; 
            // }
            // let params = {
            //     "UserGuid":signupDetails.UserGuid,
            //     "ClinicGuid":null,
            //     "DoctorGuid":signupDetails.UserGuid,
            //     "Version":null,
            //     "Data":{
            //         "CardLanguageGuid":cardLanguageGuid,
            //         "FullImageUrl": this.state.cardImage,
            //         "DoctorName": this.state.dName,
            //         "Attachment": tempObj,
            //         "LanguageGuid": selectedLanguageGuid ,
            //         "EcardCode":null,
            //         "Doctorcode":null,
            //         "LanguageList":null
            //       }
            //     }
            //     console.log('request Params:Anup1 ' + JSON.stringify(params));
            //     actions.callLogin('V1/FuncForDrAppToSaveEcardDetails', 'post', params, signupDetails.accessToken, 'saveecard');
        }


    }

    render() {
        let modalHeight = this.state.languageArr.length <= 3 ? 35 : 62
        let bottomHeight = this.state.languageArr.length <= 3 ? -65 : -40
        let { signupDetails } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.patientBackground }}>
                <View style={{ paddingLeft: responsiveWidth(4), paddingRight: responsiveWidth(4), height: Platform.OS == 'ios' ? 40 : responsiveHeight(7.5), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: Color.white, width: '100%' }}>
                    {/* <View style={{ flexDirection: 'row', flex: 5 }}>
                        <TouchableOpacity style={{ paddingRight: 15, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                        <Text style={styles.headerTxt}>Edit e-Card</Text>
                    </View> */}

                    <View style={{ flexDirection: 'row', flex: 5 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            <Image source={arrowBack} style={{ width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>Edit Card</Text>
                    </View>

                    {/* <View style = {{backgroundColor : 'red', flexDirection : 'row', flex  :3, justifyContent: 'flex-end'}}> 
                          
                        </View> */}
                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }} onPress={this.changeLanguageClk}>
                        {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={this.changeLanguageClk}>
                            <Image source={langIcon} style={{ height: responsiveWidth(6), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={this.saveECard}>
                            <Image source={tickIcon} style={{tintColor:Color.primary, height: responsiveWidth(6), width: responsiveWidth(5) }} />
                        </TouchableOpacity> */}
                        <Text style={{ color: Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, paddingLeft: responsiveHeight(-1), paddingRight: responsiveHeight(1) }}>{this.state.curentLanguage}</Text>
                        <Image source={downKey} style={{ tintColor: Color.primary, height: responsiveWidth(3), width: responsiveWidth(3), resizeMode: 'contain', }} />

                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, margin: responsiveHeight(2), backgroundColor: Color.white, borderRadius: 10, marginBottom: responsiveHeight(12) }}>
                    
                        <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 20, width: '100%' }}>
                            <View style={{ flex: 1, marginLeft: responsiveWidth(3), justifyContent: 'center', alignItems: 'flex-start' }}>
                                {
                                    this.state.imageSource == '' ?
                                        <TouchableOpacity onPress={()=> this.setState({isModalShowBrowseImage:true})} >
                                            <Image source={cameraIcon} style={styles.imageContainer} />
                                        </TouchableOpacity> :
                                        <View style={{ alignItems: 'center' }}>
                                            <TouchableOpacity onPress={()=>this.setState({isModalShowBrowseImage:true})} style={styles.imageContainer}>
                                                <Image source={signupDetails.isAssistantUser ? this.state.drImageinAssistantEdit : this.state.imageSource} style={{ height: '100%', width: '100%', borderRadius: 50 }} />
                                            </TouchableOpacity>
                                        </View>
                                }

                            </View>
                            <View style={{ flex: 3.5, justifyContent: 'center', marginRight: responsiveWidth(3), marginLeft: responsiveWidth(4) }}>
                                <Text style={{
                                    color: Color.optiontext,
                                    fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight500
                                }}>Doctor's Name</Text>
                                <TextInput returnKeyType="done" value={this.state.dName} style={styles.doctorNameInput}
                                     onChangeText={dName => {
                                        this.setState({ dName })
                                    }}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={{flex:1,alignItems:'center'}}>
                                <Image style={{flex:1, width: '98%', borderRadius: 6, resizeMode: 'contain',margin:5 }} source={{ uri: this.state.cardImage }} />
                          
                          
                        </View>

                </View>

                <View style={{ position: 'absolute', bottom: 0, width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(10), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                    <TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 30 }}
                        onPress={this.saveECard}>
                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Next</Text>
                    </TouchableOpacity>
                </View>

                <Modal isVisible={this.state.isModalVisible} >
                    <View style={{ height: responsiveHeight(modalHeight), marginBottom: responsiveHeight(bottomHeight), ...styles.languageModalMainView, }}>
                        <View style={{ width: '100%', flexDirection: 'row', marginTop: 15, marginLeft: 10, }}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                {/* <Image source={langIcon} style={{ height: responsiveWidth(4), width: responsiveWidth(3) }} /> */}
                                <Text style={{ marginLeft: 10, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, color: Color.fontColor }}>Select Language</Text>
                            </View>

                            <View style={{ flexDirection: 'row', paddingRight: 25, flex: 1, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={this.closeLanguagePopup}>
                                    <Image source={crossIcon} style={{ height: responsiveWidth(5), width: responsiveWidth(5) }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: responsiveHeight(8) }}>
                            <FlatList

                                //data={[{ "languageGuid": "25078687-c277-11eb-b68b-0022486b91c8", "languageName": "English" }, { "languageGuid": "4ccb5683-c277-11eb-b68b-0022486b91c8", "languageName": "Hindi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }, { "languageGuid": "601adc99-c277-11eb-b68b-0022486b91c8", "languageName": "Marathi" }]}
                                data={this.state.languageArr}
                                style={{ margin: 12 }}
                                numColumns={3}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => this.renderList(item, index)}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                            //onEndReached={this.loadMoreData}
                            />
                        </View>

                        <View style={{ position: 'absolute', bottom: 10, width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), marginBottom: responsiveHeight(2), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(90), backgroundColor: '#5715D2', }}
                                onPress={this.callLanguageAPI}>
                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
)(EditCard);
