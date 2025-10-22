import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useDivision() {
  const route = useRoute();
  
  // Detectar división desde la ruta y convertir a número
  const division = computed(() => {
    const divParam = route.params.division;
    if (divParam === '1' || divParam === 1) return 1;
    if (divParam === '2' || divParam === 2) return 2;
    return 1; // Por defecto primera división
  });

  const nombreDivision = computed(() => {
    return division.value === 1 ? 'Primera División' : 'Segunda División';
  });

  const divisionSlug = computed(() => {
    return division.value === 1 ? '1' : '2';
  });

  return {
    division,
    nombreDivision,
    divisionSlug
  };
}
