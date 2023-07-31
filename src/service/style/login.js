/* LogIn Page */
export class LogInSty {
    constructor() {
        
    }
    
    _theme = `dark`
    /* Class Member Variable */
    versionTextItem = {
        dark: {
            color: `#FFFFFF`,
        },
        light: {
            color: `#171a29`,
        },
    }
    ciTextItem = {
        dark: {
            color: `#FFFFFF`,
        },
        light: {
            color: `#2c2c3d`,
        }
    }
    cardItemDark = {
        marginBottom: `100px`,
        width: `400px`,
        backgroundColor: `#1b2137`,
    }
    cardItemLight = {
        marginBottom: `100px`,
        width: `400px`,
        backgroundColor: `#2c2c3d`,
    }
    formItem = {
        marginBottom: `-30px`,
    }
    buttonItem = {
        marginTop: `40px`,
    }
    buttonColorItem = {
        dark: {
            color: `#005bac`,
        },
        light: {
            color: `#3086ff`,
        }
    }
    idItem = {
        marginBottom: `-5px`,
        marginLeft: `-13px`,        
        dark: {
            color: `rgba(255,255,255,0.7)`,
        },
        light: {
            color: `rgba(151,161,199,1)`,
        },
    }
    pwItem = {
        marginBottom: `-5px`,
        marginLeft: `-13px`,
        dark: {
            color: `rgba(255,255,255,0.7)`,
        },
        light: {
            color: `rgba(151,161,199,1)`,
        },
    }
    resolutionTextItemDark = {
        color: `#FFFFFF`,
    }
    resolutionTextItemLight = {
        color: `#171a29`,
    }
    textFieldItemDark = {
        backgroundColor: `#21263a`,
    }
    textFieldItemLight = {
        backgroundColor: `#FFFFFF`,
    }

    set logInMode(theme) {
        this._theme = theme;
    }

    /* Class Member Getter Function */
    get instanceLogInSty() {
        return this;
    }
    get versionText() {
        if (this._theme === `dark`) {
            return this.versionTextItem.dark.color;
        }
        else {
            return this.versionTextItem.light.color;
        }
    }
    get ciText() {
        if (this._theme === `dark`) {
            return this.ciTextItem.dark.color;
        }
        else {
            return this.ciTextItem.light.color;
        }
    }
    get loginCard() {
        if (this._theme === `dark`) {
            return this.cardItemDark;
        }
        else {
            return this.cardItemLight;
        }
    }
    get loginForm() {
        return this.formItem;
    }
    get loginButton() {
        return this.buttonItem;
    }
    get loginButtonColor() {
        if (this._theme === `dark`) {
            return this.buttonColorItem.dark.color;
        }
        else {
            return this.buttonColorItem.light.color;
        }
    }
    get id() {
        return this.idItem;
    }
    get idTextColor() {
        if (this._theme === `dark`) {
            return this.idItem.dark.color;
        }
        else {
            return this.idItem.light.color;
        }
    }
    get pwTextColor() {
        if (this._theme === `dark`) {
            return this.pwItem.dark.color;
        }
        else {
            return this.pwItem.light.color;
        }
    }
    get pw() {
        return this.pwItem;
    }
    get resolutionText() {
        if (this._theme === `dark`) {
            return this.resolutionTextItemDark;
        }
        else {
            return this.resolutionTextItemLight;
        }
    }
    get textField() {
        if (this._theme === `dark`) {
            return this.textFieldItemDark;
        }
        else {
            return this.textFieldItemLight;
        }
    }
    loginItem = {
        dark: {
            backgroundColor: `#21263a`,
            iconColor: `primary`,
            light: false,
        },
        light: {
            backgroundColor: `#ffffff`,
            iconColor: `#3086ff`,
            light: true,
        }
    }
    get loginItemBackgroundColor() {
        if (this._theme === `dark`) {
            return this.loginItem.dark.backgroundColor;
        }
        else {
            return this.loginItem.light.backgroundColor;
        }
    }
    get loginItemIconColor() {
        if (this._theme === `dark`) {
            return this.loginItem.dark.iconColor;
        }
        else {
            return this.loginItem.light.iconColor;
        }
    }
    get loginItemLight() {
        if (this._theme === `dark`) {
            return this.loginItem.dark.light;
        }
        else {
            return this.loginItem.light.light;
        }
    }
}