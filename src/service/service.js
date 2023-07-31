class debug {
    constructor() {

    }
    prevtime() {
        return ''
    }
    currtime() {
        return ''
    }
    factoryid() {
        return 0;
    }
    boothid() {
        return 0;
    }
    zoneid() {
        return 0;
    }
    robotid() {
        return 0;
    }
    jobname() {
        return '';
    }
    axis() {
        return 0;
    }
}

class release {
    constructor() {

    }
    version = null;
    prevTime() {
        return '';
    }
    currTime() {
        return '';
    }
    getVersion() {
        return this.version;
    }
    setVersion(ver) {
        this.version = ver;
    }
}

class notify {
    constructor() {

    }
    notifyPush(msg) {
        if (Notification && Notification.permission === "granted") {
            let n = new Notification(msg, { tag: 'soManyNotification' });
        }
        else if (Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
                if (status === "granted") {
                    let n = new Notification(msg, { tag: 'soManyNotification' });
                }
                else {
                    console.log('');
                }
            });
        }
        else {
            console.log('');
        }
    }
}

class management {
    constructor(id, pw) {
        this.id = id;
        this.pw = pw;
    }
    adminMode(id, pw) {
        
    }
}

class user extends management {
    constructor() {
        super();
    }
    user = null;

    setUser(id) {
        this.user = id;
        return;
    }
    getUser() {
        return this.user;
    }
    eraseUser() {
        this.user = null;
        return;
    }
}

class shield extends management {
    constructor() {
        super();
    }
    encrypt(theText) {
        let output = new String;
        let temp = new Array();
        let temp2 = new Array();
        let textSize = theText.length;
        let rnd;
        for (let i = 0; i < textSize; i++) {
            rnd = Math.round(Math.random() * 122) + 68;
            temp[i] = theText.charCodeAt(i) + rnd;
            temp2[i] = rnd;
        }
        for (let i = 0; i < textSize; i++) {
            output += String.fromCharCode(temp[i], temp2[i]);
        }
        return output;
    }
    getbase64encode(plaintext){
        return Buffer.from(plaintext, "utf8").toString('base64');            
    }
}

const style = require('./style');

class Service extends management {
    constructor() {
        super();
    }
    styleHandle = new style.Style();
    getStyle() {
        return this.styleHandle;
    }
}

export const alarmNotify = new Map();

export { debug }
export { release }
export { notify }
export { shield }
export { user }
export { Service }