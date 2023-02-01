import { useUserStore } from '@/store/modules/user'
import { submitForm } from '@/libs/formAndRules/form'
import { useRouter } from 'vue-router'
import useForm, { defineFormTypes } from './web/useForm'
import { watch } from 'vue'

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

  const formProps2 = defineFormTypes([
    {
      name: 'username',
      default: 'xixi',
      required: true,
    },
    {
      name: 'age',
      default: 20,
    },
    {
      name: 'married',
      default: true,
    },
    'male',
  ])

  const { form: form2 } = useForm<
    {
      [P in typeof formProps2[number] as P extends string ? P : never]: any
    } & { [x: string]: any }
  >(formProps2)
  console.log(`生成的表单form2`, form2.value)

  return {
    loginFormRef,
    loginForm,
    loginFormRules,
    handleLoginForm,
  }
}
