import {LOAD_DATA_DONE, LOAD_DATA_ERROR, LOAD_DATA_START} from "../actions/DataActions";


let dataState = {
    rides: [],
    loading: false
}

const dataReducer = (state = dataState, action) => {
    switch ( action.type ){
        case LOAD_DATA_START:
            state = Object.assign({}, state, { loading: true });
            break;
        case LOAD_DATA_DONE:
            state = Object.assign({}, state, { rides: action.data.rides, loading: false });
            break;
        case LOAD_DATA_ERROR:
            state = Object.assign({}, state, { loading: false });
            break;
    }

    return state;
}

export default dataReducer;