import { useUserStore } from '@/store/modules/user'
import { submitForm } from '@/libs/formAndRules/form'
import { useRouter } from 'vue-router'
import useForm, { defineFormTypes } from './web/useForm'

export default function () {
  const userStore = useUserStore()
  const router = useRouter()

  const formProps = defineFormTypes([
    {
      name: 'loginName',
      uniqId: '',
    },
    'password',
  ])
  const {
    form: loginForm,
    rules: loginFormRules,
    formRef: loginFormRef,
  } = useForm<
    {
      [P in typeof formProps[number] as P extends string ? P : never]:
        | string
        | number
    } & { [x: string]: string | number }
  >(formProps)

  const handleLoginForm = submitForm(async (valid?: boolean) => {
    if (valid) {
      userStore
        .loginByUser({
          ...loginForm,
        })
        .then(res => {
          if (res) {
            router.push('/')
          }
        })
    }
  })

  return {
    loginFormRef,
    loginForm,
    loginFormRules,
    handleLoginForm,
  }
}
