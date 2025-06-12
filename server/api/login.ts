export default defineEventHandler(() => {
  return {
    code: 200,
    msg: 'success',
    data: {
      token: new Date().getTime().toString()
    }
  }
})