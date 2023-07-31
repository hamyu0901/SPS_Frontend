
export class CommonSty{
    constructor() {

    }
    _theme = `dark`
    set commonMode(theme) {
        this._theme = theme;
    }
    get instanceCommonSty() {
        return this;
    }

    subTitleItem = {
        dark: {
            color: "#111111"
        },
        light: {
            color: "#111111"
        }
    }

    get subTitleItemColor() {
        if(this._theme === `dark`) {
            return this.subTitleItem.dark.color;
        } else {
            return this.subTitleItem.light.color;
        }
    }

    cardItem = {
        dark: {
            borderColor: "#393e55"
        },
        light: {
            borderColor: "#c5cfd9"
        }
    }

    get cardItemBorderColor() {
        if(this._theme === `dark`) {
            return this.cardItem.dark.borderColor;
        } else {
            return this.cardItem.light.borderColor;
        }
    }

    buttomItem = {
        dark: {
            backgroundColor: "#237ffe",
            color: "#ffffff"
        },
        light: {
            backgroundColor: "#237ffe",
            color: "#ffffff"
        }
    }

    get buttonItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.buttomItem.dark.backgroundColor;
        } else {
            return this.buttomItem.light.backgroundColor;
        }
    }

    get buttonItemColor() {
        if(this._theme === `dark`) {
            return this.buttomItem.dark.color;
        } else {
            return this.buttomItem.light.color;
        }
    }

    axisButtonItem = {
        dark: {
            backgroundColor: "#171a29",
            color: "#ffffff",
            borderColor: "#393e55",
            activeBackgroundColor: "#237ffe",
            activeColor: "#ffffff"
        }, 
        light: {
            backgroundColor: "#ffffff",
            color: "#8389a4",
            borderColor: "#9da2b8",
            activeBackgroundColor: "#237ffe",
            activeColor: "#ffffff"
        }
    }

    get axisButtonItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.axisButtonItem.dark.backgroundColor;
        } else {
            return this.axisButtonItem.light.backgroundColor;
        }
    }

    get axisButtonItemColor() {
        if(this._theme === `dark`) {
            return this.axisButtonItem.dark.color;
        } else {
            return this.axisButtonItem.light.color;
        }
    }

    get axisButtonItemBorderColor() {
        if(this._theme === `dark`) {
            return this.axisButtonItem.dark.borderColor;
        } else {
            return this.axisButtonItem.light.borderColor;
        }
    }

    get axisButtonItemActiveBackgroundColor() {
        if(this._theme === `dark`) {
            return this.axisButtonItem.dark.activeBackgroundColor;
        } else {
            return this.axisButtonItem.light.activeBackgroundColor;
        }
    }

    get axisButtonItemActiveColor() {
        if(this._theme === `dark`) {
            return this.axisButtonItem.dark.activeColor;
        } else {
            return this.axisButtonItem.light.activeColor;
        }
    }
    
    subTabItem = {
        dark: {
            activeClass: `dy_blue_dark dy_white--text`,
            tabsColor: `#171a29`,
            tabStyleColor: `#bcbdc4`,
            tabStyleBackgroundColor: `#2f354b`,
            tabsStyleBorderBottom: `1px solid #575f7d`,
        },
        light: {
            activeClass: `dy_blue_light dy_white--text`,
            tabsColor: `#f6f9fc`,
            tabStyleColor: `#c1c8e0`,
            tabStyleBackgroundColor: `#566083`,
            tabsStyleBorderBottom: `2px solid #237ffe`,
        }
    }

    get subTabItemActiveClass() {
        if(this._theme === `dark`) {
            return this.subTabItem.dark.activeClass;
        } else {
            return this.subTabItem.light.activeClass;
        }
    }

    get subTabItemTabsColor() {
        if(this._theme === `dark`) {
            return this.subTabItem.dark.tabsColor;
        } else {
            return this.subTabItem.light.tabsColor;
        }
    }

    get subTabItemTabStyleColor() {
        if(this._theme === `dark`) {
            return this.subTabItem.dark.tabStyleColor;
        } else {
            return this.subTabItem.light.tabStyleColor;
        }
    }
    
    get subTabItemTabStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.subTabItem.dark.tabStyleBackgroundColor;
        } else {
            return this.subTabItem.light.tabStyleBackgroundColor;
        }
    }

    get subTabItemTabsStyleBorderBottom() {
        if(this._theme === `dark`) {
            return this.subTabItem.dark.tabsStyleBorderBottom;
        } else {
            return this.subTabItem.light.tabsStyleBorderBottom;
        }
    }

    countRangeItem = {
        dark: {
            backgroundColor: `#171A29`,
            color: `#ffffff`,
            borderColor: `#4e546c`,
        },
        light: {
            backgroundColor: `#ffffff`,
            color: `#111111l`,
            borderColor: `#9099b0`,
        }
    }
    get countRangeItemBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.countRangeItem.dark.backgroundColor;
        }
        else {
            return this.countRangeItem.light.backgroundColor;
        }
    }

    get countRangeItemColor() {
        if(this._theme === `dark`) {
            return this.countRangeItem.dark.color;
        } else {
            return this.countRangeItem.light.color;
        }
    }

    get countRangeItemBorderColor() {
        if (this.themeStatus === `dark`) {
            return this.countRangeItem.dark.borderColor;
        }
        else {
            return this.countRangeItem.light.borderColor;
        }
    }

    datePickerItem = {
        dark: {
            inputBackgroundColor: `#171A29`,
            inputBorder: `solid 1px #4e546c`,
            inputColor: `#cdced2`,
            nextElementSiblingBackgroundColor: `#171A29`,
            nextSiblingColor: `#545a73`,
            calendarBackgroundColor: `#171A29`,
            calendarColor: `#ffffff`,
            appendBackgroundColor: `#171a29`
        },
        light: {
            inputBackgroundColor: `#f6f9fc`,
            inputBorder: `solid 1px #9099b0`,
            inputColor: `#666678`,
            nextElementSiblingBackgroundColor: `#f6f9fc`,
            nextSiblingColor: `#000000`,
            calendarBackgroundColor: `#ffffff`,
            calendarColor: `#353544`,
            appendBackgroundColor: `#f6f9fc`
        }
    }
    get datePickerItemInputBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.inputBackgroundColor;
        }
        else {
            return this.datePickerItem.light.inputBackgroundColor;
        }
    }
    get datePickerItemInputBorder() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.inputBorder;
        }
        else {
            return this.datePickerItem.light.inputBorder;
        }
    }
    get datePickerItemInputColor() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.inputColor;
        }
        else {
            return this.datePickerItem.light.inputColor;
        }
    }
    get datePickerItemNextElementSiblingBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.nextElementSiblingBackgroundColor;
        }
        else {
            return this.datePickerItem.light.nextElementSiblingBackgroundColor;
        }
    }
    get datePickerItemNextSiblingColor() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.nextSiblingColor;
        }
        else {
            return this.datePickerItem.light.nextSiblingColor;
        }
    }
    get datePickerItemCalendarBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.calendarBackgroundColor;
        }
        else {
            return this.datePickerItem.light.calendarBackgroundColor;
        }
    }
    get datePickerItemCalendarColor() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.calendarColor;
        }
        else {
            return this.datePickerItem.light.calendarColor;
        }
    }
    get datePickerItemAppendBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.datePickerItem.dark.appendBackgroundColor;
        }
        else {
            return this.datePickerItem.light.appendBackgroundColor;
        }
    }

    dateTimePickerItem = {
        dark: {
            inputBackgroundColor: `#171A29`,
            inputBorder: `solid 1px #4e546c`,
            inputColor: `#cdced2`,
            nextElementSiblingBackgroundColor: `#171A29`,
            nextSiblingColor: `#545a73`,
            calendarBackgroundColor: `#171A29`,
            calendarColor: `#ffffff`,
            appendBackgroundColor: `#171a29`
        },
        light: {
            inputBackgroundColor: `#f6f9fc`,
            inputBorder: `solid 1px #9099b0`,
            inputColor: `#666678`,
            nextElementSiblingBackgroundColor: `#f6f9fc`,
            nextSiblingColor: `#000000`,
            calendarBackgroundColor: `#ffffff`,
            calendarColor: `#353544`,
            appendBackgroundColor: `#f6f9fc`
        }
    }
    get dateTimePickerItemInputBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.inputBackgroundColor;
        }
        else {
            return this.dateTimePickerItem.light.inputBackgroundColor;
        }
    }
    get dateTimePickerItemInputBorder() {
        if (this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.inputBorder;
        }
        else {
            return this.dateTimePickerItem.light.inputBorder;
        }
    }
    get dateTimePickerItemInputColor() {
        if (this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.inputColor;
        }
        else {
            return this.dateTimePickerItem.light.inputColor;
        }
    }
    get dateTimePickerItemNextElementSiblingBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.nextElementSiblingBackgroundColor;
        }
        else {
            return this.dateTimePickerItem.light.nextElementSiblingBackgroundColor;
        }
    }
    get dateTimePickerItemNextSiblingColor() {
        if (this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.nextSiblingColor;
        }
        else {
            return this.dateTimePickerItem.light.nextSiblingColor;
        }
    }
    get dateTimePickerItemCalendarBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.calendarBackgroundColor;
        }
        else {
            return this.dateTimePickerItem.light.calendarBackgroundColor;
        }
    }
    get dateTimePickerItemCalendarColor() {
        if (this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.calendarColor;
        }
        else {
            return this.dateTimePickerItem.light.calendarColor;
        }
    }

    get dateTimePickerItemAppendBackgroundColor() {
        if(this.themeStatus === `dark`) {
            return this.dateTimePickerItem.dark.appendBackgroundColor;
        } else {
            return this.dateTimePickerItem.light.appendBackgroundColor;
        }
    }
    dateTypesItem = {
        dark: {
            backgroundColor: `#171A29`,
            activeBackgroundColor: `#237ffe`,
            activeColor: `#ffffff`
        },
        light: {
            backgroundColor: `#f6fafd`,
            activeBackgroundColor: `#237ffe`,
            activeColor: `#ffffff`
        }
    }

    get dateTypesItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.dateTypesItem.dark.backgroundColor;
        } else {
            return this.dateTypesItem.light.backgroundColor;
        }
    }

    get dateTypesItemActiveBackgroundColor() {
        if(this._theme === `dark`) {
            return this.dateTypesItem.dark.activeBackgroundColor;
        } else {
            return this.dateTypesItem.light.activeBackgroundColor;
        }
    }

    get dateTypesItemActiveColor() {
        if(this._theme === `dark`) {
            return this.dateTypesItem.dark.activeColor;
        } else {
            return this.dateTypesItem.light.activeColor;
        }
    }
   
    gridTableItem = {
        dark: {
            cardColor: `#21263a`,
            cardTitleBackgroundColor: `#171A29`,
            paginationColor: `#005bac !important`,
            theadBackgroundColor: `#21263a`,
            oddBackgroundColor: `#2a2f44`,
            evenBackgroundColor: `#21263a`,
            paginationBackgroundColor: `#2c3146`,
            rowHighLightBackgroundColor: `#3c5d99`,
            hoverBackgroundColor: `#393B58`,
            tdTextColor: `#ffffff`,
            borderBottomColor: `#2a2f44`
            
        },
        light: {
            cardColor: `#ffffff`,
            cardTitleBackgroundColor: `#ffffff`,
            paginationColor: `#ffffff !important`,
            theadBackgroundColor: `#ffffff`,
            oddBackgroundColor: `#ffffff`,
            evenBackgroundColor: `#ffffff`,
            paginationBackgroundColor: `#ffffff`,
            rowHighLightBackgroundColor: `#E6E6E6`,
            hoverBackgroundColor: `#E6E6E6`,
            tdTextColor: `#000000`,
            borderBottomColor: `#cdd6df`
        }
    }
    get gridTableItemCardColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.cardColor;
        }
        else {
            return this.gridTableItem.light.cardColor;
        }
    }
    get gridTableItemCardTitleBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.cardTitleBackgroundColor;
        } else {
            return this.gridTableItem.light.cardTitleBackgroundColor;
        }
    }
    get gridTableItemPaginationColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.paginationColor;
        }
        else {
            return this.gridTableItem.light.paginationColor;
        }
    }
    get gridTableItemTheadBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.theadBackgroundColor;
        }
        else {
            return this.gridTableItem.light.theadBackgroundColor;
        }
    }
    get gridTableItemOddBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.oddBackgroundColor;
        }
        else {
            return this.gridTableItem.light.oddBackgroundColor;
        }
    }
    get gridTableItemEvenBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.evenBackgroundColor;
        }
        else {
            return this.gridTableItem.light.evenBackgroundColor;
        }
    }
    get gridTableItemPaginationBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.paginationBackgroundColor;
        }
        else {
            return this.gridTableItem.light.paginationBackgroundColor;
        }
    }
    get gridTableItemRowHighLightBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.rowHighLightBackgroundColor;
        }
        else {
            return this.gridTableItem.light.rowHighLightBackgroundColor;
        }
    }
    get gridTableItemHoverBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.hoverBackgroundColor;
        }
        else {
            return this.gridTableItem.light.hoverBackgroundColor;
        }
    }   
    get gridTableItemTdTextColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableItem.dark.tdTextColor;
        }
        else {
            return this.gridTableItem.light.tdTextColor;
        }
    }

    get gridTableItemBorderBottomColor() {
        if(this.themeStatus === `dark`) {
            return this.gridTableItem.dark.borderBottomColor;
        } else {
            return this.gridTableItem.light.borderBottomColor;
        }
    }

    dataTableItems = {
        dark: {
            cardTopBackgroundColor: `#171a29`,
            cardBottomBackgroundColor: `#21263a`,
            tableHeadBackgroundColor: `#21263a`,
            tableHeadBorderBottomColor: `#21263a`,
            tableBodyBorderBottomColor: `#39405d`,
            tableBodyOddBackgroundColor: `#2a2f44`,
            tableBodyOddBorderBottomColor: `#2a2f44`,
            tableBodyEvenBackgroundColor: `#21263a`,
            tableBodyEvenBorderBottomColor: `#21263a`,
            tableBodyHoverColor: `#393B58`,
            tablePaginationColor: `#2c3146`,
            tdTextColor: `#ffffff`,
            tableHighLightColor: `#3c5d99`,
            
        },
        light: {
            cardTopBackgroundColor: `#f6f9fc`,
            cardBottomBackgroundColor: `#ffffff`,
            tableHeadBackgroundColor: `#d8e2ee`,
            tableHeadBorderBottomColor: `#cdd6df`,
            tableBodyBorderBottomColor: `#cdd6df`,
            tableBodyOddBackgroundColor: `#ffffff`,
            tableBodyOddBorderBottomColor: `#cdd6df`,
            tableBodyEvenBackgroundColor: `#ffffff`,
            tableBodyEvenBorderBottomColor: `#cdd6df`,
            tableBodyHoverColor: `#9dbddf`,
            tablePaginationColor: `#cfdae7`,
            tdTextColor: `#2b2e3a`,
            tableHighLightColor: `#9dbddf`,
        }
    }

    get tableCardTopColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.cardTopBackgroundColor;
        } else {
            return this.dataTableItems.light.cardTopBackgroundColor;
        }
    }

    get tableCardBottomColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.cardBottomBackgroundColor;
        } else {
            return this.dataTableItems.light.cardBottomBackgroundColor;
        }
    }

    get tableTHeadBGColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tableHeadBackgroundColor;
        } else {
            return this.dataTableItems.light.tableHeadBackgroundColor;
        }
    }

    get tableTHeadBBColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tableHeadBorderBottomColor;
        } else {
            return this.dataTableItems.light.tableHeadBorderBottomColor;
        }
    }

    get tableTBodyBBColor() {
        if(this._theme === `dark`) {
            return this.dataTableItems.dark.tableBodyBorderBottomColor;
        } else {
            return this.dataTableItems.light.tableBodyBorderBottomColor;
        }
    }

    get tableTBodyOddBGColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tableBodyOddBackgroundColor;
        } else {
            return this.dataTableItems.light.tableBodyOddBackgroundColor;
        }
    }

    get tableTBodyOddBBColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tableBodyOddBorderBottomColor;
        } else {
            return this.dataTableItems.light.tableBodyOddBorderBottomColor;
        }
    }

    get tableTBodyEvenBGColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tableBodyEvenBackgroundColor;
        } else {
            return this.dataTableItems.light.tableBodyEvenBackgroundColor;
        }
    }

    get tableTBodyEvenBBColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tableBodyEvenBorderBottomColor;
        } else {
            return this.dataTableItems.light.tableBodyEvenBorderBottomColor;
        }
    }

    get tableTBodyHoverColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tableBodyHoverColor;
        } else {
            return this.dataTableItems.light.tableBodyHoverColor;
        }
    }

    get tablePaginationColor() {
        if (this._theme === `dark`) {
            return this.dataTableItems.dark.tablePaginationColor;
        } else {
            return this.dataTableItems.light.tablePaginationColor;
        }
    }

    get tableItemTdTextColor() {
        if(this._theme === `dark`) {
            return this.dataTableItems.dark.tdTextColor;
        } else {
            return this.dataTableItems.light.tdTextColor;
        }
    }

    get tableItemHighLightColor() {
        if(this._theme === `dark`) {
            return this.dataTableItems.dark.tableHighLightColor;
        } else {
            return this.dataTableItems.light.tableHighLightColor;
        }
    }

    inputMessageItem = {
        dark: {
            backgroundColor: `#171a29`,
            color: `#cdced2`,
            borderColor: `#4e546c`,
        },
        light: {
            backgroundColor: `#171A29`,
            color: `#111111`,
            borderColor: `#9099b0`,
        }
    }
    
    get inputMessageItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.inputMessageItem.dark.backgroundColor;
        } else {
            return this.inputMessageItem.light.backgroundColor;
        }
    }

    get inputMessageItemColor() {
        if(this._theme === `dark`) {
            return this.inputMessageItem.dark.color;
        } else {
            return this.inputMessageItem.light.color;
        }
    }

    get inputMessageItemBorderColor() {
        if(this._theme === `dark`) {
            return this.inputMessageItem.dark.borderColor;
        } else {
            return this.inputMessageItem.light.borderColor;
        }
    }

    multiSelectorItem = {
        dark: {
            backgroundColor: "#171a29",
            color: "#cdced2",
            placeHolderColor: "#4e546c",
            borderColor: "#4e546c",
            listBackgroundColor: "#171a29",
            listBorderColor: "#4e546c"
        },
        light: {
            backgroundColor: "#f6fafd",
            color: "#666678",
            placeHolderColor: "#666678",
            borderColor: "#9099b0",
            listBackgroundColor: "#f6fafd",
            listBorderColor: "#9099b0"
        }
    }

    get multiSelectorItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.multiSelectorItem.dark.backgroundColor; 
        } else {
            return this.multiSelectorItem.light.backgroundColor;
        }
    }

    get multiSelectorItemColor() {
        if(this._theme === `dark`) {
            return this.multiSelectorItem.dark.color; 
        } else {
            return this.multiSelectorItem.light.color;
        }
    }

    get multiSelectorItemPlaceHolderColor() {
        if(this._theme === `dark`) {
            return this.multiSelectorItem.dark.placeHolderColor; 
        } else {
            return this.multiSelectorItem.light.placeHolderColor;
        }
    }

    get multiSelectorItemBorderColor() {
        if(this._theme === `dark`) {
            return this.multiSelectorItem.dark.borderColor; 
        } else {
            return this.multiSelectorItem.light.borderColor;
        }
    }

    get multiSelectorItemListBackgroundColor() {
        if(this._theme === `dark`) {
            return this.multiSelectorItem.dark.listBackgroundColor; 
        } else {
            return this.multiSelectorItem.light.listBackgroundColor;
        }
    }

    get multiSelectorItemListBorderColor() {
        if(this._theme === `dark`) {
            return this.multiSelectorItem.dark.listBorderColor; 
        } else {
            return this.multiSelectorItem.light.listBorderColor;
        }
    }

    searchBtnItem = {
        dark: {
            searchBtnColor: `#237ffe`,
        },
        light: {
            searchBtnColor: `#ff0000`,
        }
    }
    get searchBtnItemSearchBtnColor() {
        if (this.themeStatus === `dark`) {
            return this.searchBtnItem.dark.searchBtnColor;
        }
        else {
            return this.searchBtnItem.light.searchBtnColor;
        }
    }
    selectorItem = {
        dark: {
            backgroundColor: `#171A29`,
            border: `solid 1px #4e546c`,
            optionColor: `#cdced2`,
            invalidSelectorColor: `#545a73`,
            selectedSelectorColor: `#cdced2`,
            disabledSelectorColor: `#545a73`
        },
        light: {
            backgroundColor: `#f6f9fc`,
            border: `solid 1px #9099b0`,
            optionColor: `#666678`,
            invalidSelectorColor: `#666678`,
            selectedSelectorColor: `#666678`,
            disabledSelectorColor: `#999fb8`
        }
    }
    get selectorItemBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.selectorItem.dark.backgroundColor;
        }
        else {
            return this.selectorItem.light.backgroundColor;
        }
    }
    get selectorItemBorder() {
        if (this.themeStatus === `dark`) {
            return this.selectorItem.dark.border;
        }
        else {
            return this.selectorItem.light.border;
        }
    }

    get selectorItemOptionColor() {
        if(this.themeStatus === `dark`) {
            return this.selectorItem.dark.optionColor;
        } else {
            return this.selectorItem.light.optionColor;
        }
    }

    get selectorItemInvalidSelectColor() {
        if(this.themeStatus === `dark`) {
            return this.selectorItem.dark.invalidSelectorColor;
        } else {
            return this.selectorItem.light.invalidSelectorColor;
        }
    }

    get selectorItemSelectedSelectColor() {
        if(this.themeStatus === `dark`) {
            return this.selectorItem.dark.selectedSelectorColor;
        } else {
            return this.selectorItem.light.selectedSelectorColor;
        }
    }

    get selectorItemDisabledSelectorColor() {
        if(this.themeStatus === `dark`) {
            return this.selectorItem.dark.disabledSelectorColor;
        } else {
            return this.selectorItem.light.disabledSelectorColor;
        }
    }

    settingDlgItem = {
        dark: {
            settingCard: {
                backgroundColor: "#25273e",
                color: "#ffffff"
            },
            settingDlgCard: {
                backgroundColor: "#25273e",
                warningTextColor: "red",
                defaultTextColor: "#ffffff"
            },
            settingDlgList: {
                backgroundColor: "25273e"
            },
            settingDetailCard: {
                backgroundColor: "#505773",
                color: "#ffffff"
            },
            settingDlgListTile: {
                hoverColor: "3086ff"
            },
            applicatorNum: {
                color: "#ffffff"
            },
            applicatorInput: {
                borderColor: "#4d4f6d"
            },
            buttonToggle: {
                backgroundColor: "#505773"
            },
            toggleBtn: {
                color: "#ffffff",
                borderColor: "#ffffff"
            }
        },
        light: {
            settingCard: {
                backgroundColor: "#ccd2e2",
                color: "#111111"
            },
            settingDlgCard: {
                backgroundColor: "#ccd2e2",
                warningTextColor: "red",
                defaultTextColor: "#111111"
            },
            settingDlgList: {
                backgroundColor: "ccd2e2"
            },
            settingDlgListTile: {
                hoverColor: "3086ff"
            },
            settingDetailCard: {
                backgroundColor: "#ffffff",
                color: "#111111"
            },
            applicatorNum: {
                color: "#111111"
            },
            applicatorInput: {
                borderColor: "#8891ae"
            },
            buttonToggle: {
                backgroundColor: "#ffffff"
            },
            toggleBtn: {
                color: "#111111",
                borderColor: "#c0ccd8"
            }
        }
    }



    get settingDlgItemSettingCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.settingCard.backgroundColor;
        } else {
            return this.settingDlgItem.light.settingCard.backgroundColor;
        }
    }

    get settingDlgItemSettingCardColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.settingCard.color;
        } else {
            return this.settingDlgItem.light.settingCard.color;
        }
    }

    get settingDlgItemSettingDetailCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.settingDetailCard.backgroundColor;
        } else {
            return this.settingDlgItem.light.settingDetailCard.backgroundColor;
        }
    }

    get settingDlgItemSettingDetailCardColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.settingDetailCard.color;
        } else {
            return this.settingDlgItem.light.settingDetailCard.color;
        }
    }

    get settingDlgItemApplicatorNumColor() {
        if(this._theme === 'dark') {
            return this.settingDlgItem.dark.applicatorNum.color;
        } else {
            return this.settingDlgItem.light.applicatorNum.color;
        }
    }

    get settingDlgItemApplicatorInputBorderColor() {
        if(this._theme === 'dark') {
            return this.settingDlgItem.dark.applicatorInput.borderColor;
        } else {
            return this.settingDlgItem.light.applicatorInput.borderColor;
        }
    }

    get settingDlgItemButtonToggleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.buttonToggle.backgroundColor;
        } else {
            return this.settingDlgItem.light.buttonToggle.backgroundColor;
        }
    }

    get settingDlgItemToggleBtnColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.toggleBtn.color;
        } else {
            return this.settingDlgItem.light.toggleBtn.color;
        }
    }

    get settingDlgItemToggleBtnBorderColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.toggleBtn.borderColor;
        } else {
            return this.settingDlgItem.light.toggleBtn.borderColor;
        }
    }

    get settingDlgItemCardBackgroundColor() {
        if(this._theme === 'dark') {
            return this.settingDlgItem.dark.settingDlgCard.backgroundColor;
        } else {
            return this.settingDlgItem.light.settingDlgCard.backgroundColor;
        }
    }

    get settingDlgItemCardWarningTextColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.settingCard.warningTextColor;
        } else {
            return this.settingDlgItem.light.settingCard.warningTextColor;
        }
    }

    get settingDlgItemCardDefaultTextColor() {
        if(this._theme === `dark`) {
            return this.settingDlgItem.dark.settingCard.defaultTextColor;
        } else {
            return this.settingDlgItem.light.settingCard.defaultTextColor;
        }
    }

    get settingDlgItemListBackgroundColor() {
        if(this._theme === 'dark') {
            return this.settingDlgItem.dark.settingDlgList.backgroundColor;
        } else {
            return this.settingDlgItem.light.settingDlgList.backgroundColor;
        }
    }

    get settingDlgItemListTileHoverColor() {
        if(this._theme === 'dark') {
            return this.settingDlgItem.dark.settingDlgListTile.hoverColor;
        } else {
            return this.settingDlgItem.light.settingDlgListTile.hoverColor;
        }
    }

    userSetViewItem = {
        dark: {
            userSetViewCard: {
                backgroundColor: "#25273e"
            },
            userSetViewCardTitle: {
                backgroundColor: "#25273e",
                color: "#ffffff"
            },
            toggleBtn: {
                backgroundColor: "#25273e",
                borderColor: "#cfd7df"
            }
        },
        light: {
            userSetViewCard: {
                backgroundColor: "#ccd2e2"
            },
            userSetViewCardTitle: {
                backgroundColor: "#ccd2e2",
                color: "#111111"
            },
            toggleBtn: {
                backgroundColor: "#ffffff",
                borderColor: "#bdc6d0"
            }
        }
    }

    get userSetViewItemCardBackgroundColor() {
        if(this._theme === 'dark') {
            return this.userSetViewItem.dark.userSetViewCard.backgroundColor;
        } else {
            return this.userSetViewItem.light.userSetViewCard.backgroundColor;
        }
    }

    get userSetViewItemCardTitleBackgroundColor() {
        if(this._theme === 'dark') {
            return this.userSetViewItem.dark.userSetViewCardTitle.backgroundColor;
        } else {
            return this.userSetViewItem.light.userSetViewCardTitle.backgroundColor;
        }
    }

    get userSetViewItemCardTitleColor() {
        if(this._theme === 'dark') {
            return this.userSetViewItem.dark.userSetViewCardTitle.color;
        } else {
            return this.userSetViewItem.light.userSetViewCardTitle.color;
        }
    }

    get userSetViewItemToggleBtnBackgroundColor() {
        if(this._theme === 'dark') {
            return this.userSetViewItem.dark.toggleBtn.backgroundColor;
        } else {
            return this.userSetViewItem.light.toggleBtn.backgroundColor;
        }
    }

    get userSetViewItemToggleBtnBorderColor() {
        if(this._theme === 'dark') {
            return this.userSetViewItem.dark.toggleBtn.borderColor;
        } else {
            return this.userSetViewItem.light.toggleBtn.borderColor;
        }
    }

    warningSetViewItem = {
        dark: {
            warningSetInputItem: {
                backgroundColor: "#181b2e",
                borderColor: "#cfd7df"
            },
            searchBtn: {
                backgroundColor: "#237ffe"
            }
        },
        light: {
            warningSetInputItem: {
                backgroundColor: "#ffffff",
                borderColor: "#bdc6d0"
            },
            searchBtn: {
                backgroundColor: "#237ffe"
            }
        }
    }

    get warningSetViewItemInputBackgroundColor() {
        if(this._theme === 'dark') {
            return this.warningSetViewItem.dark.warningSetInputItem.backgroundColor;
        } else {
            return this.warningSetViewItem.light.warningSetInputItem.backgroundColor;
        }
    }

    get warningSetViewItemInputBorderColor() {
        if(this._theme === 'dark') {
            return this.warningSetViewItem.dark.warningSetInputItem.borderColor;
        } else {
            return this.warningSetViewItem.light.warningSetInputItem.borderColor;
        }
    }

    get warningSetViewItemSearchBtnBackgroundColor() {
        if(this._theme === 'dark') {
            return this.warningSetViewItem.dark.searchBtn.backgroundColor;
        } else {
            return this.warningSetViewItem.light.searchBtn.backgroundColor;
        }
    }

    warningSetTableItem = {
        dark: {
            cheetahGrid: {
                frozenRowsColor: "#ffffff", // header text color
                frozenRowsDefaultBgColor: "#1476fd", // header bg color(default)
                frozenRowsSpecificBgColor: "#313b56", // header bg color(specific)
                frozenRowsBorderColor: "#313b56", // header border color
                defaultBgColor: "#282c45", // grid bg color(default)
                specificBgColor: "#181b2e", // grid bg color(specific)
                checkBgColor: "#3c5d99", // grid bg color(check)
                textColor: "#ffffff", // grid text color
                underlayBackgroundColor: "#181b2e", 
                borderColor: "#313b56",
                buttonColor: "#ffffff",
                buttonBgColor: "#1476fd"

            },
            inputItem: {
                color: "#111111"
            }
        },
        light: {
            cheetahGrid: {
                frozenRowsColor: "#ffffff", // header text color
                frozenRowsDefaultBgColor: "#1476fd", // header bg color(default)
                frozenRowsSpecificBgColor: "#313b56", // header bg color(specific)
                frozenRowsBorderColor: "#313b56", // header border color
                defaultBgColor: "#ffffff", // grid bg color(default)
                specificBgColor: "#ccd2e2", // grid bg color(specific)
                checkBgColor: "#b6c4de", // grid bg color(check)
                textColor: "#111111", // grid text color
                underlayBackgroundColor: "#ffffff", 
                borderColor: "#b6c4de",
                buttonColor: "#ffffff",
                buttonBgColor: "#1476fd"

            },
            inputItem: {
                color: "#111111"
            }
        }
    }

    get warningSetTableItemCheetahGridFrozenRowsColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.frozenRowsColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.frozenRowsColor;
        }
    }

    get warningSetTableItemCheetahGridFrozenRowsDefaultBgColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.frozenRowsDefaultBgColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.frozenRowsDefaultBgColor;
        }
    }

    get warningSetTableItemCheetahGridFrozenRowsSpecificBgColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.frozenRowsSpecificBgColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.frozenRowsSpecificBgColor;
        }
    }

    get warningSetTableItemCheetahGridFrozenRowsBorderColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.frozenRowsBorderColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.frozenRowsBorderColor;
        }
    }

    get warningSetTableItemCheetahGridDefaultBgColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.defaultBgColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.defaultBgColor;
        }
    }

    get warningSetTableItemCheetahGridSpecificBgColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.specificBgColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.specificBgColor;
        }
    }

    get warningSetTableItemCheetahGridCheckBgColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.checkBgColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.checkBgColor;
        }
    }

    get warningSetTableItemCheetahGridTextColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.textColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.textColor;
        }
    }

    get warningSetTableItemCheetahGridUnderlayBackgroundColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.underlayBackgroundColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.underlayBackgroundColor;
        }
    }

    get warningSetTableItemCheetahGridBorderColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.borderColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.borderColor;
        }
    }

    get warningSetTableItemCheetahGridButtonColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.buttonColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.buttonColor;
        }
    }

    get warningSetTableItemCheetahGridButtonBgColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.cheetahGrid.buttonBgColor;
        } else {
            return this.warningSetTableItem.light.cheetahGrid.buttonBgColor;
        }
    }

    get warningSetTableItemInputColor() {
        if(this._theme === 'dark') {
            return this.warningSetTableItem.dark.inputItem.color;
        } else {
            return this.warningSetTableItem.light.inputItem.color;
        }
    }

    detailWarningSetTableItem = {
        dark: {
            cheetahGrid: {
                frozenRowsColor: "#ffffff",
                frozenRowsBgColor: "#313b56",
                frozenRowsBorderColor: "#313b56",
                defaultBgColor: "#282c45",
                specificBgColor: "#181b2e",
                textColor: "#ffffff",
                underlayBackgroundColor: "#181b2e",
                borderColor: "#313b56",
                buttonColor: "#ffffff",
                buttonBgColor: "#1476fd"
            },
            inputItem: {
                color: "#111111"
            }
        },
        light: {
            cheetahGrid: {
                frozenRowsColor: "#ffffff",
                frozenRowsBgColor: "#313b56",
                frozenRowsBorderColor: "#313b56",
                defaultBgColor: "#ffffff",
                specificBgColor: "#ccd2e2",
                textColor: "#111111",
                underlayBackgroundColor: "#ffffff",
                borderColor: "#b6c4de",
                buttonColor: "#ffffff",
                buttonBgColor: "#1476fd"
            },
            inputItem: {
                color: "#111111"
            }
        }
    }

    get detailWarningSetTableItemCheetahGridFrozenRowsColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.frozenRowsColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.frozenRowsColor;
        } 
    } 

    get detailWarningSetTableItemCheetahGridFrozenRowsBgColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.frozenRowsBgColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.frozenRowsBgColor;
        } 
    }

    get detailWarningSetTableItemCheetahGridFrozenRowsBorderColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.frozenRowsBorderColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.frozenRowsBorderColor;
        }
    }

    get detailWarningSetTableItemCheetahGridDefaultBgColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.defaultBgColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.defaultBgColor;
        }
    }

    get detailWarningSetTableItemCheetahGridSpecificBgColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.specificBgColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.specificBgColor;
        }
    }

    get detailWarningSetTableItemCheetahGridTextColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.textColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.textColor;
        }
    }

    get detailWarningSetTableItemCheetahGridUnderlayBackgroundColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.underlayBackgroundColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.underlayBackgroundColor;
        }
    }

    get detailWarningSetTableItemCheetahGridBorderColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.borderColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.borderColor;
        }
    }

    get detailWarningSetTableItemCheetahGridButtonColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.buttonColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.buttonColor;
        }
    }

    get detailWarningSetTableItemCheetahGridButtonBgColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.cheetahGrid.buttonBgColor;
        } else {
            return this.detailWarningSetTableItem.light.cheetahGrid.buttonBgColor;
        }
    }

    get detailWarningSetTableItemInputColor() {
        if(this._theme === 'dark') {
            return this.detailWarningSetTableItem.dark.inputItem.color;
        } else {
            return this.detailWarningSetTableItem.light.inputItem.color;
        }
    }

    spreadSheetTableItem = {
        dark: {
            cardColor: `#21263a`,
            spreadSheetTableBackgroundColor: `#171A29`,
        },
        light: {
            cardColor: `#ffffff`,
            spreadSheetTableBackgroundColor: `#171A29`,
        }
    }
    get spreadSheetTableItemCardColor() {
        if (this.themeStatus === `dark`) {
            return this.spreadSheetTableItem.dark.cardColor;
        }
        else {
            return this.spreadSheetTableItem.light.cardColor;
        }
    }
    get spreadSheetTableItemSpreadSheetTableBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.spreadSheetTableItem.dark.spreadSheetTableBackgroundColor;
        }
        else {
            return this.spreadSheetTableItem.light.spreadSheetTableBackgroundColor;
        }
    }
    digitalClockItem = {
        dark: {
            color: `#ffffff`,
        },
        light: {
            color: `#46557d`,
        }
    }
    get digitalClockItemColor() {
        if (this.themeStatus === `dark`) {
            return this.digitalClockItem.dark.color;
        }
        else {
            return this.digitalClockItem.light.color;
        }
    }
    titleObjectItem = {
        dark: {
            color: 'white',
            fontSize: '20px',
            marginBottom: '0px',
            padding: '5px',
            paddingBottom: '0px',
            fontWeight: "bold"
        },
        light: {
            color: 'black',
            fontSize: '20px',
            marginBottom: '0px',
            padding: '5px',
            paddingBottom: '0px',
            fontWeight: "bold"
        }
    }
    get titleObjectItemColor() {
        if (this.themeStatus === `dark`) {
            return this.titleObjectItem.dark;
        }
        else {
            return this.titleObjectItem.light;
        }
    }
    tableHeaderStyleItem = {
        dark: {
            color: `white`,
            fontSize: `16px`,
            fontWeight: `bold`
        },
        light: {
            color: `black`,
            fontSize: `16px`,
            fontWeight: `bold`
        }
    }
    get tableHeaderStyleColor() {
        if (this.themeStatus === `dark`) {
            return this.tableHeaderStyleItem.dark;
        }
        else {
            return this.tableHeaderStyleItem.light;
        }
    }
    tableTextItem = {
        dark: {
            tdColor: `#ffffff`,
        },
        light: {
            tdColor: `#000000`,
        },
    }
    get tableTextItemTdColor() {
        if (this._theme === `dark`) {
            return this.tableTextItem.dark.tdColor;
        } else {
            return this.tableTextItem.light.tdColor;
        }
    }
    treeViewItem = {
        dark: {
            treeViewBackgroundColor: `#21263a`,
            treeItemColor: `#ffffff`,
            activeClass: `dy_blue_dark dy_white--text`
        },
        light: {
            treeViewBackgroundColor: `#d2d7e5`,
            treeItemColor: `#4d4d61`,
            activeClass: `dy_conch dy_white--text`
        },
    }
    get treeViewItemTreeViewBackgroundColor() {
        if (this._theme === `dark`) {
            return this.treeViewItem.dark.treeViewBackgroundColor;
        } else {
            return this.treeViewItem.light.treeViewBackgroundColor;
        }
    }
    get treeViewItemTreeItemColor() {
        if (this._theme === `dark`) {
            return this.treeViewItem.dark.treeItemColor;
        } else {
            return this.treeViewItem.light.treeItemColor;
        }
    }
    get treeViewItemActiveClass() {
        if (this._theme === `dark`) {
            return this.treeViewItem.dark.activeClass;
        } else {
            return this.treeViewItem.light.activeClass;
        }
    }

    comfirmDlgItem = {
        dark: {
            backgroundColor: `#1f243b`,
            titleBackgroundColor: `#2f3758`,
            buttonBackgroundColor: `#1976d2`
        },
        light: {
            backgroundColor: `#ccd2e2`,
            titleBackgroundColor: `#ffffff`,
            buttonBackgroundColor: `#3086ff`
        }
    }

    get comfirmDlgItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.comfirmDlgItem.dark.backgroundColor;
        } else {
            return this.comfirmDlgItem.light.backgroundColor;
        }
    }

    get comfirmDlgItemTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.comfirmDlgItem.dark.titleBackgroundColor;
        } else {
            return this.comfirmDlgItem.light.titleBackgroundColor;
        }
    }

    get comfirmDlgItemButtonBackgroundColor() {
        if(this._theme === `dark`) {
            return this.comfirmDlgItem.dark.buttonBackgroundColor;
        } else {
            return this.comfirmDlgItem.light.buttonBackgroundColor;
        }
    }

    actionReportItem = {
        dark: {
            inputField: {
                color: "#cdced2",
                backgroundColor: "#171a29",
                borderColor: "#4e546c"
            }
        },
        light: {
            inputField: {
                color: "#111111",
                backgroundColor: "#ffffff",
                borderColor: "#9099b0"
            }
        }
    }

    get actionReportItemInputFieldColor() {
        if(this._theme === `dark`) {
            return this.actionReportItem.dark.inputField.color;
        } else {
            return this.actionReportItem.light.inputField.color;
        }
    }

    get actionReportItemInputFieldBackgroundColor() {
        if(this._theme === `dark`) {
            return this.actionReportItem.dark.inputField.backgroundColor;
        } else {
            return this.actionReportItem.light.inputField.backgroundColor;
        }
    }

    get actionReportItemInputFieldBorderColor() {
        if(this._theme === `dark`) {
            return this.actionReportItem.dark.inputField.borderColor;
        } else {
            return this.actionReportItem.light.inputField.borderColor;
        }
    }

    autoSelectorItem = {
        dark: {
            color: "#cdced2",
            backgroundColor: "#171A29",
            borderColor: "#4e546c"
        },
        light: {
            color: "#6e778d",
            backgroundColor: "#f6f9fc",
            borderColor: "#9099b0"
        }
    }

    get autoSelectorItemColor() {
        if(this._theme === `dark`) {
            return this.autoSelectorItem.dark.color;
        } else {
            return this.autoSelectorItem.light.color;
        }
    }

    get autoSelectorItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.autoSelectorItem.dark.backgroundColor;
        } else {
            return this.autoSelectorItem.light.backgroundColor;
        }
    }

    get autoSelectorItemBorderColor() {
        if(this._theme === `dark`) {
            return this.autoSelectorItem.dark.borderColor;
        } else {
            return this.autoSelectorItem.light.borderColor;
        }
    }
    
    priorityListItem = {
        dark: {
            backgroundColor: "#2a2f44",
            titleBackgroundColor: "#21263a",
            color: "#ffffff",
            buttonBorderColor: "#a8aab2",
            buttonHoverColor: "#ffffff",
            buttonHoverBackgroundColor: "#3188ff"
        },
        light: {
            backgroundColor: "#ffffff",
            titleBackgroundColor: "#d8e2ee",
            color: "#3086ff",
            buttonBorderColor: "#3086ff",
            buttonHoverColor: "#ffffff",
            buttonHoverBackgroundColor: "#3086ff"
        }
    }

    get priorityListItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.priorityListItem.dark.backgroundColor;
        } else {
            return this.priorityListItem.light.backgroundColor;
        }
    }

    get priorityListItemTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.priorityListItem.dark.titleBackgroundColor;
        } else {
            return this.priorityListItem.light.titleBackgroundColor;
        }
    }

    get priorityListItemColor() {
        if(this._theme === `dark`) {
            return this.priorityListItem.dark.color;
        } else {
            return this.priorityListItem.light.color;
        }
    }

    get priorityListItemButtonBorderColor() {
        if(this._theme === `dark`) {
            return this.priorityListItem.dark.buttonBorderColor;
        } else {
            return this.priorityListItem.light.buttonBorderColor;
        }
    }

    get priorityListItemButtonHoverColor() {
        if(this._theme === `dark`) {
            return this.priorityListItem.dark.buttonHoverColor;
        } else {
            return this.priorityListItem.light.buttonHoverColor;
        }
    }

    get priorityListItemButtonHoverBackgroundColor() {
        if(this._theme === `dark`) {
            return this.priorityListItem.dark.buttonHoverBackgroundColor;
        } else {
            return this.priorityListItem.light.buttonHoverBackgroundColor;
        }
    }

    menuSetViewItem = {
        dark: {
            menuSetViewCardBackgroundColor: "#18192b",
            menuSetViewCardBorderColor: "#3086ff",
            menuSetViewCardTitleColor: "#ffffff",
            menuSetViewCardTitleBackgroundColor: "#3086ff",
            menuSetViewCardListBackgroundColor: "#18192b"
        },
        light: {
            menuSetViewCardBackgroundColor: "#ffffff",
            menuSetViewCardTitleColor: "#ffffff",
            menuSetViewCardBorderColor: "#313b56",
            menuSetViewCardTitleBackgroundColor: "#313b56",
            menuSetViewCardListBackgroundColor: "#ffffff"
        }
    }

    get menuSetViewItemCardBackgroundColor() {
        if(this._theme === 'dark') {
            return this.menuSetViewItem.dark.menuSetViewCardBackgroundColor;
        } else {
            return this.menuSetViewItem.light.menuSetViewCardBackgroundColor;
        }
    }

    get menuSetViewItemCardBorderColor() {
        if(this._theme === 'dark') {
            return this.menuSetViewItem.dark.menuSetViewCardBorderColor;
        } else {
            return this.menuSetViewItem.light.menuSetViewCardBorderColor;
        }
    }

    get menuSetViewItemCardTitleColor() {
        if(this._theme === 'dark') {
            return this.menuSetViewItem.dark.menuSetViewCardTitleColor;
        } else {
            return this.menuSetViewItem.light.menuSetViewCardTitleColor;
        }
    }

    get menuSetViewItemCardTitleBackgroundColor() {
        if(this._theme === 'dark') {
            return this.menuSetViewItem.dark.menuSetViewCardTitleBackgroundColor;
        } else {
            return this.menuSetViewItem.light.menuSetViewCardTitleBackgroundColor;
        }
    }

    get menuSetViewItemCardListBackgroundColor() {
        if(this._theme === 'dark') {
            return this.menuSetViewItem.dark.menuSetViewCardListBackgroundColor;
        } else {
            return this.menuSetViewItem.light.menuSetViewCardListBackgroundColor;
        }
    }
}