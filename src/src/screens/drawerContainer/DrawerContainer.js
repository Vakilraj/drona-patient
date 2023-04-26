import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,SafeAreaView,
  Image,StatusBar } from 'react-native';
import styles from './styles';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Modal from 'react-native-modal';
import AsyncStorage from 'react-native-encrypted-storage';
import * as signupActions from './../../redux/actions/signupActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as apiActions from './../../redux/actions/apiActions';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
//import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import DeviceInfo from 'react-native-device-info';

let drawerArray = [
  {
    name: 'Edit Clinic',
    route: 'ChooseClinicBeforeEdit',//ChooseClinicBeforeEdit SetUpClinic
    icon: require('../../../assets/Edit_Clinic_blue.png'),
  },
  {
    name: 'My Profile',
    route: 'Profile',
    icon: require('../../../assets/menu/sideprofile_blue.png'),
  },
  {
    name: 'Messages',
    route: 'Messages',
    icon: require('../../../assets/message_done.png'),
  },
  {
    name: 'Saved Posts',
    route: 'SavedPost',
    icon: require('../../../assets/menu/save_blue.png'),
  },

  // {
  //   name: 'Reports',
  //   route: 'commingSoon',
  //   icon: require('../../../assets/menu/report_blue.png'),
  // },
  {
    name: 'Settings',
    route: 'Setting',
    icon: require('../../../assets/menu/settings_blue.png'),
  },
  {
    name: 'Help',
    route: 'HelpAndSupport',
    icon: require('../../../assets/menu/help_blue.png'),
  }
];

