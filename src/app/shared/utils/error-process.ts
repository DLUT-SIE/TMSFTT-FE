import { HttpErrorResponse } from '@angular/common/http';
import { isString } from 'util';

function extractMessageFromJSON(obj: any) {
    if (isString(obj)) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj[0];
    }
    let message = '';
    for (const key of Object.keys(obj)) {
        if (message !== '') {
            message += '\n';
        }
        if (key === 'detail' || key === 'non_field_errors') {
            message += '失败原因： ' + extractMessageFromJSON(obj[key]);
            continue;
        }
        message += key + ': ' + extractMessageFromJSON(obj[key]);
    }
    return message;
}
/** Process http error */
export function errorProcess(error: HttpErrorResponse) {
    let message = error.message;
    if (error.status < 500 && error.error) {
        message = extractMessageFromJSON(error.error);
    } else if (error.status >= 500) {
        message = '请求失败： 服务器错误';
    }
    return message;
}
