import { Link, useLocation } from "wouter";
import {
  BookHeart,
  Camera,
  Compass,
  Feather,
  House,
  LogOut,
  MessageCircleHeart,
  Music2,
  Sparkles,
  Video,
} from "lucide-react";
import { type Translations, type Lang } from "@/i18n/translations";
import { useChat } from "@/chat/chatContext";

interface Props {
  t: Translations;
  lang: Lang;
  onLogout: () => void;
}

export