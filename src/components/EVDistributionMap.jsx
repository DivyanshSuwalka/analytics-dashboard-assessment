import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const EVDistributionMap = ({ data }) => {
    const center = [47.474444, -120.575833]; // WA state center

    // Slice for initial view performance as recommended in plan
    const mapPoints = data.slice(0, 500);

    return (
        <div className="h-full w-full rounded-3xl overflow-hidden border border-white/5 relative bg-slate-950">
            <MapContainer
                center={center}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {mapPoints.map((point, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[point.lat, point.lng]}
                        radius={4}
                        fillColor="#3b82f6"
                        color="white"
                        weight={1}
                        opacity={0.8}
                        fillOpacity={0.6}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1">
                                <p className="font-bold text-white mb-1">{point.make} {point.model}</p>
                                <div className="h-[1px] w-full bg-white/10 my-2"></div>
                                <p className="text-[10px] text-slate-400 font-mono">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Map Badge */}
            <div className="absolute top-6 left-6 z-[1000] glass-card px-4 py-2 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                <span className="text-xs font-bold text-white tracking-tight">Geo-Spatial Analysis</span>
            </div>
        </div>
    );
};

export default EVDistributionMap;
