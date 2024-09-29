const defaultChannel = 'abad_aa'; // Canal por defecto

async function getViewer(channel) {
    try {
        // Petición para obtener el estado del canal (si está en línea o no)
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
            headers: {
                'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5',
                'Authorization': 'Bearer z4gwn23tvxl0mhbdgpwyvct7ns5371'
            }
        });

        const data = await response.json();

        // Verificar si el canal está en línea
        if (data.data.length === 0) {
            // Si no está en vivo, devolver un mensaje más claro
            return 'El canal no está transmitiendo en vivo';
        }

        // Petición para obtener los viewers del canal solo si está en vivo
        const viewerResponse = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
        const viewerData = await viewerResponse.json();
        const viewers = viewerData.chatters.viewers;

        // Verificar si no hay viewers
        if (viewers.length === 0) {
            return 'Sin viewers'; // Mensaje corto si no hay viewers
        }

        // Seleccionar un viewer aleatorio
        const randomViewer = viewers[Math.floor(Math.random() * viewers.length)];

        // Verificar si el nombre del viewer es muy largo (esto es raro, pero mejor prevenir)
        return randomViewer.length > 400 ? randomViewer.substring(0, 400) : randomViewer;

    } catch (error) {
        console.error('Error:', error);
        return 'Error'; // Mensaje corto si hay un error
    }
}

// Configura la respuesta para cuando se acceda a la página
window.onload = async () => {
    const result = await getViewer(defaultChannel);
    
    // Mostrar el resultado en la página
    document.body.innerText = result.length > 400 ? result.substring(0, 400) : result;
};
