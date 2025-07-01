export default defineEventHandler(async () => {
  try {
    const res = await fetch('https://api.sampleapis.com/csscolornames/colors')

    if (!res.ok) {
      // 如果后端返回的不是成功状态码 (2xx)，则抛出错误
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json(); 

    if(data.error) {
      // sampleapis 的 data 如果有 error key，则是有错误
      throw new Error(`HTTP error! status: ${data.message}`);
    }

    return {
      code: 200,
      msg: 'success',
      data
    }
  } catch(err) {
    return {
      code: 500,
      msg: String(err)
    }
  }
  
})