import 'mdui/mdui.css';
import 'mdui';
import { $ } from 'mdui/jq.js';
import { bitable, IOpenSegmentType, IOpenTextSegment } from '@lark-base-open/js-sdk';

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
            notice("运行失败，请检查代码");
        }

    };

    const runButton: any = document.getElementById("button-run");
    runButton.addEventListener("click", async () => {

        notice("正在运行，请稍后");
        $("#progress").removeClass("no-display");

        const res: any = await getRes();

        const table = await bitable.base.getTableById(res.tableId);
        const currentValue: any = await table.getCellValue(res.fieldId, res.recordId);
        if (!currentValue) {
            notice("请在表格中打开/当前值为空");
            $("#progress").addClass("no-display");

            return;
        }
        else if (currentValue[0].type !== IOpenSegmentType.Text) {
            console.log(currentValue[0]);
            notice("当前单元格不是文本类型");
            $("#progress").addClass("no-display");

            return;
        }
        else if (!(currentValue[0].text.startsWith("=Py(") && currentValue[0].text.endsWith(")"))) {
            notice("当前单元格不是Py函数");
            $("#progress").addClass("no-display");

            return;
        };

        const code: any = $("#code").val();
        const func: any = currentValue[0].text.slice(4, -1);
        const result: any = runCode(code, func);

        const value: IOpenTextSegment | any = {
            type: IOpenSegmentType.Text,
            text: result,
        }

        notice("运行成功");
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