import React from 'react';
import {
    Image, SafeAreaView, Text,
    TouchableOpacity, View, BackHandler, PermissionsAndroid, Platform, Alert, Linking
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import PDFView from 'react-native-view-pdf';
import RNPrint from 'react-native-print';
import Toolbar from '../../../customviews/Toolbar.js';
import Modal from 'react-native-modal';
import TickIcon from '../../../../assets/green_tick.png';
import { setLogEvent } from '../../../service/Analytics';
import Snackbar from 'react-native-snackbar';
import RNFetchBlob from 'rn-fetch-blob';
let pdfUrl = '';
export default class PreviewRx extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            filePath: '',
            successPdfGeneration: false,
            resources: { file: '' },
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
        let filePath = this.props.navigation.state.params.PreviewPdfPath;
        pdfUrl = this.props.navigation.state.params.pdfUrl;
        //console.log(pdfUrl+'------filePath'+filePath);
        //Linking.openURL(filePath);
        if (filePath) {
            if (filePath.includes('/')) {
                let str = filePath.split('/');
                let name = str[str.length - 1];

                this.setState({ resources: { file: name } });
            } else {
                this.setState({ resources: { file: filePath } });
            }
        }
        this.setState({
            filePath: filePath
        })

    }

    downloadPdf = async () => {
        try {
            if (Platform.OS == 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.actualDownload();
                } else {
                    Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
                }
            } else {
                this.actualDownload();
            }

        } catch (err) {
            console.warn(err);
        }
    }

    actualDownload = () => {
        if (pdfUrl != 'null') {
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
            //console.log('--------'+pdfUrl)
            RNFetchBlob.config(configOptions)
                .fetch('GET', pdfUrl, {})
                .then((res) => {
                    if (Platform.OS === "ios") {
                        RNFetchBlob.ios.openDocument(res.data);
                        // RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                        // RNFetchBlob.ios.previewDocument(configfb.path);
                    }

                    if (Platform.OS == 'android') {
                        Snackbar.show({ text: 'File downloaded successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
                    }
                    //console.log('The file saved to ', res);
                })
                .catch((e) => {
                   // console.log('The file saved to ERROR', e.message)
                });
        } else {
            Alert.alert(
                'Message',
                'Some thing went wrong.Please back and try again',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            this.props.navigation.goBack();
                        },
                    },
                ],
                { cancelable: false },
            );
        }


        // this.setState({
        //     successPdfGeneration: true
        // })
        // let filePath = this.props.navigation.state.params.PreviewPdfPath;
        // if(Platform.OS=='android'){
        //     const android = RNFetchBlob.android;
        //     android.actionViewIntent(filePath, 'application/pdf');
        // }else{
        //     RNFetchBlob.ios.openDocument(filePath);
        // }
    }

    async printRemotePDF() {
        await RNPrint.print({ filePath: this.state.filePath })
    }

    render() {
        const resourceType = 'file';
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
                <View style={{ flex: 1, backgroundColor: Color.white }}>
                    <Toolbar
                        title={"Preview"}
                        onBackPress={() => {
                            this.props.navigation.goBack(null);
                            this.props.navigation.goBack(null);
                        }} />

                    <View style={{ backgroundColor: Color.white, flex: 1 }}>
                        <View style={{ flex: 12 }}>
                            <PDFView
                                fadeInDuration={250.0}
                                style={{ flex: 1 }}
                                resource={Platform.OS === 'android' ? this.state.filePath : this.state.resources[resourceType]}
                                resourceType={resourceType}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: responsiveHeight(6), marginBottom: responsiveHeight(4) }}>
                        <TouchableOpacity style={{ marginLeft: responsiveWidth(8), alignItems: 'center', height: responsiveHeight(6), width: responsiveWidth(40), justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: Color.mediumGray }}
                            onPress={() => {
                                setLogEvent("patient_appointment", { "download_pdf": "click", })
                                this.downloadPdf()
                            }}>
                            <Text style={{ color: Color.mediumGrayTxt, fontSize: CustomFont.font16 }}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(40), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(5), backgroundColor: Color.weekdaycellPink, borderRadius: 5, marginRight: 10 }}
                            onPress={() => {
                                setLogEvent("patient_appointment", { "print_pdf": "click", })
                                this.printRemotePDF()
                            }}>
                            <Text style={{ color: Color.white, fontSize: CustomFont.font16 }}>Print</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal isVisible={this.state.successPdfGeneration}>
                        <View style={{
                            backgroundColor: Color.white,
                            borderRadius: 20,
                            width: responsiveWidth(80),
                            marginStart: 17,
                            paddingStart: responsiveWidth(10),
                            paddingEnd: responsiveWidth(10),
                            alignItems: 'center',
                            bottom: Platform.OS === 'ios' ? responsiveHeight(0) : responsiveHeight(0),
                        }}>
                            <Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
                            <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                                File successfully downloaded
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ successPdfGeneration: false });
                                    // if (this.state.successPdfGenerationMsg == 'Pdf generated Successfully') {
                                    // 	this.props.nav.navigation.navigate("PreviewRx", { PreviewPdfPath: this.state.filePath });
                                    // }
                                }}
                                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
}
