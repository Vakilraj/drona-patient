import {API_SUCCESS} from '../constants';
import {API_BEGIN} from '../constants';
import {API_FAIL} from '../constants';
import {NO_LOADER} from '../constants';
const initialState = {
  responseData: [],
  loading: false,
  email: '',
  passWord: '',
};
const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case API_SUCCESS: {
      return {
        ...state,
        responseData: action.payload,
        loading: false,
      };
    }
    case API_FAIL: {
      return {
        ...state,
        responseData: action.payload,
        loading: false,
      };
    }
    case API_BEGIN: {
      return {
        ...state,
        responseData: action.payload,
        loading: true,
      };
    }
    case NO_LOADER: {
      return {
        ...state,
        responseData: action.payload,
        loading: false,
      };
    }

    
    default:
      return state;
  }
};
export default apiReducer;
