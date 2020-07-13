class Ajax {

    constructor() {

        this.data = {}

        this.ajax = function () {
            const request = new XMLHttpRequest();
            request.open("POST", "index.php");
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(this.objectToString(this.data));
        }

        this.objectToString = function (object) {
            let str = "";
            Object.keys(object).forEach(function (key) {
                str += key;
                str += `=${object[key]}&`;
            });
            return str;
        }
    }


}

