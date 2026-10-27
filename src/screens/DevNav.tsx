import { useNavigate } from 'react-router';

const GROUPS: { label: string; screens: { name: string; path: string }[] }[] = [
  {
    label: 'Onboarding',
    screens: [
      { name: 'Welcome', path: '/' },
      { name: 'Auth', path: '/auth' },
      { name: 'Start', path: '/start' },
      { name: 'First Skill', path: '/first-skill' },
      { name: 'Fingerprint', path: '/fingerprint' },
      { name: 'Gap', path: '/gap' },
      { name: 'Skill Check', path: '/skillcheck' },
      { name: 'Time', path: '/time' },
      { name: 'Sprint', path: '/sprint' },
      { name: 'YouTube', path: '/youtube' },
      { name: 'Generating', path: '/generating' },
    ],
  },
  {
    label: 'App',
    screens: [
      { name: 'Main', path: '/main' },
      { name: 'Watch', path: '/watch' },
      { name: 'Notes', path: '/notes' },
      { name: 'Friends', path: '/friends' },
      { name: 'Notifications', path: '/notifications' },
      { name: 'Profile', path: '/profile/demo' },
      { name: 'Settings', path: '/settings' },
    ],
  },
];

export function DevNav() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-10 pb-4 border-b border-border">
        <div className="bg-primary rounded-[8px] px-2 py-0.5">
          <span className="text-[11px] font-bold text-foreground tracking-wider">DEV</span>
        </div>
        <h1 className="text-[18px] font-semibold text-foreground">Screen Navigator</h1>
      </div>

      {/* Screen list */}
      <div className="flex flex-col gap-6 px-5 py-6">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              {group.label}
            </p>
            <div className="flex flex-col gap-2">
              {group.screens.map(({ name, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-accent rounded-[12px] text-left active:bg-[#edffa8] transition-colors"
                >
                  <span className="text-[15px] font-medium text-foreground">{name}</span>
                  <span className="text-[13px] text-muted-foreground font-mono">{path}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
