import useForm from '@/hooks/web/useForm'
import { submitForm } from '@/utils/formAndRules/form'

export default function () {
  // 欢迎语句
  const timeSayHello = computed(() => {
    const date = new Date().getHours()
    let hoursTip = ''
    if (date >= 0 && date < 12) {
      hoursTip = '上午好'
    } else if (date >= 12 && date < 18) {
      hoursTip = '下午好'
    } else {
      hoursTip = '晚上好'
    }
    return hoursTip
  })

  // 项目名称
  const projectName = computed(() => `${window.config.projectName}`)

  /****************************************************************/
  const {
    form: loginForm,
    formRef: loginFormRef,
    rules: loginFormRules,
  } = useForm([
    { name: 'username', required: true },
    { name: 'password', required: true },
  ])

  const handleLogin = submitForm(async (valid?: boolean) => {
    if (valid) {
    }
  })
  return {
    timeSayHello,
    projectName,
    loginForm,
    loginFormRef,
    loginFormRules,
    handleLogin,
  }
}
