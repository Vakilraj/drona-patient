
import { SIGNUP_DETAILS } from '../constants';
export function setSignupDetails(val) {
  return {
    type: SIGNUP_DETAILS,
    payload: val
  }
}
