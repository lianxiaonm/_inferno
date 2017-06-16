"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputWrapper_1 = require("./InputWrapper");
var SelectWrapper_1 = require("./SelectWrapper");
var TextareaWrapper_1 = require("./TextareaWrapper");
exports.wrappers = new Map();
function processElement(flags, vNode, dom, mounting) {
    if (flags & 512 /* InputElement */) {
        return InputWrapper_1.processInput(vNode, dom);
    }
    if (flags & 2048 /* SelectElement */) {
        return SelectWrapper_1.processSelect(vNode, dom, mounting);
    }
    if (flags & 1024 /* TextareaElement */) {
        return TextareaWrapper_1.processTextarea(vNode, dom, mounting);
    }
    return false;
}
exports.default = processElement;
