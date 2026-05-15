<template></template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const props = defineProps({
  page: {
    type: String,
    default: 'dashboard'
  },
  storageName: {
    type: String,
    default: 'tour_seen'
  }
});

const { t } = useI18n();
const router = useRouter();

onMounted(() => {
  const hasSeenTour = localStorage.getItem(props.storageName) === 'true';
  const tourActive = localStorage.getItem('finlogic_tour_active') === 'true';
  const currentPhase = localStorage.getItem('finlogic_tour_phase') || 'dashboard';

  // Inject custom CSS for Driver.js
  if (!document.getElementById('driver-custom-style')) {
    const style = document.createElement('style');
    style.id = 'driver-custom-style';
    style.innerHTML = `
      .driver-popover {
        background: #1a1d21 !important;
        color: #fff !important;
        border-radius: 12px !important;
        border: 1px solid rgba(59, 130, 246, 0.3) !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(59, 130, 246, 0.1) !important;
        padding: 20px !important;
        max-width: 350px !important;
      }
      .driver-popover-title {
        color: #3b82f6 !important;
        font-family: 'Outfit', sans-serif !important;
        font-weight: 800 !important;
        font-size: 1.2rem !important;
        margin-bottom: 10px !important;
      }
      .driver-popover-description {
        color: #a0aec0 !important;
        font-size: 0.95rem !important;
        line-height: 1.6 !important;
      }
      .driver-popover-next-btn, .driver-popover-prev-btn, .driver-popover-close-btn {
        background: #3b82f6 !important;
        color: #fff !important;
        border: none !important;
        text-shadow: none !important;
        border-radius: 6px !important;
        font-weight: 700 !important;
        padding: 6px 12px !important;
      }
      .driver-popover-prev-btn {
        background: rgba(255,255,255,0.1) !important;
      }
      .driver-popover-footer { margin-top: 15px !important; }
      .driver-popover-progress-text { color: #4a5568 !important; font-size: 0.8rem !important; }
      .driver-popover-arrow { border-color: #1a1d21 !important; }
    `;
    document.head.appendChild(style);
  }

  if (!hasSeenTour) {
    // Si no lo ha visto nunca (según su storageName específico), lo activamos
    setTimeout(() => startTour(), 800);
  } else if (tourActive && currentPhase === props.page) {
    // Si estamos en un tour multi-pestaña activo (por el botón de reiniciar)
    setTimeout(() => startTour(), 600);
  }
});

