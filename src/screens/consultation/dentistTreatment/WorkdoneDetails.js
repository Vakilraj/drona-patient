import React from 'react';
import {
    Image, SafeAreaView, Text, 
    TouchableOpacity, View, Share
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../../assets/arrowBack_white.png';
import RupeeIcon from '../../../../assets/rupee.png';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import { setApiHandle } from "../../../service/ApiHandle";
import WhatsAppIcon from '../../../../assets/whatsapp.png';
import EditIcon from '../../../../assets/edit_new_blue.png' 
import Trace from '../../../service/Trace'
let item = {};
class Dentist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treatmentDateAndTime : '',
            treatmentText : '',
            treatmentPaidText : '',
            initialHeight : 3,
            patientTreatmentDetailsGuid : '',
        };
    }

    componentDidMount() {
        let { signupDetails } = this.props;
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +'Add_Treatment_Details',  signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Add_Treatment_Details", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })
        item = {};
        item = this.props.navigation.state.params.item;
        this.setState({ treatmentDateAndTime :item.appointmentDate + ', ' + item.appointmentTime})
        this.setState({ treatmentText :item.workDone})
        this.setState({ treatmentPaidText :item.amountPaid})

        this.setState({ patientTreatmentDetailsGuid :this.props.navigation.state.params.patientTreatmentDetailsGuid})

    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)
    }
    componentWillUnmount(){
        Trace.stopTrace()
    }


    handleApi = (response, tag) => {
        if (tag === 'completeConsultation') {
            this.setState({ CompleteModal: true, modelMessage: 'Appointment Completed' });
        }
    }
    shareOnlyWhatsapp = async (customOptions) =>{
        try {
            await Share.shareSingle(customOptions);
          } catch (err) {
          }
        // alert('pp2')
        // const shareOptions = {
        //     title: "Share via whatsapp",
        //     message: "some awesome dangerous message",
        //     //url: file.pdf,
        //     social: Share.Social.WHATSAPP,
        //     whatsAppNumber: "964358804",
        //     filename: 'file.pdf',
        //   };

        //   await Share.shareSingle(shareOptions)
        //     .then((res) => { console.log('----------amit----'+res) })
        //     .catch((err) => {
        //          err && console.log('----------modi----'+err); });
                 
       
    }

    gotoEditScreen = () =>{
        this.props.navigation.navigate('WorkdoneSave', { item: item, patientTreatmentDetailsGuid:this.state.patientTreatmentDetailsGuid});
    }
   
    render() {
        let { signupDetails } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.statusBarNewColor }}>
                <View style={{ flex: 1, backgroundColor: Color.statusBarNewColor }}>


                    <View style={{ flexDirection: 'row', backgroundColor: Color.white, padding: 10, height: responsiveFontSize(7.5), }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ tintColor: Color.primary, height: responsiveWidth(4.5), width: responsiveWidth(5) }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: responsiveHeight(1), flex: 5, marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1), }}>
                            <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.patientSearchName, marginRight: responsiveWidth(1), }}>{this.state.treatmentDateAndTime}</Text>
                        </View>
                    </View>
                   
                    <View style = {{borderRadius : 10, 
                    padding:responsiveWidth(2), paddingTop  : responsiveHeight(2),
                     paddingBottom : responsiveHeight(2), 
                      marginTop  :responsiveHeight(6),
                       marginLeft : responsiveWidth(3), marginRight : responsiveWidth(3), backgroundColor : Color.white}}>
                           <View style = {{flexDirection : 'row'}}>
                              <Text style = {{ flex : 4 , color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 }}>Treatment Plans</Text>
                           <TouchableOpacity onPress= {this.gotoEditScreen} style = {{flexDirection : 'row', flex : 1, alignItems : 'center'}}>
                           <Image source= {EditIcon} style = {{height : 15, width : 15, resizeMode : 'contain'}} />
                           <Text style = {{marginLeft  :10, color : Color.primary, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeightBold }}>Edit</Text>  
                           </TouchableOpacity>
                           </View>
							
                                 <Text style = {{fontFamily : CustomFont.fontName,fontSize : CustomFont.font12, color : Color.fontColor, marginTop  :responsiveHeight(1)}}>{this.state.treatmentText}
                                 </Text>
                                 <Text style = {{marginTop : responsiveHeight(2), color : Color.fontColor}}>Paid</Text>
                                 <Text style = {{marginTop : responsiveHeight(1.5), color : Color.fontColor, fontSize : CustomFont.font14}}>{this.state.treatmentPaidText}</Text>
							</View>

							 {/* <View style = {{justifyContent : 'center', alignItems : 'center', width : responsiveWidth(100), height : responsiveHeight(10), 
                                 backgroundColor : Color.white, bottom : responsiveHeight(-4),
                                  position : 'absolute', borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
                                <TouchableOpacity style = {{flexDirection : 'row', width : responsiveWidth(90), height : responsiveHeight(5.5), borderRadius : 10,  backgroundColor : Color.primary, alignItems : 'center', justifyContent : 'center'}} onPress={async () => {
            await this.shareOnlyWhatsapp({
              title: "Share via whatsapp",
              message: "some awesome dangerous message",
              url: file.pdf,
              social: Share.Social.WHATSAPP,
              whatsAppNumber: "9199999999",
              filename: file.pdf,
            });
          }} >
                                    <Image style = {{height : responsiveHeight(6), width : responsiveWidth(6), resizeMode : 'contain'}} source= {WhatsAppIcon}/>
                                    <Text style = {{marginLeft: 10, color : Color.white, fontFamily : CustomFont.fontName, fontSize : CustomFont.font14, fontWeight : CustomFont.fontWeightBold}}>Share Summary via WhatsApp</Text>
                                </TouchableOpacity>
                            </View> */}
                   
               
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
)(Dentist);

