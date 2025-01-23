function loadTranslations() {
    // Get language from page.lang, fallback to 'en' if not set
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const lang = currentLang.toLowerCase().includes('pt') ? 'pt-br' : 
                 currentLang.toLowerCase().includes('es') ? 'es' : 'en';

    // List of JSON files in i18n directory
    const translationFiles = [
        '/i18n/home.json',
        '/i18n/header.json'
        // Add new JSON files here automatically using server-side logic
    ];

    // Load all translation files
    Promise.all(
        translationFiles.map(file => 
            fetch(file)
                .then(response => response.json())
                .catch(error => {
                    console.error(`Error loading ${file}:`, error);
                    return {}; // Return empty object if file fails to load
                })
        )
    )
    .then(results => {
        // Merge all translations from all files
        const translations = results.reduce((acc, data) => {
            return {
                ...acc,
                ...(data[lang] || data['en'])
            };
        }, {});

        // Apply translations
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    })
    .catch(error => console.error('Error loading translations:', error));
}

document.addEventListener('DOMContentLoaded', loadTranslations); 