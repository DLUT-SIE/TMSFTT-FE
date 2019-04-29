import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    log(msg: any, ...optionMsg: any[]) {
        if (!environment.production) {
            console.log(msg, optionMsg)
        }
    }

    error(msg: any, ...optionMsg: any[]) {
        if (!environment.production) {
            console.error(msg, optionMsg)
        }
    }

}