import { Pipe, PipeTransform } from '@angular/core';
import { RecordStatus } from 'src/app/enums/record-status.enum';

@Pipe({ name: 'recordStatusDisplay' })
export class RecordStatusDisplayPipe implements PipeTransform {
    map = new Map<RecordStatus, string> (
        [
            [RecordStatus.STATUS_PRESUBMIT, '未提交'],
            [RecordStatus.STATUS_SUBMITTED, '已提交'],
            [RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED, '院系管理员已审核'],
            [RecordStatus.STATUS_SCHOOL_ADMIN_REVIEWED, '学校管理员已审核'],
        ],
    );
    transform(value: RecordStatus) {
        return this.map.get(value) || '未知状态';
    }
}
