import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp } from '../lib/context';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import svgPaths from '@/imports/SignUpScreenEmailDarkMode4/svg-9n4kzjgen9';
import { PasswordIllustration, UsernameIllustration, ResetIllustration } from '../app/components/RoadmapDecoration';
import { NaviPreloader } from '../components/NaviPreloader';

// ── Password rules ─────────────────────────────────────────────────────────────
function passwordProblem(pw: string): string | null {
  if (pw.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(pw)) return 'Password must contain at least 1 uppercase letter.';
  if (!/[0-9]/.test(pw)) return 'Password must contain at least 1 number.';
  return null;
}

// ── Username rules ─────────────────────────────────────────────────────────────
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
function cleanUsername(raw: string) {
  return raw.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
}
async function resolveSignInEmail(identifier: string): Promise<string> {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) return trimmed;
  const { data, error } = await supabase.rpc('email_for_username', { p_username: trimmed.toLowerCase() });
  if (error || !data) throw new Error('No account found with that username.');
  return data as string;
}

// ── Name pool ──────────────────────────────────────────────────────────────────
const NAME_POOL = [
  'Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson',
  'Margaret Hamilton', 'Tim Berners-Lee', 'Linus Torvalds', 'Dennis Ritchie',
  'Barbara Liskov', 'Hedy Lamarr', 'Fei-Fei Li', 'Andrew Ng',
  'Demis Hassabis', 'Jensen Huang', 'Sundar Pichai', 'Yann LeCun',
  'Sam Altman', 'Satya Nadella', 'Ken Thompson', 'John Carmack',
  'Guido van Rossum', 'James Gosling', 'Anders Hejlsberg', 'Brendan Eich',
  'Radia Perlman', 'Vint Cerf', 'Shigeru Miyamoto', 'Marissa Mayer',
  'Susan Wojcicki', 'Sheryl Sandberg', 'Jack Dorsey', 'Larry Page',
  'Sergey Brin', 'Bill Gates', 'Steve Wozniak', 'Steve Jobs',
  'Mark Zuckerberg', 'Reid Hoffman', 'Peter Thiel', 'Melanie Perkins',
  'Ken Miles', 'Enzo Ferrari', 'Carroll Shelby', 'Ayrton Senna',
  'Gordon Murray', 'Colin Chapman', 'Adrian Newey', 'Niki Lauda',
  'Lewis Hamilton', 'Mario Andretti',
  'J. Robert Oppenheimer', 'Albert Einstein', 'Marie Curie', 'Richard Feynman',
  'Niels Bohr', 'Enrico Fermi', 'Rosalind Franklin', 'Stephen Hawking',
  'Werner Heisenberg', 'Erwin Schrödinger', 'Michael Faraday', 'Nikola Tesla',
  'James Clerk Maxwell', 'Isaac Newton', 'Chien-Shiung Wu', 'Lise Meitner',
  'Wernher von Braun', 'Sally Ride', 'Neil Armstrong', 'Mae Jemison',
  'Elon Musk', 'Burt Rutan', 'Gene Kranz', 'Valentina Tereshkova',
  'John von Neumann', 'Alan Kay', 'Claude Shannon', 'Emmy Noether',
  'Srinivasa Ramanujan', 'Blaise Pascal', 'Carl Friedrich Gauss', 'Euclid',
  'Charles Darwin', 'Gregor Mendel', 'Jennifer Doudna', 'Katalin Karikó',
  'Louis Pasteur', 'Alexander Fleming', 'Barbara McClintock', 'Jonas Salk',
  'Henry Ford', 'Walt Disney', 'Coco Chanel', 'Ray Dalio',
  'Warren Buffett', 'Indra Nooyi', 'Jeff Bezos', 'Oprah Winfrey',
  'Dieter Rams', 'Jony Ive',
];
function rollName(last: string) {
  let pick = last;
  while (pick === last) pick = NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
  return pick;
}

// ── Visual sub-components ──────────────────────────────────────────────────────

