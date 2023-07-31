export class BackupSty {
    constructor() {

    }
    _theme = `dark`
    set backupMode(theme) {
        this._theme = theme;
    }
    get instanceBackupSty() {
        return this;
    }
    backupDataTableItem = {
        dark: {
            tableBackgroundColor: `#203556`,
            buttonBackgroundColor: `#203556`,
            clrBackgroundColor: `#21263a`,
            cardColor: `#21263a`,
            paginationColor: `#005bac !important`,
            jobFileContentAreaBackgroundColor: `#c7ced6`,
            titleColorBackgroundColor: `#171A29`,
            closeBtnBackgroundColor: `#1976d2`,
            closeBtnFontColor: `#ffffff`,
            noDataAvailable: `#203556`,
            jobTextColor: `#000000`,
            cardTitleColor: `#ffffff`,
            iconColor: `#ffffff`,
        },
        light: {
            tableBackgroundColor: `#ffffff`,
            buttonBackgroundColor: `#ffffff`,
            clrBackgroundColor: `#ffffff`,
            cardColor: `#ffffff`,
            paginationColor: `#ffffff !important`,
            jobFileContentAreaBackgroundColor: `#ffffff`,
            titleColorBackgroundColor: `#ffffff`,
            closeBtnBackgroundColor: `#ffffff`,
            closeBtnFontColor: `#000000`,
            noDataAvailable: `#ffffff`,
            jobTextColor: `#121212`,
            cardTitleColor: `#000000`,
            iconColor: `#000000`,
        }
    }
    get backupDataTableItemTableBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.tableBackgroundColor;
        }
        else {
            return this.backupDataTableItem.light.tableBackgroundColor;
        }
    }
    get backupDataTableItemButtonBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.buttonBackgroundColor;
        }
        else {
            return this.backupDataTableItem.light.buttonBackgroundColor;
        }
    }
    get backupDataTableItemClrBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.clrBackgroundColor;
        }
        else {
            return this.backupDataTableItem.light.clrBackgroundColor;
        }
    }
    get backupDataTableItemCardColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.cardColor;
        }
        else {
            return this.backupDataTableItem.light.cardColor;
        }
    }
    get backupDataTableItemPaginationColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.paginationColor;
        }
        else {
            return this.backupDataTableItem.light.paginationColor;
        }
    }
    get backupDataTableItemJobFileContentAreaBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.jobFileContentAreaBackgroundColor;
        } else {
            return this.backupDataTableItem.light.jobFileContentAreaBackgroundColor;
        }
    }
    get backupDataTableItemTitleColorBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.titleColorBackgroundColor;
        } else {
            return this.backupDataTableItem.light.titleColorBackgroundColor;
        }
    }
    get backupDataTableItemCloseBtnBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.closeBtnBackgroundColor;
        } else {
            return this.backupDataTableItem.light.closeBtnBackgroundColor;
        }
    }
    get backupDataTableItemCloseBtnFontColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.closeBtnFontColor;
        } else {
            return this.backupDataTableItem.light.closeBtnFontColor;
        }
    }
    get backupDataTableItemNoDataAvailable() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.noDataAvailable;
        } else {
            return this.backupDataTableItem.light.noDataAvailable;
        }
    }
    get backupDataTableItemJobTextColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.jobTextColor;
        } else {
            return this.backupDataTableItem.light.jobTextColor;
        }
    }
    get backupDataTableItemCardTitleColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.cardTitleColor;
        } else {
            return this.backupDataTableItem.light.cardTitleColor;
        }
    }
    get backupDataTableItemIconColor() {
        if (this.themeStatus === `dark`) {
            return this.backupDataTableItem.dark.iconColor;
        } else {
            return this.backupDataTableItem.light.iconColor;
        }
    }

    backUpDetailItem = {
        dark: {
            backUpDetailCardBackgorundColor: "#25273e",
            backUpSubCardBackgroundColor: "#25273e",
            backUpSubCardTitleBackgroundColor: "#2f3758",
            backUpSubCardTitleColor: "#ffffff"
        },
        light: {
            backUpDetailCardBackgorundColor: "#ccd2e2",
            backUpSubCardBackgroundColor: "#ffffff",
            backUpCardTitleBackgroundColor: "#313b55",
            backUpCardTitleColor: "#ffffff"
        }
    }

    get backUpDetailItemBackUpDetailCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.backUpDetailItem.dark.backUpDetailCardBackgorundColor;
        } else {
            return this.backUpDetailItem.light.backUpDetailCardBackgorundColor;
        }
    }

    get backUpDetailItemBackUpSubCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.backUpDetailItem.dark.backUpSubCardBackgroundColor;
        } else {
            return this.backUpDetailItem.light.backUpSubCardBackgroundColor;
        }
    }

    get backUpDetailItemBackUpSubCardTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.backUpDetailItem.dark.backUpSubCardTitleBackgroundColor;
        } else {
            return this.backUpDetailItem.light.backUpSubCardTitleBackgroundColor;
        }
    }

    get backUpDetailItemBackUpSubCardTitleColor() {
        if(this._theme === `dark`) {
            return this.backUpDetailItem.dark.backUpSubCardTitleColor;
        } else {
            return this.backUpDetailItem.light.backUpSubCardTitleColor;
        }
    }
    

    backupHistoryItem = {
        dark: {
          
        },
        light: {
          
        }
    }
    
}