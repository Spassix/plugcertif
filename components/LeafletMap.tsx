'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LeafletMapProps {
  plugs: any[]
  onMarkerClick: (plug: any) => void
}

export default function LeafletMap({ plugs, onMarkerClick }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    // Initialiser la carte
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [46.6034, 1.8883], // Centre de la France
        zoom: 6,
        zoomControl: true,
      })

      // Ajouter le tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    const map = mapRef.current

    // Nettoyer les anciens marqueurs
    markersRef.current.forEach((marker: L.Marker) => marker.remove())
    markersRef.current = []

    // Créer les marqueurs pour les plugs avec coordonnées
    const bounds: L.LatLngExpression[] = []

    plugs.forEach((plug: any) => {
      const lat = plug.location?.latitude
      const lng = plug.location?.longitude

      if (lat && lng) {
        const position: L.LatLngExpression = [lat, lng]
        bounds.push(position)

        // Créer une icône personnalisée
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              border: 3px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: white;
              "></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })

        const marker = L.marker(position, { icon: customIcon })
          .addTo(map)
          .bindPopup(`<strong>${plug.name}</strong><br/>${plug.location?.department || ''} ${plug.location?.postalCode || ''}`)

        marker.on('click', () => {
          onMarkerClick(plug)
        })

        markersRef.current.push(marker)
      }
    })

    // Ajuster la vue pour afficher tous les marqueurs
    if (bounds.length > 0) {
      map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50] })
    }

    return () => {
      // Nettoyage lors du démontage
      markersRef.current.forEach((marker: L.Marker) => marker.remove())
    }
  }, [plugs, onMarkerClick])

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 0 }} />
}

