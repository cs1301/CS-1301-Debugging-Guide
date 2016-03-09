var code_input_instances = [];
var code_output_instances = [];

window.onload = function() {
    var coding_areas = document.getElementsByClassName("coding_area");
    for (var i = 0; i < coding_areas.length; i++) {
        code_input_instances[i] = CodeMirror.fromTextArea(coding_areas[i], {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            indentWithTabs: true,
            scrollbarStyle: null
        });
        code_input_instances[i].setOption("theme", "lesser-dark");
    }

    var output_areas = document.getElementsByClassName("output_area");
    for (i = 0; i < output_areas.length; i++) {
        code_output_instances[i] = CodeMirror.fromTextArea(output_areas[i], {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            indentWithTabs: true,
            scrollbarStyle: null,
            readOnly: true
        });
        code_output_instances[i].setOption("theme", "lesser-dark");
        code_output_instances[i].setSize(-1, 100);
    }

    code_input_instances[0].setValue("def test_program():\n\tprint(\"yay!\")");

    var run_buttons = document.getElementsByClassName("run_program");
    for (i = 0; i < run_buttons.length; i++) {
        run_buttons[i].addEventListener("click", function(e) {
            var index = parseInt(e.target.getAttribute("program"));
            execute_program(code_input_instances[index], code_output_instances[index]);
        });
    }
};

function execute_program(input, output) {
    output.setValue("");
    Sk.pre = "output";
    Sk.configure({output:function(text) {
        output.setValue(output.getValue() + text);
    }, read:function() {
        return input.getValue();
    }});
    var myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, input.getValue(), true);
    });
    myPromise.then(function(mod) {},
        function(err) {
            output.setValue(output.getValue() + err.toString());
        });
}