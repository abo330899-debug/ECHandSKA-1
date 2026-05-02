export type Lang = "tr";

export interface Translations {
  dir: "ltr" | "rtl";
  page_title_login: string;
  page_title_main: string;
  brand: string;
  nav_login: string;
  nav_home: string;
  nav_moments: string;
  nav_photos: string;
  nav_songs: string;
  nav_videos: string;
  nav_writings: string;
  nav_feelings: string;
  login_title: string;
  login_text: string;
  login_input: string;
  login_button: string;
  login_hint: string;
  login_msg_closed: string;
  login_msg_wrong: string;
  login_msg_success: string;
  hero_eyebrow: string;
  hero_title: string;
  open_story: string;
  read_pain: string;
  card_moments_title: string;
  card_photos_title: string;
  card_songs_title: string;
  card_writings_title: string;
  moments_title: string;
  photos_title: string;
  songs_title: string;
  songs_text: string;
  videos_title: string;
  video_memory_label: string;
  video1_title: string;
  video2_title: string;
  writings_title: string;
  typed_1: string;
  typed_2: string;
  typed_3: string;
  typed_4: string;
  countdown_label: string;
  countdown_day: string;
  countdown_hour: string;
  countdown_minute: string;
  countdown_second: string;
  riddle_prompt: string;
  photos_fallback_caption: string;
}

export const translations: Record<Lang, Translations> = {
  tr: {
    dir: "ltr",
    page_title_login: "Nafsam | Giriş",
    page_title_main: "Nafsam",
    brand: "Nafsam",
    nav_login: "Giriş",
    nav_home: "Ana Sayfa",
    nav_moments: "Başlangıçtan İze",
    nav_photos: "Fotoğrafların Kucağı",
    nav_songs: "Gece Şarkıları",
    nav_videos: "Videolar",
    nav_writings: "Boğulma",
    nav_feelings: "Hisler Öldüğünde",
    login_title: "Nafsam",
    login_text: "Bu yer geri sayım tamamlanana kadar kapalı kalır. Her isim kendi vaktini bekler. Sonunda artık sayaç kalmaz... sadece sözler kalır.",
    login_input: "Cevabı yaz",
    login_button: "Kalanı Aç",
    login_hint: "Sayfa süre bitmeden açılmaz. Sonra yalnızca doğru cevapları bilenler açabilir.",
    login_msg_closed: "Geri sayım tamamlanmadan sayfa açılmaz",
    login_msg_wrong: "Cevap yanlış",
    login_msg_success: "Sayfa açılıyor...",
    hero_eyebrow: "NAFSAM • 20 AUG 2025 • 04:04 AM",
    hero_title: "Dört Saat Dört Dakika",
    open_story: "Hikâyeyi Aç",
    read_pain: "Acıyı Oku",
    card_moments_title: "Başlangıçtan İze",
    card_photos_title: "Fotoğrafların Kucağı",
    card_songs_title: "Gece Şarkıları",
    card_writings_title: "Boğulma",
    moments_title: "Başlangıçtan İze",
    photos_title: "Fotoğrafların Kucağı",
    songs_title: "Gece Şarkıları",
    songs_text: "Bir zamanlar sıcaklık olan şarkılar, şimdi hatıraya açık uzun bir gece oldu.",
    videos_title: "Videolar",
    video_memory_label: "Hatıra",
    video1_title: "Video 1",
    video2_title: "Video 2",
    writings_title: "Boğulma",
    typed_1: "Dört saat dört dakika...",
    typed_2: "Sönmeyen bir iz...",
    typed_3: "Her bilmece kendi vaktini bekliyor...",
    typed_4: "Geri sayımdan sonra söz başlar...",
    countdown_label: "Kalan süre: ",
    countdown_day: "gün",
    countdown_hour: "saat",
    countdown_minute: "dakika",
    countdown_second: "saniye",
    riddle_prompt: "Soruyu çöz",
    photos_fallback_caption: "Sessiz bir anı… ama unutulmaz.",
  },
};
