/**
 * 正则校验
 */
class Pattern {
  public readonly email =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/
  public readonly url = new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i'
  )
  // 全部为中文
  public readonly allchinese = /^[\u4E00-\u9FA5]+$/
  // 包含中文
  public readonly chinese = /[\u4e00-\u9fa5]/

  public readonly carId =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
  public readonly mobile = /^1[3456789]\d{9}$/

  public readonly date /* eslint-disable no-useless-escape */ =
    /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/
  public readonly hkMc = /^[WC][0-9]{8}$/
  public readonly taiWan = /^T[0-9]{8}$/
  public readonly passport =
    /^1[45][0-9]{7}|([E|e]\d{8})|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/
  public readonly num = /^[1-9][0-9]*$/
  public readonly decimal = /^\d*\.\d{1,}$/ // 小数
  public readonly idCardNo =
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  public readonly twCome = /^(\d{8}|[a-zA-Z]\d{7})$/ // 台湾居民来往大陆通行证(台胞证)
  public readonly hmHid = /^8[123]0000\d{12}$/ // 港澳台居民居住证

  /**
   * 身份证规则检测
   * @param { string } value
   * @returns { boolean } true 符合身份证id规则，false不符合规则
   */
  testIdCardNo(value: string): boolean {
    return this.idCardNo.test(value.trim())
  }

  /**
   * 检测是否为中文
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testCn(value: string): boolean {
    return this.allchinese.test(value.trim())
  }

  /**
   * 手机号码检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testMobile(value: string): boolean {
    return this.mobile.test(value.trim())
  }

  /**
   * 邮箱检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testEmail(value: string): boolean {
    return this.email.test(value.trim())
  }

  /**
   * URL检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testUrl(value: string): boolean {
    return this.url.test(value.trim())
  }

  /**
   * 车牌检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testCarId(value: string) {
    return this.carId.test(value.trim())
  }

  /**
   * 日期检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testDate(value: string) {
    return this.date.test(value.trim())
  }

  /**
   * 港澳通行证检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testHKMc(value: string) {
    return this.hkMc.test(value.trim())
  }

  /**
   * 台湾通行证检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testTaiWan(value: string) {
    return this.taiWan.test(value.trim())
  }

  /**
   * 护照检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testPassport(value: string) {
    return this.passport.test(value.trim())
  }

  /**
   * 整数检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testNum(value: string) {
    return !this.testDecimal(value)
  }

  /**
   * 检测是否为小数
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testDecimal(value: string) {
    return this.decimal.test(value.trim())
  }

  /**
   * 台胞证检测
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testTwCome(value: string) {
    return this.twCome.test(value.trim())
  }

  /**
   * 港澳台居民居住证
   * @date 2020-07-08
   * @param { string } value
   * @returns { boolean }
   */
  testHmHid(value: string) {
    return this.hmHid.test(value.trim())
  }

  /**
   * 校验字符串中是否包含emoji表情
   * @param value
   * @returns
   */
  testEmoji(value: string) {
    value = String(value)
    for (let i = 0; i < value.length; i++) {
      const hs = value.charCodeAt(i)
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (value.length > 1) {
          const ls = value.charCodeAt(i + 1)
          const uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true
          }
        }
      } else if (value.length > 1) {
        const ls = value.charCodeAt(i + 1)
        if (ls == 0x20e3) {
          /* istanbul ignore next */
          return true
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true
        } else if (0x2b05 <= hs && hs <= 0x2b07) {
          return true
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true
        } else if (
          hs == 0xa9 ||
          hs == 0xae ||
          hs == 0x303d ||
          hs == 0x3030 ||
          hs == 0x2b55 ||
          hs == 0x2b1c ||
          hs == 0x2b1b ||
          hs == 0x2b50
        ) {
          return true
        }
      }
    }
    return false
  }
}

const pattern = new Pattern()

export { pattern }
