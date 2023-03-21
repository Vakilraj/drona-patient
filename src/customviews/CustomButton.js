import React from 'react'
import Color from '../components/Colors';
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import CustomFont from '../components/CustomFont';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';
// import ic_location_white from '../../assets/ic_location_white.png';

export default function CustomButton(props) {
    // alert(props.maxLength ? props.maxLength : 100)
    return (
        <View style={[props.isBottom ? styles.bottomViewCB : null, props.mainStyle]}>
            <TouchableOpacity
                style={[props.style, {
                    // marginLeft: responsiveWidth(8),
                    // marginRight: responsiveWidth(8),
                    // height: responsiveHeight(6.5),
                    borderRadius: 5,
                    backgroundColor: props.isEmpty ? Color.white : (props.isInactive ? Color.lightGrayBg : props.isLight ? "#eee8fa" : Color.primary),
                    alignItems: 'center', justifyContent: 'center',
                    paddingTop: 10, paddingBottom: 10,
                    borderColor: props.isEmpty ? Color.primary : (props.isInactive ? Color.lightGrayBg : props.isLight ? "#eee8fa" : Color.primary),
                    borderWidth: props.isEmpty ? 1 : 1,
                    flexDirection: 'row'

                    // marginTop: Platform.OS === 'ios' ? responsiveHeight(8) : responsiveHeight(2)
                }]}
                onPress={props.isInactive ? null : props.onPress}>
                {/* {props.isIcon ? <Image source={ic_location_white} style={{ height: 20, width: 20 }} /> : null} */}
                <Text style={{ marginStart: props.isIcon ? 8 : 0, paddingStart: 16, paddingEnd: 16, color: props.isEmpty ? Color.primary : props.isInactive ? Color.lightgray : props.isLight ? Color.primary : Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeightBold, maxLength: props.maxLength ? props.maxLength : 100 }}>{props.title}</Text>
            </TouchableOpacity>
        </View>

    )
}
