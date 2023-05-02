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
import CustomFont from '../../../components/CustomFont';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import { setLogEvent } from '../../../service/Analytics';
import Trace from '../../../service/Trace'
let timeRange = '';
 class NotificationSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        };
    } 
  
  componentDidMount() { 
    let { signupDetails } = this.props;
    timeRange = Trace.getTimeRange();
    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +'Prescription_Print_Out_Template',  signupDetails.firebaseLocation )
    Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Prescription_Print_Out_Template", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })
   
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

    render() {
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
                <View style={{backgroundColor:Color.newBgColor}}>
                    <View style={{ backgroundColor: Color.white, borderRadius:10, margin:responsiveWidth(3) }}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headingView}>Currently, there is only one default template.</Text>
                            <Text style={styles.headingView}>We're working on creating more templates.</Text>
                            <Text style={styles.headingView}>Coming soon.</Text>
                        </View>

                        <View style={{ marginLeft: responsiveWidth(4), flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(30), backgroundColor: Color.primary }} onPress={() => {
    						this.props.navigation.navigate('PreviewPdf',{item:this.props.navigation.getParam("list")})
	    				    }}>
                                <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight:CustomFont.fontWeight700 }}>Preview</Text>
                            </TouchableOpacity>
                        </View>
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
