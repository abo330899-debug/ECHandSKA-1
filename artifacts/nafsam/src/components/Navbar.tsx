import { Link, useLocation } from "wouter";
import { type Translations, type Lang } from "@/i18n/translations";
import { useChat } from "@/chat/chatContext";
import {
  Home,
  Images,
  Route as RouteIcon,
  Music2,
  Clapperboard,
  PenLine,
  Heart,
  MessageCircle,
  LogOut,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface Props {
  t: Translations;
  lang: Lang;
  onLogout: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  chat?: boolean;
}

export default function Navbar({ t, onLogout }: Props) {
  const [location] = useLocation();
  const { unread, configured } = useChat();

  const links: NavItem[] = [
    { href: "/home", label: t.nav_home, icon: Home },
    { href: "/photos", label: t.nav_photos, icon: Images },
    { href: "/journey", label: t.nav_journey, icon: RouteIcon },
    { href: "/songs", label: t.nav_songs, icon: Music2 },
    { href: "/videos", label: t.nav_videos, icon: Clapperboard },
    { href: "/writings", label: t.nav_writings, icon: PenLine },
    { href: "/feelings", label: t.nav_feelings, icon: Heart },
    ...(configured
      ? [
          {
            href: "/chat",
            label: t.nav_chat,
            icon: MessageCircle,
            chat: true,
          },
        ]
      : []),
  ];

  return (
    <nav className="nav nav-premium glass" aria-label="Main navigation">
      <div className="nav-top">
        <Link href="/home" className="brand brand-premium" aria-label={t.brand}>
          <span className="brand-mark" aria-hidden="true">
            <Sparkles size={16} strokeWidth={1.8} />
          </span>
          <span className="brand-text">{t.brand}</span>
        </Link>
      </div>

      <div className="links nav-links">
        {links.map((item) => {
          const Icon = item.icon;
          const active = location === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
            >
              <span className="nav-icon" aria-hidden="true">
                <Icon size={17} strokeWidth={1.8} />
              </span>
              <span className="nav-label">{item.label}</span>
              {item.chat && unread > 0 && location !== "/chat" && (
                <span className="nav-chat-badge">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          );
        })}

        <button
          className="nav-logout nav-link"
          onClick={onLogout}
          type="button"
          aria-label={t.nav_logout}
        >
          <span className="nav-icon" aria-hidden="true">
            <LogOut size={17} strokeWidth={1.8} />
          </span>
          <span className="nav-label">{t.nav_logout}</span>
        </button>
      </div>
    </nav>
  );
}
