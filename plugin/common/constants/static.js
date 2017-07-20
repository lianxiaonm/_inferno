
export const regExp = {
    phone: /^1[3-9][0-9]\d{8}$/,
    otp: /^\d{6}$/,
    captcha: /^.{4}$/,
    url: /^https?:\/\//,
    idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    chCode: /[^\u4e00-\u9fa5\s+]/ig,
    enCode: /^[a-zA-Z\s]+$/
}
export const native = {
    close: ''
}
