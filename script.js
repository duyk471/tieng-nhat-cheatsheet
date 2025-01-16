window.onload = function () {
    let mdFile = "index.md";
    let anchor = null;

    let parts = decodeURI(window.location.href).split("?");
    if (parts.length > 1) {

        let subParts = parts[1].split("#");

        mdFile = subParts[0] + ".md";

        if (mdFile.startsWith("..")) {
            mdFile = "index.md";
        }

        if (subParts.length > 1) {
            anchor = subParts[1];
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            processMarkdown(this.responseText);

            if (anchor != null) {
                syncToc(anchor);
            }
        } else if (this.readyState == 4 && this.status == 0) {
            processMarkdown("# Error\n\n Could not find " + mdFile);
        }
    };
    xhr.open("GET", mdFile + "?_=" + new Date().getTime());
    xhr.send();
}

function syncToc(anchor) {
    let element = document.getElementById("toc_" + anchor);
    if (element != undefined && element != null) {
        element.scrollIntoView();
    }
}

function renderRuby(text) {
    return text.replace(/{([一-龠]*)\|([ぁ-ゔ,]*)}/gi, replaceRuby);
}

// Replace alpha-numeric_ tags inside {} characters
let replacements = {
    "wave": "<span class='j-font'>～</span>",
    "dots": "<span class='j-font'>…</span>",
    "noun": "<sq>名</sq>",
    "dict-form": "辞書形",
    "plain-form": "普通形",
    "te-form": "て形",
    "ta-form": "た形",
    "nai-form": "ない形",
    "teiru-form": "ている形",
    "volitional-form": "う/よう形(volitional)",
    "potential-form": "える/られる形(potential)",
    "present": "現在",
    "verb": "<sq>動</sq>",
    "particle": "<sq>助</sq>",
    "i-adj": "<sq>イ形</sq>",
    "na-adj": "<sq>ナ形</sq>",
    "formal": "<span class='formal'>Formal</span>",
    "spoken": "<span class='spoken'>Spoken</span>",
    "written": "<span class='written'>Written</span>",
    "skm": "<em>Shin Kanzen Master</em>",
    "djg": "<em>A Dictionary of Japanese Grammar</em>",
    "u-verb": "<sq>ウ動</sq>",
    "ru-verb": "<sq>ル動</sq>",
    "irreg-verb": "<sq>Irreg.動</sq>"
};

function renderReplacements(text) {
    return text.replace(/{([a-zA-Z0-9-_]+)}/gi, function (str, tag) {
        if (tag in replacements) {
            return replacements[tag];
        } else {
            return str;
        }
    });
}

function renderStrikeThrough(text) {
    // Support strike through since it is currently missing from marked js
    return text.replace(/~~(.*?)~~/gi, function(str, content) {
        return "<s>" + content + "</s>";
    });
}

function renderBoldItalic(text) {
    // For some reason, it won't bold text inside tables, so let's support that too
    // Support strike through since it is currently missing from marked js
    return text.replace(/\*\*\*(.*?)\*\*\*/gi, function(str, content) {
        return "<strong><em>" + content + "</em></strong>";
    });
}

function renderBold(text) {
    // For some reason, it won't bold text inside tables, so let's support that too
    // Support strike through since it is currently missing from marked js
    return text.replace(/\*\*(.*?)\*\*/gi, function(str, content) {
        return "<strong>" + content + "</strong>";
    });
}

function renderItalic(text) {
    return text.replace(/\*(.*?)\*/gi, function(str, content) {
        return "<em>" + content + "</em>";
    });
}

function processMarkdown(markdownText) {
    var toc = "";
    var level = 0;

    // Create tables
    markdownText = markdownText.replace(/^\[\[\[([^\]]*?)\]\]\]$/igm, createTable);
    markdownText = markdownText.replace(/^:::([^\]]*?):::$/igm, createFullLinesTable);

    // Parse markdown

    const renderer = new marked.Renderer();

    let tocEntries = [];

    // Override heading function

    renderer.heading = function (text, level) {
        // Strip furigana
        let anchor = text.replace(/{([一-龠]*)\|([ぁ-ゔ,]*)}/gi, function(text, kanji, kana) {
            return kanji;
        });
      
        // Remove spaces from the anchor as well, since they render with % signs
        anchor = anchor.replace(/[ 　]/g, "");

        text = renderRuby(text);

        // Add TOC entry
        tocEntries.push({
            level: level,
            text: `<li><a id="toc_${anchor}" onClick="syncToc('${anchor}');" href="#${anchor}">${text}</a></li>\n`
        });

        return `<a id="toc_${anchor}" onClick="syncToc('${anchor}');" href="#${anchor}"><h${level} id="${anchor}">${text}</h${level}></a>\n`;
    };

    let options = {
        renderer: renderer,
        enableEscaping: false
     };

    const lexer = new marked.Lexer(options);
    const tokens = lexer.lex(markdownText);

    // Do text replacements based on token type

    doTextReplacements(tokens);

    let contentHtml = marked.parser(tokens, options);

    // Create TOC
    for (let entry of tocEntries) {
        // Add the right number of open or close tags to get to the new level
        if (entry.level > level) {
            toc += (new Array(entry.level - level + 1)).join("<ul>");
        } else if (entry.level < level) {
            toc += (new Array(level - entry.level + 1)).join("</ul>");
        }

        // Record level for next loop
        level = entry.level;

        // Add text
        toc += entry.text;
    }

    // Close any open tags
    if (level) {
        toc += (new Array(level + 1)).join("</ul>");
    }
    
    // Insert final HTML
    document.getElementById("contents").innerHTML = contentHtml;
    document.getElementById("toc").innerHTML += toc;

    let l = window.location.href.indexOf('#');
    if (l != -1) {
        window.location.assign(window.location.href);
    }
};

