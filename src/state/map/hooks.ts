import client from '../../feathers'
import { AppState, AppDispatch } from 'state'
import { useDispatch, useSelector } from 'react-redux'
import { updateLandData } from './actions'

export function getLandData() {
    const result = client.service('land').find()

    return result
}