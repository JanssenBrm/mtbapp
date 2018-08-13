import {LOAD_DATA_DONE, LOAD_DATA_ERROR, LOAD_DATA_START, SET_FILTER, TOGGLE_SEARCH} from "../actions/DataActions";


let dataState = {
    rides: [],
    loading: false,
    refresh: false,
    search: false,
    filter: ''
};

const dataReducer = (state = dataState, action) => {
    //console.log(action.type, action.data);
    switch ( action.type ){
        case LOAD_DATA_START:
            if (action.data.refresh) {
                state = Object.assign({}, state, { refresh: true });
            }else{
                state = Object.assign({}, state, { loading: true });
            }
            break;
        case LOAD_DATA_DONE:
            if (action.data.refresh) {
                state = Object.assign({}, state, {rides: action.data.rides, refresh: false});
            }else{
                state = Object.assign({}, state, {rides: action.data.rides, loading: false});
            }
            break;
        case LOAD_DATA_ERROR:
            state = Object.assign({}, state, { loading: false, refresh: false });
            break;
        case TOGGLE_SEARCH:
            state = Object.assign({}, state, { search: action.data.search});
            break;

        case SET_FILTER:
            state = Object.assign({}, state, { filter: action.data.filter});
            break;
    }

    return state;
}

export default dataReducer;