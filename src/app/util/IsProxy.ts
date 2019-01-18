import { environment } from 'src/environments/environment';

export function isProxy(): boolean {
  return environment.proxy === true;
}
