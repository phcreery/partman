import { reactive } from 'vue'
import { ElButton, ElInput, ElMessage, ElSwitch, ElTag } from 'element-plus'
import { type ResUserList } from '@/api/modules/user'
import type { ColumnProps, HeaderRenderScope } from '@/components/ProTable/interface'
import { getUserStatus, getUserGender } from '@/api/modules/user'
import { useAuthButtons } from '@/hooks/useAuthButtons'

const { BUTTONS } = useAuthButtons()

// 自定义渲染表头（使用tsx语法）
export const headerRender = (scope: HeaderRenderScope<ResUserList>) => {
  return (
    <ElButton type="primary" onClick={() => ElMessage.success('我是通过 tsx 语法渲染的表头')}>
      {scope.column.label}
    </ElButton>
  )
}

// 切换用户状态函数 - 需要从外部传入
let changeStatusHandler: ((_row: ResUserList) => Promise<void>) | null = null

export const setChangeStatusHandler = (handler: (_row: ResUserList) => Promise<void>) => {
  changeStatusHandler = handler
}

// 表格配置项
export const columns = reactive<ColumnProps<ResUserList>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  { type: 'sort', label: 'Sort', width: 80 },
  { type: 'expand', label: 'Expand', width: 85 },
  {
    prop: 'username',
    label: '用户姓名',
    search: { el: 'input', tooltip: '我是搜索提示' },
    render: scope => {
      return (
        <ElButton type="primary" link onClick={() => ElMessage.success('我是通过 tsx 语法渲染的内容')}>
          {scope.row.username}
        </ElButton>
      )
    },
  },
  {
    prop: 'gender',
    label: '性别',
    enum: getUserGender,
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'genderLabel', value: 'genderValue' },
  },
  {
    prop: 'user.detail.age',
    label: '年龄',
    search: {
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <ElInput modelValue={searchParam.minAge} placeholder="最小年龄" />
            <span class="mr10 ml10">-</span>
            <ElInput modelValue={searchParam.maxAge} placeholder="最大年龄" />
          </div>
        )
      },
    },
  },
  { prop: 'idCard', label: '身份证号', search: { el: 'input' } },
  { prop: 'email', label: '邮箱' },
  { prop: 'address', label: '居住地址' },
  {
    prop: 'status',
    label: '用户状态',
    enum: getUserStatus,
    search: { el: 'tree-select', props: { filterable: true } },
    fieldNames: { label: 'userLabel', value: 'userStatus' },
    render: scope => {
      return BUTTONS.value.status ? (
        <ElSwitch
          modelValue={scope.row.status}
          activeText={scope.row.status ? '启用' : '禁用'}
          activeValue={1}
          inactiveValue={0}
          onChange={() => changeStatusHandler?.(scope.row)}
        />
      ) : (
        <ElTag type={scope.row.status ? 'success' : 'danger'}>{scope.row.status ? '启用' : '禁用'}</ElTag>
      )
    },
  },
  {
    prop: 'createTime',
    label: '创建时间',
    headerRender,
    width: 180,
    search: {
      el: 'date-picker',
      span: 2,
      props: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00'],
    },
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 },
])
