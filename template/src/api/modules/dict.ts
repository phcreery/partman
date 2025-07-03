/* eslint-disable no-unused-vars */
import http from '@/api'
import { SERVER_ENDPOINTS } from '@/constants'

/**
 * 字典
 */

export interface Dict {
  code: string
  name: string
  parentId: number
  id: number
  children?: (this & { type: string })[]
  remark?: string
  status?: 0 | 1
}

export interface DictQuery extends RequestPage {
  code?: string
  name?: string
}

const DictAPI = {
  getDictList: (params: DictQuery): Promise<ResultPage<Dict>> => {
    // return http.get<ResultPage<Dict>>(SERVER_ENDPOINTS.geeker + `/dict/list`, params)
    const data: Dict[] = [
      {
        code: 'aa',
        name: 'aa dict',
        remark: 'comment of a',
        status: 0,
        parentId: 0,
        id: 1,
        children: [
          {
            code: 'a1',
            id: 10,
            parentId: 1,
            name: 'a1-v',
            type: 'info',
          },
          {
            code: 'a2',
            id: 11,
            parentId: 1,
            name: 'a2-v',
            type: 'info',
          },
        ],
      },
      {
        code: 'bb',
        name: 'bb dict',
        remark: 'comment of a',
        status: 0,
        parentId: 0,
        id: 2,
        children: [
          {
            code: 'b1',
            parentId: 2,
            id: 21,
            name: 'b1-v',
            type: 'info',
          },
          {
            code: 'b2',
            parentId: 2,
            id: 22,
            name: 'b2-v',
            type: 'info',
          },
        ],
      },
    ]
    return Promise.resolve({
      list: data,
      total: data.length,
    })
  },

  add() {},
  edit() {},
}

export default DictAPI
