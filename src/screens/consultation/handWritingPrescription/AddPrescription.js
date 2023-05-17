import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    Image, TextInput, FlatList,
    TouchableOpacity, Alert, Platform
} from 'react-native';
import styles from './style';
import Color from '../../../components/Colors';
import CustomButton from '../../../customviews/CustomButton';
import CommonStyle from '../../../components/CommonStyle.js';
import CustomFont from '../../../components/CustomFont';
import Modal from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Toolbar from '../../../customviews/Toolbar.js';
import CrossIcon from '../../../../assets/close_white1.png';
import AddIcon from '../../../../assets/plus_blue.png';
import PdfIcon from '../../../../assets/fileimg/pdficon.png';
import CloseIcon1 from '../../../../assets/cross_blue.png';
import TakeAPhotoIcon from '../../../../assets/ic_camera.png';
import UploadPhotoIcon from '../../../../assets/ic_gallery.png';
import UploadFileIcon from '../../../../assets/ic_upload.png';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
let selectedImageUrl = '';
import MultipleImagePicker from 'react-native-image-crop-picker';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFS from 'react-native-fs';
import Snackbar from 'react-native-snackbar';
import ImageZoom from 'react-native-image-pan-zoom';

import RNFetchBlob from 'rn-fetch-blob';
let isFirstAdd = 0;
let isAddOREditCase = '';
let appointmentStatus = '';

