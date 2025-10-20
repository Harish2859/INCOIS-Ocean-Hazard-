
import React, { useEffect, useRef } from 'react';
import { Post, AlertLevel, User, SafeShelter, MedicalCamp, RiskArea, RiskLevel, PostCategory } from '../types';

// Let TypeScript know that 'L' is in the global scope from the CDN script
declare var L: any;

type FilterState = {
  posts: boolean;
  shelters: boolean;
  camps: boolean;
  riskAreas: boolean;
};

type WeatherLayer = 'temp' | 'clouds' | 'precipitation' | null;

interface InteractiveMapProps {
  posts: Post[];
  users: User[];
  shelters: SafeShelter[];
  camps: MedicalCamp[];
  riskAreas: RiskArea[];
  filters: FilterState;
  center: [number, number];
  zoom: number;
  enableClustering?: boolean;
  selectedPostId?: string | null;
  onPopupClose?: () => void;
  isHeatmapVisible?: boolean;
  isCycloneVisible?: boolean;
  heatmapPosts?: Post[];
  bounds?: [[number, number], [number, number]];
  weatherLayer?: WeatherLayer;
}

const alertColors = {
  [AlertLevel.Critical]: '#EF4444',
  [AlertLevel.Warning]: '#FBBF24',
  [AlertLevel.Safe]: '#22C55E',
  [AlertLevel.Info]: '#3B82F6',
};

const alertLevelPriority: { [key in AlertLevel]: number } = {
  [AlertLevel.Critical]: 4,
  [AlertLevel.Warning]: 3,
  [AlertLevel.Info]: 2,
  [AlertLevel.Safe]: 1,
};

const riskLevelColors = {
  [RiskLevel.High]: '#EF4444', // red-500
  [RiskLevel.Medium]: '#FBBF24', // amber-400
  [RiskLevel.Low]: '#3B82F6', // blue-500
};

