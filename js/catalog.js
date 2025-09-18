const MOVIES_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

async function fetchMovies() {
    try {
        let res = await fetch(MOVIES_URL);
        let data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

function buildCatalog(rawArray) {
    let info = (rawArray || []).map(m => ({
        id: Number(m.id),
        title: String(m.title),
        tagline: m.tagline ?? "",
        hasTagline: (m.tagline ?? "").trim().length > 0,
        overview: m.overview ? String(m.overview) : "",
        year: m.release_date ? new Date(m.release_date).getFullYear() : "-",
        runtime: Number(m.runtime),
        votes: Number(m.vote_average),
        budget: Number(m.budget),
        revenue: Number(m.revenue),
        language: String(m.original_language),
        popularity: Number(m.popularity),
        genresID: (m.genres || []).map(g => g.id),
        genres: (m.genres || []).map(g => g.name),
        genresText: (m.genres || []).map(g => g.name).join(" • "),
        genresLower: (m.genres || []).map(g => g.name.toLowerCase()),
        stars: Math.round(m.vote_average / 2),
        searchable: String(
            (m.title || "") + " " +
            (m.tagline || "") + " " +
            (m.overview || "") + " " +
            (m.genres || []).map(g => g.name).join(" ")
        ).toLowerCase(),
    }));
    return info;
};

