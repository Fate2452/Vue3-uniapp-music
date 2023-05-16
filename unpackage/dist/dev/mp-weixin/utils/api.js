"use strict";
var common_vendor = require("../common/vendor.js");
var utils_config = require("./config.js");
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: utils_config.config.baseURL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.request = request;
