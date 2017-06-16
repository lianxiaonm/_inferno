import { processInput } from './InputWrapper';
import { processSelect } from './SelectWrapper';
import { processTextarea } from './TextareaWrapper';
export const wrappers = new Map();
export default function processElement(flags, vNode, dom, mounting) {
    if (flags & 512 /* InputElement */) {
        return processInput(vNode, dom);
    }
    if (flags & 2048 /* SelectElement */) {
        return processSelect(vNode, dom, mounting);
    }
    if (flags & 1024 /* TextareaElement */) {
        return processTextarea(vNode, dom, mounting);
    }
    return false;
}
