import { LoggerService } from './logger.service';
import { environment } from 'src/environments/environment';

describe('LoggerService Test', () => {
    const testLoggerService : LoggerService = new LoggerService()
    beforeEach(() => {
        testLoggerService.log("TESTing LOG")
        spyOn(console, 'log')
        testLoggerService.log("TESTing LOG")
        spyOn(console, 'error')
        testLoggerService.error("TESTing ERROR") 
    });

    it("should be called", () => {
        if (!environment.production) {
            expect(console.log).toHaveBeenCalled()
            expect(console.error).toHaveBeenCalled()
        }
    })

    it("should be called with correct arguments", () => {
        if (!environment.production) { 
            expect(console.log).toHaveBeenCalledWith("TESTing LOG", [])
            expect(console.error).toHaveBeenCalledWith("TESTing ERROR", []) 
        }
    })
})

