
import { ElMessage } from "element-plus"
import type { ApiResponse } from '~/typs/api';

export const useApiFetch = async <T>(
  url: string | Request,
  options: any = {}
) => {
  // 设置默认选项
  const defaults = {
    baseURL: useRuntimeConfig().public.apiBase,
    headers: { 'Content-Type': 'application/json' },
    onResponseError: handleResponseError,
    onRequestError: handleRequestError
  };

  // 合并选项
  const mergedOptions = { ...defaults, ...options };

  // 发起请求
  const { data, error, pending, refresh } = await useFetch<ApiResponse<T>>(url, mergedOptions);

  // 处理业务逻辑错误
  if (data.value && data.value.code !== 200) {
    handleBusinessError(data.value);
  }

  return {
    data: data.value?.data, // 直接返回 data 字段
    rawData: data, // 保留完整响应
    error,
    pending,
    refresh
  };
};

// 处理网络/HTTP错误
const handleRequestError = ({ error }: any) => {
  console.error('请求错误:', error);
  ElMessage.error('网络请求失败，请检查连接')
};

// 处理HTTP响应错误 (状态码非2xx)
const handleResponseError = ({ response }: any) => {
  console.error(`HTTP错误 [${response.status}]:`, response._data);
  
  const messages: Record<number, string> = {
    401: '请重新登录',
    403: '没有访问权限',
    404: '资源不存在',
    500: '服务器错误'
  };

  ElMessage.error(messages[response.status] || `请求失败 (${response.status})`)

};

// 处理业务逻辑错误 (自定义错误码)
const handleBusinessError = (response: any) => {
  const errorMap: Record<number, string> = {
    1001: '参数错误',
    1002: '认证失败',
    2001: '数据不存在',
    // ...其他业务错误码
  };

  const message = errorMap[response.code] || `操作失败 (${response.code})`;
  
  console.error('业务错误:', response);
  ElMessage.error(message)
  
  // 特殊错误码处理（如token过期）
  if (response.code === 1002) {
    navigateTo('/login');
  }
};