const postCategoryIcons: { [key in PostCategory]: string } = {
    [PostCategory.Tide]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3"><path d="M.5 7.5a.5.5 0 0 1 .5.5v1.28c0 .24.11.47.3.64l1.24 1.24a.5.5 0 0 0 .71-.7L1.5 9.41V8a.5.5 0 0 1 .5-.5ZM3.5 6a.5.5 0 0 1 .5.5v4.28c0 .24.11.47.3.64l1.24 1.24a.5.5 0 0 0 .71-.7L5.5 11.2V6.5a.5.5 0 0 1 .5-.5ZM6.5 4.5a.5.5 0 0 1 .5.5v6.28c0 .24.11.47.3.64l1.24 1.24a.5.5 0 0 0 .71-.7L8.5 11.7V5a.5.5 0 0 1 .5-.5ZM9.5 3a.5.5 0 0 1 .5.5v8.28c0 .24.11.47.3.64l1.24 1.24a.5.5 0 0 0 .71-.7L11.5 12.2V3.5a.5.5 0 0 1 .5-.5ZM12.5 1.5a.5.5 0 0 1 .5.5v10.28c0 .24.11.47.3.64l1.24 1.24a.5.5 0 0 0 .71-.7L14.5 13.2V2a.5.5 0 0 1 .5-.5Z" /></svg>`,
    [PostCategory.Debris]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.34l.435 5.22A2 2 0 0 0 5.518 12h5.054a2 2 0 0 0 1.993-1.28L13.01 5.5h.24a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75V4h-3V3.25Z" clip-rule="evenodd" /></svg>`,
    [PostCategory.Sighting]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /><path fill-rule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.56C2.213 6.39 4.7 4 8 4s5.788 2.39 6.62 3.72a.87.87 0 0 1 0 .56C13.787 9.61 11.3 12 8 12s-5.788-2.39-6.62-3.72ZM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clip-rule="evenodd" /></svg>`,
    [PostCategory.Official]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.663.293a.75.75 0 0 1 .428 1.317l-2.79 2.345.852 3.578a.75.75 0 0 1-1.11.822L8 11.533l-3.145 1.92a.75.75 0 0 1-1.11-.822l.852-3.578-2.79-2.345a.75.75 0 0 1 .428-1.317l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clip-rule="evenodd" /></svg>`,
    [PostCategory.Hazard]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M6.798 2.046a.75.75 0 0 1 1.404 0l6.25 10.5a.75.75 0 0 1-.602 1.204H1.15a.75.75 0 0 1-.602-1.204l6.25-10.5ZM8 8.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 8.25Zm0 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>`,
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ posts, users, shelters, camps, riskAreas, filters, center, zoom, enableClustering = false, selectedPostId, onPopupClose, isHeatmapVisible, isCycloneVisible, heatmapPosts, bounds, weatherLayer }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const dataLayerGroupRef = useRef<any>(null);
  const postMarkersRef = useRef<Map<string, any>>(new Map());
  const heatLayerRef = useRef<any>(null);
  const weatherLayerRef = useRef<any>(null);
  const cycloneMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, { scrollWheelZoom: true }).setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }
  }, [center, zoom]);

  useEffect(() => {
    if (!mapInstance.current) return;

    const iconCreateFunction = (cluster: any) => {
        const markers = cluster.getAllChildMarkers();
        const count = cluster.getChildCount();
        
        let highestAlertLevel: AlertLevel = AlertLevel.Safe;
        let maxPriority = 0;

        markers.forEach((marker: any) => {
            const post = marker.options.postData as Post;
            if (post && post.alertLevel && (alertLevelPriority[post.alertLevel] > maxPriority)) {
                maxPriority = alertLevelPriority[post.alertLevel];
                highestAlertLevel = post.alertLevel;
            }
        });
        
        const color = alertColors[highestAlertLevel] || alertColors[AlertLevel.Info];
        
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
        };

        const rgb = hexToRgb(color);
        const outerColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` : 'rgba(59, 130, 246, 0.5)';
        const innerColor = color;
        
        let size = 40;
        let fontSize = '14px';
        if (count >= 10) { size = 50; fontSize = '16px'; }
        if (count >= 100) { size = 60; fontSize = '18px'; }

        const html = `
          <div style="background-color: ${outerColor}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: ${innerColor}; width: ${size - 10}px; height: ${size - 10}px; border-radius: 50%; text-align: center; color: white; font-weight: bold; font-size: ${fontSize}; line-height: ${size - 10}px;">
              <span>${count}</span>
            </div>
          </div>`;

        return L.divIcon({
            html: html,
            className: 'custom-marker-cluster',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
        });
    };
    
    if (dataLayerGroupRef.current) {
      dataLayerGroupRef.current.clearLayers();
    } else {
      dataLayerGroupRef.current = enableClustering ? L.markerClusterGroup({ iconCreateFunction }) : L.layerGroup();
      mapInstance.current.addLayer(dataLayerGroupRef.current);
    }
    
    postMarkersRef.current.clear();
    const allMarkers: any[] = [];
    // FIX: Explicitly type the Map to ensure 'author' is correctly inferred as 'User' and not 'unknown'.
    const usersById = new Map<string, User>(users.map(user => [user.id, user]));
    
    if (filters.posts && !isHeatmapVisible) {
      posts.forEach(post => {
        const author = usersById.get(post.authorId);
        const categoryIcon = postCategoryIcons[post.category];
        const iconHtml = `<div class="relative"><div class="rounded-full shadow-lg bg-white p-0.5 flex items-center justify-center" style="border: 3px solid ${alertColors[post.alertLevel]};"><img src="${author?.avatar || ''}" alt="${post.author}" class="w-8 h-8 rounded-full object-cover"/></div><div class="absolute -bottom-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 border-2 border-white flex items-center justify-center">${categoryIcon}</div></div>`;
        const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [42, 42], iconAnchor: [21, 21], popupAnchor: [0, -21] });
        const popupContent = `<div class="w-64 -m-3 font-sans text-gray-800"><div class="p-3"><div class="flex items-center mb-3"><img src="${author?.avatar || ''}" alt="${post.author}" class="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" /><div><p class="font-bold text-sm">${post.author}</p><p class="text-xs text-gray-500">${post.location.name}</p></div></div><p class="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded-md border border-gray-200">${post.description}</p><div class="flex justify-between items-center text-xs"><span class="font-semibold capitalize px-2 py-0.5 rounded-full" style="background-color: ${alertColors[post.alertLevel]}20; color: ${alertColors[post.alertLevel]}">${post.alertLevel.toLowerCase()}</span><span class="text-gray-500">${new Date(post.timestamp).toLocaleDateString()}</span></div></div></div>`;
        const marker = L.marker([post.location.lat, post.location.lng], { icon: customIcon, postData: post }).bindPopup(popupContent);
        postMarkersRef.current.set(post.id, marker);
        allMarkers.push(marker);
      });
    }

    if (filters.shelters) {
      shelters.forEach(shelter => {
        const iconHtml = `<div class="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg></div>`;
        const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16] });
        const popupContent = `<div class="w-64 -m-3 p-3 font-sans text-gray-800"><div class="flex items-center pb-2 border-b border-gray-200 mb-2"><div class="bg-green-100 text-green-700 rounded-full p-2 mr-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 10.707V17.5a1.5 1.5 0 0 1-1.5 1.5h-3.5a1 1 0 0 1-1-1v-3.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1-1V18a1 1 0 0 1-1 1H3a1.5 1.5 0 0 1-1.5-1.5v-6.793a1 1 0 0 1 .293-.707l7-7Z" clip-rule="evenodd" /></svg></div><h3 class="font-bold text-base text-green-800">${shelter.name}</h3></div><ul class="space-y-2 text-sm text-gray-600"><li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-gray-400"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 0 0 .41-1.412A9.995 9.995 0 0 0 10 12a9.995 9.995 0 0 0-6.535 2.493Z" /></svg><strong>Capacity:</strong><span class="ml-auto">${shelter.capacity} people</span></li><li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-gray-400"><path fill-rule="evenodd" d="M4 1a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4ZM4 6a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4ZM4 11a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1H4ZM8.5 2A1.5 1.5 0 0 1 10 3.5v13A1.5 1.5 0 0 1 8.5 18H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4.5Zm4.25 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-1.5Z" clip-rule="evenodd" /></svg><strong>Operator:</strong><span class="ml-auto">${shelter.operator}</span></li><li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-gray-400"><path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5h-1.528a1.5 1.5 0 0 1-1.465-1.175l-.716-3.223a1.5 1.5 0 0 1 1.052-1.767l.933-.267c.41-.117.643-.555-.48-.95A8.542 8.542 0 0 1 12.02 4.02c-.395-.163-.833.07-.95.48l-.267.933a1.5 1.5 0 0 1-1.767 1.052l-3.223-.716A1.5 1.5 0 0 1 4.648 3.5H3.5Z" clip-rule="evenodd" /></svg><strong>Contact:</strong><span class="ml-auto">${shelter.contact}</span></li></ul></div>`;
        allMarkers.push(L.marker([shelter.location.lat, shelter.location.lng], { icon: customIcon }).bindPopup(popupContent));
      });
    }

    if (filters.camps) {
      camps.forEach(camp => {
        const iconHtml = `<div class="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" /></svg></div>`;
        const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16] });
        const popupContent = `<div class="w-64 -m-3 p-3 font-sans text-gray-800"><div class="flex items-center pb-2 border-b border-gray-200 mb-2"><div class="bg-red-100 text-red-700 rounded-full p-2 mr-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clip-rule="evenodd" /></svg></div><h3 class="font-bold text-base text-red-800">${camp.name}</h3></div><ul class="space-y-2 text-sm text-gray-600"><li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5"><path fill-rule="evenodd" d="M15.986 3.12a.75.75 0 0 1 1.06.018l.028.028A.75.75 0 0 1 17.06 4.25l-2.5 2.5a.75.75 0 1 1-1.06-1.06l2.5-2.5ZM10 2a.75.75 0 0 1 .75.75V5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2ZM4.25 17.06a.75.75 0 0 1-1.06-.018l-.028-.028a.75.75 0 0 1 .018-1.06l2.5-2.5a.75.75 0 1 1 1.06 1.06l-2.5 2.5ZM10 15a.75.75 0 0 1-.75.75V18a.75.75 0 0 1 1.5 0v-2.25A.75.75 0 0 1 10 15ZM3.138 4.232a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.06 0ZM5.75 10a.75.75 0 0 1-.75.75H2.75a.75.75 0 0 1 0-1.5H5a.75.75 0 0 1 .75.75Zm11.112-.018a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 0 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06ZM15 10a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H14.25a.75.75 0 0 1 .75.75Zm-5-5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" clip-rule="evenodd" /></svg><strong class="mr-2">Services:</strong><span class="text-right">${camp.services.join(', ')}</span></li><li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-gray-400"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" /></svg><strong>Timings:</strong><span class="ml-auto">${camp.timing}</span></li><li class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-gray-400"><path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5h-1.528a1.5 1.5 0 0 1-1.465-1.175l-.716-3.223a1.5 1.5 0 0 1 1.052-1.767l.933-.267c.41-.117.643-.555-.48-.95A8.542 8.542 0 0 1 12.02 4.02c-.395-.163-.833.07-.95.48l-.267.933a1.5 1.5 0 0 1-1.767 1.052l-3.223-.716A1.5 1.5 0 0 1 4.648 3.5H3.5Z" clip-rule="evenodd" /></svg><strong>Contact:</strong><span class="ml-auto">${camp.contact}</span></li></ul></div>`;
        allMarkers.push(L.marker([camp.location.lat, camp.location.lng], { icon: customIcon }).bindPopup(popupContent));
      });
    }

    if (filters.riskAreas) {
      riskAreas.forEach(area => {
        const color = riskLevelColors[area.riskLevel];
        const marker = L.circleMarker([area.location.lat, area.location.lng], { radius: 10, fillColor: color, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.8 });
        const popupContent = `<div class="w-64 -m-3 p-3 font-sans text-gray-800"><div class="flex items-center justify-between pb-2 border-b border-gray-200 mb-2"><h3 class="font-bold text-base" style="color: ${color}">${area.name}</h3><span class="px-2 py-0.5 text-xs font-bold text-white rounded-full" style="background-color: ${color};">${area.riskLevel}</span></div><p class="text-sm text-gray-600">${area.description}</p></div>`;
        marker.bindPopup(popupContent);
        allMarkers.push(marker);
      });
    }
    
    if (enableClustering) {
      // L.markerClusterGroup has a bulk `addLayers` method
      dataLayerGroupRef.current.addLayers(allMarkers);
    } else {
      // L.layerGroup requires adding layers one by one
      allMarkers.forEach(marker => {
        dataLayerGroupRef.current.addLayer(marker);
      });
    }

  }, [posts, users, shelters, camps, riskAreas, filters, enableClustering, isHeatmapVisible]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const dataForHeatmap = heatmapPosts || posts;
    if (isHeatmapVisible && dataForHeatmap.length > 0) {
      if (heatLayerRef.current) heatLayerRef.current.remove();
      const heatData = dataForHeatmap.map(p => [p.location.lat, p.location.lng, 1.0]);
      heatLayerRef.current = L.heatLayer(heatData, { radius: 25, blur: 15, maxZoom: 12 }).addTo(mapInstance.current);
    } else if (heatLayerRef.current) {
      heatLayerRef.current.remove();
      heatLayerRef.current = null;
    }
  }, [isHeatmapVisible, posts, heatmapPosts]);
  
  useEffect(() => {
    if (!mapInstance.current) return;
    if (weatherLayerRef.current) {
        weatherLayerRef.current.remove();
        weatherLayerRef.current = null;
    }
    if (weatherLayer) {
        // NOTE: OpenWeatherMap requires an API_KEY. Replace 'YOUR_API_KEY' with a valid key.
        const weatherUrl = `https://tile.openweathermap.org/map/${weatherLayer}_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY`;
        weatherLayerRef.current = L.tileLayer(weatherUrl, {
            attribution: 'Weather data &copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
            opacity: 0.6
        }).addTo(mapInstance.current);
    }
  }, [weatherLayer]);

  useEffect(() => {
    if (!mapInstance.current) return;

    if (isCycloneVisible) {
      if (cycloneMarkerRef.current) return;

      const cycloneIconSvg = `
        <svg width="120" height="120" viewBox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="blur-effect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
          </defs>
          <path d="M50 90 A 40 40 0 0 1 10 50" stroke="rgba(75, 85, 99, 0.9)" stroke-width="12" stroke-linecap="round" fill="none" filter="url(#blur-effect)"/>
          <path d="M10 50 A 40 40 0 0 1 50 10" stroke="rgba(107, 114, 128, 0.8)" stroke-width="11" stroke-linecap="round" fill="none" filter="url(#blur-effect)"/>
          <path d="M50 10 A 40 40 0 0 1 90 50" stroke="rgba(99, 102, 241, 0.7)" stroke-width="9" stroke-linecap="round" fill="none" filter="url(#blur-effect)"/>
          <path d="M90 50 A 40 40 0 0 1 50 90" stroke="rgba(139, 92, 246, 0.6)" stroke-width="8" stroke-linecap="round" fill="none" filter="url(#blur-effect)"/>
          <circle cx="50" cy="50" r="7" fill="rgba(209, 213, 219, 0.9)"/>
        </svg>`;

      const cycloneIcon = L.divIcon({
        html: cycloneIconSvg,
        className: 'cyclone-animation',
        iconSize: [120, 120],
        iconAnchor: [60, 60],
      });

      const cycloneCoords: [number, number] = [17.7, 83.5]; // Moved directly off the coast of Visakhapatnam
      const marker = L.marker(cycloneCoords, { icon: cycloneIcon, zIndexOffset: 1000, interactive: true });

      const popupContent = `
        <div class="w-64 -m-3 p-3 font-sans text-gray-800">
          <div class="flex items-center pb-2 border-b border-red-200 mb-2">
              <div class="bg-red-100 text-red-700 rounded-full p-2 mr-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M11.314 2.112a.75.75 0 0 1 1.061 0l6.363 6.364a.75.75 0 0 1-.53 1.28H2.793a.75.75 0 0 1-.53-1.28L8.628 2.112a.75.75 0 0 1 1.06-.001l1.626 1.626Zm-1.626 3.183L3.324 11.66a.75.75 0 0 0 .53 1.28h12.292a.75.75 0 0 0 .53-1.28L10.324 5.295a.75.75 0 0 0-1.06 0Zm-2.12 4.242a.75.75 0 0 1 1.06 0l2.122 2.121a.75.75 0 0 1-1.06 1.061l-2.122-2.12a.75.75 0 0 1 0-1.061Z" clip-rule="evenodd" /></svg></div>
              <h3 class="font-bold text-base text-red-800">Simulated Cyclone</h3>
          </div>
          <p class="text-sm text-gray-600">This is a visual simulation of a cyclone for demonstration purposes.</p>
        </div>`;
      marker.bindPopup(popupContent);

      marker.addTo(mapInstance.current);
      cycloneMarkerRef.current = marker;
    } else {
      if (cycloneMarkerRef.current) {
        cycloneMarkerRef.current.remove();
        cycloneMarkerRef.current = null;
      }
    }
  }, [isCycloneVisible]);

  useEffect(() => {
    if (bounds && mapInstance.current) {
        mapInstance.current.flyToBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds]);

  useEffect(() => {
    if (selectedPostId && postMarkersRef.current.has(selectedPostId) && mapInstance.current) {
        const marker = postMarkersRef.current.get(selectedPostId);
        const flyToAndOpen = () => {
            mapInstance.current.flyTo(marker.getLatLng(), 15);
            marker.openPopup();
        };

        if (enableClustering && dataLayerGroupRef.current.zoomToShowLayer) {
            dataLayerGroupRef.current.zoomToShowLayer(marker, flyToAndOpen);
        } else {
            flyToAndOpen();
        }

        if (onPopupClose) {
            marker.off('popupclose').on('popupclose', onPopupClose);
        }
    }
  }, [selectedPostId, onPopupClose, enableClustering]);

  return <div ref={mapContainer} className="w-full h-full z-0" />;
};

export default InteractiveMap;