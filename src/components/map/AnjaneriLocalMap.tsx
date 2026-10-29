import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Compass,
  RotateCcw,
  Globe,
  ArrowRight,
  Mountain,
  ZoomIn,
  ZoomOut,
  Navigation,
  Clock,
  Coins,
  ShieldCheck,
  Radio,
  CheckCircle2,
  AlertCircle,
  Eye,
  CreditCard,
  Layers,
  Crosshair,
} from 'lucide-react';

interface AnjaneriLocalMapProps {
  onBackToGlobe?: () => void;
  onOpenBookingModal?: (
    trekId: string,
    customPrice?: number,
    travelOrigin?: string,
    travelDistanceKm?: number
  ) => void;
}

// Real verified geographic locations in and around Anjaneri Hills, Nashik
export const REAL_ANJANERI_LOCATIONS = [
  {
    id: 'base-village',
    name: 'Anjaneri Base Village (Trailhead)',
    type: 'START',
    lat: 19.9315,
    lng: 73.5712,
    altitude: 594,
    altitudeStr: '594 m (1,950 ft)',
    desc: 'Main trailhead off Nashik-Trimbakeshwar Highway with vehicle parking, guide outpost, and water wells.',
  },
  {
    id: 'highway-junction',
    name: 'Nashik-Trimbak Highway Jn (NH-848)',
    type: 'START',
    lat: 19.9360,
    lng: 73.5680,
    altitude: 580,
    altitudeStr: '580 m (1,900 ft)',
    desc: 'Highway entrance road to Anjaneri village (40 mins drive from Nashik CBS).',
  },
  {
    id: 'trimbak-base',
    name: 'Trimbakeshwar Jyotirlinga Base',
    type: 'START',
    lat: 19.9320,
    lng: 73.5310,
    altitude: 600,
    altitudeStr: '600 m (1,970 ft)',
    desc: 'Historic temple town located 6.5 km west of Anjaneri Hills.',
  },
  {
    id: 'nashik-city',
    name: 'Nashik City (CBS Central)',
    type: 'START',
    lat: 19.9975,
    lng: 73.7898,
    altitude: 560,
    altitudeStr: '560 m (1,837 ft)',
    desc: 'Urban transit hub 22 km east of the Anjaneri trailhead.',
  },
  {
    id: 'jain-caves',
    name: '12th Century Rock-Cut Jain Caves',
    type: 'WAYPOINT',
    lat: 19.9275,
    lng: 73.5732,
    altitude: 792,
    altitudeStr: '792 m (2,600 ft)',
    desc: 'Ancient carved pillars, Jain Tirthankara reliefs, and perennial cold water cisterns along the cliff steps.',
  },
  {
    id: 'plateau-ridge',
    name: 'Mid Plateau Ridge Lookout',
    type: 'WAYPOINT',
    lat: 19.9255,
    lng: 73.5758,
    altitude: 1020,
    altitudeStr: '1,020 m (3,346 ft)',
    desc: 'Panoramic viewpoint overlooking the Trimbakeshwar valley and lower basalt amphitheater.',
  },
  {
    id: 'footprint-lake',
    name: 'Perennial Footprint Plateau Lake',
    type: 'DESTINATION',
    lat: 19.9245,
    lng: 73.5765,
    altitude: 1158,
    altitudeStr: '1,158 m (3,800 ft)',
    desc: 'Divine plateau reservoir naturally contoured in the shape of a sacred footprint, surrounded by endemic wildflowers.',
  },
  {
    id: 'summit-temple',
    name: 'Anjaneri Summit Hanuman Temple (Peak)',
    type: 'DESTINATION',
    lat: 19.9213,
    lng: 73.5714,
    altitude: 1280,
    altitudeStr: '1,280 m (4,200 ft)',
    desc: 'Sacred birthplace of Lord Hanuman with the ancient Anjani Mata shrine at the highest Sahyadri plateau point.',
  },
];

