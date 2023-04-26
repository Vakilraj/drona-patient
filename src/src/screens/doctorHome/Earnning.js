import React, { useState } from 'react';
import {
	View,
	Text, SafeAreaView, Image, TouchableOpacity, FlatList, BackHandler
} from 'react-native';
import styles from './style';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Toolbar from '../../customviews/Toolbar.js';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import EarningIcon1 from '../../../assets/home_queue.png';
import EarningIcon2 from '../../../assets/home_earning.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
class SavedPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      dataServiceList :[], 
      dataPaymentList  :[],
      isServiceListExist : false,
      isPaymentListExist : false
		};
	}
	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		this.loadEarning();
	}

    loadEarning = () =>{
let { actions, signupDetails } = this.props;
	//	selectedPostId = item.postGuid;
		// let params = {
    //   "DoctorGuid":"c3708365-000c-11ec-887f-0022486b91c8",
    //   "ClinicGuid":"4a54e40f-0022-11ec-887f-0022486b91c8",
    //   "Data":{
    //     "DoctorGuid":"null",
    //     "ClinicGuid":"null"
    //     }
    // }
    	let params = {
        "UserGuid": signupDetails.UserGuid,
      "DoctorGuid": signupDetails.doctorGuid,
      "ClinicGuid": signupDetails.clinicGuid,
      "Data":{
        "DoctorGuid":signupDetails.doctorGuid,
        "ClinicGuid":signupDetails.clinicGuid
        }
    }
		actions.callLogin('V1/FuncForDrAppToGetHomeScreenEarningBreakup', 'post', params, signupDetails.accessToken, 'earning');
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'earning') {
				if (newProps.responseData.data) {
          if(newProps.responseData.data.serviceList != null || newProps.responseData.data.serviceList.length != 0)
          {
           let tempDataService = newProps.responseData.data.serviceList
           tempDataService.push({'itemName' : 'Total', 'totalItem' : '', 'amount': newProps.responseData.data.totalServiceAmount})
           this.setState({dataServiceList : tempDataService});
           this.setState({isServiceListExist : true})
          }
          else{
            this.setState({isServiceListExist : false})
          }
           if(newProps.responseData.data.paymentList != null || newProps.responseData.data.paymentList.length != 0)
           {
            let tempDataPayment = newProps.responseData.data.paymentList
            tempDataPayment.push({'itemName' : 'Total', 'totalItem' : '', 'amount': newProps.responseData.data.totalServiceAmount})
            this.setState({dataPaymentList : tempDataPayment});
             this.setState({isPaymentListExist : true})
          }
          else{
              this.setState({isPaymentListExist : false})
          }
         

          
        }
			}
		}
	}

  

  renderItemPayment =  ({ item, index }) => (
       
        <View style={{}}>
             { index == this.state.dataPaymentList.length - 1 ? 

        <View style = {{}}> 
            <View style = {{width : '100%', marginTop : responsiveHeight(1), height : 1, backgroundColor : 'gray'}}></View> 
            <View style = {{flexDirection : 'row', padding : 3, marginTop : responsiveHeight(1)}}> 
            <View style = {{flex  :1}}>
                <Text style={{fontFamily : CustomFont.fontName,
                 fontSize : CustomFont.font12, textAlign : 'left', color : Color.optiontext 
                }}>{item.itemName}</Text>
            </View>
            <View style = {{flex:2}}>
            <Text style={{fontFamily : CustomFont.fontName, fontSize : CustomFont.font12,
                  textAlign : 'right', fontSize  :CustomFont.font20, fontWeight : CustomFont.fontWeightBold, color:Color.fontColor}}>₹ {item.amount}</Text>
            </View>
            </View>
            
        </View> : 
        <View style = {{ flexDirection  :'row', padding : 3}}>  
              <View style = {{flex  :1}}>
                <Text style={{fontFamily : CustomFont.fontName, fontSize : CustomFont.font12, color : Color.optiontext , textAlign : 'left'}}>{item.paymentMode}</Text>
              </View>
              <View style = {{flex  :2}}>
                 <Text style={{fontFamily : CustomFont.fontName, color : Color.optiontext,  textAlign : 'right'}}>₹ {item.amount}</Text>
              </View>   
        </View>
        }
     </View>
  );

    renderItem =  ({ item, index }) => (
        <View style={{}}>
             { index == this.state.dataServiceList.length - 1 ? 

        <View style = {{}}> 
            <View style = {{width : '100%', marginTop : responsiveHeight(1), height : 1, backgroundColor : 'gray'}}></View> 
            <View style = {{flexDirection : 'row', padding : 3, marginTop : responsiveHeight(1)}}> 
            <View style = {{flex  :1}}>
                <Text style={{fontFamily : CustomFont.fontName,
                 fontSize : CustomFont.font12, textAlign : 'left', color : Color.optiontext 
                }}>{item.itemName}</Text>
            </View>
            <View style = {{flex  :2}}>
            <Text style={{fontFamily : CustomFont.fontName, fontSize : CustomFont.font12,
                  textAlign : 'right', fontSize  :CustomFont.font20, fontWeight : CustomFont.fontWeightBold , color:Color.fontColor}}>₹ {item.amount}</Text>
            </View>
            </View>
            
        </View> : 
        <View style = {{ flexDirection  :'row', padding : 3}}>  
              <View style = {{flex  :1}}>
                <Text style={{fontFamily : CustomFont.fontName, fontSize : CustomFont.font12, color : Color.optiontext , textAlign : 'left'}}>{item.itemName}  X {item.totalItem}</Text>
              </View>
              <View style = {{flex  :1}}>
                 <Text style={{fontFamily : CustomFont.fontName, color : Color.optiontext,  textAlign : 'right'}}>₹ {item.amount}</Text>
              </View>   
        </View>
    }
   </View>
  );
      
	
	render() {
		return (
			<SafeAreaView>
                <View>
                <Toolbar
					title={"Today's Earnings"}
					onBackPress={() => this.props.navigation.goBack()} />
                  <View style={{ height : responsiveHeight(100), backgroundColor: Color.white, marginLeft: responsiveWidth(0), marginRight: responsiveWidth(0), marginTop: responsiveWidth(0), marginBottom: responsiveWidth(0), borderRadius: 20 }}>
                      <View style = {{marginTop : responsiveHeight(0),  marginLeft : responsiveWidth(4), marginRight : responsiveWidth(4)}}> 
                       <View style = {{flexDirection : 'row', alignItems : 'center'}}>
                           <Image  style = {{tintColor : Color.primary, resizeMode : 'contain', height : responsiveHeight(10), width : responsiveWidth(6)}} source = {EarningIcon1} />
                           <Text style = {{color : Color.fontColor, fontWeight  :CustomFont.fontWeightBold, 
                            fontSize : CustomFont.font14, 
                            fontFamily  :CustomFont.fontName, marginLeft  :10}}>By Services</Text>
                       </View>
                       <View style = {{borderRadius  :10, height : responsiveHeight(20), width : '100%', backgroundColor  : Color.nofilebackground, marginTop : responsiveHeight(-2), 
                    paddingTop : responsiveHeight(3), paddingBottom : responsiveHeight(3), paddingLeft : responsiveWidth(8), paddingRight : responsiveWidth(8)}}>
                       {
                         this.state.isServiceListExist ? 
                          <FlatList
                           data={this.state.dataServiceList}
                           renderItem={this.renderItem}
                           keyExtractor={item => item.id}
                        /> : <Text style = {{fontFamily : CustomFont.fontName, fontSize : CustomFont.font16, fontWeight : CustomFont.fontWeightBold, color:Color.fontColor}}>No Earning for today</Text>
                       }
                       </View>
                       <View style = {{flexDirection : 'row', alignItems : 'center', marginTop : responsiveHeight(3)}}>
                           <Image style = {{ tintColor : Color.primary, resizeMode : 'contain', height : responsiveHeight(10), width : responsiveWidth(6)}} source = {EarningIcon2} />
                           <Text style = {{color : Color.fontColor, fontWeight  :CustomFont.fontWeightBold, 
                            fontSize : CustomFont.font14, 
                            fontFamily  :CustomFont.fontName, marginLeft  :10}}>By Payment Type</Text>
                       </View>
                       <View style = {{borderRadius  :10, height : responsiveHeight(20), width : '100%', backgroundColor  : Color.divider, marginTop : responsiveHeight(-2), 
                        paddingTop : responsiveHeight(3), paddingBottom : responsiveHeight(3), paddingLeft : responsiveWidth(8), paddingRight : responsiveWidth(8)}}>
                       {
                         this.state.isPaymentListExist ? 
                         <FlatList
                           data={this.state.dataPaymentList}
                           renderItem={this.renderItemPayment}
                           keyExtractor={item => item.id}
                        /> : <Text style = {{fontFamily : CustomFont.fontName, fontSize : CustomFont.font16, fontWeight : CustomFont.fontWeightBold, color:Color.fontColor}}>No Earning for today</Text>
                       }
                       
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
)(SavedPost);
