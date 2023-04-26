import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar, Button, TouchableOpacity, Image
} from 'react-native';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import arrowBack from '../../../../assets/arrowBack_white.png';
import EmptyBill from '../../../../assets/empty_bill.png';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: Color.primary }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: responsiveHeight(1) }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            <Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginRight: responsiveWidth(3), marginBottom: responsiveWidth(2) }} />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontSize: CustomFont.font16, fontFamily:CustomFont.fontName, color: Color.white }} >Billing</Text>
                        </View>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: responsiveHeight(20) }}>
                    <Image source={EmptyBill} />
                    <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.feeText, opacity: 0.6, marginTop: responsiveHeight(5) }} >No bills for this patient yet.</Text>
                </View>

                <View style={{marginTop: responsiveHeight(24), marginBottom: responsiveHeight(4) }}>
                    <TouchableOpacity style={{marginRight:responsiveWidth(2), marginLeft:responsiveWidth(10), height: responsiveHeight(8), width: responsiveWidth(80), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, borderRadius: 5}}
                    onPress={() => {this.props.navigation.navigate('NewBill')}}>
                        <Text style={{fontFamily:CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>+ Add New Bill</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
