import deepmerge2 from 'deepmerge';
import dateUtil from 'dayjs';
import { WorkBook } from 'xlsx';
import qs from 'qs';
export { cloneDeep, debounce, isArray, isBoolean, isDate, isFunction, isMap, isNull, isNumber, isRegExp, isString, isUndefined, isWeakMap, isWeakSet, omit, pick, set, throttle, trim, upperCase, upperFirst } from 'lodash-es';

type Mod = string | {
    [key: string]: any;
};
type Mods = Mod | Mod[];
type BEM = ReturnType<typeof createBEM>;
declare function buildBEM(name: string): (el?: Mods, mods?: Mods) => Mods;
declare function createBEM(name: string, prefixCls: string): ((el?: Mods | undefined, mods?: Mods | undefined) => Mods)[];
declare function createNamespace(name: string, prefixCls: string): readonly [string, (el?: Mods | undefined, mods?: Mods | undefined) => Mods];

declare function randomHexColorCode(): string;
declare function hexToRGB(hex: string): string;
declare function rgbToHex(r: string): string;
declare function rgbToHex(r: number, g: number, b: number): string;
declare function colorIsDark(color: string): boolean | undefined;
declare function darken(color: string, amount: number): string;
declare function lighten(color: string, amount: number): string;
declare function calculateBestTextColor(hexColor: string): "#000000" | "#FFFFFF";

interface TreeHelperConfig {
    id: string;
    children: string;
    pid: string;
}
declare const pickDuplicate: (arr: any[], key?: any) => number[][];
declare const getDepth: (arr: any[], deep?: number) => number;
declare const arrayChangeToObj: (d: Recordable[], key: string) => Recordable<any>;
declare const changeToTree: (d: Recordable[], key?: string, pkey?: string) => any[];
declare function listToTree<T = any>(list: any[], config?: Partial<TreeHelperConfig>): T[];
declare function treeToList<T = any>(tree: any, config?: Partial<TreeHelperConfig>): T;
declare function findNode<T = any>(tree: any, func: Fn, config?: Partial<TreeHelperConfig>): T | null;
declare function findNodeAll<T = any>(tree: any, func: Fn, config?: Partial<TreeHelperConfig>): T[];
declare function findPath<T = any>(tree: any, func: Fn, config?: Partial<TreeHelperConfig>): T | T[] | null;
declare function findPathAll(tree: any, func: Fn, config?: Partial<TreeHelperConfig>): any[];
declare function filter<T = any>(tree: T[], func: (n: T) => boolean, config?: Partial<TreeHelperConfig>): T[];
declare function forEach<T = any>(tree: T[], func: (n: T) => any, config?: Partial<TreeHelperConfig>): void;
declare function treeMap<T = any>(treeData: T[], opt: {
    children?: string;
    conversion: Fn;
}): T[];
declare function treeMapEach(data: any, { children, conversion }: {
    children?: string;
    conversion: Fn;
}): any;
declare function eachTree(treeDatas: any[], callBack: Fn, parentNode?: {}): void;

declare const formatToDateTime: (date?: dateUtil.ConfigType, format?: string) => string;
declare const formatToDate: (date?: dateUtil.ConfigType, format?: string) => string;
declare const timeAgo: (target: string) => string;
declare const isDisableBeforeDate: (date: Date) => boolean;
declare const isDisableAfterDate: (date: Date) => boolean;
declare const dayjs: typeof dateUtil;

