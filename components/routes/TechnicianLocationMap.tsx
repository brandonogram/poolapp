'use client';

/**
 * PoolOps - Technician Location Map
 * Displays technician locations on a visual map representation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import {
  getTechnicianLocations,
  subscribeTechnicianLocations,
  type TechnicianLocationWithDetails,
} from '@/lib/realtime/technician-locations';

// =============================================================================
// Types
// =============================================================================

interface TechnicianLocationMapProps {
  companyId: string;
  /** Center latitude for the map */
  centerLat?: number;
  /** Center longitude for the map */
  centerLng?: number;
  /** Zoom level / scale factor */
  zoomLevel?: number;
  /** Height of the map container */
  height?: string | number;
  /** Whether to show the live indicator */
  showLiveIndicator?: boolean;
  /** Callback when a technician marker is clicked */
  onTechnicianClick?: (location: TechnicianLocationWithDetails) => void;
}

interface MarkerPosition {
  x: number;
  y: number;
}

// =============================================================================
// Constants
// =============================================================================

// Default center (can be adjusted based on company location)
const DEFAULT_CENTER_LAT = 33.7490; // Atlanta, GA
const DEFAULT_CENTER_LNG = -84.3880;
const DEFAULT_ZOOM = 1;

// Map bounds (in pixels at zoom level 1)
const MAP_WIDTH = 400;
const MAP_HEIGHT = 300;

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Convert lat/lng to x/y position on the map
 * Simple mercator-style projection for demo purposes
 */
function latLngToPosition(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  zoom: number
): MarkerPosition {
  // Calculate offset from center in degrees
  const latOffset = lat - centerLat;
  const lngOffset = lng - centerLng;

  // Convert to pixels (rough approximation)
  // At zoom 1, 1 degree ~= 20 pixels
  const pixelsPerDegree = 20 * zoom;

  const x = MAP_WIDTH / 2 + lngOffset * pixelsPerDegree;
  const y = MAP_HEIGHT / 2 - latOffset * pixelsPerDegree; // Invert Y axis

  return {
    x: Math.max(20, Math.min(MAP_WIDTH - 20, x)),
    y: Math.max(20, Math.min(MAP_HEIGHT - 20, y)),
  };
}

/**
 * Format the time since last update
 */
function formatLastUpdated(timestamp: string): string {
  const now = new Date();
  const updated = new Date(timestamp);
  const diffMs = now.getTime() - updated.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);

  if (diffSecs < 10) return 'Just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  return 'Over 1h ago';
}

// =============================================================================
// Component
// =============================================================================

