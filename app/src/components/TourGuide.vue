<template></template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
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

const router = useRouter();

onMounted(() => {
  const hasSeenTour = localStorage.getItem(props.storageName) === 'true';
  if (hasSeenTour) return;

  const tourActive = localStorage.getItem('finlogic_tour_active') === 'true';
  const currentPhase = localStorage.getItem('finlogic_tour_phase') || 'dashboard';

  if (props.page === 'dashboard') {
    // First entry or active redirect
    if (!tourActive && localStorage.getItem(props.storageName) !== 'true') {
      localStorage.setItem('finlogic_tour_active', 'true');
      localStorage.setItem('finlogic_tour_phase', 'dashboard');
      setTimeout(() => startTour(), 600);
    } else if (tourActive && currentPhase === 'dashboard') {
      setTimeout(() => startTour(), 600);
    }
  } else {
    // Other pages during active tour
    if (tourActive && currentPhase === props.page) {
      setTimeout(() => startTour(), 600);
    }
  }
});

function startTour() {
  let steps = [];

  if (props.page === 'dashboard') {
    steps = [
      {
        element: '#tour-sidebar',
        popover: {
          title: 'Menú Lateral',
          description: 'Aquí tienes acceso rápido a todas las herramientas de Finlogic. Puedes contraerlo o expandirlo para tu comodidad.',
          side: 'right',
          align: 'start'
        }
      },
      {
        element: '#tour-nav-dashboard',
        popover: {
          title: 'Dashboard General',
          description: 'Tu centro de mando financiero de un vistazo. Aquí ves tus KPIs principales, simulas presupuestos con palancas en tiempo real y analizas gráficos clave.',
          side: 'right',
          align: 'start'
        }
      },
      {
        element: '#tour-kpi',
        popover: {
          title: 'Tus Métricas Clave',
          description: 'El pulso instantáneo de tus finanzas. Monitoriza tus ingresos, la suma de tus gastos simulados, la capacidad de ahorro neta resultante y tu cojín financiero disponible.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-levers',
        popover: {
          title: 'Palancas de Presupuesto',
          description: '¡Simulador interactivo! Desplaza estas palancas de límites de gasto (comida, ocio, etc.) para ver instantáneamente cómo impactan tus decisiones en tus gastos mensuales y capacidad de ahorro.',
          side: 'top',
          align: 'start'
        }
      },
      {
        element: '#tour-chart',
        popover: {
          title: 'Distribución Mensual',
          description: 'Gráfico interactivo de dona que representa visualmente el destino de tus ingresos: la proporción que consumen tus gastos fijos/variables simulados frente al margen neto que queda libre para el ahorro.',
          side: 'left',
          align: 'start'
        }
      },
      {
        element: '#tour-projection',
        popover: {
          title: 'El Gráfico de Tijera',
          description: '¡La joya de la corona de la previsión! Este gráfico muestra la intersección ("tijera") proyectada a 3 años entre tu deudas restantes (área roja) y tus ahorros acumulados (área verde). Revela el mes exacto en el que tus ahorros superarán a tus deudas.',
          side: 'top',
          align: 'start'
        }
      },
      {
        element: '#tour-debt',
        popover: {
          title: 'Resumen Rápido',
          description: 'Una vista simplificada para que vigiles simultáneamente el saldo pendiente de tus deudas y la valoración total de tu cartera de inversiones sin salir del Dashboard.',
          side: 'top',
          align: 'start'
        }
      },
      {
        element: '#tour-nav-analytics',
        popover: {
          title: 'Siguiente Parada: Analíticas',
          description: 'Haz clic en Siguiente para viajar automáticamente a la sección de Analíticas Avanzadas y continuar la explicación.',
          side: 'right',
          align: 'start'
        },
        onNextClick: () => {
          localStorage.setItem('finlogic_tour_phase', 'analytics');
          router.push('/analytics');
          driverObj.destroy();
        }
      }
    ];
  } else if (props.page === 'analytics') {
    steps = [
      {
        element: '#tour-analytics-header',
        popover: {
          title: 'Analíticas y Previsiones',
          description: '¡Bienvenido a la sección de Analíticas! Aquí planificas tu futuro financiero con proyecciones detalladas.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-analytics-controls',
        popover: {
          title: 'Asignación de Ahorros para Deudas',
          description: 'Establece qué porcentaje de tu capacidad de ahorro mensual vas a destinar a amortizar deudas de forma acelerada.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-analytics-timeline',
        popover: {
          title: 'Línea de Tiempo de Hitos',
          description: 'Sigue un timeline dinámico calculado por el sistema que te predice las fechas en las que saldarás cada deuda y completarás metas financieras.',
          side: 'top',
          align: 'start'
        }
      },
      {
        element: '#tour-nav-investments',
        popover: {
          title: 'Siguiente Parada: Inversiones',
          description: 'Haz clic en Siguiente para navegar automáticamente a la pestaña de Inversiones y continuar la explicación.',
          side: 'right',
          align: 'start'
        },
        onNextClick: () => {
          localStorage.setItem('finlogic_tour_phase', 'investments');
          router.push('/investments');
          driverObj.destroy();
        }
      }
    ];
  } else if (props.page === 'investments') {
    steps = [
      {
        element: '#tour-investments-header',
        popover: {
          title: 'Tu Cartera de Activos',
          description: 'Visualiza la valoración total de tu portafolio consolidado, junto con las variaciones porcentuales de ganancias o pérdidas.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-investments-chart',
        popover: {
          title: 'Distribución de Portafolio',
          description: 'Visualiza la asignación porcentual de tus inversiones clasificada de manera automática entre Acciones (Stocks) y Criptomonedas.',
          side: 'left',
          align: 'start'
        }
      },
      {
        element: '#tour-investments-positions',
        popover: {
          title: 'Posiciones Abiertas',
          description: 'Lista detallada de tus inversiones. Puedes vigilar la variación diaria de 24h, el capital inicial invertido y el valor de mercado actual en tiempo real.',
          side: 'right',
          align: 'start'
        }
      },
      {
        element: '#tour-investments-add',
        popover: {
          title: 'Añadir Activos',
          description: 'Registra nuevas compras de acciones o criptomonedas utilizando el buscador predictivo para rellenar de inmediato los nombres y tickers correctos.',
          side: 'left',
          align: 'start'
        }
      },
      {
        element: '#tour-nav-financial-profile',
        popover: {
          title: 'Última Parada: Perfil Financiero',
          description: 'Haz clic en Siguiente para navegar de forma automática a tu Perfil Financiero y finalizar el tour.',
          side: 'right',
          align: 'start'
        },
        onNextClick: () => {
          localStorage.setItem('finlogic_tour_phase', 'financial-profile');
          router.push('/financial-profile');
          driverObj.destroy();
        }
      }
    ];
  } else if (props.page === 'financial-profile') {
    steps = [
      {
        element: '#tour-fp-header',
        popover: {
          title: 'Tu Perfil Financiero',
          description: '¡Llegamos al centro de datos! Configura aquí los datos de base de tu economía personal para alimentar toda la aplicación.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#tour-fp-income',
        popover: {
          title: 'Ingresos Mensuales',
          description: 'Declara tus ingresos netos fijos y cualquier ingreso adicional u opcional.',
          side: 'right',
          align: 'start'
        }
      },
      {
        element: '#tour-fp-expenses',
        popover: {
          title: 'Gastos Fijos Obligatorios',
          description: 'Desglosa tus costes inevitables como vivienda (hipoteca/alquiler) y suministros (luz, agua, internet).',
          side: 'right',
          align: 'start'
        }
      },
      {
        element: '#tour-fp-debt',
        popover: {
          title: 'Gestor Completo de Deudas',
          description: 'Registra tus préstamos detallando el capital pendiente, las tasas de interés anual y las cuotas mensuales. Servirá para realizar todas las proyecciones.',
          side: 'left',
          align: 'start'
        }
      }
    ];
  }

  const driverObj = driver({
    allowClose: true,
    showProgress: true,
    showButtons: ['close', 'next', 'previous'],
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',
    steps: steps,
    onDestroyed: () => {
      // If destroyed naturally on the last step of the last page, or closed
      const currentPhase = localStorage.getItem('finlogic_tour_phase');
      const isLastStepOfLastPage = props.page === 'financial-profile' && driverObj.getActiveStep() === undefined;
      
      // If we close the tour or finish it completely
      if (props.page === 'financial-profile' || !localStorage.getItem('finlogic_tour_active')) {
        localStorage.removeItem('finlogic_tour_active');
        localStorage.removeItem('finlogic_tour_phase');
        localStorage.setItem(props.storageName, 'true');
      }
    },
    onCloseClick: () => {
      // If closed manually via the "X" or Close button, cancel tour completely
      localStorage.removeItem('finlogic_tour_active');
      localStorage.removeItem('finlogic_tour_phase');
      localStorage.setItem(props.storageName, 'true');
      driverObj.destroy();
    }
  });

  driverObj.drive();
}
</script>