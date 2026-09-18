// MapControls – knapper placeret oven på kortet til at skifte dag/nat-tema og centrere kortet på brugerens position.

'use client'

type MapControlsProps = {
  lightPreset: 'day' | 'night'
  onCycleLightPreset: () => void
  onCenterOnUser: () => void
}

export default function MapControls({
  lightPreset,
  onCycleLightPreset,
  onCenterOnUser,
}: MapControlsProps) {
  const isNight = lightPreset === 'night'

  return (
    <div
      style={{
        position: 'absolute',
        top: '115px',
        right: '10px',
        zIndex: 10,
        width: '32px',
      }}
    >
      <button
        type="button"
        onClick={onCycleLightPreset}
        title={`Lys: ${lightPreset}`}
        aria-label={isNight ? 'Skift til dag-tilstand' : 'Skift til nat-tilstand'}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '4px',
          background: '#fff',
          color: '#333',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '10px',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isNight ? (
          <svg // Moon icon
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg // Sun icon
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="3" />
            <path
              d="M12 2V5M12 19V22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M2 12H5M19 12H22M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={onCenterOnUser}
        title="Vis min lokation"
        aria-label="Vis min lokation"
        style={{
          width: '32px',
          height: '32px',
          marginTop: '8px',
          border: 'none',
          borderRadius: '4px',
          background: '#fff',
          color: '#333',
          cursor: 'pointer',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