export function TechnicianLocationMap({
  companyId,
  centerLat = DEFAULT_CENTER_LAT,
  centerLng = DEFAULT_CENTER_LNG,
  zoomLevel = DEFAULT_ZOOM,
  height = 300,
  showLiveIndicator = true,
  onTechnicianClick,
}: TechnicianLocationMapProps) {
  const [locations, setLocations] = useState<TechnicianLocationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fetch initial locations
  const fetchLocations = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getTechnicianLocations(companyId);
      setLocations(data);
    } catch (err) {
      console.error('Error fetching technician locations:', err);
      setError('Failed to load technician locations');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchLocations();

    if (companyId) {
      unsubscribeRef.current = subscribeTechnicianLocations(
        companyId,
        (payload) => {
          setIsConnected(true);

          if (payload.eventType === 'INSERT' && payload.new) {
            setLocations((prev) => [...prev, payload.new as TechnicianLocationWithDetails]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setLocations((prev) =>
              prev.map((loc) =>
                loc.technician_id === payload.new?.technician_id
                  ? { ...loc, ...payload.new }
                  : loc
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setLocations((prev) =>
              prev.filter((loc) => loc.technician_id !== payload.old?.technician_id)
            );
          }
        }
      );
      setIsConnected(true);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      setIsConnected(false);
    };
  }, [companyId, fetchLocations]);

  // Handle marker click
  const handleMarkerClick = (location: TechnicianLocationWithDetails) => {
    setSelectedTech(
      selectedTech === location.technician_id ? null : location.technician_id
    );
    onTechnicianClick?.(location);
  };

  // Render loading state
  if (loading) {
    return (
      <div
        className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ height }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-slate-500">
          <svg
            className="w-12 h-12 mx-auto mb-2 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>{error}</p>
          <button
            onClick={fetchLocations}
            className="mt-2 text-sm text-green-600 hover:text-green-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden"
      style={{ height }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="techMapGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#techMapGrid)" />
        </svg>
      </div>

      {/* Map content */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Technician markers */}
        {locations.map((location) => {
          const pos = latLngToPosition(
            location.latitude,
            location.longitude,
            centerLat,
            centerLng,
            zoomLevel
          );

          const isSelected = selectedTech === location.technician_id;
          const techColor = location.technician_color || '#10B981';

          return (
            <g
              key={location.technician_id}
              onClick={() => handleMarkerClick(location)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse animation for selected/active technician */}
              <AnimatePresence>
                {isSelected && (
                  <motion.circle
                    initial={{ r: 12, opacity: 0.5 }}
                    animate={{ r: 24, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    cx={pos.x}
                    cy={pos.y}
                    fill={techColor}
                  />
                )}
              </AnimatePresence>

              {/* Main marker */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Marker shadow */}
                <ellipse
                  cx={pos.x}
                  cy={pos.y + 18}
                  rx={8}
                  ry={3}
                  fill="rgba(0,0,0,0.2)"
                />

                {/* Marker pin */}
                <path
                  d={`M ${pos.x} ${pos.y + 20}
                      L ${pos.x - 10} ${pos.y}
                      A 10 10 0 1 1 ${pos.x + 10} ${pos.y}
                      L ${pos.x} ${pos.y + 20} Z`}
                  fill={techColor}
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Technician initials */}
                <circle cx={pos.x} cy={pos.y - 2} r="7" fill="white" />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill={techColor}
                >
                  {location.technician_name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('') || '?'}
                </text>

                {/* Speed indicator (if moving) */}
                {location.speed_mph && location.speed_mph > 5 && (
                  <g transform={`translate(${pos.x + 10}, ${pos.y - 15})`}>
                    <rect
                      x="-12"
                      y="-6"
                      width="24"
                      height="12"
                      rx="2"
                      fill="rgba(0,0,0,0.7)"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fontSize="8"
                      fill="white"
                    >
                      {Math.round(location.speed_mph)} mph
                    </text>
                  </g>
                )}
              </motion.g>
            </g>
          );
        })}

        {/* Selected technician info popup */}
        <AnimatePresence>
          {selectedTech && (
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {(() => {
                const location = locations.find(
                  (l) => l.technician_id === selectedTech
                );
                if (!location) return null;

                const pos = latLngToPosition(
                  location.latitude,
                  location.longitude,
                  centerLat,
                  centerLng,
                  zoomLevel
                );

                // Position popup above or below marker based on position
                const popupY = pos.y < MAP_HEIGHT / 2 ? pos.y + 35 : pos.y - 60;

                return (
                  <g transform={`translate(${pos.x}, ${popupY})`}>
                    <rect
                      x="-60"
                      y="-15"
                      width="120"
                      height="40"
                      rx="4"
                      fill="white"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#1e293b"
                    >
                      {location.technician_name || 'Unknown'}
                    </text>
                    <text
                      x="0"
                      y="14"
                      textAnchor="middle"
                      fontSize="8"
                      fill="#64748b"
                    >
                      Updated {formatLastUpdated(location.updated_at)}
                    </text>
                  </g>
                );
              })()}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Live indicator */}
      {showLiveIndicator && (
        <div className="absolute top-3 left-3">
          <Badge
            variant={isConnected ? 'success' : 'default'}
            dot={isConnected}
            className={
              isConnected
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }
          >
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
        </div>
      )}

      {/* Technician count */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
        <p className="text-xs text-slate-600">
          <span className="font-semibold text-slate-900">{locations.length}</span>{' '}
          {locations.length === 1 ? 'technician' : 'technicians'} active
        </p>
      </div>

      {/* No technicians message */}
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm">No technicians in the field</p>
            <p className="text-xs text-slate-400 mt-1">
              Locations will appear when technicians clock in
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      {locations.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <p className="text-xs font-medium text-slate-700 mb-1">Technicians</p>
          <div className="flex flex-wrap gap-2">
            {locations.slice(0, 4).map((loc) => (
              <div
                key={loc.technician_id}
                className="flex items-center gap-1 cursor-pointer hover:opacity-70"
                onClick={() => handleMarkerClick(loc)}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: loc.technician_color || '#10B981' }}
                />
                <span className="text-xs text-slate-600">
                  {loc.technician_name?.split(' ')[0] || 'Unknown'}
                </span>
              </div>
            ))}
            {locations.length > 4 && (
              <span className="text-xs text-slate-400">
                +{locations.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicianLocationMap;
