import expect from 'expect'
import reducer from '../../reducers/users'
import {TYPES} from '../../actions'

describe('users reducer:', () => {
  const initialState = {
      page:{
          docs:[]
      },
      byId:{},
      flash: null
  };
  it('initial', () => {
    const expectedState = initialState
    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('get user, update, delete ', () => {
    let user = {
      "name": {
        "first": "andrew",
        "last": "zuercher"
      },
      "status": "active",
      "_id": "5ae91803ab98b4825a884e0e",
      "email": "az22@barrelproofapps.com",
      "username": "az22",
      "role": {
        "permissions": {
          "admin": true
        },
        "_id": "5ae91803ab98b4825a884e0e",
        "name": "admin",
        "createdAt": "1970-01-01T00:00:00.000Z",
        "source": "seed"
      },
      "source": "fixture",
      "createdAt": "2018-05-16T02:20:03.784Z",
      "fullname": "andrew zuercher",
      "id": "5ae91803ab98b4825a884e0e"
    };

    expect(
      reducer(initialState, {
        type: TYPES.USER_SUCCESS,
        result: user
      })
    ).toEqual({
      ...initialState,
      byId: {
        "5ae91803ab98b4825a884e0e": user
      }
    })
    user.name.first = "leroy"
    expect(
      reducer(initialState, {
        type: TYPES.USERUPDATE_SUCCESS,
        result: user
      })
    ).toEqual({
      ...initialState,
      byId: {
        "5ae91803ab98b4825a884e0e": user
      }
    })
    expect(
      reducer(initialState, {
        type: TYPES.USERDELETE_SUCCESS,
        params: {id: user._id},
        result: {
          message: "successfully deleted"
        }
      })
    ).toEqual({
      ...initialState,
      byId: {},
      flash: {
          message: "successfully deleted",
          type: TYPES.USERDELETE_SUCCESS
      }
    })
  })
  it('errors ', () => {
    expect(
      reducer(initialState, {
        type: TYPES.USERCREATE_ERROR,
        result: {
          message: "error creating user, usname alrready exisits"
        }
      })
    ).toEqual({
      ...initialState,
      flash: {
        message: "error creating user, usname alrready exisits",
        error: true,
        type: TYPES.USERCREATE_ERROR
      }
    })
  })
})