// Verified trail coordinates
const REAL_TRAIL_COORDINATES: [number, number][] = [
  [19.9360, 73.5680], // Highway Jn
  [19.9315, 73.5712], // Base Village Trailhead
  [19.9288, 73.5725], // Stone steps approach
  [19.9275, 73.5732], // 12th C. Jain Caves
  [19.9262, 73.5746], // Cliff stairway
  [19.9255, 73.5758], // Plateau Ridge
  [19.9245, 73.5765], // Footprint Lake
  [19.9228, 73.5738], // Upper plateau saddle
  [19.9213, 73.5714], // Summit Temple Peak
];

// Haversine formula for distance in kilometers
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Calculate dynamic expedition package price based on traveling distance
function calculatePriceByDistance(distanceKm: number): {
  baseTrekFee: number;
  transitFee: number;
  totalPerPerson: number;
  transitDescription: string;
} {
  const baseTrekFee = 850;
  let transitFee = 0;
  let transitDescription = 'On-foot trailhead start (No transit)';

  if (distanceKm <= 5.0) {
    transitFee = 0;
    transitDescription = 'Trailhead on-foot (Local)';
  } else if (distanceKm <= 10.0) {
    transitFee = 100;
    transitDescription = 'Trimbak local shuttle transit';
  } else if (distanceKm <= 35.0) {
    transitFee = 150;
    transitDescription = 'Nashik CBS express shuttle transit';
  } else if (distanceKm <= 100.0) {
    transitFee = 350;
    transitDescription = 'Regional shared cab transit';
  } else {
    transitFee = Math.round(distanceKm * 3.2);
    transitDescription = `Long-distance highway transit (${Math.round(distanceKm)} km)`;
  }

  return {
    baseTrekFee,
    transitFee,
    totalPerPerson: baseTrekFee + transitFee,
    transitDescription,
  };
}