interface ViewportOffsetResult {
    left: number;
    top: number;
    right: number;
    bottom: number;
    rightIncludeBody: number;
    bottomIncludeBody: number;
}
declare const getBoundingClientRect: (element: Element) => DOMRect | number;
declare const hasClass: (el: Element, cls: string) => boolean;
declare const addClass: (el: Element, cls: string) => void;
declare function toggleClass(flag: boolean, clsName: string, target?: HTMLElement): void;
declare const removeClass: (el: Element, cls: string) => void;
declare const getViewportOffset: (element: Element) => ViewportOffsetResult;
declare const hackCss: (attr: string, value: string) => any;
declare const on: (element: Element | HTMLElement | Document | Window, event: string, handler: EventListenerOrEventListenerObject) => void;
declare const off: (element: Element | HTMLElement | Document | Window, event: string, handler: Fn) => void;
declare const once: (el: HTMLElement, event: string, fn: EventListener) => void;
declare const useRafThrottle: <T extends Fn<any, any>>(fn: T) => T;
declare const setCssVar: (prop: string, val: any, dom?: HTMLElement) => void;

declare function base64ToBlob(base64Buf: string): Blob;
declare const dataUrl2Image: (dataUrl: string) => Promise<HTMLImageElement>;
declare const blob2Base64: (file: Blob) => Promise<any>;
declare const canvas2Blob: (canvas: HTMLCanvasElement, type: string, quality: number) => Promise<unknown>;
declare const compressionPicture: (file: File, quality?: number, threshold?: number) => Promise<Blob>;
declare function imgUrl2Base64(url: string, mineType?: string): Promise<string>;
declare function base64ToImgUrl(data: string): string;
declare function excelBlob2Json(fileBlob: Blob, callback: (data: WorkBook) => void): void;

declare function downloadByImgUrl(url: string, filename: string, option?: {
    onDownloaded?: () => void;
    mime?: string;
    bom?: BlobPart;
}): void;
declare function downloadByBase64(buf: string, filename: string, option?: {
    onDownloaded?: () => void;
    mime?: string;
    bom?: BlobPart;
}): void;
declare function downloadByBlobData(data: BlobPart, filename: string, option?: {
    mime?: string;
    bom?: BlobPart;
    onDownloaded?: () => void;
}): void;
declare function downloadByFileUrl({ url, target, fileName, }: {
    url: string;
    target?: TargetContext;
    fileName?: string;
}): boolean;
declare function downloadByJson<T extends any[]>(data: T, fileName: string, option: {
    onBefore?: (data: T) => T;
    onSetTableHeader?: (headers: string) => string;
    onDownloaded?: () => void;
}): void;

declare const isWindow: (val: unknown) => val is Window;
declare const isBrowser: boolean;
declare const isServer: boolean;
declare const isClient: boolean;
declare const isEmpty: <T = unknown>(val: T) => val is T;
declare const isElement: (val: unknown) => val is Element;
declare const isUrl: (path: string) => boolean;
declare const isNullOrUnDef: (val: unknown) => val is null | undefined;
declare const isPromise: <T = any>(val: any) => val is Promise<T>;
declare const isPlainObject: (val: unknown) => val is Recordable<any>;
declare const isHexColor: (color: string) => boolean;
declare const isStringNumber: (val: string) => boolean;

interface Console<T = string> {
    log: (str: T) => void;
    warn: (str: T) => void;
    error: (str: T) => void;
    success: (str: T) => void;
}
declare const _console: Console<string>;
declare function assertType<T>(val: unknown): val is T;
declare function getTypeOfValue(value: unknown): string;
declare function getPropValue<T, K extends keyof T>(obj: T, key: K): T[K];
declare const noop: () => void;
declare function toFixed(num: number, fixed?: number): string;
declare function arrScrambling<T>(arr: T[]): T[];
declare function genRandomString(len?: number): string;
declare function fistLetterUpper(str: string): string;
declare function approximatelyEqual(v1: number, v2: number, epsilon?: number): boolean;
declare function sleep(ms: number): Promise<unknown>;
declare function scrollToTop(element: HTMLElement): void;
declare function loadScript(scriptURL: string, placeHolder: string): Promise<unknown>;
declare class PollingAction {
    private time;
    private immediate;
    private callback;
    private timer;
    constructor(callback: AnyFunction, time?: number, immediate?: boolean);
    start(): void;
    cancel(): void;
}
declare function setObjToUrlParams(baseUrl: string, obj: any): string;
declare function convertToThousands(n: number): string;
declare function convertStrToAsterisk(str: string, start?: number, end?: number, fill?: string): string;
declare function convertChineseMoney(n: number): string;
declare function toFullScreen(): void;
declare function exitFullscreen(): void;
declare function openNewWindow(url: string, windowName: string, width: number, height: number): void;
declare function openWindow(url: string, opt?: {
    target?: TargetContext | string;
    noopener?: boolean;
    noreferrer?: boolean;
}): void;
declare function getUrlQuery(): qs.ParsedQs;
declare function getBrowserInfo(): RegExpMatchArray | "IE/7" | "IE/8" | "IE/9" | "IE/10" | "IE/11" | "IE/edge" | null | undefined;
declare function textSize(text: string, fontSize?: string): {
    width: number;
    height: number;
};
declare function canUseDom(): boolean;
declare function mergeAll(...sources: Recordable[]): Recordable<any>;