function doTextReplacements(tokens) {
    for (let i = 0; i < tokens.length; ++i) {
        let t = tokens[i];
        if ("type" in t) {
            switch (t.type) {
                case "list":
                    for(let item of t.items) {
                        doTextReplacements(item.tokens);
                    }
                    break;
                case "paragraph":
                case "text":
                    t.text = renderRuby(t.text);
                    t.text = renderReplacements(t.text);
                    t.text = renderStrikeThrough(t.text);
                    break;
                case "html":
                    t.text = renderRuby(t.text);
                    t.text = renderReplacements(t.text);
                    t.text = renderStrikeThrough(t.text);
                    t.text = renderBoldItalic(t.text);
                    t.text = renderBold(t.text);
                    t.text = renderItalic(t.text);
                    break;
            }
        }
        if ("tokens" in t) {
            doTextReplacements(t.tokens);
        }
    }
}

function makeRuby(kanji, kana) {
    if (kana.length / 2 > kanji.length) {
        return "<rb>" + kanji + "</rb><rt class='compressed'>" + kana + "</rt>";
    } else {
        return "<rb>" + kanji + "</rb><rt>" + kana + "</rt>";
    }
}

function replaceRuby (str, kanji, kana) {
    var kanaGroups = kana.split(',');
    var result = "<ruby>";

    if (kanaGroups.length == kanji.length) {
        for (var i = 0; i < kanaGroups.length; ++i) {
            result += makeRuby(kanji[i], kanaGroups[i]);
        }
    } else {
        result += makeRuby(kanji, kana);
    }
    return result + "</ruby>";
};

function createFullLinesTable(str, content) {
    return createTable(str, content, "fullLines");
}

function createTable(str, content, tableClass = null) {
    // Split by lines
    var lines = content.split('\n');
    var output = "<table"
    if (tableClass != null) {
        output += " class=\"" + tableClass + "\"";
    }
    output += ">";

    function writeRowMatrix(rowMatrix, headerLine) {
        if (rowMatrix.length == 0) {
            return;
        }

        var maxColumns = 0;
        for (var row of rowMatrix) {
            if (row.length > maxColumns) {
                maxColumns = row.length;
            }
        }

        var result = "<tr>";

        var openTag = "<td>";
        var closeTag = "</td>";

        if(headerLine) {
            openTag = "<th>";
            closeTag = "</th>";
        }

        for (var col = 0; col < maxColumns; ++col) {
            result += openTag;

            for (var row = 0; row < rowMatrix.length; ++row) {
                if (col < rowMatrix[row].length && rowMatrix[row][col].length > 0) {
                    result += "<div>" + rowMatrix[row][col] + "</div>";
                }
            }

            result += closeTag;
        }

        result += "</tr>\n";

        return result;
    }

    let firstLine = true;
    var rowMatrix = [];
    for (var line of lines) {
        if (line.trim() == "-") {
            // New row
            output += writeRowMatrix(rowMatrix, firstLine && tableClass != null);
            firstLine = false;
            rowMatrix = [];
        } else {
            // Parse the cell content, being carful not to mark pipe characters used inside braces as cell boundaries
            cells = [];
            var insideBrackets = 0;
            var currentCell = "";
            for (var c of line) {
                switch (c) {
                    case '{':
                        insideBrackets++;
                        currentCell += c;
                        break;
                    case '}':
                        insideBrackets--;
                        currentCell += c;
                        break;
                    case '|':
                        if (insideBrackets == 0) {
                            cells.push(currentCell);
                            currentCell = "";
                        } else {
                            currentCell += c;
                        }
                        break;
                    default:
                        currentCell += c;
                        break;
                }
            }
            cells.push(currentCell);

            // Trim all the cells
            for (var i = 0; i < cells.length; ++i) {
                cells[i] = cells[i].trim();
            }

            rowMatrix.push(cells);
        }
    }

    output += writeRowMatrix(rowMatrix);

    return output + "</table>";
}