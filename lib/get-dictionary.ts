import 'server-only';

const dictionaries = {
    en: () => import('../dictionaries/en.json').then((module) => module.default),
    de: () => import('../dictionaries/de.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    const l = locale === 'en' || locale === 'de' ? locale : 'de';
    return dictionaries[l]();
};
