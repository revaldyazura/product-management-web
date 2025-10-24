import PageHeader from '../components/common/PageHeader';
// import { useAuth } from '../context/AuthContext';
import '../styles/pages/HomePage.css';
import SearchIcon from '@mui/icons-material/Search';
import InputField from '../components/form/InputField';

export default function HomePage() {
    // const { user } = useAuth();

    return (
        <div className="home">
            <PageHeader />

            <section className="home__hero">
                <div className="home__hero-content">
                    <h1>Cari Furnitur Impian</h1>
                    <p>Cari furniture mulai dari meja, lemari, hingga rak di sini</p>

                    <div className="home__search">
                        {/* <input type="text" placeholder="Cari produk" /> */}
                        <InputField
                            id="search"
                            label="Cari produk"
                            // placeholder="Cari produk"
                            type='text'
                            fullWidth={true}
                            variant="outlined"
                            transparentOutline
                            labelColor='#111827'
                            focusedLabelColor='#111827'
                        />
                        <button className="home__search-btn" aria-label="search"><SearchIcon></SearchIcon></button>
                    </div>
                </div>
            </section>

            <main className="home__main">
                <div className="home__section-title">
                    <h2>Rekomendasi</h2>
                    <button className="home__link">Lihat Semua Produk</button>
                </div>

                <div className="home__grid">
                    {dummyProducts.map((p) => (
                        <article key={p.id} className="card">
                            <img src={p.image} alt={p.title} className="card__img" />
                            <div className="card__body">
                                <h3 className="card__title">{p.title}</h3>
                                <div className="card__price-row">
                                    <div className="card__price">Rp {p.price.toLocaleString('id-ID')}</div>
                                    {p.discount && <span className="card__badge">{p.discount}%</span>}
                                </div>
                                <div className="card__meta">
                                    <span>⭐ {p.rating}</span>
                                    <span>{p.sold} Terjual</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}

// Bisa diganti dengan data dari API nanti
const dummyProducts = [
    { id: 1, title: 'Meja Makan Kayu Jati - Ukuran besar 100m²', price: 3400000, rating: 4.9, sold: 121, discount: 12, image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200' },
    { id: 2, title: 'Sofa Minimalis - 3 Dudukan', price: 5000000, rating: 4.7, sold: 75, discount: 5, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200' },
    { id: 3, title: 'Meja Kopi Kayu Palet - Vintage', price: 900000, rating: 4.6, sold: 50, discount: 10, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200' },
    { id: 4, title: 'Kursi Santai Rotan - Desain ergonomis', price: 1200000, rating: 4.8, sold: 89, image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1200' },
    { id: 5, title: 'Rak Dinding Modern - Minimalis', price: 750000, rating: 4.5, sold: 30, discount: 0, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200' },
    { id: 6, title: 'Lemari Pakaian Kayu - 2 Pintu', price: 4200000, rating: 4.9, sold: 64, discount: 15, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200' },
    { id: 7, title: 'Lampu Hias Gantung - Retro', price: 1500000, rating: 4.6, sold: 25, discount: 20, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200' },
    { id: 8, title: 'Kursi Makan Kayu - Set 4', price: 2600000, rating: 4.8, sold: 45, discount: 8, image: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200' },
];