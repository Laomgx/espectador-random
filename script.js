const defaultChannel = 'nAts'; // Canal por defecto

async function getViewer(channel) {
    try {
        // Petición para obtener el estado del canal (si está en línea o no)
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
            headers: {
                'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5',
                'Authorization': 'Bearer z4gwn23tvxl0mhbdgpwyvct7ns5371'
            }
        });

        // Manejo de errores para la solicitud del estado del canal
        if (!response.ok) {
            const errorDetails = await response.json(); // Captura el cuerpo de la respuesta
            console.error('Error en la petición:', response.status, errorDetails);
            return `Error: ${errorDetails.message || 'Error desconocido'}`; // Muestra el mensaje de error
        }

        const data = await response.json();

        // Verificar si el canal está en línea
        if (data.data.length === 0) {
            return 'Offline'; // Si no está en vivo
        }

        // Petición para obtener los viewers del canal solo si está en vivo
        const viewerResponse = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
        
        // Manejo de errores para la solicitud de chatters
        if (!viewerResponse.ok) {
            const viewerErrorDetails = await viewerResponse.json(); // Captura el cuerpo de la respuesta
            console.error('Error en la petición de chatters:', viewerResponse.status, viewerErrorDetails);
            return `Error: ${viewerErrorDetails.message || 'Error desconocido'}`; // Muestra el mensaje de error
        }

        const viewerData = await viewerResponse.json();
        const viewers = viewerData.chatters.viewers;

        // Verificar si no hay viewers
        if (viewers.length === 0) {
            return 'No viewers'; // Si no hay viewers
        }

        // Seleccionar un viewer aleatorio
        const randomViewer = viewers[Math.floor(Math.random() * viewers.length)];

        // Asegurarse de que el nombre del viewer no supere los 400 caracteres
        return randomViewer.length > 400 ? randomViewer.substring(0, 400) : randomViewer;

    } catch (error) {
        console.error('Error:', error);
        return 'Error'; // Mensaje corto si hay un error
    }
}

// Configura la respuesta para cuando se acceda a la página
window.onload = async () => {
    const result = await getViewer(defaultChannel);
    
    // Limitar la longitud del texto que se muestra en la página a 400 caracteres o menos
    const finalResult = result.length > 400 ? result.substring(0, 400) : result;
    document.getElementById('result').innerText = finalResult; // Muestra el resultado en el div
};
