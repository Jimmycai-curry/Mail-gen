// Spec: /docs/specs/login-page.md
// 说明: 阿里云SMS服务封装,用于发送短信验证码
// 使用@alicloud/pop-core SDK(阿里云官方推荐)

import Core from '@alicloud/pop-core'

/**
 * 短信发送接口
 *
 * 发送短信验证码到指定手机号
 *
 * 使用方式:
 * ```typescript
 * const result = await sendSMS('13800138000', '123456')
 * if (result.success) {
 *   console.log('短信发送成功')
 * }
 * ```
 *
 * @param phone - 接收短信的手机号(中国大陆11位)
 * @param code - 验证码(6位数字)
 * @returns 发送结果
 */
export async function sendSMS(phone: string, code: string): Promise<{
  success: boolean
  message: string
  requestId?: string
}> {
  try {
    // 检查环境变量配置
    const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID
    const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET
    const signName = process.env.ALIYUN_SMS_SIGN_NAME
    const templateCode = process.env.ALIYUN_SMS_TEMPLATE_CODE

    if (!accessKeyId || !accessKeySecret || !signName || !templateCode) {
      return {
        success: false,
        message: '阿里云SMS配置未完成,请检查环境变量'
      }
    }

    // 创建阿里云SMS客户端
    const client = new Core({
      accessKeyId,
      accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com', // SMS服务端点
      apiVersion: '2017-05-25'                  // API版本
    })

    // 发送短信请求
    const requestParams = {
      PhoneNumbers: phone,           // 接收短信的手机号
      SignName: signName,            // 短信签名
      TemplateCode: templateCode,      // 短信模板CODE
      TemplateParam: JSON.stringify({ code }) // 模板参数(验证码)
    }

    const response = await client.request('SendSms', requestParams, {
      method: 'POST'
    }) as {
      Code: string
      Message: string
      RequestId: string
      BizId: string
    }

    // 解析响应
    // 阿里云响应格式: { Code: 'OK', Message: 'OK', RequestId: 'xxx', BizId: 'xxx' }
    const codeResult = response.Code as string

    if (codeResult === 'OK') {
      console.log('[SMS] 短信发送成功:', phone)
      return {
        success: true,
        message: '验证码已发送',
        requestId: response.RequestId as string
      }
    } else {
      console.error('[SMS] 短信发送失败:', response.Message)
      return {
        success: false,
        message: `短信发送失败: ${response.Message}`
      }
    }
  } catch (error) {
    console.error('[SMS] 短信发送异常:', error)
    return {
      success: false,
      message: '短信服务异常,请稍后重试'
    }
  }
}
