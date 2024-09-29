const defaultChannel = 'abad_aa'; // Canal por defecto

async function getViewer(channel) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
            headers: {
                'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5',
                'Authorization': 'Bearer z4gwn23tvxl0mhbdgpwyvct7ns5371' // Asegúrate de que "Bearer" esté presente
            }
        });

        const data = await response.json();
        if (data.data.length === 0) {
            return 'El canal no está en línea o no existe.';
        }

        const viewerResponse = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
        const viewerData = await viewerResponse.json();
        const viewers = viewerData.chatters.viewers;

        if (viewers.length === 0) {
            return 'No hay viewers disponibles.';
        }

        const randomViewer = viewers[Math.floor(Math.random() * viewers.length)];
        return `Viewer Aleatorio: ${randomViewer}`;
    } catch (error) {
        console.error('Error:', error);
        return 'Hubo un error al obtener los datos.';
    }
}

// Configura la respuesta para cuando se acceda a la página
window.onload = async () => {
    const result = await getViewer(defaultChannel);
    document.body.innerText = result; // Muestra el resultado en el cuerpo del documento
};
