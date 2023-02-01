import { formChecker, BaseStructs } from '@ivy/form'

export const createFormAndRule: (args?: BaseStructs) => BaseStructs = (
  args = []
) => [
    {
      label: 'loginName',
      default: '',
      required: true,
      rule: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      id: '',
    },
    {
      label: 'password',
      default: '',
      required: true,
      rule: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
        {
          validator: formChecker.easyPasswordChecker(),
          trigger: 'blur',
        },
      ],
      id: '',
    },
    ...args,
  ]

export const formAndRule = createFormAndRule()