class AddPrescription extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isModalShow: false,
            fullAttachmentArr: [],
            fullImageurl: '',
        }
    }

    componentDidMount() {
        isFirstAdd = 0;
        tempImageArr = [];
        appointmentStatus =  this.props.navigation.state.params.appStatus;
        isAddOREditCase =  this.props.navigation.state.params.isAddOrEdit;
        if(this.props.navigation.state.params.imageArr != null)
        {
            if (this.props.navigation.state.params.imageArr.length == 0) 
            {
                recordGuid = this.props.navigation.state.params.recordGuid;
    
                // If Image select option is need to remove by click on upload
                // handwritten prescripn in previos screen otherwise need to 
                //comment the next 4 lines
                let tempArr = [];
                tempArr.push('##');
                tempImageArr = tempArr
                this.setState({ data: tempArr });
            }
            else 
            {
                setTimeout(() => {
                    let tempArr = [];
                    let tempRecordArr = [...this.props.navigation.state.params.imageArr];
                    for (let i = 0; i < tempRecordArr.length; i++) {
                        let tempObj = {};
                        let dataObj = tempRecordArr[i];
                        tempObj.uri = dataObj.attachmentUrl;
                        tempObj.attachmentGuid = null;
                        tempObj.recordGuid = null
                        tempObj.orgFileName = null
                        tempObj.orgFileExt = null
                        tempObj.sysFileName = null
                        tempObj.sysFileExt = null
                        tempObj.fileBytes = null
                        tempObj.sysFilePath = null
                        tempObj.delMark = null
                        tempObj.DelMark = 0;
                        tempObj.uploadedOnCloud = null;
                        tempObj.type = 'image';
                        tempArr.push(tempObj)
    
                    }
                    tempImageArr = tempArr;
                    tempArr.push('##');
                    this.setState({ data: tempArr });
                    //Newly Added
                    this.setState({ fullAttachmentArr: tempArr })
                    this.showFullImage(tempArr[0], 0)
                }, 500);
    
            }
        }
        else{
            let tempArr = [];
            tempArr.push('##');
            tempImageArr = tempArr
            this.setState({ data: tempArr });
        }
        
    }


    handleApi = (response, tag, statusMessage) => {
        if (tag === 'getCommentList') {
            if (response != null) {

            }
        }
    }

    hideAddPopup = () => {
        this.setState({ isModalShow: false })
    }
    
    add = () => {
        if( this.state.data.length >= 5){
           
        }
        else{
            this.setState({ isModalShow: true })
        }
       
    }

    openCamera = () => {
        MultipleImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
            compressImageQuality: .5
        }).then(image => {
            this.hideAddPopup();
            this.handleCameraGalleryImage(image);
            console.log('---image-++----'+JSON.stringify(image));
        });

        // this.hideAddPopup();
        // var options = {
        //     title: 'Select Profile Picture',
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images',
        //     },
        //     quality:Platform.OS === 'ios' ? .3 : .4,
        // };
        // ImagePicker.launchCamera(options, response => {
        //     if (response.didCancel) {
        //         //console.log('User cancelled image picker');
        //     } else if (response.error) {
        //         //console.log('ImagePicker Error: ', response.error);
        //     } else if (response.customButton) {
        //         //console.log('User tapped custom button: ', response.customButton);
        //     } else {
        //         this.hideAddPopup();
        //         // const source = { uri: 'data:image/jpeg;base64,' + response.data, type: 'image' };
        //         const source = { uri: response.uri, type: 'image',size : response.fileSize,imgExtn: response.type };
        //         //
        //          // Added code for base 64 of the image on 05.04.2022
        //          let sourceForBase64 = {uri:  response.data};
        //          //
        //         let tempObj = {};
        //         tempObj.uri = source.uri;
        //         tempObj.attachmentGuid = null;
        //         tempObj.recordGuid = null
        //         tempObj.orgFileName = null
        //         tempObj.orgFileExt = null
        //         tempObj.sysFileName = null
        //         tempObj.sysFileExt = null
        //         // tempObj.fileBytes = null
        //         tempObj.fileBytes = sourceForBase64.uri
        //         tempObj.sysFilePath = null
        //         tempObj.delMark = null
        //         tempObj.DelMark = 0;
        //         tempObj.uploadedOnCloud = null;
        //         tempObj.type = source.type;
        //         tempObj.size = source.size;
        //         tempObj.imgExtn = source.imgExtn;
        //         if (isFirstAdd === 0) {
        //             isFirstAdd = 1;
        //             galArr = [...tempImageArr];
        //             galArr.splice(galArr.length - 1, 0, tempObj)
        //         }
        //         else {
        //             galArr.splice(galArr.length - 1, 0, tempObj)
        //         }
        //         // this.setState({ data: galArr });
        //         this.setState({ fullAttachmentArr: galArr });
        //         //
        //         let tempArr = [];
        //         for (let k = 0; k < galArr.length - 1; k++) {
        //             let tempObj = {};
        //             tempObj = galArr[k];
        //             if (tempObj.DelMark == 0) {
        //                 tempArr.push(tempObj);
        //             }
        //         }
        //         tempArr.push('##');
        //         this.setState({ data: tempArr });
        //         this.showFullImage(tempArr[0], 0)
        //     }
        // });
    }
    handleCameraGalleryImage = (response) => {
        let fileExtFromBase64=response.data && response.data.startsWith("iV") ?'.png':'.jpeg'
        const source = { uri: response.path, type: 'image',size : response.size,imgExtn: fileExtFromBase64 };
         //const source = { uri: response.uri, type: 'image',size : response.fileSize,imgExtn: response.type };
         let sourceForBase64 = {uri:  response.data};
         //
        let tempObj = {};
        tempObj.uri = source.uri;
        tempObj.attachmentGuid = null;
        tempObj.recordGuid = null
        tempObj.orgFileName = null
        tempObj.orgFileExt = null
        tempObj.sysFileName = null
        tempObj.sysFileExt = null
        // tempObj.fileBytes = null
        tempObj.fileBytes = sourceForBase64.uri
        tempObj.sysFilePath = null
        tempObj.delMark = null
        tempObj.DelMark = 0;
        tempObj.uploadedOnCloud = null;
        tempObj.type = source.type;
        tempObj.size = source.size;
        tempObj.imgExtn = source.imgExtn;
        if (isFirstAdd === 0) {
            isFirstAdd = 1;
            galArr = [...tempImageArr];
            galArr.splice(galArr.length - 1, 0, tempObj)
        }
        else {
            galArr.splice(galArr.length - 1, 0, tempObj)
        }
        // this.setState({ data: galArr });
        this.setState({ fullAttachmentArr: galArr });
        //
        let tempArr = [];
        for (let k = 0; k < galArr.length - 1; k++) {
            let tempObj = {};
            tempObj = galArr[k];
            if (tempObj.DelMark == 0) {
                tempArr.push(tempObj);
            }
        }
        tempArr.push('##');
        this.setState({ data: tempArr });
        this.showFullImage(tempArr[0], 0)
    }
    openGallery = () => {
        // NEW CODE
        let imagArr = [];
        // this.setState({ data: [] });
        MultipleImagePicker.openPicker({
            // cropping: true,
            maxFiles : "4",
            mediaType: "photo",
            includeBase64: true,
            multiple: true,
            compressImageQuality: Platform.OS === 'ios' ? .3 : .4,
        }).then(image => {
            this.hideAddPopup();
            // if(image && image.length>0 && (image[0].path.includes('jpg') || image[0].path.includes('jpeg') || image[0].path.includes('png'))){
            // }else{
            // }
            for (let i = 0; i < image.length; i++) {
                // let source = { uri: 'data:image/jpeg;base64,' + image[i].data, type: 'image' };
                let source = { uri:  image[i].path, type: 'image',size: image[i].size,imgExtn: image[i].mime };
                // Added code for base 64 of the image on 05.04.2022
                let sourceForBase64 = {uri:  image[i].data};
                //
                let tempObj = {};
                tempObj.uri = source.uri;
                tempObj.attachmentGuid = null;
                tempObj.recordGuid = null
                tempObj.orgFileName = null
                tempObj.orgFileExt = null
                tempObj.sysFileName = null
                tempObj.sysFileExt = null
                //tempObj.fileBytes = null
                tempObj.fileBytes = sourceForBase64.uri
                tempObj.sysFilePath = null
                tempObj.delMark = null
                tempObj.DelMark = 0;
                tempObj.uploadedOnCloud = null;
                tempObj.type = source.type;
                tempObj.size = source.size;
                tempObj.imgExtn = source.imgExtn;
                if (isFirstAdd === 0) {
                    isFirstAdd = 1;
                    galArr = [...tempImageArr];
                    galArr.splice(galArr.length - 1, 0, tempObj);
                }
                else {
                    galArr.splice(galArr.length - 1, 0, tempObj)

                }
                // this.setState({ data: galArr });
              
                this.setState({ fullAttachmentArr: galArr });


            }
            //
            let tempArr = [];
            for (let k = 0; k < galArr.length - 1; k++) {
                let tempObj = {};
                tempObj = galArr[k];
                if (tempObj.DelMark == 0) {
                    tempArr.push(tempObj);
                }
            }
            tempArr.push('##');
            this.setState({ data: tempArr });
           // alert(tempArr[0].uri)
            this.showFullImage(tempArr[0], 0)
            //
        });
    }
    openDocuments = async () => {
        Snackbar.show({ text: 'Please Select Images only', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
    }

    removeImage = (item, index) => {
        this.deleteImage(item, index)
        // Alert.alert(
        //     "Delete Message",
        //     "Are you sure want to delete?",
        //     [
        //         {
        //             text: "Cancel",
        //             onPress: () => console.log(""),
        //             style: "cancel"
        //         },
        //         { text: "OK", onPress: () => this.deleteImage(item, index) }
        //     ]
        // );
    }

    showFullImage = (item, index) => {
          this.setState({fullImageurl : item.uri})
    }

    deleteFullImage = (item, index) =>{
        if(item.uri == this.state.fullImageurl){
            this.setState({fullImageurl : ''})
        }
       
    }

    deleteImage = (item, index) => {
        // alert(index )
        let tempArr = [...this.state.data];
        tempArr.splice(index, 1)
        this.setState({ data: tempArr });
        //  tempImageArr = [...this.state.data];
        //  setTimeout(() => {
        //     tempImageArr = [...this.state.data];
        //  }, 500);
        for (let i = 0; i < this.state.fullAttachmentArr.length; i++) {
            // let tempObj = this.state.data[i];
            let tempObj = this.state.fullAttachmentArr[i];
            if (item.attachmentGuid != null) {
                if (item.attachmentGuid == tempObj.attachmentGuid) {
                    let tempAttchArr = this.state.fullAttachmentArr;
                    // To make DelMark to 1
                    let tempObj = this.state.fullAttachmentArr[i];
                    tempObj.uri = tempObj.uri;
                    tempObj.attachmentGuid = tempObj.attachmentGuid;
                    tempObj.recordGuid = null
                    tempObj.orgFileName = null
                    tempObj.orgFileExt = tempObj.orgFileExt
                    tempObj.sysFileName = null
                    tempObj.sysFileExt = tempObj.orgFileExt
                    tempObj.fileBytes = null
                    tempObj.sysFilePath = null
                    tempObj.delMark = null
                    tempObj.DelMark = 1;
                    tempObj.uploadedOnCloud = null;
                    //
                    tempAttchArr.splice(i, 1, tempObj);
                    this.setState({ fullAttachmentArr: tempAttchArr });
                    break;
                }
            }
            else {
                if (item.attachmentGuid == tempObj.attachmentGuid) {
                    let tempAttchArr = this.state.fullAttachmentArr;
                    tempAttchArr.splice(i, 1);
                    this.setState({ fullAttachmentArr: tempAttchArr });
                    break;
                }

            }
        }
        this.deleteFullImage(item, index)
    }
    goToNextScreen = async () =>{
        // For adding new flow otherwise only else will be remain there
          //console.log("Image Array ==== > " + JSON.stringify(this.state.data))
         // Anup Change
        //  let totalImageSizeInBytes = 0;
        // let sizeInMb =0;
        // try {
        //     for(let i = 0 ; i <= this.state.data.length - 2 ; i++){
        //         let tempObj = this.state.data[i];
        //         totalImageSizeInBytes = totalImageSizeInBytes + tempObj.size;
        //     }
        //      sizeInMb = totalImageSizeInBytes/1000000;
        // } catch (error) {
            
        // }

        if(this.state.data.length == 1){
            Snackbar.show({ text: 'Please select at least one file ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        else if(this.state.data.length > 5){
            Snackbar.show({ text: 'Please select maximum four files ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        }
        // else if (sizeInMb > 10) {
        //     Snackbar.show({ text: 'Maximum file upload size allowed is 10 MB', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        // }
        else{
            let tempArr = [];
            for(let i = 0 ; i < this.state.data.length - 1 ; i ++){
                 let imgUri = '';
                 if(this.state.data[i].fileBytes != null)
                 {
                    //if(Platform.OS=='android'){
                        imgUri = this.state.data[i].uri.replace("file://","");
                       // console.log('File URL : ' + imgUri)
                    //  }else{ 
                    //     imgUri = this.state.data[i].uri;
                    //     console.log('File URL : ' + this.state.data[i].fileBytes)
                    //  } 
                     tempArr.push(imgUri)  
                     if(tempArr.length == this.state.data.length - 1){
                        this.mergeUrlToGeneratePdf(tempArr);
                    }
                 }
                 else
                 {
                    RNFetchBlob.config({
                      fileCache : true,
                   })
                 .fetch('GET', this.state.data[i].uri, {
                    //some headers ..
                   })
                 .then(async (res) => {
                    imgUri = res.path();
                    tempArr.push(imgUri)
                    if(tempArr.length == this.state.data.length - 1){
                        this.mergeUrlToGeneratePdf(tempArr);
                    }
                })
             } 
            } 
        }
    }

    mergeUrlToGeneratePdf = (urlImageArr) =>{
        try {
            const options = {
                imagePaths:urlImageArr,
                name: 'mergepdffile',
                maxSize: { // optional maximum image dimension - larger images will be resized
                    width: 600,
                    height: 800,
                },
                quality: .7, // optional compression paramter
            };
             RNImageToPdf.createPDFbyImages(options).then((pdf) => {
                this.props.navigation.navigate('BillingComplete', { filePath: pdf.filePath , imgArr : this.state.data, prevScreenName : isAddOREditCase == 'add' ? 'handwrittenadd' : 'handwrittenedit',consultId:'' })
             });
            
            
        } catch(e) {
        }
    }

    clickOnEdit = () =>{
        this.props.navigation.goBack();
    }

    render() {
        return (
            <SafeAreaView style={CommonStyle.safeArea}>
                <View style={styles.container}>
                    <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                    <Toolbar
                        title={"Prescription"}
                        onBackPress={() => {
                            this.props.navigation.goBack()
                        }} />
                    <View >
                        <View style={{ marginBottom: 24, }}>
                            <View style={{
                                marginTop: 24, backgroundColor: Color.white,
                                // justifyContent: 'center',
                                justifyContent: 'center',
                                paddingTop: 10, paddingBottom: 10, borderRadius: 10, marginStart: 10, marginEnd: 10
                            }}>
                                <FlatList
                                    extraData={this.state}
                                    data={this.state.data}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    // style={{ marginTop: 10 }}
                                    ItemSeparatorComponent={this.ItemSeparatorView}
                                    renderItem={({ item, index }) => (
                                        index === this.state.data.length - 1 ?
                                            <TouchableOpacity onPress={this.add} >
                                                <View style={[styles.previewadd, {backgroundColor : this.state.data.length > 4 ? Color.lightGrayTxt  : null}]}>
                                                    <Image source={AddIcon} style={{ height: 30, width: 30, tintColor :  this.state.data.length > 4 ? Color.white : Color.primary }} />
                                                    <Text style={[styles.add, {color :  this.state.data.length > 4 ? Color.white : Color.primary }]}>Add File</Text>
                                                </View>
                                            </TouchableOpacity>
                                            : <TouchableOpacity onPress={() => {
                                                this.showFullImage(item, index)
                                            }}  style={[styles.preview, { marginStart: index == 0 ? responsiveWidth(2) : responsiveWidth(0) }]}>
                                                {item.type === 'image' ? <View style={{ paddingTop: 10 }}>
                                                    <Image source={{ uri: item.uri }} style={{ borderRadius: 5, height: 40, width: 40 }} /></View> : <View style={{ padding: 10 }}><Image source={PdfIcon} style={{ height: 80, width: 80, borderRadius: 5 }} /></View>}
                                                <TouchableOpacity onPress={() => {
                                                    let { signupDetails } = this.props;
                                                    // setLogEvent("files", { "delete_files": "click", UserGuid: signupDetails.UserGuid, })
                                                    this.removeImage(item, index)
                                                }} style={styles.imgcross}>
                                                    <Image style={{ height: 16, width: 16 }} source={CrossIcon} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                {
                                    this.state.data.length > 1 ?
                                     this.state.data.length - 1 == 1 ? <Text style = {{marginLeft : responsiveWidth(6.5), marginTop : -15 , color : Color.black,
                                        fontFamily : CustomFont.fontName, fontSize : CustomFont.font14}}>{this.state.data.length - 1}  image uploaded</Text> :
                                    <Text style = {{marginLeft : responsiveWidth(6.5), marginTop : -15 , color : Color.black,
                                        fontFamily : CustomFont.fontName, fontSize : CustomFont.font14}}>{this.state.data.length - 1}  images uploaded</Text>
                                        :null
                                }
                                
                            </View>
                        </View>
                    </View>
                    <View style = {{ marginLeft : responsiveWidth(3), marginRight : responsiveWidth(3)}}>
                    <ImageZoom cropWidth={responsiveWidth(95)}
								cropHeight={responsiveHeight(97)}
								imageWidth={responsiveWidth(97)}
								imageHeight={responsiveHeight(97)}
								enableSwipeDown='y'
								pinchToZoom='y'
								panToMove={false}
								>
                        <Image style={{ width : responsiveWidth(94), resizeMode : 'contain', height: responsiveHeight(60)}} source={{ uri: this.state.fullImageurl }} />
                   </ImageZoom>
                    </View>
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, padding: 10, paddingTop: 20, paddingBottom: 20, backgroundColor: Color.white, borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                       {/* <CustomButton
                           onPress = {this.clickOnEdit}
                            isLight={true}
                            mainStyle={{ flex: 1 }}
                            title={"Edit"} />  */}
                         {/* {appointmentStatus != 'Completed'?     */}
                        <CustomButton
                           onPress = {this.goToNextScreen}
                            mainStyle={{ flex: 2, marginStart: 10 }}
                            title={"Next"} /> 
                         {/* : null } */}
                    </View>
                    <Modal isVisible={this.state.isModalShow} avoidKeyboard={true}>
                        <View style={styles.modelView}>
					<View style={{ marginBottom: responsiveHeight(26) }}>
                            <View style={{ marginBottom: 22, flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, }}>
                                <Text style={styles.addtxt}>Upload Prescription</Text>
                                <TouchableOpacity style={styles.crossbtn} onPress={() => this.setState({ isModalShow: !this.state.isModalShow, buttonBoderWidth: 0 })}>
                                    <Image style={styles.closeIcon} source={CloseIcon1} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rowShare}>
                                <TouchableOpacity style={styles.btn} onPress={this.openGallery}>
                                    <Image style={styles.optionimg} source={UploadPhotoIcon} />
                                    <Text style={styles.optiontxt}>Upload from Gallery</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.divider} />

                            <View style={styles.rowShare}>
                                <TouchableOpacity style={styles.btn} onPress={this.openCamera}>
                                    <Image style={styles.optionimg} source={TakeAPhotoIcon} />
                                    <Text style={styles.optiontxt}>Take a Photo</Text>
                                </TouchableOpacity>
                            </View>

                            
                            {/* <View style={styles.divider} />
                            <View style={styles.rowShare}>
                                <TouchableOpacity style={styles.btn} onPress={this.openDocuments}>
                                    <Image style={styles.optionimg} source={UploadFileIcon} />
                                    <Text style={styles.optiontxt}>Upload files</Text>
                                </TouchableOpacity>
                            </View> */}
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
}
// export default AboutUs
const mapStateToProps = state => ({
    signupDetails: state.signupReducerConfig.signupDetails,
    responseData: state.apiResponseDataConfig.responseData,
    loading: state.apiResponseDataConfig.loading,
});
const ActionCreators = Object.assign({}, apiActions, signupActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch), });
export default connect(mapStateToProps, mapDispatchToProps,)(AddPrescription);