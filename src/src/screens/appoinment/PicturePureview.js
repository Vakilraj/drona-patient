import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity, BackHandler
} from 'react-native';
import styles from './style';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';
import CustomFont from '../../components/CustomFont';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Toolbar from '../../customviews/Toolbar.js';
import ImagePicker from 'react-native-image-crop-picker';
import closeImage from '../../../assets/cross_blue.png';
import takePicture from '../../../assets/take_picture.png';
import uploadGallery from '../../../assets/upload_from_gallery.png';
import Modal from 'react-native-modal';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
let isImageEdit = false
let fileName = ''

const PicturePureview = (props) => {
    const [image, setImage] = useState({})
    const [isAddImage, setisAddImage] = useState(false)

    useEffect(() => {
        setImage(props.navigation.getParam("picture"))
        isImageEdit = props.navigation.getParam("isEdit")
        fileName = props.navigation.getParam("fileName")
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

        // for unmount
        return function cleanUp() {
            backHandler.remove();
        }
    }, []);

    const handleBackPress = () => {
        props.navigation.goBack();
        return true;
    }

    const save = () => {
        props.navigation.goBack();

        if (isImageEdit)
            props.navigation.state.params.onImageAdded(image, isImageEdit, fileName);
    }


    const openCamera = () => {
        setisAddImage(false)
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
            compressImageQuality: .5
        }).then(image => {
            handleCameraGalleryImage(image)
        });
    }

    const openGallery = () => {
        setisAddImage(false)
        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
            compressImageQuality: .5
        }).then(image => {
            handleCameraGalleryImage(image)
        });
    }

    const handleCameraGalleryImage = (image) => {
        fileName = image.fileName
        const source = { uri: 'data:image/jpeg;base64,' + image.data };
        setImage(source)
        isImageEdit = true
    }

    return (
        <SafeAreaView style={CommonStyle.safeArea}>
            <View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
                {/* <Loader ref={refs} /> */}
                <Toolbar
                    title={"Picture Preview"}
                    onBackPress={() => props.navigation.goBack()} />
                <View style={{flex:.7}}>
                    <Image source={image} style={{ height: 400, margin:20}} />
                    
                </View>

                <View style={{width:'100%',  alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(22), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0 }}>

                   <TouchableOpacity onPress={() => save()} style={{ width:'90%',  alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(3) }} >
                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center' ,fontWeight:CustomFont.fontWeight600}}>Save </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setisAddImage(true)} style={{ width:'90%', alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, marginTop: responsiveHeight(3),
                    backgroundColor: Color.buttonLightBg }} >
                            <Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font14 ,fontWeight:CustomFont.fontWeight600}}>Take Another Picture</Text>
                        </TouchableOpacity>
                </View>

            </View>




            <Modal isVisible={isAddImage} avoidKeyboard={true}>

                <View style={styles.modelViewCamera}>

                    <View style={{ height: responsiveHeight(3), margin: responsiveHeight(2), justifyContent: 'center', flexDirection: 'row' }}>

                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontWeight: 'bold', fontSize: CustomFont.font18, marginTop: responsiveHeight(1.7), height: responsiveHeight(3), position: 'absolute', left: 0 }}>Upload Photo</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 0, justifyContent: 'center', flexDirection: 'row', }} onPress={() => setisAddImage(false)}>

                            <Image source={closeImage} style={{ height: responsiveHeight(4), width: responsiveWidth(4), marginRight: responsiveWidth(2), marginTop: responsiveHeight(2), resizeMode: 'contain'}} />
                        
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), marginLeft: responsiveHeight(1.5) }} onPress={() => openCamera()}>

                        <Image source={takePicture} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />

                        <Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '500', fontFamily: CustomFont.fontName, color: Color.black }}>Take A Picture</Text>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5) }}></View>

                    <TouchableOpacity style={{ flexDirection: 'row', height: responsiveFontSize(5), alignItems: 'center', marginLeft: responsiveHeight(1.5), marginTop: responsiveHeight(1.5), }} onPress={() => openGallery()}>

                        <Image source={uploadGallery} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

                        <Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '500', fontFamily: CustomFont.fontName, color: Color.black }}>Upload From Gallery</Text>
                    </TouchableOpacity>



                </View>

                {/* <View style={styles.modelViewCamera}>
                    <TouchableOpacity onPress={() => openCamera()} style={styles.row1Camera}>
                        <View style={styles.iconView}>
                            <Image style={styles.imageIcon} source={CameraIcon} />
                        </View>
                        <Text style={styles.rowTxt}>Take a photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openGallery()} style={styles.row2}>
                        <View style={styles.iconView}>
                            <Image style={styles.imageIcon} source={GalleryIcon} />
                        </View>
                        <Text style={styles.rowTxt}>Upload from gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setisAddImage(false)} style={styles.row2}>
                        <View style={styles.iconViewCancel}>
                            <Image style={styles.imageIconCancel} source={CloseIconGrey} />
                        </View>
                        <Text style={[styles.rowTxt, { fontColor: Color.mostLightGrey, opacity: 0.8 }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            */}
            </Modal>
        </SafeAreaView>
    );
}
// export default AboutUs
const mapStateToProps = state => ({
    signupDetails: state.signupReducerConfig.signupDetails,
    responseData: state.apiResponseDataConfig.responseData,
    loading: state.apiResponseDataConfig.loading,
});
const ActionCreators = Object.assign({}, apiActions, signupActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch), });
export default connect(mapStateToProps, mapDispatchToProps,)(PicturePureview);