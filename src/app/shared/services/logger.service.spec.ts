import { LoggerService } from './logger.service';

describe('LoggerService Test', () => {
    let testLoggerService: LoggerService;
    beforeEach(() => {
        spyOn(console, 'log');
        spyOn(console, 'error');
    });

    it('should be called', () => {
        const devEnvironmentService = jasmine.createSpyObj('EnvironmentService', ['getProduction']);
        const stubValue = false;
        devEnvironmentService.getProduction.and.returnValue(stubValue);
        testLoggerService = new LoggerService(devEnvironmentService);
        testLoggerService.log('TESTing LOG');
        testLoggerService.error('TESTing ERROR');
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('TESTing LOG', []);
        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('TESTing ERROR', []);
    });

    it('should not be called', () => {
        const prodEnvironmentService = jasmine.createSpyObj('EnvironmentService', ['getProduction']);
        const stubValue = true;
        prodEnvironmentService.getProduction.and.returnValue(stubValue);
        testLoggerService = new LoggerService(prodEnvironmentService);
        testLoggerService.log('TESTing LOG');
        testLoggerService.error('TESTing ERROR');
        expect(console.log).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
    });
});
