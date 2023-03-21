import React from 'react';
import { View , Text, ActivityIndicator, Modal,  } from 'react-native';
import CommonStyle from './CommonStyle.js';
//import Loading from 'react-native-whc-loading'
//import ProgressImage from '../../assets/progress.png';
class Loader extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      isloadingLocal: false
		};

	}
  show() {
    setTimeout(()=>{
      this.setState({isloadingLocal:true})
    },2000)
   
    //this.refs.loading.show();
  }
  hide() {
    this.setState({isloadingLocal:false})
    //this.refs.loading.close();
  }
  render() {
    return (
      <View style={{ backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}>
        <Modal transparent={true} animationType="none" visible={this.state.isloadingLocal} style={{ alignItems: 'center' }}>
					<ActivityIndicator size="large" color="red" style={CommonStyle.loaderStyle} />
          <Text style={CommonStyle.loaderStyle}>Please hold-on , we are fetching your details</Text>
				</Modal>

        {/* <Loading
          ref="loading"
          image={ProgressImage}
          backgroundColor={null}
          borderRadius={5}
          size={20}
          imageSize={30}
          easing={Loading.EasingType.ease}
          show={true}
        /> */}
      </View>
    );
  }
}
export default Loader;