import { useState, useEffect } from "react";
import "./App.css";

export type Category = "Seminer" | "Atölye" | "Söyleşi" | "Yarışma";

export type CampusEvent = {
  id: string;
  title: string;
  category: Category;
  date: string;
  time: string;
  location: string;
  capacity: number;
  description: string;
  image?: string;
};

const events: CampusEvent[] = [
  {
    id: "evt-1",
    title: "Kariyer Günleri 2026",
    category: "Seminer",
    date: "2026-01-15",
    time: "10:30",
    location: "A Blok Konferans Salonu",
    capacity: 200,
    description: "Kariyer planlama ve iş dünyası fırsatları üzerine seminer.",
    image: "https://picsum.photos/seed/kariyer/800/500",
  },
  {
    id: "evt-2",
    title: "Mobil Uygulama Atölyesi",
    category: "Atölye",
    date: "2026-01-18",
    time: "14:00",
    location: "Yazılım Laboratuvarı",
    capacity: 40,
    description: "React Native ile mobil uygulama geliştirme temellerini öğrenin.",
    image: "https://picsum.photos/seed/atolye/800/500",
  },
  {
    id: "evt-3",
    title: "Teknoloji ve Gelecek Söyleşisi",
    category: "Söyleşi",
    date: "2026-01-22",
    time: "16:30",
    location: "Merkez Amfi",
    capacity: 150,
    description: "Yapay zeka ve teknoloji trendleri üzerine uzman söyleşisi.",
    image: "https://picsum.photos/seed/soylesi/800/500",
  },
  {
    id: "evt-4",
    title: "Yazılım Yarışması Finali",
    category: "Yarışma",
    date: "2026-01-27",
    time: "12:00",
    location: "Bilgisayar Mühendisliği Kampüsü",
    capacity: 80,
    description: "Yaratıcı çözümler ve takım çalışması beklenen final etkinliği.",
  },
];

function searchEvents(items: CampusEvent[], searchText: string) {
  const text = searchText.trim().toLowerCase();

  if (!text) {
    return items;
  }

  return items.filter((event) =>
    [event.title, event.category, event.location, event.description].some((value) =>
      value.toLowerCase().includes(text)
    )
  );
}

function filterByCategory(items: CampusEvent[], category: Category | "") {
  if (!category) {
    return items;
  }

  return items.filter((event) => event.category === category);
}

function findEventById(items: CampusEvent[], id: string) {
  return items.find((event) => event.id === id);
}

type PageName = "home" | "events" | "detail" | "add" | "update";

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const selected = selectedId ? findEventById(events, selectedId) : undefined;

  useEffect(() => {
    document.title = selected ? `Kampüs Etkinlikleri - ${selected.title}` : "Kampüs Etkinlikleri";
  }, [selected]);

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
    window.scrollTo(0, 0);
  }

  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2);
  const filtered = filterByCategory(searchEvents(events, searchText), category);

  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        <h2>{event.title}</h2>
        <p className="kategori">{event.category}</p>
        <p><strong>Tarih:</strong> {event.date}, {event.time}</p>
        <p><strong>Yer:</strong> {event.location}</p>
        <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
        <p>{event.description}</p>
        <button onClick={() => go("detail", event.id)}>Detayları gör</button>
      </article>
    );
  }

  return (
    <>
      <header className="site-baslik">
        <h1>Kampüs Etkinlikleri</h1>
        <p>Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.</p>
        <nav className="menu">
          <button onClick={() => go("home")} aria-current={page === "home" ? "page" : undefined}>Ana Sayfa</button>
          <button onClick={() => go("events")} aria-current={page === "events" ? "page" : undefined}>Etkinlikler</button>
          <button onClick={() => go("add")} aria-current={page === "add" ? "page" : undefined}>Ekle</button>
        </nav>
      </header>

      <main>
        {page === "home" && (
          <section className="etkinlik-listesi">
            <h2>Yaklaşan 2 Etkinlik</h2>
            <div className="grid">
              {upcoming.map(renderCard)}
            </div>
            <button className="tumunu-gor" onClick={() => go("events")}>Tüm etkinlikleri gör</button>
          </section>
        )}

        {page === "events" && (
          <section className="etkinlikler-sayfasi">
            <h2>Tüm Etkinlikler</h2>
            <div className="filtreler">
              <input
                type="search"
                placeholder="Etkinlik ara..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <select value={category} onChange={(e) => setCategory(e.target.value as Category | "")}>
                <option value="">Tümü</option>
                <option value="Seminer">Seminer</option>
                <option value="Atölye">Atölye</option>
                <option value="Söyleşi">Söyleşi</option>
                <option value="Yarışma">Yarışma</option>
              </select>
            </div>
            <p>{filtered.length} etkinlik listeleniyor.</p>
            <div className="grid">
              {filtered.map(renderCard)}
            </div>
          </section>
        )}

        {page === "detail" && (
          !selected ? (
            <div className="hata-kutusu">
              <p>Etkinlik bulunamadı.</p>
              <button onClick={() => go("events")}>Listeye dön</button>
            </div>
          ) : (
            <article className="detay">
              <h2>{selected.title}</h2>
              {selected.image && (
                <figure>
                  <img src={selected.image} alt={`${selected.title} afişi`} />
                </figure>
              )}
              <div className="kunye">
                <h3>Etkinlik Künyesi</h3>
                <p><strong>Tarih:</strong> {selected.date}, {selected.time}</p>
                <p><strong>Yer:</strong> {selected.location}</p>
                <p><strong>Kategori:</strong> {selected.category}</p>
                <p><strong>Kontenjan:</strong> {selected.capacity} kişi</p>
              </div>
              <div className="aciklama">
                <h3>Açıklama</h3>
                <p>{selected.description}</p>
              </div>
              <button onClick={() => go("events")}>&larr; Listeye dön</button>
              <button onClick={() => go("update", selected.id)}>Bu etkinliği güncelle</button>
            </article>
          )
        )}

        {(page === "add" || page === "update") && (
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <h2>{page === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}</h2>
            <p className="form-bilgi">Bu sprintte form sadece görünüm; kayıt yapılmaz.</p>
            
            <label htmlFor="title">Etkinlik Adı</label>
            <input id="title" maxLength={80} placeholder="Örn. Kariyer Günleri 2026" />

            <label htmlFor="category">Kategori</label>
            <select id="category">
              <option value="">Seçiniz</option>
              <option value="Seminer">Seminer</option>
              <option value="Atölye">Atölye</option>
              <option value="Söyleşi">Söyleşi</option>
              <option value="Yarışma">Yarışma</option>
            </select>

            <label htmlFor="date">Tarih</label>
            <input id="date" type="date" />

            <label htmlFor="time">Saat</label>
            <input id="time" type="time" />

            <label htmlFor="location">Yer</label>
            <input id="location" placeholder="Örn. A Blok Konferans Salonu" />

            <label htmlFor="capacity">Kontenjan</label>
            <input id="capacity" type="number" />

            <label htmlFor="description">Açıklama</label>
            <textarea id="description" rows={5}></textarea>

            <button type="submit">Kaydet</button>
          </form>
        )}
      </main>

      <footer>
        <p>Deniz Karanfil - 2416501047 - 2026</p>
      </footer>
    </>
  );
}

export default App;