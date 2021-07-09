mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: mapCoordinates, // starting position [lng, lat]
        zoom:10 // starting zoom
        });

        const marker = new mapboxgl.Marker({color:"#000"})
        .setLngLat(mapCoordinates)
        .addTo(map);