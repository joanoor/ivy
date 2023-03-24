import { UseRequestOptions, UseRequestPlugin, UseRequestService } from './types'
import useRequest from './useRequest'

function createUseRequest<
  TData,
  TParams extends unknown[] = unknown[],
  PluginsOptions extends UseRequestPlugin<TData, TParams>[] = UseRequestPlugin<
    TData,
    TParams
  >[]
>(
  service: UseRequestService<TData, TParams>,
  options?: UseRequestOptions<TData, TParams>,
  plugins?: PluginsOptions
) {
  return useRequest<TData, TParams>(service, options, plugins)
}

export default createUseRequest
