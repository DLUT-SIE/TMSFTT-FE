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
}
