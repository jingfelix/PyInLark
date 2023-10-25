import { bitable } from '@lark-base-open/js-sdk';

export async function getRes() {
    const selection = await bitable.base.getSelection();
    const tableId: any = selection.tableId;
    const recordId: any = selection.recordId;
    const fieldId: any = selection.fieldId;

    if (!selection || !tableId || !recordId || !fieldId) {
        console.log('请在表格中打开');
        notice('请在表格中打开');
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