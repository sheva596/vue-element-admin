import request from '@/utils/request'
/**
 * 车辆记录表的相关操作
 * @param {} query 
 * @returns 
 */
export function getParkingRecordList() {
  return request({
    url: '/index/record',
    method: 'get'
  })
}