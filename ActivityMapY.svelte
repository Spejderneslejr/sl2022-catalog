<script type="ts">
  import * as L from 'leaflet'
  import 'proj4leaflet'
  import { FeatureLayer } from 'esri-leaflet'
  import type { Activity } from '../store'

  export let activity: Activity

  let map

  function createMap(container) {
    // Make custom projection using proj4 and proj4leaflet
    const crs = new L.Proj.CRS('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs', {
      resolutions: [
        1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2,
      ],
      origin: [12.177261, 55.626132],
      bounds: L.bounds([120000, 5661139.2], [1378291.2, 6500000]),
    })

    // Make the map object using the custom projection
    let m = new L.Map(container, {
      crs: crs,
      center: [55.626132, 12.177261], // Set center location
      zoom: 8, // Set zoom level,
    })

    // Skærmkort [WMTS:topo_skaermkort]
    const topo = L.tileLayer
      .wms('https://services.kortforsyningen.dk/topo_skaermkort', {
        layers: 'dtk_skaermkort',
        token: 'b71a2284fab5d073b6a5f31d0e8e69cf',
        format: 'image/png',
        attribution: 'Kortforsyningen',
      })
      .addTo(m)

    if (activity.location.lat && activity.location.lon) {
      L.marker([activity.location.lat, activity.location.lon]).addTo(m)
    }

    const features = new FeatureLayer({
      url: 'https://services3.arcgis.com/xM7TBEkeCBbfcxXh/arcgis/rest/services/Omr%C3%A5der_Off/FeatureServer/0',
      //pane: 'Aktivitet',
      style: (feature) => {
        console.log(feature)
        return {
          color: '#000',
          width: 1,
        }
      },
    })

    features.addTo(m)

    return m
  }

  function mapAction(container) {
    map = createMap(container)
    return {
      destroy: () => {
        map.remove()
      },
    }
  }
</script>

<div class="mt-4 w-full md:w-1/2 h-96" use:mapAction />
