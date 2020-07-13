class Ajax {

    constructor() {
    }

    static async post(data) {
        const response = await fetch('index.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let resData;
        resData = await response.json();
        return resData;
    }

}

