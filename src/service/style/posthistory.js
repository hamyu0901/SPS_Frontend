export class PostHistorySty {
    constructor() {

    }
    _theme = `dark`
    set postHistoryMode(theme) {
        this._theme = theme;
    }
    get instancePostHistorySty() {
        return this;
    }

    gridTableWithDialogItem = {
        dark: {
            cardColor: `#21263a`,
            paginationColor: `#005bac`,
            tableBackgroundColor: `#203556`,
            buttonBackgroundColor: `#203556`,
            titleColor: `#171A29`,
        },
        light: {
            cardColor: `#ffffff`,
            paginationColor: `#ffffff`,
            tableBackgroundColor: `#ffffff`,
            buttonBackgroundColor: `#ffffff`,
            titleColor: `#ffffff`,
        }
    }
    get cardColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.cardColor;
        }
        else {
            return this.gridTableWithDialogItem.light.cardColor;
        }
    }
    get paginationColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.paginationColor;
        }
        else {
            return this.gridTableWithDialogItem.light.paginationColor;
        }
    }
    get tableBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.tableBackgroundColor;
        }
        else {
            return this.gridTableWithDialogItem.light.tableBackgroundColor;
        }
    }
    get buttonBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.buttonBackgroundColor;
        }
        else {
            return this.gridTableWithDialogItem.light.buttonBackgroundColor;
        }
    }
    get gridTableWithDialogItemTitleColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.titleColor;
        }
        else {
            return this.gridTableWithDialogItem.light.titleColor;
        }
    }

    historyListItem = {
        dark: {
            chipTypeNameColor: `red`,
            chipColor: `primary`,
            chipTextColor: `white`,
            historyListCardBackgroundColor: `#1f243b`,
            historyListCardTitleBackgroundColor: `#2f3758`,
            historyListCardTitleColor: `#ffffff`,
            historyListContentsBackgroundColor: `#1f243b`,
            historyListItemDlgBackgroundColor: `#1f243b`,
            historyListItemDlgTitleBackgroundColor: `#2f3758`,
            historyListItemDlgTitleColor: `#ffffff`
        },
        light: {
            chipTypeNameColor: `red`,
            chipColor: `primary`,
            chipTextColor: `white`,
            historyListCardBackgroundColor: `#ffffff`,
            historyListCardTitleBackgroundColor: `#f6f9fc`,
            historyListCardTitleColor: `#111111`,
            historyListContentsBackgroundColor: `#ffffff`,
            historyListItemDlgBackgroundColor: `#ccd2e2`,
            historyListItemDlgTitleBackgroundColor: `#313b56`,
            historyListItemDlgTitleColor: `#ffffff`
        }
    }
    get chipTypeNameColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.chipTypeNameColor;
        }
        else {
            return this.historyListItem.light.chipTypeNameColor;
        }
    }
    get chipColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.chipColor;
        }
        else {
            return this.historyListItem.light.chipColor;
        }
    }
    get chipTextColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.chipTextColor;
        }
        else {
            return this.historyListItem.light.chipTextColor;
        }  
    }
    get historyListItemHistoryListCardBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.historyListCardBackgroundColor;
        }
        else {
            return this.historyListItem.light.historyListCardBackgroundColor;
        }  
    }
    get historyListItemCardTitleBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.historyListCardTitleBackgroundColor;
        }
        else {
            return this.historyListItem.light.historyListCardTitleBackgroundColor;
        }  
    }
    get historyListItemCardTitleColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.historyListCardTitleColor;
        }
        else {
            return this.historyListItem.light.historyListCardTitleColor;
        }  
    }
    get historyListItemHistoryListContentsBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.historyListContentsBackgroundColor;
        }
        else {
            return this.historyListItem.light.historyListContentsBackgroundColor;
        }  
    }
    get historyListItemHistoryListItemDlgBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.historyListItemDlgBackgroundColor;
        }
        else {
            return this.historyListItem.light.historyListItemDlgBackgroundColor;
        }  
    }
    get historyListItemHistoryListItemDlgTitleBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.historyListItemDlgTitleBackgroundColor;
        }
        else {
            return this.historyListItem.light.historyListItemDlgTitleBackgroundColor;
        }
    }

    get historyListItemHistoryListItemDlgTitleColor() {
        if (this.themeStatus === `dark`) {
            return this.historyListItem.dark.historyListItemDlgTitleColor;
        }
        else {
            return this.historyListItem.light.historyListItemDlgTitleColor;
        }
    }

    postHistoryItem = {
        dark: {
            actionReportDlgCardBackgroundColor: `#1f243b`,
            actionReportDlgCardTitleBackgroundColor: `#2f3758`,
            actionReportDlgCardTitleColor: `#ffffff`,
            inputAlarmCodeBackgroundColor: `#171a29`,
            inputAlarmCodeColor: `#cdced2`,
            inputAlarmCodeBorderColor: `#4e546c`
        },
        light: {
            actionReportDlgCardBackgroundColor: `#ccd2e2`,
            actionReportDlgCardTitleBackgroundColor: `#313b55`,
            actionReportDlgCardTitleColor: `#ffffff`,
            inputAlarmCodeBackgroundColor: `#f6f9fc`,
            inputAlarmCodeColor: `#666678`,
            inputAlarmCodeBorderColor: `#9099b0`
        }
    }
    
    get postHistoryItemActionReportDlgCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.postHistoryItem.dark.actionReportDlgCardBackgroundColor;
        } else {
            return this.postHistoryItem.light.actionReportDlgCardBackgroundColor;
        }
    }

    get postHistoryItemActionReportDlgCardTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.postHistoryItem.dark.actionReportDlgCardTitleBackgroundColor;
        } else {
            return this.postHistoryItem.light.actionReportDlgCardTitleBackgroundColor;
        }
    }

    get postHistoryItemActionReportDlgCardTitleColor() {
        if(this._theme === `dark`) {
            return this.postHistoryItem.dark.actionReportDlgCardTitleColor;
        } else {
            return this.postHistoryItem.light.actionReportDlgCardTitleColor;
        }
    }
    
    get postHistoryItemInputAlarmCodeBackgroundColor() {
        if(this._theme === `dark`) {
            return this.postHistoryItem.dark.inputAlarmCodeBackgroundColor;
        } else {
            return this.postHistoryItem.light.inputAlarmCodeBackgroundColor;
        }
    }

    get postHistoryItemInputAlarmCodeColor() {
        if(this._theme === `dark`) {
            return this.postHistoryItem.dark.inputAlarmCodeColor;
        } else {
            return this.postHistoryItem.light.inputAlarmCodeColor;
        }
    }

    get postHistoryItemInputAlarmCodeBorderColor() {
        if(this._theme === `dark`) {
            return this.postHistoryItem.dark.inputAlarmCodeBorderColor;
        } else {
            return this.postHistoryItem.light.inputAlarmCodeBorderColor;
        }
    }

    postHistoryDataItem = {
        dark: {
            dlgAreaBackgroundColor: `#171A29`,
            causeDescUIBackgroundColor: `#171A29`,
            actionDescUIBackgroundColor: `#171A29`,
            btnAreaBackgroundColor: `#171A29`,
            btnObjectBackgroundColor: `#171A29`,
        },
        light: {
            dlgAreaBackgroundColor: `#ffffff`,
            causeDescUIBackgroundColor: `#ffffff`,
            actionDescUIBackgroundColor: `#ffffff`,
            btnAreaBackgroundColor: `#ffffff`,
            btnObjectBackgroundColor: `#ffffff`,
        }
    }
    get postHistoryDataItemDlgAreaBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.postHistoryDataItem.dark.dlgAreaBackgroundColor;
        }
        else {
            return this.postHistoryDataItem.light.dlgAreaBackgroundColor;
        }  
    }
    get postHistoryDataItemCauseDescUIBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.postHistoryDataItem.dark.causeDescUIBackgroundColor;
        }
        else {
            return this.postHistoryDataItem.light.causeDescUIBackgroundColor;
        }  
    }
    get postHistoryDataItemActionDescUIBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.postHistoryDataItem.dark.actionDescUIBackgroundColor;
        }
        else {
            return this.postHistoryDataItem.light.actionDescUIBackgroundColor;
        }  
    }
    get postHistoryDataItemBtnAreaBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.postHistoryDataItem.dark.btnAreaBackgroundColor;
        }
        else {
            return this.postHistoryDataItem.light.btnAreaBackgroundColor;
        }  
    }
    get postHistoryDataItemBtnObjectBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.postHistoryDataItem.dark.btnObjectBackgroundColor;
        }
        else {
            return this.postHistoryDataItem.light.btnObjectBackgroundColor;
        }  
    }
}