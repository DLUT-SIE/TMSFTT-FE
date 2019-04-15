import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

/** Provide i18n for paginatoer. */
@Injectable({
  providedIn: 'root'
})
export class MatPaginatorIntlService extends MatPaginatorIntl {
  itemsPerPageLabel = '每页数量:';
  nextPageLabel = '下一页';
  previousPageLabel = '上一页';
  firstPageLabel = '首页';
  lastPageLabel = '尾页';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const startRecord = page * pageSize + 1;
    const endRecord = Math.min(length, (page + 1) * pageSize);
    return `${length} 条结果中的第 ${Math.min(startRecord, endRecord)} - ${endRecord} 条结果`;
  };
}
