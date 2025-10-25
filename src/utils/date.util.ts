import { DEFAULT_DATE_FORMAT } from '@/constants';
import { logger } from '@/logger';
import { format as formatFn, isValid } from 'date-fns';

export const formatDate = (
  date: string | null,
  outputFormat: string = DEFAULT_DATE_FORMAT
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
