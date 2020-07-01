export class Article {
    constructor(param) {
        this._id = param["Control"];
        this._volumen = param["Volumen"];
        this._number = param["Número"];
        this._year = param["Año"];
    }

    getId() {
        return this._id;
    }

    getVolumen() {
        return this._volumen;
    }

    getNumber() {
        return this._number;
    }

    getYear() {
        return this._year;
    }

    setTitle(title) {
        this._title = title;
        this._titleDescriptors = this.getDescriptorsCalulate(this._title);
    }

    getTitle() {
        return this._title;
    }

    getTitleDescriptors() {
        return this._titleDescriptors;
    }

    setSummary(text) {
        this._summary = text;
        this._summaryDescriptors = this.getDescriptorsCalulate(this._summary);
    }

    getSummary() {
        return this._summary;
    }

    getSummaryDescriptors() {
        return this._summaryDescriptors;
    }

    setDescriptors(descriptors) {
        if (descriptors === undefined) this._descriptors = [];
        else this._descriptors = descriptors.split(";");
    }

    getDescriptors() {
        return this._descriptors;
    }

    setAuthors(authors) {
        if (authors === undefined) this._authors = [];
        else this._authors = authors.split(";");
    }

    getAuthors() {
        return this._authors;
    }

    setCitedAuthors(citedAuthors) {
        if (citedAuthors === undefined) this._citedAuthors = [];
        else this._citedAuthors = citedAuthors.split(";");
    }

    getCitedAuthors() {
        return this._citedAuthors;
    }

    setCitedJournals(journals) {
        if (journals === undefined) this._journals = [];
        else this._journals = journals.split(";");
    }

    getCitedJournals() {
        return this._journals;
    }

    setInstitutions(institutions) {
        if (institutions === undefined) this._institutions = [];
        else this._institutions = institutions.split(";");
    }

    getInstitutions() {
        return this._institutions;
    }

    getDescriptorsCalulate(field) {
        let descriptors = [];
        if (field !== undefined) {
            let words = field.split(" ");
            let removedToWords = [
                "del",
                "y",
                "de",
                "para",
                "en",
                "la",
                "el",
                "lo",
                "la",
                "una",
                "que",
                "las",
                "con",
                "es",
                ".",
                "",
                "a",
                "su",
                "sus",
                "Sus",
                "como",
                "cómo",
                "Los",
                "han",
                "uno",
                "otro",
                "estos",
                "los",
                "no",
                "No",
                "se",
                "ante",
                "o",
                "pero",
                "sí",
                "dar",
                "por",
                "entre",
                "al",
                "Al",
                "Este",
                "Cómo",
                "Contra",
                "De",
                "Del",
                "Dentro",
                "Desde",
                "e",
                "E",
                "El",
                "La",
                "Las",
                "Lo",
                "Más",
                "mas",
                "más",
                "Sin",
                "sin",
                "Son",
                "son",
            ];
            words.forEach((word) => {
                if (!removedToWords.includes(word)) descriptors.push(word.trim());
            });
        }
        return descriptors;
    }
}