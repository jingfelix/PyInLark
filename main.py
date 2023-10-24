from pyscript import document


def exec_code(event):

    origin_code = document.querySelector("#code").value

    func_code = (document.querySelector("#input").value).strip()

    exec(origin_code)

    if func_code.startswith("=Py(") and func_code.endswith(")"):
        func_code = func_code[4:-1]
        result= eval(func_code)
        # document.querySelector("#message").innerText = result
    else:
        document.querySelector("#message").innerText = f"Invalid function code: {func_code}"
        return

    # 触发事件
    output = document.querySelector("#output")
    output.value = result
    output.click()
