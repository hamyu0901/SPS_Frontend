
export class MaintenanceSty {
    constructor() {

    }
    _theme = `dark`
    set maintenanceMode(theme) {
        this._theme = theme;
    }
    get instanceMaintenanceSty() {
        return this;
    }

    maintenanceItem = {
        dark: {
            cardBackgroundColor: `#1f243b`,
            cardTitleColor: `#2f3758`
        },
        light: {
            cardBackgroundColor: `#ccd2e2`,
            cardTitleColor: `#ccd2e2`
        }
    }
    get maintenanceItemCardBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.maintenanceItem.dark.cardBackgroundColor;
        }
        else {
            return this.maintenanceItem.light.cardBackgroundColor;
        }
    }
    get maintenanceItemCardTitleColor() {
        if (this.themeStatus === `dark`) {
            return this.maintenanceItem.dark.cardTitleColor;
        }
        else {
            return this.maintenanceItem.light.cardTitleColor;
        }
    }

    maintenanceCheckListTableItem = {
        dark: {
            warningStatus: {
                high: `#f44336`,
                middle: `#ffeb3b`,
                low: `#4caf50`
            }
        },
        light: {
            warningStatus: {
                high: `#f44336`,
                middle: `#ffeb3b`,
                low: `#4caf50`
            }
        }
    }

    get maintenanceCheckListTableItemWarningStatusHigh() {
        if(this._theme === `dark`) {
            return this.maintenanceCheckListTableItem.dark.warningStatus.high;
        } else {
            return this.maintenanceCheckListTableItem.light.warningStatus.high;
        }
    }

    get maintenanceCheckListTableItemWarningStatusMiddle() {
        if(this._theme === `dark`) {
            return this.maintenanceCheckListTableItem.dark.warningStatus.middle;
        } else {
            return this.maintenanceCheckListTableItem.light.warningStatus.middle;
        }
    }

    get maintenanceCheckListTableItemWarningStatusLow() {
        if(this._theme === `dark`) {
            return this.maintenanceCheckListTableItem.dark.warningStatus.low;
        } else {
            return this.maintenanceCheckListTableItem.light.warningStatus.low;
        }
    }

    detailMaintenanceCheckListTableItem = {
        dark: {
            cardColor: `#21263a`,
            inputBackgroundColor: `#ffffff`,
            inputColor: `#111111`,
            inputBorderColor: `#4e546c`
        },
        light: {
            cardColor: `#ffffff`,
            inputBackgroundColor: `#ffffff`,
            inputColor: `#111111`,
            inputBorderColor: `#4e546c`
        }
    }
    get detailMaintenanceCheckListTableItemCardColor() {
        if (this.themeStatus === `dark`) {
            return this.detailMaintenanceCheckListTableItem.dark.cardColor;
        }
        else {
            return this.detailMaintenanceCheckListTableItem.light.cardColor;
        }
    }

    get detailMaintenanceCheckListTableItemInputBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.detailMaintenanceCheckListTableItem.dark.inputBackgroundColor;
        }
        else {
            return this.detailMaintenanceCheckListTableItem.light.inputBackgroundColor;
        }
    }

    get detailMaintenanceCheckListTableItemInputColor() {
        if (this.themeStatus === `dark`) {
            return this.detailMaintenanceCheckListTableItem.dark.inputColor;
        }
        else {
            return this.detailMaintenanceCheckListTableItem.light.inputColor;
        }
    }

    get detailMaintenanceCheckListTableItemInputBorderColor() {
        if (this.themeStatus === `dark`) {
            return this.detailMaintenanceCheckListTableItem.dark.inputBorderColor;
        }
        else {
            return this.detailMaintenanceCheckListTableItem.light.inputBorderColor;
        }
    }
}