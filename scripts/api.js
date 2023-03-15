const URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const TOKEN = "e99a28abd4bc7333269f663b20d9e590c7b62eb3";

export default async function getTooltips(query) {
    const options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + TOKEN
        },
        body: JSON.stringify({query: query})
    }
    
    try {
        const response = await fetch(URL, options);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error: ", error);
    }
}