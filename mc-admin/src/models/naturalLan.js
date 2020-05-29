import { getTree } from '../services/xiaoCheng/infoTree'
import { 
  queryNaturalDataApi,
  addDiscernApi,
  updateDuscernApi,
  deleteDiscernApi,
  checkApi
} from '../services/xiaoCheng/naturalLang';
export default {
  namespace: 'naturalLan',

  state: {
      data: {
          dataList: [],
          pagination:{},
      },
      typeName:[],
      loading:false,
  },
  reducers: {
    changeLoading(state, { _ }){
      return {
        ...state,
        loading:true,
      }
    },
    saveData( state, { payload }){
      const { dataList,pageNum, pageSize,total } = payload.data;
      return {
        ...state,
        data:{
          dataList,
          pagination:{
            pageSize,
            current:pageNum,
            total,
            showTotal:(total)=>`共 ${total} 条`,
            showQuickJumper:true,
            showSizeChanger:true,
          },
        },
        loading:false,
      }
    },
    saveTypeName( state, { payload }){
      
      let typeName = [];
      if(payload && payload.data.length){
        let data = payload.data[0].children[1].children;
        for(let i = 1;i<data.length;i++){
          for(let j=0;j<data[i].children.length;j++){
            let item = data[i].children[j].name;
            typeName.push(item)
          }
        }
      }
      return {
        ...state,
        typeName
      }
    },
  },
  effects: {
    *queryData({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
      })
      const response = yield call( queryNaturalDataApi, payload );
      yield put({
        type:'saveData',
        payload:response,
      })
      callback && callback(response);
    },
    *queryTypeName({ payload, callback },{ call, put }){
      const response = yield call(getTree, payload)
      yield put({
        type:'saveTypeName',
        payload:response,
      })
    },
    *addDiscern({ payload, callback },{ call, put }){
      const response = yield call(addDiscernApi, payload )
      callback && callback(response);
    },
    *updateData({ payload, callback },{ call, put }){
      const response = yield call(updateDuscernApi, payload)
      callback && callback(response)
    },
    *deleteDiscern({ payload, callback },{call, put }){
      const response = yield call(deleteDiscernApi, payload)
      callback && callback(response);
    },
    *check({ payload, callback },{ call, put }){
      const response = yield call(checkApi, payload );
      callback && callback(response)
    },
  },
};
