import 'mdui/mdui.css';
import 'mdui';
import $ from 'jquery';
import i18next from 'i18next';
import 'mdui/components/icon.js';
import { bitable, IOpenSegmentType, IOpenTextSegment } from '@lark-base-open/js-sdk';

import './locales/i18n';

import { loadPyodide } from "pyodide"

import { getRes, notice } from './util';

import './index.css';

import { setColorScheme } from 'mdui/functions/setColorScheme.js';

setColorScheme('#E8EEFD');

$(async function () {

    async function initPyOdide() {
        let PyOdide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        return PyOdide;
    };

    const pyodide = await initPyOdide();

    function runCode(code: string, func: string) {

        try {
            pyodide.runPython(`${code}`);

            const result = pyodide.runPython(`str(${func})`);
            console.log(result);

            return result;
        } catch (error) {
            console.log(error);
            notice(i18next.t("run_error"));

            return null;
        }

    };

    const runButton: any = document.getElementById("button-run");
    runButton.addEventListener("click", async () => {

        // notice("正在运行，请稍后");
        $("#progress").removeClass("no-display");

        const res: any = await getRes();

        const table = await bitable.base.getTableById(res.tableId);
        const currentValue: any = await table.getCellValue(res.fieldId, res.recordId);
        if (!currentValue) {
            notice(i18next.t("open_in_base"));
            $("#progress").addClass("no-display");

            return;
        }
        else if (currentValue[0].type !== IOpenSegmentType.Text) {
            console.log(currentValue[0]);
            notice(i18next.t("not_text"));
            $("#progress").addClass("no-display");

            return;
        }
        else if (!(currentValue[0].text.startsWith("=Py(") && currentValue[0].text.endsWith(")"))) {
            notice(i18next.t("not_py"));
            $("#progress").addClass("no-display");

            return;
        };

        const code: any = $("#code").val();
        const func: any = currentValue[0].text.slice(4, -1);
        const result: any = runCode(code, func);

        if (!result) {
            $("#progress").addClass("no-display");
            return;
        };

        const value: IOpenTextSegment | any = {
            type: IOpenSegmentType.Text,
            text: result,
        }

        notice(i18next.t("run_ok"));
        $("#progress").addClass("no-display");

        await table.setCellValue(res.fieldId, res.recordId, value);
    });

    const clearButton: any = document.getElementById("button-clear");
    clearButton.addEventListener("click", () => {
        const clearable = $(".clearable");
        clearable.val("");
        clearable.text("");

        const pyError = $(".py-error");
        pyError.remove();

        $("#progress").addClass("no-display");
    });

});