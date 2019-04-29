import { LoggerService } from './logger.service';
import { environment } from 'src/environments/environment';

describe('LoggerService Test', () => {
    const testLoggerService: LoggerService = new LoggerService();
    beforeEach(() => {
        spyOn(console, 'log');
        spyOn(console, 'error');
    });

    it('should be called', () => {
        testLoggerService.log('TESTing LOG');
        if (!environment.production) {
            expect(console.log).toHaveBeenCalled();
        }
    });

    it('should be called with correct arguments', () => {
        testLoggerService.log('TESTing LOG');
        if (!environment.production) {
            expect(console.log).toHaveBeenCalledWith('TESTing LOG', []);
        }
    });

    it('should be called', () => {
        testLoggerService.error('TESTing ERROR');
        if (!environment.production) {
            expect(console.error).toHaveBeenCalled();
        }
    });

    it('should be called with correct arguments', () => {
        testLoggerService.error('TESTing ERROR');
        if (!environment.production) {
            expect(console.error).toHaveBeenCalledWith('TESTing ERROR', []);
        }
    });
});
