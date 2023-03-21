import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text, StatusBar, BackHandler, TouchableOpacity
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
// import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
// import { ReactSketchCanvas } from "react-sketch-canvas";
// import Sketch from 'react-native-sketch';
import ImagePicker from 'react-native-image-crop-picker';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
//import RNDrawOnScreen from 'react-native-draw-on-screen';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import Snackbar from 'react-native-snackbar';
let eSignatureGuid = '',isDraw=false;
class DrawSignature extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
			isSigned: false
		};
	}
	async componentDidMount() {
		isDraw=false;
		eSignatureGuid = this.props.navigation.getParam("eSignatureGuid");
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
	}

	openCamera = () => {
		ImagePicker.openCamera({
			cropping: true,
			includeBase64: true,
			compressImageQuality: .7,	
		}).then(image => {
			this.handleCameraGalleryImage(image)
		});
	}
	openGallery = () => {
		ImagePicker.openPicker({
			cropping: true,
			includeBase64: true,
			compressImageQuality: .7,
		}).then(image => {
			this.handleCameraGalleryImage(image)
		});
	}
	handleCameraGalleryImage = (image) => {
		const source = { uri: 'data:image/jpeg;base64,' + image.data };
		this.goToPureview(true, source, image.fileName)
	}
	clickReset = () => {
		// this.refs.canvas.clear();
		this.setState({ isSigned: false })
		this.RNDraw.clear();
		isDraw=false;
		//this.refs.ref.clearSignature()
	}
	startSignature = () => {
		this.setState({ isSigned: true })
	}
	getImageData = () => {
	}
	saveSignature = () => {
		let urlString = '';
		this.refs.drawsignature.capture().then((uri) => {
			RNFS.readFile(uri, 'base64').then((res) => {
				urlString = { uri: 'data:image/jpeg;base64,' + res };
				this.props.navigation.navigate('ConfirmSignature', { imageSource: urlString, eSignatureGuid: eSignatureGuid, from : 'draw' })
			});
		});

		//  let test =   this.refs.ref.readSignature();

		//  setTimeout(() => {
		//    alert(test)
		//  }, 500);

		// let urlString = '';
		// this.refs.ref.readSignature().then((uri) => {
		//   RNFS.readFile(uri, 'base64').then((res) => {
		//    // urlString = 'data:image/jpeg;base64,' + res;

		// 	 urlString = { uri: 'data:image/jpeg;base64,' + res };
		// 	//console.log('Madhu ' + urlString)
		// 	this.props.navigation.navigate('ConfirmSignature', {imageSource : urlString})
		//   });
		// });
	}



	handleData = (data) => {
		//alert(data);
	};
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar
					title={"Draw e-Signature"}
					onBackPress={() => this.props.navigation.goBack()}
					isReset={true}
					onReset={() => this.clickReset()} />
				<View style={{ height: responsiveHeight(50), backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(4), borderRadius: 6, borderStyle: 'dashed', borderColor: Color.primary, borderWidth: 1, }}>
					<ViewShot
						snapshotContentContainer={true}
						style={{
							backgroundColor: Color.white,
							height: '100%',
						}}
						ref="drawsignature"
						options={{ format: 'jpg', quality: 0.9 }}>
						<View style={{ flex: 1 }}>
							{/* <RNDrawOnScreen
								penColor={Color.fontColor}
								strokeWidth={3}
								ref={(r) => (this.RNDraw = r)}
								style={{ height: 400, width: 400}}
							/> */}

							<SketchCanvas
								style={{ flex: 1 }}
								strokeColor={Color.fontColor}
								strokeWidth={3}
								onStrokeEnd={()=>{
									isDraw=true;
								}}
								ref={(r) => (this.RNDraw = r)}
							/>
						</View>

					</ViewShot>
				</View>
				<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: responsiveHeight(10), backgroundColor: Color.white, position: 'absolute', bottom: 0, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
					<TouchableOpacity style={{ height: responsiveHeight(5), width: responsiveWidth(90), alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary }}
						onPress={() =>{
							if(isDraw)
							this.saveSignature();
							else
							Snackbar.show({ text: 'Please draw the signature', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
						} }>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12 }}>Save e-Signature</Text>
					</TouchableOpacity>
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
)(DrawSignature);