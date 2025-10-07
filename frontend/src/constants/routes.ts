import { Home, FileSpreadsheet, type LucideProps } from 'lucide-react';

export interface AppRoute {
  title: string;
  path: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

export const appRoutes: Record<string, AppRoute> = {
  HOME: { title: 'Home', path: '/', icon: Home },
  FILES: { title: 'Files', path: '/files', icon: FileSpreadsheet },
};
