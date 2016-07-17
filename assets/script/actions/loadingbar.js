import { LOADINGBAR_BEGIN, LOADINGBAR_END } from '../constants/actionTypes';

/**
 * Action Creater
 */

export function beginLoadingCreater() {
  return {
    type: LOADINGBAR_BEGIN
  }
}

export function endLoadingCreater() {
  return {
    type: LOADINGBAR_END
  }
}