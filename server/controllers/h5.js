var express = require('express');
var router = express.Router();
var base = require("./base");
var logger = require("../helpers/log");
/*
** sample code**
 */
/*发送验证码*/
router.post("/cma_send_otp_msg.json", function(req, res) {
    var reqBody = req.body,
        captchaToken = reqBody.captchaToken,
        phone = reqBody.phone;
    setTimeout(function(){
        if (captchaToken == "captcha_validated_token") {
            base.sendApiData(res, "./ApiData/doc/cma_send_otp_msg_token.json");
        } else {
            base.sendApiData(res, './ApiData/doc/cma_send_otp_msg.json');
        }
    }, 2000);
});
/*验证 验证码*/
router.post("/cma_verify_img_code.json", function(req, res) {
    var reqBody = req.body,
        captchaId = reqBody.captchaId,
        captchaInput = reqBody.captchaInput;
    setTimeout(function(){
        if (captchaId == "zxcvbnm" && captchaInput == "1111") {
            base.sendApiData(res, './ApiData/doc/cma_verify_img_code_token.json');
        } else {
            base.sendApiData(res, './ApiData/doc/cma_verify_img_code.json');
        }
    }, 2000)
});
/*刷新验证码*/
router.post("/refresh_img_code.json", function(req, res) {
    var reqBody = req.body;
    base.sendApiData(res, './ApiData/doc/refresh_img_code.json');

});
module.exports = router;
