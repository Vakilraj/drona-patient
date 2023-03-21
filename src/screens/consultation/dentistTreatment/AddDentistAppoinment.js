import React from 'react';
import {
    Image, SafeAreaView, Text,
    TouchableOpacity, View, FlatList
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../../assets/arrowBack_white.png';
import CheckedIcon from '../../../../assets/vac_tick.png';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import { setApiHandle } from "../../../service/ApiHandle";
import arrow_right from '../../../../assets/arrow_right.png';
import Modal from 'react-native-modal';
import styles from './style';
import cross_txt from '../../../../assets/cross_primary.png';
import dentist_complete from '../../../../assets/dentist_complete.png';
import appoinment_booked from '../../../../assets/appoinment_booked.png';
import Snackbar from 'react-native-snackbar';
let treatmentGuid='', PatientTreatmentDetailsGuid='';
import { NavigationEvents } from 'react-navigation';
let isDentistryUpdate=0;

class Dentist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treatmentName: '',
            initialHeight: 3,
            appoinmentArr: ['Add'],
            isModalMarkAsComplete: false,
            completeStatus:'',
        };
        DRONA.setIsDrTimingsUpdated(true);
        isDentistryUpdate=0;
    }

    componentDidMount() {
        let item = this.props.navigation.state.params.item;
        let tempArr=item.treatmentAppointment;
        this.setState({ treatmentName: item.treatmentName });
        treatmentGuid=item.treatmentGuid;
        PatientTreatmentDetailsGuid=item.patientTreatmentDetailsGuid;
//this.getTreatmentMainList();
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname === 'getSingleTreatment') {
                if (newProps.responseData.statusCode == 0) {
                    DRONA.setIsDrTimingsUpdated(false);
                    isDentistryUpdate++;
                    let data= newProps.responseData.data;
                    if(data && data.length>0){
                        for(let i=0; i< data.length ;i++){
                            if(data[i].patientTreatmentDetailsGuid==PatientTreatmentDetailsGuid){
                                this.setState({completeStatus: data[i].status});
                                
                                let tempArray=data[i].treatmentAppointment ? data[i].treatmentAppointment :[];
                                tempArray.push('Add');
                                this.setState({appoinmentArr:tempArray});
                                break;
                            }
                        }
                    }
                }
                
            }else if (tagname === 'MarkTreatmentAsComplete') {
                if (newProps.responseData.statusCode == 0) {
                    isDentistryUpdate++;
                    setTimeout(() => {
                        Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                        this.props.navigation.goBack();
                        try {
                            this.props.navigation.state.params.Refresh(isDentistryUpdate);
                        } catch (error) {
                            
                        }
                        this.setState({isModalMarkAsComplete:false})
                    }, 500)
                }
                
            }
        }
    }

    goToNextScreen = (item, index) => {
        if (item.workDone) {
            this.props.navigation.navigate('WorkdoneDetails', { item: item ,patientTreatmentDetailsGuid:this.props.navigation.state.params.item.patientTreatmentDetailsGuid });
        } else {
            this.props.navigation.navigate('WorkdoneSave', { item: item,patientTreatmentDetailsGuid:this.props.navigation.state.params.item.patientTreatmentDetailsGuid});
        }
        // 

    }
    getTreatmentMainList = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"userGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Version": "",
		}
		actions.callLogin('V1/FuncForDrAppToGetTreatmentDetails', 'post', params, signupDetails.accessToken, 'getSingleTreatment');
	}
    markAsComplete = () => {
    let { actions, signupDetails } = this.props;
		let params = {
            "UserGuid": signupDetails.UserGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "PatientGuid":signupDetails.patientGuid,
            "Version":"",
              "Data": {
                     "TreatmentGuid": treatmentGuid,
                     "PatientTreatmentDetailsGuid": PatientTreatmentDetailsGuid
                       
              }
          }
		actions.callLogin('V1/FuncForDrAppToMarkTreatmentAsComplete', 'post', params, signupDetails.accessToken, 'MarkTreatmentAsComplete');   
    }

    renderList = ({ item, index }) => (
        <View>
            {item=='Add' ? <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('TimeSlotTreatment',{patientTreatmentDetailsGuid:this.props.navigation.state.params.item.patientTreatmentDetailsGuid});
                    }} style={{
                        backgroundColor: Color.gray_F7F3FD,
                        marginLeft: responsiveWidth(4),
                        marginRight: responsiveWidth(4),
                        marginTop: responsiveWidth(1)
                    }}>
                        <Text style={{ color: Color.primary, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, }}>
                            <Text style={{ color: Color.primary, fontSize: CustomFont.font20, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>+ </Text>Add Appointment</Text>
                    </TouchableOpacity> : 
                     <TouchableOpacity onPress={() => this.goToNextScreen(item, index)} style={{ backgroundColor: Color.gray_F7F3FD, padding: responsiveWidth(3)}}>
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(.5) }}>
                       <View style={{ flex: 1 }}><Image style={{ height: responsiveHeight(3), width: responsiveHeight(3), borderRadius: responsiveHeight(1.5), resizeMode: 'contain' }} source={item.workDone  ?CheckedIcon : appoinment_booked } /></View>
                         <Text style={{ flex: 11, marginLeft: responsiveWidth(2.5), fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, }}>{item.appointmentDate}, {item.appointmentTime}</Text>
                         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                             <Image style={{ resizeMode: 'contain', height: responsiveFontSize(2), width: responsiveFontSize(2), tintColor: Color.primary }} source={arrow_right} />
                         </View>   
                     </View>
                     {item.workDone ? <View style={{
                         marginTop: responsiveHeight(1.3), flexDirection: 'row', backgroundColor: Color.gray_F7F3FD
                     }}>
                         <Text style={{ marginLeft: responsiveWidth(9), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>Treatment plan: {item.workDone && item.workDone.length>100? item.workDone.substring(0,99):item.workDone} 
                         {item.workDone.length > 100 ?<Text style={{ flex: 1, marginLeft: responsiveWidth(1), fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font12, color: Color.primary }}> Read More</Text>: null }
                         </Text>

                     </View> :null}
                     {item.amountPaid ? <View style={{ marginTop: responsiveHeight(1.3) }}>
                         <Text style={{ marginLeft: responsiveWidth(9), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>Paid: {item.amountPaid}</Text>
                     </View> :null}
                     
                     <View style={{
                         borderStyle: 'dashed',
                         borderWidth: 1,
                         marginTop: 20,
                         borderColor: Color.lineColor,}}/>
                 </TouchableOpacity>}
           
                   
        </View>
    );

    render() {
        let { signupDetails } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.statusBarNewColor }}>
                <NavigationEvents onDidFocus={() =>{
                    if(DRONA.getIsDrTimingsUpdated())
                    this.getTreatmentMainList()
                } } />
                <View style={{ flex: 1, backgroundColor: Color.profileBg }}>


                    <View style={{ flexDirection: 'row', backgroundColor: Color.white, padding: 10, height: responsiveFontSize(7.5), }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                            this.props.navigation.goBack();
                            try{
                                this.props.navigation.state.params.Refresh(isDentistryUpdate);
                            }catch(e){}
                            
                            }}>
                            <Image source={arrowBack} style={{ tintColor: Color.primary, height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: responsiveHeight(1), flex: 5, marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1), }}>
                            <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.patientSearchName, marginRight: responsiveWidth(1), }}>{this.state.treatmentName}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, borderRadius: responsiveWidth(3), marginTop: responsiveHeight(2), padding: responsiveWidth(2), marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4), backgroundColor: Color.gray_F7F3FD }}>
                        <FlatList
                            data={this.state.appoinmentArr}
                            renderItem={this.renderList}

                            extraData={this.state}
                            style={{ marginBottom: 10}}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View>
                    {this.state.completeStatus != 'Completed' ?
                    <TouchableOpacity style={{width: responsiveWidth(90), height: responsiveHeight(5.5), borderRadius: 10, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', marginLeft: responsiveWidth(5), marginBottom: responsiveHeight(3) }} onPress={() => {
                        this.setState({ isModalMarkAsComplete: true })
                    }}>
                        <Text style={{ color: Color.white, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeightBold }}>Mark Treatment as Complete</Text>
                    </TouchableOpacity>
                    :
                    null
                    }
                    </View>
                    
                    
                </View>
                <Modal isVisible={this.state.isModalMarkAsComplete} avoidKeyboard={true}>
                    <View style={styles.modelView}>
                        <View style={{ margin: 25, marginBottom: responsiveHeight(26) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Text style={styles.addtxt}>Mark Treatment as Complete</Text>
                                <TouchableOpacity onPress={() => this.setState({ isModalMarkAsComplete: false })}>
                                    <Image style={{ resizeMode: 'contain', height: responsiveFontSize(4), width: responsiveFontSize(4), marginRight: 10 }} source={cross_txt} />
                                </TouchableOpacity>
                                <Text />
                            </View>

                            <View style={styles.compIcon}>
                                <Image style={{ resizeMode: 'contain', height: responsiveFontSize(14), width: responsiveFontSize(14), }} source={dentist_complete} />
                            </View>

                            <Text style={styles.compMessage}>Are you sure you want to mark treatment as complete?</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    this.markAsComplete();
                                }}
                                style={styles.markComp}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, fontWeight: '600' }}>Mark Complete</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ isModalMarkAsComplete: false });
                                }}
                                style={styles.markCancel}>
                                <Text style={{ color: Color.primary, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
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
)(Dentist);

