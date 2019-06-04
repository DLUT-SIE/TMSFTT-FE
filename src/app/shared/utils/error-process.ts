import { HttpErrorResponse } from '@angular/common/http';

/** Process http error */
export function errorProcess(error: HttpErrorResponse) {
    let message = error.message;
    if (error.error) {
        message = error.error.detail ? error.error.detail : '请求失败';
        message += '。';
    }
    return message;
}
