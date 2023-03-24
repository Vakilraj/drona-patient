import React from 'react';
import {
    SectionList, Image, SafeAreaView,
    StatusBar, Text,
    TouchableOpacity, View, Platform, Alert, ScrollView, FlatList, StyleSheet
} from 'react-native';
import Share from 'react-native-share'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import threedot from '../../../../assets/threeDotBlue.png';

import ShareIcon from '../../../../assets/ic_share.png';
import EditIcon from '../../../../assets/ic_edit.png';
import DeleteIcon from '../../../../assets/ic_delete.png';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import styles from './style';
import CloseIcon from '../../../../assets/cross_blue.png';
import TakeAPhotoIcon from '../../../../assets/ic_camera.png';
import UploadPhotoIcon from '../../../../assets/ic_gallery.png';
import UploadFileIcon from '../../../../assets/ic_upload.png';
import noFiles from '../../../../assets/noFiles.png';
import MultipleImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationEvents } from 'react-navigation';
import Snackbar from 'react-native-snackbar';
import Moment from 'moment';
import { setLogEvent } from '../../../service/Analytics';
import Trace from '../../../service/Trace'
import CustomFont from '../../../components/CustomFont';
import { set } from 'lodash';

let timeRange = '', recordTypeList = '';
class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalShow: false,
            isOperationModalShow: false,
            passwordShowStatus: true,
            alertTxt: '',
            selectedRecordGuid: '',
            fileListArr: [],
            selectedItem: {},
            buttonBoderWidth: 0,
            isSelected: '',
        };
    }
    componentDidMount() {
        // alert("File")
        let { signupDetails } = this.props;

        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'File_List', signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "File_List", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
        setTimeout(() => {
            this.callFileListAPI();
        }, 300)
    }
    componentWillUnmount = async () => {
        // Stop the trace
        Trace.stopTrace()
    }
    callFileListAPI = (RecordTypeGuid) => {
        let { actions, signupDetails } = this.props;
        let patientGuid = this.props.item && this.props.item.patientGuid ? this.props.item.patientGuid : '';
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "PatientGuid": patientGuid,
            "Data": {
                "AppointmentGuid": signupDetails.appoinmentGuid,
                "RecordTypeGuid": RecordTypeGuid ? RecordTypeGuid : null
            }
        }
        actions.callLogin('V14/FuncForDrAppToGetFileInfo_V2', 'post', params, signupDetails.accessToken, 'filelist');
    }
    addClk = () => {
        this.setState({ isModalShow: true, buttonBoderWidth: 1 })
    }
    hideAddPopup = () => {
        this.setState({ isModalShow: false })
    }
    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            let data = newProps.responseData.data;
            if (tagname === 'filelist') {
                if (data != null) {
                    if (newProps.responseData.statusCode === '0') {
                        //alert(JSON.stringify(data.fileInfoYearly))
                        this.setState({ fileListArr: data.fileInfoYearly == null ? [] : data.fileInfoYearly });
                        recordTypeList = data.recordTypeList;
                    }
                }


            } else if (tagname === 'deletefile') {
                if (newProps.responseData.statusCode === '-1') {
                    this.callFileListAPI();
                }
                Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            }
            else if (tagname === 'sharedetails') {
                let strUrl = ''
                if (newProps.responseData.statusCode == 0) {
                    if (data.attachment && data.attachment.length > 0) {
                        for (let i = 0; i < data.attachment.length; i++) {
                            strUrl += '\n \n' + data.attachment[i].attachmentUrl;
                        }
                    }
                }



                setTimeout(() => {
                    let options = {
                        title: 'Share Files',
                        message: 'Share Files :' + strUrl,
                        type: 'text',
                    };
                    Share.open(options)
                        .then((res) => {
                            //console.log('YES ' + JSON.stringify(res));
                        })
                        .catch((err) => {
                            //err && console.log(err);
                        });
                    // Share.open({
                    //     message: 'Share Files :' + strUrl,
                    //     title: 'Share Files',
                    // })
                    // 		.then((res) => {
                    // 			console.log("m,m,m,m,")
                    // 			console.log(res);
                    // 		})
                    // 		.catch((err) => {
                    //             alert(JSON.stringify(err));
                    // 			err && console.log('HI ' + JSON.stringify(err));
                    // 		});


                    // Share.share({
                    //     message: 'Share Files :' + strUrl,
                    //     title: 'Share Files',
                    // })
                }, 1000)

            }
        }
    }
    openGallery = () => {
        let { signupDetails } = this.props;
        setLogEvent("files", { "choose_file_upload": "upload", UserGuid: signupDetails.UserGuid, })
        this.setState({ buttonBoderWidth: 0 })
        let imagArr = [];
        MultipleImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
            multiple: true,
            compressImageQuality: Platform.OS === 'ios' ? .3 : .4
        }).then(image => {
            this.hideAddPopup();

            for (let i = 0; i < image.length; i++) {
                const source = { uri: 'data:image/jpeg;base64,' + image[i].data, type: 'image', size: image[i].size, imgExtn: image[i].mime };
                imagArr.push(source);
            }
            this.props.nav.navigation.navigate('AddFiles', { imageArr: imagArr })
        });
    }
    openDocuments = async () => {
        let { signupDetails } = this.props;
        setLogEvent("files", { "choose_file_upload": "upload", UserGuid: signupDetails.UserGuid, })
        this.setState({ buttonBoderWidth: 0 })
        let imagArr = [];
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf],
            })
                .then(res => {
                    // if(res.uri != undefined){
                    this.hideAddPopup();
                    for (let i = 0; i < res.length; i++) {
                        RNFS.readFile(res[i].uri, "base64").then(result => {

                            const source = { uri: result, type: 'doc', size: res[i].size };
                            imagArr.push(source)
                        })
                    }
                    this.props.nav.navigation.navigate('AddFiles', { imageArr: imagArr })
                })
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }

    }

    openCamera = () => {
        let { signupDetails } = this.props;
        setLogEvent("files", { "choose_file_upload": "upload", UserGuid: signupDetails.UserGuid, })
        this.setState({ buttonBoderWidth: 0 })
        MultipleImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
            compressImageQuality: .5
        }).then(image => {
            this.hideAddPopup();
            this.handleCameraGalleryImage(image);
        });
    }
    handleCameraGalleryImage = (response) => {
        let imagArr = [];
        const source = { uri: 'data:image/jpeg;base64,' + response.data, type: 'image', size: response.size };
        imagArr.push(source)
        this.props.nav.navigation.navigate('AddFiles', { imageArr: imagArr })
    }
    clickOnThreedots = (item) => {
        this.setState({ isOperationModalShow: true, selectedRecordGuid: item.recordGuid });
        this.setState({ selectedItem: item })
    }
    shareClk = () => {
        let { signupDetails } = this.props;
        setLogEvent("files", { "share_file": "click", UserGuid: signupDetails.UserGuid, })
        this.hide();
        let tempRecordGuid = this.state.selectedItem.recordGuid
        this.shareAPICall(tempRecordGuid);

    }
    shareAPICall = (recordGuid) => {
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
        actions.callLogin('V1/FuncForDrAppToGetEditPatientRecord', 'post', params, signupDetails.accessToken, 'sharedetails');
    }
    editClk = (item, index) => {
        let { signupDetails } = this.props;
        setLogEvent("files", { "edit_file": "click", UserGuid: signupDetails.UserGuid, })
        this.hide();
        // this.props.navigation.navigate('AddFiles', { imageArr: [] })
        this.props.nav.navigation.navigate('AddFiles', { imageArr: [], recordGuid: this.state.selectedRecordGuid })
    }
    deleteClk = () => {
        this.hide();
        Alert.alert(
            "Delete Message",
            "Are you sure to delete?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log(""),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        let { signupDetails } = this.props;
                        setLogEvent("files", { "delete_file": "click", UserGuid: signupDetails.UserGuid, })
                        this.callDeleteAPI()
                    }
                }
            ]
        );

    }

    hide = () => {
        this.setState({ isOperationModalShow: false })
    }
    callDeleteAPI = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "Data": {
                "RecordGuid": this.state.selectedRecordGuid
            }
        }
        actions.callLogin('V1/FuncForDrAppToIsDoctorDeleteRecord', 'post', params, signupDetails.accessToken, 'deletefile');
    }
    detail = (item, index) => {
        let { signupDetails } = this.props;
        setLogEvent("files", { "preview_file": "click", UserGuid: signupDetails.UserGuid, })
        //  this.props.navigation.navigate('FilePreview', {selecteditem : item})
        this.props.nav.navigation.navigate('FilePreview', { selecteditem: item })
    }

    changeColor = () => {
        this.setState({ isSelected: true })
    }

    renderItem = (item, index) => {
        let fileDateStr = Moment(item.attachmentDate).format('DD-MMM-YYYY');
        let splitArr = fileDateStr.split('-');
        let dayStr = splitArr[0] + " " + splitArr[1];
        // let monthYrStr = splitArr[1] + ' ' + splitArr[2];
        // let fileDate = 
        return (
            // <View style={styles.lowerContainer}>
            <View style={styles.flatListView}>
                <View style={{ flex: 1, }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', marginBottom: 20 }}
                        onPress={() => this.detail(item, index)}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dayText}>{dayStr}</Text>
                            {/* <Text style={styles.monthText}>{monthYrStr}</Text> */}
                        </View>
                        {/* <View style={{ backgroundColor: Color.divider, width: 1, height: '100%' }}><Text></Text></View> */}
                        <View style={{ flex: 1, marginLeft: 22, marginTop: 0, marginBottom: 0 }}>
                            {/* <View style={{}}> */}
                            <Text numberOfLines={1} style={styles.dName1}>{item.recordTitle}</Text>
                            {/* </View>
                                <View style={{ justifyContent: 'flex-end' }}> */}
                            <Text style={styles.dName}>{item.createdBy}</Text>
                            {/* </View> */}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {/* {!item.isRead ?
                                    <View style={[styles.vStatusContainer, { backgroundColor: Color.liveBg }]}>
                                        <Text style={styles.visitStatus}>New</Text>
                                    </View>
                                    : null
                                } */}
                            <TouchableOpacity onPress={() => this.clickOnThreedots(item)} style={styles.threedot}>
                                <Image style={styles.threedot} source={threedot} />
                            </TouchableOpacity>
                            {/* <Text style = {styles.report}>{item.itemNameCount} Test Reports</Text> */}
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            borderBottomColor: Color.newPurpleLine,
                            borderBottomWidth: 1.5,
                        }}
                    />
                </View>
            </View>
            // </View>
        );
    };

    render() {
        return (
            <SafeAreaView style={[CommonStyle.container, { backgroundColor: Color.white }]}>
                <NavigationEvents onDidFocus={() => {
                    setTimeout(() => {
                        this.callFileListAPI();
                    }, 300)
                }} />
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                <ScrollView >
                    <View style={styles.container}>
                        <View style={{ marginStart: 10, marginEnd: 10, marginTop: 15 }}>
                            <TouchableOpacity onPress={this.addClk}>

                                <Text style={{
                                    color: Color.primary, fontWeight: CustomFont.fontWeight600,
                                    fontSize: CustomFont.font14, fontFamily: CustomFont.fontName
                                }}>Add New</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginStart: 10, marginEnd: 10, marginTop: 15, marginBottom: 15 }}>

                            <FlatList
                                data={recordTypeList}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (

                                    <TouchableOpacity onPress={() => {
                                        this.callFileListAPI(item.recordTypeGuid)
                                        this.setState({ isSelected: item.recordTypeName })
                                    }}>


                                        <View style={{ borderColor: Color.primary, backgroundColor: this.state.isSelected === item.recordTypeName ? Color.primary : null, borderRadius: 20, borderWidth: 1.2, padding: 7, maxWidth: responsiveHeight(20), alignItems: 'center', marginHorizontal: 7 }}>
                                            <Text style={{
                                                color: this.state.isSelected === item.recordTypeName ? Color.white : Color.datecolor, fontWeight: CustomFont.fontWeight400,
                                                fontSize: CustomFont.font14, fontFamily: CustomFont.fontName
                                            }} >{item.recordTypeName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />

                        </View>

                        {
                            this.state.fileListArr.length > 0 ?
                                <View>
                                    <SectionList
                                        stickySectionHeadersEnabled={false}
                                        sections={this.state.fileListArr}
                                        style={{ marginStart: 10, marginEnd: 10, marginBottom: responsiveHeight(1) }}
                                        renderItem={({ item, index }) => this.renderItem(item, index)}
                                        renderSectionHeader={({ section }) => <Text style={styles.yrTxt}>{section.fileYear}</Text>}
                                        keyExtractor={(item, index) => index}
                                    />
                                </View> :
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={noFiles} style={styles.noMedicalFileImage} />
                                    <Text style={styles.headingView}>There are no files added</Text>
                                </View>
                        }
                        <Modal isVisible={this.state.isModalShow} avoidKeyboard={true}>
                            <View style={styles.modelView}>
                                <View style={{ marginBottom: 22, flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, }}>
                                    <Text style={styles.addtxt}>Add File</Text>
                                    <TouchableOpacity style={styles.crossbtn} onPress={() => this.setState({ isModalShow: !this.state.isModalShow, buttonBoderWidth: 0 })}>
                                        <Image style={styles.closeIcon} source={CloseIcon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.rowShare}>
                                    <TouchableOpacity style={styles.btn} onPress={this.openCamera}>
                                        <Image style={styles.optionimg} source={TakeAPhotoIcon} />
                                        <Text style={styles.optiontxt}>Take a photo</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} />

                                <View style={styles.rowShare}>
                                    <TouchableOpacity style={styles.btn} onPress={this.openGallery}>
                                        <Image style={styles.optionimg} source={UploadPhotoIcon} />
                                        <Text style={styles.optiontxt}>Upload from gallery</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} />

                                <View style={styles.rowShare}>
                                    <TouchableOpacity style={styles.btn} onPress={this.openDocuments}>
                                        <Image style={styles.optionimg} source={UploadFileIcon} />
                                        <Text style={styles.optiontxt}>Upload files</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        <Modal isVisible={this.state.isOperationModalShow} avoidKeyboard={true}>
                            <View style={styles.modelView1}>
                                <View style={{ flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, marginBottom: 22 }}>
                                    <Text style={styles.addtxt}>File</Text>
                                    <TouchableOpacity style={styles.crossbtn} onPress={() => this.setState({ isOperationModalShow: !this.state.isOperationModalShow, buttonBoderWidth: 0 })}>
                                        <Image style={styles.closeIcon} source={CloseIcon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.rowShare1}>
                                    <TouchableOpacity style={styles.btn} onPress={() => this.shareClk()}>
                                        <Image style={styles.optionimg} source={ShareIcon} />
                                        <Text style={styles.optiontxt}>Share</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} />

                                <View style={styles.rowShare1}>
                                    <TouchableOpacity style={styles.btn} onPress={this.editClk}>
                                        <Image style={styles.optionimg} source={EditIcon} />
                                        <Text style={styles.optiontxt}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} />

                                <View style={styles.rowShare1}>
                                    <TouchableOpacity style={styles.btn} onPress={this.deleteClk}>
                                        <Image style={styles.optionimg} source={DeleteIcon} />
                                        <Text style={styles.optiontxt}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                    </View>
                </ScrollView>
            </SafeAreaView >

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
)(FileList);

