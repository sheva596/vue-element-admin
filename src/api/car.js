import request from '@/utils/request'

/**
 * 车辆临时表的相关操作
 */
export function fetchTempList(query) {
  return request({
    url: '/car/parking',
    method: 'get',
    params: query
  })
}
export function deleteTemp(id) {
  return request({
    url: `/car/temp/delete/${id}`,
    method: 'post'
  })
}
export function createTemp(data) {
  return request({
    url: '/car/temp/add',
    method: 'post',
    data
  })
}
export function updateTemp(data) {
  return request({
    url: '/car/temp/update',
    method: 'post',
    data
  })
}
export function unpark(id){
  return request({
    url: `/car/unpark/${id}`,
    method: 'post'
  })
}



/**
 * 车辆记录表的相关操作
 * @param {} query 
 * @returns 
 */
export function fetchRecordList(query) {
  return request({
    url: '/car/record',
    method: 'get',
    params: query
  })
}

export function deleteRecord(id) {
  return request({
    url: `/car/record/delete/${id}`,
    method: 'post'
  })
}

export function createRecord(data) {
  return request({
    url: '/car/record/add',
    method: 'post',
    data
  })
}

export function updateRecord(data) {
  return request({
    url: '/car/record/update',
    method: 'post',
    data
  })
}
