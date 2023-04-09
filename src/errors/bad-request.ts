import { ApplicationError } from '@/protocols';

export function badRequest(): ApplicationError {
  return {
    name: 'BadRequest',
    message: 'No result for this search!',
  };
}
