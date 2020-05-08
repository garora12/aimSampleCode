import expect from 'expect'
import reducer from '../../reducers/oems'
import {TYPES} from '../../actions'

describe('oems reducer:', () => {
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

  it('get oem, update, delete ', () => {
    const oem = {
      "_id": "5ae91803ab98b4825a884e00",
      "name": "Suzuki",
      "source": "fixture",
      "createdAt": "2018-05-16T02:20:01.538Z",
      "createdBy": {
        "name": {
          "first": "andrew",
          "last": "zuercher"
        },
        "status": "active",
        "_id": "5ae91803ab98b4825a884e0e",
        "email": "az22@barrelproofapps.com",
        "fullname": "andrew zuercher",
        "id": "5ae91803ab98b4825a884e0e"
      },
      "updatedAt": "2018-05-16T02:20:01.538Z",
      "updatedBy": {
        "name": {
          "first": "andrew",
          "last": "zuercher"
        },
        "_id": "5ae91803ab98b4825a884e0e",
        "email": "az22@barrelproofapps.com",
        "role": "5ae91803ab98b4825a884e0e",
        "fullname": "andrew zuercher",
        "id": "5ae91803ab98b4825a884e0e"
      }
    };
    expect(
      reducer(initialState, {
        type: TYPES.OEM_SUCCESS,
        result: oem
      })
    ).toEqual({
      ...initialState,
      byId: {
        "5ae91803ab98b4825a884e00": oem
      }
    })
    oem.name = "foo"
    expect(
      reducer(initialState, {
        type: TYPES.OEMUPDATE_SUCCESS,
        result: oem
      })
    ).toEqual({
      ...initialState,
      byId: {
        "5ae91803ab98b4825a884e00": oem
      },
      flash: {message: "update successful", type: "OEMUPDATE_SUCCESS"}
    })
    expect(
      reducer(initialState, {
        type: TYPES.OEMDELETE_SUCCESS,
        params: {id: oem._id},
        result: {
          message: "successfully deleted"
        }
      })
    ).toEqual({
      ...initialState,
      byId: {},
      flash: {
          message: "successfully deleted",
          type: TYPES.OEMDELETE_SUCCESS
      }
    })
  })
  it('errors ', () => {
    expect(
      reducer(initialState, {
        type: TYPES.OEMS_ERROR,
        result: {
          message: "error searching"
        }
      })
    ).toEqual({
      ...initialState,
      flash: {
        message: "error searching",
        error: true,
        type: TYPES.OEMS_ERROR
      }
    })
  })
})