declare class Pattern {
    private readonly email;
    private readonly url;
    private readonly ip;
    private readonly ipDomain;
    private readonly allchinese;
    private readonly carId;
    private readonly mobile;
    private readonly phone;
    private readonly date;
    private readonly hkMc;
    private readonly taiWan;
    private readonly passport;
    private readonly decimal;
    private readonly idCardNo;
    private readonly twCome;
    private readonly hmHid;
    testIdCardNo(value: string): boolean;
    testCn(value: string): boolean;
    testMobile(value: string): boolean;
    testPhone(value: string): boolean;
    testEmail(value: string): boolean;
    testUrl(value: string): boolean;
    testIp(value: string): boolean;
    testIpDomain(value: string): boolean;
    testCarId(value: string): boolean;
    testDate(value: string): boolean;
    testHKMc(value: string): boolean;
    testTaiWan(value: string): boolean;
    testPassport(value: string): boolean;
    testNum(value: string): boolean;
    testDecimal(value: string): boolean;
    testTwCome(value: string): boolean;
    testHmHid(value: string): boolean;
    testEmoji(value: string): boolean;
}
declare const pattern: Pattern;

declare const deepmerge: typeof deepmerge2;

export { BEM, PollingAction, ViewportOffsetResult, _console, addClass, approximatelyEqual, arrScrambling, arrayChangeToObj, assertType, base64ToBlob, base64ToImgUrl, blob2Base64, buildBEM, calculateBestTextColor, canUseDom, canvas2Blob, changeToTree, colorIsDark, compressionPicture, convertChineseMoney, convertStrToAsterisk, convertToThousands, createBEM, createNamespace, darken, dataUrl2Image, dayjs, deepmerge, downloadByBase64, downloadByBlobData, downloadByFileUrl, downloadByImgUrl, downloadByJson, eachTree, excelBlob2Json, exitFullscreen, filter, findNode, findNodeAll, findPath, findPathAll, fistLetterUpper, forEach, formatToDate, formatToDateTime, genRandomString, getBoundingClientRect, getBrowserInfo, getDepth, getPropValue, getTypeOfValue, getUrlQuery, getViewportOffset, hackCss, hasClass, hexToRGB, imgUrl2Base64, isBrowser, isClient, isDisableAfterDate, isDisableBeforeDate, isElement, isEmpty, isHexColor, isNullOrUnDef, isPlainObject, isPromise, isServer, isStringNumber, isUrl, isWindow, lighten, listToTree, loadScript, mergeAll, noop, off, on, once, openNewWindow, openWindow, pattern, pickDuplicate, randomHexColorCode, removeClass, rgbToHex, scrollToTop, setCssVar, setObjToUrlParams, sleep, textSize, timeAgo, toFixed, toFullScreen, toggleClass, treeMap, treeMapEach, treeToList, useRafThrottle };
