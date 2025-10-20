import React, { useEffect, useRef } from 'react';
import { Post } from '../types';
import { indianStatesGeo } from '../data/indianStatesGeo';

declare var L: any;

interface StateInsetMapProps {
  posts: Post[];
  stateName: string;
}

const StateInsetMap: React.FC<StateInsetMapProps> = ({ posts, stateName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, {
        scrollWheelZoom: false,
        dragging: false,
        zoomControl: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        touchZoom: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: ''
      }).addTo(mapInstance.current);
    }
    
    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    }
  }, []);

  // Update map when data changes
  useEffect(() => {
    if (!mapInstance.current) return;
    
    // Find the state's GeoJSON data
    const stateGeoJsonFeature = (indianStatesGeo.features as any[]).find(
        (feature) => feature.properties.name === stateName
    );

    if (geoJsonLayerRef.current) {
        mapInstance.current.removeLayer(geoJsonLayerRef.current);
    }

    if (stateGeoJsonFeature) {
        // Create the GeoJSON layer with precise styling
        geoJsonLayerRef.current = L.geoJSON(stateGeoJsonFeature, { 
            style: {
                color: "#EF4444",      // Brighter red for more pop
                weight: 3,             // Thicker border
                fillOpacity: 0.15,     // More noticeable fill
                dashArray: '10, 5',    // Dashed line for emphasis
            }
        }).addTo(mapInstance.current);

        // Fit map to the exact bounds of the state outline
        mapInstance.current.fitBounds(geoJsonLayerRef.current.getBounds(), { padding: [10, 10] });
    }
    
    if (heatLayerRef.current) {
      mapInstance.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (posts && posts.length > 0) {
        const heatData = posts.map(p => [p.location.lat, p.location.lng, 1.0]);
        // Intensified heatmap
        heatLayerRef.current = L.heatLayer(heatData, { 
            radius: 35, 
            blur: 45,
            maxZoom: 12,
            gradient: {0.4: '#FBBF24', 0.8: '#F97316', 1: '#EF4444'} // Fiery: Amber -> Orange -> Red
        }).addTo(mapInstance.current);
    }

  }, [posts, stateName]);


  return <div ref={mapContainer} className="w-full h-64 rounded-lg" />;
};

export default StateInsetMap;
