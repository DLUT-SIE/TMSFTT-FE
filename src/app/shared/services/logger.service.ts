import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    constructor(private readonly environmentService: EnvironmentService) {
    }

    log(msg: {}, ...optionMsg: Array<{}>) {
        if (!this.environmentService.getProduction()) {
            console.log(msg, optionMsg);
        }
    }

    error(msg: {}, ...optionMsg: Array<{}>) {
        if (!this.environmentService.getProduction()) {
            console.error(msg, optionMsg);
        }
    }

}
