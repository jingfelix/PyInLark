import { bitable } from '@lark-base-open/js-sdk';
import i18next from 'i18next';

export async function getCurrentRes() {
    const selection = await bitable.base.getSelection();
    const tableId: any = selection.tableId;
    const recordId: any = selection.recordId;
    const fieldId: any = selection.fieldId;

    if (!selection || !tableId || !recordId || !fieldId) {
        console.log(i18next.t("open_in_base"));
        notice(i18next.t("open_in_base"));
        return;
    }

    return {
        tableId,
        recordId,
        fieldId,
    }
};

export async function notice(msg: string | unknown) {

    const snackbar: any = document.querySelector('#notice')
    snackbar.innerText = msg;

    snackbar.open = true;
};

export async function _getCellValues(cells: Array<string>, recordId: string): Promise<Map<any, any>> {

    const table = await bitable.base.getActiveTable();
    // const record: any = table.getRecordById(recordId);

    let cellValues = new Map<any, any>();

    //当前时间
    console.log(new Date().toLocaleString());
    for (let fieldName of cells) {
        const field = await table.getFieldByName(fieldName);
        const cellValue: Array<any> = await field.getValue(recordId);
        if (cellValue === null) {
            cellValues.set(fieldName, "");
            continue;
        }

        console.log(cellValue[0]);

        let value: any = null;
        if (cellValue[0]["text"] !== undefined) {
            value = cellValue[0]["text"];
        } else if (cellValue[0]["name"] !== undefined) {
            value = cellValue[0]["name"];
        } else {
            value = "";
        }

        cellValues.set(fieldName, value);
    }
    // 控制时间
    console.log(new Date().toLocaleString());

    return cellValues;
}