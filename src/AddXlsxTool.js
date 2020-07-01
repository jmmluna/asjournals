import xlsxParser from "xlsx-parse-json";
import { Article } from "./Article";
import { FrequencyTableGenerator } from "./FrequencyTableGenerator";
import HtmlToXlsxCreator from "./HtmlToXlsxCreator";

class AddXlsxTool {
    constructor() {
        document.getElementById("imputFile").onchange = (evt) => {
            document.getElementById("right").innerHTML = "";
            document.getElementById("left").innerHTML = "";
            const loader = document.getElementById("loader");
            loader.style.display = "block";

            const files = Array.from(evt.target.files);

            xlsxParser.onFileSelection(files[0]).then((data) => {
                loader.style.display = "none";

                this._articles = {};
                data["Datos Identificativos"].forEach((id) => {
                    this._articles[id["Control"]] = new Article(id);
                });

                data["Análisis Conceptual"].forEach((id) => {
                    this._articles[id["Control"]].setTitle(id["Título"]);
                    this._articles[id["Control"]].setSummary(id["Resumen "]);
                    this._articles[id["Control"]].setDescriptors(id["Descriptores"]);
                });

                data["Análisis cienciométrico"].forEach((id) => {
                    this._articles[id["Control"]].setInstitutions(id["Institución"]);
                    this._articles[id["Control"]].setAuthors(id["Autores"]);
                    this._articles[id["Control"]].setCitedAuthors(id["Autores citados"]);
                    this._articles[id["Control"]].setCitedJournals(
                        id["Revistas citadas"]
                    );
                });

                this.show();
            });
        };
    }

    show() {
        const content = document.getElementById("right");
        const index = document.getElementById("left");
        const frequencyTableGenerator = new FrequencyTableGenerator({
            articles: this._articles,
            div: content,
        });

        frequencyTableGenerator.show();
        this.addAllDownloadButton(index);
        this.createIndex(index);
    }

    createIndex(index) {
        const tables = document.getElementsByTagName("table");
        const ol = document.createElement("ol");

        for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            const tableName = tables[tableIndex].id;
            const description = tables[tableIndex].dataset.description;
            const li = document.createElement("li");

            const tableLink = document.createElement("a");
            tableLink.setAttribute("href", "#" + tableName);
            tableLink.innerHTML = "<b>" + description + "</b>";

            const tableDownloadButton = document.createElement("button");
            tableDownloadButton.setAttribute("id", "download-" + tableName);
            tableDownloadButton.className = "btn ";
            tableDownloadButton.innerHTML = '<i class="fa fa-download"></i>';
            tableDownloadButton.onclick = () => {
                HtmlToXlsxCreator(
                    [tableName], [tableName],
                    tableName + ".xlsx",
                    "Excel"
                );
            };

            li.appendChild(tableDownloadButton);
            li.appendChild(tableLink);
            ol.appendChild(li);
            index.appendChild(ol);
        }
    }

    addAllDownloadButton(index) {
        const allTableDownloadButton = document.createElement("button");
        allTableDownloadButton.setAttribute("id", "download-all");
        allTableDownloadButton.className = "btn ";
        allTableDownloadButton.innerHTML =
            '<i class="fa fa-download">Todas las tablas</i>';
        allTableDownloadButton.onclick = () => {
            this.allTableToExcelFile();
        };

        index.appendChild(allTableDownloadButton);
    }

    allTableToExcelFile() {
        const tables = document.getElementsByTagName("table");
        const sheets = [];
        const sheetNames = [];

        for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            sheets.push(tables[tableIndex].id);
            sheetNames.push(String(tables[tableIndex].id));
        }

        HtmlToXlsxCreator(sheets, sheetNames, "tablas-frecuencias.xlsx", "Excel");
    }
}

export default new AddXlsxTool();