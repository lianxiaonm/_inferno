// 各种环境域名配置文件
// @author: xujia624
module.exports = {
    "production": {
        "env"            : "production",
        "mtpApiRoot"     : "https://mobile.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://oauth.1qianbao.com",
        "psptApiRoot"    : "https://www.1qianbao.com",
        "ccdcApiRoot"    : "https://ccdc.1qianbao.com",
        "dRoot"          : "http://d.1qianbao.com",
        "dRoot_https"    : "https://d.1qianbao.com",
        "msApiRoot"      : "http://p1.jkimg.net",
        "msApiRoot_https": "https://p1.jkimg.net",
        "h5Root"         : "http://h5.1qianbao.com",
        "h5Root_https"   : "https://h5.1qianbao.com"
    },
    "uat"       : {
        "env"            : "uat",
        "mtpApiRoot"     : "https://mobile-uat.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://oauth-uat.1qianbao.com",
        "psptApiRoot"    : "https://www-uat.1qianbao.com",
        "ccdcApiRoot"    : "https://ccdc-uat.1qianbao.com",
        "dRoot"          : "http://d-uat.1qianbao.com",
        "dRoot_https"    : "https://d-uat.1qianbao.com",
        "msApiRoot"      : "http://p1-uat.jkimg.net",
        "msApiRoot_https": "https://p1-uat.jkimg.net",
        "h5Root"         : "http://h5-uat.1qianbao.com",
        "h5Root_https"   : "https://h5-uat.1qianbao.com"
    },

    //-------------------------------------------------------
    //test evns.
    //=======================================================
    "development": {
        "env"            : "development",
        // set api root url, default is local mock service url
        "mtpApiRoot"     : "http://127.0.0.1:30000",
        "mapOauthRoot"   : "http://127.0.0.1:30000",
        "psptApiRoot"    : "http://localhost:30000",
        "ccdcApiRoot"    : "http://127.0.0.1:30000",
        "dRoot"          : "http://localhost:20000",
        "dRoot_https"    : "https://localhost:20000",
        "msApiRoot"      : "http://localhost:20000",
        "msApiRoot_https": "http://localhost:20000",
        "h5Root"         : "http://localhost:20000",
        "h5Root_https"   : "http://localhost:20000"
    },
    "stg1"       : {
        "env"            : "stg1",
        "mtpApiRoot"     : "https://test-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://test-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://test-www.stg.1qianbao.com",
        "ccdcApiRoot"    : "https://test-ccdc.stg.1qianbao.com",
        "dRoot"          : "http://test-d.stg.1qianbao.com",
        "dRoot_https"    : "https://test-d.stg.1qianbao.com",
        "msApiRoot"      : "http://test-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://test-ms.stg.1qianbao.com",
        "h5Root"         : "http://test-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://test-h5.stg.1qianbao.com"
    },
    "stg2"       : {
        "env"            : "stg2",
        "mtpApiRoot"     : "https://test2-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://test2-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://test2-www.stg.1qianbao.com",
        "ccdcApiRoot"    : "https://test2-ccdc.stg.1qianbao.com",
        "dRoot"          : "http://test2-d.stg.1qianbao.com",
        "dRoot_https"    : "https://test2-d.stg.1qianbao.com",
        "msApiRoot"      : "http://test2-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://test2-ms.stg.1qianbao.com",
        "h5Root"         : "http://test2-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://test2-h5.stg.1qianbao.com"
    },
    "stg3"       : {
        "env"            : "stg3",
        "mtpApiRoot"     : "https://test3-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://test3-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://test3-www.stg.1qianbao.com",
        "ccdcApiRoot"    : "https://test3-www.stg.1qianbao.com",
        "dRoot"          : "http://test3-d.stg.1qianbao.com",
        "dRoot_https"    : "https://test3-d.stg.1qianbao.com",
        "msApiRoot"      : "http://test3-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://test3-ms.stg.1qianbao.com",
        "h5Root"         : "http://test3-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://test3-h5.stg.1qianbao.com"
    },
    "stg5"       : {
        "env"            : "stg5",
        "mtpApiRoot"     : "https://test5-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://test5-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://test5-www.stg.1qianbao.com",
        "ccdcApiRoot"    : "https://test5-ccdc.stg.1qianbao.com",
        "dRoot"          : "http://test5-d.stg.1qianbao.com",
        "dRoot_https"    : "https://test5-d.stg.1qianbao.com",
        "msApiRoot"      : "http://test5-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://test5-ms.stg.1qianbao.com",
        "h5Root"         : "http://test5-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://test5-h5.stg.1qianbao.com"
    },
    "stg6"       : {
        "env"            : "stg6",
        "mtpApiRoot"     : "https://test6-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://test6-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://test6-www.stg.1qianbao.com",
        "ccdcApiRoot"    : "https://test6-ccdc.stg.1qianbao.com",
        "dRoot"          : "http://test6-d.stg.1qianbao.com",
        "dRoot_https"    : "https://test6-d.stg.1qianbao.com",
        "msApiRoot"      : "http://test6-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://test6-ms.stg.1qianbao.com",
        "h5Root"         : "http://test6-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://test6-h5.stg.1qianbao.com"
    },
    "stable"     : {
        "env"            : "stable",
        "mtpApiRoot"     : "https://test-stable-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://test-stable-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://test-stable-www.stg.1qianbao.com",
        "ccdcApiRoot"    : "https://test-stable-ccdc.stg.1qianbao.com",
        "dRoot"          : "http://test-stable-d.stg.1qianbao.com",
        "dRoot_https"    : "https://test-stable-d.stg.1qianbao.com",
        "msApiRoot"      : "http://test-stable-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://test-stable-ms.stg.1qianbao.com",
        "h5Root"         : "http://test-stable-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://test-stable-h5.stg.1qianbao.com"
    },
    "docker1"    : {
        "env"            : "docker1",
        "mtpApiRoot"     : "https://docker1-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://docker1-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://docker1-www.stg.1qianbao.com/",
        "ccdcApiRoot"    : "https://docker1-ccdc.stg.1qianbao.com",
        "dRoot"          : "http://docker1-d.stg.1qianbao.com",
        "dRoot_https"    : "https://docker1-d.stg.1qianbao.com",
        "msApiRoot"      : "http://docker1-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://docker1-ms.stg.1qianbao.com",
        "h5Root"         : "http://docker1-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://docker1-h5.stg.1qianbao.com"
    },
    "docker2"    : {
        "env"            : "docker2",
        "mtpApiRoot"     : "https://docker2-mobile.stg.1qianbao.com/mtp-web",
        "mapOauthRoot"   : "https://docker2-oauth.stg.1qianbao.com",
        "psptApiRoot"    : "https://docker2-www.stg.1qianbao.com/",
        "ccdcApiRoot"    : "https://docker2-ccdc.stg.1qianbao.com",
        "dRoot"          : "http://docker2-d.stg.1qianbao.com",
        "dRoot_https"    : "https://docker2-d.stg.1qianbao.com",
        "msApiRoot"      : "http://docker2-ms.stg.1qianbao.com",
        "msApiRoot_https": "https://docker2-ms.stg.1qianbao.com",
        "h5Root"         : "http://docker2-h5.stg.1qianbao.com",
        "h5Root_https"   : "https://docker2-h5.stg.1qianbao.com"
    }
};