// Animated Navigator logo icon — spring overshoot mimics motion-context 0→1.2→1
function NavLogoIcon() {
  return (
    <motion.div
      className="relative shrink-0"
      style={{ width: 48.32, height: 41, transformOrigin: '50% 50%' }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="41"
        preserveAspectRatio="none"
        viewBox="0 0 48.3201 41"
        width="48.3201"
      >
        <g>
          <rect fill="#8CB200" height="41" rx="10.9818" width="48.3201" />
          <path clipRule="evenodd" d={svgPaths.p34fe53f0} fill="white" fillRule="evenodd" />
        </g>
      </svg>
    </motion.div>
  );
}

// Back-arrow (rotated long-arrow from import)
function BackArrowIcon() {
  return (
    <div className="relative size-[24px]">
      <div
        className="absolute flex inset-[26.04%_19.79%_23.76%_17.71%] items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <div className="flex-none h-[100cqw] rotate-90 w-[100cqh]">
          <div className="relative size-full">
            <div className="absolute inset-[-6.67%_-8.3%]">
              <svg fill="none" height="17.0002" preserveAspectRatio="none" viewBox="0 0 14.049 17.0002" width="14.049">
                <path d="M7.0246 16V1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d={svgPaths.pcca5f60} stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Color mode icon (top-right)
function ColorModeIcon() {
  return (
    <div className="bg-card p-[8px] rounded-[12px]">
      <div className="overflow-clip relative size-[24px]">
        <div className="absolute inset-[11.02%_11.02%_8.33%_8.33%]">
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            height="19.3542"
            preserveAspectRatio="none"
            viewBox="0 0 19.3542 19.3542"
            width="19.3542"
          >
            <path clipRule="evenodd" d={svgPaths.p1b5c2d80} fill="#131313" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Google icon (from import's coolicon path)
function GoogleIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[12.73%_14.65%_12.86%_12.59%]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          height="17.8581"
          preserveAspectRatio="none"
          viewBox="0 0 17.4642 17.8581"
          width="17.4642"
        >
          <path d={svgPaths.pc4ec200} fill="#111112" />
        </svg>
      </div>
    </div>
  );
}

// Styled input field matching the Figma input design
function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
  isPassword,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  isPassword?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const inputType = isPassword ? (reveal ? 'text' : 'password') : type;
  return (
    <div className="flex flex-col gap-[4px] items-start w-full">
      <div
        className="font-normal text-foreground text-[12px] tracking-[0.4px] leading-[16px] whitespace-nowrap"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {label}
      </div>
      <div className="relative w-full">
        <div
          className="relative w-full rounded-[12px] overflow-hidden"
          style={{ background: '#f8f8f8', border: `1px solid ${focused ? '#8cb200' : '#f2f2f2'}`, transition: 'border-color 0.15s' }}
        >
          <input
            type={inputType}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            minLength={minLength}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full bg-transparent pl-[16px] h-[44px] text-foreground outline-none placeholder:text-muted-foreground ${isPassword ? 'pr-[48px]' : 'pr-[16px]'}`}
            style={{
              fontSize: 20,
              lineHeight: '24px',
              letterSpacing: '-0.06px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#131313',
            }}
            // eslint-disable-next-line react/no-unknown-property
          />
        </div>
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal(r => !r)}
            className="absolute right-0 top-0 h-full flex items-center pr-4 text-foreground"
            aria-label={reveal ? 'Hide password' : 'Show password'}
          >
            {reveal ? <EyeOff size={22} strokeWidth={1.6} /> : <Eye size={22} strokeWidth={1.6} />}
          </button>
        )}
      </div>
    </div>
  );
}

// Username field with live availability check
function UsernameField({
  value, onChange, status,
}: {
  value: string;
  onChange: (v: string) => void;
  status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid';
}) {
  const statusText: Record<typeof status, string> = {
    idle: '', checking: 'Checking…', available: '✓ Available',
    taken: 'Already taken', invalid: '3–20 chars: letters, numbers, underscores',
  };
  const statusColor: Record<typeof status, string> = {
    idle: '#9ea2ae', checking: '#9ea2ae', available: '#4e6207',
    taken: '#b91c1c', invalid: '#9ea2ae',
  };
  return (
    <div className="flex flex-col gap-[4px] items-start w-full">
      <AuthInput
        label="Username"
        type="text"
        value={value}
        onChange={v => onChange(cleanUsername(v))}
        placeholder="yourname"
        autoComplete="username"
      />
      {status !== 'idle' && (
        <p style={{ fontSize: 12, color: statusColor[status], paddingLeft: 2 }}>
          {statusText[status]}
        </p>
      )}
    </div>
  );
}

// "or" divider
function OrDivider() {
  return (
    <div className="flex gap-[16px] items-center w-full">
      <div className="flex flex-1 flex-col items-start overflow-clip py-[3px]">
        <div className="bg-secondary h-[2px] w-full" />
      </div>
      <p
        className="font-normal text-muted-foreground text-[16px] tracking-[-0.048px] leading-[20px] whitespace-nowrap"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        or
      </p>
      <div className="flex flex-1 flex-col items-start overflow-clip py-[3px]">
        <div className="bg-secondary h-[2px] w-full" />
      </div>
    </div>
  );
}

// ── Auth screen ────────────────────────────────────────────────────────────────
// Dev bypass credentials — set these to log in instantly without a real account
const DEV_BYPASS_USER = 'demo';
const DEV_BYPASS_PASS = 'Demo1234';

export function Auth() {
  const navigate = useNavigate();
  const { devBypassLogin } = useApp();
  const [params] = useSearchParams();
  const nextPath = params.get('next') || '/start';
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'signin';

  // A password-recovery link lands back here with ?mode=reset (and Supabase's
  // own #type=recovery hash). In that case we jump straight to the "set a new
  // password" screen instead of the normal signed-in forwarding.
  const isRecovery = params.get('mode') === 'reset' || window.location.hash.includes('type=recovery');

  const [mode, setMode]         = useState<'signin' | 'signup'>(initialMode);
  // Signup is a multi-step wizard: form (name+email) → password → username → verify.
  const [signupStep, setSignupStep] = useState<'form' | 'password' | 'username' | 'verify'>('form');
  // Forgot-password flow: 'request' = enter email screen, 'update' = set new password.
  const [resetStep, setResetStep] = useState<'none' | 'request' | 'update'>(isRecovery ? 'update' : 'none');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName]         = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [namePH, setNamePH]     = useState(() => NAME_POOL[0]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  // Only block the UI while checking a session if the URL looks like a Google
  // OAuth redirect (?code= or #access_token=). For every plain navigation
  // (e.g. tapping "Build Roadmap" from the Welcome screen) the user is
  // clearly not mid-OAuth, so we show the form immediately with no loading state.
  const [checkingSession, setCheckingSession] = useState(() => {
    return (
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token=')
    );
  });
  const [needsUsername, setNeedsUsername]     = useState(false);

  // On mount: if already signed in, forward once profile has a username.
  // Handles the Google OAuth PKCE code-exchange race (see original comment).
  useEffect(() => {
    let active = true;
    let done = false;
    let sub: { unsubscribe: () => void } | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function afterSession(session: import('@supabase/supabase-js').Session) {
      if (done) return;
      done = true;
      timer && clearTimeout(timer);
      sub?.unsubscribe();
      if (!active) return;
      const uid = session.user.id;
      const { data: profile } = await supabase
        .from('profiles').select('username').eq('id', uid).maybeSingle();
      if (!active) return;
      if (profile?.username) {
        navigate(nextPath, { replace: true });
        return;
      }
      // Email-confirmation round-trip: the username chosen during signup was
      // stashed in user_metadata. Persist it now that we have a session.
      const metaUsername = (session.user.user_metadata as { username?: string } | null)?.username;
      if (metaUsername) {
        const { error } = await supabase.from('profiles').update({ username: metaUsername }).eq('id', uid);
        if (!active) return;
        // Fresh email confirmation → celebrate with the "first skill" screen,
        // which then forwards into onboarding.
        if (!error) { navigate(`/first-skill?next=${encodeURIComponent(nextPath)}`, { replace: true }); return; }
      }
      // No username anywhere (e.g. Google OAuth) → ask for one.
      setNeedsUsername(true);
      setCheckingSession(false);
    }

    // Password-recovery link: don't forward — show the new-password screen.
    if (isRecovery) {
      done = true;
      setResetStep('update');
      setCheckingSession(false);
      return () => { active = false; done = true; };
    }

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (done || !active) return;
      if (data.session) { afterSession(data.session); return; }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!done && session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          afterSession(session);
        }
      });
      sub = subscription;
      timer = setTimeout(() => {
        if (done) return;
        done = true;
        sub?.unsubscribe();
        if (active) setCheckingSession(false);
      }, 8000);
    })();

    return () => {
      active = false;
      done = true;
      timer && clearTimeout(timer);
      sub?.unsubscribe();
    };
  }, [navigate, nextPath, isRecovery]);

  // Live username availability check
  useEffect(() => {
    const active = needsUsername || (mode === 'signup' && signupStep === 'username');
    if (!active) return;
    if (!username) { setUsernameStatus('idle'); return; }
    if (!USERNAME_RE.test(username)) { setUsernameStatus('invalid'); return; }
    setUsernameStatus('checking');
    const t = setTimeout(async () => {
      const { data, error } = await supabase.rpc('username_available', { p_username: username });
      if (error) { setUsernameStatus('idle'); return; }
      setUsernameStatus(data ? 'available' : 'taken');
    }, 400);
    return () => clearTimeout(t);
  }, [username, mode, needsUsername, signupStep]);

  function switchMode(next: 'signin' | 'signup') {
    setMode(next);
    setError('');
    setSuccess('');
    setSignupStep('form');
    if (next === 'signup') setNamePH(rollName(namePH));
  }

  async function handleGoogle() {
    setError(''); setSuccess('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}` },
    });
    if (error) setError(error.message);
  }

  // Sign-in (single form)
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email || !password) return setError('Enter your username/email and password.');

    // Dev bypass — skips Supabase entirely
    if (email.trim().toLowerCase() === DEV_BYPASS_USER && password === DEV_BYPASS_PASS) {
      devBypassLogin();
      navigate('/main', { replace: true });
      return;
    }

    setLoading(true);
    try {
      const resolvedEmail = await resolveSignInEmail(email);
      const { error } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password });
      if (error) throw error;
      setSuccess('Signed in — redirecting…');
      setTimeout(() => navigate(nextPath, { replace: true }), 500);
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // Step 1 → 2: name + email → password page
  function handleEmailNext(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = email.trim();
    if (!trimmed) return setError('Enter your email address.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) return setError('Enter a valid email address.');
    setSignupStep('password');
  }

  // Step 2 → 3: password + confirm → username page
  function handlePasswordNext(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setSignupStep('username');
  }

  // Step 3: username → create the account in Supabase.
  // Because email confirmation returns no session until the link is clicked, we
  // pass the username in user_metadata now and write it to `profiles` once the
  // confirmed session exists (handled by afterSession on mount).
  async function handleUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!USERNAME_RE.test(username)) return setError('Username must be 3–20 characters: lowercase letters, numbers, underscores only.');
    if (usernameStatus === 'taken') return setError('That username is already taken.');
    if (usernameStatus === 'checking') return setError('Still checking that username — one moment.');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() || null, username },
          emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) throw error;
      if (data.session) {
        // Email confirmation disabled → session ready now; persist username.
        await supabase.from('profiles').update({ username }).eq('id', data.session.user.id);
        setSuccess('Account created — redirecting…');
        setTimeout(() => navigate(`/first-skill?next=${encodeURIComponent(nextPath)}`, { replace: true }), 700);
      } else {
        // Confirmation required → show the verify-email screen.
        setSignupStep('verify');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Could not create your account. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // Verify screen: resend confirmation email (with a cooldown).
  const [resendCooldown, setResendCooldown] = useState(0);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // While on the verify screen, watch for the confirmation happening in any tab.
  useEffect(() => {
    if (!(mode === 'signup' && signupStep === 'verify')) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        navigate(`/first-skill?next=${encodeURIComponent(nextPath)}`, { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [mode, signupStep, navigate, nextPath]);

  async function handleResend() {
    setError(''); setSuccess('');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}` },
      });
      if (error) throw error;
      setSuccess('Confirmation email sent — check your inbox.');
      setResendCooldown(45);
    } catch (err: unknown) {
      setError((err as Error).message || 'Could not resend the email. Try again shortly.');
    }
  }

  // Manual re-check in case the user confirmed in another tab.
  async function handleVerifyRecheck() {
    setError(''); setSuccess('');
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    setLoading(false);
    if (data.session) navigate(`/first-skill?next=${encodeURIComponent(nextPath)}`, { replace: true });
    else setError("We haven't seen your confirmation yet. Click the link in your email, then try again.");
  }

  // Forgot-password step 1: send the reset email. The recovery link brings the
  // user back to /auth?mode=reset, where we show the "set new password" screen.
  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    const trimmed = email.trim();
    if (!trimmed) return setError('Enter your email address.');
    setLoading(true);
    try {
      const resolvedEmail = await resolveSignInEmail(trimmed);
      const { error } = await supabase.auth.resetPasswordForEmail(resolvedEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      if (error) throw error;
      setSuccess('If the email exists, a reset link is on its way — check your inbox.');
    } catch {
      // Don't reveal whether an account exists — always show the same message.
      setSuccess('If the email exists, a reset link is on its way — check your inbox.');
    } finally {
      setLoading(false);
    }
  }

  // Forgot-password step 2: the recovery session is active; set the new password.
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess('Password updated — redirecting…');
      setTimeout(() => navigate(nextPath, { replace: true }), 700);
    } catch (err: unknown) {
      setError((err as Error).message || 'Could not update your password. Request a new link and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteUsername(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!USERNAME_RE.test(username)) return setError('Username must be 3–20 characters: lowercase letters, numbers, underscores only.');
    if (usernameStatus === 'taken') return setError('That username is already taken.');
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) throw new Error('Session expired — please sign in again.');
      const { error } = await supabase.from('profiles').update({ username }).eq('id', uid);
      if (error) throw error;
      navigate(nextPath, { replace: true });
    } catch (err: unknown) {
      setError((err as Error).message || 'Could not save username. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (checkingSession) {
    return (
      <div className="relative h-full w-full">
        <NaviPreloader label="Signing you in" />
      </div>
    );
  }

  // ── Username completion (Google OAuth / email sign-up without username) ────
  if (needsUsername) {
    return (
      <div className="bg-background h-full w-full overflow-y-auto flex justify-center">
        <div className="w-full max-w-[393px] flex flex-col gap-[34px] px-[16px] py-[24px]">
          {/* Header: color mode toggle */}
          <div className="flex items-center justify-end">
            <ColorModeIcon />
          </div>

          {/* Logo + subtitle */}
          <div className="flex flex-col gap-[40px] items-center">
            <div className="flex items-center justify-center gap-[16px]">
              <NavLogoIcon />
              <p
                className="font-bold leading-[32px] text-foreground text-[24px] tracking-[-0.072px]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Navigator
              </p>
            </div>
            <div className="w-full">
              <p
                className="font-medium text-foreground text-[24px] tracking-[-0.072px] leading-[32px]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                One last thing
              </p>
              <p className="text-[14px] leading-[20px] text-muted-foreground mt-[8px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Pick a username — this is how friends will find you.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCompleteUsername} className="flex flex-col gap-[10px]">
            {error && (
              <div className="text-[13px] px-4 py-3 rounded-[12px]" style={{ background: '#fff1f1', color: '#b91c1c' }}>
                {error}
              </div>
            )}
            <UsernameField value={username} onChange={setUsername} status={usernameStatus} />
            <button
              type="submit"
              disabled={loading || usernameStatus === 'taken' || usernameStatus === 'invalid'}
              className="bg-primary flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity disabled:opacity-50"
            >
              <p
                className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontFeatureSettings: '"case" 1' }}
              >
                {loading ? 'Saving…' : 'Continue'}
              </p>
            </button>
          </form>
        </div>
      </div>
    );
  }

  function ErrorAlert() {
    return error ? (
      <div className="text-[13px] px-4 py-3 rounded-[12px]" style={{ background: '#fff1f1', color: '#b91c1c' }}>
        {error}
      </div>
    ) : null;
  }
  function SuccessAlert() {
    return success ? (
      <div className="text-[13px] px-4 py-3 rounded-[12px]" style={{ background: '#F8FDE7', color: '#4e6207' }}>
        {success}
      </div>
    ) : null;
  }

  // Shell for the create-password / create-username steps: content at the top,
  // the roadmap illustration filling the empty space, primary button pinned near
  // the bottom — mirroring the Figma frames.
  function StepScaffold({ onBack, title, hint, children, submit, onSubmit, noValidate, illustration }: {
    onBack: () => void;
    title: string;
    hint: string;
    children: React.ReactNode;
    submit: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    noValidate?: boolean;
    illustration: React.ReactNode;
  }) {
    return (
      <div className="bg-background h-full w-full overflow-hidden flex justify-center">
        <form
          onSubmit={onSubmit}
          noValidate={noValidate}
          className="relative w-full max-w-[393px] h-full flex flex-col px-[16px] pt-[24px] pb-[58px]"
        >
          {/* Per-page roadmap illustration, anchored behind the content */}
          {illustration}

          {/* Header */}
          <div className="relative flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="bg-background rounded-[12px] p-[8px] -ml-[8px] active:bg-card transition-colors"
              aria-label="Back"
            >
              <BackArrowIcon />
            </button>
            <ColorModeIcon />
          </div>

          {/* Title */}
          <p
            className="relative font-medium text-foreground text-[24px] tracking-[-0.072px] leading-[32px] mt-[24px]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {title}
          </p>

          {/* Fields */}
          <div className="relative flex flex-col gap-[10px] mt-[16px]">
            <ErrorAlert />
            {children}
          </div>

          {/* Hint */}
          <p
            className="relative text-[16px] leading-[20px] text-foreground tracking-[-0.048px] mt-[16px] px-[8px]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {hint}
          </p>

          {/* Spacer pushes the button to the bottom */}
          <div className="flex-1" />

          {/* Primary button */}
          <div className="relative">{submit}</div>
        </form>
      </div>
    );
  }

  // ── Forgot password: enter email ─────────────────────────────────────────────
  if (resetStep === 'request') {
    return (
      <StepScaffold
        onBack={() => { setError(''); setSuccess(''); setResetStep('none'); setMode('signin'); }}
        title="Enter Email"
        hint="If the Email exists, you should recieve an E-mail with a link to reset your password."
        onSubmit={handleResetRequest}
        noValidate
        illustration={<ResetIllustration />}
        submit={
          <button
            type="submit"
            disabled={loading}
            className="bg-primary flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity disabled:opacity-50"
          >
            <p
              className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontFeatureSettings: '"case" 1' }}
            >
              {loading ? 'Sending…' : 'Reset Password'}
            </p>
          </button>
        }
      >
        <SuccessAlert />
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="user@gmail.com"
          autoComplete="email"
        />
      </StepScaffold>
    );
  }

  // ── Forgot password: set a new password (after clicking the recovery link) ────
  if (resetStep === 'update') {
    return (
      <StepScaffold
        onBack={() => { setError(''); setSuccess(''); setResetStep('none'); setMode('signin'); }}
        title="Set a new password"
        hint="Your password must contain 8 characters, 1 uppercase and 1 number."
        onSubmit={handleUpdatePassword}
        noValidate
        illustration={<PasswordIllustration />}
        submit={
          <button
            type="submit"
            disabled={loading}
            className="bg-primary flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity disabled:opacity-50"
          >
            <p
              className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontFeatureSettings: '"case" 1' }}
            >
              {loading ? 'Updating…' : 'Update Password'}
            </p>
          </button>
        }
      >
        <SuccessAlert />
        <AuthInput
          label="New Password"
          type="password"
          isPassword
          value={password}
          onChange={setPassword}
          placeholder="Enter your new password"
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          isPassword
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm Password"
          autoComplete="new-password"
        />
      </StepScaffold>
    );
  }

  // ── Signup step: create password ─────────────────────────────────────────────
  if (mode === 'signup' && signupStep === 'password') {
    return (
      <StepScaffold
        onBack={() => { setError(''); setSignupStep('form'); }}
        title="Create your password"
        hint="Your password must contain 8 characters, 1 uppercase and 1 number."
        onSubmit={handlePasswordNext}
        noValidate
        illustration={<PasswordIllustration />}
        submit={
          <button
            type="submit"
            className="bg-primary flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity"
          >
            <p
              className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontFeatureSettings: '"case" 1' }}
            >
              Continue
            </p>
          </button>
        }
      >
        <AuthInput
          label="Password"
          type="password"
          isPassword
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          isPassword
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm Password"
          autoComplete="new-password"
        />
      </StepScaffold>
    );
  }

  // ── Signup step: create username ─────────────────────────────────────────────
  if (mode === 'signup' && signupStep === 'username') {
    return (
      <StepScaffold
        onBack={() => { setError(''); setSignupStep('password'); }}
        title="Create your username"
        hint="Create a unique username, you can use lowercase letters, numbers from 0 to 9 and underscores."
        onSubmit={handleUsernameSubmit}
        illustration={<UsernameIllustration />}
        submit={
          <button
            type="submit"
            disabled={loading || usernameStatus === 'taken' || usernameStatus === 'invalid'}
            className="bg-primary flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity disabled:opacity-50"
          >
            <p
              className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontFeatureSettings: '"case" 1' }}
            >
              {loading ? 'Creating…' : 'Continue'}
            </p>
          </button>
        }
      >
        <UsernameField value={username} onChange={setUsername} status={usernameStatus} />
      </StepScaffold>
    );
  }

  // ── Signup step: verify email ────────────────────────────────────────────────
  if (mode === 'signup' && signupStep === 'verify') {
    return (
      <div className="bg-background h-full w-full overflow-y-auto flex justify-center">
        <div className="w-full max-w-[393px] flex flex-col gap-[34px] px-[16px] py-[24px]">
          <div className="flex items-center justify-end">
            <ColorModeIcon />
          </div>

          <div className="flex flex-col gap-[24px] items-center text-center pt-[24px]">
            <div className="bg-accent rounded-[24px] p-[20px] flex items-center justify-center">
              <Mail size={40} strokeWidth={1.6} color="#8cb200" />
            </div>
            <div className="flex flex-col gap-[12px]">
              <p
                className="font-medium text-foreground text-[24px] tracking-[-0.072px] leading-[32px]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Verify your email
              </p>
              <p className="text-[16px] leading-[22px] text-muted-foreground tracking-[-0.048px] px-[8px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                We sent a confirmation link to{' '}
                <span className="text-foreground font-medium">{email.trim()}</span>. Open it to activate your account, then come back here.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <ErrorAlert />
            <SuccessAlert />
            <button
              type="button"
              onClick={handleVerifyRecheck}
              disabled={loading}
              className="bg-primary flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity disabled:opacity-50"
            >
              <p
                className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontFeatureSettings: '"case" 1' }}
              >
                {loading ? 'Checking…' : "I've verified my email"}
              </p>
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="bg-accent flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity disabled:opacity-50"
            >
              <p
                className="font-medium text-foreground text-[20px] text-center leading-[24px]"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
              </p>
            </button>
            <button
              type="button"
              onClick={() => { setError(''); setSuccess(''); setSignupStep('form'); }}
              className="text-primary underline text-[14px] tracking-[-0.042px] leading-[20px] mt-[4px] bg-transparent"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main auth form ─────────────────────────────────────────────────────────
  return (
    <div className="bg-background h-full w-full overflow-y-auto flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col gap-[34px] px-[16px] py-[24px]">
        {/* Header: back arrow + color mode toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="bg-background rounded-[12px] p-[8px] -ml-[8px] active:bg-card transition-colors"
            aria-label="Back"
          >
            <BackArrowIcon />
          </button>
          <ColorModeIcon />
        </div>

        {/* Logo + subtitle + tab switcher — 40px gaps (Frame8) */}
        <div className="flex flex-col gap-[40px] items-center">
          <div className="flex items-center justify-center gap-[16px] self-center">
            <NavLogoIcon />
            <p
              className="font-bold leading-[32px] text-foreground text-[24px] tracking-[-0.072px]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Navigator
            </p>
          </div>

          <p
            className="w-full font-medium text-foreground text-[24px] tracking-[-0.072px] leading-[32px]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {mode === 'signup'
              ? 'Sign up to build your first roadmap!'
              : 'Sign in to continue from where you left off'}
          </p>

          <div className="bg-card flex h-[47px] items-start p-[4px] rounded-[16px] w-full">
            <button
              onClick={() => switchMode('signup')}
              className={`flex flex-1 flex-col h-full items-center justify-center py-[10px] rounded-[16px] transition-colors ${mode === 'signup' ? 'bg-foreground' : ''}`}
            >
              <p
                className={`font-semibold text-[13px] text-center tracking-[0.2px] whitespace-nowrap ${mode === 'signup' ? 'text-background' : 'text-muted-foreground'}`}
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Sign up
              </p>
            </button>
            <button
              onClick={() => switchMode('signin')}
              className={`flex flex-1 flex-col h-full items-center justify-center py-[10px] rounded-[16px] transition-colors ${mode === 'signin' ? 'bg-foreground' : ''}`}
            >
              <p
                className={`font-semibold text-[13px] text-center tracking-[0.2px] whitespace-nowrap ${mode === 'signin' ? 'text-background' : 'text-muted-foreground'}`}
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Sign in
              </p>
            </button>
          </div>
        </div>

        {/* Form body — 10px gaps (Frame7) */}
        <div className="flex flex-col gap-[10px]">
          {/* Alerts */}
          {error && (
            <div className="text-[13px] px-4 py-3 rounded-[12px]" style={{ background: '#fff1f1', color: '#b91c1c' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="text-[13px] px-4 py-3 rounded-[12px]" style={{ background: '#F8FDE7', color: '#4e6207' }}>
              {success}
            </div>
          )}

          <form onSubmit={mode === 'signup' ? handleEmailNext : handleSignIn} noValidate className="flex flex-col gap-[10px]">
          {/* Sign up fields */}
          {mode === 'signup' && (
            <AuthInput
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder={namePH}
              autoComplete="name"
            />
          )}

          {/* Email / username identifier */}
          <AuthInput
            label={mode === 'signup' ? 'Email' : 'Username'}
            type={mode === 'signup' ? 'email' : 'text'}
            value={email}
            onChange={setEmail}
            placeholder={mode === 'signup' ? 'user@gmail.com' : 'Username'}
            autoComplete={mode === 'signup' ? 'email' : 'username'}
            required
          />

          {/* Password (sign-in only — signup collects it on the next step) */}
          {mode === 'signin' && (
            <AuthInput
              label="Password"
              type="password"
              isPassword
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          )}

          {/* Forgot password (sign-in only) */}
          {mode === 'signin' && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => { setError(''); setSuccess(''); setResetStep('request'); }}
                className="font-normal text-primary text-[12px] tracking-[0.4px] leading-[16px] bg-transparent border-0 cursor-pointer"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Forgot Password
              </button>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary flex items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full active:opacity-80 transition-opacity disabled:opacity-50"
          >
            <p
              className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontFeatureSettings: '"case" 1',
              }}
            >
              {mode === 'signup'
                ? 'Continue'
                : (loading ? 'Signing in…' : 'Sign in')}
            </p>
          </button>

          {/* OR divider */}
          <OrDivider />

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            className="bg-accent relative rounded-[12px] w-full flex items-center justify-center gap-[8px] py-[12px] px-[16px] active:opacity-80 transition-opacity"
          >
            <GoogleIcon />
            <p
              className="font-medium text-foreground text-[20px] text-center whitespace-nowrap leading-[24px]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </p>
          </button>
        </form>
        </div>

        {/* Terms — 34px below the form (Frame6) */}
        <div className="flex items-center justify-center px-[10px]">
          <p
            className="font-normal text-muted-foreground text-[14px] text-center tracking-[-0.042px] w-full leading-[20px]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            By joining, I declare that I have read and accept the Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
