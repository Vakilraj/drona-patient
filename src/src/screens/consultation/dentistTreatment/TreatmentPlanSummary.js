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
class TreatmentPlanSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treatmentName : '',
            initialHeight : 3,
        };
    }

    componentDidMount() {
        this.setState({ treatmentName :this.props.navigation.state.params.treatmentName})
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)
    }


    handleApi = (response, tag) => {
        if (tag === 'completeConsultation') {
            this.setState({ CompleteModal: true, modelMessage: 'Appointment Completed' });
        }
    }
    shareOnlyWhatsapp = async() =>{
        const shareOptions = {
            title: 'Share via',
            message: 'some message',
            url: 'some share url',
            social: Share.Social.WHATSAPP,
            //whatsAppNumber: "9199999999",  // country code + phone number
            filename: 'test' , // only for base64 file in Android
          };

          try {
            await Share.shareSingle(shareOptions);
          } catch (err) {
            //console.log(err);
          }
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
                            <Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.patientSearchName, marginRight: responsiveWidth(1), }}>Treatment Plan Summary</Text>
                        </View>
                    </View>
                   
                    <View style = {{borderRadius : 20, 
                    padding:responsiveWidth(6), paddingTop  : responsiveHeight(2.5),
                     paddingBottom : responsiveHeight(2.5), 
                      marginTop  :responsiveHeight(2),
                       marginLeft : responsiveWidth(0), marginRight : responsiveWidth(0), backgroundColor : Color.white}}>
                           <View style = {{padding : responsiveHeight(2), borderWidth : 1, borderColor : '#EFE1FB', borderRadius  :10,}}>
                               <View style = {{flexDirection  :'row'}}>
                                  <Text style = {{ flex : 1.5, color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 }}>Patient Name</Text>
                                  <Text style = {{textAlign : 'center', flex : 1, color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 }}>Gender</Text>
                                  <Text style = {{ flex : 1.3, color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 }}>Phone Number</Text>
                               </View>
                               <View style = {{flexDirection  :'row', marginTop  :responsiveHeight(2)}}>
                                  <Text style = {{ flex : 1.5, color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 }}>Akhansa Ranjan</Text>
                                  <Text style = {{textAlign : 'center', flex : 1, color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 }}>Female</Text>
                                  <Text style = {{ flex : 1.3, color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 }}>8285687919</Text>
                               </View>
                            </View>
                            <Text style = {{color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 , marginTop  :responsiveHeight(4)}}>Treatment Plan : {this.state.treatmentName}
                                 </Text>
                                 <Text style = {{color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 , marginTop  :responsiveHeight(2)}}>Tooth Number : 12, 13</Text>
                                 <Text style = {{color : Color.fontColor, fontFamily:CustomFont.fontName, fontSize  :CustomFont.font14, fontWeight : CustomFont.fontWeight400 , marginTop  :responsiveHeight(2)}}>Total Cost : ₹2500</Text>
                          </View>

							 <View style = {{justifyContent : 'center', alignItems : 'center', width : responsiveWidth(100), height : responsiveHeight(10), 
                                 backgroundColor : Color.white, bottom : responsiveHeight(-4),
                                  position : 'absolute', borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
                                <TouchableOpacity style = {{flexDirection : 'row', width : responsiveWidth(90), height : responsiveHeight(5.5), borderRadius : 10,  backgroundColor : Color.primary, alignItems : 'center', justifyContent : 'center'}} onPress={()=>this.shareOnlyWhatsapp()}>
                                    <Image style = {{height : responsiveHeight(6), width : responsiveWidth(6), resizeMode : 'contain'}} source= {WhatsAppIcon}/>
                                    <Text style = {{marginLeft: 10, color : Color.white, fontFamily : CustomFont.fontName, fontSize : CustomFont.font14, fontWeight : CustomFont.fontWeightBold}}>Share Summary via WhatsApp</Text>
                                </TouchableOpacity>
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
)(TreatmentPlanSummary);