function startTour() {
  let steps = [];

  if (props.page === 'dashboard') {
    steps = [
      {
        element: '#tour-nav-dashboard',
        popover: {
          title: t('tour.dashboard.welcome_title'),
          description: t('tour.dashboard.welcome_desc'),
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#tour-kpi',
        popover: {
          title: t('tour.dashboard.kpi_title'),
          description: t('tour.dashboard.kpi_desc'),
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#tour-levers',
        popover: {
          title: t('tour.dashboard.levers_title'),
          description: t('tour.dashboard.levers_desc'),
          side: 'top', align: 'start'
        }
      },
      {
        element: '#tour-chart',
        popover: {
          title: t('tour.dashboard.chart_title'),
          description: t('tour.dashboard.chart_desc'),
          side: 'left', align: 'start'
        }
      },
      {
        element: '#tour-debt',
        popover: {
          title: t('tour.dashboard.debt_title'),
          description: t('tour.dashboard.debt_desc'),
          side: 'top', align: 'start'
        }
      },
      {
        element: '#tour-projection',
        popover: {
          title: t('tour.dashboard.projection_title'),
          description: t('tour.dashboard.projection_desc'),
          side: 'top', align: 'start'
        }
      }
    ];
  } else if (props.page === 'tracking') {
    steps = [
      {
        element: '.view-header',
        popover: {
          title: t('tour.tracking.title'),
          description: t('tour.tracking.desc'),
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '.calendar-section',
        popover: {
          title: t('tour.tracking.calendar_title'),
          description: t('tour.tracking.calendar_desc'),
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '.kpi-grid',
        popover: {
          title: t('tour.tracking.kpi_title'),
          description: t('tour.tracking.kpi_desc'),
          side: 'top', align: 'start'
        }
      },
      {
        element: '.health-wrap',
        popover: {
          title: t('tour.tracking.health_title'),
          description: t('tour.tracking.health_desc'),
          side: 'top', align: 'start'
        }
      },
      {
        element: '.breakdown-wrap',
        popover: {
          title: t('tour.tracking.breakdown_title'),
          description: t('tour.tracking.breakdown_desc'),
          side: 'top', align: 'start'
        }
      }
    ];
  } else if (props.page === 'analytics') {
    steps = [
      {
        element: '#tour-analytics-header',
        popover: {
          title: t('tour.analytics.title'),
          description: t('tour.analytics.desc'),
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#tour-analytics-fee',
        popover: {
          title: t('tour.analytics.fee_title'),
          description: t('tour.analytics.fee_desc'),
          side: "bottom",
          align: 'start'
        }
      },
      {
        element: '#tour-analytics-period',
        popover: {
          title: t('tour.analytics.period_title'),
          description: t('tour.analytics.period_desc'),
          side: "bottom",
          align: 'start'
        }
      },
      {
        element: '#tour-analytics-chart',
        popover: {
          title: t('tour.analytics.chart_title'),
          description: t('tour.analytics.chart_desc'),
          side: 'top', align: 'start'
        }
      },
      {
        element: '#tour-analytics-timeline',
        popover: {
          title: t('tour.analytics.timeline_title'),
          description: t('tour.analytics.timeline_desc'),
          side: 'top', align: 'start'
        }
      }
    ];
  } else if (props.page === 'investments') {
    steps = [
      {
        element: '#tour-investments-header',
        popover: {
          title: t('tour.investments.title'),
          description: t('tour.investments.desc'),
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#tour-investments-chart',
        popover: {
          title: t('tour.investments.chart_title'),
          description: t('tour.investments.chart_desc'),
          side: 'right', align: 'start'
        }
      },
      {
        element: '#tour-investments-positions',
        popover: {
          title: t('tour.investments.list_title'),
          description: t('tour.investments.list_desc'),
          side: 'top', align: 'start'
        }
      },
      {
        element: '#tour-investments-add',
        popover: {
          title: t('investments_page.add_position'),
          description: t('tour.investments.news_desc'),
          side: 'left', align: 'start'
        }
      },
      {
        element: '.news-section-full',
        popover: {
          title: t('tour.investments.news_title'),
          description: t('tour.investments.news_desc'),
          side: 'top', align: 'start'
        }
      }
    ];
  } else if (props.page === 'financial-profile') {
    steps = [
      {
        element: '#tour-fp-header',
        popover: {
          title: t('tour.profile.title'),
          description: t('tour.profile.desc'),
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#tour-fp-income',
        popover: {
          title: t('tour.profile.income_title'),
          description: t('tour.profile.income_desc'),
          side: 'right', align: 'start'
        }
      },
      {
        element: '#tour-fp-expenses',
        popover: {
          title: t('tour.profile.expenses_title'),
          description: t('tour.profile.expenses_desc'),
          side: 'right', align: 'start'
        }
      },
      {
        element: '#tour-fp-debt',
        popover: {
          title: t('tour.profile.debt_title'),
          description: t('tour.profile.debt_desc'),
          side: 'left', align: 'start'
        }
      }
    ];
  }

  const driverObj = driver({
    allowClose: true,
    showProgress: true,
    nextBtnText: t('tour.btn_next'),
    prevBtnText: t('tour.btn_prev'),
    doneBtnText: t('tour.btn_done'),
    steps: steps,
    onDestroyed: () => {
      const isLastPage = props.page === 'financial-profile';
      if (isLastPage || !localStorage.getItem('finlogic_tour_active')) {
        localStorage.removeItem('finlogic_tour_active');
        localStorage.removeItem('finlogic_tour_phase');
        localStorage.setItem(props.storageName, 'true');
      }
    }
  });

  driverObj.drive();
}
</script>