import { bitable } from '@lark-base-open/js-sdk';
import i18next from 'i18next';

export async function getRes() {
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