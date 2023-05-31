import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError, AxiosInstance } from 'axios';
export * from 'axios';

interface UploadFileParams {
    data?: Recordable;
    name?: string;
    file: File | Blob;
    raw?: File | Blob;
    filename?: string;
    [key: string]: any;
}
type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;
interface RequestOptions {
    joinParamsToUrl?: boolean;
    formatDate?: boolean;
    isTransformResponse?: boolean;
    isReturnNativeResponse?: boolean;
    joinPrefix?: boolean;
    apiUrl?: string;
    urlPrefix?: string;
    errorMessageMode?: ErrorMessageMode;
    joinTimestamp?: boolean;
    ignoreCancelToken?: boolean;
    withToken?: boolean;
    showSuccessModal?: boolean;
}
interface Result<T = any> {
    code: number;
    type?: 'success' | 'error' | 'warning';
    message: string;
    data: T;
}
declare enum RequestEnum {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
declare enum ResultEnum {
    SUCCESS = 200,
    ERROR = 1,
    TIMEOUT = 401,
    TYPE = "success"
}
declare enum ContentTypeEnum {
    JSON = "application/json;charset=UTF-8",
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    FORM_DATA = "multipart/form-data"
}

interface CreateAxiosOptions extends AxiosRequestConfig {
    authenticationScheme?: string;
    transform?: AxiosTransform;
    requestOptions?: RequestOptions;
}
declare abstract class AxiosTransform {
    beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
    transformReponseHook?: <T = Result>(res: AxiosResponse<T>, options: RequestOptions) => any;
    responseCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;
    requestInterceptors?: (config: InternalAxiosRequestConfig, options: CreateAxiosOptions) => InternalAxiosRequestConfig;
    responseInterceptors?: (res: AxiosResponse) => AxiosResponse;
    requestInterceptorsCatch?: (error: Error) => void;
    responseInterceptorsCatch?: (error: AxiosError<any>) => void;
}

declare class IAxios {
    private axiosInstance;
    private readonly options;
    constructor(config: CreateAxiosOptions);
    private createAxios;
    private getTransform;
    getAxiosInstance(): AxiosInstance;
    configAxios(config: CreateAxiosOptions): void;
    setHeader(headers: any): void;
    private setupInterceptors;
    supportFormData(config: AxiosRequestConfig): AxiosRequestConfig<any>;
    get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
    request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
}

declare function checkStatus(status: number, msg?: string): string;

declare function addTimeStamp<T extends boolean>(join: boolean, restful?: T): T extends true ? string : object;
declare function formatRequestDate(params: Recordable): void;

declare const createAxios: (opt?: Partial<CreateAxiosOptions>) => IAxios;

export { AxiosTransform, ContentTypeEnum, CreateAxiosOptions, ErrorMessageMode, RequestEnum, RequestOptions, Result, ResultEnum, UploadFileParams, addTimeStamp, checkStatus, createAxios, formatRequestDate };
