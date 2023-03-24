import {
  ref,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  unref,
  inject,
  UnwrapRef,
} from 'vue'

import Fetch from './Fetch'
import { USEREQUEST_GLOBAL_OPTIONS_PROVIDE_KEY } from './config'
import {
  UseRequestFetchState,
  UseRequestOptions,
  UseRequestPlugin,
  useRequestResult,
  UseRequestService,
} from './types'

function isUseRequestFetchState<TData, TParams extends any[]>(
  state: unknown
): state is UseRequestFetchState<TData, TParams> {
  const keys = Object.keys(state as object)
  return (
    keys.filter(i => ['data', 'loading', 'params', 'error'].includes(i))
      .length === 4
  )
}

// function isUseRequestFetchStateKey<TData, TParams extends any[]>(
//   field: string,
//   state: unknown,
// ): state is UseRequestFetchState<TData, TParams>[keyof UseRequestFetchState<TData, TParams>] {
//   return Boolean(['data', 'loading', 'params', 'error'].find(i => i === field))
// }

function useRequestImplement<TData, TParams extends any[]>(
  service: UseRequestService<TData, TParams>,
  options: UseRequestOptions<TData, TParams> = {},
  plugins: UseRequestPlugin<TData, TParams>[] = []
) {
  // global option
  const USEREQUEST_GLOBAL_OPTIONS = inject<Record<string, any>>(
    USEREQUEST_GLOBAL_OPTIONS_PROVIDE_KEY,
    {}
  )
  // read option
  const {
    initialData = undefined,
    manual = false,
    ready = true,
    ...rest
  } = options

  const fetchOptions = {
    manual,
    ready,
    ...rest,
  }

  // serviceRef store service
  const serviceRef = ref(service)

  // reactive
  const state = reactive<UseRequestFetchState<TData, TParams>>({
    data: initialData,
    loading: false,
    params: undefined,
    error: undefined,
  })

  const setState = (currentState: unknown, field?: keyof typeof state) => {
    if (field) {
      // if (isUseRequestFetchStateKey<UnwrapRef<TData>, UnwrapRef<TParams>>(field, currentState)) {
      //   state[field] = currentState as any
      // }
      state[field] = currentState as any
    } else {
      if (
        isUseRequestFetchState<UnwrapRef<TData>, UnwrapRef<TParams>>(
          currentState
        )
      ) {
        state.data = currentState.data
        state.loading = currentState.loading
        state.error = currentState.error
        state.params = currentState.params
      }
    }
  }

  const initState = plugins.map(p => p?.onInit?.(fetchOptions)).filter(Boolean)
  // Fetch Instance
  const fetchInstance = new Fetch<TData, TParams>(
    serviceRef,
    fetchOptions,
    setState,
    Object.assign({}, ...initState, state)
  )

  fetchInstance.options = fetchOptions

  // run plugins
  fetchInstance.pluginImpls = plugins.map(p => {
    return p(fetchInstance, fetchOptions)
  })

  // manual
  onMounted(() => {
    if (!manual) {
      const params = fetchInstance.state.params || options.defaultParams || []
      if (unref(ready)) fetchInstance.run(...(params as TParams))
    }
  })

  // onUnmounted cancel request
  onUnmounted(() => {
    fetchInstance.cancel()
  })

  return {
    ...toRefs(state),
    cancel: fetchInstance.cancel.bind(fetchInstance),
    refresh: fetchInstance.refresh.bind(fetchInstance),
    refreshAsync: fetchInstance.refreshAsync.bind(fetchInstance),
    run: fetchInstance.run.bind(fetchInstance),
    runAsync: fetchInstance.runAsync.bind(fetchInstance),
    mutate: fetchInstance.mutate.bind(fetchInstance),
  } as unknown as useRequestResult<TData, TParams>
}

export default useRequestImplement
