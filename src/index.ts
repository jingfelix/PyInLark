import 'mdui/mdui.css';
import 'mdui';
import { $ } from 'mdui/jq.js';
import { bitable, IOpenSegmentType, IOpenTextSegment } from '@lark-base-open/js-sdk';

// import './index.css';

$(async function () {

  async function getRes() {
    const selection = await bitable.base.getSelection();
    const tableId: any = selection.tableId;
    const recordId: any = selection.recordId;
    const fieldId: any = selection.fieldId;

    if (!selection || !tableId || !recordId || !fieldId) {
      console.log('请在表格中打开');
      alert('请在表格中打开');
      return;
    }

    return {
      tableId,
      recordId,
      fieldId,
    }
  }

  async function runOnClick() {

    const res: any = await getRes();

    const table = await bitable.base.getTableById(res.tableId);
    const currentValue: any = await table.getCellValue(res.fieldId, res.recordId);

    // TODO: 这里需要处理不同类型的单元格格式
    console.log('currentValue', currentValue);

    $("#input").val(currentValue[0].text);
    $("#input").trigger("click");

    $("#progress").removeClass("no-display");
  }

  const buttonRun: any = document.querySelector('#button-run')
  buttonRun.addEventListener('click', runOnClick);

  function clearOnClick() {
    const clearable = $(".clearable");
    clearable.val("");
    clearable.text("");

    const pyError = $(".py-error");
    pyError.remove();

    $("#progress").addClass("no-display");

  };

  $("#button-clear").on("click", clearOnClick);

  async function outputOnClick() {

    const res: any = await getRes();

    const table = await bitable.base.getTableById(res.tableId);

    const output: any = $("#output").val();
    console.log('output', output);

    $("#input").val("");

    const value: IOpenTextSegment | any = {
      type: IOpenSegmentType.Text,
      text: output,
    }

    // $("#progress").addClass("no-display");

    await table.setCellValue(res.fieldId, res.recordId, value);
    clearOnClick();
  };

  const output: any = document.querySelector('#output')
  output.addEventListener('click', outputOnClick);

});
