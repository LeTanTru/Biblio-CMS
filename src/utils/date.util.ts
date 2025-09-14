import { logger } from '@/logger';
import { format as formatFn, isValid } from 'date-fns';

export const formatDate = (
  date: string | null,
  outputFormat: string = 'dd/MM/yyyy'
) => {
  if (!date) return '';
  try {
    const parsedDate = new Date(date);
    if (!isValid(parsedDate)) return '';
    return formatFn(parsedDate, outputFormat);
  } catch (error) {
    logger.error('Invalid date', date, error);
    return '';
  }
};
