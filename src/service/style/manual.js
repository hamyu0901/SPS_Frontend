export class ManualSty {
    constructor() {

    }
    _theme = `dark`
    set manualMode(theme) {
        this._theme = theme;
    }
    get instanceManualSty() {
        return this;
    }
    gridTableWithPdf = {
        dark: {
            cardColor: `#21263a`,
            paginationColor: `#005bac !important`,
            hoverBackgroundColor: `#203556`,
            cardTitleBackgroundColor: `#171A29`,
        },
        light: {
            cardColor: `#ffffff`,
            paginationColor: `#ffffff !important`,
            hoverBackgroundColor: `#ffffff`,
            cardTitleBackgroundColor: `#ffffff`,
        }
    }
    get cardColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithPdf.dark.cardColor;
        }
        else {
            return this.gridTableWithPdf.light.cardColor;
        }
    }
    get paginationColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithPdf.dark.paginationColor;
        }
        else {
            return this.gridTableWithPdf.light.paginationColor;
        }
    }
    get gridTableWithPdfHoverBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithPdf.dark.hoverBackgroundColor;
        }
        else {
            return this.gridTableWithPdf.light.hoverBackgroundColor;
        }
    }
    get gridTableWithPdfCardTitleBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithPdf.dark.cardTitleBackgroundColor;
        }
        else {
            return this.gridTableWithPdf.light.cardTitleBackgroundColor;
        }
    }
}