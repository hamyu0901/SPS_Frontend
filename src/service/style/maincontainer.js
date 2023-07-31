export class MainContainerSty {
    constructor() {

    }
    _theme = `dark`
    headerItem = {
        dark: {
            color: `#21263a`,
        },
        light: {
            color: `#1b223d`,
        }
    }
    mainItem = {
        dark: {
            backgrondColor: `#171a29`,
        },
        light: {
            backgrondColor: `#f6f9fc`,
        }
    }
    menuItem = {
        dark: {
            fontColor: `#ffffff`,
        },
        light: {
            fontColor: `#ffffff`,
        }
    }
    get menuItemFontColor() {
        if (this.themeStatus === `dark`) {
            return this.menuItem.dark.fontColor;
        }
        else {
            return this.menuItem.light.fontColor;
        }
    }
    footerItem = {
        dark: {
            color: `#0f111c`,
            text: {
                copyright: `#474959`,
                CI: `#2d77f1`,
            }
        },
        light: {
            color: `#d2d9e1`,
            text: {
                copyright: `#717a98`,
                CI: `#0086ed`,
            }
        }
    }
    set mainContainerMode(theme) {
        this._theme = theme;
    }
    get instanceMainContainerSty() {
        return this;
    }
    get themeStatus() {
        return this._theme;
    }
    get header() {
        if (this.themeStatus === `dark`) {
            return this.headerItem.dark.color;
        }
        else {
            return this.headerItem.light.color;
        }
    }
    get main() {
        if (this.themeStatus === `dark`) {
            return this.mainItem.dark.backgrondColor;
        }
        else {
            return this.mainItem.light.backgrondColor;
        }
    }
    get footer() {
        if (this.themeStatus === `dark`) {
            return this.footerItem.dark.color;
        }
        else {
            return this.footerItem.light.color;
        }
    }
    get footerText() {
        if (this.themeStatus === `dark`) {
            return this.footerItem.dark.text;
        }
        else {
            return this.footerItem.light.text;
        }
    }
}