class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      versionName: DeviceInfo.getVersion(),
      dataArray:[],
    };
  }
  //** ======= Handle Menu Item selection ======= **//
  componentDidMount(){
   
    // alert(signupDetails.isAssistantUser)
  }
  PressOnMenuBtn(item, selectedIndex) {
    this.props.navigation.closeDrawer();
    return this.props.navigation.navigate(item.route, { tabActive: 0, from: 'first' });
  }
  signOutFromGoogle = async () => {
    try {
       AsyncStorage.setItem('profile_complete', 'logout');
       AsyncStorage.setItem('password', '');
       AsyncStorage.setItem('loginId', '');
       AsyncStorage.setItem('accessToken', '');
       AsyncStorage.setItem('userGuid', '');

       let { actions, signupDetails } = this.props;
       signupDetails.fname='';
       signupDetails.lname= '';
       signupDetails.mname= '';
       signupDetails.profileImgUrl=null;
       signupDetails.drSpeciality='';
     actions.setSignupDetails(signupDetails);
    } catch (error) {
      console.error(error);
    }
   
  this.props.navigation.navigate('GetStarted');
  };
  
  async UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.responseData && newProps.responseData.tag) {
      let tagname = newProps.responseData.tag;
      if (tagname === 'logout') {
        //if (newProps.responseData.statusCode == '0') {
         // AsyncStorage.setItem('profile_complete', 'logout');
         
        // } else {
        //   Snackbar.show({ text: 'Logout not successfull', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        // }
      }
    }
  }
  getNamechar = (fname, lname) => {
    fname = fname ? fname.trim() : '';
    lname = lname ? lname.trim() : '';
    let str = '';
    try {
      if (!lname) {
        str = fname.substr(0, 2);
      } else if (fname && lname) {
        str = fname.substr(0, 1) + lname.substr(0, 1);
      }
    } catch (e) { }
    return str
  }
  makeShortName=(name) => {
    let shortName = '';
    if (name != null && name.length > 0) {
        let nameArr = name.split(' ')
        if (nameArr.length > 0) {
            let lastIndex = nameArr.length - 1;
            shortName = nameArr[0].charAt(0).toUpperCase() + (lastIndex > 0 ? nameArr[lastIndex].charAt(0).toUpperCase() : "") 
        }
    }
    return shortName
}
  nameFormat = (assistantName) => {
    let str = '';
    try {
      if (assistantName) {
        if (assistantName.includes(' ')) {
          let strArr = assistantName.trim().split(' ');
          if (strArr[1]) {
            str = strArr[0].substr(0, 1).toUpperCase() + strArr[1].substr(0, 1).toUpperCase()
          } else {
            str = strArr[0].substr(0, 2).toUpperCase();
          }
        } else {
          str = assistantName.substr(1, 2)
        }
      }

    } catch (e) { }
    return str
  }
  //** ======= UI Design ======= **//
  render() {
    let { signupDetails } = this.props;
    //alert(signupDetails.isAllowMessagesAssistant)
    let dataArray=drawerArray;
    if (signupDetails.isAssistantUser) {
      dataArray = drawerArray.filter(e => e.route !== 'Profile');
      dataArray = dataArray.filter(e => e.route !== 'SavedPost');
      if (!signupDetails.isAllowMessagesAssistant)
      dataArray = dataArray.filter(e => e.name !== 'Messages')
     }
    return (
      <SafeAreaView style={{flex:1,backgroundColor:Color.primary}}>
      <View style={styles.content}>
			<StatusBar backgroundColor={Color.primary} barStyle="light-content" />
        <View style={styles.viewHeader}>
          <View style={{ flex: 1.3, alignItems: 'center', }}>
            <View style={{ marginTop: 5, height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), backgroundColor: '#ededed', justifyContent: 'center', alignItems: 'center' }}>
              {
                signupDetails.profileImgUrl ? <Image source={{ uri: signupDetails.profileImgUrl }} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5) }} /> :
                  // <Image source={profile} style={{ height: responsiveFontSize(6), width: responsiveFontSize(6), borderRadius: responsiveFontSize(3) }} />
                  <Text style={{ textTransform: 'uppercase', fontSize: CustomFont.font20, color: Color.fontColor, textAlign: 'center' }}>{signupDetails.isAssistantUser ? this.makeShortName(signupDetails.assistantName) : this.makeShortName(signupDetails.fullName)}</Text>
                  
              }
            </View>

          </View>
          <View style={{ flex: 4 }}>
            <TouchableOpacity onPress={() => {
              if (!signupDetails.isAssistantUser) {
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate('Profile')
              }
            }}>
              <Text style={styles.drNameTxt}>{!signupDetails.isAssistantUser ? 'Dr. ' : ''}{signupDetails.isAssistantUser ? signupDetails.assistantName : signupDetails.fullName}</Text>
              <Text style={styles.splTxt}>{signupDetails.isAssistantUser ? 'Staff' : signupDetails.drSpeciality}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewBody}>
          <FlatList
            data={dataArray}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.listItemView} onPress={() => this.PressOnMenuBtn(item, index)}>
                <Image style={styles.menuImage} source={item.icon} />
                <Text style={styles.txtMenu}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.viewFooter}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItemView} onPress={() => {
            this.props.navigation.closeDrawer();
            return this.props.navigation.navigate('AboutUs');
          }}>
            <Image style={styles.menuImage} source={require('../../../assets/menu/about_blue.png')} />
            <Text style={styles.txtMenu}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.listItemView, { marginBottom: responsiveHeight(3) }]} onPress={() => this.setState({ isModalVisible: true })}>
            <Image style={styles.menuImage} source={require('../../../assets/menu/logout_blue.png')} />
            <Text style={styles.txtMenu}>Logout</Text>
          </TouchableOpacity>
          <Text style={{ color: Color.white, fontSize: CustomFont.font11, marginLeft: responsiveWidth(14) }}>v{this.state.versionName}</Text>

        </View>
        <Modal isVisible={this.state.isModalVisible} >
          <View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Logout</Text>
              <Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Do you want to log out ? </Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6.5), width: responsiveWidth(25), marginRight: 15 }} onPress={() => this.setState({ isModalVisible: false })}>
                <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6.5), width: responsiveWidth(25), backgroundColor: Color.primary, marginLeft: 15 }} onPress={() => {
                let { actions, signupDetails } = this.props;
                let params = {
                  "UserGuid": signupDetails.UserGuid,
                  "data": {
                    "FcmToken": signupDetails.fcmToken
                  }
                }
                actions.callLogin('V1/FuncForDrAppToLogOutUser', 'post', params, signupDetails.accessToken, 'logout');
                this.setState({ isModalVisible: false })
setTimeout(()=>{
  this.signOutFromGoogle();
},300)
              }}>
                <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Yes</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
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
)(DrawerContainer);


// const mapStateToProps = state => ({
//   signupDetails: state.signupReducerConfig.signupDetails,
// });

// const ActionCreators = Object.assign({}, apiActions, signupActions);

// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(DrawerContainer);