import { Link, useLocation } from "wouter";
import { type Translations, type Lang } from "@/i18n/translations";
import { useChat } from "@/chat/chatContext";
import {
  House,
  Images,
  Route as RouteIcon,
  Music2,
  Clapperboard,
  PenLine,
  Heart,
  MessageCircle,
  LogOut,
  BookHeart,
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
    { href: "/home", label: t.nav_home, icon: House },
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
    <nav className="memory-nav" aria-label="Main navigation">
      <Link href="/home" className="memory-nav-brand" aria-label={t.brand}>
        <span className="memory-nav-seal" aria-hidden="true">
          <BookHeart size={18} strokeWidth={1.55} />
        </span>
        <span className="memory-nav-brand-copy">
          <strong>{t.brand}</strong>
          <small aria-hidden="true">Private archive</small>
        </span>
      </Link>

      <div className="memory-nav-track">
        {links.map((item) => {
          const Icon = item.icon;
          const active = location === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`memory-nav-item${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
            >
              <span className="memory-nav-icon" aria-hidden="true">
                <Icon size={17} strokeWidth={1.65} />
              </span>
              <span className="memory-nav-label">{item.label}</span>
              {item.chat && unread > 0 && location !== "/chat" && (
                <span className="memory-nav-badge">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <button
        className="memory-nav-logout"
        onClick={onLogout}
        type="button"
        aria-label={t.nav_logout}
      >
        <LogOut size={17} strokeWidth={1.65} aria-hidden="true" />
        <span>{t.nav_logout}</span>
      </button>
    </nav>
  );
}
