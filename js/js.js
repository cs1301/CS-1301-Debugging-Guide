window.onload = function() {
    var code_input_instances = [];
    var code_output_instances = [];

    var coding_areas = document.getElementsByClassName("coding_area");
    for (var i = 0; i < coding_areas.length; i++) {
        code_input_instances[i] = CodeMirror.fromTextArea(coding_areas[i], {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            scrollbarStyle: null
        });
        code_input_instances[i].setOption("theme", "lesser-dark");
        update_program(i, code_input_instances, "problem");
    }

    var output_areas = document.getElementsByClassName("output_area");
    for (i = 0; i < output_areas.length; i++) {
        code_output_instances[i] = CodeMirror.fromTextArea(output_areas[i], {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            scrollbarStyle: null,
            readOnly: true
        });
        code_output_instances[i].setOption("theme", "output");
        code_output_instances[i].setSize(-1, 100);
    }

    var run_buttons = document.getElementsByClassName("run_program");
    for (i = 0; i < run_buttons.length; i++) {
        run_buttons[i].addEventListener("click", function(e) {
            var index = parseInt(e.target.getAttribute("program"));
            execute_program(code_input_instances[index], code_output_instances[index]);
        });
    }

    var reset_buttons = document.getElementsByClassName("reset_program");
    for (i = 0; i < reset_buttons.length; i++) {
        reset_buttons[i].addEventListener("click", function(e) {
            var index = parseInt(e.target.getAttribute("program"));
            update_program(index, code_input_instances, "problem");
        });
    }

    var solution_buttons = document.getElementsByClassName("reveal_solution");
    for (i = 0; i < solution_buttons.length; i++) {
        solution_buttons[i].addEventListener("click", function(e) {
            var index = parseInt(e.target.getAttribute("program"));
            update_program(index, code_input_instances, "solution");
        });
    }

    var hint_buttons = document.getElementsByClassName("hint");
    for (i = 0; i < hint_buttons.length; i++) {
        hint_buttons[i].addEventListener("click", function(e) {
            var index = parseInt(e.target.getAttribute("program"));
            update_program(index, code_input_instances, "hint");
        });
    }

    setTimeout(function() {
        var sections = document.getElementsByClassName("section");
        for (i = 0; i < sections.length; i++) {
            sections[i].setAttribute("height", "" + sections[i].clientHeight);
            sections[i].setAttribute("style", "height: 90px;");
            sections[i].setAttribute("collapsed", "true");
        }

        setTimeout(function() {
            for (i = 0; i < sections.length; i++) {
                sections[i].className += " transition";
            }
        }, 100);
    }, 100);

    var section_headers = document.getElementsByClassName("section_header");
    for (i = 0; i < section_headers.length; i++) {
        section_headers[i].addEventListener("click", function(e) {
            var parent = e.target.parentNode;
            var collapsed = parent.getAttribute("collapsed") == "true";
            var height = collapsed ? parent.getAttribute("height") : 90;

            parent.setAttribute("style", "height: " + height + "px;");
            collapsed = collapsed ? "false" : "true";
            parent.setAttribute("collapsed", "" + collapsed);
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

function update_program(index, code_input_instances, type) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            code_input_instances[index].setValue(req.responseText);
        }
    };
    req.open("GET", "python_files/" + index + "_" + type + ".py", true);
    req.send();
}