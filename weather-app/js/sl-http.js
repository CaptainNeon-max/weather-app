class slhttp {
    async get(url) {
        const response = await fetch(url);
        if(response.ok) {
            const data = await response.json();
            return data;
        }
        return Promise.reject(`Error: ${response.status}`);
    }

    async post(url, data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            },
        }
        const response = await fetch(url, options);
        if(response.ok) {
            const data = await response.json();
            return data;
        }
        return Promise.reject(`Error: ${response.status}`);
    }

    async put(url, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            },
        }
        const response = await fetch(url, options);
        if(response.ok) {
            const data = await response.json();
            return data;
        }
        return Promise.reject(`Error: ${response.status}`);
    }

    async delete(url) {
        const options = {
            method: 'DELETE',
        }
        const response = await fetch(url, options);
        if(response.ok) {
            const data = await response.json();
            return data;    
        }
        return Promise.reject(`Error: ${response.status}`);
    }
}