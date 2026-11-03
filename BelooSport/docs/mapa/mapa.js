document.addEventListener('DOMContentLoaded', () => {

    // BANCO DE DADOS SIMULADO
    const locaisEsportivos = [
        {
            nome: "Pista de Skate do Ócio (Bairro Floresta)",
            esporte: "Skate",
            lat: -19.9125,
            lng: -43.9280,
            descricao: "Pista pública para prática de skate street e bowl em BH."
        },
        {
            nome: "Praça do Papa (Mangabeiras)",
            esporte: "Skate / Slackline",
            lat: -19.9554,
            lng: -43.9142,
            descricao: "Espaço amplo ao ar livre com grupos praticantes aos fins de semana."
        },
        {
            nome: "Serra da Piedade (Caeté - RM)",
            esporte: "Escalada / Trekking",
            lat: -19.8183,
            lng: -43.6781,
            descricao: "Ponto de escalada e esportes de aventura na Região Metropolitana."
        }
    ];

    // Coordenadas centrais de Belo Horizonte
    const centroBH = [-19.9167, -43.9345];

    // Inicializa o mapa do Leaflet na div#mapa
    const mapa = L.map('mapa').setView(centroBH, 11);

    // Servidor de mapas
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
        maxZoom: 18
    }).addTo(mapa);

    // Percorre a lista e insere os marcadores com popup informativo
    locaisEsportivos.forEach(local => {
        L.marker([local.lat, local.lng])
            .addTo(mapa)
            .bindPopup(`
                <div>
                    <h3>${local.nome}</h3>
                    <p><strong>Esporte:</strong> ${local.esporte}</p>
                    <p>${local.descricao}</p>
                </div>
            `);
    });
});