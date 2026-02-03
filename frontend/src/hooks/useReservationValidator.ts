import { useMemo } from 'react';
import { CommonArea, Reservation, ReservationAvailability } from '@/types/condominium';
import { format, parse, addMinutes, isBefore, isAfter, isSameDay } from 'date-fns';

/**
 * Hook para validação e verificação de disponibilidade de reservas
 * Implementa todas as regras de negócio para o sistema de reservas
 */
export const useReservationValidator = () => {
  /**
   * Verifica se horário de início é válido (dentro do horário de funcionamento)
   */
  const isStartTimeValid = (startTime: string, openTime: string, closeTime: string): boolean => {
    return startTime >= openTime && startTime < closeTime;
  };

  /**
   * Verifica se horário de término é válido (dentro do horário de funcionamento)
   */
  const isEndTimeValid = (endTime: string, openTime: string, closeTime: string): boolean => {
    return endTime > openTime && endTime <= closeTime;
  };

  /**
   * Verifica se o intervalo de tempo respeita a duração máxima permitida
   */
  const isDurationValid = (
    startTime: string,
    endTime: string,
    maxDurationMinutes?: number
  ): { valid: boolean; durationMinutes: number; message?: string } => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    if (durationMinutes <= 0) {
      return {
        valid: false,
        durationMinutes: 0,
        message: 'Hora de término deve ser após a hora de início',
      };
    }

    if (maxDurationMinutes && durationMinutes > maxDurationMinutes) {
      const maxHours = Math.floor(maxDurationMinutes / 60);
      const maxMins = maxDurationMinutes % 60;
      return {
        valid: false,
        durationMinutes,
        message: `Duração máxima: ${maxHours}h${maxMins > 0 ? `${maxMins}m` : ''}`,
      };
    }

    return { valid: true, durationMinutes };
  };

  /**
   * Verifica se existe conflito com outras reservas
   */
  const hasConflict = (
    selectedDate: Date,
    startTime: string,
    endTime: string,
    commonAreaId: string,
    reservations: Reservation[],
    excludeReservationId?: string
  ): { hasConflict: boolean; conflictingReservation?: Reservation } => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const conflict = reservations.find((res) => {
      // Ignorar a própria reserva se for edição
      if (excludeReservationId && res.id === excludeReservationId) {
        return false;
      }

      // Mesma área e data?
      if (res.commonAreaId !== commonAreaId || !isSameDay(res.date, selectedDate)) {
        return false;
      }

      // Ignora reservas não aprovadas (apenas aprovadas ocupam espaço)
      if (res.status !== 'aprovada') {
        return false;
      }

      // Verifica sobreposição de horário
      const resStartTime = res.startTime;
      const resEndTime = res.endTime;

      // Conflito se: nova começa antes de terminar E nova termina depois de começar
      const conflicts = startTime < resEndTime && endTime > resStartTime;

      return conflicts;
    });

    return {
      hasConflict: !!conflict,
      conflictingReservation: conflict,
    };
  };

  /**
   * Verifica se morador atingiu limite de reservas ativas
   */
  const canCreateMoreReservations = (
    requestedBy: string,
    reservations: Reservation[],
    maxReservationsPerResident?: number
  ): { canCreate: boolean; currentCount: number; maxCount?: number } => {
    // Se não definir limite, permite ilimitado
    if (!maxReservationsPerResident) {
      return { canCreate: true, currentCount: 0 };
    }

    const activeReservations = reservations.filter(
      (res) => res.requestedBy === requestedBy && ['solicitada', 'aprovada'].includes(res.status)
    );

    return {
      canCreate: activeReservations.length < maxReservationsPerResident,
      currentCount: activeReservations.length,
      maxCount: maxReservationsPerResident,
    };
  };

  /**
   * Verifica se antecedência mínima foi respeitada
   */
  const meetsMinimumAdvance = (
    reservationDate: Date,
    minAdvanceDays?: number
  ): { meets: boolean; daysInAdvance: number; message?: string } => {
    if (!minAdvanceDays) {
      return { meets: true, daysInAdvance: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + minAdvanceDays);

    const resDate = new Date(reservationDate);
    resDate.setHours(0, 0, 0, 0);

    const daysInAdvance = Math.ceil(
      (resDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (resDate < minDate) {
      return {
        meets: false,
        daysInAdvance,
        message: `Mínimo ${minAdvanceDays} dias de antecedência obrigatório`,
      };
    }

    return { meets: true, daysInAdvance };
  };

  /**
   * Verifica se data está em lista de bloqueados
   */
  const isDateBlocked = (reservationDate: Date, blockedDates?: string[]): boolean => {
    if (!blockedDates || blockedDates.length === 0) {
      return false;
    }

    const dateStr = format(reservationDate, 'yyyy-MM-dd');
    return blockedDates.includes(dateStr);
  };

  /**
   * Validação completa de uma reserva (antes de submeter)
   */
  const validateReservation = (
    selectedDate: Date,
    startTime: string,
    endTime: string,
    commonAreaId: string,
    requestedBy: string,
    area: CommonArea,
    reservations: Reservation[],
    excludeReservationId?: string
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    conflictingReservation?: Reservation;
  } => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let conflictingReservation: Reservation | undefined;

    // 1. Validação de horário de funcionamento
    if (!isStartTimeValid(startTime, area.openTime, area.closeTime)) {
      errors.push(`Início deve estar entre ${area.openTime} e ${area.closeTime}`);
    }

    if (!isEndTimeValid(endTime, area.openTime, area.closeTime)) {
      errors.push(`Término deve estar entre ${area.openTime} e ${area.closeTime}`);
    }

    // 2. Validação de duração
    const durationCheck = isDurationValid(startTime, endTime, area.maxDurationMinutes);
    if (!durationCheck.valid && durationCheck.message) {
      errors.push(durationCheck.message);
    }

    // 3. Validação de antecedência
    const advanceCheck = meetsMinimumAdvance(selectedDate, area.minAdvanceDays);
    if (!advanceCheck.meets && advanceCheck.message) {
      errors.push(advanceCheck.message);
    }

    // 4. Validação de data bloqueada
    if (isDateBlocked(selectedDate, area.blockedDates)) {
      errors.push('Esta data está indisponível');
    }

    // 5. Validação de conflito
    const conflictCheck = hasConflict(
      selectedDate,
      startTime,
      endTime,
      commonAreaId,
      reservations,
      excludeReservationId
    );
    if (conflictCheck.hasConflict && conflictCheck.conflictingReservation) {
      const conflict = conflictCheck.conflictingReservation;
      conflictingReservation = conflict;
      errors.push(
        `Conflito com reserva de ${conflict.requestedByName} (${conflict.startTime}-${conflict.endTime})`
      );
    }

    // 6. Validação de limite de reservas
    const limitCheck = canCreateMoreReservations(requestedBy, reservations, area.maxReservationsPerResident);
    if (!limitCheck.canCreate) {
      errors.push(
        `Limite de ${limitCheck.maxCount} reservas ativas atingido (você tem ${limitCheck.currentCount})`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      conflictingReservation,
    };
  };

  /**
   * Gera slots de disponibilidade para um dia específico
   * Útil para mostrar horários verdes/vermelhos na UI
   */
  const generateAvailableSlots = (
    reservationDate: Date,
    commonAreaId: string,
    area: CommonArea,
    reservations: Reservation[],
    slotDurationMinutes: number = 30
  ): ReservationAvailability => {
    const slots: ReservationAvailability['availableSlots'] = [];

    const [openHour, openMin] = area.openTime.split(':').map(Number);
    const [closeHour, closeMin] = area.closeTime.split(':').map(Number);

    let currentMinutes = openHour * 60 + openMin;
    const endMinutes = closeHour * 60 + closeMin;

    while (currentMinutes < endMinutes) {
      const nextMinutes = currentMinutes + slotDurationMinutes;

      const startTime = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(
        currentMinutes % 60
      ).padStart(2, '0')}`;
      const endTime = `${String(Math.floor(nextMinutes / 60)).padStart(2, '0')}:${String(
        nextMinutes % 60
      ).padStart(2, '0')}`;

      // Verifica se este slot tem conflito
      const conflict = hasConflict(reservationDate, startTime, endTime, commonAreaId, reservations);

      slots.push({
        startTime,
        endTime,
        isAvailable: !conflict.hasConflict,
      });

      currentMinutes = nextMinutes;
    }

    // Contar horários disponíveis
    const totalAvailable = slots.filter(slot => slot.isAvailable).length;

    return {
      areaId: commonAreaId,
      date: reservationDate,
      availableSlots: slots,
      totalAvailable,
    };
  };

  return {
    isStartTimeValid,
    isEndTimeValid,
    isDurationValid,
    hasConflict,
    canCreateMoreReservations,
    meetsMinimumAdvance,
    isDateBlocked,
    validateReservation,
    generateAvailableSlots,
  };
};
