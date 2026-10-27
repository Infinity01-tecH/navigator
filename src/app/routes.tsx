import { createBrowserRouter } from 'react-router';
import { Layout } from '../screens/Layout';
import { DevNav } from '../screens/DevNav';
import { Welcome } from '../screens/Welcome';
import { Start } from '../screens/Start';
import { Auth } from '../screens/Auth';
import { FirstSkill } from '../screens/FirstSkill';
import { Fingerprint } from '../screens/Fingerprint';
import { Gap } from '../screens/Gap';
import { SkillCheck } from '../screens/SkillCheck';
import { Time } from '../screens/Time';
import { Sprint } from '../screens/Sprint';
import { YouTube } from '../screens/YouTube';
import { Generating } from '../screens/Generating';
import { Main } from '../screens/Main';
import { Watch } from '../screens/Watch';
import { Settings } from '../screens/Settings';
import { Notes } from '../screens/Notes';
import { Friends } from '../screens/Friends';
import { Profile } from '../screens/Profile';
import { Notifications } from '../screens/Notifications';
import { Portfolio } from '../screens/Portfolio';
import { PortfolioEdit } from '../screens/PortfolioEdit';
import { NaviPreloader } from '../components/NaviPreloader';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { path: 'auth',            Component: Auth        },
      { path: 'first-skill',     Component: FirstSkill  },
      // Welcome screen is the landing page (post-quote). HydrationGate auto-redirects
      // returning users with roadmaps from '/' to '/main', so they never see this.
      { index: true,              Component: Welcome     },
      // Onboarding form — reached after auth ("Build Roadmap" → auth → here)
      { path: 'start',            Component: Start       },
      { path: 'fingerprint',      Component: Fingerprint },
      { path: 'gap',              Component: Gap         },
      { path: 'skillcheck',       Component: SkillCheck  },
      { path: 'time',             Component: Time        },
      { path: 'sprint',           Component: Sprint      },
      { path: 'youtube',          Component: YouTube     },
      { path: 'generating',       Component: Generating  },
      { path: 'main',             Component: Main        },
      { path: 'watch',            Component: Watch       },
      { path: 'settings',         Component: Settings    },
      { path: 'notes',            Component: Notes       },
      { path: 'friends',          Component: Friends     },
      { path: 'profile/:id',      Component: Profile     },
      { path: 'notifications',    Component: Notifications },
      // Portfolio: /portfolio is the owner's editor, /u/<handle> is the public page
      { path: 'portfolio',        Component: PortfolioEdit },
      { path: 'u/:handle',        Component: Portfolio  },
      { path: 'dev',              Component: DevNav      },
      // Dev-only: loops the full preloader forever so it can be inspected (/preloader)
      { path: 'preloader',        Component: () => <NaviPreloader skill="Preview" /> },
      { path: '*',                Component: Welcome     },
    ],
  },
]);
