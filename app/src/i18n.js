import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

const savedLocale = localStorage.getItem('finlogic_locale') || 'es';

const i18n = createI18n({
  legacy: false, // Requerido para usar Composition API y $t nativamente en Vue 3
  locale: savedLocale,
  fallbackLocale: 'es',
  globalInjection: true, // Esto inyecta $t en todos los componentes automáticamente
  messages: {
    es,
    en
  }
});

export default i18n;
