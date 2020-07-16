const prefix = "tabla-frecuencias";
const ORDER_FUNCTION = function(a, b) {
    return a.localeCompare(b);
};

const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
const clearcharacter = (s) => {
    const characters = ["«", "»", "?", "(", ")", "#", "¿"];
    for (const character of characters) {
        s = s.replace(character, "");
    }
    return s;
};
export class FrequencyTableGenerator {
    constructor(param) {
        this._articles = param.articles;
        this._div = param.div;
        this._descriptorsTotal = {};
        this._descriptorsTotalYear = {};
    }

    show() {
        this.showFrom(
            "getTitleDescriptors",
            "Título",
            "Tabla de frecuencias para descriptores del Título",
            true
        );
        this.showFrom(
            "getSummaryDescriptors",
            "Resumen",
            "Tabla de frecuencias para descriptores del Resumen",
            true
        );
        this.showFrom(
            "getDescriptors",
            "Descriptores",
            "Tabla de frecuencias para descriptores de Descriptores",
            true
        );
        this.showFrom("getAuthors", "Autores", "Tabla de frecuencias para Autores");
        this.showFrom(
            "getInstitutions",
            "Instituciones",
            "Tabla de frecuencias para Instituciones"
        );
        this.showFrom(
            "getCitedAuthors",
            "Autores-Citados",
            "Tabla de frecuencias para Autores Citados"
        );
        this.showFrom(
            "getCitedJournals",
            "Revistas-Citadas",
            "Tabla de frecuencias para Revista Citadas"
        );
    }

    showFrom(fn, name, description, isDescriptor = false) {
        this._descriptorsTotal = {};
        this._descriptorsTotalYear = {};

        for (var id in this._articles) {
            var year = this._articles[id].getYear();

            var descriptors = this._articles[id][fn]();
            this.addElements(descriptors, year, isDescriptor);
        }

        this.showTotal(name, description);
        this.showByYear(name, description);
    }

    showTotal(name, description) {
        var descriptorsTotal = Object.keys(this._descriptorsTotal);

        this._div.innerHTML += `<div id="${name}"></div><br><b>${name}: totales ${descriptorsTotal.length}</b><br><br>`;

        var table = `
        <table id="${prefix}-${name}" data-description= "${description}" border="1">
          <tr>
              <th>${name}</th>
              <th>Frecuencia</th>
          </tr>`;

        descriptorsTotal.sort(ORDER_FUNCTION).forEach((descriptor) => {
            table += `<tr><td>${descriptor}</td><td>${this._descriptorsTotal[descriptor].count}</td></tr>`;
        });

        this._div.innerHTML += table + `</table>`;
    }

    showByYear(name, description) {
        var descriptorsTotalYear = Object.keys(this._descriptorsTotalYear);

        descriptorsTotalYear.sort(ORDER_FUNCTION).forEach((year) => {
            this._div.innerHTML += `<br><b>${name} para el año ${year}</b><br><br>`;

            var descriptorsEveryYear = Object.keys(this._descriptorsTotalYear[year]);

            var table = `
                <table id="${prefix}-${name}-${year}" data-description= "${description}-${year}" border="1">
                <tr>
                    <th>${name}-${year}</th>
                    <th>Frecuencia</th>
                </tr>`;
            descriptorsEveryYear.sort().forEach((descriptor) => {
                var count = this._descriptorsTotalYear[year][descriptor].count;
                table += `<tr><td>${descriptor}</td><td>${count}</td></tr>`;
            });

            this._div.innerHTML += table + `</table>`;
        });
    }

    addElements(descriptors, year, isDescriptor) {
        descriptors = descriptors ? descriptors : [];
        descriptors.forEach((descriptor) => {
            descriptor = descriptor.trim();
            if (descriptor.length === 0) return;
            descriptor = clearcharacter(descriptor);
            descriptor = capitalize(descriptor);

            if (isDescriptor) {
                descriptor = descriptor.replace(".", "");
                descriptor = descriptor.replace(":", "");
                descriptor = descriptor.replace(",", "");
                descriptor = descriptor.replace(";", "");
            }

            if (descriptor in this._descriptorsTotal) {
                this._descriptorsTotal[descriptor].count =
                    this._descriptorsTotal[descriptor].count + 1;
            } else {
                this._descriptorsTotal[descriptor] = {
                    count: 1,
                };
            }

            this.addElement(descriptor, year);
        });
    }

    addElement(descriptor, year) {
        if (year in this._descriptorsTotalYear) {
            if (descriptor in this._descriptorsTotalYear[year])
                this._descriptorsTotalYear[year][descriptor].count =
                this._descriptorsTotalYear[year][descriptor].count + 1;
            else this._descriptorsTotalYear[year][descriptor] = { count: 1 };
        } else {
            this._descriptorsTotalYear[year] = {};
            this._descriptorsTotalYear[year][descriptor] = { count: 1 };
        }
    }
}