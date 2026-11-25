document.addEventListener('DOMContentLoaded', () => {
  const containerMapa = document.getElementById('mapa');
  if (!containerMapa) return;

  const locaisEsportivos = [
    // FLAG FOOTBALL
    {
      categoria: "flag",
      nome: "Locomotiva Flag — Centro Esportivo Universo",
      esporte: "Flag Football",
      lat: -19.8926902,
      lng: -43.9344225,
      descricao: "Rua Botucatu, 207 - Nova Floresta / Renascença, Belo Horizonte"
    },
    {
      categoria: "flag",
      nome: "BH Wolves — CTE UFMG",
      esporte: "Flag Football",
      lat: -19.8685165,
      lng: -43.9759167,
      descricao: "Av. Alfredo Camarate, 617 - São Luiz, Belo Horizonte"
    },

    // FUTEBOL AMERICANO
    {
      categoria: "futebol-americano",
      nome: "Locomotiva FA — Centro Esportivo Universo",
      esporte: "Futebol Americano",
      lat: -19.8926902,
      lng: -43.9344225,
      descricao: "Rua Botucatu, 207 - Nova Floresta / Renascença, Belo Horizonte"
    },
    {
      categoria: "futebol-americano",
      nome: "Cruzeiro FA — Campo do Cruz Azul",
      esporte: "Futebol Americano",
      lat: -19.9358333,
      lng: -44.0561111,
      descricao: "Eldorado / Novo Eldorado, Contagem - MG"
    },
    {
      categoria: "futebol-americano",
      nome: "Galo FA — Vila Olímpica",
      esporte: "Futebol Americano",
      lat: -19.8276180,
      lng: -43.9541490,
      descricao: "Av. Pedro I, 2676 - São João Batista, Belo Horizonte"
    },

    // ESCALADA
    {
      categoria: "escalada",
      nome: "ROKAZ Escalada",
      esporte: "Escalada",
      lat: -19.9389100,
      lng: -43.9325200,
      descricao: "R. Antônio de Albuquerque, 189 - Funcionários, Belo Horizonte"
    },
    {
      categoria: "escalada",
      nome: "Das Pedras - Escalada em BH",
      esporte: "Escalada",
      lat: -19.9451618,
      lng: -43.9423593,
      descricao: "R. Cristina, 1318 - Santo Antônio, Belo Horizonte"
    },
    {
      categoria: "escalada",
      nome: "Up Escalada",
      esporte: "Escalada",
      lat: -19.9778428,
      lng: -43.9737845,
      descricao: "Av. Deputado Cristovam Chiaradia, 155 - Buritis, Belo Horizonte"
    },

    // ESGRIMA
    {
      categoria: "esgrima",
      nome: "Porta di Ferro Esgrima Histórica",
      esporte: "Esgrima",
      lat: -19.8558000,
      lng: -43.9332000,
      descricao: "Av. Sebastião de Brito, 255 - Dona Clara, Belo Horizonte"
    },
    {
      categoria: "esgrima",
      nome: "Esgrima Rapier",
      esporte: "Esgrima",
      lat: -19.9454000,
      lng: -43.9325300,
      descricao: "Rua Passa Tempo, 562/301 - Carmo, Belo Horizonte"
    },
    {
      categoria: "esgrima",
      nome: "Romão Gomes Esgrima (Círculo Militar de BH)",
      esporte: "Esgrima",
      lat: -19.9369278,
      lng: -43.9538854,
      descricao: "Av. Raja Gabáglia, 350 - Gutierrez, Belo Horizonte"
    },

    // ULTIMATE FRISBEE
    {
      categoria: "frisbee",
      nome: "Uai Guarás Frisbee — Parque Ecológico da Pampulha",
      esporte: "Ultimate Frisbee",
      lat: -19.8528040,
      lng: -43.9950000,
      descricao: "Parque Ecológico da Pampulha - Portaria II, Belo Horizonte"
    }
  ];

  const filtroEsporte = containerMapa.dataset.esporte;
  const locaisFiltrados = filtroEsporte
    ? locaisEsportivos.filter(local => local.categoria === filtroEsporte)
    : locaisEsportivos;

  const camadaMapa = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  });

  const camadaSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19
  });

  const centroBH = [-19.9167, -43.9345];
  const mapa = L.map('mapa', {
    center: centroBH,
    zoom: 13,
    layers: [camadaMapa]
  });

  L.control.layers({
    "Mapa Detalhado": camadaMapa,
    "Satélite": camadaSatelite
  }).addTo(mapa);

  const marcadores = [];

  locaisFiltrados.forEach(local => {
    const marker = L.marker([local.lat, local.lng])
      .addTo(mapa)
      .bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 4px; color: #133820; font-size: 14px; font-weight: 700;">${local.nome}</h3>
          <p style="margin: 0 0 6px; font-size: 12px; color: #1D4E2E;"><strong>${local.esporte}</strong></p>
          <p style="margin: 0; font-size: 12px; color: #52525B;">${local.descricao}</p>
        </div>
      `);

    marker.on('click', () => {
      mapa.flyTo(marker.getLatLng(), 18, { duration: 0.8 });
    });

    marcadores.push(marker);
  });

  if (marcadores.length === 1) {
    mapa.setView(marcadores[0].getLatLng(), 17);
    marcadores[0].openPopup();
  } else if (marcadores.length > 1) {
    const grupo = new L.featureGroup(marcadores);
    mapa.fitBounds(grupo.getBounds().pad(0.25));
  }
});