import React from 'react';
import { Image, SafeAreaView, ScrollView, Text,Platform,
    TouchableOpacity, View, TextInput
} from 'react-native';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';
import RNPrint from 'react-native-print';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNFetchBlob from 'rn-fetch-blob';
import arrowBack from '../../../assets/arrowBack_white.png';
import cross_new from '../../../assets/cross_blue.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import { setApiHandle } from "../../service/ApiHandle";
import DropDownPicker from 'react-native-dropdown-picker';
import Snackbar from 'react-native-snackbar';
let searchText = '';

class addNewMedicine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            medicineSearchTxt : '',
            isMedicineTypeSelected : false,
            genericName : '',
            strength : '',
            medicineTypeName : '',
            medicineTypeArr : [],
            medTiming : {}
        };
    }

    componentDidMount() {
        this.callApiToGetMedicineType();
        this.setState({medicineSearchTxt : this.props.navigation.state.params.searchStr});
        this.setState({medTiming : this.props.navigation.state.params.medTiming});
    }
     callApiToGetMedicineType = () =>{
       let { actions, signupDetails } = this.props;
		let params = {
            "userGuid":  signupDetails.UserGuid, //"a8a0f850-79cc-11ec-b633-776ec48b6a72",
            "doctorGuid": signupDetails.doctorGuid, // "bb3eca86-79cc-11ec-b633-776ec48b6a72",
            "clinicGuid":    signupDetails.clinicGuid, //"08ccd8f8-79cd-11ec-b633-776ec48b6a72",
            "version": "",
            "Data":null
       }
		actions.callLogin('V1/FuncForDrAppToGetMedicineType', 'post', params, signupDetails.accessToken, 'getmedicinetype1');
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)
    }

    RefreshData = () => {
		//this.getAdditionalInfo();
	}

    handleApi = (response, tag, statusMessage) => {
        if (tag === 'getmedicinetype1') {
         let tempMedicineTypeArr = [];
           for(let i = 0 ; i < response.length ; i++){
               let tempObj = {};
               tempObj.label = response[i].medicineType;
               tempObj.value = response[i].medicineTypeGuid;
               tempMedicineTypeArr.push(tempObj)
           }
           this.setState({medicineTypeArr : tempMedicineTypeArr})
        }
        else if(tag ==='addmedicine1'){
              Snackbar.show({ text: statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            
              this.props.navigation.navigate('MedicineDetails', { item: response, medTiming: this.state.medTiming, Refresh: this.RefreshData });
        }
      
    }
       addPressed = () =>{
       // alert(this.state.medicineSearchTxt + '  ' + this.state.genericName + ' ' + this.state.strength + ' ' + this.state.medicineTypeName)
        let { actions, signupDetails } = this.props;
		let params = {
            "userGuid":  signupDetails.UserGuid, //"a8a0f850-79cc-11ec-b633-776ec48b6a72",
            "doctorGuid": signupDetails.doctorGuid, // "bb3eca86-79cc-11ec-b633-776ec48b6a72",
            "clinicGuid":    signupDetails.clinicGuid, //"08ccd8f8-79cd-11ec-b633-776ec48b6a72",
            "version": "",
            "Data":{
                 "MedicineName":this.state.medicineSearchTxt,
                 "MedicineDesc": this.state.genericName,
                 "MedicineTypeGuid": this.state.medicineTypeName,
                "Strength": this.state.strength
            }
       }
		actions.callLogin('V1/FuncForDrAppToAddNewMedicine', 'post', params, signupDetails.accessToken, 'addmedicine1');
     
     }

     typeStregth=(text)=>{
         this.setState({strength : text});
     }
     typeGenericName=(text)=>{
     this.setState({genericName : text});
     }
     typeMedcineName =(text)=>{
       this.setState({medicineSearchTxt : text});  
     }
   

    render() {
        let { signupDetails } = this.props;
        return (
            // <SafeAreaView style={{ flex: 1,  backgroundColor: '#58376F' }}>
            // </SafeAreaView>
                <View style={{ flex: 1,  backgroundColor: '#58376F' }}>
                 <View style={{ flex: 1, marginTop : responsiveHeight(5), borderTopLeftRadius : 20, borderTopRightRadius : 20, backgroundColor: Color.white }}> 
                   <View style = {{marginTop : responsiveHeight(5), marginLeft : responsiveWidth(7), marginRight : responsiveWidth(7)}}>
                    <View style = {{flexDirection : 'row', justifyContent : 'center'}} >
                      <Text style = {{flex : 1, fontSize : CustomFont.font18, fontFamily  :CustomFont.fontName, fontWeight : CustomFont.fontWeight500 }} onPress = {() => this.props.navigation.goBack()}>Add New Medicine</Text> 
                         <TouchableOpacity onPress = {() => this.props.navigation.goBack()} style = {{flex : 1, alignItems : 'flex-end'}}> 
                            <Image style = {{height : responsiveHeight(3), width : responsiveWidth(3)}} source = {cross_new} />
                         </TouchableOpacity>
                    </View>
                    <View style = {{marginTop : responsiveHeight(4)}}>
                        <Text style={{color : Color.optiontext, fontFamily : CustomFont.fontName, fontSize : CustomFont.font12}}>Medicine Name</Text>
					    <TextInput returnKeyType="done" onChangeText = {this.typeMedcineName}  value = {this.state.medicineSearchTxt}  style={{paddingLeft : 5, borderColor : Color.borderColor, borderRadius  : 7, marginTop : 10, height : responsiveHeight(5.5), borderWidth : 1 }} />
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : responsiveHeight(4)}}>
                      <View style = {{ flex : 1, marginRight : responsiveWidth(2)}}>
                        <Text style={{color : Color.optiontext, fontFamily : CustomFont.fontName, fontSize : CustomFont.font12}}>Generic Name</Text>
					    <TextInput returnKeyType="done" onChangeText = {this.typeGenericName} value = {this.state.genericName} placeholderTextColor = {Color.textGrey}  placeholder = "Enter Name" style={{paddingLeft : 5, borderColor : Color.borderColor, borderRadius  : 7, marginTop : 10, height : responsiveHeight(5.5), borderWidth : 1 }} />
                      </View>
                      <View style = {{ flex : 1, marginLeft : responsiveWidth(2)}}>
                        <Text style={{color : Color.optiontext, fontFamily : CustomFont.fontName, fontSize : CustomFont.font12}}>Strength</Text>
					    <TextInput returnKeyType="done" onChangeText = {this.typeStregth} value = {this.state.strength} placeholderTextColor = {Color.textGrey} placeholder = "Enter strength" style={{paddingLeft : 5, borderColor : Color.borderColor, borderRadius  : 7, marginTop : 10, height : responsiveHeight(5.5), borderWidth : 1 }} />
                      </View>
                    </View>
                    <View style = {{marginTop : responsiveHeight(4)}}>
                        <Text style={{color : Color.optiontext, fontFamily : CustomFont.fontName, fontSize : CustomFont.font12}}>Medicine Type</Text>
					    <DropDownPicker zIndex={999}
									items={this.state.medicineTypeArr}
									containerStyle={{ height: responsiveHeight(6.5) }}
									style={{ backgroundColor: '#FFF', marginTop : 10 }}
									itemStyle={{
										justifyContent: 'flex-start', height : responsiveHeight(5)
									}}
									dropDownStyle={{ backgroundColor: '#FFF', zIndex: 4 }}
									onChangeItem={item => {
                                        this.setState({isMedicineTypeSelected : true, medicineTypeName : item.value })
										//alert(item.value)
									}}
                                    globalTextStyle={{color:Color.fontColor}}
									placeholder="Search/Choose type"
									placeholderTextColor={Color.textGrey}
									labelStyle={{
										color: Color.text1, marginLeft : 5, fontSize: CustomFont.font14,fontFamily: CustomFont.fontName
									}}
								/>
                    </View>
                   </View>
                 </View>
                <TouchableOpacity style = {{margin : responsiveWidth(3), width : responsiveWidth(94),
                 backgroundColor : (this.state.genericName != '' && this.state.strength != '' && this.state.isMedicineTypeSelected) ? Color.primary :   Color.btnDisable, borderRadius : 10, height : responsiveHeight(6), 
                 alignItems : 'center', justifyContent  :'center', position : 'absolute',
                  bottom : responsiveHeight(5)}} onPress = {this.addPressed}> 
                        <Text style = {{fontFamily : CustomFont.fontName, color : Color.white,
                         fontSize : CustomFont.font16, fontWeight  :CustomFont.fontWeight700}}>Add</Text>
                   </TouchableOpacity>
                </View>
            
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
)(addNewMedicine);
