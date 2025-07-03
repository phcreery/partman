import http from '@/api'
import { SERVER_ENDPOINTS } from '@/constants'

export interface ResFileUrl {
  fileUrl: string
}
/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<ResFileUrl>(SERVER_ENDPOINTS.geeker + `/file/upload/img`, params, { cancel: false })
}

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<ResFileUrl>(SERVER_ENDPOINTS.geeker + `/file/upload/video`, params, { cancel: false })
}
