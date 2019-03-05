import { Pipe, PipeTransform } from '@angular/core';
import { RecordStatus } from 'src/app/enums/record-status.enum';

@Pipe({ name: 'recordStatusDisplay' })
export class RecordStatusDisplayPipe implements PipeTransform {
    transform(value: RecordStatus) {
        switch (value) {
            case RecordStatus.STATUS_PRESUBMIT: {
                return '未提交';
            }
            case RecordStatus.STATUS_SUBMITTED: {
                return '已提交';
            }
            case RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED: {
                return '院系管理员已审核';
            }
            case RecordStatus.STATUS_SCHOOL_ADMIN_REVIEWED: {
                return '学校管理员已审核';
            }
            default: {
                return '未知状态';
            }
        }
    }
}
