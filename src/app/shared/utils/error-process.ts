import { HttpErrorResponse } from '@angular/common/http';

/** Process http error */
export function errorProcess(error: HttpErrorResponse) {
    let message = error.message;
    if (error.error) {
        message = '';
        for (const key of Object.keys(error.error)) {
            if (message !== '') {
                message += '\n';
            }
            if (key === 'detail' || key === 'non_field_errors') {
                message += '失败原因： ' + error.error[key];
                continue;
            }
            message += key + ': ' + error.error[key]; 
        }
    }
    return message;
}
