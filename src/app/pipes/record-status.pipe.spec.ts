import { RecordStatusDisplayPipe } from './record-status.pipe';
import { RecordStatus } from 'src/app/enums/record-status.enum';

describe('RecordStatusDisplayPipe', () => {

    it('create an instance', () => {
        const pipe = new RecordStatusDisplayPipe();
        expect(pipe).toBeTruthy();
    });

    it('should return expected status', () => {
        const pipe = new RecordStatusDisplayPipe();
        const status = [
            RecordStatus.STATUS_PRESUBMIT,
            RecordStatus.STATUS_SUBMITTED,
            RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED,
            RecordStatus.STATUS_SCHOOL_ADMIN_REVIEWED,
            4,
        ];
        const results = [
            '未提交',
            '已提交',
            '院系管理员已审核',
            '学校管理员已审核',
            '未知状态',
        ];
        for (let i = 0; i < status.length; i ++) {
            expect(pipe.transform(status[i])).toBe(results[i]);
        }
    });
});
