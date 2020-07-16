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
                // alert(JSON.stringify(data));
                this._articles = {};

                const hoja1 = data["Hoja 1"];

                // if(hoja1) {

                // }
                // else {
                let sheet = data["Datos Identificativos"];
                sheet = sheet ? sheet : [];
                sheet.forEach((id) => {
                    this._articles[id["Control"]] = new Article(id);
                });

                sheet = data["Análisis Conceptual"];
                sheet = sheet ? sheet : [];
                let cont = 0;
                sheet.forEach((id) => {
                    const controlId = id["Control"];
                    if (controlId) {
                        this._articles[controlId].setTitle(id["Título"]);
                        this._articles[controlId].setSummary(id["Resumen "]);
                        this._articles[controlId].setDescriptors(id["Descriptores"]);
                    } else cont++;
                });

                if (cont > 0)
                    alert(
                        "Se han detectado Id Control no definidos en Análisis Conceptual"
                    );

                sheet = data["Análisis cienciométrico"];
                sheet = sheet ? sheet : [];
                cont = 0;
                sheet.forEach((id) => {
                    const controlId = id["Control"];
                    if (controlId) {
                        this._articles[controlId].setInstitutions(id["Institución"]);
                        this._articles[controlId].setAuthors(id["Autores"]);
                        this._articles[controlId].setCitedAuthors(id["Autores citados"]);
                        this._articles[controlId].setCitedJournals(id["Revistas citadas"]);
                    } else cont++;
                });

                if (cont > 0)
                    alert(
                        "Se han detectado Id Control no definidos en Análisis cienciométrico"
                    );
                // }

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