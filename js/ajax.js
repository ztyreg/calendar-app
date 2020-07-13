class Ajax {

    constructor(data) {

        this.data = data;

        this.post = async function () {
            const response = await fetch('index.php', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(this.data)
            });

            let resData;
            resData = await response.json();
            return resData;
        }
    }

}

