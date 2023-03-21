/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';
import { Platform } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
export default {
  font14: responsiveFontSize(1.83), 
  font32: responsiveFontSize(4),
  font30: responsiveFontSize(3.9),
  font28: responsiveFontSize(3.6),
  font26: responsiveFontSize(3.4),
  font24: responsiveFontSize(3.1),
  font22: responsiveFontSize(2.8),
  font20: responsiveFontSize(2.6),
  font18: responsiveFontSize(2.3),
  font16: responsiveFontSize(2.1),
  font12: responsiveFontSize(1.6),
  font11: responsiveFontSize(1.45),
  font10: responsiveFontSize(1.3),
  font9: responsiveFontSize(1.17),
  font8: responsiveFontSize(1.09),
  font7: responsiveFontSize(.9),
  fontNameBold: 'Inter-Bold',
  fontNameSemiBold : 'Inter-SemiBold',
  fontName: 'Inter',
  fontWeight400: '400',
  fontWeight500: '500',
  fontWeight600: Platform.OS === 'ios' ? '600' : 'bold',
  fontWeight700: '700',
  fontWeight800: '800',
  fontWeightBold: 'bold',
};
