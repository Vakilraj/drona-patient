import React, { useState } from 'react';
import {
    Text,
    View,Platform
  } from 'react-native';
  import firestore from '@react-native-firebase/firestore';
  import Color from './Colors';
  import CustomFont from './CustomFont';
export default class ErrorBoundries extends React.Component {

    constructor(props) {
  
      super(props);
  
      this.state = {
  
        hasError: false,
  
        error: '',
  
        errorInfo: '',
  
      };
  
    }
  
    static getDerivedStateFromError(error) {
      firestore()
        .collection('DronaDrAppErrorBoundary') //ReactError
        .add({
          error: error.toString(),
          version: Platform.OS=='android'?'1.0.63':'1.1.20',
          date: new Date(),
          platform:Platform.OS,
        })
        .then(() => {

          //console.log('User added!');
        });
      return {hasError: true};
    }

  
    // componentDidCatch(error, errorInfo) {
    //   console.log('--error1-----'+JSON.stringify(error))
    //   console.log('--errorInfo-----'+JSON.stringify(errorInfo))
  
    //   alert("did catch");
  
    //   console.log('Error Info: ' + JSON.stringify(errorInfo));
  
    //   this.setState({
  
    //     error: error,
  
    //     errorInfo: errorInfo,
  
    //   });
  
    // }
  
    render() {
  
      if (this.state.hasError) {
  
        return (
  
          <View
  
            style={{
  
              flex: 1,
  
              justifyContent: 'center',
  
              alignItems: 'center',
  
            }}>
  
            <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor}}>Oops!!! Something went wrong. {'\n'} Please kill the app and Open again.</Text>
            </View>
  
        );
  
      }
  
      return this.props.children;
  
    }
  
   }
