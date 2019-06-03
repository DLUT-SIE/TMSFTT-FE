import { HttpErrorResponse } from '@angular/common/http';

/** Process http error */
export function errorProcess(error: HttpErrorResponse) {
    let message = error.message;
    if (error.error) {
        if (error.error.detail) {
            message = error.error['detail'] + '。';
        } else {
            message = '请求失败。';
        }
    }
    return message;
}
