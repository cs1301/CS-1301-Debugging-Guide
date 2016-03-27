var resize_timer;
var code_input_instances;

window.onload = function() {
    code_input_instances = [];
    var code_output_instances = [];
    var code_example_instances = [];

    var coding_areas = document.getElementsByClassName("coding_area");
    for (var i = 0; i < coding_areas.length; i++) {
        code_input_instances[i] = CodeMirror.fromTextArea(coding_areas[i], {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            scrollbarStyle: null,
            lineWrapping: true
        });
        code_input_instances[i].setOption("theme", "lesser-dark");

        code_input_instances[i].on("change", function() {
            if (resize_timer != undefined) {
                clearTimeout(resize_timer);
            }

            resize_timer = setTimeout(resize_handler, 200);
        });
        update_program(i, code_input_instances, "problem");
    }

    var output_areas = document.getElementsByClassName("output_area");
    for (i = 0; i < output_areas.length; i++) {
        code_output_instances[i] = CodeMirror.fromTextArea(output_areas[i], {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            scrollbarStyle: null,
            readOnly: true,
            lineWrapping: true
        });
        code_output_instances[i].setOption("theme", "output");
        code_output_instances[i].setSize(-1, 100);
    }

    var example_areas = document.getElementsByClassName("example_area");
    for (i = 0; i < example_areas.length; i++) {
        code_example_instances[i] = CodeMirror.fromTextArea(example_areas[i], {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            scrollbarStyle: null,
            readOnly: true,
            lineWrapping: true
        });
        code_example_instances[i].setOption("theme", "lesser-dark");

        var filename = example_areas[i].getAttribute("filename") + "_example.py";
        update_program(i, code_example_instances, "example", filename);
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
            update_program(index, code_input_instances, "solution", undefined, function() {
                highlight_lines(code_input_instances[index], e.target.getAttribute("highlight"));
            });
        });
    }

    var hint_buttons = document.getElementsByClassName("hint");
    for (i = 0; i < hint_buttons.length; i++) {
        hint_buttons[i].addEventListener("click", function(e) {
            var index = parseInt(e.target.getAttribute("program"));
            update_program(index, code_input_instances, "hint", undefined, function() {
                highlight_lines(code_input_instances[index], e.target.getAttribute("highlight"));
            });
        });
    }

    var sections = document.getElementsByClassName("section");
    for (i = 0; i < sections.length; i++) {
        sections[i].className += " hidden";
    }

    setTimeout(function() {
        for (i = 0; i < sections.length; i++) {
            sections[i].setAttribute("height", "" + sections[i].clientHeight);
            sections[i].setAttribute("style", "height: 90px;");
            sections[i].setAttribute("collapsed", "true");
        }

        setTimeout(function() {
            for (i = 0; i < sections.length; i++) {
                sections[i].className = "section transition";
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

    document.getElementById("exceptions_reference_filter").addEventListener("keyup", function(e) {
        var rows = document.getElementById("exceptions_reference").childNodes[1].childNodes;
        var search_string = e.target.value.toLowerCase();

        for (var i = 1; i < rows.length; i++) {
            if (rows[i].tagName != "TR") continue;

            if (rows[i].childNodes[1].innerHTML.toLowerCase().search(search_string) != -1) {
                rows[i].setAttribute("style", "");
            } else {
                rows[i].setAttribute("style", "display: none");
            }
        }

        resize_handler();
    });
};

function resize_handler() {
    var sections = document.getElementsByClassName("section");
    for (var i = 0; i < sections.length; i++) {
        var pseudo_div = document.createElement("div");
        document.body.appendChild(pseudo_div);
        pseudo_div.innerHTML = sections[i].innerHTML;
        pseudo_div.className = "section";
        pseudo_div.setAttribute("style", "opacity: 0; max-width: 1000px;");

        sections[i].setAttribute("height", "" + pseudo_div.clientHeight);
        var collapsed = sections[i].getAttribute("collapsed") == "true";
        if (!collapsed) {
            sections[i].setAttribute("style", "height: " + pseudo_div.clientHeight + "px;");
        }

        document.body.removeChild(pseudo_div);
    }
}

var resize_handler_timer = null;
window.addEventListener("resize", function() {
    if (resize_handler_timer != null) {
        clearTimeout(resize_handler_timer);
    }

    resize_handler_timer = setTimeout(resize_handler, 500);
});

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

function update_program(index, code_input_instances, type, filename, callback) {
    if (filename == undefined) {
        filename = index + "_" + type + ".py";
    }

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            code_input_instances[index].setValue(req.responseText);

            if (callback != undefined) {
                callback();
            }
        }
    };
    req.open("GET", "python_files/" + filename, true);
    req.send();
}

function highlight_lines(editor, lines_string) {
    if (lines_string == null || lines_string == "") return;

    var line_numbers = lines_string.split(",");
    var lines = editor.doc.children[0].lines;

    for (var i = 0; i < line_numbers.length; i++) {
        editor.addLineClass(lines[parseInt(line_numbers[i]) - 1], 'wrap', 'CodeMirror-activeline-background');
    }
}