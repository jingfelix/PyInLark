import 'mdui/mdui.css';
import 'mdui';
import $ from 'jquery';
import i18next from 'i18next';
import 'mdui/components/icon.js';
import { bitable, IOpenSegmentType, IOpenTextSegment } from '@lark-base-open/js-sdk';

import './locales/i18n';

import { loadPyodide } from "pyodide"

import { getCurrentRes, notice, _getCellValues } from './util';

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

    console.log(new Date().toLocaleString());
    const pyodide = await initPyOdide();

    async function runCode(code: string, func: string, recordId: string) {

        try {

            // 尝试解析 func 中的变量
            // 将 ${} 中的fieldname放进一个数组中
            console.log(new Date().toLocaleString());
            const reg = /\${(.*?)}/g;
            const fields: Array<string> = [];
            let match: any;
            while ((match = reg.exec(func)) !== null) {
                fields.push(match[1]);
            };

            const cellValues: any = await _getCellValues(fields, recordId);

            console.log(cellValues);

            // 将 cellValues 中的值替换到 func 中
            for (let [key, value] of cellValues) {
                func = func.replace("${" + key + "}", "'" + value + "'");
            };
            console.log(func);

            pyodide.runPython(`${code}`);

            const result = pyodide.runPython(`str(${func})`);

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

        const res: any = await getCurrentRes();

        console.log(new Date().toLocaleString());

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


        console.log(new Date().toLocaleString());
        const result: any = await runCode(code, func, res.recordId);

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

        console.log(new Date().toLocaleString());
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

        $("#code").val("");
    });

});