export const AnjaneriLocalMap: React.FC<AnjaneriLocalMapProps> = ({
  onBackToGlobe,
  onOpenBookingModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const activeRoutePolylineRef = useRef<L.Polyline | null>(null);
  const glowPolylineRef = useRef<L.Polyline | null>(null);

  // Live GPS tracking refs
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const gpsAccuracyCircleRef = useRef<L.Circle | null>(null);
  const watchPositionIdRef = useRef<number | null>(null);

  // Layer state
  const [activeTileType, setActiveTileType] = useState<'streets' | 'topo' | 'satellite'>('streets');

  // Real location & destination
  const [startLocationId, setStartLocationId] = useState<string>('base-village');
  const [destinationId, setDestinationId] = useState<string>('summit-temple');
  const [useGpsAsStart, setUseGpsAsStart] = useState<boolean>(false);

  // Live GPS Tracking state
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Fast, Crystal-Clear Map Tile Providers (with Retina support enabled)
  const tileProviders = {
    streets: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 20,
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap &copy; OpenStreetMap contributors',
      maxZoom: 17,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Esri World Imagery &bull; USGS, DigitalGlobe',
      maxZoom: 19,
    },
  };

  const selectedPresetLoc =
    REAL_ANJANERI_LOCATIONS.find((l) => l.id === startLocationId) || REAL_ANJANERI_LOCATIONS[0];
  const destLoc =
    REAL_ANJANERI_LOCATIONS.find((l) => l.id === destinationId) || REAL_ANJANERI_LOCATIONS[7];

  // Effective departure coordinates (GPS or selected preset)
  const effectiveStart =
    useGpsAsStart && gpsCoords
      ? {
          name: `My Live GPS (${gpsCoords.lat.toFixed(4)}°, ${gpsCoords.lng.toFixed(4)}°)`,
          lat: gpsCoords.lat,
          lng: gpsCoords.lng,
          altitude: 600,
          altitudeStr: 'Live Elevation ~600m',
        }
      : selectedPresetLoc;

  const travelingDistanceKm = calculateHaversineKm(
    effectiveStart.lat,
    effectiveStart.lng,
    destLoc.lat,
    destLoc.lng
  );

  const priceDetails = calculatePriceByDistance(travelingDistanceKm);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.9260, 73.5735],
      zoom: 14,
      zoomControl: false,
      scrollWheelZoom: true,
      preferCanvas: true,
    });
    mapInstanceRef.current = map;

    const provider = tileProviders.streets;
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      detectRetina: true,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Base Trail Spine Line
    L.polyline(REAL_TRAIL_COORDINATES, {
      color: '#000000',
      weight: 3.5,
      opacity: 0.35,
      dashArray: '5, 7',
    }).addTo(map);

    // Add Real Landmark Markers
    REAL_ANJANERI_LOCATIONS.forEach((loc) => {
      const isSummit = loc.id === 'summit-temple';
      const isBase = loc.id === 'base-village';
      const isCave = loc.id === 'jain-caves';
      const isLake = loc.id === 'footprint-lake';

      const bgColor = isSummit ? '#FFC800' : isBase ? '#10B981' : isLake ? '#0284C7' : isCave ? '#EA580C' : '#000000';
      const textColor = isSummit || isBase ? '#000000' : '#FFFFFF';
      const symbol = isSummit ? '★' : isBase ? '▲' : isLake ? '💧' : isCave ? '🏛️' : '•';

      const iconHtml = `
        <div style="
          width: ${isSummit ? '34px' : isBase ? '32px' : '28px'};
          height: ${isSummit ? '34px' : isBase ? '32px' : '28px'};
          background-color: ${bgColor};
          color: ${textColor};
          border: 2.5px solid #000000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: ${isSummit || isBase ? '13px' : '11px'};
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          cursor: pointer;
        ">
          ${symbol}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'real-loc-pin',
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      marker.bindTooltip(
        `<div style="font-family:sans-serif; font-size:11px; padding:2px;">
          <b>${loc.name}</b><br/>
          <span style="color:#D79700; font-weight:bold;">${loc.altitudeStr}</span><br/>
          <span style="color:#666; font-size:10px;">${loc.lat.toFixed(4)}° N, ${loc.lng.toFixed(4)}° E</span>
        </div>`,
        { direction: 'top', offset: [0, -12] }
      );

      marker.on('click', () => {
        setDestinationId(loc.id);
      });
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Dynamic Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let routeSegments: [number, number][] = [];

    if (useGpsAsStart && gpsCoords) {
      // Direct route from Live GPS coords to base trailhead, then up to summit
      routeSegments = [
        [gpsCoords.lat, gpsCoords.lng],
        [19.9315, 73.5712],
        [destLoc.lat, destLoc.lng],
      ];
    } else {
      const sIndex = REAL_TRAIL_COORDINATES.findIndex(
        (pt) => Math.abs(pt[0] - effectiveStart.lat) < 0.005 && Math.abs(pt[1] - effectiveStart.lng) < 0.005
      );
      const dIndex = REAL_TRAIL_COORDINATES.findIndex(
        (pt) => Math.abs(pt[0] - destLoc.lat) < 0.005 && Math.abs(pt[1] - destLoc.lng) < 0.005
      );

      if (sIndex !== -1 && dIndex !== -1) {
        if (sIndex <= dIndex) {
          routeSegments = REAL_TRAIL_COORDINATES.slice(sIndex, dIndex + 1);
        } else {
          routeSegments = REAL_TRAIL_COORDINATES.slice(dIndex, sIndex + 1).reverse();
        }
      } else {
        routeSegments = [
          [effectiveStart.lat, effectiveStart.lng],
          [19.9315, 73.5712],
          [destLoc.lat, destLoc.lng],
        ];
      }
    }

    if (activeRoutePolylineRef.current) map.removeLayer(activeRoutePolylineRef.current);
    if (glowPolylineRef.current) map.removeLayer(glowPolylineRef.current);

    glowPolylineRef.current = L.polyline(routeSegments, {
      color: '#000000',
      weight: 8,
      opacity: 0.5,
      lineCap: 'round',
    }).addTo(map);

    activeRoutePolylineRef.current = L.polyline(routeSegments, {
      color: '#FFC800',
      weight: 5,
      opacity: 1,
      dashArray: '8, 8',
      lineCap: 'round',
    }).addTo(map);

    try {
      const bounds = L.latLngBounds(routeSegments);
      map.flyToBounds(bounds, { padding: [65, 65], duration: 1.2 });
    } catch {}
  }, [startLocationId, destinationId, useGpsAsStart, gpsCoords, effectiveStart, destLoc]);

  // Toggle Real Live GPS Tracking
  const toggleLiveGps = () => {
    if (isGpsActive) {
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
        watchPositionIdRef.current = null;
      }
      if (gpsMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
        gpsMarkerRef.current = null;
      }
      if (gpsAccuracyCircleRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(gpsAccuracyCircleRef.current);
        gpsAccuracyCircleRef.current = null;
      }
      setIsGpsActive(false);
      setGpsCoords(null);
      setGpsError(null);
      setUseGpsAsStart(false);
    } else {
      if (!navigator.geolocation) {
        setGpsError('Geolocation is not supported by your browser.');
        return;
      }

      setGpsError(null);
      setIsGpsActive(true);

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setGpsCoords({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy) });

          const map = mapInstanceRef.current;
          if (!map) return;

          const gpsIcon = L.divIcon({
            className: 'live-gps-beacon',
            html: `
              <div style="position:relative; width:26px; height:26px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:26px; height:26px; background-color:#38BDF8; border-radius:50%; opacity:0.6; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                <div style="width:14px; height:14px; background-color:#0284C7; border:2.5px solid #FFFFFF; border-radius:50%; box-shadow:0 0 10px rgba(2,132,199,0.9);"></div>
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });

          if (!gpsMarkerRef.current) {
            gpsMarkerRef.current = L.marker([latitude, longitude], { icon: gpsIcon }).addTo(map);
            gpsMarkerRef.current.bindTooltip('<b>Your Live GPS Location</b>', { direction: 'top' });

            gpsAccuracyCircleRef.current = L.circle([latitude, longitude], {
              radius: accuracy,
              color: '#0284C7',
              weight: 1.5,
              fillColor: '#38BDF8',
              fillOpacity: 0.15,
            }).addTo(map);
          } else {
            gpsMarkerRef.current.setLatLng([latitude, longitude]);
            if (gpsAccuracyCircleRef.current) {
              gpsAccuracyCircleRef.current.setLatLng([latitude, longitude]);
              gpsAccuracyCircleRef.current.setRadius(accuracy);
            }
          }
        },
        (err) => {
          console.warn('GPS error:', err.message);
          setGpsError(err.message || 'Unable to retrieve GPS signal.');
          setGpsCoords({ lat: 19.9315, lng: 73.5712, accuracy: 10 });
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
      );

      watchPositionIdRef.current = watchId;
    }
  };

  const changeTileLayer = (type: 'streets' | 'topo' | 'satellite') => {
    setActiveTileType(type);
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const provider = tileProviders[type];
    const newLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      detectRetina: true,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  };

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([19.9260, 73.5735], 14, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[680px] rounded-[32px] overflow-hidden border-4 border-black shadow-2xl bg-[#FED547] select-none">
      {/* Leaflet Map DOM Mount */}
      <div
        ref={mapContainerRef}
        className="w-full h-full focus:outline-none"
        title="Interactive Anjaneri Hills Local Map: Location to Destination route navigation with live GPS"
      />

      {/* Top Left Header & Real Coordinates */}
      <div className="absolute top-4 left-4 z-[500] pointer-events-none">
        <h3 className="font-heading text-3xl sm:text-4xl text-black leading-none drop-shadow-sm">
          ANJANERI<br />LOCAL MAP
        </h3>
        <p className="text-xs uppercase font-extrabold tracking-widest text-neutral-900 mt-1">
          Real Geographic Coordinates &bull; 19.9213° N, 73.5714° E
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-black/85 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
          <Mountain className="w-3.5 h-3.5 text-brand-primaryYellow" />
          <span>Real Elevation: 1,280 m Peak &bull; Trimbakeshwar Range, Nashik</span>
        </div>
      </div>

      {/* Top Right: Layer Switcher & Live GPS Toggle */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2 items-end">
        {onBackToGlobe && (
          <button
            onClick={onBackToGlobe}
            className="px-3.5 py-1.5 bg-black hover:bg-neutral-900 text-brand-primaryYellow rounded-full shadow-lg text-xs font-extrabold flex items-center gap-1.5 transition transform hover:scale-105 border border-brand-primaryYellow/40"
            title="Return to 3D Earth Globe"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Earth Globe</span>
          </button>
        )}

        {/* Live GPS Tracking Button */}
        <button
          onClick={toggleLiveGps}
          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-2 shadow-lg transition border-2 ${
            isGpsActive
              ? 'bg-emerald-600 text-white border-white animate-pulse'
              : 'bg-white/95 text-black border-black hover:bg-neutral-100'
          }`}
          title="Toggle Continuous Real GPS Tracking"
        >
          <Radio className={`w-3.5 h-3.5 ${isGpsActive ? 'text-white' : 'text-emerald-600'}`} />
          <span>{isGpsActive ? 'Live GPS: TRACKING' : 'Enable Live GPS Tracking'}</span>
        </button>

        {/* Tile Provider Pill Switcher */}
        <div className="flex bg-white/95 p-1 rounded-full border-2 border-black shadow-md">
          <button
            onClick={() => changeTileLayer('streets')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
              activeTileType === 'streets'
                ? 'bg-black text-brand-primaryYellow shadow'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            Clear Map
          </button>
          <button
            onClick={() => changeTileLayer('topo')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
              activeTileType === 'topo'
                ? 'bg-black text-brand-primaryYellow shadow'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            Contours
          </button>
          <button
            onClick={() => changeTileLayer('satellite')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
              activeTileType === 'satellite'
                ? 'bg-black text-brand-primaryYellow shadow'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex gap-1.5">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 bg-black/85 hover:bg-black text-white rounded-full shadow-md transition border border-neutral-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-brand-primaryYellow" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 bg-black/85 hover:bg-black text-white rounded-full shadow-md transition border border-neutral-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-brand-primaryYellow" />
          </button>
          <button
            onClick={resetView}
            className="p-2 bg-black/85 hover:bg-black text-white rounded-full shadow-md transition border border-neutral-700"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4 text-brand-primaryYellow" />
          </button>
        </div>
      </div>

      {/* Floating Navigator Card: Real Location, Destination, TIME & COST HUD */}
      <div className="absolute top-24 left-4 z-[500] max-w-xs sm:max-w-sm w-full bg-white/95 backdrop-blur-md border-3 border-black rounded-3xl p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-brand-orange" />
            <span>Trail Navigator &bull; Real Telemetry</span>
          </span>
          <span className="text-[10px] bg-brand-primaryYellow px-2 py-0.5 rounded-full font-extrabold text-black">
            Verified Route
          </span>
        </div>

        {/* 1. Start Location Input with GPS Toggle */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-extrabold uppercase text-neutral-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Location (Departure Point)</span>
            </label>
            {isGpsActive && (
              <button
                type="button"
                onClick={() => setUseGpsAsStart(!useGpsAsStart)}
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border transition flex items-center gap-1 ${
                  useGpsAsStart
                    ? 'bg-sky-600 text-white border-sky-800'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-black'
                }`}
              >
                <Crosshair className="w-2.5 h-2.5" />
                <span>{useGpsAsStart ? 'Using My GPS' : 'Use My GPS'}</span>
              </button>
            )}
          </div>

          {!useGpsAsStart ? (
            <select
              value={startLocationId}
              onChange={(e) => setStartLocationId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-neutral-300 focus:border-black text-xs font-semibold bg-white shadow-sm"
            >
              {REAL_ANJANERI_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.altitudeStr})
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 bg-sky-50 border-2 border-sky-400 rounded-xl text-xs font-bold text-sky-900 flex items-center justify-between">
              <span>My Live GPS Coordinates</span>
              <span className="font-mono text-[11px] text-sky-700">
                {gpsCoords ? `${gpsCoords.lat.toFixed(4)}°, ${gpsCoords.lng.toFixed(4)}°` : 'Detecting...'}
              </span>
            </div>
          )}
        </div>

        {/* 2. Destination Input */}
        <div>
          <label className="text-[10px] font-extrabold uppercase text-neutral-700 flex items-center gap-1 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Destination (Reach Destination)</span>
          </label>
          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border-2 border-neutral-300 focus:border-black text-xs font-semibold bg-white shadow-sm"
          >
            {REAL_ANJANERI_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.altitudeStr})
              </option>
            ))}
          </select>
        </div>

        {/* PROMINENT TIME & COST HUD CARD WITH DISTANCE BREAKDOWN */}
        <div className="bg-amber-50/90 rounded-2xl p-3 border-2 border-black space-y-2">
          {/* Distance & Transit breakdown */}
          <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
              <Navigation className="w-3.5 h-3.5 text-brand-orange" />
              <span>Traveling Distance:</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-black block">{travelingDistanceKm} km</span>
              <span className="text-[10px] text-neutral-600 block">{priceDetails.transitDescription}</span>
            </div>
          </div>

          {/* Time Display */}
          <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
              <Clock className="w-3.5 h-3.5 text-brand-orange" />
              <span>Time Needed:</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-black block">2h 45m summit hike</span>
              <span className="text-[10px] text-neutral-600">(3-4 hrs roundtrip)</span>
            </div>
          </div>

          {/* Cost as per distance */}
          <div className="flex items-center justify-between pb-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
              <Coins className="w-3.5 h-3.5 text-brand-orange" />
              <span>Expedition Amount:</span>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-brand-orange">
                ₹{priceDetails.totalPerPerson}
              </span>
              <span className="text-[9px] text-neutral-600 block">
                (₹{priceDetails.baseTrekFee} Trek + ₹{priceDetails.transitFee} Transit)
              </span>
            </div>
          </div>
        </div>

        {/* Live GPS Coordinates Telemetry (if GPS active) */}
        {isGpsActive && gpsCoords && (
          <div className="bg-sky-50 border border-sky-300 rounded-xl p-2.5 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-sky-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>Live GPS Active</span>
              </span>
              <span className="text-[10px] text-sky-700 font-mono">&plusmn;{gpsCoords.accuracy}m</span>
            </div>
            <p className="text-[10px] text-sky-800 font-mono">
              {gpsCoords.lat.toFixed(5)}&deg; N, {gpsCoords.lng.toFixed(5)}&deg; E
            </p>
          </div>
        )}

        {/* Verified Expedition Booking with Razorpay Button */}
        <button
          onClick={() => {
            if (onOpenBookingModal) {
              onOpenBookingModal(
                'trek-anjeneri-hills',
                priceDetails.totalPerPerson,
                effectiveStart.name,
                travelingDistanceKm
              );
            }
          }}
          className="w-full py-2.5 px-4 bg-brand-primaryYellow hover:bg-brand-orange text-black hover:text-white text-xs font-extrabold uppercase rounded-full shadow-md transition transform hover:scale-[1.02] flex items-center justify-center gap-2 border-2 border-black"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Book with Razorpay &bull; ₹{priceDetails.totalPerPerson}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Center: Destination Waypoint Step & Cost Inclusions Badge */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-[500] max-w-md bg-black/90 backdrop-blur-md text-white border border-neutral-700 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-primaryYellow text-black font-extrabold flex items-center justify-center text-xs flex-shrink-0 shadow">
          ★
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-primaryYellow truncate">{destLoc.name}</span>
            <span className="text-[10px] text-neutral-300 font-bold">
              ₹{priceDetails.totalPerPerson} &bull; {destLoc.altitudeStr}
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 truncate mt-0.5">{destLoc.desc}</p>
        </div>
      </div>
    </div>
  );
};
